<template>
  <div class="taskManagement">
    <div
      id="luckysheet"
      style="
        margin: 0px;
        padding: 0px;
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0px;
        top: 0px;
      "
    ></div>
    <!--使用draggable组件-->
    <!-- <div class="taskManagement__col" v-for="(item, i) in moduleArr" :key="i">
      <div class="taskManagement__title">{{ item.title }}</div>
      <draggable
        v-model="item.arrName"
        group="site"
        animation="300"
        dragClass="dragClass"
        ghostClass="ghostClass"
        chosenClass="chosenClass"
        @start="onStart"
        @end="onEnd"
        class="taskManagement__draggable"
      >
        <transition-group class="taskManagement__group">
          <div class="item" v-for="val in item.arrName" :key="val.id">
            {{ val.name }}
          </div>
        </transition-group>
      </draggable>
    </div> -->
  </div>
</template>

<script>
// import { auth } from '@/api/login';

export default {
  components: {},
  data() {
    return {
      // drag: false,
      // // 定义要被拖拽对象的数组
      // moduleArr: [
      //   {
      //     title: '创建任务',
      //     arrName: [
      //       { id: 1, name: 'www.itxst.com1' },
      //       { id: 2, name: 'www.jd.com2' },
      //       { id: 3, name: 'www.baidu.com3' },
      //       { id: 4, name: 'www.taobao.com4' }
      //     ]
      //   },
      //   {
      //     title: '进行中',
      //     arrName: [
      //       { id: 11, name: 'www.google.com5' },
      //       { id: 12, name: 'www.msn.com6' },
      //       { id: 13, name: 'www.ebay.com7' },
      //       { id: 14, name: 'www.yahoo.com8' }
      //     ]
      //   },
      //   {
      //     title: '完成',
      //     arrName: [
      //       { id: 21, name: 'www.google.com9' },
      //       { id: 22, name: 'www.msn.com10' },
      //       { id: 23, name: 'www.ebay.com11' },
      //       { id: 24, name: 'www.yahoo.com12' }
      //     ]
      //   },
      //   {
      //     title: '测试',
      //     arrName: [
      //       { id: 31, name: 'www.google.com13' },
      //       { id: 32, name: 'www.msn.com14' },
      //       { id: 33, name: 'www.ebay.com15' },
      //       { id: 34, name: 'www.yahoo.com16' }
      //     ]
      //   }
      // ]
      // arr1: ,
      // arr2:
      // arr3:
      // arr4:
    };
  },
  mounted() {
    // console.log(this.getQueryVariable());
    // eslint-disable-next-line camelcase,no-unused-vars
    // const auth_code = this.getQueryVariable('auth_code');
    // auth({ authCode: auth_code, oAuthType: 'E_WECHAT' }).then((res) => {
    //   console.log(res);
    // });
    // const options = {
    //   container: 'luckysheet' // luckysheet为容器id
    // };
    // const _this = this;
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
      // showtoolbarConfig: [
      //   'undo',
      //   'redo',
      //   'font',
      //   'fontSize',
      //   'bold',
      //   'italic',
      //   // 'underline',
      //   // 'strikethrough',
      //   'textColor',
      //   'fillColor',
      //   'border',
      //   'mergeCell',
      //   'horizontalAlignMode',
      //   'verticalAlignMode',
      //   // 'textWrapMode',
      //   'image'
      // ],
      showtoolbar: false,
      showtoolbarConfig: {
        undoRedo: true, // 撤销重做，注意撤消重做是两个按钮，由这一个配置决定显示还是隐藏
        font: true, // '字体'
        fontSize: true, // '字号大小'
        bold: true, // '粗体 (Ctrl+B)'
        italic: true, // '斜体 (Ctrl+I)'
        // strikethrough: true, // '删除线 (Alt+Shift+5)'
        // underline: true, // '下划线 (Alt+Shift+6)'
        textColor: true, // '文本颜色'
        fillColor: true, // '单元格颜色'
        border: true, // '边框'
        mergeCell: true, // '合并单元格'
        horizontalAlignMode: true, // '水平对齐方式'
        verticalAlignMode: true, // '垂直对齐方式'
        // textWrapMode: true, // '换行方式'
        image: true // '插入图片'
      },
      hook: {
        // sheetMouseup(cell, postion) {
        //   if (_this.isMove && _this.isFill) {
        //     const { c, r } = postion;
        //     if (c !== '' && r !== '') {
        //       _this.luckysheet.setCellValue(r, c, `\${${_this.dropObj.name}}`);
        //       _this.luckysheet.setCellFormat(r, c, 'fc', '#107fff');
        //       _this.luckysheet.setRangeShow([{ row: [r, r], column: [c, c] }]);
        //     }
        //   }
        // },
        // cellMousedownBefore(cell, postion) {
        //   const { c, r } = postion;
        //   _this.isNeed = false;
        //   // console.log(_this.fillExcelArr);
        //   for (let i = 0; i < _this.fillExcelArr.length; i += 1) {
        //     const bb = _this.fillExcelArr[i];
        //     if (bb.c === c && bb.r === r) {
        //       _this.isNeed = true;
        //       _this.$emit('update:excelSelectedObj', bb);
        //       break;
        //     }
        //   }
        //   if (!_this.isNeed) {
        //     _this.$emit('update:excelSelectedObj', {});
        //   }
        //   _this.getPositionString();
        // }
      }
    };
    window.luckysheet.create(options);
  },
  methods: {
    // // 开始拖拽事件
    // onStart() {
    //   this.drag = true;
    // },
    // // 拖拽结束事件
    // onEnd() {
    //   this.drag = false;
    // },
    // getQueryVariable(variable) {
    //   const query = window.location.search.substring(1);
    //   const vars = query.split('&');
    //   // eslint-disable-next-line no-plusplus
    //   for (let i = 0; i < vars.length; i++) {
    //     const pair = vars[i].split('=');
    //     if (pair[0] === variable) {
    //       return pair[1];
    //     }
    //   }
    //   return false;
    // }
  }
};
</script>

<style lang='scss' scoped>
.taskManagement {
  display: flex;

  &__col {
    flex: 1;
    padding: 10px;
    border: solid 1px #eee;
    border-radius: 5px;
    margin: 10px;
    min-height: 500px;
    display: flex;
    flex-direction: column;
  }

  &__title {
    padding: 6px 12px;
  }

  &__draggable {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  &__group {
    height: 100%;
  }

  /*定义要拖拽元素的样式*/
  .ghostClass {
    background-color: blue !important;
  }

  .chosenClass {
    background-color: red !important;
    opacity: 1 !important;
  }

  .dragClass {
    background-color: blueviolet !important;
    opacity: 1 !important;
    box-shadow: none !important;
    outline: none !important;
    background-image: none !important;
  }

  .item {
    padding: 6px 12px;
    margin: 0px 10px 0px 10px;
    border: solid 1px #eee;
    background-color: #f1f1f1;
  }

  .item:hover {
    background-color: #fdfdfd;
    cursor: move;
  }

  .item + .item {
    border-top: none;
    margin-top: 6px;
  }
}
</style>
