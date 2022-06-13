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
          v-for="(el, index) in elementsShow"
          :key="el.compId"
          :style="{ width: el.width }"
        >
          <form-item-input
            v-if="el.compType === 1 || el.compType === 10"
            :value="configForm[el.compId]"
            :element="el"
            :position="funcConfig.layoutStyle !== 2 ? 'column' : 'row'"
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
            v-else-if="el.compType === 12"
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
          <form-item-iframe
            v-else-if="el.compType === 19"
            :element="el"
          ></form-item-iframe>
          <form-item-text-tip
            v-else-if="el.compType === 20"
            :element="el"
          ></form-item-text-tip>
          <view
            class="grap"
            v-if="
              funcConfig.layoutStyle !== 2 && el.canShow && el.compType !== 20
            "
          ></view>
          <view
            class="hasBorder"
            v-else-if="
              funcConfig.layoutStyle === 2 &&
              index !== currentElementList.length - 1 &&
              topPosEl.indexOf(el.compType) === -1 &&
              el.compType !== 20
            "
          ></view>
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
import FormItemLabel from './FormItem/FormItemLabel.vue';
import FormItemSelect from './FormItem/FormItemSelect.vue';
import FormItemSelectData from './FormItem/FormItemSelectData.vue';
import FormItemRadio from './FormItem/FormItemRadio.vue';
import FormItemDate from './FormItem/FormItemDate.vue';
import FormItemTextarea from './FormItem/FormItemTextarea.vue';
import FormItemUpload from './FormItem/FormItemUpload.vue';
import FormItemUploadcers from './FormItem/FormItemUploadcers.vue';
import FormItemInput from './FormItem/FormItemInput.vue';
import FormItemIframe from './FormItem/FormItemIframe.vue';
import FormItemTextTip from './FormItem/FormItemTextTip.vue';
import compMixin from '../compMixin';
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {
    FormHead,
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
    FormItemTextTip
  },

  mixins: [compMixin, mpMixin],

  inject: ['sysMenuDesignId', 'getMenuPane', 'changeNotValueChange'],

  props: {},

  data() {
    return {
      configForm: {},
      dataVaildForm: {},
      // 需要额外校验的控件，例如输入框，表单校验需要值变化时就校验，而触发器为了性能在失焦时才校验
      vaildElements: [1, 10, 11, 17],
      topPosEl: [11, 12],
      showLoading: false,
      reloadPage: true, // 重新加载刷新界面时会使用
      initPage: true,
      currentElementList: [],
      selElData: {} // 数据选择框选择的数据
    };
  },

  computed: {
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
        console.log('getNewConfigData=======');
        const { configData, selElementList } = this;
        const newConfig = { ...configData };
        const tabs = newConfig.children[0].children;
        const currentTab = tabs.find((item) => item.compId === this.tabId) || {};
        const currentMain = currentTab.children.find((item) => item.compName === 'MenuMain');
        const currentFunc = currentMain.children.find((item) => item.areaType === 1);
        currentFunc.children = selElementList;
        currentFunc.form = data;
        return newConfig;
      };
    },
    allComp() {
      return this.getMenuPane().compObj;
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
    // 表单输入值，触发校验
    dataVaildFormChange(valueObj) {
      this.dataVaildForm = { ...this.dataVaildForm, ...valueObj };
    },
    // 表单值失焦，触发触发器逻辑
    fromDataChange(valueObj, element, selData = []) {
      const { compType, compId } = element;
      // if (this.vaildElements.indexOf(compType) === -1) this.dataVaildFormChange(valueObj);
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
      // this.fileList.push({
      //   name: file.name,
      //   size: file.size,
      //   percentage: 0,
      //   uid: file.uid
      // });
      const formData = new FormData();
      formData.append('files', file.file.path);
      formData.append('menuId', this.htmlConfig.menu);
      const res = await batchUpload(file.file.path);
      return res;

      //
      // formData.append('files', file);
      // formData.append('menuId', this.$route.params.id);
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
        console.log('panelFilter=====================');
        const result = await getSidebarSingle(params);
        console.log('panelFilter=====================1');
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
        if (!`${curentData[key] || ''}`) curentData[key] = form[key];
        if (el.compType === 8 || el.compType === 9) {
          curentData[key] = curentData[key].replace('T', ' ');
        }
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
      const panel = this.panelFilter[compId] || {};
      let hasPanelFilter = false;
      Object.keys(panel).forEach((key) => {
        if (panel[key]) hasPanelFilter = true;
      });

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
        Object.keys(rules).forEach((key) => {
          const ruleArry = rules[key];
          rulesObj[key] = ruleArry.map((rule) => {
            rule.type = rule.type ? rule.type : 'string';
            rule.trigger = ['blur', 'change'];
            return rule;
          });
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
    console.log('表单======================');
    console.log(this.funcConfig);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
@include setFormStyle();
</style>
