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
// // import { _hexToRgb } from '@/utils/utils';
// import {returnChartPosition} from '@/utils/utils';
// // import {supplementaryColor} from '@/utils/common';
// import {screenConfig} from '@/constants/global';
// // 引入基本模板
// // eslint-disable-next-line no-undef
// let echarts = require('echarts')
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { GaugeChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { returnChartPosition } from '../../constants/common';
// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GaugeChart,
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
    getList() {
      return this.list;
    },
    getOption() {
      return function () {
        const {
          stylesObj, enableLegend, dataType, dataConfig, SqlDataConfig, apiDataConfig,
          axisLine = false, // 是否启用仪表盘轴线
          progress = false, // 是否启用展示当前进度
          splitLine = false, // 是否启用分割线
          axisTick = false, // 是否启用刻度样式
          axisLabel = false, // 是否启用刻度标签
          pointer = false, // 是否启用指针
          anchor = false, // 指针圆心
          detail = true,
          boardConfig = []
        } = this.config;
        const {
          legendName = '',
          legendPosition = 'lt', // 图例位置
          legendFontFamily = 'Arial,苹方,微软雅黑', // 图例字体
          legendFontWeight = 'normal', // 图例文字粗细
          legendFontSize = 12, // 图例文字大小
          legendColor = '#FFF', // 图例字体颜色
          startAngle = 180, // 起始角度
          endAngle = 0, // 结束角度
          radius = 100, // 仪表盘半价
          max = 180, // 刻度最大值
          min = 0, // 刻度最小值
          splitNumber = 5, // 刻度分割段数
          roundCap = true, // 两端启用圆角
          axisLineWidth = 10, // 轴线宽度
          axisLineColorConfig = [], // 轴线颜色
          progressRoundCap = false, // 进度条
          progressWidth = 10, // 进度条宽度
          progressColor = '#58D9F9', // 进度条颜色
          splitLineLength = 10, // 分割线长度
          splitLineDistance = 10, // 分割线离轴线的距离
          splitLineColor = '#fff', // 分割线颜色
          splitLineWidth = 2, // 分割线宽度
          splitLineType = 'solid', // 分割线类型， 实现，虚线，点线
          axisTickSplitNumber = 5, // 分隔线之间分割的刻度数
          axisTickLength = 10, // 刻度线长
          axisTickDistance = 0, // 刻度线与轴线的距离
          axisTickColor = '#fff', // 刻度线颜色
          axisTickWidth = 10, // 刻度线宽度
          axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
          axisLabelDistance = 10, // 标签与刻度线的距离
          axisLabelFontFamily = 'Arial,苹方,微软雅黑', // 标签字体
          axisLabelFontWeight = 'normal', // 标签文字粗细
          axisLabelFontSize = 16, // 标签文字大小
          axisLabelColor = '#FFF', // 标签文字颜色
          icon = '', // 指针图标， 默认
          pointerLength = 60, // 指针长度
          pointerWidth = 30, // 指针宽度
          pointerColor = '#58D9F9', // 制作颜色
          anchorIcon = '', // 指针圆心图标， 默认
          anchorSize = 6, // 指针圆心大小
          anchorColor = '#000', // 指针圆心颜色
          horizontalOffset = 0, // 水平方向偏移
          verticalOffset = 35, // 垂直方向偏移
          detailFontFamily = 'Arial,苹方,微软雅黑',
          detailFontWeight = 'normal',
          detailFontSize = 16,
          detailColor = '#333',
          detailPrefix = '', // 值前缀
          detailSuffix = '' // 值后缀
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        const colorArr = axisLineColorConfig.map((item) => [item.name, item.value]);
        const optionConfig = {
          tooltip: {
            trigger: 'item'
          },
          title: {
            show: enableLegend,
            text: legendName,
            ...legendPos,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontFamily: legendFontFamily,
              fontSize: legendFontSize
            }
          }
        };
        let contentObj = null;
        if (dataType === 1) {
          const { staticValue = '{}' } = dataConfig;
          contentObj = JSON.parse(staticValue);
        }
        if (dataType === 2) {
          const { apiFilterResponse = '[]' } = apiDataConfig;
          contentObj = JSON.parse(apiFilterResponse);
        }
        if (dataType === 3) {
          const { SQLFilterResponse = '[]' } = SqlDataConfig;
          contentObj = JSON.parse(SQLFilterResponse);
        }
        const chartConfig = {
          type: 'gauge',
          radius: `${radius}%`,
          startAngle,
          endAngle,
          min,
          max,
          splitNumber,
          axisLine: {
            show: axisLine,
            roundCap,
            lineStyle: {
              width: axisLineWidth,
              color: colorArr.length ? colorArr : [[1, '#E6EBF8']]
            }
          },
          progress: {
            show: progress,
            width: progressWidth,
            roundCap: progressRoundCap,
            itemStyle: {
              color: progressColor
            }
          },
          splitLine: {
            show: splitLine,
            length: splitLineLength,
            distance: splitLineDistance,
            lineStyle: {
              color: splitLineColor,
              width: splitLineWidth,
              type: splitLineType
            }
          },
          axisTick: {
            show: axisTick,
            splitNumber: axisTickSplitNumber,
            length: axisTickLength,
            distance: axisTickDistance,
            lineStyle: {
              color: axisTickColor,
              width: axisTickWidth,
              type: axisTickType
            }
          },
          axisLabel: {
            show: axisLabel,
            distance: axisLabelDistance,
            color: axisLabelColor,
            fontWeight: axisLabelFontWeight,
            fontFamily: axisLabelFontFamily,
            fontSize: axisLabelFontSize
          },
          pointer: {
            show: pointer,
            icon,
            length: pointerLength,
            width: pointerWidth,
            itemStyle: {
              color: pointerColor
            }
          },
          anchor: {
            show: anchor,
            size: anchorSize,
            icon: anchorIcon,
            showAbove: true,
            itemStyle: {
              color: anchorColor
            }
          },
          detail: {
            show: detail,
            color: detailColor,
            fontWeight: detailFontWeight,
            fontSize: detailFontSize,
            fontFamily: detailFontFamily,
            offsetCenter: [`${horizontalOffset}%`, `${verticalOffset}%`],
            formatter (value) {
              return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
            }
          },
          data: [{
            value: contentObj.value || 0
          }]
        };
        const series = [chartConfig];
        if (boardConfig.length) {
          boardConfig.forEach((item) => {
            const {
              // eslint-disable-next-line no-shadow
              stylesObj,
              // eslint-disable-next-line no-shadow
              axisLine = false, // 是否启用仪表盘轴线
              // eslint-disable-next-line no-shadow
              progress = false, // 是否启用展示当前进度
              // eslint-disable-next-line no-shadow
              splitLine = false, // 是否启用分割线
              // eslint-disable-next-line no-shadow
              axisTick = false, // 是否启用刻度样式
              // eslint-disable-next-line no-shadow
              axisLabel = false, // 是否启用刻度标签
              // eslint-disable-next-line no-shadow
              pointer = false, // 是否启用指针
              // eslint-disable-next-line no-shadow
              anchor = false, // 指针圆心
              // eslint-disable-next-line no-shadow
              detail = true
            } = item;
            const {
              verticalCenter = 50, // 垂直中心坐标
              horizontalCenter = 50, // 水平中心坐标
              valueMappingField = '', // 值映射字段
              // eslint-disable-next-line no-shadow
              startAngle = 180, // 起始角度
              // eslint-disable-next-line no-shadow
              endAngle = 0, // 结束角度
              // eslint-disable-next-line no-shadow
              radius = 100, // 仪表盘半价
              // eslint-disable-next-line no-shadow
              max = 180, // 刻度最大值
              // eslint-disable-next-line no-shadow
              min = 0, // 刻度最小值
              // eslint-disable-next-line no-shadow
              splitNumber = 5, // 刻度分割段数
              // eslint-disable-next-line no-shadow
              roundCap = true, // 两端启用圆角
              // eslint-disable-next-line no-shadow
              axisLineWidth = 10, // 轴线宽度
              // eslint-disable-next-line no-shadow
              axisLineColorConfig = [], // 轴线颜色
              // eslint-disable-next-line no-shadow
              progressRoundCap = false, // 进度条
              // eslint-disable-next-line no-shadow
              progressWidth = 10, // 进度条宽度
              // eslint-disable-next-line no-shadow
              progressColor = '#58D9F9', // 进度条颜色
              // eslint-disable-next-line no-shadow
              splitLineLength = 10, // 分割线长度
              // eslint-disable-next-line no-shadow
              splitLineDistance = 10, // 分割线离轴线的距离
              // eslint-disable-next-line no-shadow
              splitLineColor = '#fff', // 分割线颜色
              // eslint-disable-next-line no-shadow
              splitLineWidth = 2, // 分割线宽度
              // eslint-disable-next-line no-shadow
              splitLineType = 'solid', // 分割线类型， 实现，虚线，点线
              // eslint-disable-next-line no-shadow
              axisTickSplitNumber = 5, // 分隔线之间分割的刻度数
              // eslint-disable-next-line no-shadow
              axisTickLength = 10, // 刻度线长
              // eslint-disable-next-line no-shadow
              axisTickDistance = 0, // 刻度线与轴线的距离
              // eslint-disable-next-line no-shadow
              axisTickColor = '#fff', // 刻度线颜色
              // eslint-disable-next-line no-shadow
              axisTickWidth = 10, // 刻度线宽度
              // eslint-disable-next-line no-shadow
              axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
              // eslint-disable-next-line no-shadow
              axisLabelDistance = 10, // 标签与刻度线的距离
              // eslint-disable-next-line no-shadow
              axisLabelFontFamily = 'Arial,苹方,微软雅黑', // 标签字体
              // eslint-disable-next-line no-shadow
              axisLabelFontWeight = 'normal', // 标签文字粗细
              // eslint-disable-next-line no-shadow
              axisLabelFontSize = 16, // 标签文字大小
              // eslint-disable-next-line no-shadow
              axisLabelColor = '#FFF', // 标签文字颜色
              // eslint-disable-next-line no-shadow
              icon = '', // 指针图标， 默认
              // eslint-disable-next-line no-shadow
              pointerLength = 60, // 指针长度
              // eslint-disable-next-line no-shadow
              pointerWidth = 30, // 指针宽度
              // eslint-disable-next-line no-shadow
              pointerColor = '#58D9F9', // 制作颜色
              // eslint-disable-next-line no-shadow
              anchorIcon = '', // 指针圆心图标， 默认
              // eslint-disable-next-line no-shadow
              anchorSize = 6, // 指针圆心大小
              // eslint-disable-next-line no-shadow
              anchorColor = '#000', // 指针圆心颜色
              // eslint-disable-next-line no-shadow
              horizontalOffset = 0, // 水平方向偏移
              // eslint-disable-next-line no-shadow
              verticalOffset = 35, // 垂直方向偏移
              // eslint-disable-next-line no-shadow
              detailFontFamily = 'Arial,苹方,微软雅黑',
              // eslint-disable-next-line no-shadow
              detailFontWeight = 'normal',
              // eslint-disable-next-line no-shadow
              detailFontSize = 16,
              // eslint-disable-next-line no-shadow
              detailColor = '#333',
              // eslint-disable-next-line no-shadow
              detailPrefix = '', // 值前缀
              // eslint-disable-next-line no-shadow
              detailSuffix = '' // 值后缀
              // eslint-disable-next-line no-shadow
            } = stylesObj;
            // eslint-disable-next-line no-shadow
            const colorArr = axisLineColorConfig.map((item) => [item.name, item.value]);
            // eslint-disable-next-line no-shadow
            const chartConfig = {
              type: 'gauge',
              radius: `${radius}%`,
              center: [`${horizontalCenter}%`, `${verticalCenter}%`],
              startAngle,
              endAngle,
              min,
              max,
              splitNumber,
              axisLine: {
                show: axisLine,
                roundCap,
                lineStyle: {
                  width: axisLineWidth,
                  color: colorArr.length ? colorArr : [[1, '#E6EBF8']]
                }
              },
              progress: {
                show: progress,
                width: progressWidth,
                roundCap: progressRoundCap,
                itemStyle: {
                  color: progressColor
                }
              },
              splitLine: {
                show: splitLine,
                length: splitLineLength,
                distance: splitLineDistance,
                lineStyle: {
                  color: splitLineColor,
                  width: splitLineWidth,
                  type: splitLineType
                }
              },
              axisTick: {
                show: axisTick,
                splitNumber: axisTickSplitNumber,
                length: axisTickLength,
                distance: axisTickDistance,
                lineStyle: {
                  color: axisTickColor,
                  width: axisTickWidth,
                  type: axisTickType
                }
              },
              axisLabel: {
                show: axisLabel,
                distance: axisLabelDistance,
                color: axisLabelColor,
                fontWeight: axisLabelFontWeight,
                fontFamily: axisLabelFontFamily,
                fontSize: axisLabelFontSize
              },
              pointer: {
                show: pointer,
                icon,
                length: pointerLength,
                width: pointerWidth,
                itemStyle: {
                  color: pointerColor
                }
              },
              anchor: {
                show: anchor,
                size: anchorSize,
                icon: anchorIcon,
                showAbove: true,
                itemStyle: {
                  color: anchorColor
                }
              },
              detail: {
                show: detail,
                color: detailColor,
                fontWeight: detailFontWeight,
                fontSize: detailFontSize,
                fontFamily: detailFontFamily,
                offsetCenter: [`${horizontalOffset}%`, `${verticalOffset}%`],
                formatter (value) {
                  console.log(value, 'zz');
                  return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
                }
              }
            };
            if (valueMappingField && contentObj[valueMappingField]) {
              chartConfig.data = [{
                value: contentObj[valueMappingField]
              }];
            } else {
              chartConfig.data = [];
            }
            series.push(chartConfig);
          });
        }
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
