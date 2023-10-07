/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>

  <div class="singleTextWrap" :style="getContentStyles">
    <div class="timePickWrap" :class="`a${config.componentId}-timePickWrap`">
      <div class="timeTypeWrap">
        <c-select
            :popper-class="`a${config.componentId}_selectPopper`"
            ref="timeSelect"
            :options="getTimeTypeOptions"
            v-model="timeType"
            @focus="focusSelect"
            @change="changeTimeType"
        >
        </c-select>
      </div>
      <div class="timeValueWrap" @click="focus">
        <el-time-picker
            v-if="timeType===1"
            ref="timePicker"
            :clearable="false"
            v-model="timeValue"
            value-format="HH:mm:ss"
            :popper-class="`a${config.componentId}—datePickerPopperWrap`"
        >
        </el-time-picker>
        <el-date-picker
            :popper-class="`a${config.componentId}—datePickerPopperWrap`"
            v-if="timeType!==1"
            v-model="timeValue"
            :clearable="false"
            :format="timeType!==4?'':'yyyy 第 WW 周'"
            ref="timePicker"
            :type="getTimepickerType"
            @change="changeTime"
        >
        </el-date-picker>
      </div>
      <div class="timeTypeBtn" v-if="config.stylesObj.checkedTimesOthers.includes(timeType)">
        <c-button type="primary" @click="doPre">{{ textObj.pre }}</c-button>
        <c-button type="primary" @click="doNext">{{ textObj.next }}</c-button>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import {screenConfig, TIME_TYPE} from '@/constants/global';
