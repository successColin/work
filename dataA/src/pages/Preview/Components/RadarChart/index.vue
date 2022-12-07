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
      :id="`basicPie_${config.componentId}`"
      :style="getContentStyles"
  >
    <div class="singleTextContent" :id="`basicPie_${config.componentId}${designType}`"></div>
  </div>
</template>

<script>
import {returnChartPosition, getXAxisByKey} from '@/utils/utils';
// import {supplementaryColor} from '@/utils/common';
import {getInfoById} from '@/services/design';
import {isEqual} from 'lodash';
// import { autoToolTip } from '@/utils/echarts_auto_tooltip.js';
// 引入基本模板
let echarts = require('echarts')

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
      loading: false
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getOption() {
      return function () {
        const { indicator, stylesObj,
          enableDimension, enableGlobalAxisLine,
          enableGlobalAxisTick, enableGlobalAxisLabel,
          enableGlobalSplitLine,dataType, apiDataConfig,
          enableGlobalSplitArea,enableLegend, dataConfig, customStyle = [],
          SqlDataConfig
        } = this.config;
        const {
          centerX, centerY, radius, nameGap, shape, splitNumber, axisNameColor,
          axisNameFontSize, axisNameFontFamily, axisNameFontWeight, axisColor,
          axisWidth, axisType, axisTickLength, axisTickColor, axisTickWidth, axisTickType,
          axisLabelRotate, axisLabelMargin, axisLabelColor, axisLabelFontWeight, axisLabelFontFamily,
          axisLabelFontSize, splitLineColor, splitLineWidth, splitLineType, colorArr, legendPosition,
          legendColor, legendFontWeight, legendFontSize, legendFontFamily, dataField
        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        if (dataType === 1) {
          const { staticValue } = dataConfig;
          this.list = JSON.parse(staticValue) || [];
        }
        const seriesArr = getXAxisByKey(this.list, 'x'); // 先找出来有几个系列
        const indicatorArr = indicator.filter((item) => item.enable);
        let lastData = [];
        seriesArr.forEach((item) => {
          const data = {
            name: item,
            value: []
          }
          indicatorArr.forEach((indicator) => {
            const { fieldValue } = indicator;
            const obj = this.list.find((listObj) => listObj.x === item && `${listObj[dataField]}` === `${fieldValue}`) || {};
            data.value.push(obj.value || 0);
          })
          lastData.push(data)
        })
        const resultArr = customStyle.filter((item) => item.enable);
        if (resultArr.length) {
          lastData.forEach((item, index) => {
            const custom = resultArr[index];
            if (custom) {
              const {
                areaStyle,
                axisColor,
                axisLabelColor,
                axisLabelFontFamily,
                axisLabelFontSize,
                axisLabelFontWeight,
                axisLabelMargin,
                axisLabelRotate,
                colorArr,
                enableHover,
                enableLabel,
                enableSplitArea,
                labelColor,
                lineColor,
                show,
                splitLineType,
                splitLineWidth
              } = custom;
              item.label = {
                show,
                rotate: axisLabelRotate,
                distance: axisLabelMargin,
                color: axisLabelColor,
                fontSize: axisLabelFontSize,
                fontFamily: axisLabelFontFamily,
                fontWeight: axisLabelFontWeight
              };
              item.lineStyle = {
                color: axisColor,
                width: splitLineWidth,
                type: splitLineType
              }
              if (enableSplitArea) {
                item.areaStyle = {
                  color: colorArr
                }
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
                }
              }

            }
          })
        }
        let series = [
          {
            name: '',
            type: 'radar',
            data: lastData
          }];
        let option = {
          tooltip: {
            show: true,
            trigger: 'item',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 0,
            textStyle: {
              color: '#fff'
            },
            triggerOn: 'mousemove',
            alwaysShowContent: false
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
            type: 'scroll',
            pageIconColor: '#fff',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#fff'
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
                color: splitLineColor.map(item => item.c1),
                width: splitLineWidth,
                type: splitLineType
              }
            },
            splitArea: {
              show: enableGlobalSplitArea,
              areaStyle: {
                color: colorArr.map(item => item.c1)
              }
            }
          },
          series: series
        };
        return option;
      };
    }

  },
  mounted() {
    this.initDom();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const params = this.getParameters();
        const {isShow} = this.config;
        if (JSON.stringify(v) !== '{}' && !isEqual(v, o) && params.varJson !== '[]' && isShow) {
          this.fetchData();
        } else if (JSON.stringify(v) === '{}' && JSON.stringify(o) !== '{}' && params.varJson === '[]' && isShow) {
          this.fetchData();
        }
      }
    }
  },
  methods: {
    getParameters() {
      const {id, componentId} = this.config;
      const reduce = (obj) => { // 将Object 处理成 Array
        return Object.keys(obj).map((item) => {
          return {
            name: item,
            value: obj[item]
          }
        })
      }
      const query = this.$route.query
      let satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        })
      }
      const currentParams = {
        ...satisfyParams,
        ...query
      }
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },
    initDom() {
      const {componentId} = this.config;
      const domWrap = `basicPie_${componentId}${this.designType}`;
      this.instance = Object.freeze({myChart: echarts.init(document.getElementById(domWrap))});
      this.fetchData();
    },
    async fetchData() {
      if (!this.instance) {
        return;
      }
      const {dataType} = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option);
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
      if (dataType === 2) {
        this.loading = true;
        await this.getApi();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
        this.loading = false;
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
        this.loading = false;
      }
      // getInfoById
    },
    async getApi() {
      const {apiDataConfig} = this.config;
      const params = this.getParameters();
      const res = await getInfoById(params) || [];
      if (res.length) {
        const obj = res[0] || {};
        const targetObj = obj.response || '{}';
        const {
          enableApiFilter,
          enableApiAutoUpdate,
          apiUpdateTime = 1,
          apiFilterFun,
          apiDataFilterId
        } = apiDataConfig;
        if (enableApiAutoUpdate) {
          const time = apiUpdateTime * 1000;
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(async () => {
            await this.getApi();
            this.instance.myChart.clear();
            const option = this.getOption();
            // 绘制图表
            this.instance.myChart.setOption(
              option
            );
          }, time);
        }
        const list = JSON.parse(targetObj);
        if (!enableApiFilter) {
          this.list = list;
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(list);
          if (!(Array.isArray(result) && result.length)) {
            this.list = [];
            return
          }
          this.list = result;
        }
      }
    },
    async getSQL() {
      const {SqlDataConfig} = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
        enableSQLAutoUpdate,
        SQLUpdateTime = 1
      } = SqlDataConfig;
      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
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
        return
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        if (!(Array.isArray(result) && result.length)) {
          this.list = [];
          return
        }
        this.list = result;
        return;
      }
      this.list = res;
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
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
