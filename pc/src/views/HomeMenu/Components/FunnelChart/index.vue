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
      v-loading="loading"
      class="singleTextWrap"
      :style="getContentStyles"
  >
    <div class="singleTextContent" :id="`basicPie_${config.componentId}${designType}`">
    </div>
  </div>
</template>

<script>
// 引入基本模板
import { isEqual } from 'lodash';
import { getInfoById } from '@/api/design';
import * as echarts from 'echarts/core';
import {
  DataZoomComponent,
  GridComponent,
  LegendScrollComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import { FunnelChart, GraphChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { getRequestParams, returnChartPosition } from '@/views/HomeMenuConfig/constants/common';

// import { autoToolTip } from '@/utils/echarts_auto_tooltip.js';
// 引入基本模板
echarts.use([
  GridComponent,
  TitleComponent,
  TooltipComponent,
  FunnelChart,
  GraphChart,
  DataZoomComponent,
  CanvasRenderer,
  LegendScrollComponent
]);
export default {
  props: {
    designType: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {
      }
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      }
    },
    filterParameter: { // 控件传给控件的参数集合
      type: Object,
      default() {
        return {};
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
      supplementaryColor: [], // 补充色
      list: [],
      timer: null,
      loading: false,
      params: {}, // 参数集合
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const {
        width,
        height,
        top,
        left,
        stylesObj
      } = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    dataSort() { // 数据按照title值不同进行分类
      return function (list = []) {
        if (!list.length) {
          return [];
        }
        const titleArr = list.reduce((arr, pre) => {
          const { title = '' } = pre;
          if (title && !arr.includes(title)) {
            return [...arr, title];
          }
          return arr;
        }, []);
        return titleArr;
      };
    },
    dataSortToGroup() { // 根据分组处理成图表支持的数据
      return function (arr, list) {
        if (!arr.length) {
          return [];
        }
        return arr.reduce((total, cur) => {
          const obj = {
            name: cur,
            type: 'funnel',
            data: list.filter((item) => item.title === cur)
          };
          return [...total, obj];
        }, []);
      };
    },
    makeChart() { // 拼接成真正的图表数据
      return function (chartData, config) {
        const n = chartData.length; // 图表数据长度
        const cn = config.length; // 图表配置长度
        if (!n) {
          return [];
        }
        if (!cn) {
          // 没有图表配置， 图表宽度做平均分
          const avg = 100 / n; // 宽度
          return chartData.map((item, i) => ({
            ...item,
            type: 'funnel',
            width: `${avg}%`,
            height: '90%',
            bottom: 60,
            left: `${avg * i}%`
          }));
        }
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
              isShowTooltip,
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
                borderType: itemBorderType,
                shadowBlur: itemShadowBlur,
                shadowColor: itemShadowColor,
                shadowOffsetX: itemShadowOffsetX,
                shadowOffsetY: itemShadowOffsetY,
                opacity
              },
              tooltip: {
                show: isShowTooltip
              }
            };
          }
          return {
            ...item,
            type: 'funnel'
          };
        });
      };
    },
    getOption() {
      return function () {
        const {
          stylesObj,
          enableLegend,
          dataType,
          dataConfig,
          funnelsConfig = []
        } = this.config;
        const { staticValue } = dataConfig;
        const {
          legendPosition, // 图例位置
          legendFontFamily, // 图例字体
          legendFontWeight, // 图例文字粗细
          legendFontSize, // 图例文字大小
          legendColor, // 图例字体颜色
          colorArr
        } = stylesObj;
        const legendPos = returnChartPosition(legendPosition);
        let list;
        if (dataType === 1) {
          list = JSON.parse(staticValue);
        }
        if (dataType === 2 || dataType === 3) {
          list = this.list;
        }
        const sortType = this.dataSort(list);
        const chartArr = this.dataSortToGroup(sortType, list); // 处理所有的数据
        const noTitleArr = list.filter((item) => !item.title);
        const noTitleArrChart = noTitleArr.length ? [{
          name: '',
          data: noTitleArr
        }] : [];
        const seriesArr = this.makeChart([...chartArr, ...noTitleArrChart], funnelsConfig);
        return {
          tooltip: {
            show: true,
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
          },
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
      };
    }
  },
  mounted() {
    this.initDom();
  },
  activated() {
    this.initDom();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const { isShow } = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && isShow) {
          this.fetchData();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && isShow) {
          this.fetchData();
        }
      }
    },
    filterParameter: {
      deep: true,
      immediate: false,
      handler(v) {
        if (v && JSON.stringify(v) !== '{}') {
          // 进行判断参数是否是本控件里面的
          const { isShow } = this.config;
          if (isShow) {
            this.checkFilterParameter(true);
          }
        }
      }
    },
  },
  methods: {
    getFilterParamsObj() {
      const paramsObj = {};
      const { componentId } = this.config;
      Object.keys(this.filterParameter).forEach((item) => {
        if (item.indexOf(componentId) > -1) {
          const key = item.split('_')[1];
          paramsObj[key] = this.filterParameter[item];
        }
      });
      this.params = paramsObj;
      return paramsObj;
    },
    checkFilterParameter(flag) {
      const paramsObj = this.getFilterParamsObj();
      this.$nextTick(() => {
        if (flag && JSON.stringify(paramsObj) === '{}') {
          return;
        }
        this.fetchData();
      });
    },
    initDom() {
      const { componentId } = this.config;
      const domWrap = `basicPie_${componentId}${this.designType}`;
      this.instance = Object.freeze({ myChart: echarts.init(document.getElementById(domWrap)) });
      this.getFilterParamsObj();
      this.fetchData();
    },
    async fetchData() {
      if (!this.instance) {
        return;
      }
      const { dataType } = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
        // 自动轮播
        // autoToolTip(this.instance.myChart, option, {
        //   // 轮播间隔时间 默认2s
        //   interval: 2000,
        //   // 是否循环轮播所有序列
        //   loopSeries: true,
        //   // 第1个被轮播的序列下标
        //   seriesIndex: 0
        // });
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
        this.loading = false;
      }
      // getInfoById
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
      const { query = {}, name } = this.$route;
      const params = getRequestParams({
        config: this.config,
        routeQuery: name !== 'appCustomPage' ? {} : query,
        otherParams: this.otherParams,
        elseParams: this.params || {}
      });
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        // eslint-disable-next-line no-unused-expressions
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.getSQL();
          this.instance.myChart.clear();
          const option = this.getOption();
          // 绘制图表
          this.instance.myChart.setOption(
            option
          );
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        if (!(Array.isArray(result) && result.length)) {
          this.list = [];
          return;
        }
        this.list = result;
        return;
      }
      this.list = res;
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  deactivated() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  //overflow: hidden;
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
