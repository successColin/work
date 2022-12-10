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
    <div class="tabContentWrap" :style="getTabContentClass">
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
</template>

<script>

export default {
  props: {
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
    updateState: { // 用于修改父组件data值
      type: Function,
      default: () => {
      }
    },
    metaDataList: { // 元数据
      type: Array,
      default() {
        return [];
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
      active: ''
    };
  },
  mounted() {
    this.active = this.config.stylesObj.defaultShowTab;
    const i = this.active ? this.active.split('_')[1] : 0;
    this.handleActive(this.config.tabConfig[+i], +i);
  },

  components: {},

  computed: {
    getContentStyles() {
      const {
        width,
        height,
        left,
        top,
        stylesObj
      } = this.config;
      return `width:${width}px;height:${height}px;left:${left}px;top: ${top}px;zIndex:${stylesObj.zIndex};`;
    },
    getIconStyles() {
      return function (obj, i) {
        const realStylesConfig = this.getRealStylesConfig;
        const {
          activeConfig,
          unActiveConfig
        } = realStylesConfig;
        let styles = null;
        if (this.active === `${obj.name}_${i}`) {
          styles = `width:${activeConfig.cFontSize}px;`;
        } else if (this.active !== `${obj.name}_${i}`) {
          styles = `width:${unActiveConfig.cFontSize}px;`;
        }
        return styles;
      };
    },
    checkIconIsShow() {
      return function (params, index) {
        const {
          unActiveIcon,
          activeIcon,
          name
        } = params;
        if (`${name}_${index}` === this.active) {
          return activeIcon;
        }
        return unActiveIcon;
      };
    },
    getTabStyles() {
      return function (obj, i) {
        const realStylesConfig = this.getRealStylesConfig;
        const {
          activeConfig,
          unActiveConfig
        } = realStylesConfig;
        let styles = null;
        if (this.active === `${obj.name}_${i}`) {
          styles = `color: ${activeConfig.cColor};fontSize:${activeConfig.cFontSize}px;fontWeight:${activeConfig.cFontWeight};`;
        } else if (this.active !== `${obj.name}_${i}`) {
          styles = `color: ${unActiveConfig.cColor};fontSize:${unActiveConfig.cFontSize}px;fontWeight:${unActiveConfig.cFontWeight}`;
        }
        return styles;
      };
    },
    getTabContentStyles() {
      return function (obj, i) {
        const realStylesConfig = this.getRealStylesConfig;
        const {
          stylesObj: {
            stylesType,
            tabMarginLeftAndRight
          }
        } = this.config;
        const {
          activeConfig,
          unActiveConfig
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
            styles = `padding:${unActiveConfig.cPaddingTopAndBottom}px ${unActiveConfig.cPaddingRightAndLeft}px;background: #f5f7fa;
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
      };
    },
    getTabContentClass() {
      const { stylesObj: { stylesType } } = this.config;
      if (stylesType !== 'styleThree') {
        return 'border-bottom: 1px solid #2F437F;';
      }
      return '';
    },
    getRealStylesConfig() {
      const { stylesObj: { stylesType } } = this.config;
      const realStylesConfig = this.config[stylesType];
      return realStylesConfig;
    },
    getControlledArr() {
      return function (arr) {
        const newArr = arr.reduce((pre, cur) => {
          const { displayChartArray = [] } = cur;
          // eslint-disable-next-line consistent-return
          const eqArr = displayChartArray.filter((item) => {
            if (!pre.includes(item)) {
              return item;
            }
            return false;
          });
          return pre.concat(eqArr);
        }, []);
        return newArr;
      };
    }
  },
  methods: {
    async initList(arr) { // tab控件的所有具体属性
      const newArr = this.getControlledArr(arr);
      // 所有受控的控件
      // 找到显示显示的是哪个tab
      const index = this.active.split('_')[1];
      const { displayChartArray } = arr[+index]; // 需要显示的控件
      // 如果当前tab没有受控控件，不做反应
      if (!displayChartArray.length) {
        return;
      }
      // 需要隐藏的控件
      const result = newArr.filter((item) => !displayChartArray.includes(item));
      const list = [...this.metaDataList];
      result.forEach((item) => {
        const i1 = list.findIndex((items) => items.componentId === item);
        if (i1 !== -1) {
          list[i1].isShow = false;
        }
      });
      displayChartArray.forEach((item) => {
        const i2 = list.findIndex((items) => items.componentId === item);
        if (i2 !== -1) {
          list[i2].isShow = true;
        }
      });
      await this.updateState('list', list);
    },
    async handleActive(item, index) {
      const {
        geChartArray = [],
        value
      } = item;
      const { stylesObj = {} } = this.config;
      const { paramName } = stylesObj;
      const params = {};
      this.active = `${item.name}_${index}`;
      if (geChartArray.length && value && paramName) {
        geChartArray.forEach((arr) => {
          params[`${arr}_${paramName}`] = value;
        });
        const newParams = {
          ...this.filterParameter,
          ...params
        };
        await this.updateState('filterParameter', newParams);
      }
      await this.initList(this.config.tabConfig);
    },
    changeHover() {
      const { stylesObj: { stylesType } } = this.config;
      const realStylesConfig = this.getRealStylesConfig;
      const {
        unActiveConfig,
        activeConfig
      } = realStylesConfig;
      const styleDom = document.createElement('style');
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
      document.getElementsByTagName('head')[0].appendChild(styleDom);
    },
    changeNormal() {
      const boxStyles = document.querySelector('[classname="stylesHover"]');
      boxStyles.parentNode.removeChild(boxStyles);
    }
  },
  beforeDestroy() {
    this.active = null;
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .tabContentWrap {
    min-height: 40px;
    display: flex;
    width: 100%;
    overflow: hidden;
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
