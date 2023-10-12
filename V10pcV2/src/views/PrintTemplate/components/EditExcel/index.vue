<!--
 * @Descripttion: excel
 * @Author: ytx
 * @Date: 2021-09-03 11:15:11
 * @Last Modified by: ytx
 * @Last Modified time: 2021-09-03 11:15:11
-->
<template>
  <div class="excel">
    <div id="luckysheet">
      <!-- 遮罩层 -->
      <div class="excel__bgk" ref="excel">
        <div
          class="excel__bgk--hint"
          :style="`left: calc(${excelBgkScopeWidth})`"
        >
          灰色区域不可打印
        </div>
        <!-- 区域范围 background: url(${bgkImage}) no-repeat; -->
        <div
          class="excel__bgk--background"
          :style="`
            width: calc(${excelBgkScopeWidth});
            height: calc(${excelBgkScopeHeight} - 1px);
            background-size: 100% 100%;
            background: #fff;
          `"
        >
          <img
            v-if="$parseImgUrl(imgbgUrl)"
            :src="$parseImgUrl(imgbgUrl)"
            style="width: 100%; height: 100%"
          />
        </div>
        <!-- 右边 -->
        <div
          class="excel__bgk--background1"
          :style="`
            width: calc(100% - ${excelBgkScopeWidth});
            left: calc(${excelBgkScopeWidth} + 2px)
          `"
        ></div>
        <!-- 左边 -->
        <div
          class="excel__bgk--background2"
          :style="`
            width: calc(${excelBgkScopeWidth} + 2px);
            top: calc(${excelBgkScopeHeight} + 2px);
          `"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPrintDesign } from '@/api/printTemplate';
import { postUploadHelp } from '@/api/helpCenter';

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
    },
    allNode: {
      type: Object,
      default: () => {}
    },
    // 拖进来的类型
    currentType: {
      type: String,
      default: ''
    },
    allTableFieldArr: {
      type: Array,
      default: () => []
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
        row: 200, // 行数
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
      borderInfo: [],
      everyWidthOjb: {},
      everyHeightObj: {}
    };
  },
  components: {},
  computed: {
    excelBgkScopeWidth() {
      return `${this.areaWidth} - ${this.globalConfig.marginLeft}mm - ${this.globalConfig.marginRight}mm`;
    },
    excelBgkScopeHeight() {
      return `${this.areaHeight} - ${this.globalConfig.marginBottom}mm - ${this.globalConfig.marginTop}mm`;
    },
    excelBgkScopeWidthNum() {
      return (
        parseInt(this.areaWidth, 0) -
        parseInt(this.globalConfig.marginLeft, 0) -
        parseInt(this.globalConfig.marginRight, 0)
      );
    },
    excelBgkScopeHeightNum() {
      return (
        parseInt(this.areaHeight, 0) -
        parseInt(this.globalConfig.marginBottom, 0) -
        parseInt(this.globalConfig.marginTop, 0)
      );
    },
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
    },
    imgbgUrl() {
      return (
        this.globalConfig.bgImgArr &&
        this.globalConfig.bgImgArr[0] &&
        this.globalConfig.bgImgArr[0].url
      );
    }
  },
  watch: {
    dropObj: {
      handler(v) {
        this.dropObj = v;
      },
      deep: true
    },
    allNode: {
      handler(v) {
        this.allNode = v;
      },
      deep: true
    },
    globalConfig: {
      handler(v) {
        this.$emit('update:areaWidth', `${v.paperWidth}mm`);
        this.$emit('update:areaHeight', `${v.paperHeight}mm`);
      },
      deep: true
    }
  },
  mounted() {
    this.initExcel();
    this.$nextTick(() => {
      setTimeout(() => {
        this.luckysheet.setRowHeight(this.everyHeightObj);
        this.luckysheet.setColumnWidth(this.everyWidthOjb);
      }, 1000);
    });

    // window.addEventListener('keydown', this.deleteListener);
  },
  destroyed() {
    // window.removeEventListener('keydown', this.deleteListener);
  },
  methods: {
    // deleteListener(e) {
    //   console.log(e);
    // },
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
    },
    // 改变父组件中的值
    changeExcelObj() {
      const arr = [];
      const res = this.luckysheet.getAllSheets();
      // 扩展 循环每个sheet页
      res.forEach((item, index) => {
        // 循环 sheet 下的 celldata
        const { name } = item;
        const childObj = {
          celldata: [],
          name,
          order: index
        };
        item.celldata.forEach((val) => {
          // console.log(val);
          // const { r, c } = val;
          // const { m, v } = val.v;
          // console.log(c, this.maxWidth, r, this.maxHeight);
          // if (m && v && r + 1 <= this.maxHeight && c + 1 <= this.maxWidth) {
          //   console.log(val);
          //   childObj.celldata.push(val);
          // }
          childObj.celldata.push(val);
        });
        // childObj.celldata.forEach((v, i) => {
        //   // 循环填入的值
        //   console.log(this.fillExcelArr);
        //   this.fillExcelArr.forEach((val) => {
        //     console.log(val);
        //     if (index === val.order && val.c === v.c && val.r === v.r) {
        //       const { columnName, tableName, elementType, order } = val;
        //       childObj.celldata[i] = {
        //         ...v,
        //         columnName,
        //         tableName,
        //         elementType,
        //         order
        //       };
        //     }
        //   });
        // });
        arr.push(childObj);
      });

      this.celldataList = arr[this.activeIndex].celldata;

      console.log(this.celldataList);
      this.borderInfo =
        res[this.activeIndex] &&
        res[this.activeIndex].config &&
        res[this.activeIndex].config.borderInfo;

      this.$emit('update:excelArr', arr);
      this.$emit('update:excelImg', this.luckysheet.getImageOption());
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
    // 初始
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
        const { globalConfig, excelArr, previewObj } = JSON.parse(excelData.desingJson);
        if (excelArr.length !== 0) {
          const fillExcelArr = [];
          excelArrData = [];
          const imagesArr = [];
          if (previewObj.excelImg) {
            Object.values(previewObj.excelImg).forEach((item) => {
              if (item.src.indexOf('?') !== -1) {
                item.src = item.src.slice(0, item.src.indexOf('?'));
                item.src = this.$parseImgUrl(item.src);
              } else {
                item.src = this.$parseImgUrl(item.src);
              }
              imagesArr.push(item);
            });
          }
          excelArr.forEach((item) => {
            excelArrData.push({
              name: item.name, // 工作表名称
              order: item.order,
              celldata: item.celldata,
              images: { ...imagesArr },
              config: previewObj.config,
              ...this.sheetObject
            });
            fillExcelArr.push(...item.celldata);
          });
          const { everyWidth, everyHeight } = previewObj;
          everyWidth.forEach((item, i) => {
            this.everyWidthOjb[i] = item;
          });
          everyHeight.forEach((item, i) => {
            this.everyHeightObj[i] = item;
          });
          this.$emit('update:fillExcelArr', fillExcelArr);
        }
        this.$emit('update:excelArr', excelArr);
        this.$emit('update:globalConfig', globalConfig);
      }
      const _this = this;
      this.luckysheet = window.luckysheet;
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
          // deleteRow: false, // 删除选中行
          // deleteColumn: false, // 删除选中列
          // deleteCell: false, // 删除单元格
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
          'border',
          'mergeCell',
          'horizontalAlignMode',
          'verticalAlignMode',
          // 'textWrapMode',
          'image',
          'function'
        ],
        uploadImage(file) {
          // eslint-disable-next-line no-async-promise-executor
          return new Promise(async (resolve) => {
            const formData = new FormData();
            formData.append('file', file, file.name || '');
            const res = await postUploadHelp(formData);
            resolve(_this.$parseImgUrl(res)); // 给上传的后的地址
          });
        },
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
          cellUpdated(a, b, c, d) {
            const reg = /\$\{(.+?)\}/g;
            const { m } = d;
            const result = String(m).match(reg) || [];
            if (result.length === 0) {
              delete d.isTableField;
              delete d.isFormField;
            }
          },
          scroll() {
            _this.$nextTick(() => {
              _this.luckysheet.exitEditMode();
            });
          },
          cellEditBefore(e) {
            const { column, row } = e[0];
            const str = _this.luckysheet.getCellValue(row[0], column[0]) || '';
            const reg = /\$\{(.+?)\}/g;
            const result = String(str).match(reg) || [];
            if (result.length !== 0) {
              _this.$nextTick(() => {
                _this.luckysheet.exitEditMode();
              });
            }
          },
          sheetMouseup(cell, postion) {
            if (_this.isMove && _this.isFill) {
              const { c, r } = postion;
              if (c !== '' && r !== '') {
                const { compId } = _this.dropObj;
                const { name } = _this.dropObj;
                const val = `\${${compId}}`;
                // 表格
                if (_this.allTableFieldArr.length) {
                  _this.allTableFieldArr.forEach((item, i) => {
                    _this.luckysheet.setCellValue(r, c + i, {
                      v: item.name,
                      m: item.name
                    });
                    _this.luckysheet.setCellValue(r + 1, c + i, {
                      v: `\${${item.compId}}`,
                      m: `\${${item.compId}}`,
                      // fc: '#107fff',
                      isTableField: true
                    });
                  });
                } else if (_this.currentType === 'TableMain') {
                  _this.luckysheet.setCellValue(r, c, {
                    v: name,
                    m: name
                  });
                  _this.luckysheet.setCellValue(r + 1, c, {
                    v: val,
                    m: val,
                    // fc: '#107fff',
                    isTableField: true
                  });
                } else {
                  _this.luckysheet.setCellValue(r, c, {
                    v: `${name}:`,
                    m: `${name}:`
                  });
                  _this.luckysheet.setCellValue(r, c + 1, {
                    v: val,
                    m: val,
                    // fc: '#107fff',
                    isFormField: true // 是否是表单字段
                  });
                }
                _this.luckysheet.setRangeShow([{ row: [r, r], column: [c, c] }]);
              }
            }
          },
          cellMousedownBefore(cell, postion) {
            const { c, r } = postion;
            _this.isNeed = false;
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
      console.log(this.luckysheet);
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
      // 取消编辑模式
      this.luckysheet.exitEditMode();
      // 算出多少行、多少列
      const { visibledatacolumn, visibledatarow, config } = this.luckysheet.getSheet();
      // 行
      const everyWidth = [];
      const everyHeight = [];
      for (let i = 0; i < visibledatacolumn.length; i += 1) {
        const numColumn =
          i === 0 ? visibledatacolumn[i] : visibledatacolumn[i] - visibledatacolumn[i - 1];
        everyWidth.push(numColumn);
        if (visibledatacolumn[i] > this.mmToPx(parseInt(this.excelBgkScopeWidthNum, 0))) {
          this.maxWidth = i + 1;
          break;
        }
      }
      // 列
      console.log(visibledatarow);
      for (let j = 0; j < visibledatarow.length; j += 1) {
        const numRow = j === 0 ? visibledatarow[j] : visibledatarow[j] - visibledatarow[j - 1];
        everyHeight.push(numRow);
        console.log(visibledatarow[j], this.mmToPx(parseInt(this.excelBgkScopeHeightNum, 0)));
        if (visibledatarow[j] > this.mmToPx(parseInt(this.excelBgkScopeHeightNum, 0))) {
          this.maxHeight = j + 1;
          break;
        }
      }
      console.log(everyWidth, everyHeight);
      this.borderInfo = config && config.borderInfo;
      this.changeExcelObj();
      this.$emit('update:previewObj', {
        everyWidth,
        everyHeight,
        maxWidth: this.maxWidth,
        maxHeight: this.maxHeight,
        celldataList: this.celldataList,
        excelImg: this.luckysheet.getImageOption(),
        borderInfo: this.borderInfo,
        config
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
    }
  }
  //
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
    // .luckysheetTableContent {
    //   z-index: 101;
    // }
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
      border: 0;
    }
    ::-webkit-scrollbar-track {
      background-color: #f5f7fa;
    }

    .luckysheet-scrollbar-ltr {
      z-index: 300;
    }

    .luckysheet-cell-flow {
      top: 0 !important;
    }
  }
}
$sheetTabHeight: 30px;
.excel {
  width: 100%;
  &__bgk {
    user-select: none;
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    &--hint {
      position: absolute;
      top: 14px;
      z-index: 101;
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
      z-index: 10;
      color: #777f8d;
      font-size: 18px;
      pointer-events: none;
      border: 1px dashed #000000;
      // border-right: 1px dashed #000000;
      // border-bottom: 1px dashed #000000;
      background-size: contain;
      opacity: 0.9;
    }
    &--background1 {
      background-color: rgba(232, 231, 234, 0.8);
      position: absolute;
      top: 0;
      z-index: 10;
      pointer-events: none;
      height: 100%;
    }
    &--background2 {
      // background-color: rgba(15, 28, 53, 0.1);
      background-color: rgba(232, 231, 234, 0.8);
      position: absolute;
      top: 0;
      z-index: 10;
      pointer-events: none;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
