<!--
 * @Descripttion: excel
 * @Author: ytx
 * @Date: 2021-09-03 11:15:11
 * @Last Modified by: ytx
 * @Last Modified time: 2021-09-03 11:15:11
-->
<template>
  <div class="excel">
    <!-- sheets -->
    <!-- <section class="excel__showsheetbar">
      <i
        class="iconfont icon-xinzeng excel__showsheetbar--icon"
        @click="handleAddSheet"
      ></i>
      <div
        v-for="(item, i) in sheetArr"
        :key="i"
        :class="`excel__showsheetbar--item ${
          activeIndex === i ? 'activeBgn' : ''
        }`"
        @mouseenter="handleEnter(i)"
        @mouseleave="handleLeave(i)"
        @click="handleClickSheet(i)"
      >
        <div class="showsheetbar__name">{{ item.name }}</div>
        <i
          class="el-icon-error showsheetbar__deleteButton"
          v-if="showDeleteButtonIndex === i && sheetArr.length !== 1"
          @click.stop="handleDeleteSheet(i)"
        ></i>
      </div>
    </section> -->
    <div id="luckysheet">
      <!-- 遮罩层 -->
      <div class="excel__bgk" ref="excel">
        <div class="excel__bgk--hint" :style="`left: ${areaWidth}`">
          灰色区域不可打印
        </div>
        <!-- 区域范围 background: url(${bgkImage}) no-repeat; -->
        <div
          class="excel__bgk--background"
          :style="`
            width: ${areaWidth};
            height: ${areaHeight};
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
    <!-- 打印 -->
    <div
      id="printContent"
      :style="`width: ${areaWidth};height: ${areaHeight};`"
    ></div>
  </div>
</template>

<script>
// import printJS from 'print-js';
import { getPrintDesign } from '@/api/printTemplate';

