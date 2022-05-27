<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-label
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <section
      class="element formLabel"
      @click.stop="clickContent"
      :style="[fontStyle]"
    >
      <view class="elementLabel" v-if="element.showLabelTitle">
        <span
          class="elementLabel__icon"
          v-if="
            element.enableIcon && (element.icon.icon || element.icon.imageUrl)
          "
          :style="{
            width: `${element.font.size + 2}px`,
            height: `${element.font.size + 2}px`,
          }"
        >
          <label-icon
            :name="element.icon.icon || element.icon.imageUrl"
            :color="element.icon.color"
            customPrefix="iconfont"
            :size="element.font.size + 2"
          ></label-icon>
        </span>
        {{ element.name }}
      </view>
      <view>
        <template v-if="element.enableDict">
          <types-column
            :value="value || ''"
            :typesPropName="element.dataSource.dictObj.dictKey"
            :hornType="element.labelBg.style"
            :size="element.font.size + 6"
            :enableDictIcon="element.enableDictIcon"
          ></types-column>
        </template>
        <template v-else>{{ value }}</template>
      </view>
    </section>
  </u-form-item>
</template>

<script>
import LabelIcon from '../../Common/LabelIcon';
import TypesColumn from '../../Common/TypesColumn';
import { selectList } from '@/api/menuConfig.js';
import elementMixin from './elementMixin';

