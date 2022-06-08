/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>

    <div
        class="singleTextWrap"
        :id="`basicPie_${config.componentId}`"
        :style="getContentStyles"
    >
      <div class="singleTextContent" :id="config.componentId">
      </div>
      <div class="pieHook"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent, DataZoomComponent, GridComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { debounce } from '@/utils/utils';
import { supplementaryColor } from '../../constants/common';
// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');

// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
// 注册必须的组件
echarts.use([
  GridComponent,
  TitleComponent,
  TooltipComponent,
  BarChart,
  GraphChart,
  DataZoomComponent,
  CanvasRenderer,
  LegendScrollComponent
]);

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

  components: {
  },

  computed: {
    getContentStyles() {
      const { width, height } = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getTextStyles() {
      return function () {
        let styles = `line-height:${this.config.height}px;`;
        const { stylesObj = {}, gradientType, enableBackground } = this.config;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          ...rest
        } = stylesObj;
        Object.keys(rest).forEach((item) => {
          let singStyle = `${item}:${stylesObj[item]}`;
          if (item === 'fontSize' || item === 'letterSpacing') {
            singStyle += 'px';
          }
          styles += `${singStyle}${singStyle ? ';' : ''}`;
        });

        if (gradientType === 1) { // 左右渐变
          styles += `background-image: linear-gradient(to right, ${color1}, ${color2});`;
        } else if (gradientType === 2) {
          styles += `background-image: -webkit-gradient(linear,0 0,0 bottom,from(${color1}),to(${color2}));`;
        }
        if (enableBackground) {
          styles += `text-shadow:${hShadow}px ${vShadow}px ${blur}px ${shadowColor};
          `;
        }
        return styles;
      };
    },
    getList() {
      return this.$store.getters.list;
    },
    getOption() {
      return function () {
        const {
          enableGrid,
          stylesObj,
          dataType,
          dataConfig,
          enableLabel,
          enableTitle,
          apiDataConfig,
          SqlDataConfig
        } = this.config;
        const {
          gridLeft,
          gridTop,
          gridRight,
          gridBottom,
          barWidth,
          borderRadius,
          barBgColor,
          colorArr,
          labelField,
          labelPrefix,
          labelSuffix,
          labelPosition,
          labelFontFamily,
          labelFontWeight,
          labelFontSize,
          labelColor,
          labelOffset,
          XFontFamily,
          XFontWeight,
          XFontSize,
          XColor,
        } = stylesObj;
        let supplementaryColorArr = [];
        const { staticValue } = dataConfig;
        let list = [];
        const cn = colorArr.length; // 颜色长度
        if (dataType === 1) {
          list = JSON.parse(staticValue);
        }
        if (dataType === 2) {
          const { apiFilterResponse = '[]' } = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
        }
        if (dataType === 3) {
          const { SQLFilterResponse = '[]' } = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
        }
        if (!(Array.isArray(list) && list.length)) {
          list = [];
        }
        const ln = list.length;
        supplementaryColorArr = supplementaryColor(ln, cn);
        const valueArr = list.map((item) => item.y || 0);
        const totalArr = list.map((item) => item.s || 0);
        const nameArr = list.map((item) => item.x || '');
        const newColorArr = [...colorArr, ...supplementaryColorArr];
        const option = {
          grid: { // 直角坐标系内绘图网格
            left: '10', // grid 组件离容器左侧的距离,
            // left的值可以是80这样具体像素值，
            // 也可以是'80%'这样相对于容器高度的百分比
            top: '10',
            right: '30',
            bottom: '0',
            containLabel: true // gid区域是否包含坐标轴的刻度标签。为true的时候，
            // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
            // 所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
          },
          xAxis: { // 直角坐标系grid中的x轴,
            // 一般情况下单个grid组件最多只能放上下两个x轴,
            // 多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
            type: 'value', // 坐标轴类型,分别有：
            // 'value'-数值轴；'category'-类目轴;
            // 'time'-时间轴;'log'-对数轴
            splitLine: { show: false }, // 坐标轴在 grid 区域中的分隔线
            axisLabel: { show: false }, // 坐标轴刻度标签
            axisTick: { show: false }, // 坐标轴刻度
            axisLine: { show: false }, // 坐标轴轴线
          },
          yAxis: {
            type: 'category',
            show: enableTitle,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              color: XColor,
              fontWeight: XFontWeight,
              fontFamily: XFontFamily,
              fontSize: XFontSize // 标签字号
            },
            data: nameArr// 类目数据，在类目轴（type: 'category'）中有效。
            // 如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
          },
          series: [// 系列列表。每个系列通过 type 决定自己的图表类型
            {
              name: '%', // 系列名称
              type: 'bar', // 柱状、条形图
              barWidth, // 柱条的宽度,默认自适应
              data: valueArr, // 系列中数据内容数组
              label: { // 图形上的文本标签
                show: enableLabel,
                position: labelPosition, // 标签的位置
                offset: [0, 0 - labelOffset], // 标签文字的偏移，此处表示向上偏移40
                // formatter: '{c}{a}', // 标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                formatter: (params) => {
                  if (labelField === 'y') {
                    return `${labelPrefix}${params.value}${labelSuffix}`;
                  }
                  if (labelField === 'x') {
                    const { dataIndex, value } = params;
                    const total = totalArr[dataIndex];
                    const result = ((value * 100) / (total * 100)) * 100;
                    const resultValue = result.toFixed(2);
                    return `${labelPrefix}${resultValue}%${labelSuffix}`;
                  }
                  return '';
                },
                color: labelColor, // 标签字体颜色
                fontWeight: labelFontWeight,
                fontFamily: labelFontFamily,
                fontSize: labelFontSize // 标签字号
              },
              itemStyle: { // 图形样式
                normal: { // normal 图形在默认状态下的样式;
                  // emphasis图形在高亮状态下的样式
                  barBorderRadius: borderRadius, // 柱条圆角半径,单位px.
                  // 此处统一设置4个角的圆角大小;
                  // 也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                  color(params) {
                    const num = newColorArr.length;
                    const index = params.dataIndex % num;
                    // return newColorArr[params.dataIndex % num]; // 返回颜色数组中的一个对应的颜色值
                    return {
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 1,
                      colorStops: [{
                        offset: 0, color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff'// 0% 处的颜色
                      }, {
                        offset: 1, color: newColorArr[index].c2 || newColorArr[index].c1 || '#fff' // 100% 处的颜色
                      }],
                      global: false // 缺省为 false
                    };
                  },
                }
              },
              zlevel: 1// 柱状图所有图形的 zlevel 值,
            },
            {
              name: '进度条背景',
              type: 'bar',
              label: { // 图形上的文本标签
                show: false,
                position: 'right', // 标签的位置
                offset: [0, 0], // 标签文字的偏移，此处表示向上偏移40
                // formatter: '{c}{a}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                color: 'rgba(0,0,0,.7)', // 标签字体颜色
                fontSize: 12 // 标签字号
              },
              barGap: '-100%', // 不同系列的柱间距离，为百分比。
              // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
              // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
              // 并且是对此坐标系中所有 'bar' 系列生效。
              barWidth,
              data: totalArr,
              color: barBgColor, // 柱条颜色
              itemStyle: {
                normal: {
                  barBorderRadius: borderRadius
                }
              }
            },
          ]
        };
        if (enableGrid) {
          option.grid = {
            left: gridLeft,
            right: gridRight,
            bottom: gridBottom,
            top: gridTop,
            containLabel: true
          };
        }
        return option;
      };
    }
  },
  beforeMount() {
  },
  mounted() {
    this.initDom();
    const MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;
    const element = document.querySelector(`#basicPie_${this.config.componentId}`);
    this.observer = new MutationObserver(() => {
      const width = getComputedStyle(element).getPropertyValue('width');
      const height = getComputedStyle(element).getPropertyValue('height');
      if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
        return;
      }
      this.recordOldValue = {
        width,
        height
      };
      this.instance.myChart.resize();
    });
    this.observer.observe(element, { attributes: true, attributeFilter: ['style'], attributeOldValue: true });
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
      this.instance.myChart.setOption(options);
    },
    initDom() {
      const { componentId } = this.config;
      this.instance = Object.freeze({
        myChart: echarts.init(document.getElementById(componentId))
      });
      const option = this.getOption();
      // 绘制图表
      this.instance.myChart.setOption(option);
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
