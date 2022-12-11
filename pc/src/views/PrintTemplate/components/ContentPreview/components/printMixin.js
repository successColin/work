export default {
  props: {},

  data() {
    return {};
  },
  provide() {
    return {
      type: this.type,
    };
  },

  computed: {
    type() {
      return this.printParams.globalConfig.type;
    },
    contentWidth() {
      return `calc(100% - ${this.globalConfig.marginRight}mm - ${this.globalConfig.marginLeft}mm)`;
    },
    contentHeight() {
      return `calc(100% - ${this.globalConfig.marginBottom}mm - ${this.globalConfig.marginTop}mm)`;
    },
    tableStyle() {
      return function (i, index, td) {
        const obj = this.celldataList.find(
          (item) => item.c === index + td && item.r === i
        );
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
    },
    globalConfig() {
      return this.printParams.globalConfig;
    },
    celldataList() {
      return this.printParams.previewObj.celldataList;
    },
    maxWidth() {
      return this.printParams.previewObj.maxWidth;
    },
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
  },

  watch: {},
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
  },
};
