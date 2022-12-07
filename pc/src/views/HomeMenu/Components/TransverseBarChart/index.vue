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
// 引入基本模板
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent, DataZoomComponent, GridComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { getInfoById } from '@/api/design';
import {
  supplementaryColor,
  returnChartPosition,
  getXAxisByKey,
  getRequestParams
} from '@/views/HomeMenuConfig/constants/common';
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
      list: [],
      timer: null,
      params: {},
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
          enableLabel,
          enableLegend,
          dataType,
          dataConfig,
          enableGrid,
          enableXAxis,
          enableYAxis,
          enableData,
          dimension
        } = this.config;
        const { staticValue } = dataConfig;
        const {
          gridLeft,
          gridTop,
          gridRight,
          gridBottom,
          groupDisplay,
          innerGroupSpace,
          interGroupSpace,
          barWidth,
          borderRadius,
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
          colorArr
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        const cn = colorArr.length; // 颜色长度
        let supplementaryColorArr = []; let YAxis; let legendData; const series = []; let
          list;
        if (dataType === 1) {
          list = JSON.parse(staticValue);
          YAxis = getXAxisByKey(list, dimension); // x轴的数据
          legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
          const ln = legendData.length;
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        if (dataType === 2 || dataType === 3) {
          list = this.list;
          YAxis = getXAxisByKey(list, dimension); // x轴的数据
          legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
          const ln = legendData.length;
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        legendData.forEach((item, index) => {
          const data = [];
          const newColorArr = [...colorArr, ...supplementaryColorArr];
          YAxis.forEach((x) => {
            const current = list.find((li) => li[dimension] === x && li[dimension === 'x' ? 's' : 'x'] === item);
            try {
              data.push(current.y);
            } catch (e) {
              this.$message.error('请保持数据准确性!');
            }
          });
          const obj = {
            name: item,
            data,
            type: 'bar',
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
              color: labelColor,
              fontWeight: labelFontWeight,
              fontFamily: labelFontFamily,
              fontSize: labelFontSize,
              position: labelPosition,
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
            barWidth,
            itemStyle: {
              normal: {
                borderRadius: [0, borderRadius, borderRadius, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
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
            stack: groupDisplay === 'group' ? false : 'add'
          };
          series.push(obj);
        });
        const option = {
          tooltip: {
            show: true,
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
            splitLine: {
              show: false
            },
            type: XDataType,
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
          yAxis: {
            data: YAxis,
            splitLine: {
              show: false
            },
            type: YDataType,
            show: enableYAxis,
            axisLine: {
              show: enableYAxis,
              lineStyle: {
                color: YLineColor
              }
              // symbol: ['none', 'arrow'],
              // symbolOffset: [20, 10]
            },
            name: YName,
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
  activated() {
    this.initDom();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        if (v && o) {
          const { dataType, SqlDataConfig: {
            enableDataManage, variableConfig = []
          } } = this.config;
          if (dataType === 3 && enableDataManage && variableConfig.length) {
            this.checkParams(variableConfig);
          }
        }
      }
    }
  },
  methods: {
    checkParams(variableConfig) {
      const obj = {};
      Object.keys(this.otherParams).forEach((item) => {
        const currentVar = variableConfig.find((varObj) => varObj.name === item);
        if (currentVar) {
          obj[item] = this.otherParams[item];
        }
      });
      if (JSON.stringify(obj) !== '{}') {
        this.fetchData();
      }
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
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const { query = {}, name } = this.$route;
      const params = getRequestParams({
        config: this.config,
        routeQuery: name !== 'appCustomPage' ? {} : query,
        otherParams: this.otherParams,
        elseParams: this.params || {}
      });
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
          this.instance.myChart.setOption(
            option
          );
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
        if (!(Array.isArray(result) && result.length)) {
          this.list = [];
          return;
        }
        this.list = result;
        return;
      }
      this.list = res;
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  deactivated() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
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
