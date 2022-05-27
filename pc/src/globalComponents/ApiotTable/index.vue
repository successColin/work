<!--
 * @Author: cmk
 * @Date: 2021-04-14 17:45:32
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-23 17:17:46
 * @Des: 表格封装
-->
<template>
  <el-table
    ref="multipleTable"
    :data="curData"
    :class="[{ hasBigButton: hasBigButton }]"
    :height="tableHeight"
    v-on="$listeners"
    v-bind="$attrs"
    :border="border"
    :row-key="rowKey"
    @sort-change="sortChange"
    @cell-mouse-enter="cellMouseEnter"
    @cell-mouse-leave="cellMouseLeave"
    @select-all="selectAll"
    @row-click="rowClick"
    @header-dragend="headerDragend"
  >
    <el-table-column v-if="showSort" width="40" fixed="left" :resizable="false">
      <template slot-scope="scope">
        <span class="centerFont">{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-else-if="showRadio"
      width="40"
      fixed="left"
      :resizable="false"
      align="center"
    >
      <template slot-scope="scope">
        <span
          class="centerFont"
          v-if="
            scope.row.showIndex &&
            scope.row[selectName] !== getCurrentRadioObjId
          "
          >{{ scope.$index + 1 }}</span
        >
        <el-radio
          v-else
          class="multipleTable__radio"
          :value="currentRadioObj ? currentRadioObj[selectName] : ''"
          :label="scope.row[selectName]"
          @input="handleChangeRadioObj(scope.row)"
        ></el-radio>
        <div class="mask-box" v-if="lineSelect"></div>
      </template>
    </el-table-column>
    <el-table-column
      width="40"
      type="selection"
      :reserve-selection="reserveSelection"
      v-else-if="showSelection"
      fixed="left"
    >
      <template slot-scope="scope">
        <span
          class="centerFont"
          v-if="scope.row.showIndex && !scope.row.isChecked"
          >{{ scope.$index + 1 }}</span
        >
        <el-checkbox
          v-else
          v-model="scope.row.isChecked"
          :disabled="scope.row.isDisable"
          @change="!lineSelect && changeSelectd(scope.row, scope.row.isChecked)"
        ></el-checkbox>
        <div class="mask-box" v-if="lineSelect"></div>
      </template>
    </el-table-column>
    <slot name="custom"></slot>
    <slot></slot>
    <template v-slot:empty>
      <div class="apiotNoData1" placeholder="暂无数据"></div>
    </template>
  </el-table>
</template>

<script>
import Sortable from 'sortablejs';
import animate from '@/utils/animateList';
import { debounce } from '@/utils/utils';

export default {
  inheritAttrs: false,
  props: {
    height: {
      type: Number,
      default: 0
    },
    // 是否需要动画
    isAnimate: {
      type: Boolean,
      default: true
    },
    // 表格数据
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否显示多选框
    showSelection: {
      type: Boolean,
      default: true
    },
    // 是否显示排序
    showSort: {
      type: Boolean,
      default: false
    },
    // 内容是否有大按钮,有大按钮的内容行高需40，默认36
    hasBigButton: {
      type: Boolean,
      default: false
    },
    // 是否需要行拖拽
    isNeedRowDrop: {
      type: Boolean,
      default: false
    },
    // 是否需要列拖拽
    isNeedColumnDrop: {
      type: Boolean,
      default: true
    },
    // 列拖拽列表数据
    dropColumnData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 行列拖拽 精准定位table
    dropClass: {
      type: String,
      default: '#app'
    },
    // 是否可以行拖拽
    border: {
      type: Boolean,
      default: true
    },
    // 排序是否需要后端支持
    isNeedAsync: {
      type: Boolean,
      default: false
    },
    rowKey: {
      type: [String, Function],
      default: ''
    },
    // 动画强制刷新所有
    shouldResetAll: {
      type: Boolean,
      default: false
    },
    showRadio: {
      type: Boolean,
      default: false
    },
    currentRadioObj: {
      type: Object,
      default: () => {}
    },
    selectName: {
      type: String,
      default: 'id'
    },
    lineSelect: {
      type: Boolean,
      default: false
    },
    // 是否保留更新前的多选数据
    reserveSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableHeight: 300,
      curData: [],
      columnSortable: null, // 列拖拽sortable
      rowSortable: null, // 行拖拽sortable
      bounceHeigthFunc: null
    };
  },

  components: {},

  computed: {
    getCurrentRadioObjId() {
      if (this.currentRadioObj) {
        return this.currentRadioObj[this.selectName];
      }
      return '';
    }
  },

  mounted() {
    this.changeHeight();
    this.bounceHeigthFunc = debounce(this.changeHeight);
    window.addEventListener('resize', this.bounceHeigthFunc);
    this.$nextTick(() => {
      setTimeout(() => {
        if (this.isNeedRowDrop) {
          this.rowDrop();
        }
        if (this.isNeedColumnDrop) {
          this.columnDrop();
        }
      }, 800);
    });
  },
  activated() {
    this.changeHeight();
    window.removeEventListener('resize', this.bounceHeigthFunc);
    window.addEventListener('resize', this.bounceHeigthFunc);
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout();
    });
  },

  methods: {
    // 单选框点击事件
    handleChangeRadioObj(v) {
      // console.log(v);
      this.$emit('update:currentRadioObj', v);
      this.$emit('handleChangeRadioObj', v);
    },
    // 改变高度
    changeHeight() {
      setTimeout(() => {
        if (this.$refs.multipleTable) {
          const parent = this.$refs.multipleTable.$el.parentNode;
          this.tableHeight = parent.offsetHeight;
        }
      }, 0);
    },
    //  鼠标移入
    cellMouseEnter(row) {
      if (this.showSelection || this.showRadio) {
        row.showIndex = false;
      }
      this.$emit('cellMouseEnter', row);
    },
    // 鼠标移出
    cellMouseLeave(row) {
      if (this.showSelection || this.showRadio) {
        row.showIndex = true;
      }
    },
    // 全选操作
    selectAll(selection) {
      this.curData.forEach((item) => {
        if (!item.isDisable) {
          if (selection.includes(item)) {
            item.isChecked = true;
          } else {
            item.isChecked = false;
          }
        }
      });
      this.$emit('select-all', selection);
    },
    // 行点击
    rowClick(row) {
      if (!this.lineSelect) {
        return false;
      }
      if (this.showRadio) {
        this.handleChangeRadioObj(row);
      } else if (this.showSelection) {
        row.isChecked = !row.isChecked;
        this.changeSelectd(row, row.isChecked);
      }
    },
    // checked更改
    changeSelectd(row, checked) {
      this.$refs.multipleTable.toggleRowSelection(row, checked);
      this.$emit('change-selectd', row, checked);
    },
    // 切换每一行选中顺序
    toggleRowSelection(row, flag) {
      this.$refs.multipleTable.toggleRowSelection(row, flag);
      // row.isChecked = flag;
      this.$set(row, 'isChecked', flag);
    },
    // 清空选中
    clearSelection() {
      this.$nextTick(() => {
        if (this.$refs.multipleTable) {
          this.$refs.multipleTable.clearSelection();
          this.curData.forEach((item) => {
            item.isChecked = false;
          });
        }
      });
    },
    // 行拖拽
    rowDrop() {
      const tbody = document.querySelector(`${this.dropClass} .el-table__body-wrapper tbody`);
      const _this = this;
      this.rowSortable = Sortable.create(tbody, {
        animation: 300,
        onEnd({ newIndex, oldIndex }) {
          const currRow = _this.curData.splice(oldIndex, 1)[0];
          _this.curData.splice(newIndex, 0, currRow);
          _this.$emit('row-drop-end', { newIndex, oldIndex });
        },
        onStart({ oldIndex }) {
          _this.$emit('row-drop-start', { oldIndex });
        }
      });
    },
    // 列拖拽
    columnDrop() {
      const wrapperTr = document.querySelector(`${this.dropClass} .el-table__header-wrapper tr`);
      this.columnSortable = Sortable.create(wrapperTr, {
        animation: 300,
        delay: 0,
        onMove: (evt) => {
          this.$emit('column-drop-move', evt);
        },
        onEnd: ({ oldIndex, newIndex }) => {
          // 有多选，前面默认多一条数据
          if (this.showSort || this.showRadio || this.showSelection) {
            oldIndex -= 1;
            newIndex -= 1;
          }
          const oldItem = this.dropColumnData.splice(oldIndex, 1);
          this.dropColumnData.splice(newIndex, 0, ...oldItem);
          this.$emit('column-drop-end', { oldIndex, newIndex });
        }
      });
    },
    // 表头宽度改变
    headerDragend(newWidth, oldWidth, column, event) {
      if (this.columnSortable) {
        this.columnSortable.destroy();
      }
      if (this.isNeedColumnDrop) {
        this.columnDrop();
      }
      this.$emit('header-dragend', newWidth, oldWidth, column, event);
    },

    // 滚动到指定行
    scrollToCur(index) {
      const ele = this.$refs.multipleTable;
      let h = 36;
      if (this.hasBigButton) {
        h = 40;
      }
      ele.bodyWrapper.scrollTop = h * index;
    },
    sortChange(obj) {
      if (obj.prop === undefined) {
        return 0;
      }
      if (this.isNeedAsync) {
        this.$emit('sortChangeColumn', obj);
      } else {
        this.curData.sort((data1, data2) => {
          let res = 0;
          const str1 = `${data1[obj.prop] ? data1[obj.prop] : ''}`;
          const str2 = `${data2[obj.prop] ? data2[obj.prop] : ''}`;
          for (let i = 0; ; i += 1) {
            if (!str1[i] || !str2[i]) {
              res = str1.length - str2.length;
              break;
            }
            const char1 = str1[i];
            const char1Type = this.getChartType(char1);
            const char2 = str2[i];
            const char2Type = this.getChartType(char2);
            // 类型相同的逐个比较字符
            if (char1Type[0] === char2Type[0]) {
              if (char1 !== char2) {
                if (char1Type[0] === 'zh') {
                  res = char1.localeCompare(char2);
                } else if (char1Type[0] === 'en') {
                  res = char1.charCodeAt(0) - char2.charCodeAt(0);
                } else {
                  res = char1 - char2;
                }
                break;
              }
            } else {
              // 类型不同的，直接用返回的数字相减
              res = char1Type[1] - char2Type[1];
              break;
            }
          }
          if (obj.order === 'ascending') {
            return res;
          }
          return -res;
        });
      }
    },
    getChartType(char) {
      // 数字可按照排序的要求进行自定义，我这边产品的要求是
      // 数字（0->9）->大写字母（A->Z）->小写字母（a->z）->中文拼音（a->z）
      if (/^[\u4e00-\u9fa5]$/.test(char)) {
        return ['zh', 300];
      }
      if (/^[a-zA-Z]$/.test(char)) {
        return ['en', 200];
      }
      if (/^[0-9]$/.test(char)) {
        return ['number', 100];
      }
      return ['others', 999];
    },

    initTable(v) {
      this.curData = JSON.parse(JSON.stringify(v));
      animate.removeAllClass({ selector: this.dropClass, arr: this.curData });
      if (this.showSelection || this.showRadio) {
        this.curData.forEach((item) => {
          if (item.isChecked === undefined && item.showIndex === undefined) {
            this.$set(item, 'isChecked', false);
            this.$set(item, 'showIndex', true);
          }
        });
        this.$nextTick(() => {
          const cellArr = document.querySelectorAll('.cell');
          cellArr.forEach((cell) => {
            cell.title = cell.innerText;
          });
          this.$emit('tableInited', this.curData);
        });
      }
    }
  },

  watch: {
    tableData: {
      handler(v) {
        // console.log(this.dropClass);
        let addArr = [];
        let delArr = [];
        if (!this.shouldResetAll) {
          v.forEach((newItem, i) => {
            const index = this.curData.findIndex(
              (oldItem) => oldItem[this.rowKey] === newItem[this.rowKey]
            );
            if (index === -1) {
              addArr.push(i);
            }
          });
          this.curData.forEach((oldItem, i) => {
            const index = v.findIndex((newItem) => oldItem[this.rowKey] === newItem[this.rowKey]);
            if (index === -1) {
              delArr.push(i);
            }
          });
        }

        if (
          (addArr.length === v.length && delArr.length === this.curData.length) ||
          this.curData.length === 0 ||
          (addArr.length === 0 && delArr.length === 0)
        ) {
          this.$nextTick(() => {
            if (this.isAnimate) animate.renderListItem(this.dropClass);
            this.$emit('update:shouldResetAll', false);
          });
          addArr = [];
          delArr = [];
        }
        if (addArr.length > 0) {
          if (this.isAnimate) {
            this.$nextTick(() => {
              animate.animateFun({
                deleteArr: addArr,
                selector: this.dropClass,
                animateType: 'add',
                type: 'table'
              });
            });
          }
          this.initTable(v);
        } else if (delArr.length > 0) {
          if (this.isAnimate) {
            animate.animateFun({
              deleteArr: delArr,
              selector: this.dropClass,
              animateType: 'delete',
              type: 'table'
            });
          }
          setTimeout(() => {
            this.initTable(v);
          }, 500);
        } else {
          this.initTable(v);
        }
      },
      immediate: true,
      deep: true
    }
  },
  deactivated() {
    window.removeEventListener('resize', this.bounceHeigthFunc);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.bounceHeigthFunc);
    if (this.rowSortable) {
      this.rowSortable.destroy();
    }
    if (this.columnSortable) {
      this.columnSortable.destroy();
    }
  }
};
</script>

<style lang='scss' scoped>
.centerFont {
  display: inline-block;
  text-align: center;
  width: 100%;
}
.multipleTable__radio {
  ::v-deep {
    .el-radio__label {
      display: none;
    }
  }
}
.hasBigButton {
  ::v-deep {
    th {
      padding: 0;
    }
    .cell {
      line-height: 40px;
    }
  }
}
.mask-box {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0);
}
::v-deep {
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    position: relative;
    border: 1px solid #e9e9e9;
    background-color: #ffffff;
    &::before {
      content: '';
      position: absolute;
      left: -1px;
      top: -1px;
      width: 14px;
      height: 14px;
      background: #4689f5;
    }
  }
  .el-table__empty-text {
    height: 100%;
    max-height: 300px;
  }
}
</style>
