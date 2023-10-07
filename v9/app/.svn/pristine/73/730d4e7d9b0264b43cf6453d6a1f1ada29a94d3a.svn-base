<template>
  <view class="container">
    <view class="ectart-title">{{ chartData.label }}</view>
    <view class="canvasView" v-if="echartData.series.length > 0">
      <echart
        class="ec-canvas"
        :canvasId="canvasId + '_'"
        :echartData="echartData"
        ref="templateChart"
      />
    </view>
    <!-- <view class="ectart-title">{{$t('lang-echart-repair-proportion')}}</view> 中文：工单占比 -->
    <view class="canvasView" v-for="item in pieData" :key="item.canvasId">
      <echart
        class="ec-canvas"
        :canvasId="item.canvasId + '_'"
        :echartData="item"
        ref="templateChart"
      />
    </view>
  </view>
</template>

<script>
import echart from '@/components/echart.vue';
export default {
  name: 'echartsTemplate',
  data() {
    return {
      width: 300,
      height: 200,
      echartHeight: 1,
      echartData: {
        legend: {
          data: [],
          top: 0,
          itemGap: 10,
          left: 50,
          right: 30,
          textStyle: {
            rich: {
              white: {
                color: '#fff',
                fontSize: 12,
                padding: [6, 0, 0, 0],
              },
            },
          },
        },
        tooltip: {
          trigger: this.tooltipTrigger,
          backgroundColor: '#6a7985',
          confine: true,
          itemGap: 50,
        },
        grid: {
          containLabel: true,
          left: 10,
          right: 10,
          bottom: 10,
        },
        xAxis: [],
        color: ['#3794EF', '#54D5C7', '#FD8863', '#FFC745'],
        yAxis: [],
        series: [],
      },
      pieData: [],
    };
  },
  props: {
    canvasId: {
      type: Number,
      default: 1234,
    },
    lazyLoad: {
      type: Boolean,
      default: false,
    },
    disableTouch: {
      type: Boolean,
      default: false,
    },
    throttleTouch: {
      type: Boolean,
      default: false,
    },
    chartData: {
      type: Object,
      default() {
        return {};
      },
    },
    templateChart: {
      type: String,
      default: 'templateChart',
    },
  },
  components: {
    echart,
  },
  methods: {
    initData() {
      this.$http
        .post('currencyPcList/currencyGetDataByElementId', {
          elementId: this.chartData.elementId,
        })
        .then((res) => {
          let data = res.data.data.yAxis;
          let xAxis = res.data.data.xAxis;
          for (var n in data) {
            let chartType, ydata, chartName, yAxisIndex, pieData;
            for (let i = 0; i < this.chartData.chartList.length; i++) {
              if (this.chartData.chartList[i].id == n) {
                chartType = this.chartData.chartList[i].chartType;
                // axisUnitY = this.chartData.chartList[i].axisUnitY;
                chartName = this.chartData.chartList[i].name;
                yAxisIndex = i;
                pieData = this.chartData.chartList[i];
                break;
              }
            }
            if (chartType == 3) {
              this.initPieData(data[n], pieData, xAxis);
            } else {
              ydata = {
                type: this.getChartType(chartType),
                data: data[n],
                name: chartName,
                label: {
                  show: false,
                },
                // symbol: 'circle',
                symbolSize: 8,
              };
              this.echartData.legend.data.push(chartName);
              this.echartData.series.push(ydata);
            }
          }
          let axisUnitY = this.chartData.chartList[0].axisUnitY;
          let yAxis = {
            type: 'value',
            name: axisUnitY,
            nameLocation: 'end',
            nameTextStyle: {
              padding: [0, 30, 0, 0],
            },
            axisLabel: {
              formatter: '{value}',
            },
            axisLine: {
              lineStyle: {
                color: '#808080',
              },
            },
          };
          this.echartData.yAxis.push(yAxis);
          this.echartData.xAxis = [
            {
              type: 'category',
              nameTextStyle: {
                color: '#808080',
              },
              data: xAxis,
              axisLine: {
                lineStyle: {
                  color: '#808080',
                },
              },
            },
          ];
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    initPieData(data, pieData, xdata) {
      let chartType,
        axisUnitY,
        ydata,
        chartName,
        yAxisIndex,
        pie = {
          series: [],
          xAxis: [],
          yAxis: [],
          tooltip: {
            triggerOn: 'mousemove|click',
            showContent: true,
            confine: true,
            formatter: '{b}:{c}个({d}%)', //模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
          },
        };
      chartType = pieData.chartType;
      axisUnitY = pieData.axisUnitY;
      chartName = pieData.name;
      ydata = {
        type: 'pie',
        data: data,
        name: chartName,
        label: {
          show: false,
        },
      };
      let pieLegend = [];
      let pieSeriesData = [];
      let legend = {
        data: [],
        bottom: 10,
        itemGap: 10,
        textStyle: {
          width: '100%',
        },
      };
      pie.legend = legend;
      for (let k = 0; k < data.length; k++) {
        pieSeriesData.push({
          value: data[k],
          name: xdata[k],
        });
        pieLegend.push(xdata[k]);
        pie.legend.data.push(xdata[k]);
      }
      ydata = {
        type: 'pie',
        data: pieSeriesData,
        name: chartName,
        radius: ['50%', '70%'],
        label: {
          show: false,
        },
        // label: {
        // 	show: true,
        // 	position: 'center',
        // 	formatter: '{b}:{c}个({d})%',//模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
        // 	textStyle : {
        // 		align : 'center',
        // 		baseline : 'middle',
        // 		fontFamily : '微软雅黑',
        // 		fontSize : 15,
        // 		fontWeight : 'bolder'
        // 	}
        // },
      };
      let tooltip = {
        triggerOn: 'mousemove|click',
        showContent: true,
        formatter: '{b}:{c}个({d})%', //模板变量有 {a}、{b}、{c}、{d}，分别表示系列名，数据名，数据值，百分比。{d}数据会根据value值计算百分比
      };
      pie.canvasId = this.canvasId + '_' + this.pieData.length;
      pie.color = ['#3794EF', '#54D5C7', '#FD8863', '#FFC745'];
      pie.series.push(ydata);

      this.pieData.tooltip = tooltip;
      this.pieData.push(pie);
    },
    getChartType(type) {
      if (type == 1) {
        return 'line';
      } else if (type == 2) {
        return 'bar';
      } else if (type == 3) {
        return 'pie';
      }
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style>
.ec-canvas {
  display: flex;
  height: 100%;
  flex: 1;
}
</style>
