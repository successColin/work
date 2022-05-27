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
import { isEqual } from 'lodash';
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { PieChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent, GraphicComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { toFixed } from '@/utils/utils';
import { getInfoById } from '@/api/design';
import { returnChartPosition } from '@/views/HomeMenuConfig/constants/common';

// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
// 注册必须的组件
echarts.use([
  GraphicComponent,
  TitleComponent,
  TooltipComponent,
  PieChart,
  GraphChart,
  CanvasRenderer,
  LegendScrollComponent
]);

export default {
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    activeComponent: {
      type: Object,
      default() {
        return {};
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
      observer: null
    };
  },

  components: {},

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
    getList() {
      return this.$store.getters.list;
    },
    getOption() {
      return function () {
        const { stylesObj, enableLegend } = this.config;
        const {
          legendName,
          legendPosition,
          legendFontFamily,
          legendFontWeight,
          legendColor,
          legendFontSize,
          labelPosition,
          labelFontSize,
          labelFontFamily,
          labelFontWeight,
          labelColor,
          outerCircle,
          InnerCircle,
          label1Color = 'rgba(255, 255, 255, 0.7)', // 自定义1字体颜色
          label1FontSize = 16, // 自定义1文字大小
          label1FontFamily = 'Arial,苹方,微软雅黑', // 自定义1字体
          label1FontWeight = 'normal', // 自定义1文字粗细
          label1Prefix, // 前缀
          label1Suffix, // 后缀
          label2Color = 'rgba(255, 255, 255, 0.7)', // 自定义1字体颜色
          label2FontSize = 16, // 自定义1文字大小
          label2FontFamily = 'Arial,苹方,微软雅黑', // 自定义1字体
          label2FontWeight = 'normal', // 自定义1文字粗细
          label2Prefix, // 前缀
          label2Suffix, // 后缀
          barBgColor,
          barColor

        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        const optionConfig = {
          title: {
            show: enableLegend,
            text: legendName,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            },
            ...legendPos
          },
          tooltip: {
            show: false,
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
          }
        };
        let chartConfig = {};
        const { total = 0, value = 0 } = this.content;
        if (labelPosition === 1) {
          optionConfig.graphic = [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                // value当前进度
                text: `${total ? toFixed(value / total * 100, 2) : 0}%`,
                textAlign: 'center',
                fill: labelColor,
                font: `${labelFontWeight} ${labelFontSize}px ${labelFontFamily}`
              }
            }
          ];
        } else if (labelPosition === 2) {
          optionConfig.graphic = [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                // value当前进度
                text: `${label1Prefix}${value}${label1Suffix}`,
                textAlign: 'center',
                fill: label1Color,
                font: `${label1FontWeight} ${label1FontSize}px ${label1FontFamily}`
              }
            }
          ];
        } else if (labelPosition === 3) {
          optionConfig.graphic = [
            {
              type: 'text',
              left: 'center',
              top: '48%',
              style: {
                // value当前进度
                text: `${label1Prefix}${value}${label1Suffix}`,
                textAlign: 'center',
                fill: label1Color,
                font: `${label1FontWeight} ${label1FontSize}px ${label1FontFamily}`
              }
            },
            {
              type: 'text',
              left: 'center',
              top: '55%',
              style: {
                // value当前进度
                text: `${label2Prefix}${total}${label2Suffix}`,
                textAlign: 'center',
                fill: label2Color,
                font: `${label2FontWeight} ${label2FontSize}px ${label2FontFamily}`
              }
            }
          ];
        }
        chartConfig.data = [{
          value,
          itemStyle: {
            normal: {
              color: barColor,
              borderRadius: 10
            }
          }
        },
        // (maxValue进度条最大值 - value当前进度) + 颜色
        {
          value: total - value,
          itemStyle: {
            normal: {
              color: barBgColor
            }
          }
        }];

        chartConfig = {
          ...chartConfig,
          radius: [`${outerCircle}%`, `${InnerCircle}%`],
          labelLine: {
            show: false
          },
          emphasis: {
            label: {
              show: false,
              fontSize: labelFontSize,
              fontWeight: labelFontWeight,
              fontFamily: labelFontFamily
            }
          },
          tooltip: {
            position: 'top'
          },
          type: 'pie'
        };
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
  watch: {
    config(val) { // 普通的watch监听
      if (this.myChart && val) {
        const options = this.getOption();
        this.myChart.setOption(options);
      }
    },
    content: {
      deep: true,
      immediate: false,
      handler(val) {
        if (this.myChart && val) {
          const options = this.getOption();
          this.myChart.setOption(options);
        }
      }
    },
    otherParams: {
      deep: true,
      immediate: false,
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
      this.myChart = echarts.init(document.getElementById(componentId));
      this.fetchData();
    },
    async fetchData() {
      if (!this.myChart) {
        return;
      }
      const { dataType, dataConfig: { staticValue = '{}' } } = this.config;
      if (dataType === 1) {
        this.content = JSON.parse(staticValue);
        const option = this.getOption();
        // 绘制图表
        this.myChart.setOption(
          option
        );
      }
      if (dataType === 2) {
        await this.getApi();
      }
      if (dataType === 3) {
        await this.getSQL();
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
            this.myChart.clear();
            const option = this.getOption();
            this.myChart.setOption(
              option
            );
          }, time);
        }
        if (!enableApiFilter) {
          this.content = JSON.parse(targetObj);
          return;
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          this.content = result;
          return;
        }
        this.content = JSON.parse(targetObj);
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
}
</style>
