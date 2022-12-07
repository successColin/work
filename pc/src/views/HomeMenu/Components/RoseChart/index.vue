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
      v-loading="loading"
      class="singleTextWrap"
      :id="`basicPie_${config.componentId}`"
      :style="getContentStyles"
  >
    <div class="singleTextContent" :id="`basicPie_${config.componentId}${designType}`">
    </div>
  </div>
</template>

<script>
// 引入基本模板
import { getInfoById } from '@/api/design';
import { supplementaryColor, returnChartPosition, getRequestParams } from '@/views/HomeMenuConfig/constants/common';
import { isEqual } from 'lodash';
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
echarts.use([
  TitleComponent, TooltipComponent, PieChart, GraphChart, CanvasRenderer, LegendScrollComponent
]);
export default {
  props: {
    designType: {
      type: String,
      default: ''
    },
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
      content: [],
      myChart: null,
      observer: null,
      instance: null,
      timer: null,
      loading: false
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const { width, height, stylesObj, left, top } = this.config;
      return `width:${width}px;height:${height}px;left:${left}px;top: ${top}px;zIndex:${stylesObj.zIndex};`;
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
    getOption() {
      return function () {
        const { stylesObj, enableLegend, dataType, dataConfig } = this.config;
        const { staticValue } = dataConfig;
        const {
          legendPosition,
          legendFontFamily,
          legendFontWeight,
          legendFontSize,
          labelPosition,
          labelShowType,
          labelValueType,
          labelFontSize,
          labelFontFamily,
          labelFontWeight,
          labelColor,
          outerCircle,
          InnerCircle,
          colorArr,
          borderRadius,
          pieHorizontal,
          pieVertical,
          legendColor
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        const optionConfig = {
          tooltip: {
            show: true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 0,
            textStyle: {
              color: '#fff'
            },
            formatter (params) {
              const { marker, name, value, percent } = params;
              return `${marker} ${name}</br> 数量:  ${value}</br> 占比: ${percent}%`;
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#333'
              }
            }
          },
          legend: {
            ...legendPos,
            show: enableLegend,
            type: 'scroll',
            pageIconColor: '#fff',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#fff'
            },
            itemWidth: 10,
            itemHeight: 10,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            }
          }
        };
        let chartConfig = {};
        const cn = colorArr.length; // 颜色长度
        let supplementaryColorArr = [];
        if (dataType === 1) {
          const list = JSON.parse(staticValue);
          const ln = list.length; // 数据长度
          chartConfig.data = list;
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        if (dataType === 3 || dataType === 2) {
          const ln = this.content.length; // 数据长度
          chartConfig.data = this.content;
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        chartConfig = {
          ...chartConfig,
          roseType: 'radius',
          radius: [outerCircle, InnerCircle],
          center: [`${pieHorizontal}%`, `${pieVertical}%`],
          label: {
            show: labelPosition !== 'none',
            color: labelColor,
            position: labelPosition,
            alignTo: 'labelLine',
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            fontFamily: labelFontFamily,
            // eslint-disable-next-line no-useless-concat
            formatter: labelShowType === 'type' ? labelValueType === 1 ? '{b}: {c}' : '{b}: {d}' + '%' : labelValueType === 1 ? '{c}' : '{d}' + '%'
          },
          labelLine: {
            show: labelPosition === 'outside'
            // length: 120,
            // length2: 20,
          },
          itemStyle: {
            borderRadius
          },
          // emphasis: {
          //   label: {
          //     show: labelPosition !== 'none',
          //     fontSize: labelFontSize,
          //     fontWeight: labelFontWeight,
          //     fontFamily: labelFontFamily
          //   }
          // },
          tooltip: {
            position: 'top'
          },
          type: 'pie'
        };
        if (cn) {
          chartConfig.itemStyle = {
            // emphasis: {
            //   shadowBlur: 10,
            //   shadowOffsetX: 0,
            //   shadowColor: 'rgba(0, 0, 0, 0.5)'
            // },
            normal: {
              borderRadius,
              color: (params) => {
                const colorList = [...colorArr, ...supplementaryColorArr];
                // eslint-disable-next-line max-len
                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                  offset: 0,
                  color: colorList[params.dataIndex].c1 || colorList[params.dataIndex].c2 || '#fff'
                }, {
                  offset: 1,
                  color: colorList[params.dataIndex].c2 || colorList[params.dataIndex].c1 || '#fff'
                }]);
              }
            }
          };
        }
        const series = [chartConfig];
        return {
          ...optionConfig,
          series
        };
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
    config(val) { // 普通的watch监听
      if (this.myChart && val) {
        const options = this.getOption();
        this.myChart.setOption(options);
      }
    },
    content: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.myChart && val) {
          const options = this.getOption();
          this.myChart.setOption(options);
        }
      }
    },
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        // const params = this.getParameters();
        const { isShow } = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && isShow) {
          this.fetchData();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && isShow) {
          this.fetchData();
        }
      }
    }
  },
  methods: {

    initDom() {
      const { componentId } = this.config;
      const domWrap = `basicPie_${componentId}${this.designType}`;
      this.myChart = echarts.init(document.getElementById(domWrap));
      this.instance = Object.freeze({ myChart: this.myChart });
      this.fetchData();
    },
    async fetchData() {
      if (!this.myChart) { return; }
      const { dataType } = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.myChart.setOption(
          option
        );
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
        this.loading = false;
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
          const option = this.getOption();
          this.myChart.clear();
          this.myChart.setOption(
            option
          );
        }, time);
      }
      if (!enableSQLFilter) {
        this.content = res;
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.content = result;
        return;
      }
      this.content = res;
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
  //overflow: hidden;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  .singleTextContent {
    width: calc(100%);
    height: calc(100%);
    position: relative;
    margin: 0 auto;
  }
}
</style>
