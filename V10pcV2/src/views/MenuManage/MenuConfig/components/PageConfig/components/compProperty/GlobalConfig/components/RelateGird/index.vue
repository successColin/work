<template>
  <apiot-dialog
    class="relateTree"
    title="关系图"
    :loading.sync="showLoading"
    cancelBtnName="关闭"
    :isShowSure="false"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <div id="echartsMain" ref="echartsMain"></div
  ></apiot-dialog>
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core';
// 引入柱状图图表，图表后缀都为 Chart
import { LineChart, GraphChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系组件，组件后缀都为 Component
import { TitleComponent, TooltipComponent } from 'echarts/components';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';
import compMap from '@/globalComponents/ApiotColumn/CompColumn/CompItem/compMap.js';
import { getDesignTriggersLinkDiagram } from '@/api/menuConfig';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LineChart,
  GraphChart,
  CanvasRenderer,
]);

export default {
  props: {
    configData: {
      type: Array,
    },
    triggerCompMap: {
      type: Object,
    },
  },
  data() {
    return {
      showLoading: false,
      compList: [],
      linkList: [],
      triggerTypeObj: {},
      richText: {
        text: {
          color: '#333',
          padding: [3, 0, 0, 3],
        },
      },
    };
  },

  components: {},

  computed: {
    getTriggerType() {
      const obj = {};
      this.$store.state.dictManage.TRIGGER_EVENT.forEach((item) => {
        obj[item.value] = item.name;
      });
      return obj;
    },
  },

  mounted() {
    this.initRichText();
    this.getDesignTriggersLinkDiagram();
  },
  inject: ['isPanel', 'sysMenuDesignId'],
  methods: {
    async getDesignTriggersLinkDiagram() {
      const data = await getDesignTriggersLinkDiagram({
        sysMenuDesignId: this.isPanel
          ? this.sysMenuDesignId
          : this.$route.query.id,
      });
      // console.log(data);
      const obj = {};
      if (data.compList && data.linkList) {
        this.compList = data.compList.reduce((cur, next) => {
          if (!obj[next.compId]) {
            next.id = next.compId;
            const arr = next.triggerCompPath.split('/');
            if (this.triggerCompMap[arr[2]]) {
              arr[2] = this.triggerCompMap[arr[2]].compName;
            }
            if (this.triggerCompMap[arr[3]]) {
              arr[3] = this.triggerCompMap[arr[3]].compName;
            }

            arr.shift();
            next.triggerCompPath = arr.join('/');
            next.symbol = 'rect';
            next.symbolSize = [80, 28];
            next.name = `${this.triggerCompMap[next.compId].compName}`;
            cur.push(next);
            obj[next.compId] = true;
          }
          return cur;
        }, []);
        data.linkList.forEach((link) => {
          link.source = link.compId;
          link.target = link.affectingCompId;
          // if (!this.triggerTypeObj[link.compId]) {
          //   this.triggerTypeObj[link.compId] = [link.triggerType];
          // } else if (
          //   !this.triggerTypeObj[link.compId].includes(link.triggerType)
          // ) {
          //   this.triggerTypeObj[link.compId].push(link.triggerType);
          // }
        });
        this.linkList = data.linkList;
        // console.log(this.compList, this.linkList);
        this.initEcharts();
      }
    },
    initRichText() {
      Object.keys(compMap).forEach((key) => {
        const tempUrl = compMap[key].imgUrl;
        this.richText[`img${key}`] = {
          backgroundColor: {
            image: require(`@/assets/img/menu_images/${tempUrl}`),
          },
          width: 20,
          height: 20,
        };
      });
    },
    initEcharts() {
      const mainDom = this.$refs.echartsMain; // 设置dom
      this.myEcharts = echarts.init(mainDom); // 初始化echarts
      const option = {
        series: [
          {
            type: 'graph',
            layout: 'force',
            nodes: this.compList,
            links: this.linkList,
            width: 100,
            height: 28,
            itemStyle: {
              color: '#E5F0FF',
            },
            lineStyle: {
              color: '#4689F5',
              curveness: 0.3,
            },
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 3,
              },
              itemStyle: {
                color: '#E5F0FF',
              },
            },
            label: {
              show: true,
              position: ['50%', '50%'],
              fontSize: 14,
              color: '#333333',
              align: 'center',
              verticalAlign: 'middle',
              width: 80,
              overflow: 'truncate',
              rich: this.richText,
              formatter: (param) => {
                // img1是rich里面的对应的规则名，自定义即可，
                // {img|}表示那个规则或者说是空间的占位符的意思
                const res = `{img${
                  this.triggerCompMap[param.data.compId].compType
                }|}{text|${param.data.name}}`;
                return res;
              },
            },
            autoCurveness: 0.01,
            edgeLabel: {
              // 边的设置
              show: true,
              position: 'middle',
              fontSize: 12,
              color: '#000',
              formatter: (params) => {
                // if (params.data.triggerType === 2) {
                //   return this.getTriggerType[params.data.triggerType];
                // }
                // // console.log(params.data.linkCode);
                if (params.data.target === params.data.source) {
                  return '';
                }
                let txt = '';
                if (params.data.compType === 1) {
                  txt = '发起组件';
                }
                if (params.data.compType === 2) {
                  txt = '影响组件';
                }
                if (params.data.compType === 3) {
                  txt = '其他组件';
                }
                return `${txt}(${params.data.linkCode})`;
              },
            },
            edgeSymbol: ['circle', 'arrow'], // 边两边的类型
            force: {
              // initLayout: 'circular',
              repulsion: 100,
              edgeLength: 300,
            },
          },
        ],
        tooltip: {
          formatter: (params) =>
            // const curTriggerArr = [];
            // this.triggerTypeObj[params.data.compId].forEach((item) => {
            //   if (item) {
            //     curTriggerArr.push(this.getTriggerType[item]);
            //   }
            // });
            `组件路径：${params.data.triggerCompPath}`,
        },
      };
      this.myEcharts.setOption(option);
    },
  },
};
</script>

<style lang="scss">
#echartsMain {
  width: 100%;
  height: 100%;
}
.relateTree {
  & > .el-dialog {
    width: 930px;
    height: 800px;
    .el-dialog__body {
      height: 682px;
    }
  }
}
</style>
