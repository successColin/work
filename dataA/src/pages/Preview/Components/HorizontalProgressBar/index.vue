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
      :style="getContentStyles">
    <div class="singleTextContent" :id="`basicPie_${config.componentId}${designType}`"></div>
  </div>
</template>

<script>
import * as mqtt from 'mqtt/dist/mqtt.min.js';
import { isEqual } from 'lodash';
// 引入基本模板
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { BarChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent, DataZoomComponent, GridComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import {supplementaryColor} from '@/utils/common';
import {getInfoById} from '@/services/design';
import {decrypt} from '@/utils/secret';
// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');

// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
// 注册必须的组件
echarts.use([
  GridComponent,
  TitleComponent,
  TooltipComponent,
  BarChart,
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
    }
  },
  data() {
    return {
      instance: null,
      client: null,
      timer: null,
      supplementaryColor: [], // 补充色
      list: [],
      loading: false
    };
  },

  components: {
  },

  computed: {
    getContentStyles() {
      const { width, height, top, left, stylesObj } = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getOption() {
      return function () {
        const {
          enableGrid,
          stylesObj,
          dataType,
          dataConfig,
          enableLabel,
          enableTitle
        } = this.config;
        const {
          gridLeft,
          gridTop,
          gridRight,
          gridBottom,
          barWidth,
          borderRadius,
          barBgColor,
          colorArr,
          labelField,
          labelPrefix,
          labelSuffix,
          labelPosition,
          labelFontFamily,
          labelFontWeight,
          labelFontSize,
          labelColor,
          labelOffset,
          XFontFamily,
          XFontWeight,
          XFontSize,
          XColor
        } = stylesObj;
        let supplementaryColorArr = [];
        const { staticValue } = dataConfig;
        let list = [];
        const cn = colorArr.length; // 颜色长度
        if (dataType === 1) {
          list = JSON.parse(staticValue);
        }
        if ([2, 3, 4].includes(dataType)) {
          list = this.list;
        }
        if (!(Array.isArray(list) && list.length)) {
          list = [];
        }
        const ln = list.length;
        supplementaryColorArr = supplementaryColor(ln, cn);
        const valueArr = list.map((item) => item.y || 0);
        const totalArr = list.map((item) => item.s || 0);
        const nameArr = list.map((item) => item.x || '');
        const newColorArr = [...colorArr, ...supplementaryColorArr];
        const option = {
          // grid: { // 直角坐标系内绘图网格
          //   left: '10', // grid 组件离容器左侧的距离,
          //   // left的值可以是80这样具体像素值，
          //   // 也可以是'80%'这样相对于容器高度的百分比
          //   top: '10',
          //   right: '30',
          //   bottom: '0',
          //   containLabel: true // gid区域是否包含坐标轴的刻度标签。为true的时候，
          //   // left/right/top/bottom/width/height决定的是包括了坐标轴标签在内的
          //   // 所有内容所形成的矩形的位置.常用于【防止标签溢出】的场景
          // },
          xAxis: { // 直角坐标系grid中的x轴,
            // 一般情况下单个grid组件最多只能放上下两个x轴,
            // 多于两个x轴需要通过配置offset属性防止同个位置多个x轴的重叠。
            type: 'value', // 坐标轴类型,分别有：
            // 'value'-数值轴；'category'-类目轴;
            // 'time'-时间轴;'log'-对数轴
            splitLine: { show: false }, // 坐标轴在 grid 区域中的分隔线
            axisLabel: { show: false }, // 坐标轴刻度标签
            axisTick: { show: false }, // 坐标轴刻度
            axisLine: { show: false } // 坐标轴轴线
          },
          yAxis: {
            type: 'category',
            show: enableTitle,
            axisTick: { show: false },
            axisLine: { show: false },
            axisLabel: {
              color: XColor,
              fontWeight: XFontWeight,
              fontFamily: XFontFamily,
              fontSize: XFontSize // 标签字号
            },
            data: nameArr// 类目数据，在类目轴（type: 'category'）中有效。
            // 如果没有设置 type，但是设置了axis.data,则认为type 是 'category'。
          },
          series: [// 系列列表。每个系列通过 type 决定自己的图表类型
            {
              name: '%', // 系列名称
              type: 'bar', // 柱状、条形图
              barWidth, // 柱条的宽度,默认自适应
              data: valueArr, // 系列中数据内容数组
              label: { // 图形上的文本标签
                show: enableLabel,
                position: labelPosition, // 标签的位置
                offset: [0, 0 - labelOffset], // 标签文字的偏移，此处表示向上偏移40
                // formatter: '{c}{a}', // 标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                formatter: (params) => {
                  if (labelField === 'y') {
                    return `${labelPrefix}${params.value}${labelSuffix}`;
                  }
                  if (labelField === 'x') {
                    const { dataIndex, value } = params;
                    const total = totalArr[dataIndex];
                    const result = value * 100 / (total * 100) * 100;
                    const resultValue = result.toFixed(2);
                    return `${labelPrefix}${resultValue}%${labelSuffix}`;
                  }
                  return '';
                },
                color: labelColor, // 标签字体颜色
                fontWeight: labelFontWeight,
                fontFamily: labelFontFamily,
                fontSize: labelFontSize // 标签字号
              },
              itemStyle: { // 图形样式
                // emphasis图形在高亮状态下的样式
                borderRadius: borderRadius, // 柱条圆角半径,单位px.
                // 此处统一设置4个角的圆角大小;
                // 也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                color(params) {
                  const num = newColorArr.length;
                  const index = params.dataIndex % num;
                  // return newColorArr[params.dataIndex % num]; // 返回颜色数组中的一个对应的颜色值
                  return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: newColorArr[index].c1 || newColorArr[index].c2 || '#fff' // 0% 处的颜色
                    }, {
                      offset: 1, color: newColorArr[index].c2 || newColorArr[index].c1 || '#fff' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  };
                }
              },
              zlevel: 1// 柱状图所有图形的 zlevel 值,
            },
            {
              name: '进度条背景',
              type: 'bar',
              label: { // 图形上的文本标签
                show: false,
                position: 'right', // 标签的位置
                offset: [0, 0], // 标签文字的偏移，此处表示向上偏移40
                // formatter: '{c}{a}',//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
                color: 'rgba(0,0,0,.7)', // 标签字体颜色
                fontSize: 12 // 标签字号
              },
              barGap: '-100%', // 不同系列的柱间距离，为百分比。
              // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
              // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
              // 并且是对此坐标系中所有 'bar' 系列生效。
              barWidth,
              data: totalArr,
              color: barBgColor, // 柱条颜色
              itemStyle: {
                borderRadius: borderRadius
              }
            }
          ]
        };
        if (enableGrid) {
          option.grid = {
            left: gridLeft,
            right: gridRight,
            bottom: gridBottom,
            top: gridTop,
            containLabel: true
          };
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
      const { id, componentId } = this.config;
      const reduce = (obj) => // 将Object 处理成 Array
        Object.keys(obj).map((item) => ({
          name: item,
          value: obj[item]
        }));

      const { query } = this.$route;
      const satisfyParams = {};
      if (JSON.stringify(this.otherParams) !== '{}') {
        Object.keys(this.otherParams).forEach((item) => {
          if (item.indexOf(componentId) > -1) {
            const key = item.replace(`${componentId}_`, '');
            satisfyParams[key] = this.otherParams[item];
          }
        });
      }
      const currentParams = {
        ...satisfyParams,
        ...query
      };
      const arr = reduce(currentParams);
      return {
        id,
        varJson: JSON.stringify(arr)
      };
    },
    initDom() {
      const { componentId } = this.config;
      const domWrap = `basicPie_${componentId}${this.designType}`;
      // eslint-disable-next-line max-len
      this.instance = Object.freeze({ myChart: echarts.init(document.getElementById(domWrap)) });
      this.fetchData();
    },
    async fetchData() {
      if (!this.instance) {return;}
      const { dataType } = this.config;
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
        this.list = data;
        this.renderChart();
        return
      }
      if (enableMqttFilter && mqttFilterFun) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${mqttFilterFun}`);
        const result = fun()(data);
        this.list = result;
        this.renderChart();
        return;
      }
      this.list = data;
      this.renderChart();
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
      const { apiDataConfig } = this.config;
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
          // eslint-disable-next-line no-unused-expressions
          this.timer && clearTimeout(this.timer);
          this.timer = setTimeout(async () => {
            await this.getApi();
          }, time);
        }
        const list = JSON.parse(targetObj);
        if (!enableApiFilter) {
          this.list = list;
          this.renderChart();
          return;
        }
        if (enableApiFilter && apiFilterFun && apiDataFilterId) {
          // eslint-disable-next-line no-new-func
          const fun = new Function(`return ${apiFilterFun}`);
          const result = fun()(list);
          if (!(Array.isArray(result) && result.length)) {
            this.list = [];
            this.renderChart();
            return;
          }
          this.list = result;
          this.renderChart();
        }
      }
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
      const params = this.getParameters();
      const res = await getInfoById(params);
      if (enableSQLAutoUpdate) {
        const time = SQLUpdateTime * 1000;
        // eslint-disable-next-line no-unused-expressions
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(async () => {
          await this.getSQL();
        }, time);
      }
      if (!enableSQLFilter) {
        this.list = res;
        this.renderChart();
        return;
      }
      if (enableSQLFilter && SQLFilterFun && SQLDataFilterId) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(`return ${SQLFilterFun}`);
        const result = fun()(res);
        if (!(Array.isArray(result) && result.length)) {
          this.list = [];
          this.renderChart();
          return;
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
