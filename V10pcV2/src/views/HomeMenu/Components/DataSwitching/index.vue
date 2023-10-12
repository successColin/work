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
    metaDataList: { // 元数据
      type: Array,
      default() {
        return [];
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
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isFlag: false
    };
  },
  computed: {
    renderContent() { // 获取内容
      const { beforeConfig, afterConfig } = this.config;
      if (this.isFlag) {
        return afterConfig.content;
      }
      return beforeConfig.content;
    },
    getContentStyles() {
      const { width, height, top, left, stylesObj } = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getTabStyles() {
      return function () {
        const { beforeConfig, afterConfig } = this.config;
        const getStylesObj = (config) => {
          // eslint-disable-next-line max-len
          const { cFontFamily, cFontWeight, cFontSize, cColor, cPaddingTopAndBottom, cPaddingRightAndLeft } = config;
          return {
            fontFamily: cFontFamily,
            fontWeight: cFontWeight,
            fontSize: `${cFontSize}px`,
            color: cColor,
            padding: `${cPaddingTopAndBottom}px ${cPaddingRightAndLeft}px`
          };
        };
        if (this.isFlag) {
          return getStylesObj(afterConfig);
        }
        return getStylesObj(beforeConfig);
      };
    },
    getTabContentStyles() {
      return function () {
        const { beforeConfig, afterConfig } = this.config;
        const getStylesObj = (config) => {
          const { borderWidth, borderColor, borderRadius } = config;
          return {
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: `${borderRadius}%`
          };
        };
        if (this.isFlag) {
          return getStylesObj(afterConfig);
        }
        return getStylesObj(beforeConfig);
      };
    },
    getControlledArr() {
      return function (arr) {
        const newArr = arr.reduce((pre, cur) => {
          const { displayChartArray = [] } = cur;
          // eslint-disable-next-line consistent-return,array-callback-return
          const eqArr = displayChartArray.filter((item) => {
            if (!pre.includes(item)) {
              return item;
            }
          });
          return pre.concat(eqArr);
        }, []);
        return newArr;
      };
    }
  },

  mounted() {
    this.insertClass();
    this.doChange();
  },

  components: {},

  watch: {},
  methods: {
    insertClass() { // 生成样式
      const { beforeConfig, afterConfig, componentId } = this.config;
      const classNames = `.tabContentWrap_${componentId}`;
      const activeClassNames = `.tabContentWrap_${componentId}.active`;
      const { cHoverColor, cBgUrl, cHoverBgUrl, cBgColor, cHoverBgColor } = beforeConfig;
      const {
        cHoverColor: afterHoverColor,
        cBgUrl: afterBgUrl,
        cHoverBgUrl: afterHoverBgUrl,
        cBgColor: afterBgColor,
        cHoverBgColor: afterHoverBgColor
      } = afterConfig;
      const styleDom = document.createElement('style');
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
      document.getElementsByTagName('head')[0].appendChild(styleDom);
    },
    handleActive() {
      this.isFlag = !this.isFlag;
      this.doChange();
    },
    async doChange() {
      const { beforeParamsConfig = [], afterParamsConfig = [] } = this.config;
      // false 初始化 true 切换后
      const list = [...this.metaDataList];
      const params = {};
      if (this.isFlag) {
        afterParamsConfig.forEach((item) => {
          const index = list.findIndex((items) => items.componentId === item.componentId);
          if (index !== -1) {
            list[index].isShow = item.isShow;
            const { variableConfig = [] } = item;
            if (variableConfig.length) {
              variableConfig.forEach((varObj) => {
                const { name, value } = varObj;
                if (name && item.isShow) {
                  params[`${item.componentId}_${name}`] = value;
                }
              });
            }
          }
        });
      } else {
        beforeParamsConfig.forEach((item) => {
          const index = list.findIndex((items) => items.componentId === item.componentId);
          if (index !== -1) {
            list[index].isShow = item.isShow;
            const { variableConfig = [] } = item;
            if (variableConfig.length) {
              variableConfig.forEach((varObj) => {
                const { name, value } = varObj;
                if (name && item.isShow) {
                  params[`${item.componentId}_${name}`] = value;
                }
              });
            }
          }
        });
      }
      await this.updateState('list', list);
      const newParams = {
        ...this.otherParams,
        ...params
      };
      setTimeout(async () => {
        await this.updateState('filterParameter', newParams);
      }, 100);
    }
  },
  beforeDestroy() {
  },
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
