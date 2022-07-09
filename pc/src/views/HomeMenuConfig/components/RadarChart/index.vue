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
        :style="getContentStyles">
      <div class="singleTextContent" :id="config.componentId">
      </div>
      <div class="pieHook"></div>
    </div>
</template>

<script>
import { debounce } from '@/utils/utils';
// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendComponent
} from 'echarts/components';
import { RadarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { getXAxisByKey, returnChartPosition } from '../../constants/common';
import { menuProperties } from '../../constants/global';

echarts.use([
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer
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
      timer: null,
      list: []
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
        const { indicator, stylesObj,
          enableDimension, enableGlobalAxisLine,
          enableGlobalAxisTick, enableGlobalAxisLabel,
          enableGlobalSplitLine, dataType, apiDataConfig,
          enableGlobalSplitArea, enableLegend, dataConfig, customStyle = [],
          SqlDataConfig
        } = this.config;
        const {
          centerX, centerY, radius, nameGap, shape, splitNumber, axisNameColor,
          axisNameFontSize, axisNameFontFamily, axisNameFontWeight, axisColor,
          axisWidth, axisType, axisTickLength, axisTickColor, axisTickWidth, axisTickType,
          axisLabelRotate, axisLabelMargin, axisLabelColor, axisLabelFontWeight,
          axisLabelFontFamily, axisLabelFontSize, splitLineColor,
          splitLineWidth, splitLineType, colorArr, legendPosition,
          legendColor, legendFontWeight, legendFontSize, legendFontFamily, dataField
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        if (dataType === 1) {
          const { staticValue } = dataConfig;
          this.list = JSON.parse(staticValue) || [];
        }
        if (dataType === 2) {
          const { apiFilterResponse = '[]' } = apiDataConfig;
          try {
            this.list = JSON.parse(apiFilterResponse);
            if (!(Array.isArray(this.list) && this.list.length)) {
              this.list = [];
            }
          } catch (e) {
            this.list = [];
          }
        }
        if (dataType === 3) {
          const { SQLFilterResponse = '[]' } = SqlDataConfig;
          try {
            this.list = JSON.parse(SQLFilterResponse);
            if (!(Array.isArray(this.list) && this.list.length)) {
              this.list = [];
            }
          } catch (e) {
            this.list = [];
          }
        }
        const seriesArr = getXAxisByKey(this.list, 'x'); // 先找出来有几个系列
        const indicatorArr = indicator.filter((item) => item.enable);
        const lastData = [];
        seriesArr.forEach((item) => {
          const data = {
            name: item,
            value: []
          };
          indicatorArr.forEach((indicatorObj) => {
            const { fieldValue } = indicatorObj;
            const obj = this.list.find((listObj) => listObj.x === item && `${listObj[dataField]}` === `${fieldValue}`) || {};
            data.value.push(obj.value || 0);
          });
          lastData.push(data);
        });
        if (customStyle.length) {
          // console.log(customStyle, 'customStyle');
          const resultArr = customStyle.filter((item) => item.enable);
          lastData.forEach((item, index) => {
            const custom = resultArr[index];
            if (custom) {
              const {
                areaStyle,
                axisColor: axisColor1,
                axisLabelColor: axisLabelColor1,
                axisLabelFontFamily: axisLabelFontFamily1,
                axisLabelFontSize: axisLabelFontSize1,
                axisLabelFontWeight: axisLabelFontWeight1,
                axisLabelMargin: axisLabelMargin1,
                axisLabelRotate: axisLabelRotate1,
                colorArr: colorArr1,
                enableHover,
                enableLabel,
                enableSplitArea,
                labelColor,
                lineColor,
                show,
                splitLineType: splitLineType1,
                splitLineWidth: splitLineWidth1
              } = custom;
              item.label = {
                show,
                rotate: axisLabelRotate1,
                distance: axisLabelMargin1,
                color: axisLabelColor1,
                fontSize: axisLabelFontSize1,
                fontFamily: axisLabelFontFamily1,
                fontWeight: axisLabelFontWeight1
              };
              item.lineStyle = {
                color: axisColor1,
                width: splitLineWidth1,
                type: splitLineType1
              };
              if (enableSplitArea) {
                item.areaStyle = {
                  color: colorArr1
                };
              }
              if (enableHover) {
                item.emphasis = {
                  label: {
                    show: enableLabel,
                    color: labelColor
                  },
                  lineStyle: {
                    color: lineColor
                  },
                  areaStyle: {
                    color: areaStyle
                  }
                };
              }
            }
          });
        }
        const series = [
          {
            name: '',
            type: 'radar',
            data: lastData
          }];
        const option = {
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
            pageIconColor: '#010b1a',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#010b1a'
            },
            itemWidth: 10,
            itemHeight: 10
            // data: legendData
          },
          radar: {
            center: [`${centerX}%`, `${centerY}%`],
            radius: `${radius}%`,
            nameGap,
            splitNumber,
            shape,
            indicator: indicatorArr,
            axisName: {
              show: enableDimension,
              color: axisNameColor,
              fontFamily: axisNameFontFamily,
              fontSize: axisNameFontSize,
              fontWeight: axisNameFontWeight
            },
            axisLine: {
              show: enableGlobalAxisLine,
              lineStyle: {
                color: axisColor,
                width: axisWidth,
                type: axisType
              }
            },
            axisTick: {
              show: enableGlobalAxisTick,
              length: axisTickLength,
              lineStyle: {
                color: axisTickColor,
                width: axisTickWidth,
                type: axisTickType
              }
            },
            axisLabel: {
              show: enableGlobalAxisLabel,
              rotate: axisLabelRotate,
              margin: axisLabelMargin,
              color: axisLabelColor,
              fontWeight: axisLabelFontWeight,
              fontFamily: axisLabelFontFamily,
              fontSize: axisLabelFontSize
            },
            splitLine: {
              show: enableGlobalSplitLine,
              lineStyle: {
                color: splitLineColor.map((item) => item.c1),
                width: splitLineWidth,
                type: splitLineType
              }
            },
            splitArea: {
              show: enableGlobalSplitArea,
              areaStyle: {
                color: colorArr.map((item) => item.c1)
              }
            }
          },
          series
        };
        return option;
      };
    }
  },
  mounted() {
    this.initDom();
    // eslint-disable-next-line max-len
    const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
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
      // eslint-disable-next-line max-len
      this.instance = Object.freeze({ myChart: echarts.init(document.getElementById(componentId)) });
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
