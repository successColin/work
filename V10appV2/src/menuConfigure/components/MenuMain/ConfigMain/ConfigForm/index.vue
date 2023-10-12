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
  >
    <template v-if="reloadPage">
      <config-btns
        v-if="isShowBtnTop"
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
            @click="showContent = !showContent"
          ></form-head>
          <div
            class="itemContents"
            :style="{ display: showContent ? 'block' : 'none' }"
          >
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
                :isPreview="!!htmlConfig.isPreview"
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
              <!-- <form-item-upload
            v-else-if="el.compType === 12 || el.compType === 24"
            :value="configForm[el.compId]"
            :element="el"
            :menuId="htmlConfig.id"
            @change="fromDataChange"
          ></form-item-upload> -->
              <form-item-upload-files
                v-else-if="
                  el.compType === 12 || el.compType === 13 || el.compType === 24
                "
                :value="configForm[el.compId]"
                :element="el"
                :menuId="htmlConfig.id"
                @change="fromDataChange"
              ></form-item-upload-files>
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
                :isFirst="index === 0"
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
              <form-item-richtext
                v-else-if="el.compType === 21"
                :value="configForm[el.compId]"
                :element="el"
              ></form-item-richtext>
              <form-item-progress-bar
                v-else-if="el.compType === 22"
                :element="el"
                :value="configForm[el.compId]"
              ></form-item-progress-bar>
              <form-item-rate
                v-else-if="el.compType === 23"
                :value="configForm[el.compId]"
                :element="el"
                @input="dataVaildFormChange"
                @change="fromDataChange"
              ></form-item-rate>
              <form-item-cascade
                v-else-if="el.compType === 25 || el.compType === 30"
                :value="configForm[el.compId]"
                :element="el"
                @change="fromDataChange"
              ></form-item-cascade>
              <form-item-swiper
                v-else-if="el.compType === 26"
                :element="el"
              ></form-item-swiper>
              <form-item-step-bar
                v-else-if="el.compType === 27"
                :element="el"
                :flagComp="getCompId"
                :configForm="configForm"
              ></form-item-step-bar>
              <form-item-users
                v-else-if="el.compType === 28"
                :value="configForm[el.compId]"
                :element="el"
                @change="fromDataChange"
              ></form-item-users>
              <form-item-location
                v-else-if="el.compType === 29"
                :value="configForm[el.compId]"
                :element="el"
                @change="fromDataChange"
              ></form-item-location>

              <form-item-signature
                v-else-if="el.compType === 31"
                :value="configForm[el.compId]"
                :element="el"
                :menuId="htmlConfig.id"
                @change="fromDataChange"
              ></form-item-signature>
              <form-item-induction-scan
                v-else-if="el.compType === 32 && canShowInductionScan"
                :element="el"
                :menuId="htmlConfig.id"
                @change="fromDataChange"
              ></form-item-induction-scan>
              <!-- #ifdef APP-PLUS -->
              <form-item-induction-nFC
                v-else-if="el.compType === 33"
                :element="el"
                :menuId="htmlConfig.id"
                @change="fromDataChange"
              ></form-item-induction-nFC>
              <!-- #endif -->
              <form-item-switch
                v-else-if="el.compType === 34"
                :element="el"
                :value="configForm[el.compId]"
                @change="fromDataChange"
              ></form-item-switch>

              <!-- <view
            class="hasBorder"
            v-if="
              funcConfig.layoutStyle === 2 &&
              index !== currentElementList.length - 1 &&
              topPosEl.indexOf(el.compType) === -1 &&
              el.compType !== 20
            "
          ></view> -->
            </div>
          </div>
        </div>
      </u-form>
      <config-btns
        ref="btns"
        v-if="isShowBtnBottom"
        :tabId="tabId"
        :htmlConfig="htmlConfig"
        :funcConfig="funcConfig"
        :featureArr="featureArr"
      ></config-btns>
    </template>
    <Signature
      ref="signature"
      :drawUser="true"
      :watermark="watermark"
      mode="signAbsolute"
    ></Signature>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { fileUpload, getSidebarSingle } from '@/api/menuConfig';
import ConfigBtns from '../ConfigBtns';

