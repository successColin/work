/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <CDragComponent
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
      :w="config.width"
      :h="config.height"
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :minw="2"
      :minh="2"
      :sticks="sticks"
      :parentScaleX="scale"
      :parentScaleY="scale"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @clicked="handleClick"
      @activated="activated"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="singleTextWrap" :style="getContentStyles"
         @contextmenu.prevent="show">
      <div class="timePickWrap" :class="`a${config.componentId}-timePickWrap`">
        <div class="timeTypeWrap">
          <c-select
              :popper-class="`a${config.componentId}_selectPopper`"
              ref="timeSelect"
              :options="getTimeTypeOptions"
              v-model="timeType"
              @focus="focusSelect"
              @change="(value) => timeType = value"
          >

          </c-select>
        </div>
        <div class="timeValueWrap" @click="focus">
          <el-time-picker
              v-if="timeType===1"
              ref="timePicker"
              :clearable="false"
              v-model="timeValue"
              :popper-class="`a${config.componentId}—datePickerPopperWrap`"
          >
          </el-time-picker>
          <el-date-picker
              :popper-class="`a${config.componentId}—datePickerPopperWrap`"
              v-if="timeType!==1"
              :format="timeType===4? 'yyyy 第 WW 周': ''"
              v-model="timeValue"
              ref="timePicker"
              :clearable="false"
              :type="getTimepickerType"
          >
          </el-date-picker>
        </div>
        <div class="timeTypeBtn" v-if="config.stylesObj.checkedTimesOthers.includes(timeType)">
          <c-button type="primary">{{textObj.pre}}</c-button>
          <c-button type="primary">{{textObj.next}}</c-button>
        </div>
      </div>
    </div>
  </CDragComponent>
</template>

<script>
import {screenConfig, TIME_TYPE} from '@/constants/global';
// import {isEqual} from 'lodash';

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
    }
  },
  data() {
    return {
      sticks: ['mr', 'ml'],
      timeValue: '',
      timeType: null,
      isShow: false
    };
  },
  mounted() {
    this.renderStyles();
    this.init();
  },

  computed: {
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
      const {width, height} = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.$store.getters.list;
    },
    getRealStylesConfig() {
      const {stylesObj: {stylesType}} = this.config;
      const realStylesConfig = this.config[stylesType];
      return realStylesConfig;
    },
    textObj(){
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
    }
  },
  watch: {
    'config.stylesObj.bgColor': {
      handler() {
        this.renderStyles();
      }
    },
    'config.stylesObj.borderColor': {
      handler() {
        this.renderStyles();
      }
    },
    'config.stylesObj.iconColor': {
      handler() {
        this.renderStyles();
      }
    },
    'config.stylesObj.fontColor': {
      handler() {
        this.renderStyles();
      }
    },
    'config.stylesObj.defaultCheckedTimeType': {
      handler() {
        this.init();
      }
    }
  },
  methods: {
    init() {
      const {
        stylesObj: {defaultCheckedTimeType, checkedTimes}
      } = this.config;
      if (!defaultCheckedTimeType) {
        this.timeType = checkedTimes[0];
        return;
      }
      this.timeType = defaultCheckedTimeType;
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
            background-color: ${bgColor} !important;
            color: ${fontColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classSelectProperNames} .el-select-dropdown__item.hover{
            background: ${iconColor};
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
            color: ${borderColor} !important;
          }
          .${classProperNames} .available:hover {
            color: ${iconColor} !important;
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
            background-color: ${iconColor} !important;
          }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom);
    },
    changeHover() {
      const {stylesObj: {stylesType}} = this.config;
      const realStylesConfig = this.getRealStylesConfig;
      const {unActiveConfig, activeConfig} = realStylesConfig;
      let styleDom = document.createElement('style');
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('className', 'stylesHover');
      if (stylesType === 'styleThree') {
        styleDom.innerHTML = `
         .active.tabNameWrap:hover{
           background-color:${activeConfig.cHoverBgUrl ? 'unset' : activeConfig.cHoverBgColor} !important;
           background-image:url(${activeConfig.cHoverBgUrl}) !important;}
         .tabNameWrap:hover{
           background-color:${unActiveConfig.cHoverBgUrl ? 'unset' : unActiveConfig.cHoverBgColor} !important;;
           background-image:url(${unActiveConfig.cHoverBgUrl}) !important;
          }
          .tabNameWrap:hover .tabName{ color: ${unActiveConfig.cHoverColor} !important;}
      `;
      }
      if (stylesType !== 'styleThree') {
        styleDom.innerHTML = `
          .tabNameWrap:hover .tabName{ color: ${unActiveConfig.cHoverColor} !important;}
      `;
      }
      document.getElementsByTagName('head')[0].appendChild(styleDom)
    },
    changeNormal() {
      let boxStyles = document.querySelector('[classname="stylesHover"]');
      boxStyles.parentNode.removeChild(boxStyles);
      // this.hoverActive = null;
    },
    update(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    dragstop(newRect) {
      this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    handleClick() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
        if (this.isShow) {
          // this.$refs.timePicker.$children[0].blur();
          this.$refs.timeSelect.$children[0].blur();
          this.isShow = false;
        }
      })
    },
    activated() {
      console.log('activated');
    },
    focus() {
      this.$refs.timePicker.focus();
      this.isShow = true;
    },
    focusSelect() {
      // this.$refs.timeSelect.focus();
      if (this.isShow) {
        this.isShow = false;
        this.$refs.timeSelect.$children[0].blur();
      } else {
        this.isShow = true;
      }
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
  components: {},
  beforeDestroy() {
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: relative;
  overflow: hidden;
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
      margin-right: 10px;

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
          padding: 0 8px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
