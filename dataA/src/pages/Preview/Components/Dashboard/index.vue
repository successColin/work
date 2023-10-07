/**
* @name: index
* @author: DELL
* @date: 2022/1/10 16:46
* @description：仪表盘真实界面
* @update: 2022/1/10 16:46
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles">
    <div class="singleTextContent" :id="`basicPie_${config.componentId}${designType}`">
    </div>
  </div>
</template>

<script>
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import {isEqual} from 'lodash';
import {returnChartPosition} from '@/utils/utils';
import {getInfoById} from '@/services/design';
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
      observer: null,
      client: null,
      timer: null,
      list: []
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
          stylesObj, enableLegend, dataType, dataConfig,
          axisLine = false, // 是否启用仪表盘轴线
          progress = false, // 是否启用展示当前进度
          splitLine = false, // 是否启用分割线
          axisTick = false, // 是否启用刻度样式
          axisLabel = false, // 是否启用刻度标签
          pointer = false, // 是否启用指针
          anchor = false, // 指针圆心
          detail = true,
          boardConfig = []
        } = this.config;
        let {
          legendName = '',
          legendPosition = 'lt', // 图例位置
          legendFontFamily = 'Arial,苹方,微软雅黑', // 图例字体
          legendFontWeight = 'normal', // 图例文字粗细
          legendFontSize = 12, // 图例文字大小
          legendColor = '#FFF', // 图例字体颜色
          startAngle = 180, //起始角度
          endAngle = 0, // 结束角度
          radius = 100, // 仪表盘半价
          max = 180, // 刻度最大值
          min = 0, // 刻度最小值
          splitNumber = 5, // 刻度分割段数
          roundCap = true, // 两端启用圆角
          axisLineWidth = 10, // 轴线宽度
          axisLineColorConfig = [], // 轴线颜色
          progressRoundCap = false, // 进度条
          progressWidth = 10, // 进度条宽度
          progressColor = '#58D9F9', // 进度条颜色
          splitLineLength = 10, // 分割线长度
          splitLineDistance = 10, // 分割线离轴线的距离
          splitLineColor = '#fff', // 分割线颜色
          splitLineWidth = 2, // 分割线宽度
          splitLineType = 'solid', // 分割线类型， 实现，虚线，点线
          axisTickSplitNumber = 5, // 分隔线之间分割的刻度数
          axisTickLength = 10, // 刻度线长
          axisTickDistance = 0, // 刻度线与轴线的距离
          axisTickColor = '#fff', // 刻度线颜色
          axisTickWidth = 10, //刻度线宽度
          axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
          axisLabelDistance = 10, // 标签与刻度线的距离
          axisLabelFontFamily = 'Arial,苹方,微软雅黑', //标签字体
          axisLabelFontWeight = 'normal', //标签文字粗细
          axisLabelFontSize = 16, // 标签文字大小
          axisLabelColor = '#FFF', // 标签文字颜色
          icon = '', // 指针图标， 默认
          pointerLength = 60, // 指针长度
          pointerWidth = 30, // 指针宽度
          pointerColor = '#58D9F9', // 制作颜色
          anchorIcon = '', // 指针圆心图标， 默认
          anchorSize = 6, // 指针圆心大小
          anchorColor = '#000', // 指针圆心颜色
          horizontalOffset = 0, // 水平方向偏移
          verticalOffset = 35, // 垂直方向偏移
          detailFontFamily = 'Arial,苹方,微软雅黑',
          detailFontWeight = 'normal',
          detailFontSize = 16,
          detailColor = '#333',
          detailPrefix = '', // 值前缀
          detailSuffix = '' // 值后缀
        } = stylesObj;
        let legendPos = returnChartPosition(legendPosition);
        const colorArr = axisLineColorConfig.map((item) => [item.name, item.value])
        let optionConfig = {
          tooltip: {
            show: false,
            trigger: 'item'
          },
          title: {
            show: enableLegend,
            text: legendName,
            ...legendPos,
            textStyle: {
              color: legendColor,
              fontWeight: legendFontWeight,
              fontFamily: legendFontFamily,
              fontSize: legendFontSize
            }
          }
        };
        let contentObj = null;
        if (dataType === 1) {
          const {staticValue = '{}'} = dataConfig;
          contentObj = JSON.parse(staticValue);
        }
        if ([2, 3, 4].includes(dataType)) {
          contentObj = this.list;
        }

        let chartConfig = {
          type: 'gauge',
          radius: `${radius}%`,
          startAngle,
          endAngle,
          min,
          max,
          splitNumber,
          axisLine: {
            show: axisLine,
            roundCap: roundCap,
            lineStyle: {
              width: axisLineWidth,
              color: colorArr.length ? colorArr : [[1, '#E6EBF8']]
            }
          },
          progress: {
            show: progress,
            width: progressWidth,
            roundCap: progressRoundCap,
            itemStyle: {
              color: progressColor
            }
          },
          splitLine: {
            show: splitLine,
            length: splitLineLength,
            distance: splitLineDistance,
            lineStyle: {
              color: splitLineColor,
              width: splitLineWidth,
              type: splitLineType
            }
          },
          axisTick: {
            show: axisTick,
            splitNumber: axisTickSplitNumber,
            length: axisTickLength,
            distance: axisTickDistance,
            lineStyle: {
              color: axisTickColor,
              width: axisTickWidth,
              type: axisTickType
            }
          },
          axisLabel: {
            show: axisLabel,
            distance: axisLabelDistance,
            color: axisLabelColor,
            fontWeight: axisLabelFontWeight,
            fontFamily: axisLabelFontFamily,
            fontSize: axisLabelFontSize
          },
          pointer: {
            show: pointer,
            icon: icon,
            length: pointerLength,
            width: pointerWidth,
            itemStyle: {
              color: pointerColor
            }
          },
          anchor: {
            show: anchor,
            size: anchorSize,
            icon: anchorIcon,
            showAbove: true,
            itemStyle: {
              color: anchorColor
            }
          },
          detail: {
            show: detail,
            color: detailColor,
            fontWeight: detailFontWeight,
            fontSize: detailFontSize,
            fontFamily: detailFontFamily,
            offsetCenter: [`${horizontalOffset}%`, `${verticalOffset}%`],
            formatter: function (value) {
              return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
            }
          },
          data: [{
            value: contentObj.value || 0
          }]
        };
        let series = [chartConfig];
        if (boardConfig.length) {
          boardConfig.forEach((item) => {
            const {
              stylesObj,
              axisLine = false, // 是否启用仪表盘轴线
              progress = false, // 是否启用展示当前进度
              splitLine = false, // 是否启用分割线
              axisTick = false, // 是否启用刻度样式
              axisLabel = false, // 是否启用刻度标签
              pointer = false, // 是否启用指针
              anchor = false, // 指针圆心
              detail = true
            } = item;
            let {
              verticalCenter = 50, // 垂直中心坐标
              horizontalCenter = 50, // 水平中心坐标
              valueMappingField = '', // 值映射字段
              startAngle = 180, //起始角度
              endAngle = 0, // 结束角度
              radius = 100, // 仪表盘半价
              max = 180, // 刻度最大值
              min = 0, // 刻度最小值
              splitNumber = 5, // 刻度分割段数
              roundCap = true, // 两端启用圆角
              axisLineWidth = 10, // 轴线宽度
              axisLineColorConfig = [], // 轴线颜色
              progressRoundCap = false, // 进度条
              progressWidth = 10, // 进度条宽度
              progressColor = '#58D9F9', // 进度条颜色
              splitLineLength = 10, // 分割线长度
              splitLineDistance = 10, // 分割线离轴线的距离
              splitLineColor = '#fff', // 分割线颜色
              splitLineWidth = 2, // 分割线宽度
              splitLineType = 'solid', // 分割线类型， 实现，虚线，点线
              axisTickSplitNumber = 5, // 分隔线之间分割的刻度数
              axisTickLength = 10, // 刻度线长
              axisTickDistance = 0, // 刻度线与轴线的距离
              axisTickColor = '#fff', // 刻度线颜色
              axisTickWidth = 10, //刻度线宽度
              axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
              axisLabelDistance = 10, // 标签与刻度线的距离
              axisLabelFontFamily = 'Arial,苹方,微软雅黑', //标签字体
              axisLabelFontWeight = 'normal', //标签文字粗细
              axisLabelFontSize = 16, // 标签文字大小
              axisLabelColor = '#FFF', // 标签文字颜色
              icon = '', // 指针图标， 默认
              pointerLength = 60, // 指针长度
              pointerWidth = 30, // 指针宽度
              pointerColor = '#58D9F9', // 制作颜色
              anchorIcon = '', // 指针圆心图标， 默认
              anchorSize = 6, // 指针圆心大小
              anchorColor = '#000', // 指针圆心颜色
              horizontalOffset = 0, // 水平方向偏移
              verticalOffset = 35, // 垂直方向偏移
              detailFontFamily = 'Arial,苹方,微软雅黑',
              detailFontWeight = 'normal',
              detailFontSize = 16,
              detailColor = '#333',
              detailPrefix = '', // 值前缀
              detailSuffix = '' // 值后缀
            } = stylesObj;
            const colorArr = axisLineColorConfig.map((item) => [item.name, item.value])
            let chartConfig = {
              type: 'gauge',
              radius: `${radius}%`,
              center: [`${horizontalCenter}%`, `${verticalCenter}%`],
              startAngle,
              endAngle,
              min,
              max,
              splitNumber,
              axisLine: {
                show: axisLine,
                roundCap: roundCap,
                lineStyle: {
                  width: axisLineWidth,
                  color: colorArr.length ? colorArr : [[1, '#E6EBF8']]
                }
              },
              progress: {
                show: progress,
                width: progressWidth,
                roundCap: progressRoundCap,
                itemStyle: {
                  color: progressColor
                }
              },
              splitLine: {
                show: splitLine,
                length: splitLineLength,
                distance: splitLineDistance,
                lineStyle: {
                  color: splitLineColor,
                  width: splitLineWidth,
                  type: splitLineType
                }
              },
              axisTick: {
                show: axisTick,
                splitNumber: axisTickSplitNumber,
                length: axisTickLength,
                distance: axisTickDistance,
                lineStyle: {
                  color: axisTickColor,
                  width: axisTickWidth,
                  type: axisTickType
                }
              },
              axisLabel: {
                show: axisLabel,
                distance: axisLabelDistance,
                color: axisLabelColor,
                fontWeight: axisLabelFontWeight,
                fontFamily: axisLabelFontFamily,
                fontSize: axisLabelFontSize
              },
              pointer: {
                show: pointer,
                icon: icon,
                length: pointerLength,
                width: pointerWidth,
                itemStyle: {
                  color: pointerColor
                }
              },
              anchor: {
                show: anchor,
                size: anchorSize,
                icon: anchorIcon,
                showAbove: true,
                itemStyle: {
                  color: anchorColor
                }
              },
              detail: {
                show: detail,
                color: detailColor,
                fontWeight: detailFontWeight,
                fontSize: detailFontSize,
                fontFamily: detailFontFamily,
                offsetCenter: [`${horizontalOffset}%`, `${verticalOffset}%`],
                formatter: function (value) {
                  return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
                }
              }
            };
            if (valueMappingField && contentObj[valueMappingField]) {
              chartConfig.data = [{
                value: contentObj[valueMappingField]
              }]
            } else {
              chartConfig.data = []
            }
            series.push(chartConfig);
          })
        }
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
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        const params = this.getParameters();
        // eslint-disable-next-line no-warning-comments
        // todo 逻辑有点问题，应该是这个控件的值发生改变，再去触发调用接口
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
        await this.getApi();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
      }
      if (dataType === 3) {
        await this.getSQL();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(option, true);
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
          // if (!(Array.isArray(result) && result.length)) {
          //   this.list = [];
          //   return
          // }
          this.list = result;
          this.renderChart();
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
        // if (!(Array.isArray(result) && result.length)) {
        //   this.list = [];
        //   return
        // }
        this.list = result;
        this.renderChart();
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
