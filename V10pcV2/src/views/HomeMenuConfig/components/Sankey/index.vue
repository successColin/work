/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :id="`basicPie_${config.componentId}`" :style="getContentStyles">
    <div class="singleTextContent" :id="config.componentId">
    </div>
    <div class="pieHook"></div>
  </div>
</template>

<script>
import { debounce } from '@/utils/utils';
// 引入基本模板
// eslint-disable-next-line no-undef
const echarts = require('echarts');

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      instance: null,
      observer: null,
      recordOldValue: { // 记录下旧的宽高数据，避免重复触发回调函数
        width: '0',
        height: '0'
      },
      timer: null
    };
  },

  components: {},

  computed: {
    getContentStyles() {
      const {
        width,
        height
      } = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.$store.getters.list;
    },
    makeData() { // 处理节点
      return function (list = []) {
        const obj = {};
        list.forEach((item) => {
          const {
            source,
            target
          } = item;
          if (!Object.hasOwn(obj, source)) {
            obj[source] = null;
          }
          if (!Object.hasOwn(obj, target)) {
            obj[target] = null;
          }
        });
        return Object.keys(obj)
            .map((item) => ({ name: item }));
      };
    },
    makeLevels() { // 处理层级数据
      return function (levels = []) {
        return levels.map((item, i) => {
          const {
            align, // left、center、right
            verticalAlign, // 'top''middle''bottom'
            isShowLabel, // 是否显示文本标签
            labelFontFamily,
            labelFontWeight,
            labelFontSize,
            labelColor,
            distance,
            rotate,
            // eslint-disable-next-line max-len
            labelPosition, // top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
            itemBorderColor, // 图形的描边颜色
            itemBorderWidth, // 图形的描边宽度
            itemBorderType, // 描边类型
            itemShadowBlur, // 图形阴影的模糊大小
            itemShadowColor, // 阴影颜色
            itemShadowOffsetX, // 阴影水平方向上的偏移距离
            itemShadowOffsetY, // 阴影垂直方向上的偏移距离
            opacity, // 透明的

            lineStyleColor, // 线条颜色
            lineStyleOpacity, // 线条透明度
            curveness
          } = item;
          return {
            depth: i,
            label: {
              show: isShowLabel,
              position: labelPosition,
              distance,
              rotate,
              color: labelColor,
              fontWeight: labelFontWeight,
              fontFamily: labelFontFamily,
              fontSize: labelFontSize,
              align,
              verticalAlign
            },
            itemStyle: {
              borderColor: itemBorderColor,
              borderWidth: itemBorderWidth,
              borderType: itemBorderType,
              shadowBlur: itemShadowBlur,
              shadowColor: itemShadowColor,
              shadowOffsetX: itemShadowOffsetX,
              shadowOffsetY: itemShadowOffsetY,
              opacity
            },
            lineStyle: {
              color: lineStyleColor,
              opacity: lineStyleOpacity,
              curveness
            }
          };
        });
      };
    },
    getOption() {
      return function () {
        const {
          stylesObj,
          dataType,
          dataConfig,
          apiDataConfig,
          SqlDataConfig,
          name,
          levels
        } = this.config;
        const { staticValue } = dataConfig;
        const {
          backgroundColor,
          left,
          top,
          width,
          height,
          nodeWidth,
          nodeGap,
          nodeAlign,
          orient,
          draggable,
          colorArr
        } = stylesObj;
        let list = [];
        if (dataType === 1) {
          list = JSON.parse(staticValue);
        }
        if (dataType === 2) {
          const { apiFilterResponse = '[]' } = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        if (dataType === 3) {
          const { SQLFilterResponse = '[]' } = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        const nodes = this.makeData(list);
        const lastLevels = this.makeLevels(levels);
        console.log(backgroundColor);
        const option = {
          backgroundColor,
          series: [{
            name,
            type: 'sankey',
            left: `${left}%`,
            top: `${top}%`,
            // right: `${right}%`,
            // bottom: `${bottom}%`,
            width: `${width}%`,
            height: `${height}%`,
            nodeWidth,
            nodeGap,
            nodeAlign,
            orient,
            draggable,
            links: list,
            data: nodes,
            levels: lastLevels
          }]
        };
        if (colorArr.length) {
          option.color = colorArr.map((item) => item.c1);
        }
        return option;
      };
    }
  },
  mounted() {
    this.initDom();
    // eslint-disable-next-line max-len
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
    const element = document.querySelector(`#basicPie_${this.config.componentId}`);
    this.observer = new MutationObserver(() => {
      const width = getComputedStyle(element)
          .getPropertyValue('width');
      const height = getComputedStyle(element)
          .getPropertyValue('height');
      if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
        return;
      }
      this.recordOldValue = {
        width,
        height
      };
      this.instance.myChart.resize();
    });
    this.observer.observe(element, {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true
    });
  },
  watch: {
    'config.dimension': {
      handler(val, old) {
        if (val !== old && this.instance) {
          this.instance.myChart.clear();
        }
      }
    },
    'config.dataConfig.staticValue': {
      handler(val, old) {
        if (val !== old && this.instance) {
          this.instance.myChart.clear();
        }
      }
    },
    config: {
      deep: true,
      handler(val, old) {
        if (this.instance && val) {
          if (val.enableGrid !== old.enableGrid) {
            this.instance.myChart.clear();
          }
          this.debouncedSearch();
          // this.timer = setTimeout(() => {
          //   console.log(66);
          //   const options = this.getOption();
          //   this.instance.myChart.setOption(options);
          // }, 300);
        }
      }
    }
  },
  created() {
    this.debouncedSearch = debounce(() => {
      this.renderOpt();
    }, 500);
  },
  methods: {
    renderOpt() {
      const options = this.getOption();
      this.instance.myChart.setOption(options, true);
    },
    initDom() {
      const { componentId } = this.config;
      // eslint-disable-next-line max-len
      this.instance = Object.freeze({ myChart: echarts.init(document.getElementById(componentId)) });
      const option = this.getOption();
      // 绘制图表
      this.instance.myChart.setOption(option, true);
    },
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer.takeRecords();
      this.observer = null;
    }
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
  box-sizing: border-box;

  .singleTextContent {
    width: calc(100%);
    height: calc(100%);
    position: relative;
    margin: 0 auto;
  }

  .pieHook {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
}
</style>
