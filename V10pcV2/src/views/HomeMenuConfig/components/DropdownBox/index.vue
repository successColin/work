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
            clearable
            ref="timeSelect"
            :popper-class="`a${config.componentId}_selectPopper`"
            :options="getOptions"
            v-model="timeType"
            @focus="focusSelect"
        >
        </c-select>
      </div>
    </div>
  </div>
</template>

<script>
import { menuProperties } from '../../constants/global';
// import {isEqual} from 'lodash';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return menuProperties;
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
      timeValue: '',
      timeType: null,
      isShow: false
    };
  },
  mounted() {
    this.renderStyles();
  },

  computed: {
    getOptions() {
      // eslint-disable-next-line max-len
      const { stylesObj: { interactionSettingType = 1, selectOptions = [], dictOptions = [] } } = this.config;
      if (interactionSettingType === 1) return selectOptions;
      return dictOptions;
    },
    getContentStyles() {
      const {
        width,
        height
      } = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.list;
    },
    getRealStylesConfig() {
      const { stylesObj: { stylesType } } = this.config;
      const realStylesConfig = this.config[stylesType];
      return realStylesConfig;
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
    'config.stylesObj.fontSize': {
      handler() {
        this.renderStyles();
      }
    },
    'config.stylesObj.fontColor': {
      handler() {
        this.renderStyles();
      }
    }
  },
  methods: {
    renderStyles() {
      const {
        stylesObj: {
          bgColor,
          borderColor,
          iconColor,
          fontColor,
          fontSize
        },
        componentId
      } = this.config;
      const styleDom = document.createElement('style');
      const styleDomClassName = `${componentId}-timePickStylesWrap`;
      const classNames = `a${componentId}-timePickWrap`;
      const classProperNames = `a${componentId}_selectPopper`;
      const existDom = document.querySelector(`style[className="${styleDomClassName}"]`);
      if (existDom) {
        existDom.remove();
      }
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('className', styleDomClassName);
      styleDom.innerHTML = `
          .${classNames} .el-input__inner{
            background-color: ${bgColor} !important;
            color: ${fontColor} !important;
            font-size: ${fontSize}px;
            border: 1px solid ${borderColor} !important;
          }
          .${classNames} .el-input__suffix {
            color: ${iconColor} !important;
          }
          .${classNames} .el-input__prefix {
            color: ${iconColor} !important;
          }
          .${classProperNames} {
            background-color: ${bgColor} !important;
            color: ${fontColor} !important;
            border: 1px solid ${borderColor} !important;
          }
          .${classProperNames} .el-select-dropdown__item.hover{
            background: ${iconColor};
          }
          .${classProperNames} .el-select-dropdown__item{
            color: ${fontColor};
          }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom);
    },
    handleClick() {
      this.$nextTick(() => {
        if (this.isShow) {
          // this.$refs.timePicker.$children[0].blur();
          this.$refs.timeSelect.$children[0].blur();
          this.isShow = false;
        }
      });
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
  },
  components: {},
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
    width: calc(100% - 20px);
    height: calc(100% - 40px);

    .timeTypeWrap {
      width: 100%;

      ::v-deep {
        .el-input__inner {
          padding-left: 10px;
        }
        .el-select, .el-input, .el-input__inner{
          height: 100% !important;
        }
      }
    }
  }
}
</style>
