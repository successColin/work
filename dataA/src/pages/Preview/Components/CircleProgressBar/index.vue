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
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import {getInfoById} from '@/services/design';
import {toFixed, returnChartPosition} from '@/utils/utils';
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
      default() {
        return {};
      }
    },
    activeComponent: {
      type: Object,
      default() {
        return {};
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
      content: [],
      myChart: null,
      client: null,
      instance: null,
      timer: null,
      loading: false
    };
  },

  components: {},

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
    getList() {
      return this.$store.getters.list;
    },
    getOption() {
      return function () {
        const {stylesObj, enableLegend} = this.config;
        const {
          legendName,
          legendPosition,
          legendFontFamily,
          legendFontWeight,
          legendColor,
          legendFontSize,
          labelPosition,
          labelFontSize,
          labelFontFamily,
          labelFontWeight,
          labelColor,
          outerCircle,
          InnerCircle,
          label1Color = 'rgba(255, 255, 255, 0.7)', // 自定义1字体颜色
          label1FontSize = 16, // 自定义1文字大小
          label1FontFamily = 'Arial,苹方,微软雅黑', // 自定义1字体
          label1FontWeight = 'normal', // 自定义1文字粗细
          label1Prefix, // 前缀
          label1Suffix, // 后缀
          label2Color = 'rgba(255, 255, 255, 0.7)', // 自定义1字体颜色
          label2FontSize = 16, // 自定义1文字大小
          label2FontFamily = 'Arial,苹方,微软雅黑', // 自定义1字体
          label2FontWeight = 'normal', // 自定义1文字粗细
          label2Prefix, // 前缀
          label2Suffix, // 后缀
          barBgColor,
          barColor

        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        let optionConfig = {
          title: {
            show: enableLegend,
            text: legendName,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontSize: legendFontSize,
              fontFamily: legendFontFamily
            },
            ...legendPos
          },
          tooltip: {
            show: false,
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
          }
        };
        let chartConfig = {};
        const {total = 0, value = 0} = this.content;
        if (labelPosition === 1) {
          optionConfig.graphic = [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                //value当前进度
                text: `${total ? toFixed(value / total * 100, 2) : 0}%`,
                textAlign: 'center',
                fill: labelColor,
                font: `${labelFontWeight} ${labelFontSize}px ${labelFontFamily}`
              }
            }
          ];
        } else if (labelPosition === 2) {
          optionConfig.graphic = [
            {
              type: 'text',
              left: 'center',
              top: 'center',
              style: {
                //value当前进度
                text: `${label1Prefix}${value}${label1Suffix}`,
                textAlign: 'center',
                fill: label1Color,
                font: `${label1FontWeight} ${label1FontSize}px ${label1FontFamily}`
              }
            }
          ];
        } else if (labelPosition === 3) {
          optionConfig.graphic = [
            {
              type: 'text',
              left: 'center',
              top: '48%',
              style: {
                //value当前进度
                text: `${label1Prefix}${value}${label1Suffix}`,
                textAlign: 'center',
                fill: label1Color,
                font: `${label1FontWeight} ${label1FontSize}px ${label1FontFamily}`
              }
            },
            {
              type: 'text',
              left: 'center',
              top: '55%',
              style: {
                //value当前进度
                text: `${label2Prefix}${total}${label2Suffix}`,
                textAlign: 'center',
                fill: label2Color,
                font: `${label2FontWeight} ${label2FontSize}px ${label2FontFamily}`
              }
            }
          ];
        }
        chartConfig.data = [{
          value: value,
          itemStyle: {
            color: barColor,
            borderRadius: 10
          }
        },
        //(maxValue进度条最大值 - value当前进度) + 颜色
        {
          value: total - value,
          itemStyle: {
            color: barBgColor
          }
        }];

        chartConfig = {
          ...chartConfig,
          radius: [`${outerCircle}%`, `${InnerCircle}%`],
          labelLine: {
            show: false
          },
          emphasis: {
            label: {
              show: false,
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
      immediate: false,
      handler(val) {
        if (this.myChart && val) {
          const options = this.getOption();
          this.myChart.setOption(options, true);
        }
      }
    },
    otherParams: {
      deep: true,
      immediate: false,
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
      this.myChart = echarts.init(document.getElementById(domWrap));
      this.instance = Object.freeze({myChart: this.myChart});
      this.fetchData();
    },
    async fetchData() {
      if (!this.myChart) {
        return
      }
      const {dataType, dataConfig: {staticValue = '{}'}} = this.config;
      if (dataType === 1) {
        this.content = JSON.parse(staticValue);
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
}
</style>
