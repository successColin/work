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
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :x="config.left"
      :y="config.top"
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
import { debounce } from '@/utils/utils';
import { screenConfig } from '@/constants/global';
import 'echarts-liquidfill';
import {supplementaryColor} from '@/utils/common';
// 引入基本模板
// eslint-disable-next-line no-undef
let echarts = require('echarts');

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
    getList() {
      return this.$store.getters.list;
    },
    getOption() {
      return function () {
        const { stylesObj: {
          colorArr,
          radius,
          shape,
          waveNum,
          animationDuration,
          waveLength,
          amplitude,
          waveAnimation,
          outlineShow,
          borderDistance,
          borderColor,
          borderWidth,
          shadowColor, // 阴影颜色
          shadowBlur, // 阴影距离
          bgColor, // 内部背景颜色
          bgBorderColor, // 内部背景边框颜色
          bgBorderWidth, // 内部背景边框宽度
          bgShadowColor, // 背景阴影颜色
          bgShadowBlur, // 背景阴影距离
          labelPosition, // 文字位置inside， left， right， top，bottom
          labelFontSize, // 文字大小
          labelFontWeight, // 文字
          labelColor, // 文字颜色
          labelShow // 是否显示文字
        }, dataType, dataConfig: { staticValue }, SqlDataConfig, apiDataConfig } = this.config;
        let lastData = {};
        let seriesData = [], supplementaryColorArr;
        const cn = colorArr.length; // 颜色长度
        if (dataType === 1) {
          lastData = JSON.parse(staticValue);
        }
        if (dataType === 2) {
          const {apiFilterResponse = '[]'} = apiDataConfig;
          lastData = JSON.parse(apiFilterResponse);
        }
        if (dataType === 3) {
          const {SQLFilterResponse = '[]'} = SqlDataConfig;
          lastData = JSON.parse(SQLFilterResponse);
        }
        supplementaryColorArr = supplementaryColor(waveNum, cn)
        const per1 = lastData.value || 0;
        const colorList = [...colorArr, ...supplementaryColorArr];
        for (let i = 0; i < waveNum; i++) {
          seriesData.push(
            {
              value: per1,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,//0%时的颜色 从上往下看 最上面是0%
                    color: colorList[i].c1 || colorList[i].c2 || '#fff'
                  }, {
                    offset: 1,//100%时的颜色 从上往下看 最上面是0%
                    color: colorList[i].c2 || colorList[i].c1 || '#fff'
                  }])
                }
              }
            }
          );
        }
        let option = {
          series: [
            {
              type: 'liquidFill',
              name: '',
              radius: `${radius}%`,
              shape: shape,
              waveLength,
              amplitude,
              waveAnimation,
              direction: animationDuration,
              data: seriesData,
              outline: {
                show: outlineShow,
                borderDistance: borderDistance,
                itemStyle: {
                  borderWidth,
                  borderColor,
                  shadowBlur,
                  shadowColor
                }
              },
              backgroundStyle: {
                color: bgColor,
                borderColor: bgBorderColor,
                borderWidth: bgBorderWidth,
                shadowColor: bgShadowColor,
                shadowBlur: bgShadowBlur
              },
              label: {
                normal: {
                  formatter: () => {
                    return (lastData.value || 0) * 100 + '%';
                  },
                  show: labelShow,
                  // color: labelColor,
                  insideColor: labelColor,
                  fontSize: labelFontSize,
                  fontWeight: labelFontWeight,
                  position: labelPosition
                }
              }
            }
          ]
        };
        return option;
      };
    }
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
    },500);
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
