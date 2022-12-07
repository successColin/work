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
import { supplementaryColor } from '@/utils/common';
import {screenConfig} from '@/constants/global';
// 引入基本模板
// eslint-disable-next-line no-undef
let echarts = require('echarts')

export default {
  props: {
    bgConfig: {
      type: Object,
      default(){
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
      supplementaryColor: [] // 补充色
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
        const {stylesObj, enableLegend, dataType, dataConfig, SqlDataConfig, apiDataConfig} = this.config;
        const {staticValue = '[]'} = dataConfig;
        let {
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
          colorArr
        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        let optionConfig = {
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
        let supplementaryColorArr = [], list = [];
        if (dataType === 1) {
          list = JSON.parse(staticValue);
          const ln = list.length; // 数据长度
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        if (dataType === 2) {
          const {apiFilterResponse = '[]'} = apiDataConfig;
          list = JSON.parse(apiFilterResponse);
          const ln = list.length; // 数据长度
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        if (dataType === 3) {
          const {SQLFilterResponse = '[]'} = SqlDataConfig;
          list = JSON.parse(SQLFilterResponse);
          const ln = list.length; // 数据长度
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        chartConfig.data = list;
        chartConfig = {
          ...chartConfig,
          radius: [`${outerCircle}%`, `${InnerCircle}%`],
          label: {
            show: labelPosition !== 'none',
            color: labelColor,
            position: labelPosition,
            // alignTo: 'labelLine',
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
          emphasis: {
            label: {
              show: true,
              fontSize: labelFontSize,
              fontWeight: labelFontWeight,
              fontFamily: labelFontFamily
            }
          },
          tooltip: {
            position: 'top'
          },
          type: 'pie'
        }
        if (cn) {
          chartConfig.itemStyle = {
            // emphasis: {
            //   shadowBlur: 10,
            //   shadowOffsetX: 0,
            //   shadowColor: 'rgba(0, 0, 0, 0.5)'
            // },
            normal: {
              color: (params) => {
                const colorList = [...colorArr, ...supplementaryColorArr];
                return new echarts.graphic.LinearGradient(1, 0, 0, 0, [{ //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                  offset: 0,
                  color: colorList[params.dataIndex].c1 || colorList[params.dataIndex].c2 || '#fff'
                }, {
                  offset: 1,
                  color: colorList[params.dataIndex].c2 || colorList[params.dataIndex].c1 || '#fff'
                }])
              }
            }
          }
        }
        let series = [chartConfig];
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
      if (width === this.recordOldValue.width && height === this.recordOldValue.height) {return}
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
