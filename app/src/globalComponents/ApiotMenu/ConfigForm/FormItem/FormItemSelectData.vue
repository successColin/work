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
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @clickContent="clickContent"
          @show="showPop"
        >
          <apiot-menu
            v-if="panelConfig && show"
            :menuConfig="panelConfig"
            :value="list"
            :checkFlagId="getRelateColumnName"
            :popTitle="element.dialogTitle || element.name"
            :menuHeight="popHeight"
          ></apiot-menu>
        </apiot-select-data>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import { selectList } from '@/api/menuConfig.js';
import elementMixin from './elementMixin';

export default {
  inject: ['sysMenuDesignId', 'getPanel', 'getAllForm', 'getJumpMenu', 'resolveFormula'],
  components: {},

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
      console.log(`修改=================${newValue}`);
      if (newValue && newValue !== '-1' && !this.showValue) this.getShowValue();
    }
  },

  methods: {
    showPop(v) {
      this.show = v;
    },
    // 点击内容
    clickContent() {
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
          sourceFlagId: `${this.element.compId}_${this._uid}`
        };
      }
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
@import './index.scss';
</style>
