/**
* @name: index
* @author: DELL
* @date: 2022/1/10 16:46
* @description：仪表盘真实界面
* @update: 2022/1/10 16:46
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :id="`basicPie_${config.componentId}`" :style="getContentStyles">
    <div class="singleTextContent" :id="config.componentId">
    </div>
  </div>
</template>

<script>
// 引入基本模板
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { GaugeChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent, LegendScrollComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import { getInfoById } from '@/api/design';
import { getRequestParams, returnChartPosition } from '@/views/HomeMenuConfig/constants/common';
// 引入基本模板
// eslint-disable-next-line no-undef
// const echarts = require('echarts');
// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GaugeChart,
  CanvasRenderer,
  LegendScrollComponent
]);

export default {
  props: {
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
    elementData: {
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
      timer: null,
      supplementaryColor: [], // 补充色
      list: [],
      params: {},
    };
  },

  components: {},

  computed: {
    getContentStyles() {
      const { width, height, top, left, stylesObj } = this.config;
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
        const {
          legendName = '',
          legendPosition = 'lt', // 图例位置
          legendFontFamily = 'Arial,苹方,微软雅黑', // 图例字体
          legendFontWeight = 'normal', // 图例文字粗细
          legendFontSize = 12, // 图例文字大小
          legendColor = '#FFF', // 图例字体颜色
          startAngle = 180, // 起始角度
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
          axisTickWidth = 10, // 刻度线宽度
          axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
          axisLabelDistance = 10, // 标签与刻度线的距离
          axisLabelFontFamily = 'Arial,苹方,微软雅黑', // 标签字体
          axisLabelFontWeight = 'normal', // 标签文字粗细
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
        const legendPos = returnChartPosition(legendPosition);
        const colorArr = axisLineColorConfig.map((item) => [item.name, item.value]);
        const optionConfig = {
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
          const { staticValue = '{}' } = dataConfig;
          contentObj = JSON.parse(staticValue);
        }
        if (dataType === 2 || dataType === 3) {
          contentObj = this.list;
        }

        const chartConfig = {
          type: 'gauge',
          radius: `${radius}%`,
          startAngle,
          endAngle,
          min,
          max,
          splitNumber,
          axisLine: {
            show: axisLine,
            roundCap,
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
            icon,
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
            formatter (value) {
              return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
            }
          },
          data: [{
            value: contentObj.value || 0
          }]
        };
        const series = [chartConfig];
        if (boardConfig.length) {
          boardConfig.forEach((item) => {
            const {
              // eslint-disable-next-line no-shadow
              stylesObj,
              // eslint-disable-next-line no-shadow
              axisLine = false, // 是否启用仪表盘轴线
              // eslint-disable-next-line no-shadow
              progress = false, // 是否启用展示当前进度
              // eslint-disable-next-line no-shadow
              splitLine = false, // 是否启用分割线
              // eslint-disable-next-line no-shadow
              axisTick = false, // 是否启用刻度样式
              // eslint-disable-next-line no-shadow
              axisLabel = false, // 是否启用刻度标签
              // eslint-disable-next-line no-shadow
              pointer = false, // 是否启用指针
              // eslint-disable-next-line no-shadow
              anchor = false, // 指针圆心
              // eslint-disable-next-line no-shadow
              detail = true
            } = item;
            const {
              verticalCenter = 50, // 垂直中心坐标
              horizontalCenter = 50, // 水平中心坐标
              valueMappingField = '', // 值映射字段
              // eslint-disable-next-line no-shadow
              startAngle = 180, // 起始角度
              // eslint-disable-next-line no-shadow
              endAngle = 0, // 结束角度
              // eslint-disable-next-line no-shadow
              radius = 100, // 仪表盘半价
              // eslint-disable-next-line no-shadow
              max = 180, // 刻度最大值
              // eslint-disable-next-line no-shadow
              min = 0, // 刻度最小值
              // eslint-disable-next-line no-shadow
              splitNumber = 5, // 刻度分割段数
              // eslint-disable-next-line no-shadow
              roundCap = true, // 两端启用圆角
              // eslint-disable-next-line no-shadow
              axisLineWidth = 10, // 轴线宽度
              // eslint-disable-next-line no-shadow
              axisLineColorConfig = [], // 轴线颜色
              // eslint-disable-next-line no-shadow
              progressRoundCap = false, // 进度条
              // eslint-disable-next-line no-shadow
              progressWidth = 10, // 进度条宽度
              // eslint-disable-next-line no-shadow
              progressColor = '#58D9F9', // 进度条颜色
              // eslint-disable-next-line no-shadow
              splitLineLength = 10, // 分割线长度
              // eslint-disable-next-line no-shadow
              splitLineDistance = 10, // 分割线离轴线的距离
              // eslint-disable-next-line no-shadow
              splitLineColor = '#fff', // 分割线颜色
              // eslint-disable-next-line no-shadow
              splitLineWidth = 2, // 分割线宽度
              // eslint-disable-next-line no-shadow
              splitLineType = 'solid', // 分割线类型， 实现，虚线，点线
              // eslint-disable-next-line no-shadow
              axisTickSplitNumber = 5, // 分隔线之间分割的刻度数
              // eslint-disable-next-line no-shadow
              axisTickLength = 10, // 刻度线长
              // eslint-disable-next-line no-shadow
              axisTickDistance = 0, // 刻度线与轴线的距离
              // eslint-disable-next-line no-shadow
              axisTickColor = '#fff', // 刻度线颜色
              // eslint-disable-next-line no-shadow
              axisTickWidth = 10, // 刻度线宽度
              // eslint-disable-next-line no-shadow
              axisTickType = 'solid', // 刻度线类型， 实现，虚线，点线
              // eslint-disable-next-line no-shadow
              axisLabelDistance = 10, // 标签与刻度线的距离
              // eslint-disable-next-line no-shadow
              axisLabelFontFamily = 'Arial,苹方,微软雅黑', // 标签字体
              // eslint-disable-next-line no-shadow
              axisLabelFontWeight = 'normal', // 标签文字粗细
              // eslint-disable-next-line no-shadow
              axisLabelFontSize = 16, // 标签文字大小
              // eslint-disable-next-line no-shadow
              axisLabelColor = '#FFF', // 标签文字颜色
              // eslint-disable-next-line no-shadow
              icon = '', // 指针图标， 默认
              // eslint-disable-next-line no-shadow
              pointerLength = 60, // 指针长度
              // eslint-disable-next-line no-shadow
              pointerWidth = 30, // 指针宽度
              // eslint-disable-next-line no-shadow
              pointerColor = '#58D9F9', // 制作颜色
              // eslint-disable-next-line no-shadow
              anchorIcon = '', // 指针圆心图标， 默认
              // eslint-disable-next-line no-shadow
              anchorSize = 6, // 指针圆心大小
              // eslint-disable-next-line no-shadow
              anchorColor = '#000', // 指针圆心颜色
              // eslint-disable-next-line no-shadow
              horizontalOffset = 0, // 水平方向偏移
              // eslint-disable-next-line no-shadow
              verticalOffset = 35, // 垂直方向偏移
              // eslint-disable-next-line no-shadow
              detailFontFamily = 'Arial,苹方,微软雅黑',
              // eslint-disable-next-line no-shadow
              detailFontWeight = 'normal',
              // eslint-disable-next-line no-shadow
              detailFontSize = 16,
              // eslint-disable-next-line no-shadow
              detailColor = '#333',
              // eslint-disable-next-line no-shadow
              detailPrefix = '', // 值前缀
              // eslint-disable-next-line no-shadow
              detailSuffix = '' // 值后缀
              // eslint-disable-next-line no-shadow
            } = stylesObj;
            // eslint-disable-next-line no-shadow
            const colorArr = axisLineColorConfig.map((item) => [item.name, item.value]);
            // eslint-disable-next-line no-shadow
            const chartConfig = {
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
                roundCap,
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
                icon,
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
                formatter (value) {
                  console.log(value, 'zz');
                  return `${detailPrefix}${value.toFixed(0)}${detailSuffix}`;
                }
              }
            };
            if (valueMappingField && contentObj[valueMappingField]) {
              chartConfig.data = [{
                value: contentObj[valueMappingField]
              }];
            } else {
              chartConfig.data = [];
            }
            series.push(chartConfig);
          });
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
  activated() {
    this.initDom();
  },
  watch: {
    otherParams: {
      deep: true,
      immediate: true,
      handler(v, o) {
        if (v && o) {
          const { dataType, SqlDataConfig: {
            enableDataManage, variableConfig = []
          } } = this.config;
          if (dataType === 3 && enableDataManage && variableConfig.length) {
            this.checkParams(variableConfig);
          }
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
    // elementData: {
    //   deep: true,
    //   immediate: false,
    //   handler(v, o) {
    //     const { id, dataType } = this.config;
    //     if (!isEqual(v, o) && dataType === 3) {
    //       this.reduceDataFilter(v[id]);
    //     }
    //   }
    // }
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
    checkParams(variableConfig) {
      const obj = {};
      Object.keys(this.otherParams).forEach((item) => {
        const currentVar = variableConfig.find((varObj) => varObj.name === item);
        if (currentVar) {
          obj[item] = this.otherParams[item];
        }
      });
      if (JSON.stringify(obj) !== '{}') {
        this.fetchData();
      }
    },
    initDom() {
      const { componentId } = this.config;
      // eslint-disable-next-line max-len
      this.instance = Object.freeze({ myChart: echarts.init(document.getElementById(componentId)) });
      this.getFilterParamsObj();
      this.fetchData();
    },
    async fetchData() {
      if (!this.instance) return;
      const { dataType } = this.config;
      if (dataType === 1) {
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
      }
      if (dataType === 3) {
        await this.getSQL();
        const option = this.getOption();
        // 绘制图表
        this.instance.myChart.setOption(
          option
        );
      }
      // getInfoById
    },
    async getSQL() {
      const { SqlDataConfig } = this.config;
      const {
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
      await this.reduceDataFilter(res);
    },
    async reduceDataFilter(res) {
      const { SqlDataConfig } = this.config;
      const {
        SQLFilterFun,
        enableSQLFilter,
        SQLDataFilterId,
      } = SqlDataConfig;
      if (!enableSQLFilter) {
        this.list = res;
        return;
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
        return;
      }
      this.list = res;
    },

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
