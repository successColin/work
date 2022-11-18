<!--
 * @Author: sss
 * @Date: 2021-12-10 17:10:25
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-10 17:10:25
 * @Desc: 配置表单
-->
<template>
  <view
    class="form noLeftForm configForm"
    :class="[funcConfig.layoutStyle !== 2 ? 'columnForm' : 'rowForm']"
    v-if="reloadPage"
  >
    <config-btns
      v-if="funcConfig.pageType === 2 && funcConfig.children.length > 1"
      :tabId="tabId"
      :htmlConfig="htmlConfig"
      :funcConfig="funcConfig"
      :featureArr="featureArr"
    ></config-btns>
    <u-form ref="configForm" :model="dataVaild" labelPosition="top">
      <div class="configForm__content">
        <form-head
          :title="funcConfig.name"
          v-if="funcConfig.showTitle"
        ></form-head>
        <div
          class="configForm__content--item"
          v-for="el in elementsShow"
          :key="el.compId"
          :style="{ width: el.width }"
        >
          <form-item-input
            v-if="el.compType === 1 || el.compType === 10"
            :value="configForm[el.compId]"
            :element="el"
            :position="funcConfig.layoutStyle !== 2 ? 'column' : 'row'"
            :flagComp="getCompId"
            @input="dataVaildFormChange"
            @change="fromDataChange"
          ></form-item-input>
          <form-item-select
            v-else-if="el.compType === 2"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          ></form-item-select>

          <form-item-radio
            v-else-if="el.compType === 3"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          ></form-item-radio>
          <form-item-checkbox
            v-else-if="el.compType === 4"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          ></form-item-checkbox>
          <form-item-select-data
            v-else-if="el.compType === 6 || el.compType === 7"
            :value="configForm[el.compId]"
            :showValue="configForm[`${el.compId}_`]"
            :element="el"
            :funcConfig="funcConfig"
            @change="fromDataChange"
          ></form-item-select-data>
          <form-item-date
            v-else-if="el.compType === 8 || el.compType === 9"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          ></form-item-date>
          <form-item-textarea
            v-else-if="el.compType === 11"
            :value="configForm[el.compId]"
            :element="el"
            @input="dataVaildFormChange"
            @change="fromDataChange"
          ></form-item-textarea>
          <form-item-upload
            v-else-if="el.compType === 12 || el.compType === 24"
            :value="configForm[el.compId]"
            :element="el"
            :menuId="htmlConfig.id"
            @change="fromDataChange"
          ></form-item-upload>
          <form-item-uploadcers
            v-else-if="el.compType === 14"
            :value="configForm[el.compId]"
            :element="el"
            :menuId="htmlConfig.id"
            @change="fromDataChange"
          ></form-item-uploadcers>
          <form-item-label
            v-else-if="el.compType === 15"
            :value="configForm[el.compId]"
            :showValue="configForm[`${el.compId}_`]"
            :element="el"
            :funcConfig="funcConfig"
            @change="fromDataChange"
          ></form-item-label>
          <form-item-input
            v-else-if="el.compType === 17"
            :value="configForm[el.compId]"
            :element="el"
            @input="dataVaildFormChange"
            @change="fromDataChange"
          ></form-item-input>
          <form-item-divider
            v-else-if="el.compType === 18"
            :element="el"
            :layout="funcConfig.layoutStyle !== 2 ? 'column' : 'row'"
          ></form-item-divider>
          <form-item-iframe
            v-else-if="el.compType === 19"
            :element="el"
          ></form-item-iframe>
          <form-item-text-tip
            v-else-if="el.compType === 20"
            :element="el"
          ></form-item-text-tip>
          <form-item-rate
            v-else-if="el.compType === 23"
            :value="configForm[el.compId]"
            :element="el"
            @input="dataVaildFormChange"
            @change="fromDataChange"
          ></form-item-rate>

          <form-item-cascade
            v-else-if="el.compType === 25"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          ></form-item-cascade>

          <form-item-swiper
            v-else-if="el.compType === 26"
            :element="el"
          ></form-item-swiper>
          <form-item-users
            v-else-if="el.compType === 28"
            :value="configForm[el.compId]"
            :element="el"
            @change="fromDataChange"
          ></form-item-users>

          <form-item-step-bar
            v-else-if="el.compType === 27"
            :element="el"
            :flagComp="getCompId"
            :configForm="configForm"
          ></form-item-step-bar>
        </div>
      </div>
    </u-form>
    <config-btns
      ref="btns"
      v-if="funcConfig.pageType === 3"
      :tabId="tabId"
      :htmlConfig="htmlConfig"
      :funcConfig="funcConfig"
      :featureArr="featureArr"
    ></config-btns>
  </view>
