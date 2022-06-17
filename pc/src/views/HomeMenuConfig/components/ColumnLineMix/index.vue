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
import { BarChart, GraphChart, LineChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent, DataZoomComponent, GridComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { debounce } from '@/utils/utils';
import { supplementaryColor, returnChartPosition } from '../../constants/common';

echarts.use([
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LineChart,
  GraphChart,
  BarChart,
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
    // VueDragResize
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
          stylesObj,
          enableLegend,
          dataType,
          dataConfig,
          enableGrid,
          enableXAxis,
          enableYAxis,
          enableData,
          enableY1Axis,
          apiDataConfig,
          SqlDataConfig,
          enableFullArea,
          enableLabel
        } = this.config;
        const { staticValue } = dataConfig;
        const {
          gridLeft,
          gridTop,
          gridRight,
          gridBottom,
          groupDisplay,
          lineStyleType,
          lineWidth,
          symbolSize,
          symbol,
          legendPosition,
          legendFontFamily,
          legendFontWeight,
          legendFontSize,
          legendColor,
          labelField,
          labelPrefix,
          labelSuffix,
          labelPosition,
          labelFontFamily,
          labelFontWeight,
          labelFontSize,
          labelColor,
          XLineColor,
          XDataType,
          XName,
          XFontFamily,
          XFontWeight,
          XFontSize,
          XColor,
          XTickEnable,
          XTickColor,
          XTickLabelFontFamily,
          XTickLabelFontWeight,
          XTickLabelFontSize,
          XTickLabelColor,
          YLineColor,
          YDataType,
          YName,
          YFontFamily,
          YFontWeight,
          YFontSize,
          YColor,
          YTickEnable,
          YTickColor,
          YTickLabelFontFamily,
          YTickLabelFontWeight,
          YTickLabelFontSize,
          YTickLabelColor,
          colorArr,
          barGroupDisplay = 'group', // 柱状图分组展示， group， stack
          innerGroupSpace = 10, // 组内间距， 只有分组时才生效
          interGroupSpace = 30, // 组间间距， 柱子和其他柱子的间隔
          barWidth = 25, // 柱子宽度
          borderRadius = 0, // 柱子顶部倒角
          labelBarField = 'y', // 标注字段
          labelBarPrefix = '', // 标注前缀
          labelBarSuffix = '', // 标注后缀
          labelBarFontFamily = '微软雅黑', // 标注字体
          labelBarFontWeight = 'normal', // 标注文字粗细
          labelBarFontSize = 12, // 标注文字大小
          labelBarColor = '#FFF', // 标注字体颜色
          labelBarPosition = 'top', // 标注位置，顶部， 内部，底部
          Y1LineColor = '#fff', // Y轴轴颜色
          Y1DataType = 'value',
          Y1Name = '', // Y轴 标题名称
          Y1FontFamily = '微软雅黑', // Y轴字体
          Y1FontWeight = 'normal', // Y轴文字粗细
          Y1FontSize = 12, // Y轴文字大小
          Y1Color = '#FFF', // Y轴字体颜色
          Y1TickEnable = false, // Y轴刻度
          Y1TickColor = '#fff', // Y轴刻度颜色
          Y1TickLabelFontFamily = '微软雅黑', // Y轴字体
          Y1TickLabelFontWeight = 'normal', // Y轴文字粗细
          Y1TickLabelFontSize = 12, // Y轴文字大小
          Y1TickLabelColor = '#FFF' // Y轴字体颜色
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        const cn = colorArr.length; // 颜色长度
        const getPos = (type) => {
          if (type === 'top') {
            return 'insideTop';
          }
          if (type === 'middle') {
            return ['50%', '50%'];
          }
          if (type === 'bottom') {
            return 'insideBottom';
          }
          return '';
        };
        let supplementaryColorArr = [];
        let legendData = [];
        const series = [];
        let list = [];
        if (dataType === 1) {
          list = JSON.parse(staticValue);
        }
        if (dataType === 2) {
          const { apiFilterResponse = '{}' } = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        if (dataType === 3) {
          const { SQLFilterResponse = '{}' } = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          console.log(list,);
          // if (!(Array.isArray(list) && list.length)) {
          //   list = [];
          // }
        }
        const { list: dataList, xAxis = [] } = list;
        legendData = dataList.map((item) => item.name); // 确定图例
        const ln = legendData.length;
        supplementaryColorArr = supplementaryColor(ln, cn);
        dataList.forEach((item, index) => {
          const { data = [], type, name, yAxisIndex } = item;
          const newColorArr = [...colorArr, ...supplementaryColorArr];
          if (type === 'line') {
            const obj = {
              name,
              data,
              type,
              symbol,
              symbolSize,
              yAxisIndex,
              smooth: groupDisplay === 'curve',
              step: groupDisplay === 'trapezoid',
              itemStyle: {
                color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff'
              },
              label: {
                show: true,
                align: 'center',
                color: labelColor,
                fontWeight: labelFontWeight,
                fontFamily: labelFontFamily,
                fontSize: labelFontSize,
                position: getPos(labelPosition),
                formatter: (params) => {
                  if (labelField === 'y') {
                    return `${labelPrefix}${params.value}${labelSuffix}`;
                  }
                  if (labelField === 'x') {
                    return `${labelPrefix}${params.name}${labelSuffix}`;
                  }
                  return '';
                }
              },
              lineStyle: {
                type: lineStyleType,
                cap: 'round',
                width: lineWidth
              }
            };
            if (enableFullArea) {
              obj.areaStyle = {
                origin: 'auto',
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [{
                    offset: 0, color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff' // 0% 处的颜色
                  }, {
                    offset: 1, color: newColorArr[index].c2 || newColorArr[index].c1 || '#fff' // 100% 处的颜色
                  }],
                  global: false // 缺省为 false
                }
              };
            }
            series.push(obj);
          }
          if (type === 'bar') {
            const obj = {
              name,
              data,
              type,
              showBackground: false,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              },
              label: {
                show: enableLabel,
                align: 'center',
                color: labelBarColor,
                fontWeight: labelBarFontWeight,
                fontFamily: labelBarFontFamily,
                fontSize: labelBarFontSize,
                position: getPos(labelBarPosition),
                formatter: (params) => {
                  if (labelBarField === 'y') {
                    return `${labelBarPrefix}${params.value}${labelBarSuffix}`;
                  }
                  if (labelBarField === 'x') {
                    return `${labelBarPrefix}${params.name}${labelBarSuffix}`;
                  }
                  return '';
                }
              },
              barWidth,
              itemStyle: {
                normal: {
                  borderRadius: [borderRadius, borderRadius, 0, 0],
                  color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                    offset: 0,
                    color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: newColorArr[index].c2 || newColorArr[index].c1 || '#fff' // 100% 处的颜色
                  }], false)
                }
              },
              barCategoryGap: interGroupSpace,
              barGap: `${innerGroupSpace}%`,
              stack: barGroupDisplay === 'group' ? false : 'add'
            };
            series.push(obj);
          }
        });
        const option = {
          dataZoom: [
            {
              type: 'slider',
              show: enableData,
              height: 15
            }

          ],
          legend: {
            ...legendPos,
            show: enableLegend,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            },
            type: 'scroll',
            pageIconColor: '#fff',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#fff'
            },
            itemWidth: 10,
            itemHeight: 10,
            data: legendData
          },
          xAxis: {
            type: XDataType,
            data: xAxis,
            show: enableXAxis,
            boundaryGap: true,
            axisLine: {
              show: enableXAxis,
              lineStyle: {
                color: XLineColor
              }
              // symbol: ['none', 'arrow'],
              // symbolOffset: [20, 10]
            },
            name: XName,
            nameTextStyle: {
              color: XColor,
              fontWeight: XFontWeight,
              fontFamily: XFontFamily,
              fontSize: XFontSize
            },
            axisTick: {
              show: XTickEnable,
              lineStyle: {
                color: XTickColor
              }
            },
            axisLabel: {
              show: enableXAxis,
              color: XTickLabelColor,
              fontWeight: XTickLabelFontWeight,
              fontSize: XTickLabelFontSize,
              fontFamily: XTickLabelFontFamily
            }
          },
          yAxis: [
            {
              splitLine: {
                show: false
              },
              name: YName,
              type: YDataType,
              show: enableYAxis,
              gridIndex: 0,
              axisLine: {
                show: enableYAxis,
                lineStyle: {
                  color: YLineColor
                }
                // symbol: ['none', 'arrow'],
                // symbolOffset: [20, 10]
              },
              nameTextStyle: {
                color: YColor,
                fontWeight: YFontWeight,
                fontFamily: YFontFamily,
                fontSize: YFontSize
              },
              axisTick: {
                show: YTickEnable,
                lineStyle: {
                  color: YTickColor
                }
              },
              axisLabel: {
                show: enableYAxis,
                color: YTickLabelColor,
                fontWeight: YTickLabelFontWeight,
                fontSize: YTickLabelFontSize,
                fontFamily: YTickLabelFontFamily
              }
            },
            {
              splitLine: {
                show: false
              },
              name: Y1Name,
              type: Y1DataType,
              gridIndex: 0,
              show: !enableYAxis ? false : enableY1Axis,
              axisLine: {
                show: enableYAxis,
                lineStyle: {
                  color: Y1LineColor
                }
                // symbol: ['none', 'arrow'],
                // symbolOffset: [20, 10]
              },
              nameTextStyle: {
                color: Y1Color,
                fontWeight: Y1FontWeight,
                fontFamily: Y1FontFamily,
                fontSize: Y1FontSize
              },
              axisTick: {
                show: Y1TickEnable,
                lineStyle: {
                  color: Y1TickColor
                }
              },
              axisLabel: {
                show: enableYAxis,
                color: Y1TickLabelColor,
                fontWeight: Y1TickLabelFontWeight,
                fontSize: Y1TickLabelFontSize,
                fontFamily: Y1TickLabelFontFamily
              }
            }
          ],
          series
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
    'config.stylesObj.YName': {
      handler(val, old) {
        if (val !== old && this.instance) {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.instance.myChart.clear();
          }, 300);
        }
      }
    },
    'config.stylesObj.Y1Name': {
      handler(val, old) {
        if (val !== old && this.instance) {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(() => {
            this.instance.myChart.clear();
          }, 300);
        }
      }
    },
    'config.enableFullArea': {
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
          // setTimeout(() => {
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
      console.log(options, 3333);
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
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
    },
    update(obj) {
      const { componentId } = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => item.componentId === componentId);
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
      });
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
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
