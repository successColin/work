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
            :style="getTabContentStyles()"
        >
            <span
                class="tabName"
                :style="getTabStyles()"
            >{{ renderContent }}</span>
        </div>

      </div>
    </div>
  </CDragComponent>
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
      const {beforeConfig, afterConfig} = this.config;
      if (this.isFlag) {
        return afterConfig.content;
      }
      return beforeConfig.content;
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
    'config.beforeConfig'() {
      this.removeClass();
      this.insertClass();

    },
    'config.afterConfig'() {
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
      const {beforeConfig, afterConfig, componentId} = this.config;
      const classNames = `.tabContentWrap_${componentId}`;
      const activeClassNames = `.tabContentWrap_${componentId}.active`;
      const {cHoverColor, cBgUrl, cHoverBgUrl, cBgColor, cHoverBgColor} = beforeConfig;
      const {
        cHoverColor: afterHoverColor,
        cBgUrl: afterBgUrl,
        cHoverBgUrl: afterHoverBgUrl,
        cBgColor: afterBgColor,
        cHoverBgColor: afterHoverBgColor
      } = afterConfig;
      let styleDom = document.createElement('style');
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('id', `tabContentWrap_${componentId}`);
      styleDom.innerHTML = `
        ${classNames} {
          background-image: url(${cBgUrl});
          background-color: ${cBgColor};
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        ${classNames}:hover {
          background-image: url(${cHoverBgUrl});
          background-color: ${cHoverBgColor};
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        ${classNames}:hover .tabName{
          color: ${cHoverColor} !important;
        }

        ${activeClassNames} {
          background-image: url(${afterBgUrl});
          background-color: ${afterBgColor};
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        ${activeClassNames}:hover {
          background-image: url(${afterHoverBgUrl});
          background-color: ${afterHoverBgColor};
          background-repeat: no-repeat;
          background-size: 100% 100%;
        }
        ${activeClassNames}:hover .tabName{
          color: ${afterHoverColor} !important;
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom)
    },
    initList(arr) { // tab控件的所有具体属性
      const newArr = this.getControlledArr(arr);
      // 所有受控的控件
      // 找到显示显示的是哪个tab
      const index = this.active.split('_')[1];
      const {displayChartArray} = arr[+index]; // 需要显示的控件
      // 如果当前tab没有受控控件，不做反应
      if (!displayChartArray.length) {return;}
      // 需要隐藏的控件
      const result = newArr.filter((item) => !displayChartArray.includes(item));
      let list = [...this.getList];
      result.forEach((item) => {
        const index = list.findIndex(items => items.componentId === item);
        if (index !== -1) {
          list[index].isShow = false;
        }
      })
      displayChartArray.forEach((item) => {
        const index = list.findIndex(items => items.componentId === item);
        if (index !== -1) {
          list[index].isShow = true;
        }
      })
      this.$store.dispatch('config/updateComponentList', list);
    },
    handleActive() {
      this.isFlag = !this.isFlag;
      this.doChange()
    },
    doChange() {
      const {beforeParamsConfig = [], afterParamsConfig = []} = this.config;
      // false 初始化 true 切换后
      let list = [...this.getList];
      if (this.isFlag) {
        afterParamsConfig.forEach((item) => {
          const index = list.findIndex(items => items.componentId === item.componentId);
          if (index !== -1) {
            list[index].isShow = item.isShow;
          }
        })
      } else {
        beforeParamsConfig.forEach((item) => {
          const index = list.findIndex(items => items.componentId === item.componentId);
          if (index !== -1) {
            list[index].isShow = item.isShow;
          }
        })
      }
      this.$store.dispatch('config/updateComponentList', list);
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
