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
import {firstReduce, getChartMarkLineConfig, supplementaryColor} from '@/utils/common';
import {getInfoById} from '@/services/design';
import {isEqual} from 'lodash';
import {decrypt} from '@/utils/secret';
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
          markLineConfig = [],
          enableFullArea
        } = this.config;
        const {staticValue} = dataConfig;
        let {
          groupDisplay,
          gridLeft,
          gridTop,
          gridRight,
          gridBottom,
          lineStyleType,
          lineWidth,
          symbolSize,
          symbol,
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
        }
        if ([2, 3, 4].includes(dataType)) {
          list = this.list;
        }
        XAxis = getXAxisByKey(list, dimension); // x轴的数据
        legendData = getXAxisByKey(list, dimension === 'x' ? 's' : 'x'); // 确定图例
        const ln = legendData.length;
        supplementaryColorArr = supplementaryColor(ln, cn)
        let realLegendData = [];
        legendData.forEach((item, index) => {
          const data = [];
          const newColorArr = [...colorArr, ...supplementaryColorArr];
          realLegendData.push({
            name: item,
            itemStyle: {
              color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff'
            }
          })
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
            type: 'line',
            symbol,
            symbolSize,
            smooth: groupDisplay === 'curve',
            step: groupDisplay === 'trapezoid',
            label: {
              show: true,
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
            lineStyle: {
              type: lineStyleType,
              width: lineWidth,
              cap: 'round',
              color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff'
            },
            markPoint: {
              data: []
            },
            markLine: {
              data: []
            }
          };
          obj = firstReduce(obj, this.config);
          obj = getChartMarkLineConfig({baseConfig: obj, name: item, markLineConfig});
          if (enableFullArea) {
            obj.areaStyle = {
              origin: 'auto',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff'// 0% 处的颜色
                }, {
                  offset: 1, color: newColorArr[index].c2 || newColorArr[index].c1 || '#fff' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
          series.push(obj);
        })
        let option = {
          tooltip: {
            show: true,
            trigger: 'axis',
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
            },
            formatter: function (params) {
              const newColorArr = [...colorArr, ...supplementaryColorArr];
              let result = `${params[0].axisValueLabel}</br>`;
              params.forEach(function (item) {
                const {seriesIndex, seriesName} = item;
                let dotHtml = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${newColorArr[seriesIndex].c1}"></span>`;
                result += `${dotHtml} ${seriesName}:${item.data}</br>`;
              })
              return result
            }
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
            data: realLegendData
          },
          xAxis: {
            type: XDataType,
            data: XAxis,
            show: enableXAxis,
            boundaryGap: false,
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
      if (!this.instance) {return}
      const {dataType} = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
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
        return
      }
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.list = result;
        return;
      }
      this.list = data;
    },
    publishMessage(message = '') {
      const {
        mqttDataConfig: {
          topic
        }
      } = this.config;
      this.client.publish(`${topic}/publish`, message, {qos: 2});
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
