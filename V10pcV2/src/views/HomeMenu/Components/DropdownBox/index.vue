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
            :popper-class="`a${config.componentId}_selectPopper`"
            ref="timeSelect"
            :options="selectOptions"
            v-model="timeType"
            @change="change"
        >
        </c-select>
      </div>
    </div>
  </div>
</template>

<script>
import { menuProperties } from '@/views/HomeMenuConfig/constants/global';
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
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    updateState: { // 用于修改父组件data值
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      timeValue: '',
      timeType: null,
      isShow: false,
      selectOptions: []
    };
  },
  mounted() {
    const {
      stylesObj: {
        selectOptions = [],
        defaultCheckedTimeType = '',
        interactionSettingType = 1
      }
    } = this.config;
    this.renderStyles();
    if (defaultCheckedTimeType && interactionSettingType === 1) {
      const arr = defaultCheckedTimeType.split('_');
      const i = +arr.at(-1);
      const obj = selectOptions[i];
      this.timeType = obj.value;
    }
    if (interactionSettingType === 1) {
      this.selectOptions = selectOptions;
    }
    if (interactionSettingType === 2) {
      this.getDict();
    }
  },

  computed: {
    getContentStyles() {
      const {
        width,
        height,
        top,
        left,
        stylesObj
      } = this.config;
      console.log(height, 'height');
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  watch: {},
  methods: {
    async getDict() {
      const { stylesObj: { dictObj } } = this.config;
      const { dictKey } = dictObj || {};
      if (dictKey) {
        await this.$store.dispatch('getCurrentDict', dictKey);
        const tempData = await this.$store.getters.getCurDict(dictKey) || [];
        this.selectOptions = tempData.map((item) => {
          item.value = +item.value;
          if (item[`${localStorage.apiotLanguage}`]) {
            item.label = item[`${localStorage.apiotLanguage}`] || item.zhCN;
          }
          return item;
        });
      }
    },
    change(v) {
      console.log(v);
      const {
        stylesObj: {
          updateChart = [],
          selectOptions = [],
          paramsFiled = ''
        }
      } = this.config;
      if (!selectOptions.length || !paramsFiled || !updateChart.length) {
        return;
      }
      const params = {};
      updateChart.forEach((key) => {
        params[`${key}_${paramsFiled}`] = v;
      });
      const newParams = {
        ...this.otherParams,
        ...params
      };
      this.updateState('filterParameter', newParams);
    },
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
    }
  },
  components: {},
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .timePickWrap {
    display: flex;
    height: calc(100% - 40px);
    width: calc(100% - 20px);

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
