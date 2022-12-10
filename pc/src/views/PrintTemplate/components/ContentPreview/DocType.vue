<template>
  <div id="docType">
    <doc-page
      :printParams="printParams"
      :pageRowNum="pageRowNum"
      :contentHeightPx="contentHeightPx"
    ></doc-page>
  </div>
</template>

<script>
import printJS from 'print-js';
import DocPage from './components/DocPage';

export default {
  props: {
    printParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageRowNum: 0, // 一共多少row
      contentHeightPx: -1
    };
  },
  components: { DocPage },
  computed: {
    celldataList() {
      return this.printParams.previewObj.celldataList;
    }
  },
  watch: {},
  mounted() {
    this.getPageRowNum();

    // 每页多少高度+this.contentHeightPx)
    const { areaHeight, globalConfig } = this.printParams;
    const contentHeight =
      areaHeight &&
      areaHeight.slice(0, areaHeight.length - 2) -
        globalConfig.marginTop -
        globalConfig.marginBottom;
    this.contentHeightPx = this.mmConversionPx(contentHeight);
    console.log(`contentHeightPx=============${this.contentHeightPx}`);
  },
  methods: {
    getDPI() {
      // eslint-disable-next-line no-array-constructor
      const arrDPI = new Array();
      if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
      } else {
        const tmpNode = document.createElement('DIV');
        tmpNode.style.cssText =
          'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth, 10);
        arrDPI[1] = parseInt(tmpNode.offsetHeight, 10);
        tmpNode.parentNode.removeChild(tmpNode);
      }
      return arrDPI;
    },
    /**
     * px转换为mm
     * @param value
     * @returns {number}
     */
    pxConversionMm(value) {
      const inch = value / this.getDPI()[0];
      return inch * 25.4;
    },
    /**
     * mm转换为px
     * @param value
     * @returns {number}
     */
    mmConversionPx(value) {
      const inch = value / 25.4;
      return inch * this.getDPI()[0];
    },
    getPageRowNum() {
      const lastConst = this.celldataList.findLast(
        (item) => (item.v && item.v.m) || (item.v && item.v.ct && item.v.ct.s)
      );
      console.log('pageRowNum============================');
      this.pageRowNum = lastConst.r + 1;
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
