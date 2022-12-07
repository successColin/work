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
import {returnChartPosition, debounce} from '@/utils/utils';
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
    dataSort() { // 数据按照title值不同进行分类
      return function (list = []) {
        if (!list.length) {return []}
        let titleArr = list.reduce((arr, pre) => {
          const { title = ''} = pre;
          if (title && !arr.includes(title)) {
            return [...arr, title];
          }
          return arr;
        }, []);
        return titleArr;
      }
    },
    dataSortToGroup() { // 根据分组处理成图表支持的数据
      return function (arr, list) {
        if (!arr.length) {return [];}
        return arr.reduce((total, cur) => {
          const obj = {
            name: cur,
            type: 'funnel',
            data: list.filter((item) => item.title === cur)
          }
          return [...total, obj];
        }, []);
      }
    },
    makeChart() { // 拼接成真正的图表数据
      return function (chartData, config) {
        const n = chartData.length; // 图表数据长度
        const cn = config.length; // 图表配置长度
        if (!n) {return [];}
        if (!cn) {
          // 没有图表配置， 图表宽度做平均分
          const avg = 100 / n; // 宽度
          return chartData.map((item, i) => {
            return {
              ...item,
              type: 'funnel',
              width: `${avg}%`,
              height: '90%',
              bottom: 60,
              left: `${avg * i}%`
            }
          })
        }
        if (n > cn) { // 数据大于配置
          return chartData.map((item, i) => {
            const currentConfig = config[i];
            if (currentConfig) {
              const {
                width, // 宽
                height, // 高
                top, // 上边距
                left, // 左边距
                sort, // 排序
                orient, // 漏斗图朝向
                funnelAlign,
                gap, // 图形间距
                isShowLabel, // 是否显示文本标签
                labelFontFamily,
                labelFontWeight,
                labelFontSize,
                labelColor,
                labelTextAlign,
                labelPosition, // 标签位置

                itemBorderColor, // 图形的描边颜色
                itemBorderWidth, // 图形的描边宽度
                itemBorderType, // 描边类型
                itemShadowBlur, // 图形阴影的模糊大小
                itemShadowColor, // 阴影颜色
                itemShadowOffsetX, // 阴影水平方向上的偏移距离
                itemShadowOffsetY, // 阴影垂直方向上的偏移距离
                opacity
              } = currentConfig;
              return {
                ...item,
                type: 'funnel',
                width: `${width}%`,
                height: `${height}%`,
                top: `${top}%`,
                left: `${left}%`,
                orient,
                sort,
                gap,
                funnelAlign,
                label: {
                  show: isShowLabel,
                  position: labelPosition,
                  color: labelColor,
                  fontFamily: labelFontFamily,
                  fontSize: labelFontSize,
                  fontWeight: labelFontWeight,
                  align: labelTextAlign
                },
                itemStyle: {
                  borderColor: itemBorderColor,
                  borderWidth: itemBorderWidth,
                  borderType : itemBorderType,
                  shadowBlur: itemShadowBlur,
                  shadowColor: itemShadowColor,
                  shadowOffsetX: itemShadowOffsetX,
                  shadowOffsetY: itemShadowOffsetY,
                  opacity
                }
              }
            }
            return {
              ...item,
              type: 'funnel'
            }
          })
        };

        return chartData.map((item, i) => {
          const currentConfig = config[i];
          if (currentConfig) {
            const {
              width, // 宽
              height, // 高
              top, // 上边距
              left, // 左边距
              sort, // 排序
              orient, // 漏斗图朝向
              funnelAlign,
              gap, // 图形间距
              isShowLabel, // 是否显示文本标签
              labelFontFamily,
              labelFontWeight,
              labelFontSize,
              labelColor,
              labelTextAlign,
              labelPosition, // 标签位置

              itemBorderColor, // 图形的描边颜色
              itemBorderWidth, // 图形的描边宽度
              itemBorderType, // 描边类型
              itemShadowBlur, // 图形阴影的模糊大小
              itemShadowColor, // 阴影颜色
              itemShadowOffsetX, // 阴影水平方向上的偏移距离
              itemShadowOffsetY, // 阴影垂直方向上的偏移距离
              opacity
            } = currentConfig;
            return {
              ...item,
              type: 'funnel',
              width: `${width}%`,
              height: `${height}%`,
              top: `${top}%`,
              left: `${left}%`,
              orient,
              sort,
              gap,
              funnelAlign,
              label: {
                show: isShowLabel,
                position: labelPosition,
                color: labelColor,
                fontFamily: labelFontFamily,
                fontSize: labelFontSize,
                fontWeight: labelFontWeight,
                align: labelTextAlign
              },
              itemStyle: {
                borderColor: itemBorderColor,
                borderWidth: itemBorderWidth,
                borderType : itemBorderType,
                shadowBlur: itemShadowBlur,
                shadowColor: itemShadowColor,
                shadowOffsetX: itemShadowOffsetX,
                shadowOffsetY: itemShadowOffsetY,
                opacity
              }
            }
          }
          return {
            ...item,
            type: 'funnel'
          }
        });
      }
    },
    getOption() {
      return function () {
        const {
          stylesObj,
          enableLegend,
          dataType,
          dataConfig,
          apiDataConfig,
          SqlDataConfig,
          funnelsConfig = []
        } = this.config;
        const {staticValue} = dataConfig;
        let {
          legendPosition, // 图例位置
          legendFontFamily, // 图例字体
          legendFontWeight, // 图例文字粗细
          legendFontSize, // 图例文字大小
          legendColor, // 图例字体颜色
          colorArr
        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        let list = [];
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
        const sortType = this.dataSort(list);
        const chartArr = this.dataSortToGroup(sortType, list); // 处理所有的数据
        const noTitleArr = list.filter((item) => !item.title);
        const noTitleArrChart = noTitleArr.length ? [{
          name: '',
          data: noTitleArr
        }] : [];
        const seriesArr = this.makeChart([...chartArr, ...noTitleArrChart], funnelsConfig);
        let option = {
          legend: {
            ...legendPos,
            show: enableLegend,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            },
            // type: 'scroll',
            pageIconColor: '#fff',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#fff'
            },
            itemWidth: 10,
            itemHeight: 10,
            itemStyle: {
              borderWidth: '0px',
              borderColor: 'none'
            }
          },
          color: colorArr.map((item) => item.c1),
          series: seriesArr
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
      this.instance.myChart.setOption(options, true);
    },
    initDom() {
      const {componentId} = this.config;
      this.instance = Object.freeze({myChart: echarts.init(document.getElementById(componentId))});
      const option = this.getOption();
      // 绘制图表
      this.instance.myChart.setOption(option, true);
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
