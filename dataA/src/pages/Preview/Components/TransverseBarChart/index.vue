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
    <div class="singleTextContent" :id="`basicPie_${config.componentId}${designType}`">
    </div>
  </div>
</template>

<script>
import {isEqual} from 'lodash';
import {returnChartPosition, getXAxisByKey} from '@/utils/utils';
import {firstReduce, getChartMarkLineConfig, supplementaryColor} from '@/utils/common';
import {getInfoById} from '@/services/design';
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
        const {
          stylesObj,
          enableLabel,
          enableLegend,
          dataType,
          dataConfig,
          enableGrid,
          enableXAxis,
          enableYAxis,
          enableData,
          dimension,
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
        let supplementaryColorArr = [], YAxis, legendData, series = [], list;
        if (dataType === 1) {
          list = JSON.parse(staticValue);
          YAxis = getXAxisByKey(list, dimension); // x轴的数据
          legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
          const ln = legendData.length;
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        if (dataType === 2 || dataType === 3) {
          list = this.list;
          YAxis = getXAxisByKey(list, dimension); // x轴的数据
          legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
          const ln = legendData.length;
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
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
            emphasis: {
              focus: 'series'
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
          dataZoom: [
            {
              type: 'slider',
              show: enableData
            }
          ],
          legend: {
            ...legendPos,
            show: enableLegend,
            type: 'scroll',
            pageIconColor: '#fff',
            pageIconInactiveColor: '#4689F5',
            pageTextStyle: {
              color: '#fff'
            },
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            },
            itemWidth: 10,
            itemHeight: 10,
            data: legendData
          },
          xAxis: {
            splitLine: {
              show: false
            },
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
            data: YAxis,
            splitLine: {
              show: false
            },
            type: YDataType,
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
  mounted() {
    this.initDom();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const params = this.getParameters();
        const { isShow } = this.config;
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
      const domWrap = `basicPie_${componentId}${this.designType}`
      this.instance = Object.freeze({myChart: echarts.init(document.getElementById(domWrap))});
      this.fetchData();
    },
    async fetchData() {
      if (!this.instance) {return}
      const {dataType} = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
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
      const { apiDataConfig} = this.config;
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
          return;
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
