/**
* @name: index
* @author: DELL
* @date: 2021/8/20 15:28
* @description：index
* @update: 2021/8/20 15:28
*/
<!-- 页面 -->
<template>
  <div class="content">
    <div class="contentWrap"
         :class="{ equalWidthRatio: bgConfig.showType === 2, design:  bgConfig.showType === 4}"
         :style="getBGStyle"
    >
      <div class="previewWrap" :style="getStylesBgUrl()">
        <div class="contentBox">
          <component
              :transitionScaleX="transitionScaleX"
              :transitionScaleY="transitionScaleY"
              :config="configItem"
              :is="configItem.componentName"
              v-for="(configItem) in filterList"
              :key="configItem.componentId"
              :metaDataList=metaDataList
              :updateState="updateState"
              :otherParams="filterParameter"
              @handleActive="handleActive"
          ></component>
        </div>
        <CScreenBullet
            :visible="visible"
            v-if="visible"
            :iframeUrl="singleConfig.url || ''"
            :width="singleConfig.bulletWidth"
            :height="singleConfig.bulletHeight"
        ></CScreenBullet>
      </div>
      <div class="contentBg" :style="getStylesBg()"></div>
    </div>
    <video class="contentVideo" style="width:100%; height:100%; object-fit: fill" muted loop autoplay
           :src="bgConfig.bgImage"></video>
    <Loading v-if="isShow"/>
    <ImageZoom
        v-if="imageFileVisible"
        :imageFileName="imageFileName"
        :imageFileUrl="imageFileUrl"
    />
    <Login v-if="loginVisible" @close="hideLogin"></Login>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import Bus from '@/utils/bus';
import {fetchComList, getDesignList, overdue} from '@/services/design';
import {saveAs} from '@/utils/utils';
import axios from 'axios';
// import qs from 'qs';
import query from '@/constants/query';

const Login = () => import('./component/Login');
const PopCloseButton = () => import('@/pages/Preview/Components/PopCloseButton/index');
const BackgroundBox = () => import('@/pages/Preview/Components/BackgroundBox/index');
const SingleLineText = () => import('@/pages/Preview/Components/SingleLineText/index');
const ImageBox = () => import('@/pages/Preview/Components/ImageBox/index');
const Video = () => import('@/pages/Preview/Components/Video/index');
const BasicPieChart = () => import('@/pages/Preview/Components/BasicPieChart/index');
const BasicBarChart = () => import('@/pages/Preview/Components/BasicBarChart/index');
const BasicLineChart = () => import('@/pages/Preview/Components/BasicLineChart/index');
const GeneralTable = () => import('@/pages/Preview/Components/GeneralTable/index');
const TransverseBarChart = () => import('@/pages/Preview/Components/TransverseBarChart/index');
const CircleProgressBar = () => import('@/pages/Preview/Components/CircleProgressBar/index');
const ColumnLineMix = () => import('@/pages/Preview/Components/ColumnLineMix/index');
const Dashboard = () => import('@/pages/Preview/Components/Dashboard/index');
const AuxiliaryLine = () => import('@/pages/Preview/Components/AuxiliaryLine/index');
const RealTime = () => import('@/pages/Preview/Components/RealTime/index');
const TabComponent = () => import('@/pages/Preview/Components/TabComponent/index');
const TimeFiltering = () => import('@/pages/Preview/Components/TimeFiltering/index');
const DropdownBox = () => import('@/pages/Preview/Components/DropdownBox/index');
const CanvasDrawing = () => import('@/pages/Preview/Components/CanvasDrawing/index');
const DataSwitching = () => import('@/pages/Preview/Components/DataSwitching/index');
const Marquee = () => import('@/pages/Preview/Components/Marquee/index');
const FullScreenBtn = () => import('@/pages/Preview/Components/FullScreenBtn/index');
const HorizontalProgressBar = () => import('@/pages/Preview/Components/HorizontalProgressBar/index');
const RadarChart = () => import('@/pages/Preview/Components/RadarChart/index');
const DocExportBtn = () => import('@/pages/Preview/Components/DocExportBtn/index');
const BasicMap = () => import('@/pages/Preview/Components/BasicMap/index');
const NationalProvinceMap = () => import('@/pages/Preview/Components/NationalProvinceMap/index');
const RoseChart = () => import('@/pages/Preview/Components/RoseChart/index');
const FunnelChart = () => import('@/pages/Preview/Components/FunnelChart/index');
const Liquidfill = () => import('@/pages/Preview/Components/Liquidfill/index');
const Sankey = () => import('@/pages/Preview/Components/Sankey/index');
const InfoPresentation = () => import('@/pages/Preview/Components/InfoPresentation/index');