import Signature from '../../Signature';
import FormHead from './FormHead';
import FormItemDivider from './FormItem/FormItemDivider';
import FormItemLabel from './FormItem/FormItemLabel';
import FormItemSelect from './FormItem/FormItemSelect';
import FormItemSelectData from './FormItem/FormItemSelectData';
import FormItemRadio from './FormItem/FormItemRadio';
import FormItemDate from './FormItem/FormItemDate';
import FormItemTextarea from './FormItem/FormItemTextarea';
import FormItemUploadcers from './FormItem/FormItemUploadcers';
import FormItemInput from './FormItem/FormItemInput';
import FormItemIframe from './FormItem/FormItemIframe';
import FormItemTextTip from './FormItem/FormItemTextTip';
import FormItemRate from './FormItem/FormItemRate';
import FormItemCascade from './FormItem/FormItemCascade';
import FormItemSwiper from './FormItem/FormItemSwiper';
import FormItemCheckbox from './FormItem/FormItemCheckbox';
import FormItemStepBar from './FormItem/FormItemStepBar';
import FormItemProgressBar from './FormItem/FormItemProgressBar';
import FormItemUsers from './FormItem/FormItemUsers';
import FormItemUploadFiles from './FormItem/FormItemUploadFiles';
import FormItemLocation from './FormItem/FormItemLocation';
import FormItemRichtext from './FormItem/FormItemRichtext';
import FormItemSignature from './FormItem/FormItemSignature.vue';
import FormItemInductionScan from './FormItem/FormItemInductionScan';
import FormItemInductionNFC from './FormItem/FormItemInductionNFC';
import FormItemSwitch from './FormItem/FormItemSwitch';

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
    FormItemIframe,
    FormItemTextTip,
    FormItemRate,
    FormItemCascade,
    FormItemSwiper,
    FormItemCheckbox,
    FormItemStepBar,
    FormItemProgressBar,
    FormItemUsers,
    FormItemUploadFiles,
    FormItemLocation,
    FormItemRichtext,
    FormItemUploadcers,
    FormItemSignature,
    FormItemInductionScan,
    FormItemInductionNFC,
    Signature,
    FormItemSwitch
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
      showContent: true,
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
    isShowBtnTop() {
      if (this.funcConfig.pageType === 2 && this.functionBtns.length > 0) {
        const { isProcess } = this.htmlConfig;
        if (isProcess && this.processBtns.length !== 0) return true;
        return true;
      }

      return false;
    },
    isShowBtnBottom() {
      if (this.funcConfig.pageType === 3) {
        const { isProcess } = this.htmlConfig;
        if (isProcess && this.processBtns.length === 0) return false;
        return true;
      }
      return false;
    },
    // 扫描项目类型，为了兼容h5定制化扫描1=标准；2=泸州老窖
    scanItemType() {
      const scanTypeArry = this.$store.getters.getCurDict('SCAN_ITEM_TYPE') || [];
      let type = 1;
      if (scanTypeArry.length > 0) {
        type = scanTypeArry[0].value;
      }
      return type;
    },
    // 是否显示扫描控件
    canShowInductionScan() {
      let show = false;
      // #ifdef H5
      const { scanItemType } = this;
      if (scanItemType && scanItemType !== 1) show = true;
      // #endif
      // #ifndef H5
      show = true;
      // #endif
      return show;
    },
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    },
    // 用户签名图片
    signatureImage() {
      const { signatureImage } = this.userInfo;
      if (!signatureImage) return '';
      return this.$apiot.getComUrlByToken(signatureImage);
    },
    // 签名水印信息
    watermark() {
      const { userInfo } = this;
      const currentDate = this.$apiot.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
      return `${userInfo.username} ${currentDate}`;
    },
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
        vaildData[key] = dataVaildForm[key] || '';
        const comp = elementList.find((el) => el.compId === key);
        if (comp && [3, 6].indexOf(comp.compType) !== -1) {
          vaildData[key] = `${dataVaildForm[key]}`;
        }
        if (
          comp &&
          [4].indexOf(comp.compType) !== -1 &&
          vaildData[key] &&
          typeof vaildData[key] === 'string'
        ) {
          vaildData[key] = vaildData[key].split(',');
        }
      });
      return vaildData;
    },
    getNewConfigData() {
      return function(data) {
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
    // 筛选出显示的控件
    elementsRequired() {
      return this.elementsShow.filter((el) => el.shouldRequired) || [];
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
    },
    'functionArea.refershRule': function() {
      this.$nextTick(() => {
        this.setRules();
      });
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
    dataVaildFormChange(valueObj, compId) {
      this.dataVaildForm = { ...this.dataVaildForm, ...valueObj };
      if (compId) this.$refs.configForm.validateField(compId);
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
      if (compType === 4) {
        // 数据选择框
        console.log(
          "typeof vaildData[key] === 'string'============================================="
        );
        // const _V = valueObj[compId]
        // if(_V && )
        // const obj = {};
        // obj[compId] = selData;
        // this.selElData = { ...this.selElData, ...obj };
      }
      this.configForm = { ...this.configForm, ...valueObj };
      this.dataVaildForm = { ...this.configForm };
      this.dataVaildFormChange(valueObj, compId);
    },
    // 电子签名文件上传
    async doUpload() {
      const info = await this.$refs.signature.showAsyncDraw({ drawSrc: this.signatureImage });
      const param = { menuId: this.htmlConfig.id };
      const res = await fileUpload(info.pathW, param);
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
          compMap: JSON.stringify(this.getCompMap() || {})
        };
        if (isPanel) {
          params.panelCompId = parentCompId;
          params.relationMenuDesignId = parentSysMenuDesignId;
          params.panelFilter = this.getFilterParams() || [];
        }

        // 如果是跳转菜单
        if (isJump === '1') {
          params.panelFilter = this.getFilterParams() || [];
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
      const signatureArray = []; // 需要默认上一次电子签章的控件
      elementList.forEach((el) => {
        const key = el.compId;
        // 如果是外联组件
        if (el.compType === 19) return false;
        // 数据传递
        if (panelDataTrans[key]) curentData[key] = panelDataTrans[key];

        // 如果值为空
        let V = curentData[key];
        if (typeof V === 'number') V = `${V}`;
        if (!`${V || ''}`) {
          const { defaultValueType, formulaContent, defaultType, compType } = el;
          // 默认值是否为公式
          if (defaultValueType === 2 && formulaContent) {
            curentData[key] = this.resolveFormula(true, el.formulaContent);
          } else if ([8, 9].indexOf(compType) !== -1) {
            if (defaultType === 1) {
              // 默认当前时间
              curentData[key] = this.$apiot.dateFormat('', compType === 9 ? '' : 'yyyy-MM-dd');
            } else curentData[key] = form[key].replace('T', ' ');
          } else if (compType === 29) {
            curentData[key] = form[key] ? JSON.stringify(form[key]) : '';
          } else curentData[key] = form[key];
        }

        if (el.compType === 10) curentData[key] = `${curentData[key]}`;
        if (
          el.compType === 31 &&
          el.defaultValueType === 2 &&
          !curentData[key] &&
          this.signatureImage
        ) {
          // 电子签章，并且默认值要显示上一次签名
          signatureArray.push(key);
        }

        if (el.compType === 4 && curentData[key] && typeof curentData[key] !== 'string') {
          // 如果是多选
          curentData[key] = curentData[key].length > 0 ? curentData[key].join() : '';
        }
      });
      if (signatureArray.length > 0) {
        const img = await this.doUpload();
        const { id } = img[0];
        signatureArray.forEach((key) => {
          curentData[key] = id;
        });
      }
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
    // 设置表单提交规则
    setRules() {
      if (!this.$refs.configForm) return;
      const { rules } = this.functionArea;
      const rulesObj = {};
      // 不能重复的控件
      Object.keys(rules).forEach((key) => {
        const ruleArry = rules[key];
        const comp = this.allComp[key];
        const { canShow, shouldRepeat } = comp;

        rulesObj[key] = ruleArry.map((rule) => {
          if (rule.flag && rule.flag === 'maxAndMin') {
            let min = 0;
            let max = 999999;
            if (rule.max && rule.max !== '0') max = +rule.max;
            if (rule.min && rule.min !== '0') min = +rule.min;
            rule.max = max;
            rule.min = min;
          }

          // rule.type = rule.type ? rule.type : 'any';
          rule.validator = function(ru, value, callback) {
            return value !== '';
          };
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
        }
      });
      this.$refs.configForm.setRules(rulesObj);
    },
    async init(type, refreshType) {
      this.reloadPage = false;

      const { filterTermSql, filterTermStr, compId } = this.funcConfig;
      let hasPanelFilter = false;
      if (compId in this.panelFilter) hasPanelFilter = true;

      // 是否初始化，如果不初始化默认就不走接口,但通过按钮刷新上一页时，需要请求接口
      const { shouldInit } = this.funcConfig;
      let isInit = shouldInit;
      if (refreshType === 8) isInit = true;

      // 如果是预览界面，默认不请求接口
      if (this.htmlConfig.isPreview) isInit = false;

      this.switchLoadingArea(this.funcConfig.compId, true);
      let data = {};
      // 表单控件，如果没有过滤条件，则不请求接口
      // 如果是从流程中跳转过来地，则默认请求逻辑
      const { isProcess } = this.htmlConfig;
      // eslint-disable-next-line max-len
      if (isInit && (hasPanelFilter || filterTermSql || filterTermStr || isProcess)) data = await this.getForm();
      await this.resolveFormData(data, type);
      this.reloadPage = true;
      this.switchLoadingArea(this.funcConfig.compId, false);
      this.$nextTick(() => {
        this.setRules();
      });
    },
    reloadData(refreshType) {
      // refreshType 按钮刷新类型
      this.init('reloadData', refreshType);
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
