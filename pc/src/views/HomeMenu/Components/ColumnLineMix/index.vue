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
  </div>
</template>

<script>
import { isEqual } from 'lodash';
// 引入基本模板
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, GraphChart, LineChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent, DataZoomComponent, GridComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { getInfoById } from '@/api/design';
import { supplementaryColor, returnChartPosition } from '@/views/HomeMenuConfig/constants/common';

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
    activeComponent: {
      type: Object,
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
      instance: null,
      observer: null,
      recordOldValue: { // 记录下旧的宽高数据，避免重复触发回调函数
        width: '0',
        height: '0'
      },
      supplementaryColor: [], // 补充色
      list: []
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const { width, height, top, left, stylesObj } = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
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
        let supplementaryColorArr = []; let legendData; const series = []; let
          list;
        if (dataType === 1) {
          list = JSON.parse(staticValue);
        }
        if (dataType === 2 || dataType === 3) {
          list = this.list;
        }
        const { list: dataList, xAxis = [] } = list;
        // eslint-disable-next-line prefer-const
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
              emphasis: {
                focus: 'series'
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
          tooltip: {
            show: true,
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 0,
            textStyle: {
              color: '#fff'
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#333'
              }
            }
          },
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
            type: 'scroll',
            pageIconColor: '#010b1a',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#010b1a'
            },
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            },
            itemWidth: 10,
            itemHeight: 10,
            data: legendData
          },
          xAxis: {
            type: XDataType,
            data: xAxis,
            boundaryGap: true,
            show: enableXAxis,
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
  mounted() {
    this.initDom();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const params = this.getParameters();
        const { isShow } = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.fetchData();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.fetchData();
        }
      }
    }
  },
  methods: {
    getParameters() {
      const { id, componentId } = this.config;
      const reduce = (obj) => // 将Object 处理成 Array
        Object.keys(obj).map((item) => ({
          name: item,
          value: obj[item]
        }));

      const { query } = this.$route;
      const satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        });
      }
      const currentParams = {
        ...satisfyParams,
        ...query
      };
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },
    initDom() {
      const { componentId } = this.config;
      // eslint-disable-next-line max-len
      this.instance = Object.freeze({ myChart: echarts.init(document.getElementById(componentId)) });
      this.fetchData();
    },
    async fetchData() {
      if (!this.instance) return;
      const { dataType } = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
      }
      if (dataType === 2) {
        await this.getApi();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
      }
      if (dataType === 3) {
        await this.getSQL();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
      }
      // getInfoById
    },
    async getApi() {
      const { apiDataConfig } = this.config;
      const params = this.getParameters();
      const res = await getInfoById(params) || [];
      if (res.length) {
        const obj = res[0] || {};
        const targetObj = obj.response || '{}';
        const {
          enableApiFilter,
          enableApiAutoUpdate,
          apiUpdateTime = 1,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          // eslint-disable-next-line no-unused-expressions
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(async () => {
            await this.getApi();
            this.instance.myChart.clear();
            const option = this.getOption();
            // 绘制图表
            this.instance.myChart.setOption(
              option
            );
          }, time);
        }
        const list = JSON.parse(targetObj);
        if (!enableApiFilter) {
          this.list = list;
          return;
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(list);
          // if (!(Array.isArray(result) && result.length)) {
          //   this.list = [];
          //   return
          // }
          this.list = result;
        }
      }
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        // eslint-disable-next-line no-unused-expressions
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.getSQL();
          this.instance.myChart.clear();
          const option = this.getOption();
          // 绘制图表
          this.instance.myChart.setOption(option);
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        // if (!(Array.isArray(result) && result.length)) {
        //   this.list = {};
        //   return
        // }
        this.list = result;
        return;
      }
      this.list = res;
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
