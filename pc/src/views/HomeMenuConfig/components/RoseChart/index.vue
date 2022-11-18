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
import { PieChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { supplementaryColor, returnChartPosition } from '../../constants/common';
import { menuProperties } from '../../constants/global';
// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
// 注册必须的组件
echarts.use([
  TitleComponent, TooltipComponent, PieChart, GraphChart, CanvasRenderer, LegendScrollComponent
]);

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return menuProperties;
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
      supplementaryColor: [] // 补充色
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const {
        width,
        height
      } = this.config;
      console.log(width, height);
      return `width:${width}px;height:${height}px;`;
    },
    getTextStyles() {
      return function () {
        let styles = `line-height:${this.config.height}px;`;
        const {
          stylesObj = {},
          gradientType,
          enableBackground
        } = this.config;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          ...rest
        } = stylesObj;
        Object.keys(rest)
          .forEach((item) => {
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
        const {
          stylesObj, enableLegend, dataType, dataConfig, SqlDataConfig, apiDataConfig
        } = this.config;
        const { staticValue = '[]' } = dataConfig;
        const {
          legendPosition,
          legendFontFamily,
          legendFontWeight,
          legendColor,
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
          borderRadius,
          pieHorizontal,
          pieVertical,
          colorArr
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        const optionConfig = {
          tooltip: {
            trigger: 'item'
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
        let supplementaryColorArr = []; let
          list = [];
        if (dataType === 1) {
          list = JSON.parse(staticValue);
          const ln = list.length; // 数据长度
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        if (dataType === 2) {
          const { apiFilterResponse = '[]' } = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          const ln = list.length; // 数据长度
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        if (dataType === 3) {
          const { SQLFilterResponse = '[]' } = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          const ln = list.length; // 数据长度
          supplementaryColorArr = supplementaryColor(ln, cn);
        }
        chartConfig.data = list;
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
            show: labelPosition === 'outer'
            // length: 120,
            // length2: 20,
          },
          itemStyle: {
            borderRadius
          },
          // emphasis: {
          //   label: {
          //     show: true,
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
  beforeMount() {
  },
  mounted() {
    this.initDom();
    const MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver || window.MozMutationObserver;
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
    this.observer.observe(element, {
      attributes: true,
      attributeFilter: ['style'],
      attributeOldValue: true
    });
  },
  watch: {
    config: {
      deep: true,
      handler(val) {
        if (this.instance && val) {
          setTimeout(() => {
            const options = this.getOption();
            try {
              this.instance.myChart.setOption(options);
            } catch (error) {
              this.instance.myChart.dispose();
              this.initDom();
            } finally {
              // this.instance.myChart.setOption(options);
            }
          }, 1000);
        }
      }
    }
  },
  methods: {
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
    width: calc(100% - 40px);
    height: calc(100% - 40px);
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