</template>

<script>
import { batchUpload, getSidebarSingle } from '@/api/menuConfig';
import ConfigBtns from '../ConfigBtns';

import FormHead from './FormHead';
import FormItemDivider from './FormItem/FormItemDivider';
import FormItemLabel from './FormItem/FormItemLabel';
import FormItemSelect from './FormItem/FormItemSelect';
import FormItemSelectData from './FormItem/FormItemSelectData';
import FormItemRadio from './FormItem/FormItemRadio';
import FormItemDate from './FormItem/FormItemDate';
import FormItemTextarea from './FormItem/FormItemTextarea';
import FormItemUpload from './FormItem/FormItemUpload';
import FormItemUploadcers from './FormItem/FormItemUploadcers';
import FormItemInput from './FormItem/FormItemInput';
import FormItemIframe from './FormItem/FormItemIframe';
import FormItemTextTip from './FormItem/FormItemTextTip';
import FormItemRate from './FormItem/FormItemRate';
import FormItemCascade from './FormItem/FormItemCascade';
import FormItemSwiper from './FormItem/FormItemSwiper';
import FormItemCheckbox from './FormItem/FormItemCheckbox';
import FormItemStepBar from './FormItem/FormItemStepBar';
import FormItemUsers from './FormItem/FormItemUsers';