import { hexify, getLightColor } from '@/utils/common';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return screenConfig
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    // eslint-disable-next-line no-warning-comments
    // todo: activeComponent与config 两个变量有重复，所有的组件都可以进行优化；
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    changeFilterParams: { // 用于修改过滤条件参数的
      type: Function,
      default: () => {
      }
    },
    updateState: { // 用于修改父组件data值
      type: Function,
      default: () => {
      }
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      timeValue: null,
      timeType: null,
      isShow: false
    };
  },
  mounted() {
    const {
      stylesObj: {defaultCheckedTimeType, checkedTimes}
    } = this.config;
    this.renderStyles();
    // {
    //   label: '时间日期',
    //       value: 3
    // },
    // {
    //   label: '日',
    //       value: 2
    // }, {
    //   label: '周',
    //       value: 4
    // }, {
    //   label: '月',
    //       value: 5
    // }, {
    //   label: '年',
    //       value: 6
    // }
    if (!defaultCheckedTimeType) {
      this.timeType = checkedTimes[0];
      this.timeValue = this.getTimeValue(this.timeType);
      return;
    }
    this.timeType = defaultCheckedTimeType;
    this.timeValue = this.getTimeValue(this.timeType);
  },

  computed: {
    getTimeValue() {
      return function (type = 0) {
        if (type === 4) {
          return moment().format(this.getValueFormat);
        }
        return moment().format(this.getValueFormat);
      }
    },
    textObj() {
      let obj = {};
      if (this.timeType === 2) {
        obj = {
          pre: '上一天',
          next: '下一天'
        }
      }
      if (this.timeType === 4) {
        obj = {
          pre: '上一周',
          next: '下一周'
        }
      }
      if (this.timeType === 5) {
        obj = {
          pre: '上一月',
          next: '下一月'
        }
      }
      if (this.timeType === 6) {
        obj = {
          pre: '上一年',
          next: '下一年'
        }
      }
      return obj;
    },
    getValueFormat() {
      if (this.timeType === 2) {
        return 'yyyy-MM-DD';
      } else if (this.timeType === 3) {
        return 'yyyy-MM-DD HH:mm:ss';
      } else if (this.timeType === 4) {
        return 'yyyy-MM-DD HH:mm:ss';
      } else if (this.timeType === 5) {
        return 'yyyy-MM';
      } else if (this.timeType === 6) {
        return 'yyyy';
      }
      return 'yyyy-MM-dd HH:mm:ss';
    },
    getTimepickerType() {
      if (this.timeType === 2) {
        return 'date';
      } else if (this.timeType === 3) {
        return 'datetime';
      } else if (this.timeType === 4) {
        return 'week';
      } else if (this.timeType === 5) {
        return 'month';
      } else if (this.timeType === 6) {
        return 'year';
      }
      return 'date';
    },
    getFormat() {
      if (this.timeType === 3) {
        return 'days';
      } else if (this.timeType === 4) {
        return 'days';
      } else if (this.timeType === 5) {
        return 'month';
      } else if (this.timeType === 6) {
        return 'year';
      }
      return 'days';
    },
    getTimeTypeOptions() {
      return this.config.stylesObj.checkedTimes.map((item) => {
        const obj = TIME_TYPE.find((objs) => objs.value === item);
        if (obj) {
          return obj;
        }
        return {}
      })
    },
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    }
  },
  watch: {},
  methods: {
    doPre() {
      if (!this.timeValue) {
        return;
      }
      if (this.timeType === 4) {
        this.timeValue = moment(this.timeValue).subtract(7, this.getFormat).format(this.getValueFormat);
      } else {
        this.timeValue = moment(this.timeValue).subtract(1, this.getFormat).format(this.getValueFormat);
      }
      this.triggerParamsUpdate();
    },
    doNext() {
      if (!this.timeValue) {
        return;
      }
      if (this.timeType === 4) {
        this.timeValue = moment(this.timeValue).add(7, this.getFormat).format(this.getValueFormat);
      } else {
        this.timeValue = moment(this.timeValue).add(1, this.getFormat).format(this.getValueFormat);
      }
      this.triggerParamsUpdate();
    },
    changeTimeType() {
      this.triggerParamsUpdate()
    },
    changeTime() {
      this.triggerParamsUpdate()
    },
    triggerParamsUpdate() {
      const {stylesObj: {timeTypeFiled, timeValueFiled, updateChart = []}} = this.config;
      if (!timeTypeFiled || !timeValueFiled || !updateChart.length) {
        return;
      }
      let params = {};
      updateChart.forEach((key) => {
        params[`${key}_${timeTypeFiled}`] = this.timeType;
        params[`${key}_${timeValueFiled}`] = this.timeValue ? moment(this.timeValue).format(this.getValueFormat) : '';
      })
      const newParams = {
        ...this.otherParams,
        ...params
      }
      this.updateState('filterParameter', newParams);
    },
    renderStyles() {
      const {
        stylesObj: {bgColor, borderColor, iconColor, fontColor},
        componentId
      } = this.config;
      let styleDom = document.createElement('style');
      const classNames = `a${componentId}-timePickWrap`;
      const classProperNames = `a${componentId}—datePickerPopperWrap`;
      const classSelectProperNames = `a${componentId}_selectPopper`;
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('className', `${componentId}-timePickStylesWrap`);
      styleDom.innerHTML = `
          .${classSelectProperNames} {
            background-color: ${hexify(bgColor)} !important;
            color: ${fontColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classSelectProperNames} .el-select-dropdown__item.hover{
            background: ${hexify(getLightColor(bgColor, 0.8))};
          }
          .${classSelectProperNames} .el-select-dropdown__item.selected {
            background: ${hexify(getLightColor(bgColor, 0.8))};
          }
          .${classSelectProperNames} .el-select-dropdown__item{
            color: ${fontColor};
          }
          .${classNames} .el-input__inner{
            background-color: ${bgColor} !important;
            color: ${fontColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classNames} .el-input__suffix {
            color: ${iconColor} !important;
          }
          .${classNames} .el-input__prefix {
            color: ${iconColor} !important;
          }
          .${classProperNames}.el-time-panel {
            background-color: ${bgColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classProperNames} .el-time-panel__footer{
            border-top: 1px solid ${borderColor} !important;
          }
          .${classProperNames} .el-time-panel__content::after, .el-time-panel__content::before {
            border-top: 1px solid ${borderColor} !important;
            border-bottom: 1px solid ${borderColor} !important;
          }
          .${classProperNames} .el-time-spinner__item {
             color: ${fontColor} !important;
          }
          .${classProperNames} .el-time-spinner__item:hover:not(.disabled):not(.active) {
             color: ${fontColor} !important;
             background: ${iconColor} !important;
          }
          .${classProperNames} .el-time-panel__btn {
             color: ${fontColor} !important;
          }
          .${classProperNames} .el-time-panel__btn:hover {
            color: ${iconColor} !important;
          }

          .${classProperNames}.el-picker-panel {
            background-color: ${bgColor} !important;
            border: 1px solid ${borderColor} !important;
            .el-picker-panel__icon-btn {
              color: ${iconColor} !important;
            }
          }
          .${classProperNames} .el-date-picker__header-label {
            color: ${fontColor} !important;
          }
          .${classProperNames} .el-date-picker__header-label:hover{
              color: ${iconColor} !important;
          }
          .${classProperNames} .el-picker-panel__icon-btn {
             color: ${fontColor} !important;
          }
          .${classProperNames} .el-picker-panel__icon-btn:hover {
             color: ${iconColor} !important;
          }
          .${classProperNames} .el-date-table th {
            color: ${fontColor} !important;
            border-bottom: solid 1px ${borderColor};
          }
          .${classProperNames} .available {
            color: ${fontColor} !important;
          }
          .${classProperNames} .available:hover {
            color: ${iconColor} !important;
            opacity: 0.8;
          }
          .${classProperNames} .el-month-table td .cell {
            color: ${fontColor};
          }
          .${classProperNames} .el-month-table td .cell:hover {
            color: ${iconColor} !important;
          }
          .${classProperNames} .el-month-table td.today .cell {
            color: ${iconColor} !important;
          }
          .${classProperNames} .el-date-picker__header--bordered {
            border-bottom: solid 1px ${borderColor};
          }
          .${classProperNames} .el-year-table td .cell {
            color: ${fontColor};
          }
          .${classProperNames} .el-year-table td .cell:hover {
            color: ${iconColor} !important;
          }
          .${classProperNames} .el-year-table td.today .cell {
            color: ${iconColor} !important;
          }
          .${classProperNames} .el-input__inner {
            background-color: ${bgColor} !important;
            border: 1px solid ${borderColor} !important;
            color: ${fontColor} !important;
          }
          .${classProperNames} .el-date-picker__time-header {
            border-bottom: solid 1px ${borderColor};
          }
          .${classProperNames} .el-picker-panel__footer {
            background-color: ${bgColor} !important;
            border-top: solid 1px ${borderColor};
          }
          .${classProperNames} .el-time-panel {
            border: 1px solid ${borderColor};
            background-color: ${bgColor};
          }
          .${classProperNames} .el-button--text {
             color: ${fontColor} !important;
          }
          .${classProperNames} .el-button--text:hover {
             color: ${iconColor} !important;
          }
          .${classProperNames} .el-button--default {
            color: ${fontColor} !important;
            background-color: ${bgColor};
            border: 1px solid ${borderColor};
          }
          .${classProperNames} .el-button--default:hover {
            color: ${iconColor} !important;
            // background-color: ${iconColor};
            border: 1px solid ${iconColor};
          }
          .${classNames} .el-button--primary {
            background-color: ${bgColor} !important;
            color: ${fontColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classNames} .el-button--primary:hover {
            opacity: 0.8;
            // background-color: ${bgColor} !important;
          }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom);
    },
    focus() {
      this.$refs.timePicker.focus();
      this.isShow = true;
    },
    focusSelect() {
      if (this.isShow) {
        this.isShow = false;
        this.$refs.timeSelect.$children[0].blur();
      } else {
        this.isShow = true;
      }
    }
  },
  components: {},
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  //overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .timePickWrap {
    display: flex;
    height: 32px;
    width: calc(100% - 20px);
    align-items: center;
    justify-content: space-between;

    .timeTypeWrap {
      width: 80px;
      margin-right: 8px;

      ::v-deep {
        .el-input__inner {
          padding-left: 10px;
        }
      }
    }

    .timeValueWrap {
      flex: 1;

      ::v-deep {
        .el-date-editor {
          width: 100%;

          .el-input__inner {
            height: 32px;
            padding-right: 0;
            line-height: 32px;
          }
        }

        .el-input__icon {
          line-height: 32px;
        }
      }
    }

    .timeTypeBtn {
      width: 130px;
      margin-left: 10px;

      ::v-deep {
        .el-button {
          height: 32px;
          line-height: 32px;
          padding: 0 8px;
          background-color: #192757;
          color: #FFFFFF;
          border: 1px solid #2F437F;
        }
      }
    }
  }
}
</style>
