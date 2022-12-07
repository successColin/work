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
      :parentScaleX="scale"
      :parentScaleY="scale"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @clicked="handleClick"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="singleTextWrap" :style="getContentStyles"
         @contextmenu.prevent="show">
      <div class="tabContentWrap">

        <div
            :class="{[`tabContentWrap_${config.componentId}`]: true, active: this.isFlag }"
            class="tabNameWrap"
            @click="handleActive"
        >
            {{ renderContent }}
        </div>

      </div>
    </div>
  </VueDragResize>
</template>

<script>
import {screenConfig} from '@/constants/global';
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
      hoverActive: null,
      isFlag: false
    };
  },
  computed: {
    renderContent() { // 获取内容
      const { stylesObj: { content } } = this.config;
      return content;
    },
    getContentStyles() {
      const {width, height} = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.$store.getters.list;
    },
    getTabStyles() {
      return function () {
        const {beforeConfig, afterConfig} = this.config;
        const getStylesObj = (config) => {
          const {cFontFamily, cFontWeight, cFontSize, cColor, cPaddingTopAndBottom, cPaddingRightAndLeft} = config;
          return {
            fontFamily: cFontFamily,
            fontWeight: cFontWeight,
            fontSize: `${cFontSize}px`,
            color: cColor,
            padding: `${cPaddingTopAndBottom}px ${cPaddingRightAndLeft}px`
          };
        }
        if (this.isFlag) {
          return getStylesObj(afterConfig);
        }
        return getStylesObj(beforeConfig);
      }
    },
    getTabContentStyles() {
      return function () {
        const {beforeConfig, afterConfig} = this.config;
        const getStylesObj = (config) => {
          const {borderWidth, borderColor, borderRadius} = config;
          return {
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: `${borderRadius}%`
          };
        }
        if (this.isFlag) {
          return getStylesObj(afterConfig);
        }
        return getStylesObj(beforeConfig);
      }
    },
    getRealStylesConfig() {
      return {};
    },
    getControlledArr() {
      return function (arr) {
        const newArr = arr.reduce((pre, cur) => {
          const {displayChartArray = []} = cur;
          // eslint-disable-next-line consistent-return
          const eqArr = displayChartArray.filter((item) => {
            if (!pre.includes(item)) {
              return item;
            }
          });
          return pre.concat(eqArr)
        }, []);
        return newArr
      }
    }
  },

  mounted() {
    this.insertClass();
  },

  components: {},

  watch: {
    'config.stylesObj'() {
      this.removeClass();
      this.insertClass();

    }
  },
  methods: {
    removeClass() { // 移除样式
      const {componentId} = this.config;
      const id = `tabContentWrap_${componentId}`;
      const ele = document.getElementById(id);
      document.getElementsByTagName('head')[0].removeChild(ele);
    },
    insertClass() { // 生成样式
      const { componentId, stylesObj: {
        normalFSize, // 正常字体大小
        normalColor, // 正常字体颜色
        normalBorderRadius, // 正常倒角
        normalBColor, // 正常边框颜色
        normalBWidth, // 正常边框宽度
        normalBStyle, // 正常边框颜色
        normalBgColor, // 正常背景颜色
        activeFSize, // 悬浮字体大小
        activeColor, // 悬浮字体颜色
        activeBorderRadius, // 悬浮边框倒角
        activeBColor, // 悬浮边框颜色
        activeBWidth, // 悬浮边框宽度
        activeBStyle, // 悬浮边框颜色
        activeBgColor // 悬浮背景颜色
        }
      } = this.config;
      const classNames = `.tabContentWrap_${componentId}`;
      let styleDom = document.createElement('style');
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('id', `tabContentWrap_${componentId}`);
      styleDom.innerHTML = `
        ${classNames} {
          font-size: ${normalFSize}px;
          color: ${normalColor};
          border-radius: ${normalBorderRadius}px;
          border: ${normalBWidth}px ${normalBStyle} ${normalBColor};
          background-color: ${normalBgColor}
        }
         ${classNames}:hover {
          font-size: ${activeFSize}px;
          color: ${activeColor};
          border-radius: ${activeBorderRadius}px;
          border: ${activeBWidth}px ${activeBStyle} ${activeBColor};
          background-color: ${activeBgColor}
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom)
    },
    handleActive() {
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
      })
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
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

  .tabContentWrap {
    min-height: 40px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .tabNameWrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: pointer;

      .tabName {
        display: inline-block;
      }
    }
  }
}
</style>
