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
      <div class="tabContentWrap" :style="getTabContentClass">
        <!--        @mouseover="changeHover($event, item, index)"-->
        <div
            v-for="(item, index) in config.tabConfig"
            :key="`${index}`"
            @click="handleActive(item, index)"
            @mouseover="changeHover($event, item, index)"
            @mouseout="changeNormal($event, item, index)"

        >
          <div
              class="tabNameWrap"
              :class="{'active':active===`${item.name}_${index}`}"
              :style="getTabContentStyles(item, index)"
          >
            <img v-if="checkIconIsShow(item, index)" :style="getIconStyles(item, index)"
                 :src="checkIconIsShow(item, index)" class="tabIcon"/>
            <span
                class="tabName"
                :style="getTabStyles(item, index)"
            >{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </VueDragResize>
</template>

<script>
import {screenConfig} from '@/constants/global';
import {isEqual} from 'lodash';

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
      default: () => {}
    }
  },
  data() {
    return {
      active: 'tab1_0',
      hoverActive: null
    };
  },
  mounted() {
    this.active = this.config.stylesObj.defaultShowTab;
  },

  components: {},

  computed: {
    getContentStyles() {
      const {width, height} = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.$store.getters.list;
    },
    getIconStyles() {
      return function (obj, i) {
        const realStylesConfig = this.getRealStylesConfig;
        const {
          activeConfig, unActiveConfig
        } = realStylesConfig;
        let styles = null;
        if (this.active === `${obj.name}_${i}`) {
          styles = `width:${activeConfig.cFontSize}px;`;
        } else if (this.active !== `${obj.name}_${i}`) {
          styles = `width:${unActiveConfig.cFontSize}px;`;
        }
        return styles;
      }
    },
    checkIconIsShow() {
      return function (params, index) {
        const {unActiveIcon, activeIcon, name} = params;
        if (`${name}_${index}` === this.active) {
          return activeIcon;
        }
        return unActiveIcon;
      }
    },
    getTabStyles() {
      return function (obj, i) {
        const realStylesConfig = this.getRealStylesConfig;
        const {
          activeConfig, unActiveConfig
        } = realStylesConfig;
        let styles = null;
        if (this.active === `${obj.name}_${i}`) {
          styles = `color: ${activeConfig.cColor};fontSize:${activeConfig.cFontSize}px;fontWeight:${activeConfig.cFontWeight};`;
        } else if (this.active !== `${obj.name}_${i}`) {
          styles = `color: ${unActiveConfig.cColor};fontSize:${unActiveConfig.cFontSize}px;fontWeight:${unActiveConfig.cFontWeight}`;
        }
        return styles;
      }
    },
    getTabContentStyles() {
      return function (obj, i) {
        const realStylesConfig = this.getRealStylesConfig;
        const {stylesObj: {stylesType, tabMarginLeftAndRight}} = this.config;
        const {
          activeConfig, unActiveConfig
        } = realStylesConfig;
        let styles = null;
        if (stylesType === 'styleOne') {
          if (this.active === `${obj.name}_${i}`) {
            styles = `margin:0 ${tabMarginLeftAndRight}px;borderBottom: 2px solid;borderBottomColor:${activeConfig.cColor};padding:${activeConfig.cPaddingTopAndBottom}px ${activeConfig.cPaddingRightAndLeft}px;`;
          }
          if (this.active !== `${obj.name}_${i}`) {
            styles = `margin:0 ${tabMarginLeftAndRight}px;borderBottom: 2px solid;borderBottomColor: rgba(0,0,0,0);padding:${unActiveConfig.cPaddingTopAndBottom}px ${unActiveConfig.cPaddingRightAndLeft}px;`;
          }
        }
        if (stylesType === 'styleTwo') {
          if (this.active === `${obj.name}_${i}`) {
            styles = `padding:${activeConfig.cPaddingTopAndBottom}px ${activeConfig.cPaddingRightAndLeft}px;border-radius: 4px 4px 0px 0px;
border: 1px solid #2F437F;margin:0 ${tabMarginLeftAndRight}px;borderBottomColor:transparent;`;
          }
          if (this.active !== `${obj.name}_${i}`) {
            styles = `padding:${unActiveConfig.cPaddingTopAndBottom}px ${unActiveConfig.cPaddingRightAndLeft}px;background: #192757;
border-radius: 4px 4px 0px 0px;margin:0 ${tabMarginLeftAndRight}px;border: 1px solid transparent;`;
          }
        }
        if (stylesType === 'styleThree') {
          if (this.active === `${obj.name}_${i}`) {
            styles = `padding:${activeConfig.cPaddingTopAndBottom}px ${activeConfig.cPaddingRightAndLeft}px;border-radius: ${activeConfig.borderRadius}%;
margin:0 ${tabMarginLeftAndRight}px;borderWidth:${activeConfig.borderWidth}px;borderColor: ${activeConfig.borderColor};borderStyle: ${activeConfig.borderWidth ? 'solid' : 'none'};
 backgroundColor:${activeConfig.cBgUrl ? 'unset' : activeConfig.cBgColor};backgroundSize: 100% 100%;backgroundImage:url(${activeConfig.cBgUrl});`;
          }
          if (this.active !== `${obj.name}_${i}`) {
            styles = `padding:${unActiveConfig.cPaddingTopAndBottom}px ${unActiveConfig.cPaddingRightAndLeft}px;
border-radius: ${unActiveConfig.borderRadius}%;margin:0 ${tabMarginLeftAndRight}px;
borderWidth:${unActiveConfig.borderWidth}px;borderColor: ${unActiveConfig.borderColor};borderStyle: ${unActiveConfig.borderWidth ? 'solid' : 'none'};
backgroundColor:${unActiveConfig.cBgUrl ? 'unset' : unActiveConfig.cBgColor};backgroundImage:url(${unActiveConfig.cBgUrl});backgroundSize: 100% 100%;`;
          }
        }
        return styles;
      }
    },
    getTabContentClass() {
      const {stylesObj: {stylesType}} = this.config;
      if (stylesType !== 'styleThree') {
        return 'border-bottom: 1px solid #2F437F;';
      }
      return '';
    },
    getRealStylesConfig() {
      const {stylesObj: {stylesType}} = this.config;
      const realStylesConfig = this.config[stylesType];
      return realStylesConfig;
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
  watch: {
    'config.stylesObj.defaultShowTab': {
      deep: true,
      immediate: true,
      handler(n, o) {
        if (n !== o) {
          this.active = n;
          this.$nextTick(() => {
            this.initList(this.config.tabConfig);
          })
        }
      }
    },
    'config.tabConfig': {
      deep: true,
      immediate: true,
      handler(n, o) {
        if (!isEqual(n, o)) { // 如果tab组件配置发生改变，
          this.initList(n);
        }
      }
    }
  },
  methods: {
    initList(arr) { // tab控件的所有具体属性
      if (!arr.length) {
        return;
      }
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
    handleActive(item, index) {
      this.active = `${item.name}_${index}`;
      this.$nextTick(() => {
        this.initList(this.config.tabConfig);
      })
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
      if (boxStyles) {
        boxStyles.parentNode.removeChild(boxStyles);
      }
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
    display: flex;
    width: 100%;
    box-sizing: border-box;

    .tabNameWrap {
      box-sizing: border-box;
      cursor: pointer;

      .tabIcon {
        margin-right: 5px;
      }
    }
  }
}
</style>
