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
import {returnChartPosition, getXAxisByKey, debounce} from '@/utils/utils';
import {firstReduce, getChartMarkLineConfig, supplementaryColor} from '@/utils/common';
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
      },
      timer: null
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
    getTextStyles() {
      return function () {
        // let styles = `width: ${this.config.width}px;height: ${this.config.height}px;line-height:${this.config.height}px;`;
        let styles = `line-height:${this.config.height}px;`;
        const {stylesObj = {}, gradientType, enableBackground} = this.config;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          ...rest
        } = stylesObj;
        Object.keys(rest).forEach(item => {
          let singStyle = `${item}:${stylesObj[item]}`
          if (item === 'fontSize' || item === 'letterSpacing') {
            singStyle += 'px'
          }
          styles += `${singStyle}${singStyle ? ';' : ''}`
        })

        if (gradientType === 1) { // 左右渐变
          styles += `background-image: linear-gradient(to right, ${color1}, ${color2});`
        } else if (gradientType === 2) {
          styles += `background-image: -webkit-gradient(linear,0 0,0 bottom,from(${color1}),to(${color2}));`
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
          dimension,
          apiDataConfig,
          SqlDataConfig,
          enableLabel,
          markLineConfig = []
        } = this.config;
        const {staticValue} = dataConfig;
        let {
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
          YTickLabelRotate = 0,
          XTickLabelRotate = 0,
          colorArr
        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        const cn = colorArr.length; // 颜色长度
        let supplementaryColorArr = [], YAxis, legendData = [], series = [], list = [];
        if (dataType === 1) {
          list = JSON.parse(staticValue);

        }
        if (dataType === 2) {
          const {apiFilterResponse = '[]'} = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        if (dataType === 3) {
          const {SQLFilterResponse = '[]'} = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          if (!(Array.isArray(list) && list.length)) {
            list = [];
          }
        }
        YAxis = getXAxisByKey(list, dimension); // x轴的数据
        legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
        const ln = legendData.length;
        supplementaryColorArr = supplementaryColor(ln, cn)
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
          })
          let obj = {
            name: item,
            data: data,
            type: 'bar',
            showBackground: false,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
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
            stack: groupDisplay === 'group' ? false : 'add',
            markPoint: {
              data: []
            },
            markLine: {
              data: []
            }
          };
          obj = firstReduce(obj, this.config);
          obj = getChartMarkLineConfig({baseConfig: obj, name: item, markLineConfig});
          series.push(obj);
        })
        let option = {
          dataZoom: [
            {
              type: 'slider',
              show: enableData
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
            splitLine: {
              show: false
            },
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
              fontFamily: XTickLabelFontFamily,
              rotate: XTickLabelRotate
            }
          },
          yAxis: {
            splitLine: {
              show: false
            },
            type: YDataType,
            data: YAxis,
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
              fontFamily: YTickLabelFontFamily,
              rotate: YTickLabelRotate
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
          }
        }
        return option;
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
      const {componentId} = this.config;
      this.instance = Object.freeze({myChart: echarts.init(document.getElementById(componentId))});
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
