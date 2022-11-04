<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-label控件
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view
      class="element normal"
      @click.stop="clickContent"
      :style="[fontStyle]"
      :class="{ hasBgColor: element.labelBg.style !== 0 }"
    >
      <view class="elementLabel" v-if="element.showLabelTitle">
        <span
          class="elementLabel__icon"
          v-if="
            element.enableIcon && (element.icon.icon || element.icon.imageUrl)
          "
        >
          <label-icon
            :name="element.icon.icon || element.icon.imageUrl"
            :color="element.icon.color"
            customPrefix="iconfont"
            :size="labelSize + 2"
          ></label-icon>
        </span>
        <span> {{ element.name }}</span>
      </view>
      <view class="elementContent">
        <template v-if="element.enableDict">
          <types-column
            :value="value | filterValue(showValue, element)"
            :typesPropName="element.dataSource.dictObj.dictKey"
            :hornType="element.labelBg.style"
            :size="element.font.size + 6"
            :enableDictIcon="element.enableDictIcon"
          ></types-column>
        </template>
        <template v-else-if="isSelectData">
          <apiot-select-data
            ref="select"
            :value="list"
            :showFlag="getShowColumnName"
            :placeholder="element.placeholder"
            :multiple="multiple"
            :color="contentColor"
            :disabled="true"
            :readonly="true"
          >
          </apiot-select-data>
        </template>
        <template v-else>
          {{ value | filterValue(showValue, element) }}
        </template>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import { selectList } from '@/api/menuConfig.js';
import LabelIcon from '../../../LabelIcon';
import TypesColumn from './TypesColumn';
import elementMixin from '../elementMixin';

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
      checkList: [],
      realShowValue: ''
    };
  },

  computed: {
    // 是否为数据选择框
    isSelectData() {
      const { dataSource } = this.element;
      const { relateName } = dataSource;
      return relateName !== '主表';
    },
    labelSize() {
      const { font = {} } = this.element;
      const { size = 0 } = font;
      if (size === 0) return this.$apiot.rpx2px(30);
      return size;
    },
    // 字体样式
    fontStyle() {
      const { font, labelBg } = this.element;
      const { size, color, style } = font;
      const { color: bgColor, style: bgStyle } = labelBg;
      // 背景样式
      const bgObj = {};
      if (bgStyle !== 0) {
        bgObj.backgroundColor = bgColor;
        // bgObj.padding = '0';
        if (bgStyle === 1) bgObj.borderRadius = '8rpx';
        else if (bgStyle === 2) bgObj.borderRadius = '100px';
      }

      const config = { color, ...bgObj };
      if (style !== 1) {
        config.fontFamily =
          'PingFangSC-Medium, OPPOSans-Medium, MiSans-Medium,DroidSansFallback, Roboto-Bold';
        config.fontWeight = 600;
      }

      if (size !== 0) config.fontSize = `${size}px`;
      return config;
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
    value: {
      handler(newValue) {
        const { dataSource } = this.element;
        const { relateName } = dataSource;
        if (relateName !== '主表' && newValue && newValue !== '-1' && !this.showValue) this.getShowValue();
        else {
          this.realShowValue = relateName === '主表' ? this.value : this.showValue;
        }
      },
      immediate: true
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
        this.$bus.$emit('clickMenu', {
          menu: { id: obj.id },
          menuFilter: obj.menuFilter,
          formData: this.getAllForm()
        });
      } else {
        uni.showToast({
          icon: 'none',
          title: '您没有符合条件的菜单'
        });
      }
    },
    // 跳转面板
    gotoPanel() {
      this.resolveFilterVar(this.getPanel()[this.element.compId]);
    },
    // 点击内容
    clickContent() {
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
        const { compId: funCompId } = this.funcConfig;
        const urlParams = {
          ejectComId: funCompId,
          parentCompId: funCompId,
          parentSysMenuDesignId: this.sysMenuDesignId(),
          menuFlag: this.getMenuFlag()
        };
        this.$store.dispatch('jumpPanel', {
          panel: panelObj,
          sourceFlagId,
          formData: this.getAllForm(),
          urlParams
        });

        return panelObj;
      }
      return null;
    },
    handleV(list) {
      const { element, getShowColumnName, getRelateColumnName, multiple } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = '';
      valueObj[`${compId}_`] = '';
      if (multiple) {
        const arry = [];
        const arry1 = [];
        list.forEach((item) => {
          arry.push(item[getRelateColumnName]);
          arry1.push(item[getShowColumnName]);
        });
        valueObj[compId] = arry.join(',');
        valueObj[`${compId}_`] = arry1.join(',');
      } else if (list.length > 0) {
        valueObj[compId] = `${list[0][getRelateColumnName]}`;
        valueObj[`${compId}_`] = list[0][getShowColumnName];
      }
      this.$emit('change', valueObj, element, list);
      this.checkList = [...list];
    }
  },

  filters: {
    filterValue(value, showValue, el) {
      const { dataSource, timeShowType, numberShowType } = el;
      if (dataSource.mainColumnInfo) value = showValue;
      // 如果是时间类型的，并且有时间格式
      if (+dataSource.columnTypeDict === 3 && value) {
        if (timeShowType === 1) value = value.toString().slice(0, 10);
        else if (timeShowType === 3) value = value.toString().slice(0, 16);
      }
      // 如果是整数或者小数类型，并且为千分位的
      if ([1, 4].includes(+dataSource.columnTypeDict) && numberShowType === 2) {
        let inputValue = value.toString();
        const index = inputValue.indexOf('.');
        if (index !== -1) {
          const intNum = inputValue.substring(0, index).replace(/\B(?=(?:\d{3})+$)/g, ',');
          const dot = inputValue.substring(index, inputValue.length);
          inputValue = intNum + dot;
        } else {
          inputValue = inputValue
            .substring(0, inputValue.length)
            .replace(/\B(?=(?:\d{3})+$)/g, ',');
        }
        value = inputValue;
      }
      return value;
    }
  },

  mounted() {},

  created() {},

  beforeDestroy() {}
};
</script>

<style lang='scss' scoped>
@import '../index.scss';
.hasBgColor {
  .elementLabel {
    padding-left: 20rpx;
    width: auto !important;
  }
}
.elementLabel {
  display: flex;
  align-items: center;
  &__icon {
    margin-right: 10rpx;
    flex-shrink: 0;
  }
}
.elementContent {
  display: flex;
  align-items: center;
  min-height: $form-el-height;
  margin: 10rpx 0;
  font-size: $form-el-fontSize;
}
.formLabel {
  // padding-top: 20rpx !important;
  // padding-bottom: 20rpx !important;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row !important;
  box-sizing: border-box;
}
</style>