import compMixin from '../compMixin';
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {
    FormHead,
    FormItemDivider,
    ConfigBtns,
    FormItemInput,
    FormItemLabel,
    FormItemSelect,
    FormItemRadio,
    FormItemDate,
    FormItemSelectData,
    FormItemTextarea,
    FormItemUpload,
    FormItemUploadcers,
    FormItemIframe,
    FormItemTextTip,
    FormItemRate,
    FormItemCascade,
    FormItemSwiper,
    FormItemCheckbox,
    FormItemStepBar,
    FormItemUsers
  },

  mixins: [compMixin, mpMixin],

  inject: ['sysMenuDesignId', 'changeNotValueChange', 'resolveFormula'],

  props: {},

  provide() {
    return {
      getFormScreenHeight: this.getScreenHeight
    };
  },

  data() {
    return {
      configForm: {},
      dataVaildForm: {},
      // 需要额外校验的控件，例如输入框，表单校验需要值变化时就校验，而触发器为了性能在失焦时才校验
      vaildElements: [1, 10, 11, 17],
      topPosEl: [11, 12],
      showLoading: false,
      reloadPage: false, // 重新加载刷新界面时会使用
      initPage: true,
      currentElementList: [],
      selElData: {} // 数据选择框选择的数据
    };
  },

  computed: {
    // ID对应的控件
    getCompId() {
      const { elementList } = this;
      return elementList.find((item) => item.name === 'id') || '';
    },
    // 用于表单校验
    dataVaild() {
      const { dataVaildForm, elementList } = this;
      const { rules } = this.functionArea;
      const vaildData = {};
      Object.keys(rules).forEach((key) => {
        vaildData[key] = dataVaildForm[key];
        const comp = elementList.find((el) => el.compId === key);
        if (comp && [6].indexOf(comp.compType) !== -1) {
          vaildData[key] = `${dataVaildForm[key]}`;
        }
      });
      return vaildData;
    },
    getNewConfigData() {
      return function (data) {
        const { configData, selElementList } = this;
        const newConfig = { ...configData };
        const tabs = newConfig.children[0].children;
        const currentTab = tabs.find((item) => item.compId === this.tabId) || {};
        const currentMain = currentTab.children.find(
          (item) => item.compName === 'MenuMain' && item.compId === this.funcConfig.compId
        );
        const currentFunc = currentMain.children.find((item) => item.areaType === 1);
        currentFunc.children = selElementList;
        currentFunc.form = data;
        return newConfig;
      };
    },
    // 添加数据选择框选择的数据的控件列表
    selElementList() {
      const { selElData, elementList } = this;
      return elementList.map((el) => {
        if (el.compType === 6 || el.compType === 7) el.selData = selElData[el.compId] || [];
        return el;
      });
    },
    // 筛选出显示的控件
    elementsShow() {
      const { elementList, allComp } = this;
      return elementList.map((el) => {
        const comp = allComp[el.compId] || {};
        return { ...el, ...comp };
      });
    },
    // 筛选区需要不重复的组件
    elementNoRepeat() {
      return this.elementsShow.filter((el) => el.shouldRepeat) || [];
    },
    featureArr() {
      return {
        form: this.configForm,
        children: this.elementList
      };
    }
  },

  watch: {
    configForm(newValue) {
      this.$emit('update:configData', this.getNewConfigData(newValue));
    }
  },

  methods: {
    // 回填表单id
    loadAddId(res) {
      const { listInfo = [] } = res;
      if (listInfo.length === 0) return;

      const info = listInfo[0];
      const idVal = info.find((item) => item.columnName === 'id');
      if (!idVal || !idVal.columnValue) return;
      const { getCompId: element } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = idVal.columnValue;
      this.fromDataChange(valueObj, element);
    },
    // 获取可以显示内容的区域高度
    getScreenHeight() {
      // 判断表单是横向排的，还是竖向的
      let otherHeigt = 0;
      if (this.funcConfig.layoutStyle === 2) otherHeigt = this.$apiot.rpx2px(20);
      else otherHeigt = this.$apiot.rpx2px(10);
      return this.computedHeight - otherHeigt;
    },
    // 表单输入值，触发校验
    dataVaildFormChange(valueObj) {
      this.dataVaildForm = { ...this.dataVaildForm, ...valueObj };
    },
    // 表单值失焦，触发触发器逻辑
    fromDataChange(valueObj, element, selData = []) {
      const { compType, compId } = element;
      // 如果是数据选择框
      if (compType === 6 || compType === 7) {
        const obj = {};
        obj[compId] = selData;
        this.selElData = { ...this.selElData, ...obj };
      }
      this.configForm = { ...this.configForm, ...valueObj };
      this.dataVaildForm = { ...this.configForm };
    },
    // 文件上传
    async doUpload(file) {
      const formData = new FormData();
      formData.append('files', file.file.path);
      formData.append('menuId', this.htmlConfig.menu);
      const res = await batchUpload(file.file.path);
      return res;
    },
    // 获取表单数据
    async getForm() {
      this.showLoading = true;
      try {
        const { compId } = this.funcConfig;
        const { isPanel, isJump, isProcess, parentCompId, parentSysMenuDesignId } = this.htmlConfig;
        const params = {
          compId,
          sysMenuDesignId: this.sysMenuDesignId(),
          compMap: JSON.stringify(this.getFilterParams() || {})
        };
        if (isPanel) {
          params.panelCompId = parentCompId;
          params.relationMenuDesignId = parentSysMenuDesignId;
          params.panelFilter = this.getPanelFilter() || [];
        }

        // 如果是跳转菜单
        if (isJump === '1') {
          const jumpMenuFilter = this.getJumpMenuFilter() || [];
          const { panelFilter = [] } = params;
          params.panelFilter = [...panelFilter, ...jumpMenuFilter];
        }

        // 如果是流程跳转面板
        if (isProcess) {
          const { tableInfo } = this.funcConfig;
          const { workflowDataId } = this.htmlConfig;
          params.workflowFilter = `${tableInfo.tableName}.id=${workflowDataId}`;
        }
        const result = await getSidebarSingle(params);
        return result;
      } catch (error) {
        console.error(error);
      }
    },
    async resolveFormData(formData = {}, type) {
      const { elementList } = this;
      const { form, compId } = this.functionArea;
      const { sourceFlagId } = this.htmlConfig;
      const panelDataTrans = this.$store.state.menu.panelDataTrans[sourceFlagId] || {};
      const curentData = { ...formData };
      elementList.forEach((el) => {
        const key = el.compId;
        // 如果是外联组件
        if (el.compType === 19) return false;
        // 数据传递
        if (panelDataTrans[key]) curentData[key] = panelDataTrans[key];

        // 如果值为空
        if (!`${curentData[key] || ''}`) {
          const { defaultValueType, formulaContent, defaultType, compType } = el;
          // 默认值是否为公式
          if (defaultValueType === 2 && formulaContent) {
            curentData[key] = this.resolveFormula(true, el.formulaContent);
          } else if ([8, 9].indexOf(compType) !== -1) {
            console.log('时间========================');
            console.log(form[key]);
            if (defaultType === 1) {
              // 默认当前时间
              curentData[key] = this.$apiot.dateFormat('', compType === 9 ? '' : 'yyyy-MM-dd');
            } else curentData[key] = form[key].replace('T', ' ');
          } else curentData[key] = form[key];
        }

        if (el.compType === 10) curentData[key] = `${curentData[key]}`;
        // if (el.compType === 8 || el.compType === 9) {
        //   curentData[key] = curentData[key].replace('T', ' ');
        // }
      });
      this.$emit('update:configData', this.getNewConfigData(curentData));

      await this.$emit('handleTrgger', {
        triggerType: 1,
        elementList,
        pageType: type,
        funId: this.funcConfig.compId // 功能区的唯一标识
      });
      this.configForm = this.getMenuPane().formObj[compId].form;
      this.dataVaildForm = { ...this.configForm }; // 为了兼容表单验证逻辑
      this.hangdleLoadFinsh(this.funcConfig.compId);
    },
    // 加载完成后触发其他区域进行加载
    hangdleLoadFinsh(funId) {
      this.$nextTick(() => {
        this.$bus.$emit('reloadArea', funId);
      });
    },
    async init(type) {
      this.reloadPage = false;

      const { filterTermSql, filterTermStr, compId } = this.funcConfig;
      let hasPanelFilter = false;
      if (compId in this.panelFilter) hasPanelFilter = true;

      let data = {};
      // 表单控件，如果没有过滤条件，则不请求接口
      // 如果是从流程中跳转过来地，则默认请求逻辑
      const { isProcess } = this.htmlConfig;
      // eslint-disable-next-line max-len
      if (hasPanelFilter || filterTermSql || filterTermStr || isProcess) data = await this.getForm();
      await this.resolveFormData(data, type);
      this.reloadPage = true;
      this.$nextTick(() => {
        const { rules } = this.functionArea;
        const rulesObj = {};

        // 不能重复的控件

        Object.keys(rules).forEach((key) => {
          const ruleArry = rules[key];
          const comp = this.allComp[key];
          const { canShow, shouldRepeat } = comp;

          // let ruleType
          // if( compType === 10)
          rulesObj[key] = ruleArry.map((rule) => {
            if (rule.flag && rule.flag === 'maxAndMin') {
              let min = 0;
              let max = 999999;
              if (rule.max && rule.max !== '0') max = +rule.max;
              if (rule.min && rule.min !== '0') min = +rule.min;
              rule.max = max;
              rule.min = min;
            }

            rule.type = rule.type ? rule.type : 'string';
            rule.trigger = ['blur', 'change'];
            return rule;
          });

          // 不能重复控件
          if (canShow && shouldRepeat) {
            rulesObj[key].push({
              validator: () => {
                const currentComp = this.elementsShow.find((el) => el.compId === key);
                return !currentComp.notUnique;
              },
              message: '不能重复'
            });

            // const { dataSource, name } = comp;
            // rulesObj[key].push({
            //   trigger: ['blur'],
            //   asyncValidator: (rule, value, callback) => {
            //     getColumnUniqueness({
            //       columnName: dataSource.columnName,
            //       columnTypeDict: dataSource.columnTypeDict,
            //       columnValue: value,
            //       id: this.configForm[this.getCompId],
            //       tableName: dataSource.tableName
            //     })
            //       .then((res) => {
            //         if (res > 0) {
            //           callback(new Error(`${name}已存在`));
            //         } else {
            //           callback();
            //         }
            //       })
            //       .catch((error) => {
            //         callback(new Error(error));
            //       });
            //   }
            // });
          }
        });
        this.$refs.configForm.setRules(rulesObj);
      });
    },
    reloadData() {
      this.init('reloadData');
    }
  },

  mounted() {
    // this.$refs.configForm.setRules(this.rules);
    this.init();
  },

  created() {
    // 设置监听
    this.$bus.$on(`loadAddId_${this.funcConfig.compId}`, this.loadAddId);
  },

  beforeDestroy() {
    this.$bus.$off(`loadAddId_${this.funcConfig.compId}`);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
@include setFormStyle();
</style>
