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
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
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
// import { _hexToRgb } from '@/utils/utils';
import {returnChartPosition} from '@/utils/utils';
// import {supplementaryColor} from '@/utils/common';
import {screenConfig} from '@/constants/global';
// 引入基本模板
// eslint-disable-next-line no-undef
let echarts = require('echarts')

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
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
      }
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
        let {
          legendName = '',
          legendPosition = 'lt', // 图例位置
          legendFontFamily = 'Arial,苹方,微软雅黑', // 图例字体
          legendFontWeight = 'normal', // 图例文字粗细
          legendFontSize = 12, // 图例文字大小
          legendColor = '#FFF', // 图例字体颜色
          startAngle = 180, //起始角度
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
          axisTickWidth = 10, //刻度线宽度
          axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
          axisLabelDistance = 10, // 标签与刻度线的距离
          axisLabelFontFamily = 'Arial,苹方,微软雅黑', //标签字体
          axisLabelFontWeight = 'normal', //标签文字粗细
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
        let legendPos = returnChartPosition(legendPosition);
        const colorArr = axisLineColorConfig.map((item) => [item.name, item.value])
        let optionConfig = {
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
          const {staticValue = '{}'} = dataConfig;
          contentObj = JSON.parse(staticValue);
        }
        if (dataType === 2) {
          const {apiFilterResponse = '[]'} = apiDataConfig;
          contentObj = JSON.parse(apiFilterResponse);
        }
        if (dataType === 3) {
          const {SQLFilterResponse = '[]'} = SqlDataConfig;
          contentObj = JSON.parse(SQLFilterResponse);
        }
        let chartConfig = {
          type: 'gauge',
          radius: `${radius}%`,
          startAngle,
          endAngle,
          min,
          max,
          splitNumber,
          axisLine: {
            show: axisLine,
            roundCap: roundCap,
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
            icon: icon,
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
            formatter: function (value) {
              return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
            }
          },
          data: [{
            value: contentObj.value || 0
          }]
        };
        let series = [chartConfig];
        if (boardConfig.length) {
          boardConfig.forEach((item) => {
            const {
              stylesObj,
              axisLine = false, // 是否启用仪表盘轴线
              progress = false, // 是否启用展示当前进度
              splitLine = false, // 是否启用分割线
              axisTick = false, // 是否启用刻度样式
              axisLabel = false, // 是否启用刻度标签
              pointer = false, // 是否启用指针
              anchor = false, // 指针圆心
              detail = true
            } = item;
            let {
              verticalCenter = 50, // 垂直中心坐标
              horizontalCenter = 50, // 水平中心坐标
              valueMappingField = '', // 值映射字段
              startAngle = 180, //起始角度
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
              axisTickWidth = 10, //刻度线宽度
              axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
              axisLabelDistance = 10, // 标签与刻度线的距离
              axisLabelFontFamily = 'Arial,苹方,微软雅黑', //标签字体
              axisLabelFontWeight = 'normal', //标签文字粗细
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
            const colorArr = axisLineColorConfig.map((item) => [item.name, item.value])
            let chartConfig = {
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
                roundCap: roundCap,
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
                icon: icon,
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
                formatter: function (value) {
                  return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
                }
              }
            };
            if (valueMappingField && contentObj[valueMappingField]) {
              chartConfig.data = [{
                value: contentObj[valueMappingField]
              }]
            } else {
              chartConfig.data = []
            }
            series.push(chartConfig);
          })
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
      const {componentId} = this.config;
      // stylesObj: {colorArr}, dataType, dataConfig: {staticValue,}
      // if (dataType === 1) {
      //   const list = JSON.parse(staticValue);
      //   if (list.length > colorArr.length) {
      //   }
      // }
      this.instance = Object.freeze({myChart: echarts.init(document.getElementById(componentId))});
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