export default {
  inject: ['sysMenuDesignId', 'getPanel', 'getAllForm', 'getJumpMenu', 'resolveFormula'],
  components: { LabelIcon, TypesColumn },

  mixins: [elementMixin],

  props: {
    // 最长可输入长度
    maxlength: {
      type: Number,
      default: 140
    },
    funcConfig: Object,
    showValue: {
      type: [String, Number, Boolean],
      default: ''
    }
  },

  data() {
    return {
      checkList: []
    };
  },

  computed: {
    // 字体样式
    fontStyle() {
      const { font, labelBg, dataSource, enableDict, enableMultiColumn } = this.element;
      const { size, color, style } = font;
      const { color: bgColor, style: bgStyle } = labelBg;
      const { relateName } = dataSource;
      const fontWeight = style === 1 ? '' : 'bold';
      // 背景样式
      const bgObj = {};
      // 是否为整行的背景，如果不是主表，或者是枚举，或者是多选都不为整行背景
      let showWoleLine = false;
      if (relateName === '主表' && !enableDict && !enableMultiColumn) showWoleLine = true;
      // bgStyle 0-没有背景 1-圆角 2-椭圆
      if (bgStyle !== 0 && showWoleLine) {
        bgObj.backgroundColor = bgColor;
        bgObj.padding = '8rpx 10rpx';
        if (bgStyle === 1) bgObj.borderRadius = '8rpx';
        else if (bgStyle === 2) bgObj.borderRadius = '100px';
      }
      console.log(this.element);
      return {
        fontSize: `${size}px`,
        color,
        fontWeight,
        ...bgObj
      };
    },
    // 跳转菜单
    jumpMenu() {
      const munuObj = this.getJumpMenu();
      if (!munuObj) return [];
      return this.getJumpMenu()[this.element.compId] || [];
    },
    // 数据选择框内容字体颜色
    contentColor() {
      return this.jumpMenu.length > 0 ? this.$store.state.base.themeColor : '';
    },
    list() {
      const { value, showValue } = this;
      if (value) {
        let checkList = [];
        let showValueArry = [];
        if (this.multiple) {
          checkList = value.split(',');
          showValueArry = showValue.split(',');
        } else {
          checkList = [value];
          showValueArry = [showValue];
        }

        return checkList.map((item, index) => {
          const obj = {};
          obj[this.getRelateColumnName] = item;
          obj[this.getShowColumnName] = showValueArry[index];
          return obj;
        });
      }
      return [];
    },
    popHeight() {
      const { windowHeight, customBar } = this.$store.state.base.systemInfo;
      return windowHeight - customBar - 15;
    },
    getRelateColumnName() {
      const relateName = this.element.dataSource.relateName.split('(')[0];
      const index = this.funcConfig.relateTableArr.findIndex(
        (relate) => relate.relateName === relateName
      );
      if (index !== -1) {
        return this.funcConfig.relateTableArr[index].conditionArr[0][0].secondLineColumn.columnName;
      }
      return 'id';
    },
    multiple() {
      return this.element.compType === 7;
    },
    getShowColumnName() {
      if (this.multiple) return this.element.multiTable.column.columnName;
      return this.element.dataSource.columnName;
    }
  },

  watch: {
    value(newValue) {
      const { dataSource } = this.element;
      const { relateName } = dataSource;
      if (relateName !== '主表' && newValue && newValue !== '-1' && !this.showValue) this.getShowValue();
    }
  },

  methods: {
    // 跳转菜单
    gotoMenu() {
      if (this.jumpMenu.length === 0) return;
      const obj = this.jumpMenu.find((menu) => {
        // 根据格式过滤可以跳转的菜单
        if (!menu.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, menu.jumpTerm);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        let menu = this.$store.state.menu.menusObj[obj.id];
        if (menu && !this.$store.state.menu.supper) {
          const canSeePer = menu.permission.find((per) => per.permissionItemId === 1) || {};
          if (canSeePer.check !== '1') menu = null;
        }
        if (menu) {
          obj.menuVarObj = {};
          obj.menuFilter.forEach((item) => {
            if (item.termParams) {
              const arr = item.termParams.split(',');
              obj.menuVarObj[item.compId] = {};
              arr.forEach((compId) => {
                obj.menuVarObj[item.compId][compId] = this.getAllForm()[compId];
              });
            }
          });
          // 不同路由用vuex进行管理
          this.$store.commit('setJumpMenuFilter', {
            sourceFlagId: obj.id,
            data: { ...obj.menuVarObj, menuFilter: obj.menuFilter }
          });
          this.$bus.$emit('clickMenu', menu);
        } else {
          uni.showToast({
            icon: 'none',
            title: '您没有该跳转菜单的权限'
          });
        }
      } else {
        uni.showToast({
          icon: 'none',
          title: '您没有符合条件的菜单'
        });
      }
    },
    // 跳转面板
    gotoPanel() {
      const panel = this.resolveFilterVar(this.getPanel()[this.element.compId]);
      if (panel && panel.panelName) {
        uni.navigateTo({
          url: `/menuConfigure/index?id=${panel.id}&title=${
            panel.panelName
          }&isPanel=true&ejectComId=${this.funcConfig.compId}&parentCompId=${
            this.funcConfig.compId
          }&parentSysMenuDesignId=${this.sysMenuDesignId()}&sourceFlagId=${
            this.funcConfig.compId
          }_${this._uid}&menuFlag=${this.getMenuFlag()}`,
          animationType: 'slide-in-right'
        });
      }
    },
    // 点击内容
    clickContent() {
      console.log('click');
      // relateType 1=面板；2=菜单
      if (this.element.relateType === 1) {
        this.gotoPanel();
      } else {
        this.gotoMenu();
      }
    },
    // 根据id值获取对应数据
    async getShowValue(selValue, listExit = [], type) {
      const { value } = this;
      let selectWhereValue = '';
      // 如果是刚刚选择的
      if (type === 'sureSelect') selectWhereValue = selValue;
      else selectWhereValue = value;

      try {
        let result = [];
        if (selectWhereValue) {
          const { element: comp, multiple } = this;
          let tableName = '';
          if (multiple) {
            tableName = comp.multiTable.table.tableName;
          } else {
            tableName = comp.dataSource.tableName;
          }
          const params = {
            selectContent: '*',
            selectFrom: tableName,
            selectWhere: `${tableName}.id in (${selectWhereValue})`
          };
          result = await selectList(params);
        }

        this.handleV([...result, ...listExit]);
      } catch (error) {
        console.error(error);
      }
    },
    // 处理过滤条件变量为真实值
    resolveFilterVar(panelObj) {
      if (panelObj && panelObj.panelName) {
        const sourceFlagId = `${this.element.compId}_${this._uid}`;
        // 处理面板过滤条件
        panelObj.panelVarObj = {};
        panelObj.panelFilter.forEach((item) => {
          const arr = item.termParams.split(',');
          panelObj.panelVarObj[item.compId] = {};
          arr.forEach((compId) => {
            panelObj.panelVarObj[item.compId][compId] = this.getAllForm()[compId];
          });
        });
        // 不同路由用vuex进行管理
        this.$store.commit('setMenuPanelFilter', {
          sourceFlagId,
          data: { ...panelObj.panelVarObj, panelFilter: panelObj.panelFilter }
        });

        // 处理跳转面板的数据传输
        panelObj.panelDataTrans = {};
        panelObj.panelData.forEach((item) => {
          const { mainComp, paneComp } = item;
          panelObj.panelDataTrans[paneComp.compId] = this.getAllForm()[mainComp.compId];
        });
        this.$store.commit('setMenuPanelDataTrans', {
          sourceFlagId,
          data: panelObj.panelDataTrans
        });

        return panelObj;
      }
      return null;
    },
    handleV(list) {
      const { element, getShowColumnName, getRelateColumnName, multiple } = this;
      const { compId } = element;
      const valueObj = {};
      if (multiple) {
        const arry = [];
        const arry1 = [];
        list.forEach((item) => {
          arry.push(item[getRelateColumnName]);
          arry1.push(item[getShowColumnName]);
        });
        valueObj[compId] = arry.join(',');
        valueObj[`${compId}_`] = arry1.join(',');
      } else {
        valueObj[compId] = `${list[0][getRelateColumnName]}`;
        valueObj[`${compId}_`] = list[0][getShowColumnName];
      }
      this.$emit('change', valueObj, element, list);
      this.checkList = [...list];
    }
  },

  mounted() {},

  created() {},

  beforeDestroy() {}
};
</script>

<style lang='scss' scoped>
.formLabel {
  flex-direction: row !important;
  padding-top: 20rpx !important;
  padding-bottom: 20rpx !important;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
</style>
