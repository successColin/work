<!--
 * @Author: sss
 * @Date: 2022-03-15 11:14:06
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-15 11:14:06
 * @Desc: 高级搜索
-->
<template>
  <view class="form configForm columnForm">
    <!-- {{ elementsShow }} -->
    <u-form ref="highForm" labelPosition="top">
      <div class="configForm__content">
        <div
          class="configForm__content--item"
          v-for="el in elementsShow"
          :key="el.compId"
          :style="{ width: '100%' }"
        >
          <form-item-input
            v-if="el.compType === 1 || el.compType === 10"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          >
            <Condition
              slot="elTilte"
              :value="configForm[`${el.compId}_lambda`]"
              :element="el"
              :conditionStyle="conditionStyle"
              @change="conditionChange"
            ></Condition>
          </form-item-input>
          <form-item-select
            v-else-if="el.compType === 2"
            :value="configForm[el.compId]"
            :element="el"
            :conditionStyle="conditionStyle"
            @change="fromDataChange"
          >
            <Condition
              slot="elTilte"
              :value="configForm[`${el.compId}_lambda`]"
              :element="el"
              :conditionStyle="conditionStyle"
              @change="conditionChange"
            ></Condition>
          </form-item-select>
          <form-item-radio
            v-else-if="el.compType === 3"
            :value="configForm[el.compId]"
            :element="el"
            :conditionStyle="conditionStyle"
            @change="fromDataChange"
          >
            <Condition
              slot="elTilte"
              :value="configForm[`${el.compId}_lambda`]"
              :element="el"
              :conditionStyle="conditionStyle"
              @change="conditionChange"
            ></Condition
          ></form-item-radio>
          <form-item-checkbox
            v-else-if="el.compType === 4"
            :value="configForm[el.compId]"
            :element="el"
            :conditionStyle="conditionStyle"
            @change="fromDataChange"
          >
            <Condition
              slot="elTilte"
              :value="configForm[`${el.compId}_lambda`]"
              :element="el"
              :conditionStyle="conditionStyle"
              @change="conditionChange"
            ></Condition
          ></form-item-checkbox>
          <form-item-select-data
            v-else-if="el.compType === 6 || el.compType === 7"
            :value="configForm[el.compId]"
            :showValue="configForm[`${el.compId}_`]"
            :element="el"
            :conditionStyle="conditionStyle"
            :funcConfig="funcConfig"
            @change="fromDataChange"
          >
            <Condition
              slot="elTilte"
              :value="configForm[`${el.compId}_lambda`]"
              :element="el"
              :conditionStyle="conditionStyle"
              @change="conditionChange"
            ></Condition>
          </form-item-select-data>
          <form-item-textarea
            v-else-if="el.compType === 11"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          >
            <Condition
              slot="elTilte"
              :value="configForm[`${el.compId}_lambda`]"
              :element="el"
              :conditionStyle="conditionStyle"
              @change="conditionChange"
            ></Condition>
          </form-item-textarea>
          <view class="grap"></view>
        </div>
      </div>
    </u-form>
  </view>
</template>

<script>
import FormItemInput from '@/globalComponents/ApiotMenu/ConfigForm/FormItem/FormItemInput.vue';
import FormItemSelect from '@/globalComponents/ApiotMenu/ConfigForm/FormItem/FormItemSelect.vue';
import FormItemSelectData from '@/globalComponents/ApiotMenu/ConfigForm/FormItem/FormItemSelectData.vue';
import FormItemRadio from '@/globalComponents/ApiotMenu/ConfigForm/FormItem/FormItemRadio.vue';
import FormItemTextarea from '@/globalComponents/ApiotMenu/ConfigForm/FormItem/FormItemTextarea.vue';
import FormItemCheckbox from '@/globalComponents/ApiotMenu/ConfigForm/FormItem/FormItemCheckbox.vue';
import Condition from './compenents/Condition.vue';

export default {
  components: {
    FormItemInput,
    FormItemSelect,
    FormItemSelectData,
    FormItemRadio,
    FormItemTextarea,
    FormItemCheckbox,
    Condition
  },

  props: {
    // 功能区
    featureArr: {
      type: [Object, Array]
    }
  },

  data() {
    return {
      configForm: {},
      conditionStyle: {
        marginLeft: '20rpx'
      }
    };
  },

  provide() {
    return {
      sysMenuDesignId: this.getSysMenuDesignId,
      getPanel: this.getMenuPaneObj,
      getAllForm: this.getAllForm,
      getJumpMenu: this.getJumpMenu,
      resolveFormula: this.resolveFormula
    };
  },

  computed: {
    elementsShow() {
      const { children } = this.featureArr;
      console.log(children);
      return children.map((el) => {
        if (el.compType === 15) {
          // 启用字典
          if (el.enableDict) {
            // 字典选择
            el.compType = 4;
          } else if (el.dataSource.relateName === '主表') {
            if (el.enableMultiColumn) {
              // 数据多选框
              el.compType = 7;
            } else if (el.dataSource.columnTypeDict === '3') {
              // 日期时间选择框
              el.compType = 9;
            } else if (el.dataSource.columnTypeDict === '1') {
              // 数字类型
              el.compType = 10;
            } else {
              el.compType = 1;
            }
          } else {
            el.compType = 6;
          }
        }
        return el;
      });
    },
    funcConfig() {
      return this.featureArr.funcConfig;
    }
  },

  methods: {
    resetForm(row) {
      this.configForm = { ...row };
    },
    // 处理公式
    resolveFormula() {
      return true;
    },
    // 表单值失焦
    fromDataChange(valueObj) {
      console.log('fromDataChange');
      this.configForm = { ...this.configForm, ...valueObj };
    },
    // 筛选条件
    conditionChange(condition) {
      const { element: el, value, label } = condition;
      const { compId } = el;
      this.configForm[`${compId}_lambda`] = value;
      this.configForm[`${compId}_lambdaLabel`] = label;
    },
    // 获取用户设计组
    getSysMenuDesignId() {
      return this.featureArr.sysMenuDesignId;
    },
    // 获取面板
    getMenuPaneObj() {
      return this.featureArr.menuPaneObj;
    },
    // 获取跳转菜单
    getJumpMenu() {
      return this.featureArr.menuJumpObj;
    },
    // 获取表单数据池
    getAllForm() {
      return this.getCompMap();
    },
    // 处理所有值给后端
    getCompMap() {
      const obj = { ...this.configForm };
      Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key])) {
          obj[key] = obj[key].join();
        }
      });
      return obj;
    }
  },

  mounted() {},

  created() {
    this.configForm = { ...this.featureArr.form };
  }
};
</script>

<style lang='scss' scoped>
@import '@/globalComponents/ApiotMenu/configForm/index.scss';
@include setFormStyle();
</style>
