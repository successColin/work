<template>
  <div class="excel">
    <div id="luckysheet">
      <div class="excel__bgk" ref="excel">
        <div class="excel__bgk--hint" :style="`left: ${areaWidth}`">
          灰色区域不可打印
        </div>
        <!-- 区域范围 -->
        <div
          class="excel__bgk--background"
          :style="`
            width: ${areaWidth};
            height: ${areaHeight};
            background: url(${$parseImgUrl(bgkImage)}) no-repeat;
            background-size: 100% 100%;`"
        ></div>
        <!-- 右边 -->
        <div
          class="excel__bgk--background1"
          :style="`width: calc(100% - ${areaWidth}); left: ${areaWidth}`"
        ></div>
        <!-- 左边 -->
        <div
          class="excel__bgk--background2"
          :style="`width: ${areaWidth}; top: ${areaHeight};`"
        ></div>
      </div>
    </div>
    <div
      id="printContent"
      :style="`width: ${areaWidth};height: ${areaHeight}; overflow: hidden;`"
    >
      <!-- <div class="printContent__angle lb"></div>
      <div class="printContent__angle lt"></div>
      <div class="printContent__angle rb"></div>
      <div class="printContent__angle rt"></div> -->
      <table>
        <tbody>
          <!-- 循环行 -->
          <tr v-for="(item, i) in maxHeight" :key="i">
            <!-- 循环列 -->
            <td
              v-for="(val, index) in maxWidth"
              :key="index"
              :style="`width: ${
                tdValFun(i, index, tableArr).widthVal
              }px; height: ${tdValFun(i, index, tableArr).heightVal}px;
              text-align: ${horizontaltype(tdValFun(i, index, tableArr).v.ht)}`"
              :colspan="
                tdValFun(i, index, tableArr).v.mc &&
                tdValFun(i, index, tableArr).v.mc.cs
              "
              :rowspan="
                tdValFun(i, index, tableArr).v.mc &&
                tdValFun(i, index, tableArr).v.mc.rs
              "
            >
              <!-- style="width: 74px; height: 20px; overflow: hidden" -->
              {{ tdValFun(i, index, tableArr).v.v }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js';

// import luckysheet from 'luckyexcel';

// // require('luckysheet');
// // require('luckysheet/dist/plugins/js/plugin.js');
// // require('luckysheet/dist/luckysheet.umd.js');
// // require('luckysheet/dist/locale/zh-cn.js');

export default {
  props: {
    // 右边配置值
    ruleForm: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      luckysheet: null,
      dragEndC: '', // 拖动结束横坐标
      dragEndR: '', // 拖动结束纵坐标
      areaWidth: '210mm',
      areaHeight: '297mm',
      bgkImage: '', // http://inews.gtimg.com/newsapp_bt/0/7244936413/641
      // htmlValue: '',
      fillValueArr: [], // 填入值
      tableArr: [], // 表格值
      maxHeight: 0,
      maxWidth: 0,
      zoom: '1.3'
    };
  },
  components: {},
  computed: {
    // 水平位置
    horizontaltype() {
      return function(v) {
        switch (v) {
          case '0':
            return 'center';
          case '1':
            return 'left';
          case '2':
            return 'right';
          default:
            return '';
        }
      };
    },
    // 获取对应行的值
    tdValFun() {
      return function(trV, tdV, tableArr) {
        for (let i = 0; i < tableArr.length; i += 1) {
          if (tableArr[i].c === tdV && tableArr[i].r === trV) {
            return tableArr[i];
          }
        }
        return {
          c: 0,
          r: 0,
          v: {
            v: '',
            mc: {
              rs: '',
              cs: ''
            }
          },
          widthVal: 96,
          heightVal: 26
        };
      };
    }
  },
  watch: {
    ruleForm: {
      handler(v) {
        // console.log(v);
        this.areaWidth = `${v.paperSizeWidth}mm`;
        this.areaHeight = `${v.paperSizeHeight}mm`;
      },
      deep: true
    }
  },
  mounted() {
    // console.log(11111111111111);
    this.initExcel();
  },
  methods: {
    initExcel() {
      const _this = this;
      // eslint-disable-next-line no-undef
      this.luckysheet = luckysheet;
      const options = {
        container: 'luckysheet', // luckysheet为容器id
        title: 'apiot', // 设定表格名称
        lang: 'zh', // 设定表格语言
        showinfobar: false, // 是否显示顶部信息栏
        enableAddRow: false, // 允许添加行
        enableAddBackTop: false, // 允许回到顶部
        sheetFormulaBar: false,
        showsheetbarConfig: {
          // add: false, // 新增sheet
          menu: false // sheet管理菜单
          // sheet: false // sheet页显示
        }, // 自定义配置底部sheet页按钮
        showstatisticBar: false,
        showstatisticBarConfig: {
          count: true
        },
        // showstatisticBar: false, // 是否显示底部计数栏
        showtoolbarConfig: {
          undoRedo: true, // 撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
          paintFormat: false, // 格式刷
          currencyFormat: false, // 货币格式
          percentageFormat: false, // 百分比格式
          numberDecrease: false, // '减少小数位数'
          numberIncrease: false, // '增加小数位数
          moreFormats: true, // '更多格式'
          font: true, // '字体'
          fontSize: true, // '字号大小'
          bold: true, // '粗体 (Ctrl+B)'
          italic: true, // '斜体 (Ctrl+I)'
          strikethrough: true, // '删除线 (Alt+Shift+5)'
          underline: true, // '下划线 (Alt+Shift+6)'
          textColor: true, // '文本颜色'
          fillColor: true, // '单元格颜色'
          border: true, // '边框'
          mergeCell: true, // '合并单元格'
          horizontalAlignMode: true, // '水平对齐方式'
          verticalAlignMode: true, // '垂直对齐方式'
          textWrapMode: true, // '换行方式'
          textRotateMode: true, // '文本旋转方式'
          image: true, // '插入图片'
          link: false, // '插入链接'
          chart: false, // '图表'（图标隐藏，但是如果配置了chart插件，右击仍然可以新建图表）
          postil: true, // '批注'
          pivotTable: false, // '数据透视表'
          function: false, // '公式'
          frozenMode: false, // '冻结方式'
          sortAndFilter: false, // '排序和筛选'
          conditionalFormat: false, // '条件格式'
          dataVerification: false, // '数据验证'
          splitColumn: false, // '分列'
          screenshot: false, // '截图'
          findAndReplace: false, // '查找替换'
          protection: false, // '工作表保护'
          print: false // '打印'
        },
        hook: {
          // 鼠标拖拽文件到Luckysheet内部的结束事件
          cellDragStop(cell, postion, sheetFile, ctx, event) {
            console.info(cell, postion, sheetFile, ctx, event);
            _this.dragEndC = postion.c;
            _this.dragEndR = postion.r;
          },
          // 设置放大 1.3 倍
          sheetActivate() {
            _this.$nextTick(() => {
              _this.luckysheet.setSheetZoom(_this.zoom);
            });
          }
          // sheetMousemove(cell, postion, sheetFile, moveState, ctx) {
          //   // _this.dragEndC = postion.c;
          //   // _this.dragEndR = postion.r;
          //   // console.log(cell, postion, sheetFile, moveState, ctx);
          // }
        }
      };

      this.luckysheet.create(options);
      this.$nextTick(() => {
        this.luckysheet.setSheetZoom(this.zoom);
      });
      // this.luckysheet.setVerticalFrozen(true, { range: 'B5' });
      // console.log(this.luckysheet);
      this.luckysheet.setCellFormat(2, 2, 'v', 'abc');
      // 添加遮罩层
      document.getElementById('luckysheet-sheettable_0').append(this.$refs.excel);
    },
    // 拖拽
    dropAssignment({ dragEndC, dragEndR, val }) {
      if (dragEndC !== '' && dragEndR !== '') {
        // this.luckysheet.refresh();
        this.luckysheet.setCellValue(dragEndR, dragEndC, val);
        this.luckysheet.setCellValue(dragEndR, dragEndC + 1, `\${${val}}`);
        this.luckysheet.setRangeShow([
          { row: [this.dragEndR, this.dragEndR], column: [this.dragEndC, this.dragEndC] }
        ]);
      }
      this.dragEndC = '';
      this.dragEndR = '';
    },
    // 预览
    excelPreview() {
      // 获取图片配置
      // console.log(this.luckysheet.getImageOption());

      // this.htmlValue = this.luckysheet.getRangeHtml('A1:B2');
      // console.log(this.luckysheet.getRangeHtml());
      // // console.log(printJS);
      // this.luckysheet.insertImage('http://inews.gtimg.com/newsapp_bt/0/7244936413/641');
      // console.log(this.luckysheet.getAllSheets());
      // console.log(this.luckysheet.getSheet());
      // console.log(this.luckysheet.getSheetData());
      // 获取 填入的值
      this.fillValueArr = this.luckysheet.transToCellData(this.luckysheet.getSheetData());
      // console.log(this.fillValueArr);
      // table 填入的值
      this.tableArr = [];
      this.fillValueArr.forEach((val) => {
        const { c, r, v } = val;
        // console.log(this.luckysheet.getRowHeight([c]));
        // console.log(this.luckysheet.getColumnWidth([r]));
        const heightVal = this.luckysheet.getRowHeight([c])[c] + 1;
        const widthVal = this.luckysheet.getColumnWidth([r])[r] + 1;
        // console.log();
        this.tableArr.push({
          heightVal,
          widthVal,
          v,
          r,
          c
        });
      });
      // console.log(this.tableArr);
      // 算出多少行、多少列
      const { visibledatacolumn, visibledatarow } = this.luckysheet.getSheet();
      // 行
      for (let i = 0; i < visibledatacolumn.length; i += 1) {
        if (visibledatacolumn[i] > this.mmToPx(parseInt(this.areaWidth, 0))) {
          this.maxWidth = i + 1;
          break;
        }
      }
      // 列
      for (let j = 0; j < visibledatarow.length; j += 1) {
        if (visibledatarow[j] > this.mmToPx(parseInt(this.areaHeight, 0))) {
          this.maxHeight = j + 1;
          break;
        }
      }
      // console.log(this.maxWidth, this.maxHeight);
      // 几个空格
      // console.log(visibledatacolumn, visibledatarow);
      // // console.log(this.maxHeight, this.maxWidth);
      // window.print();

      this.$nextTick(() => {
        printJS('printContent', 'html');
      });
    },
    // 毫米转px
    mmToPx(value) {
      const inch = value / 25.4;
      return inch * this.getDPI()[0];
    },
    // 获取DPI，图像每英寸长度内的像素点数
    getDPI() {
      const arrDPI = [];
      if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
      } else {
        const tmpNode = document.createElement('DIV');
        tmpNode.style.cssText =
          'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
        document.body.appendChild(tmpNode);
        const { offsetWidth, offsetHeight } = tmpNode;
        arrDPI[0] = parseInt(offsetWidth, 0);
        arrDPI[1] = parseInt(offsetHeight, 0);
        tmpNode.parentNode.removeChild(tmpNode);
      }
      return arrDPI;
    },
    refresh() {
      this.luckysheet.refresh();
    }
  }
};
</script>
<style lang='scss' scoped>
#luckysheet {
  width: 100%;
  height: 100%;
  overflow: hidden;
  ::v-deep {
    .luckysheet-rows-h {
      position: absolute;
    }
    #luckysheetloadingdata {
      position: relative !important;
    }
    /**滚动条修改*/
    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      background-color: #f5f7fa;
    }
    ::-webkit-scrollbar-button {
      height: 0;
      width: 0;
      background-color: #b0aeda;
    }
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: #e4e7ed;
    }
    ::-webkit-scrollbar-track {
      background-color: #f5f7fa;
    }
  }
}
#printContent {
  position: relative;
  .printContent__angle {
    position: absolute;
    width: 27px;
    height: 27px;
    border: 1px solid #e3e6ec;

    left: -27px;
    top: -27px;
    border-width: 0 1px 1px 0;
  }
}
.excel {
  width: 100%;
  height: 100%;
  &__bgk {
    user-select: none;
    position: absolute;
    top: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
    &--hint {
      position: absolute;
      top: 0;
      z-index: 100;
      padding-left: 60px;
      line-height: 48px;
      width: 220px;
      height: 48px;
      color: #777f8d;
      font-size: 18px;
      pointer-events: none;
    }
    &--background {
      position: absolute;
      top: 1px;
      margin-left: 0px;
      z-index: 100;
      color: #777f8d;
      font-size: 18px;
      pointer-events: none;
      border: 1px dashed #000000;
      background-size: contain;
      opacity: 0.7;
    }
    &--background1 {
      background-color: rgba(15, 28, 53, 0.1);
      position: absolute;
      top: 0;
      z-index: 100;
      pointer-events: none;
      height: 100%;
    }
    &--background2 {
      background-color: rgba(15, 28, 53, 0.1);
      position: absolute;
      top: 0;
      z-index: 100;
      pointer-events: none;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
