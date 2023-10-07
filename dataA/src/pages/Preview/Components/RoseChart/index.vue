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
// 引入基本模板
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import {getInfoById} from '@/services/design';
import {returnChartPosition} from '@/utils/utils';
import {supplementaryColor} from '@/utils/common';
import {isEqual} from 'lodash';
import {decrypt} from '@/utils/secret';

// eslint-disable-next-line no-undef
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
      client: null,
      content: [],
      myChart: null,
      observer: null,
      instance: null,
      timer: null,
      loading: false
    };
  },

  components: {
  },

  computed: {
    getContentStyles() {
      const {width, height, stylesObj, left, top} = this.config;
      return `width:${width}px;height:${height}px;left:${left}px;top: ${top}px;zIndex:${stylesObj.zIndex};`;
    },
    getTextStyles() {
      return function () {
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
    getOption() {
      return function () {
        const {stylesObj, enableLegend, dataType, dataConfig, enableTooltip} = this.config;
        const {staticValue} = dataConfig;
        const {
          legendPosition,
          legendFontFamily,
          legendFontWeight,
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
          colorArr,
          borderRadius,
          pieHorizontal,
          pieVertical,
          legendColor,
          enableLegendValue = false,
          tipType = 1
        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        let chartConfig = {};
        const cn = colorArr.length; // 颜色长度
        let supplementaryColorArr = [];
        if (dataType === 1) {
          const list = JSON.parse(staticValue);
          const ln = list.length; // 数据长度
          chartConfig.data = list;
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        if ([2, 3, 4].includes(dataType)) {
          const ln = this.content.length; // 数据长度
          chartConfig.data = this.content;
          supplementaryColorArr = supplementaryColor(ln, cn)
        }
        let optionConfig = {
          tooltip: {
            show: enableTooltip ?? true,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 0,
            textStyle: {
              color: '#fff'
            },
            formatter: function (params) {
              const { marker, name, value,percent } = params;
              if (tipType === 3) {
                return marker + ' ' + name + '</br> 占比: ' + percent + '%' ;
              }
              if (tipType === 2) {
                return marker + ' ' + name + '</br> 数量:  ' + value ;
              }
              return marker + ' ' + name + '</br> 数量:  ' + value + '</br> 占比: ' + percent + '%' ;
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
            },
            formatter(params) {
              if (!enableLegendValue) {return params;}
              const current = chartConfig.data.find((item) => item.name === params) || {};
              return `${params}   ${current.value || 0}`;
            }
          }
        };

        chartConfig = {
          ...chartConfig,
          roseType: 'radius',
          radius: [outerCircle, InnerCircle],
          center: [`${pieHorizontal}%`, `${pieVertical}%`],
          label: {
            show: labelPosition !== 'none',
            color: labelColor,
            position: labelPosition,
            alignTo: 'labelLine',
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
          itemStyle: {
            borderRadius: borderRadius
          },
          // emphasis: {
          //   label: {
          //     show: labelPosition !== 'none',
          //     fontSize: labelFontSize,
          //     fontWeight: labelFontWeight,
          //     fontFamily: labelFontFamily
          //   }
          // },
          // tooltip: {
          //   position: 'top'
          // },
          type: 'pie'
        }
        if (cn) {
          chartConfig.itemStyle = {
            // emphasis: {
            //   shadowBlur: 10,
            //   shadowOffsetX: 0,
            //   shadowColor: 'rgba(0, 0, 0, 0.5)'
            // },
            borderRadius: borderRadius,
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
        let series = [chartConfig];
        return {
          ...optionConfig,
          series
        };
      };
    }
  },
  mounted() {
    this.initDom();
  },
  watch: {
    config(val) { // 普通的watch监听
      if (this.myChart && val) {
        const options = this.getOption();
        this.myChart.setOption(options, true);
      }
    },
    content: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.myChart && val) {
          const options = this.getOption();
          this.myChart.setOption(options, true);
        }
      }
    },
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

    initDom() {
      const {componentId} = this.config;
      const domWrap = `basicPie_${componentId}${this.designType}`;
      this.myChart = echarts.init(document.getElementById(domWrap));
      this.instance = Object.freeze({myChart: this.myChart});
      this.fetchData();
    },
    async fetchData() {
      if (!this.myChart) {return;}
      const {dataType} = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.myChart.setOption(option, true);
      }
      if (dataType === 2) {
        this.loading = true;
        await this.getApi();
        this.loading = false;
      }
      if (dataType === 3) {
        this.loading = true;
        await this.getSQL();
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
      if (!(mqttSourceId && sourceU && sourceP && topic)) { return; }
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
        this.content = data;
        return
      }
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.content = result;
        return;
      }
      this.content = data;
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
            this.myChart.clear();
            const option = this.getOption();
            this.myChart.setOption(option, true);
          }, time);
        }
        if (!enableApiFilter) {
          this.content = JSON.parse(targetObj);
          return
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(JSON.parse(targetObj));
          this.content = result;
          return;
        }
        this.content = JSON.parse(targetObj);
      }
    },
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
          const option = this.getOption();
          this.myChart.clear();
          this.myChart.setOption(option, true);
        }, time);
      }
      if (!enableSQLFilter) {
        this.content = res;
        return
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        this.content = result;
        return;
      }
      this.content = res;
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