export default {
  props: {
    frameParameters: { // 弹框参数
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      loginVisible: false, // 是否需要登录
      imageFileName: '',
      imageFileUrl: '',
      imageFileVisible: false,
      singleConfig: {}, // lianjie url
      visible: false, // tangkuang
      isShow: true,
      bgConfig: {}, // 背景配置
      transitionScale: 1, // 缩放比例
      list: [], // 配置控件
      transitionScaleX: 1,
      transitionScaleY: 1,
      metaDataList: [],
      timer: null,
      filterParameter: {} // 用于tab控件，时间控件组装过滤参数
    };
  },

  components: {
    Login,
    Liquidfill,
    FunnelChart,
    RoseChart,
    Video,
    BasicMap,
    FullScreenBtn,
    PopCloseButton,
    SingleLineText,
    BackgroundBox,
    ImageBox,
    BasicPieChart,
    BasicBarChart,
    BasicLineChart,
    GeneralTable,
    CircleProgressBar,
    TransverseBarChart,
    ColumnLineMix,
    Dashboard,
    AuxiliaryLine,
    RealTime,
    TabComponent,
    TimeFiltering,
    DropdownBox,
    CanvasDrawing,
    DataSwitching,
    Marquee,
    HorizontalProgressBar,
    RadarChart,
    DocExportBtn,
    NationalProvinceMap,
    Sankey,
    InfoPresentation
  },

  computed: {
    makeId() { // jiemi
      return function (id) {
        console.log(id);
        return window.atob(id)
      }
    },
    filterList() {
      return this.list.filter((item) => item.isShow);
    },
    getBGStyle() {
      const {bgImage, bgColor, width, height, showType} = this.bgConfig;
      let styles = '';
      if (showType === 4) {
        styles += `width: ${width}px;height:${height}px;`;
      }
      if (bgImage) {
        styles += `background-image: url('${bgImage || ''}');`;
        return styles;
      }
      if (bgColor) {
        styles += `background:${bgColor || ''};`;
        return styles;
      }
      return ''
    },
    getStylesBgUrl() { // 获取背景图
      return function () {
        const {bgImage, width, height, showType} = this.bgConfig;
        let styles = '';
        // if (showType === 4) {
        styles += `width: ${width}px;height:${height}px;`;
        // }
        if (showType === 2 || showType === 4) {
          styles += `background-image: url('${bgImage || ''}');transform: scale(${this.transitionScaleX}, ${this.transitionScaleY}) ;`;
          return styles;
        }
        styles += `background-image: url('${bgImage || ''}');transform: scale(${this.transitionScaleX}, ${this.transitionScaleY}) translate3d(-50%, -50%, 0px);`;
        return styles;
      }
    },
    getStylesBg() { // 获取大屏背景色
      return function () {
        return `background:${this.bgConfig.bgColor || ''}`
      }
    }
  },

  mounted() {
    Bus.$off('modalOpera').$on('modalOpera', ({visible, singleConfig}) => {
      this.visible = visible;
      this.singleConfig = singleConfig;
    });
    Bus.$off('previewOpera').$on('previewOpera', ({visible, imageFileName, imageFileUrl}) => {
      this.imageFileVisible = visible;
      this.imageFileName = imageFileName;
      this.imageFileUrl = imageFileUrl;
    });
    this.doCheck();
    window.addEventListener('resize', this.setDrawContent)
    window.addEventListener('message', (e) => {
      if (e.data.message === 'modalClose') {
        this.visible = Boolean(e.data.visible);
      }
      if (e.data.message === 'doExport') {
        this.handleActive();
      }
    }, false);
  },

  methods: {
    checkIsOverdued() { // 校验页面是否已经过期
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        const {params: {id}} = this.$route;
        const res = await overdue({screenId: this.makeId(id)});
        if ( typeof res === 'object' && res.code === 'SH004' ) {
          await this.$router.push('/expired');
        } else {
          this.checkIsOverdued();
        }
      }, 60 * 1000);
    },
    async hideLogin() { // 登录成功
      const {params: {id}} = this.$route;
      try {
        // 登录成功之后，通过这个接口到获取分享的配置信息
        const res = await overdue({screenId: this.makeId(id)});
        // const {publish} = res;
        if (res && typeof res === 'string') {
          this.isShow = true;
          this.loginVisible = false;
          await this.init();
        }
      } catch (e) {
        this.isShow = false;
        this.loginVisible = true;
      }
    },
    async doCheck() { // 校验是否需要登录
      const {params: {id}} = this.$route;
      const res = await overdue({screenId: this.makeId(id)});
      console.log(res, '        console.log(res)\n');

      const {publish, code} = res;
      if (typeof res === 'object' && publish === 4) {
        this.isShow = false;
        this.loginVisible = true;
      } else if ( typeof res === 'string' && res ) {
        localStorage.setItem('shareToken', res);
        await this.init();
      } else if ( typeof res === 'object' && code === 'SH004' ) {
        await this.$router.push('/expired');
      }
      // if (publish === 3) {
      //   this.isShow = true;
      //   this.loginVisible = false;
      //   await this.init();
      // }
    },
    updateState(key, itemObj) { // 修改data中的值
      this[key] = itemObj;
    },
    async init(otherParams) {
      const {params: {id}, query} = this.$route;
      const api = query.designTypePreview === 'APP' ? getDesignList : fetchComList;
      delete query.designTypePreview;
      try {
        const data = await api({id: this.makeId(id), ...otherParams});
        const {screenDesignJson = '{}', list = []} = data;
        this.bgConfig = JSON.parse(screenDesignJson);
        document.title = this.bgConfig.title;
        this.metaDataList = list.map((item) => {
          const {designJson = '{}', id} = item;
          const obj = JSON.parse(designJson);
          return {
            id,
            ...obj
          };
        });
        this.getInitFilterParams(this.metaDataList);
        // this.list = this.metaDataList.filter(item => item.isShow);
        this.$nextTick(() => {
          this.isShow = false;
          this.setDrawContent();
        })
      } catch (e) {
        this.isShow = false;
      }
    },
    getInitFilterParams(arr) {
      let params = {};
      let newArr = cloneDeep(arr);
      arr.forEach((item) => {
        const {componentName} = item;
        if (componentName === 'TabComponent') { // tab
          const {stylesObj = {}, tabConfig = []} = item;
          const {defaultShowTab, paramName} = stylesObj;
          if (!paramName) {
            return;
          }
          const i = defaultShowTab.split('_')[1]; // 默认选中的tab
          const {geChartArray = [], value} = tabConfig[+i];
          if (!geChartArray.length) {
            return;
          }
          if (!value) {
            return;
          }
          geChartArray.forEach((arr) => {
            params[`${arr}_${paramName}`] = value;
          })
        } else if (componentName === 'DropdownBox') { // 下拉
          const {
            stylesObj: {
              updateChart = [],
              selectOptions = [],
              defaultCheckedTimeType = '',
              paramsFiled = ''
            }
          } = item;
          if (!selectOptions.length || !paramsFiled || !updateChart.length || !defaultCheckedTimeType) {
            return;
          }
          let arr = defaultCheckedTimeType.split('_');
          const i = +arr[arr.length - 1];
          const obj = selectOptions[i];
          const value = obj.value;
          updateChart.forEach((chart) => {
            params[`${chart}_${paramsFiled}`] = value;
          })
        } else if (componentName === 'DataSwitching') {
          const {beforeParamsConfig = []} = item;
          beforeParamsConfig.forEach((beforeItems) => {
            const index = newArr.findIndex(items => items.componentId === beforeItems.componentId);
            if (index !== -1) {
              newArr[index].isShow = beforeItems.isShow;
              const {variableConfig = []} = item;
              if (variableConfig.length) {
                variableConfig.forEach((varObj) => {
                  const {name, value} = varObj;
                  if (name) {
                    params[`${beforeItems.componentId}_${name}`] = value;
                  }
                })
              }
            }
          })
        }
      })

      this.filterParameter = params;
      this.list = newArr.filter((item) => item.isShow); // 只展示显示的控件
      // this.checkIsOverdued();
    },
    setDrawContent() { //  计算画布大小
      const {width: availWidth, height: availHeight} = document.querySelector('.contentWrap').getBoundingClientRect();
      const {showType, width: dWidth, height: dHeight} = this.bgConfig;
      const widthScalc = availWidth / (dWidth || 1920);
      const heightScalc = availHeight / (dHeight || 1080);
      // this.transitionScale = widthScalc > heightScalc ? heightScalc : widthScalc;
      if (showType === 1) {
        this.transitionScaleX = widthScalc;
        this.transitionScaleY = heightScalc;
      }
      if (showType === 2) {
        this.transitionScaleX = widthScalc;
        this.transitionScaleY = widthScalc;
      }
      if (showType === 3) {
        this.transitionScaleX = heightScalc;
        this.transitionScaleY = heightScalc;
      }
      if (showType === 4) {
        // const transitionScale = widthScalc > heightScalc ? heightScalc : widthScalc;
        this.transitionScaleX = 1;
        this.transitionScaleY = 1;
      }
    },
    findCom(key) {
      const com = this.$children.find((comPonent) => comPonent.config.componentId === key);
      return com
    },
    async makePic(pic) { // 转换成file对象，返回值
      const com = this.findCom(pic);
      return new Promise((resolve) => {
        if (com) {
          // const { name } = com.config;
          const url = com.instance.myChart.getDataURL({
            pixelRatio: 2,
            backgroundColor: this.bgConfig.bgColor || 'rgb(0,0,0)'
          })
          // const file = dataURLtoBlob(url, name);
          resolve(url);
        }
        resolve(null)
      })
    },
    async makeExcelList(dataKey) {
      const com = this.findCom(dataKey);
      return new Promise((resolve) => {
        if (com) {
          const list = this.getDataList(com);
          resolve(list);
        }
        resolve([]);
      })
    },
    async makeSummary(dataList = []) {
      return new Promise((resolve) => {
        if (dataList.length) {
          const list = [];
          dataList.forEach((item) => {
            const {name, value} = item;
            const com = this.findCom(value);
            const {content} = com;
            list.push([name, content]);
          })
          resolve(list);
        }
        resolve([]);
      })
    },
    CircleProgressBar(obj) { // 处理环形进度条
      const {total, value} = obj;
      const v = total ? parseFloat((value / total).toFixed(10)) * 100 : 0;
      return [['当前', '总数', '占比'], [value, total, `${v.toFixed(2)}%`]];
    },
    Dashboard(obj) { // 处理仪表盘
      const {value} = obj;
      return [['值'], [value]];
    },
    processHorizontal(arr) { // 处理横向进度条的数据
      const list = [['名称', '占比']];
      arr.forEach((item) => {
        const {y, s} = item;
        const v = s ? parseFloat((y / s).toFixed(10)) * 100 : 0;
        list.push([item.x, `${v.toFixed(2)}%`]);
      })
      return list;
    },
    BasicPieChart(arr) { // 处理饼图数据
      const list = [['名称', '值']];
      arr.forEach((item) => {
        list.push([item.name, item.value])
      })
      return list;
    },
    RadarChart(arr, config) { // 雷达图
      const {stylesObj: {dataField}, indicator} = config;
      const indicatorArr = indicator.filter((item) => item.enable)
      const thead = indicatorArr.map((item) => item.name);
      let list = [['', ...thead]];
      const xArr = [];
      arr.forEach((item) => { // 去重
        const {x} = item;
        if (!xArr.includes(x)) {
          xArr.push(x);
        }
      });
      xArr.forEach((item) => {
        const itemArr = [item];
        indicatorArr.forEach((t) => {
          const current = arr.find((a) => a.x === item && a[dataField] === t.fieldValue);
          itemArr.push(current ? current.value : 0);
        });
        list.push(itemArr);
      })
      return list;
    },
    ColumnLineMix(obj) { // 柱线混合图
      const {xAxis, list} = obj;
      const lastList = [['', ...xAxis]];
      list.forEach((item) => {
        const {name, data = []} = item;
        lastList.push([name, ...data]);
      })
      return lastList;
    },
    GeneralTable(arr, config) { // 列表
      const {columnConfig = []} = config;
      const thead = [];
      const theadField = [];
      columnConfig.forEach((item) => {
        const {fieldName, field} = item;
        thead.push(fieldName);
        theadField.push(field)
      })
      let list = [[...thead]];
      arr.forEach((arrObj) => {
        let valueArr = [];
        theadField.forEach((field) => {
          valueArr.push(arrObj[field]);
        })
        list.push(valueArr);
      })
      return list;
    },
    commonChart(arr) {
      const equil = (list, key) => { // 去重
        const equilArr = [];
        list.forEach((item) => {
          if (!equilArr.includes(item[key])) {
            equilArr.push(item[key]);
          }
        })
        return equilArr;
      };
      const headArr = equil(arr, 'x');
      let lastList = [['', ...headArr]];
      const tbody = equil(arr, 's');
      tbody.forEach((t) => {
        const zArr = [t];
        headArr.forEach((head) => {
          const obj = arr.find((arrObj) => arrObj.x === head && arrObj.s === t);
          if (obj) {
            zArr.push(obj.y);
          }
        });
        lastList.push(zArr);
      });
      return lastList;
    },
    getDataList(com) {
      let lastList = [];
      console.log(com);
      const {list, config} = com;
      const {componentName, dataType, dataConfig: {staticValue}} = config;
      let arr = [];
      if (dataType === 1) {
        arr = JSON.parse(staticValue);
      } else if (componentName === 'GeneralTable') {
        const GeneralTableCom = com.$children[0];
        arr = GeneralTableCom.list;
      } else {
        arr = list;
      }
      if (['BasicBarChart', 'TransverseBarChart', 'BasicLineChart'].includes(componentName)) {
        lastList = this.commonChart(arr);
      }
      if (componentName === 'HorizontalProgressBar') {
        lastList = this.processHorizontal(arr);
      }
      if (['BasicPieChart', 'RoseChart'].includes(componentName)) {
        lastList = this.BasicPieChart(arr);
      }
      if (componentName === 'CircleProgressBar') {
        lastList = this.CircleProgressBar(arr);
      }
      if (componentName === 'Dashboard') {
        lastList = this.Dashboard(arr);
      }
      if (componentName === 'RadarChart') {
        lastList = this.RadarChart(arr, config);
      }
      if (componentName === 'ColumnLineMix') {
        lastList = this.ColumnLineMix(arr, config);
      }
      if (componentName === 'GeneralTable') {
        lastList = this.GeneralTable(arr, config);
      }
      console.log(componentName);
      return lastList;
    },
    async handleActive(component) {
      // console.log(111);
      // const data = {data: 10000}
      // // window.parent.postMessage(data , '*');
      // console.log(uni, 33);
      // uni.postMessage({
      //   data: {
      //     action: 'message'
      //   }
      // });
      // document.addEventListener('UniAppJSBridgeReady', function() {
      //   uni.postMessage({
      //     data: {
      //       action: 'message'
      //     }
      //   });
      //   uni.getEnv(function(res) {
      //     console.log('当前环境：' + JSON.stringify(res));
      //   });
      // });
      let config;
      if (component) {
        config = component.config || [];
      } else {
        const current = this.metaDataList.find((item) => item.componentName === 'DocExportBtn');
        config = current.config || [];
      }
      const paramsList = [];
      // todo 漏斗图数据导出待处理
      for (let i = 0; i < config.length; i++) {
        const {type, picValue, dataValue, summaryList, sheetName} = config[i];
        if (type === 1) {
          const file = await this.makePic(picValue); // 获取图片
          const list = await this.makeExcelList(dataValue); // 把图片数据组装成excel数据
          const obj = {
            name: sheetName,
            image: file,
            data: list
          }
          paramsList.push(obj);
        }
        if (type === 2) {
          const list = await this.makeSummary(summaryList)
          const obj = {
            name: sheetName,
            image: '',
            data: list
          }
          paramsList.push(obj);
        }
      }
      await axios({
        method: 'post',
        url: `${query.DO_DOWNLOAD_DATA}`,
        data: {sheets: paramsList},
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then((res) => {
        const blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        saveAs(blob, `${this.bgConfig.title}.xls`);
      });
    }
  },
  beforeDestroy() {
    if (window) {
      window.removeEventListener('message',() => {});
      window.removeEventListener('resize', this.setDrawContent);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.content {
  position: relative;
  width: 100%;
  height: 100%;
  //overflow: hidden;
  //background-color: #202020;

  .equalWidthRatio, .design {
    overflow: auto;

    & > .previewWrap {
      left: 0 !important;
      top: 0 !important;
    }
  }

  .contentWrap {
    width: 100%;
    height: 100%;
    position: relative;

    .previewWrap {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform-origin: 0 0;
      background-repeat: no-repeat;
      background-size: 100%;
      z-index: 1;

      .contentBox {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
    }

    .contentBg {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }

  .contentVideo {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

}

/**滚动条修改*/
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #f5f7fa;
}

::-webkit-scrollbar-button {
  height: 0;
  width: 0;
  background-color: #b0aeda;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #263A72;
}

::-webkit-scrollbar-track {
  background-color: #192757;
}
</style>
