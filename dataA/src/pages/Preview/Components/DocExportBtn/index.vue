/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
    <div class="singleTextWrap" :style="getContentStyles">
      <div class="tabContentWrap">

        <div
            :class="{[`tabContentWrap_${config.componentId}`]: true, active: this.isFlag }"
            class="tabNameWrap"
            @click="handleActive"
        >
            {{ renderContent }}
        </div>

      </div>
    </div>
</template>

<script>
import {screenConfig} from '@/constants/global';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return screenConfig
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    // eslint-disable-next-line no-warning-comments
    // todo: activeComponent与config 两个变量有重复，所有的组件都可以进行优化；
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    changeFilterParams: { // 用于修改过滤条件参数的
      type: Function,
      default: () => {
      }
    }
  },
  data() {
    return {
      hoverActive: null,
      isFlag: false
    };
  },
  computed: {
    renderContent() { // 获取内容
      const { stylesObj: { content } } = this.config;
      return content;
    },
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getList() {
      return this.$store.getters.list;
    }
  },

  mounted() {
    this.insertClass();
  },

  components: {},

  watch: {
    'config.stylesObj'() {
      this.removeClass();
      this.insertClass();

    }
  },
  methods: {
    removeClass() { // 移除样式
      const {componentId} = this.config;
      const id = `tabContentWrap_${componentId}`;
      const ele = document.getElementById(id);
      document.getElementsByTagName('head')[0].removeChild(ele);
    },
    insertClass() { // 生成样式
      const { componentId, stylesObj: {
        normalFSize, // 正常字体大小
        normalColor, // 正常字体颜色
        normalBorderRadius, // 正常倒角
        normalBColor, // 正常边框颜色
        normalBWidth, // 正常边框宽度
        normalBStyle, // 正常边框颜色
        normalBgColor, // 正常背景颜色
        activeFSize, // 悬浮字体大小
        activeColor, // 悬浮字体颜色
        activeBorderRadius, // 悬浮边框倒角
        activeBColor, // 悬浮边框颜色
        activeBWidth, // 悬浮边框宽度
        activeBStyle, // 悬浮边框颜色
        activeBgColor // 悬浮背景颜色
        }
      } = this.config;
      const classNames = `.tabContentWrap_${componentId}`;
      let styleDom = document.createElement('style');
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('id', `tabContentWrap_${componentId}`);
      styleDom.innerHTML = `
        ${classNames} {
          font-size: ${normalFSize}px;
          color: ${normalColor};
          border-radius: ${normalBorderRadius}px;
          border: ${normalBWidth}px ${normalBStyle} ${normalBColor};
          background-color: ${normalBgColor}
        }
         ${classNames}:hover {
          font-size: ${activeFSize}px;
          color: ${activeColor};
          border-radius: ${activeBorderRadius}px;
          border: ${activeBWidth}px ${activeBStyle} ${activeBColor};
          background-color: ${activeBgColor}
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom)
    },
    // findCom(key) {
    //   const com = this.$parent.$children.find((comPonent) => comPonent.config.componentId === key);
    //   return com
    // },
    // async makePic(pic) { // 转换成file对象，返回值
    //   const com = this.findCom(pic);
    //   return new Promise((resolve) => {
    //     if (com) {
    //       const { name } = com.config;
    //       const url = com.instance.myChart.getDataURL({
    //         pixelRatio: 2,
    //         backgroundColor: '#fff'
    //       })
    //       const file = dataURLtoBlob(url, name);
    //       resolve(file);
    //     }
    //     resolve(null)
    //   })
    // },
    // async makeExcelList(dataKey) {
    //   const com = this.findCom(dataKey);
    //   return new Promise((resolve) => {
    //     if (com) {
    //       this.getDataList(com);
    //     }
    //     resolve([]);
    //   })
    // },
    // processHorizontal() { // 处理横向进度条的数据
    // },
    // BasicPieChart(arr){ // 处理饼图数据
    //   console.log(arr, '饼图');
    // },
    // getDataList(com){
    //   let lastList = [];
    //   const { list, config } = com;
    //   const { componentName, dataType, dataConfig: { staticValue } } = config;
    //   if (['BasicBarChart', 'TransverseBarChart', 'BasicLineChart'].includes(componentName)) {
    //     if (dataType === 1) {
    //       const arr = JSON.parse(staticValue);
    //       console.log(arr);
    //     }
    //     console.log('折线图, 柱状图')
    //   }
    //   if (componentName === 'HorizontalProgressBar') {
    //     let arr = [];
    //     if (dataType === 1) {
    //        arr = JSON.parse(staticValue);
    //     } else {
    //       arr = list;
    //     }
    //     lastList = this.processHorizontal(arr);
    //     console.log('横向进度条');
    //   }
    //   if (componentName === 'BasicPieChart') {
    //     console.log('饼图');
    //     let arr = [];
    //     if (dataType === 1) {
    //       arr = JSON.parse(staticValue);
    //     } else {
    //       arr = list;
    //     }
    //     lastList = this.BasicPieChart(arr);
    //   }
    //   if (componentName === 'CircleProgressBar') {
    //     console.log('环形进度条');
    //   }
    //   if (componentName === 'Dashboard') {
    //     console.log('仪表盘');
    //   }
    //   if (componentName === 'RadarChart') {
    //     console.log('雷达图');
    //   }
    //   if (componentName === 'ColumnLineMix') {
    //     console.log('混合图');
    //   }
    // },
    async handleActive() {
      // const { config = [] } = this.config;
      this.$emit('handleActive', this.config)
      // for (let i = 0; i < config.length; i ++) {
      //   const { type, picValue, dataValue, summaryList } = config[i];
      //   if (type === 1) {
      //     const file = await this.makePic(picValue); // 获取图片
      //     const list = await this.makeExcelList(dataValue); // 把图片数据组装成excel数据
      //     console.log(file, list);
      //   }
      //   console.log(config[i]);
      //   // if (type === 2) {
      //   // }
      // }
      // doDownLoad
      // config.forEach( async function(item){
      //   const { type, picValue, dataValue, summaryList } = item;
      //   if (type === 1) {
      //     const file = await that.makePic(picValue); // 获取图片
      //     const list = await that.makeExcelList(dataValue); // 把图片数据组装成excel数据
      //     console.log(file, list);
      //   }
      //   console.log(item);
      //   // if (type === 2) {
      //   // }
      // })
    }
  },
  beforeDestroy() {
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .tabContentWrap {
    min-height: 40px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    .tabNameWrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: pointer;

      .tabName {
        display: inline-block;
      }
    }
  }
}
</style>
