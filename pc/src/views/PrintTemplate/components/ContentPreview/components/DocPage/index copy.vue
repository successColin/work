<!--
 * @Descripttion: 预览：打印类型为文档类
 * @Author: ytx
 * @Date: 2022-07-19 15:43:54
 * @Last Modified by: ytx
 * @Last Modified time: 2022-07-19 15:43:54
-->
<template>
  <div class="printContent" ref="content">
    <div
      class="contentPreview"
      :style="`
          width: ${printParams.areaWidth};
          height: ${printParams.areaHeight};
          position: relative;
          overflow: hidden;
          page-break-after: always;
          box-sizing: content-box;
          margin: 0 auto;
          background: #fff;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
          margin-bottom: 10px;
        `"
    >
      <!-- 上边距 -->
      <margin-top :marginTop="globalConfig.marginTop"></margin-top>
      <!-- 下边距 -->
      <margin-bottom :marginBottom="globalConfig.marginBottom"></margin-bottom>
      <!-- 页眉 -->
      <print-header :globalConfig="globalConfig"></print-header>
      <!-- 页脚 -->
      <print-footer :globalConfig="globalConfig"></print-footer>
      <!-- 背景图片 -->
      <img
        v-if="imgbgUrl"
        :src="$parseImgUrl(imgbgUrl)"
        :style="`
          width: ${contentWidth};
          height: ${contentHeight};
          padding-top: ${globalConfig.marginTop}mm;
          position: absolute;
          margin: ${boxMargin};
        `"
      />
      <section
        class="contentPreview__content"
        :style="`
          width: ${contentWidth};
          margin: 0 auto;
          padding-top: ${globalConfig.marginTop}mm;
          overflow: hidden;
        `"
      >
        <!-- 图片 -->
        <img
          v-for="(val, key) in excelImg"
          :key="key"
          :src="val.src"
          :style="`
            position: absolute;
            width: ${val.crop.width}px;
            height: ${val.crop.height}px;
            top: calc(${val.default.top}px + ${boxBorderTop});
            left: calc(${val.default.left}px);
            z-index: 1;
          `"
        />
        <list-header :printParams="printParams" :rows="rows"></list-header>
        <!-- 高 -->
        <template v-for="(item, index) in tableArr">
          <row-cell :value="item" :key="index"></row-cell>
        </template>
      </section>
    </div>
    <template v-if="containPos !== -1">
      <doc-page
        :printParams="printParams"
        :pageRowNum="pageRowNum - containPos + 1"
        :lastPos="containPos + lastPos"
        :contentHeightPx="contentHeightPx"
        :aaa="3"
      ></doc-page>
    </template>
  </div>
</template>

<script>
import PrintHeader from '../PrintHeader';
import PrintFooter from '../PrintFooter';
import MarginBottom from '../MarginBottom';
import MarginTop from '../MarginTop';
import RowCell from './components/RowCell';
import ListHeader from './components/ListHeader';

export default {
  name: 'DocPage',
  props: {
    printParams: {
      type: Object,
      default: () => {}
    },
    tableArr: {
      type: Array,
      default: () => []
    },
    rows: {
      type: Object,
      default: () => {}
    },
    pageRowNum: {
      type: Number,
      default: 0
    },
    lastPos: {
      type: Number,
      default: 0
    },
    aaa: {
      type: Number,
      default: 0
    },
    contentHeightPx: Number
  },
  data() {
    return {
      currentPage: 1,
      tableConfigArr: [],
      boxBorderTop: '60px',
      currentPageHeader: '', // 页眉
      currentPageFooter: '', // 页脚
      isContain: true, // 是否可以融入下
      containPos: -1, // 融入不下的位置
      eleHeight: 0 // 计算当前页高度
      // splitNum: 0,
      // showHeight: 0,
      // blackHeight: 0
    };
  },
  components: { PrintHeader, PrintFooter, MarginBottom, MarginTop, RowCell, ListHeader },
  computed: {
    excelImg() {
      // 处理图片token
      const imagesArr = [];
      const img = this.printParams.previewObj.excelImg;
      if (img) {
        Object.values(img).forEach((item) => {
          if (item.src.indexOf('?') !== -1) {
            item.src = item.src.slice(0, item.src.indexOf('?'));
            item.src = this.$parseImgUrl(item.src);
          } else {
            item.src = this.$parseImgUrl(item.src);
          }
          imagesArr.push(item);
        });
      }
      return imagesArr;
    },
    celldataList() {
      return this.printParams.previewObj.celldataList;
    },
    globalConfig() {
      return this.printParams.globalConfig;
    },
    maxWidth() {
      return this.printParams.previewObj.maxWidth;
    },
    contentWidth() {
      return `calc(100% - ${this.globalConfig.marginRight}mm - ${this.globalConfig.marginLeft}mm)`;
    },
    contentHeight() {
      return `calc(100% - ${this.globalConfig.marginBottom}mm - ${this.globalConfig.marginTop}mm)`;
    },
    tableStyle() {
      return function (i, index, td) {
        const obj = this.celldataList.find((item) => item.c === index + td && item.r === i);
        return `color: ${obj && obj.v && obj.v.fc};`;
      };
    },
    boxMargin() {
      return `0mm ${this.globalConfig.marginRight}mm ${this.globalConfig.marginBottom}mm ${this.globalConfig.marginLeft}mm`;
    },
    imgbgUrl() {
      return (
        this.globalConfig.bgImgArr &&
        this.globalConfig.bgImgArr[0] &&
        this.globalConfig.bgImgArr[0].url
      );
    },
    everyWidth() {
      return this.printParams.previewObj.everyWidth;
    }
  },
  watch: {
    'globalConfig.pageFooter': {
      handler(html) {
        console.log(html);
        this.getCurrentDateTime(html, 'footer');
      },
      deep: true,
      immediate: true
    },
    isContain(v) {
      console.log(v);
    }
  },
  mounted() {
    console.log('printParams==============================');
    console.log(this.printParams);

    // const acceptArr = [0];
    // this.showCellArr = [];
    // let num = 0;
    // let page = 1;
    // for (let i = 0; i < everyHeight.length; i += 1) {
    //   num += this.pxConversionMm(everyHeight[i]);
    //   console.log(this.pxConversionMm(everyHeight[i]));
    //   if (num > (contentHeight - 10) * page) {
    //     page += 1;
    //     acceptArr.push(i);
    //   }
    //   if (i === everyHeight.length - 1) {
    //     acceptArr.push(i);
    //   }
    // }
    // let needPage = 1;
    // console.log(lastConst);
    // acceptArr.forEach((val, i, arr) => {
    //   if (arr[i + 1]) {
    //     const value = arr[i + 1] - val;
    //     if (value) {
    //       this.showCellArr.push(value);
    //     }
    //   }
    //   if (lastConst.r >= val) {
    //     console.log(i);
    //     needPage = i + 1;
    //   }
    // });
    // console.log(contentHeight, acceptArr, this.showCellArr);
    // this.page = this.isConfig ? 1 : needPage;
    // this.contentRow = (lastConst && lastConst.r) || 10;
  },
  methods: {
    // 当前页是否融入的下
    isContainFun(v, i) {
      this.eleHeight += v;
      console.log(
        `isContainFun================================${this.eleHeight}${this.contentHeightPx}`
      );
      const { contentHeightPx, eleHeight, containPos } = this;
      if (contentHeightPx <= eleHeight && containPos === -1) {
        this.containPos = i;
      } else {
        console.log(this.currentPage);
        // console.log('============', v, i);
        // console.log(this.contentHeightPx, this.eleHeight);
      }
    },
    // calcCellHeight(v, i, isFinish) {
    //   console.log(v);
    //   if (this.currentPage === 0) {
    //     this.eleHeight += v;
    //     if (
    //       parseInt(this.contentHeightPx * this.splitNum, 10) - this.blackHeight >=
    //       this.eleHeight
    //     ) {
    //       this.showHeight += v;
    //       console.log(v);
    //       console.log(
    //         parseInt(this.contentHeightPx * this.splitNum, 10) - this.blackHeight,
    //         this.eleHeight,
    //         i
    //       );
    //     } else {
    //       console.log(this.blackHeight, v, i);
    //       this.splitNum += 1;
    //       // 加上空白的高度
    //       if (i !== 0) {
    //         console.log(this.contentHeightPx, this.showHeight);
    //         this.blackHeight = parseInt(this.contentHeightPx - this.showHeight, 10);
    //         //  <= 0
    //         //   ? 0
    //         //   : parseInt(this.contentHeightPx - this.showHeight, 10);
    //         console.log(this.blackHeight);
    //         this.showHeight = 0;
    //         this.pageMaxHeightArr.push(i);
    //       }
    //     }
    //     if (isFinish) {
    //       this.pageMaxHeightArr.push(i);
    //       this.$parent.changePageRowArr(this.pageMaxHeightArr);
    //       console.log(this.pageMaxHeightArr);
    //     }
    //   }
    // },
    tableStateAndField(i, index, field) {
      let state = false;
      let fieldValue = '';
      for (let p = 0; p < this.tableConfigArr.length; p += 1) {
        const v = this.tableConfigArr[p];
        if (v.r === i && v.c === index) {
          state = true;
          if (field) {
            fieldValue = v[field];
          }
          break;
        }
      }
      if (field) {
        return fieldValue;
      }
      return state;
    },
    forFun(state, trV, tdv, tableWidth, callback) {
      if (state) {
        const nowTdv = tdv + 1;
        const v = this.tableStateAndField(trV, nowTdv);
        if (v) {
          tableWidth += this.everyWidth[nowTdv];
        }
        this.forFun(v, trV, nowTdv, tableWidth, callback);
      } else if (callback) {
        callback(tableWidth);
      }
    },
    getCurrentDateTime(html, type) {
      if (type === 'header') {
        this.currentPageHeader = html;
      }
      if (type === 'footer') {
        this.currentPageFooter = html;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
