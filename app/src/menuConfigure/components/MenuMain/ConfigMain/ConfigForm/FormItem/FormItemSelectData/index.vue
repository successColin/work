<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-数据选择框
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span>
        <slot name="elTilte"></slot>
      </view>
      <view class="elementContent">
        <apiot-select-data
          ref="select"
          :value="list"
          :showFlag="getShowColumnName"
          :placeholder="element.placeholder"
          :multiple="multiple"
          :color="contentColor"
          :isScan="element.labelShowStyle !== 2"
          :canSelect="element.labelShowStyle !== 1"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @clickContent="clickContent"
          @show="showPop"
          @scanSuccess="scanSuccess"
        >
          <SelectDataProp
            v-if="panelConfig && show"
            :menuConfig="panelConfig"
            :value="list"
            :checkFlagId="getRelateColumnName"
            :popTitle="element.dialogTitle || element.name"
            :menuHeight="popHeight"
          ></SelectDataProp>
        </apiot-select-data>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import { selectList, getScanData } from '@/api/menuConfig.js';
import elementMixin from '../elementMixin';

import SelectDataProp from '@/menuConfigure/components/MenuMain/SelectDataProp';

export default {
  inject: [
    'sysMenuDesignId',
    'getPanel',
    'getAllForm',
    'getJumpMenu',
    'resolveFormula',
    'getMenuFlag'
  ],
  components: { SelectDataProp },

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
      panelConfig: null,
      checkList: [],
      show: false
    };
  },

  computed: {
    // 跳转菜单
    jumpMenu() {
      const munuObj = this.getJumpMenu();
      if (!munuObj) return [];
      return this.getJumpMenu()[this.element.compId] || [];
    },
    // 数据选择框内容字体颜色
    contentColor() {
      const { relateType, textPanelId } = this.element;
      const color = this.$store.state.base.themeColor;

      let showColor = '';
      if (relateType === 1 && textPanelId) {
        showColor = color;
      } else if (relateType === 2 && this.jumpMenu.length > 0) {
        showColor = color;
      }
      return showColor;
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
      },
      immediate: true
    }
  },

  methods: {
    showPop(v) {
      this.show = v;
    },
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
      const arr = this.element.textPanelId.split(',');
      const panelArr = [];
      arr.forEach((panelId) => {
        if (panelId && this.getPanel()[panelId]) {
          panelArr.push(this.getPanel()[panelId]);
        }
      });
      const obj = panelArr.find((panel) => {
        if (!panel.jumpTerm) {
          return true;
        }
        const res = this.resolveFormula(true, panel.jumpTerm);
        if (res) {
          return true;
        }
        return false;
      });
      if (obj) {
        const compId = obj.id;
        this.resolveFilterVar(obj, false, compId, true);
      }
    },
    // 点击内容
    clickContent() {
      if (!this.contentColor) return;
      const { relateType } = this.element;
      if (relateType === 1) this.gotoPanel(); // 跳转面板
      else this.gotoMenu(); // 跳转菜单
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
    resolveFilterVar(panelObj, isNoVuex = false, sourceFlagId, canJump = false) {
      if (panelObj) {
        sourceFlagId = `${sourceFlagId || this.element.compId}_${this._uid}`;
        const { id } = panelObj;
        const urlParams = {
          ejectComId: id,
          parentCompId: id,
          parentSysMenuDesignId: this.sysMenuDesignId(),
          menuFlag: this.getMenuFlag()
        };
        this.$store.dispatch('jumpPanel', {
          panel: panelObj,
          sourceFlagId,
          isNoVuex,
          formData: this.getAllForm(),
          canJump,
          urlParams
        });

        return panelObj;
      }
      return null;
    },
    init() {
      const panel = this.resolveFilterVar(this.getPanel()[this.element.compId]);
      if (panel && panel.panelName) {
        this.panelConfig = {
          id: panel.id,
          title: panel.panelName,
          isPanel: true,
          isAdd: true,
          parentCompId: this.element.compId,
          parentSysMenuDesignId: this.sysMenuDesignId(),
          isEject: true,
          canDesign: true,
          panelConfig: `${this.element.compId}_${this._uid}`,
          isSelectDataBox: true,
          isSearch: true,
          multiple: this.multiple,
          sourceFlagId: `${this.element.compId}_${this._uid}`,
          selectDataBoxShowColumnName: this.getShowColumnName,
          selectDataBoxRelateColumnName: this.getRelateColumnName
        };
      }
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
    },
    sureSelect(list, flag) {
      if (this.panelConfig && flag === this.panelConfig.parentCompId) {
        const { element, getRelateColumnName } = this;
        const { selData = [] } = element;
        const arry = []; // 需要通过接口请求
        const listExit = []; // 已经有的列表
        list.forEach((item) => {
          const index = selData.findIndex(
            (data) => `${data[getRelateColumnName]}` === `${item[getRelateColumnName]}`
          );
          if (index === -1) arry.push(item[getRelateColumnName]);
          else listExit.push(selData[index]);
        });
        this.getShowValue(arry.join(), listExit, 'sureSelect');
        // this.handleV(list);
      }
    },
    async scanSuccess(scanCode) {
      try {
        const { element, multiple } = this;
        const { paneObj, compId, multiTable, dataSource } = element;

        if (paneObj) {
          const panel = this.resolveFilterVar(paneObj, true);
          if (panel) {
            const { panelFilter = [] } = panel;
            const compMap = { ...panel.panelVarObj };
            compMap.GET_SCAN_VALUE = scanCode;
            let tableName = '';
            if (multiple) {
              tableName = multiTable.table.tableName;
            } else {
              tableName = dataSource.tableName;
            }
            const params = {
              compId,
              sysMenuDesignId: this.sysMenuDesignId(),
              compMap: JSON.stringify(compMap),
              dataPermissions: false,
              panelFilter,
              dataSource: tableName
            };
            const result = await getScanData(params);
            if (result.length > 0) {
              this.sureSelect([result[0]], this.panelConfig.parentCompId);
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  },

  mounted() {
    this.init();
  },

  created() {
    this.$bus.$on('closePanel', () => {
      if (this.$refs.select) this.$refs.select.closePopup();
    });

    this.$bus.$on('sureSelect', this.sureSelect);
  },

  beforeDestroy() {
    this.$bus.$off('closePanel');
    this.$bus.$off('sureSelect');
  }
};
</script>

<style lang='scss' scoped>
@import '../index.scss';
</style>
