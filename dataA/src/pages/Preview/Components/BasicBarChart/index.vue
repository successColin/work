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
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import {returnChartPosition, getXAxisByKey} from '@/utils/utils';
import {getChartMarkLineConfig, supplementaryColor} from '@/utils/common';
import {getInfoById} from '@/services/design';
import {isEqual} from 'lodash';
import {decrypt} from '@/utils/secret';
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
      supplementaryColor: [], // 补充色
      list: [],
      timer: null,
      loading: false,
      client: null
    };
  },

  components: {},

  computed: {
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
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
          enableLabel,
          markLineConfig
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
          XTickLabelRotate = 0,
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
          enableMarkMax = false, // 标记最大值
          enableMarkMin = false, // 标记最小值
          markBgColor = '#4689F5', // 标记背景颜色
          markerColor = '#fff', // 标记字体颜色
          symbolIcon = 'pin', // 标记图标
          symbolSize = 50, // 标记大小
          enableMean = false, // 是否启用均值线
          meanColor = '#4689F5', // 均值线颜色
          meanType = 'dashed', // 均值线类型
          enableMeanLabel = true, // 是否显示标签
          meanLabelColor = '#ffffff', // 均值线标签颜色
          meanLabelSize = 12, // 均值线标签字体大小
          meanLabelPosition = 'end', // 均值线标签位置
          showBackground = false,
          backgroundColor = 'rgba(180, 180, 180, 0.2)',
          colorArr
        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        const cn = colorArr.length; // 颜色长度
        const getPos = (type) => {
          if (type === 'top') {
            return 'insideTop';
          }
          if (type === 'middle') {
            return ['50%', '50%'];
          }
          if (type === 'bottom') {
            return 'insideBottom';
          }
          return '';
        }
        let supplementaryColorArr = [], XAxis, legendData, series = [], list;
        if (dataType === 1) {
          list = JSON.parse(staticValue);
          XAxis = getXAxisByKey(list, dimension); // x轴的数据
          legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
          const ln = legendData.length;
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        if ([2, 3, 4].includes(dataType)) {
          list = this.list;
          XAxis = getXAxisByKey(list, dimension); // x轴的数据
          legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
          const ln = legendData.length;
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        legendData.forEach((item, index) => {
          const data = [];
          const newColorArr = [...colorArr, ...supplementaryColorArr];
          XAxis.forEach((x) => {
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
            showBackground,
            backgroundStyle: {
              color: backgroundColor
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
              position: getPos(labelPosition),
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
              borderRadius: [borderRadius, borderRadius, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff'// 0% 处的颜色
              }, {
                offset: 1,
                color: newColorArr[index].c2 || newColorArr[index].c1 || '#fff' // 100% 处的颜色
              }], false)
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
          if (!(!enableMarkMax && !enableMarkMin)) {
            const markMax = {
              type: 'max',
              symbol: symbolIcon,
              symbolSize: symbolSize,
              label: {
                color: markerColor
              },
              itemStyle: {
                color: markBgColor
              }
            }
            const markMin = {
              type: 'min',
              symbol: symbolIcon,
              symbolSize: symbolSize,
              label: {
                color: markerColor
              },
              itemStyle: {
                color: markBgColor
              }
            }

            if (enableMarkMax) {
              obj.markPoint.data.push(markMax);
            }
            if (enableMarkMin) {
              obj.markPoint.data.push(markMin);
            }
          }
          if (enableMean) {
            obj.markLine.data.push({
              type: 'average',
              lineStyle: {
                color: meanColor,
                type: meanType
              },
              label: {
                show: enableMeanLabel,
                position: meanLabelPosition,
                color: meanLabelColor,
                fontSize: meanLabelSize
              }
            });
          }
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
            // position: 'top'
            // position: function (point) {
            //   // 固定在顶部
            //   return point;
            // }
          },
          dataZoom: [
            {
              type: 'slider',
              show: enableData,
              textStyle: {
                color: XColor || '#fff'
              }
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
            data: legendData.length && legendData[0] ? legendData : []
          },
          xAxis: {
            type: XDataType,
            data: XAxis,
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
      if (dataType === 2) {
        this.loading = true;
        await this.getApi();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
        this.loading = false;
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
        this.loading = false;
      }
      if (dataType === 4 && !this.client) {
        await this.initMqtt()
        // if (this.client) {
        //   this.publishMessage()
        // } else {
        //   await this.initMqtt()
        // }
      }
      // getInfoById
    },
    async initMqtt() {
      const {
        mqttDataConfig: {
          mqttSourceId,
          sourceU,
          sourceP,
          sourceA,
          sourceD,
          topic
        }
      } = this.config;
      if (!(mqttSourceId && sourceU && sourceP && topic)) {
        return;
      }
      const options = {
        username: decrypt(sourceA), // 可选，MQTT代理的用户名
        password: decrypt(sourceD) // 可选，MQTT代理的密码
      };
      const url = decrypt(sourceU);
      const port = decrypt(sourceP);
      this.client = mqtt.connect(`${url}:${port}/mqtt`, options);
      this.client.on('connect', () => {
        this.client.subscribe(`${topic}/response`, (err) => {
          if (!err) {
            console.log('订阅成功!');
            this.publishMessage();
          }
        });
      });
      this.client.on('message', (u, message) => {
        this.reduceMqtt(JSON.parse(message));
      });
    },
    reduceMqtt(data) {
      const {
        mqttDataConfig: {
          enableMqttFilter,
          mqttFilterFun // 过滤器函数
        }
      } = this.config;
      if (!enableMqttFilter) {
        this.list = data;
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
        return
      }
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.list = result;
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
        return;
      }
      this.list = data;
      const option = this.getOption();
      // 绘制图表
      this.instance.myChart.setOption(option, true);
    },
    publishMessage(message = '') {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.publish(`${topic}/publish`, message, {qos: 2});
    },
    renderChart() {
      this.instance.myChart.clear();
      const option = this.getOption();
      // 绘制图表
      this.instance.myChart.setOption(option, true);
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
          }, time);
        }
        const list = JSON.parse(targetObj);
        if (!enableApiFilter) {
          this.list = list;
          this.renderChart();
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
          this.renderChart();
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
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        this.renderChart();
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
        this.renderChart();
        return;
      }
      this.list = res;
      this.renderChart();
    }
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
    if (this.client) {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.unsubscribe(`${topic}/response`);
      this.client.end();
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
