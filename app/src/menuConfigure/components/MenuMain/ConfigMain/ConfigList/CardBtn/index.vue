<!--
 * @Author: sss
 * @Date: 2022-04-15 11:20:55
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-15 11:20:55
 * @Desc: 卡片区按钮
-->
<template>
  <section class="cardBtn">
    <div class="cardBtn__area">
      <view v-for="item in btnList" :key="item.compId" class="btns__item">
        <apiot-button
          type="primary"
          size="medium"
          shape="circle"
          btnClass="noSys"
          :hair-line="false"
          :disabled="item.canReadonly"
          :loading="loadingList[item.compId]"
          @click="clickBtn(item)"
        >
          <view class="btns__title">
            <i
              v-if="item.buttonForm !== 1 && item.iconFont"
              class="iconfont"
              :class="[item.iconFont]"
            ></i>
            <span class="btns__name">{{ item.name }}</span>
          </view>
        </apiot-button>
      </view>
    </div>
    <apiot-modal ref="apiotModal"></apiot-modal>
    <u-toast ref="uToast"></u-toast>
  </section>
</template>

<script>
import { batchDelete } from '@/api/menuConfig';

export default {
  components: {},

  inject: [
    'parentConfig',
    'panelConfig',
    'getPanel',
    'sysMenuDesignId',
    'getMenuFlag',
    'onlyFlag',
    'munuOnlyFlag',
    'clickTrigger',
    'getJumpMenu',
    'resolveFormula'
  ],

  props: {
    btnObj: Object,
    featureArr: Object
  },

  data() {
    return {
      btnInfo: null,
      // 需要显示loading框的按钮
      loadingList: {}
    };
  },

  computed: {
    // 跳转菜单
    jumpMenu() {
      const munuObj = this.getJumpMenu();
      if (!munuObj) return [];
      return munuObj[this.btnInfo.compId] || [];
    },
    btnList() {
      return this.btnObj.children;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    resolveHtml(html) {
      const reg = /[$]\{([A-Za-z0-9]+)\}/g;
      const str = html.replace(reg, (res) => {
        if (this.featureArr.form[res.slice(2, 8)]) {
          return this.featureArr.form[res.slice(2, 8)];
        }
        return '';
      });
      return str;
    },
    async clickBtn(e) {
      this.btnInfo = e;
      const { buttonType } = e;
      try {
        // 不可以配置在操作区的按钮
        const canotCofig = {
          1: '保存',
          6: '确定',
          9: '批量删除',
          10: '批量普通'
        };
        if (buttonType in canotCofig) {
          await this.$refs.apiotModal.showAsyncModal({
            content: `操作区不能配置${canotCofig[buttonType]}按钮，请联系配置管理员`
          });
          return false;
        }

        const obj = {};
        obj[e.compId] = true;
        this.loadingList = { ...this.loadingList, ...obj };

        const { beforeSubmit, afterSubmit, name, refreshType } = e;

        // 提交前提示
        if (beforeSubmit.type === 2) {
          await this.$refs.apiotModal.showAsyncModal({
            content: `是否${name}`
          });
        } else if (beforeSubmit.type === 3) {
          const tipContent = this.$apiot.htmlReplace(beforeSubmit.html);
          await this.$refs.apiotModal.showAsyncModal({
            content: this.resolveHtml(tipContent)
          });
        }

        if (buttonType === 2) {
          await this.delete();
        } else if (buttonType === 3 || buttonType === 4 || buttonType === 5) {
          // 新增、编辑、普通
          this.jumpOther();
        }

        // 后端触发器
        await this.clickTrigger(
          this.btnInfo,
          this.onlyFlag(),
          this.featureArr.form,
          this.featureArr.formId
        );

        // 提交后提醒
        if (afterSubmit.type === 2) {
          this.$refs.uToast.show({
            type: 'success',
            message: `${name}成功`
          });
        } else if (afterSubmit.type === 3) {
          const tipContent = this.$apiot.htmlReplace(afterSubmit.html);
          this.$refs.uToast.show({
            type: 'success',
            message: this.resolveHtml(tipContent)
          });
        }

        // 成功后刷新逻辑
        // eslint-disable-next-line no-undef
        const pages = getCurrentPages(); // 当前页面

        let currentPage = pages[pages.length - 1];
        let beforePage = pages[pages.length - 2]; // 上一页
        // #ifdef APP-PLUS
        currentPage = currentPage.$vm;
        beforePage = beforePage.$vm;
        // #endif
        this.loadingList[e.compId] = false;
        if (refreshType === 1) {
          currentPage.forceUpdate(); // 刷新当前页
        } else if (refreshType === 2) {
          // 弹出关闭当前页
          if (!this.panelConfig.isEject) uni.navigateBack();
          else this.$bus.$emit('closePanel');
        } else if (refreshType === 3) {
          // 关闭当前页并刷新上一页
          uni.navigateBack({
            success() {
              // 如果上一页是工作台
              if (beforePage.pageType !== 'home') beforePage.forceUpdate();
            }
          });
        } else if (refreshType === 4) {
          const menu = this.munuOnlyFlag();
          // 刷新菜单
          // 当前界面就是菜单，则刷新本菜单
          if (currentPage._uid === menu) {
            currentPage.forceUpdate();
            return;
          }
          const menuPageIndex = pages.findIndex((page) => page._uid === menu);
          if (menuPageIndex !== -1) {
            const menuPage = pages[menuPageIndex];
            uni.navigateBack({
              delta: menuPageIndex + 1,
              success() {
                // 如果上一页是工作台
                if (menuPage.pageType !== 'home') menuPage.forceUpdate();
              }
            });
          }
        }
      } catch (error) {
        console.error(error);
        this.loadingList[e.compId] = false;
      }
    },
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.panelName) {
        const { buttonType, compId } = this.btnInfo;
        const sourceFlagId = `${compId}_${this._uid}`;

        const urlParams = {
          parentCompId: compId,
          parentSysMenuDesignId: this.sysMenuDesignId(),
          menuFlag: this.getMenuFlag()
        };
        if (buttonType === 3) {
          urlParams.isAdd = true;
        }

        this.$store.dispatch('jumpPanel', {
          panel: panelObj,
          sourceFlagId,
          formData: this.featureArr.form,
          urlParams
        });

        return panelObj;
      }
      return null;
    },
    // 跳转到其他界面：面板、菜单、外部链接
    jumpOther() {
      const { relateType, compId } = this.btnInfo;
      if (relateType === 1) this.gotoPanel(compId); // 跳转面板
      else if (relateType === 3) this.gotoWebView(); // 跳转地址
      else this.gotoMenu(); // 跳转菜单
    },
    // 跳转外部地址
    gotoWebView() {
      const { outerLink, paramsArr = [], compId } = this.btnInfo;
      if (!outerLink) return;
      const urlParams = {};
      paramsArr.forEach((param) => {
        const { type, name, fixed, formula } = param;
        let value = fixed;
        if (type === 2) {
          value = this.resolveFormula(true, formula);
        }
        urlParams[name] = value;
      });
      const sourceFlagId = `${compId}_${this._uid}`;
      this.$store.dispatch('jumpOuterLink', {
        sourceFlagId,
        outerLink,
        urlParams
      });
    },
    // 跳转菜单
    gotoMenu() {
      if (this.jumpMenu.length === 0) return;
      const formData = this.featureArr.form;
      const obj = this.jumpMenu.find((menu) => {
        // 根据格式过滤可以跳转的菜单
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm, formData);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        this.$bus.$emit('clickMenu', {
          menu: { id: obj.id },
          menuFilter: obj.menuFilter,
          formData
        });
      } else {
        uni.showToast({
          icon: 'none',
          title: '您没有符合条件的菜单'
        });
      }
    },
    // 跳转面板
    gotoPanel(compId) {
      const panel = this.getPanel()[compId];
      if (panel) {
        this.resolveFilterVar(panel);
      }
    },

    // 跳转面板
    gotoPanel1() {
      const panel = this.resolveFilterVar(this.getPanel()[this.btnInfo.compId]);
      if (panel && panel.panelName) {
        uni.navigateTo({
          url: `/menuConfigure/index?id=${panel.id}&title=${
            this.btnInfo.dialogTitle || panel.panelName
          }&isPanel=true&isAdd=true&parentCompId=${
            this.btnInfo.compId
          }&parentSysMenuDesignId=${this.sysMenuDesignId()}&sourceFlagId=${this.btnInfo.compId}_${
            this._uid
          }&menuFlag=${this.getMenuFlag()}`,
          animationType: 'slide-in-right'
        });
      }
    },
    // 删除
    async delete() {
      const params = {
        ids: '',
        tableName: this.parentConfig.tableInfo.tableName,
        userId: this.$store.state.userCenter.userInfo.id,
        menuId: this.getMenuFlag()
      };
      Object.keys(this.featureArr.children).findIndex((key) => {
        const comp = this.featureArr.children[key];
        if (comp.dataSource && comp.dataSource.columnName === 'id') {
          let columnValue = '';
          const { form } = this.featureArr;
          columnValue = form[comp.compId] == null ? '' : form[comp.compId];
          params.ids = columnValue;
          return true;
        }
        return false;
      });

      if (params.ids) {
        await batchDelete(params);
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.cardBtn {
  padding: 0 30rpx;
  &__area {
    height: 98rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .btns__item {
      flex-shrink: 0;
      // width: 134rpx;
      height: 52rpx;
      margin-right: 20rpx;
      &:last-child {
        margin: 0;
      }
      .btns__title {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        i {
          margin-right: 6rpx;
          font-size: 28rpx;
        }
      }
    }
  }
}
</style>
