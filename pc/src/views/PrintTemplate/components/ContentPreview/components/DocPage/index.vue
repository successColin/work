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
      <print-header
        :globalConfig="globalConfig"
        :pageNum="pageNum"
      ></print-header>
      <!-- 页脚 -->
      <print-footer
        :globalConfig="globalConfig"
        :pageNum="pageNum"
      ></print-footer>
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
      <div
        :style="`
          width: ${contentWidth};
          margin: 0 auto;
          padding-top: ${globalConfig.marginTop}mm;
          overflow: hidden;
        `"
      >
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
        <!-- 固定头 -->
        <div v-if="type === 2">
          <!-- {{ pageRowTop }} -->
          <template v-for="(item, i) in pageRowTop">
            <row-cell
              :i="i"
              :key="`${i}_Top`"
              :maxWidth="maxWidth"
              :pageRowNum="pageRowTop"
              :printParams="printParams"
              :containPos="0"
              :lastPos="0"
            ></row-cell>
          </template>
        </div>
        <!-- 内容 -->
        <template v-for="(item, i) in pageRowNum">
          <row-cell
            v-if="containPos === -1 || i < containPos"
            :i="i"
            :key="`${i}_Content`"
            :maxWidth="maxWidth"
            :pageRowNum="pageRowNum"
            :printParams="printParams"
            :containPos="firstcontainPos"
            :lastPos="firstlastPos"
          ></row-cell>
        </template>
        <!-- 固定尾 -->
        <div v-if="type === 2" ref="pageRowBottomRef">
          <template v-for="(item, i) in pageRowBottom">
            <row-cell
              :i="i"
              :key="`${i}_Bottom`"
              :maxWidth="maxWidth"
              :pageRowNum="pageRowBottom"
              :printParams="printParams"
              :containPos="fixedBottomPos"
              :lastPos="fixedBottomPos"
              :isNeedCalc="false"
            ></row-cell>
          </template>
        </div>
      </div>
    </div>
    <template v-if="containPos !== -1">
      <doc-page
        :printParams="printParams"
        :pageRowNum="pageRowNum - containPos"
        :lastPos="containPos + lastPos"
        :contentHeightPx="contentHeightPx"
        :pageNum="pageNum + 1"
        :fixedBottomPos="fixedBottomPos"
        :pageRowBottom="pageRowBottom"
        :pageRowTop="pageRowTop"
      ></doc-page>
    </template>
  </div>
</template>

<script>
import PrintHeader from '../PrintHeader';
import PrintFooter from '../PrintFooter';
import MarginBottom from '../MarginBottom';
import MarginTop from '../MarginTop';
import RowCell from '../RowCell';
import printMixin from '../printMixin';

export default {
  name: 'DocPage',
  mixins: [printMixin],
  props: {
    printParams: {
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
    contentHeightPx: Number,
    pageNum: {
      type: Number,
      default: 1
    },
    fixedBottomPos: {
      type: Number,
      default: 0
    },
    pageRowBottom: {
      type: Number,
      default: 0
    },
    pageRowTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1,
      tableConfigArr: [],
      boxBorderTop: '60px',
      isContain: true, // 是否可以融入下
      containPos: -1, // 融入不下的位置
      eleHeight: 0 // 计算当前页高度
    };
  },
  components: { PrintHeader, PrintFooter, MarginBottom, MarginTop, RowCell },
  computed: {
    // 第一次的最后位置
    firstlastPos() {
      let num = this.lastPos;
      if (this.type === 2) {
        num += this.pageRowTop;
      }
      return num;
    },
    firstcontainPos() {
      let num = this.containPos;
      if (this.type === 2) {
        num += this.pageRowTop;
      }
      return num;
    }
  },
  watch: {},
  mounted() {
    if (this.$parent.getContentBottomHeight) {
      this.$parent.getContentBottomHeight(this.$refs.pageRowBottomRef.offsetHeight);
    }
  },
  methods: {
    // 当前页是否融入的下
    isContainFun(v, i) {
      this.eleHeight += v;
      const { contentHeightPx, eleHeight, containPos } = this;
      if (contentHeightPx <= eleHeight && containPos === -1 && contentHeightPx !== -1) {
        console.log(contentHeightPx, eleHeight, containPos, contentHeightPx, i);
        this.containPos = i;
      }
    },
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
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
