/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <VueDragResize
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
              ref="timeSelect"
              :popper-class="`a${config.componentId}_selectPopper`"
              :options="config.stylesObj.selectOptions"
              v-model="timeType"
              @focus="focusSelect"
          >
          </c-select>
        </div>
      </div>
    </div>
  </VueDragResize>
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
    // const {
    //   stylesObj: {defaultCheckedTimeType, checkedTimes}
    // } = this.config;
    this.renderStyles();
    // if (!defaultCheckedTimeType) {
    //   this.timeType = checkedTimes[0];
    //   return;
    // }
    // this.timeType = defaultCheckedTimeType;
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
    }
  },
  methods: {
    renderStyles() {
      const {
        stylesObj: {bgColor, borderColor, iconColor, fontColor},
        componentId
      } = this.config;
      let styleDom = document.createElement('style');
      const classNames = `a${componentId}-timePickWrap`;
      const classProperNames = `a${componentId}_selectPopper`;
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('className', `${componentId}-timePickStylesWrap`);
      styleDom.innerHTML = `
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

    .timeTypeWrap {
      width: 100%;

      ::v-deep {
        .el-input__inner {
          padding-left: 10px;
        }
      }
    }
  }
}
</style>
