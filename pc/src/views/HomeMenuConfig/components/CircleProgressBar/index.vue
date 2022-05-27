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
import { TitleComponent, TooltipComponent, LegendScrollComponent, GraphicComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { toFixed } from '@/utils/utils';
import { returnChartPosition } from '../../constants/common';

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
      }
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
      return this.list;
    },
    getOption() {
      return function () {
        const {
          stylesObj,
          enableLegend,
          dataType,
          dataConfig,
          SqlDataConfig,
          apiDataConfig
        } = this.config;
        const { staticValue = '{}' } = dataConfig;
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
          outerCircle,
          InnerCircle,
          barBgColor,
          barColor,
          colorArr
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
            trigger: 'item'
          }
        };
        let chartConfig = {};
        const cn = colorArr.length; // 颜色长度
        // let supplementaryColorArr = [], list = [];
        let list = null;
        if (dataType === 1) {
          console.log(staticValue);
          list = JSON.parse(staticValue);
          // const ln = list.length; // 数据长度
          // supplementaryColorArr = supplementaryColor(ln, cn)
        }
        if (dataType === 2) {
          const { apiFilterResponse = '{}' } = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          // const ln = list.length; // 数据长度
          // supplementaryColorArr = supplementaryColor(ln, cn)
        }
        if (dataType === 3) {
          const { SQLFilterResponse = '{}' } = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          // const ln = list.length; // 数据长度
          // supplementaryColorArr = supplementaryColor(ln, cn)
        }
        const { total = 0, value = 0 } = list;
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
          label: {
            show: false
          },
          labelLine: {
            show: false
            // length: 120,
            // length2: 20,
          },
          emphasis: {
            label: {
              show: false
              // fontSize: labelFontSize,
              // fontWeight: labelFontWeight,
              // fontFamily: labelFontFamily
            }
          },
          tooltip: {
            position: 'top'
          },
          type: 'pie'
        };
        if (cn) {
          chartConfig.itemStyle = {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            normal: {
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
    const MutationObserver = window.MutationObserver
        || window.WebKitMutationObserver
        || window.MozMutationObserver;
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
    'config.stylesObj.labelPosition': {
      handler(val, old) {
        if (val !== old && this.instance) {
          this.instance.myChart.clear();
        }
      }
    },
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
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      // console.log('web', 'zz');
      // this.$nextTick(() => {
      //   this.$emit("updateActiveComponent", this.config);
      // })
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