export default {
  props: {
    // 右边配置值
    globalConfig: {
      type: Object,
      default: () => {}
    },
    dropObj: {
      type: Object,
      default: () => {}
    },
    isMove: {
      type: Boolean,
      default: false
    },
    isFill: {
      type: Boolean,
      default: false
    },
    // 该 excel 对象
    excelArr: {
      type: Array,
      default: () => []
    },
    // 该 excel 图片
    excelImg: {
      type: Object,
      default: () => {}
    },
    // 选中的位置
    excelPosition: {
      type: String,
      default: ''
    },
    // 拖进去的值
    fillExcelArr: {
      type: Array,
      default: () => []
    },
    // 选中对象
    excelSelectedObj: {
      type: Object,
      default: () => {}
    },
    imgArr: {
      type: Array,
      default: () => []
    },
    previewObj: {
      type: Object,
      default: () => {}
    },
    areaWidth: {
      type: String,
      default: ''
    },
    areaHeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      luckysheet: null,
      dragEndC: '', // 拖动结束横坐标
      dragEndR: '', // 拖动结束纵坐标
      bgkImage: '', // http://inews.gtimg.com/newsapp_bt/0/7244936413/641
      maxHeight: 0,
      maxWidth: 0,
      zoom: '1.3',
      // 工作表配置
      sheetObject: {
        row: 50, // 行数
        column: 26, // 列数
        defaultRowHeight: 30, // 自定义行高
        defaultColWidth: 96 // 自定义列宽
      },
      // 工作表
      sheetArr: [
        {
          name: 'Sheet1',
          order: 0
        }
      ],
      // 是否显示按钮位置
      showDeleteButtonIndex: '',
      activeIndex: 0,
      isPush: false,
      isNeed: false,
      celldataList: [],
      imgObj: {},
      borderInfo: []
    };
  },
  components: {},
  computed: {
    // 水平位置
    horizontaltype() {
      return function (v) {
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
    }
  },
  watch: {
    dropObj: {
      handler(v) {
        this.dropObj = v;
      },
      deep: true
    },
    globalConfig: {
      handler(v) {
        this.$emit('update:areaWidth', `${v.paperWidth - 34}mm`);
        this.$emit('update:areaHeight', `${v.paperHeight - 40}mm`);
      },
      deep: true
    }
  },
  mounted() {
    this.initExcel();
  },
  methods: {
    // 获取位置和值
    getPosition() {
      // 填入表中的值
      const getRange = this.luckysheet.getRange();
      const { dataSource } = this.dropObj;
      const c = getRange[0].column[0];
      const r = getRange[0].row[0];
      const obj = {
        c,
        r,
        columnName: (dataSource && dataSource.columnName) || '',
        tableName: (dataSource && dataSource.tableName) || '',
        order: this.activeIndex,
        elementType: 1
      };

      this.isPush = false;
      for (let i = 0; i < this.fillExcelArr.length; i += 1) {
        const bb = this.fillExcelArr[i];
        if (bb.c === c && bb.r === r) {
          this.fillExcelArr[i] = obj;
          this.isPush = true;
          break;
        }
      }
      if (!this.isPush) {
        this.fillExcelArr.push(obj);
      }
      this.$emit('update:fillExcelArr', this.fillExcelArr);
      this.$emit('update:excelSelectedObj', obj);
      // console.log(this.fillExcelArr);
    },
    // 改变父组件中的值
    changeExcelObj() {
      const arr = [];
      // console.log(this.fillExcelArr);
      const res = this.luckysheet.getAllSheets();
      // console.log(res);
      // 扩展 循环每个sheet页
      res.forEach((item, index) => {
        // 循环 sheet 下的 celldata
        const { name } = item;
        const childObj = {
          celldata: [],
          name,
          order: index
        };
        item.celldata.forEach((v) => {
          childObj.celldata.push(v);
        });
        childObj.celldata.forEach((v, i) => {
          // 循环填入的值
          this.fillExcelArr.forEach((val) => {
            if (index === val.order && val.c === v.c && val.r === v.r) {
              const { columnName, tableName, elementType, order } = val;
              // console.log(val);
              childObj.celldata[i] = {
                ...v,
                columnName,
                tableName,
                elementType,
                order
              };
            }
          });
        });
        arr.push(childObj);
      });
      this.celldataList = arr[this.activeIndex].celldata;

      this.borderInfo =
        res[this.activeIndex] &&
        res[this.activeIndex].config &&
        res[this.activeIndex].config.borderInfo;

      this.$emit('update:excelArr', arr);

      this.imgObj = this.luckysheet.getImageOption() || {};
      if (Array.isArray(this.imgObj)) {
        this.imgObj = {
          ...this.imgObj
        };
      }
      this.$emit('update:excelImg', this.imgObj);
    },
    // 默认选中
    selectedSheet() {
      this.sheetArr = this.luckysheet.getAllSheets() || [];
      this.handleClickSheet(this.sheetArr.length - 1);
    },
    // 删除工作表
    handleDeleteSheet(v) {
      this.luckysheet.setSheetDelete({ order: v });
      this.selectedSheet();
    },
    // 点击工作表
    handleClickSheet(v) {
      this.activeIndex = v;
      this.luckysheet.setSheetActive(v);
    },
    // 鼠标移入移出
    handleEnter(v) {
      this.showDeleteButtonIndex = v;
    },
    handleLeave() {
      this.showDeleteButtonIndex = '';
    },
    // 添加 Sheet
    handleAddSheet() {
      this.luckysheet.setSheetAdd({
        sheetObject: this.sheetObject,
        order: 999
      });
      this.selectedSheet();
    },
    // 拖拽
    async initExcel() {
      let excelArrData = [
        {
          name: 'Sheet1', // 工作表名称
          ...this.sheetObject
        }
      ];
      // 获取详情
      this.detailId = this.$route.query.detailId;
      if (this.detailId) {
        const excelData = await getPrintDesign({ id: this.detailId });
        // console.log(JSON.parse(excelData.desingJson));
        const { globalConfig, excelArr, imgArr, borderInfo } = JSON.parse(excelData.desingJson);
        if (excelArr.length !== 0) {
          const fillExcelArr = [];
          excelArrData = [];
          excelArr.forEach((item) => {
            excelArrData.push({
              name: item.name, // 工作表名称
              order: item.order,
              celldata: item.celldata,
              images: imgArr,
              config: {
                borderInfo
              },
              ...this.sheetObject
            });
            fillExcelArr.push(...item.celldata);
          });

          // console.log(fillExcelArr);
          this.$emit('update:fillExcelArr', fillExcelArr);
        }

        this.$emit('update:excelArr', excelArr);
        this.$emit('update:globalConfig', globalConfig);
        this.$emit('update:imgArr', imgArr);
      }
      const _this = this;
      this.luckysheet = window.luckysheet;
      // console.log(this.luckysheet);
      const options = {
        container: 'luckysheet', // luckysheet为容器id
        title: 'apiot', // 设定表格名称
        lang: 'zh', // 设定表格语言
        showinfobar: false, // 是否显示顶部信息栏
        enableAddRow: false, // 允许添加行
        enableAddBackTop: false, // 允许回到顶部
        sheetFormulaBar: false, // 是否显示公式栏
        showsheetbar: false, // 是否显示底部sheet页按钮
        // showsheetbarConfig: {
        //   add: true, // 新增sheet
        //   menu: false, // sheet管理菜单
        //   sheet: false // sheet页显示
        // },
        showstatisticBar: false,
        data: excelArrData,
        // 自定义配置sheet页右击菜单
        sheetRightClickConfig: {
          delete: false, // 删除
          copy: false, // 复制
          rename: false, // 重命名
          color: false, // 更改颜色
          hide: false, // 隐藏，取消隐藏
          move: false // 向左移，向右移
        },
        // 自定义配置单元格右击菜单
        cellRightClickConfig: {
          copy: true, // 复制
          copyAs: false, // 复制为
          paste: true, // 粘贴
          insertRow: true, // 插入行
          insertColumn: true, // 插入列
          deleteRow: false, // 删除选中行
          deleteColumn: false, // 删除选中列
          deleteCell: false, // 删除单元格
          hideRow: false, // 隐藏选中行和显示选中行
          hideColumn: false, // 隐藏选中列和显示选中列
          rowHeight: false, // 行高
          columnWidth: false, // 列宽
          clear: true, // 清除内容
          matrix: false, // 矩阵操作选区
          sort: false, // 排序选区
          filter: false, // 筛选选区
          chart: false, // 图表生成
          image: true, // 插入图片
          link: false, // 插入链接
          data: false, // 数据验证
          cellFormat: false // 设置单元格格式
        },
        // showstatisticBar: false, // 是否显示底部计数栏
        showtoolbarConfig: [
          'undo',
          'redo',
          'font',
          'fontSize',
          'bold',
          'italic',
          // 'underline',
          // 'strikethrough',
          'textColor',
          'fillColor',
          // 'border',
          'mergeCell',
          'horizontalAlignMode',
          'verticalAlignMode',
          // 'textWrapMode',
          'image'
        ],
        // showtoolbar: false,
        // showtoolbarConfig: {
        //   undoRedo: true, // 撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
        //   font: true, // '字体'
        //   fontSize: true, // '字号大小'
        //   bold: true, // '粗体 (Ctrl+B)'
        //   italic: true, // '斜体 (Ctrl+I)'
        //   // strikethrough: true, // '删除线 (Alt+Shift+5)'
        //   // underline: true, // '下划线 (Alt+Shift+6)'
        //   textColor: true, // '文本颜色'
        //   fillColor: true, // '单元格颜色'
        //   border: true, // '边框'
        //   mergeCell: true, // '合并单元格'
        //   horizontalAlignMode: true, // '水平对齐方式'
        //   verticalAlignMode: true, // '垂直对齐方式'
        //   // textWrapMode: true, // '换行方式'
        //   image: true // '插入图片'
        // },
        hook: {
          sheetMouseup(cell, postion) {
            if (_this.isMove && _this.isFill) {
              const { c, r } = postion;
              if (c !== '' && r !== '') {
                _this.luckysheet.setCellValue(r, c, `\${${_this.dropObj.name}}`);
                _this.luckysheet.setCellFormat(r, c, 'fc', '#107fff');
                _this.luckysheet.setRangeShow([{ row: [r, r], column: [c, c] }]);
              }
            }
          },
          cellMousedownBefore(cell, postion) {
            const { c, r } = postion;
            _this.isNeed = false;
            // console.log(_this.fillExcelArr);
            for (let i = 0; i < _this.fillExcelArr.length; i += 1) {
              const bb = _this.fillExcelArr[i];
              if (bb.c === c && bb.r === r) {
                _this.isNeed = true;
                _this.$emit('update:excelSelectedObj', bb);
                break;
              }
            }
            if (!_this.isNeed) {
              _this.$emit('update:excelSelectedObj', {});
            }
            _this.getPositionString();
          }
        }
      };
      this.luckysheet.create(options);
      // 添加遮罩层
      document.getElementById('luckysheet-sheettable_0').append(this.$refs.excel);
      // this.$nextTick(() => {
      //   // this.luckysheet.setSheetZoom(this.zoom);
      //   this.luckysheet.setSheetAdd({
      //     // name: 'Sheet1111', // 工作表名称
      //     row: 50, // 行数
      //     column: 26, // 列数
      //     defaultRowHeight: 30, // 自定义行高
      //     defaultColWidth: 96 // 自定义列宽
      //   });
      // });
      // // this.luckysheet.setVerticalFrozen(true, { range: 'B5' });
      // this.luckysheet.setCellFormat(2, 2, 'v', 'abc');
    },
    // 获取位置
    getPositionString() {
      this.$nextTick(() => {
        const position = this.luckysheet.getRangeAxis().join('');
        this.$emit('update:excelPosition', position);
      });
    },
    // 预览
    excelPreview() {
      this.changeExcelObj();
      // 取消编辑模式
      this.luckysheet.exitEditMode();
      // 算出多少行、多少列
      const { visibledatacolumn, visibledatarow } = this.luckysheet.getSheet();
      // console.log(visibledatacolumn, visibledatarow);
      // 行
      const everyWidth = [];
      const everyHeight = [];
      for (let i = 0; i < visibledatacolumn.length; i += 1) {
        const numColumn =
          i === 0 ? visibledatacolumn[i] : visibledatacolumn[i] - visibledatacolumn[i - 1];
        everyWidth.push(numColumn);
        if (visibledatacolumn[i] > this.mmToPx(parseInt(this.areaWidth, 0))) {
          this.maxWidth = i + 1;
          break;
        }
      }
      // 列
      for (let j = 0; j < visibledatarow.length; j += 1) {
        const numRow = j === 0 ? visibledatarow[j] : visibledatarow[j] - visibledatarow[j - 1];
        everyHeight.push(numRow);
        if (visibledatarow[j] > this.mmToPx(parseInt(this.areaHeight, 0))) {
          this.maxHeight = j + 1;
          break;
        }
      }
      this.$emit('update:previewObj', {
        everyWidth,
        everyHeight,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight,
        celldataList: this.celldataList,
        excelImg: this.imgObj,
        borderInfo: this.borderInfo
      });
      // this.$nextTick(() => {
      //   printJS({
      //     printable: 'printContent',
      //     type: 'html',
      //     scanStyles: false
      //   });
      // });
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
    }
  }
};
</script>
<style lang='scss' scoped>
#luckysheet:focus-visible {
  outline: 0;
}
#luckysheet {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  ::v-deep {
    .luckysheet-rows-h {
      position: absolute;
    }
    #luckysheetloadingdata {
      position: relative !important;
    }
    // 取消加好
    #luckysheet-sheets-add {
      display: none;
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

    .luckysheet-scrollbar-ltr {
      z-index: 101;
    }

    .luckysheet-cell-flow {
      top: 0 !important;
    }
  }
}
#printContent {
  overflow: hidden;
  // position: absolute;
  // top: 0;
  // left: 0px;
  // background: #fff;
  // z-index: 9999;

  table {
    position: relative;
  }
}
$sheetTabHeight: 30px;
.excel {
  width: 100%;
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
      padding: 20px 0 0 30px;
      line-height: 30px;
      width: 20px;
      height: 48px;
      color: #777f8d;
      font-size: 18px;
      pointer-events: none;
    }
    &--background {
      position: absolute;
      top: 0px;
      margin-left: 0px;
      z-index: 100;
      color: #777f8d;
      font-size: 18px;
      pointer-events: none;
      border: 1px dashed #000000;
      // border-right: 1px dashed #000000;
      // border-bottom: 1px dashed #000000;
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
  &__showsheetbar {
    position: absolute;
    bottom: 0px;
    left: 55px;
    z-index: 99;
    width: calc(100% - 65px);
    height: $sheetTabHeight;
    display: flex;
    align-items: center;
    &--icon {
      height: 100%;
      padding: 0 5px;
      line-height: $sheetTabHeight;
      border-right: 1px dashed #dadce5;
    }
    &--item {
      height: 100%;
      line-height: $sheetTabHeight;
      padding: 0 10px;
      border-right: 1px dashed #dadce5;
      cursor: pointer;
      background: #fafafc;
      font-size: 12px;
      position: relative;
      .showsheetbar__name {
        padding: 0 15px;
      }
      .showsheetbar__deleteButton {
        position: absolute;
        top: 3px;
        right: 5px;
        font-size: 15px;
        color: red;
      }
    }
    &--item:hover {
      background: #ececec;
    }
    .activeBgn {
      background: #ececec;
    }
  }
}
</style>
