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
      @deactivated="deactivated"
      :w="config.width"
      :h="config.height"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :x="config.left"
      :y="config.top"
      :minw="2"
      :minh="2"
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
    <div class="singleTextWrap" :id="`basicPie_${config.componentId}`" :style="getContentStyles"
         @contextmenu.prevent="show">
      <div class="singleTextContent" :id="config.componentId">
      </div>
      <div class="pieHook"></div>
    </div>
  </VueDragResize>
</template>

<script>
import {returnChartPosition, debounce} from '@/utils/utils';
import {screenConfig} from '@/constants/global';
// 引入基本模板
// eslint-disable-next-line no-undef
let echarts = require('echarts')

export default {
  props: {
    bgConfig: {
      type: Object,
      default(){
        return screenConfig
      }
    },
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

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const {width, height} = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getList() {
      return this.$store.getters.list;
    },
    makeData() { // 处理节点
      return function (list = []) {
        const obj = {};
        list.forEach((item) => {
          const { source, target } = item;
          if (!Object.hasOwn(obj, source)) {
            obj[source] = null;
          }
          if (!Object.hasOwn(obj, target)) {
            obj[target] = null;
          }
        });
        return Object.keys(obj).map((item) => {
          return { name: item };
        })
      }
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
          }
        })
      }
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
        const {staticValue} = dataConfig;
        let {
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
          const {apiFilterResponse = '[]'} = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        if (dataType === 3) {
          const {SQLFilterResponse = '[]'} = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        const nodes = this.makeData(list);
        const lastLevels = this.makeLevels(levels);
        let option = {
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
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let element = document.querySelector(`#basicPie_${this.config.componentId}`)
    this.observer = new MutationObserver(() => {
      let width = getComputedStyle(element).getPropertyValue('width')
      let height = getComputedStyle(element).getPropertyValue('height')
      if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
        return
      }
      this.recordOldValue = {
        width,
        height
      };
      this.instance.myChart.resize();
    })
    this.observer.observe(element, {attributes: true, attributeFilter: ['style'], attributeOldValue: true})
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
    },500);
  },
  methods: {
    renderOpt() {
      const options = this.getOption();
      this.instance.myChart.setOption(options, true);
    },
    initDom() {
      const {componentId} = this.config;
      this.instance = Object.freeze({myChart: echarts.init(document.getElementById(componentId))});
      const option = this.getOption();
      // 绘制图表
      this.instance.myChart.setOption(option, true);
    },
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
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
    if (this.observer) {
      this.observer.disconnect()
      this.observer.takeRecords()
      this.observer = null
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
