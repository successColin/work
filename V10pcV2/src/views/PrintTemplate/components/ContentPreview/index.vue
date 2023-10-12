<template>
  <div id="docType">
    <doc-page
      :printParams="printParams"
      :pageRowNum="pageRowNum"
      :contentHeightPx="contentHeightPx"
      :pageRowTop="pageRowTop"
      :pageRowBottom="pageRowBottom"
      :fixedBottomPos="fixedBottomPos"
    ></doc-page>
  </div>
</template>

<script>
import printJS from 'print-js';
import DocPage from './components/DocPage';
import printMixin from './components/printMixin';

export default {
  mixins: [printMixin],
  props: {
    printParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageRowNum: 0, // 一共多少row
      contentHeightPx: -1,
      fixedBottomHeight: -1
    };
  },
  components: { DocPage },
  computed: {
    // 内部固定顶部
    pageRowTop() {
      const fixedTop = this.celldataList.find((item) => item.v.isTableField && item.v.field) || {
        r: 0
      };
      return fixedTop.r;
    },
    // 固定下方的开始位置
    fixedBottomPos() {
      const fixedBottom = this.celldataList.findLast(
        (item) => item.v.isTableField && item.v.field
      ) || {
        r: 0
      };
      return fixedBottom.r + 1;
    },
    pageRowBottom() {
      const lastConst = this.celldataList.findLast(
        (item) => (item.v && item.v.m) || (item.v && item.v.ct && item.v.ct.s)
      ) || { r: 0 };
      const bottomRow =
        lastConst.r - this.fixedBottomPos < 0 ? 0 : lastConst.r - this.fixedBottomPos + 1;
      return bottomRow;
    }
  },
  watch: {},
  mounted() {
    this.getPageRowNum();
    this.getContentHeight();
  },
  methods: {
    // 最大的 Row
    getPageRowNum() {
      // 根据内容来吧
      let num = 0;
      const lastConst = this.celldataList.findLast(
        (item) => (item.v && item.v.m) || (item.v && item.v.ct && item.v.ct.s)
      ) || { r: 0 };
      num = lastConst.r + 1;
      if (lastConst.v && lastConst.v.mc) {
        num += lastConst.v.mc.rs - 1;
      }
      this.pageRowNum = num;
      if (this.type === 2) {
        this.pageRowNum = this.pageRowNum - this.pageRowTop - this.pageRowBottom;
      }
    },
    // 每页多少高度
    getContentHeight() {
      console.log(this.fixedBottomHeight);
      const { areaHeight, globalConfig } = this.printParams;
      const contentHeight =
        areaHeight &&
        areaHeight.slice(0, areaHeight.length - 2) -
          globalConfig.marginTop -
          globalConfig.marginBottom;
      this.contentHeightPx = this.mmConversionPx(contentHeight);
      if (this.type === 2) {
        this.contentHeightPx -= this.fixedBottomHeight;
      }
    },
    // 获取内容固定高度
    getContentBottomHeight(v) {
      this.fixedBottomHeight = v;
    },
    print() {
      const { paperSize, direction } = this.printParams.globalConfig;
      const paperSizeOption = [
        {
          value: 1,
          name: 'A4'
        },
        {
          value: 2,
          name: 'A5'
        },
        {
          value: 3,
          name: 'A3'
        },
        {
          value: 4,
          name: 'B4'
        },
        {
          value: 5,
          name: 'B5'
        },
        {
          value: 6,
          name: '自定义'
        }
      ];
      const typeObj = paperSizeOption.find((v) => v.value === paperSize);
      this.$nextTick(() => {
        printJS({
          printable: 'docType',
          type: 'html',
          scanStyles: false,
          // style: '@media print { @page { margin: 0; } body { margin: 1.6cm; } }'
          style: `@media print {
            @page { margin: 0; size: ${typeObj && typeObj.name} ${
  direction === 1 ? 'portrait' : 'landscape'
}; }
            body { margin: 0; }
            .contentPreview {
              margin-bottom: 0 !important;
            }
          }`
        });
      });
    }
  }
};
</script>
<style lang='scss' scoped>
#docType {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
