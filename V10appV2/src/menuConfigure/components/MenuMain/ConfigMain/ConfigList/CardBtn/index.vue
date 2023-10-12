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
          type=""
          size="medium"
          shape="circle"
          btnClass="noSys"
          :hair-line="false"
          :disabled="item.canReadonly"
          :loading="loadingList[item.compId]"
          :custom-style="{
            background: item.iconColor,
            color: item.fontColor,
          }"
          @click="clickBtn(item)"
        >
          <view class="btns__title">
            <i
              v-if="item.buttonForm !== 1 && item.iconFont"
              class="iconfont"
              :class="[
                item.iconFont,
                item.isTheme ? `themeColor__font-${getThemeIndex}` : '',
              ]"
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
import gotoOtherPage from '../../gotoOtherPage';

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
    'resolveFormula',
    'getAllForm'
  ],

  mixins: [gotoOtherPage],

  props: {
    btnObj: Object,
    featureArr: Object,
    // 是否预览
    isPreview: {
      type: Boolean,
      default: false
    }
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
      const { btnInfo } = this;
      if (!munuObj || !btnInfo) return [];
      return munuObj[btnInfo.compId] || [];
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
      const reg = /<messageVar vartype=[$]([A-Za-z0-9]+)>[^<]{0,}<\/messageVar>/g;
      let formData = this.getAllForm();
      formData = { ...formData, ...this.featureArr.form };

      const str = html.replace(reg, (res, v) => {
        if (formData[v]) {
          return formData[v];
        }
        return '';
      });
      return this.$apiot.htmlReplace(str);
    },
    async clickBtn(e) {
      this.btnInfo = e;
      const { buttonType } = e;

      try {
        // 预览状态下不可操作的按钮
        if (this.isPreview && [3, 4].indexOf(buttonType) === -1) {
          this.loadingList[e.compId] = false;
          // 如果在预览模式下，除新增、普通按钮，其他按钮都不走逻辑
          await this.$refs.apiotModal.showAsyncModal({
            content: '预览模式下，除新增、普通按钮，其他按钮不可操作！'
          });
          return false;
        }

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

        // 点击按钮前需要做的校验
        const index = this.btnInfo.ruleArr.findIndex((rule) => {
          const res = this.resolveFormula(true, rule.content);
          if (res) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          const msg = this.btnInfo.ruleArr[index].ruleTip || `按钮第${index}条规则校验失败`;
          this.isLoading = false;
          this.$refs.uToast.show({
            type: 'warning',
            message: msg
          });

          return;
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
          await this.$refs.apiotModal.showAsyncModal({
            content: this.resolveHtml(beforeSubmit.html)
          });
        }

        if (buttonType === 2) {
          await this.delete();
        } else if (buttonType === 3 || buttonType === 4 || buttonType === 5) {
          // 新增、编辑、普通
          this.jumpOther();
        }

        if (this.isPreview) {
          this.loadingList[e.compId] = false;
          // 如果在预览模式下，不进行后端触发器逻辑，以及刷新逻辑
          return false;
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
          this.$refs.uToast.show({
            type: 'success',
            message: this.resolveHtml(afterSubmit.html)
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
        this.loadingList[e.compId] = false;
      } catch (error) {
        console.error(error);
        this.loadingList[e.compId] = false;
      }
    },
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.panelName) {
        return panelObj;
      }
      return null;
    },
    // 跳转到其他界面：面板、菜单、外部链接
    jumpOther() {
      const { relateType, compId, buttonType, textPanelId } = this.btnInfo;
      let formData = this.getAllForm();
      formData = { ...formData, ...this.featureArr.form };
      const sourceFlagId = `${compId}_${this._uid}`;
      if (relateType === 1) {
        // 跳转面板
        const panel = this.getPanel()[compId];
        const urlParams = {
          parentCompId: compId,
          parentSysMenuDesignId: this.sysMenuDesignId(),
          menuFlag: this.getMenuFlag()
        };
        if (buttonType === 3) {
          urlParams.isAdd = true;
        }
        this.panelFormat({
          compId,
          sourceFlagId,
          textPanelId,
          urlParams,
          formData,
          canJump: true
        });
      } else if (relateType === 3) {
        const { outerLink, paramsArr = [] } = this.btnInfo;
        this.gotoWebView({ outerLink, paramsArr, sourceFlagId, formData }); // 跳转地址
      } else {
        // 跳转菜单
        const { jumpMenu } = this;
        this.gotoMenu({
          jumpMenu,
          formData,
          sourceFlagId
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
    height: 88rpx;
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
