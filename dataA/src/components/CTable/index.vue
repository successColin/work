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
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @select-all="selectAll">
    <el-table-column v-if="showSort" width="40" fixed="left" :resizable="false">
      <template slot-scope="scope">
        <span class="centerFont">{{ scope.$index + 1 }}</span>
      </template>
    </el-table-column>
    <el-table-column
        v-else-if="showRadio"
        width="50"
        fixed="left"
        :resizable="false"
        align="center"
    >
      <template slot-scope="scope">
        <span
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
      </template>
    </el-table-column>
    <el-table-column
        width="40"
        type="selection"
        v-else-if="showSelection"
        fixed="left"
    >
      <template slot-scope="scope">
        <span v-if="scope.row.showIndex && !scope.row.isChecked">{{
            scope.$index + 1
          }}</span>
        <el-checkbox
            v-else
            v-model="scope.row.isChecked"
            @change="changeSelectd(scope.row, scope.row.isChecked)"
            :disabled="scope.row.isDisable"
        ></el-checkbox>
      </template>
    </el-table-column>
    <slot name="custom"></slot>
    <slot></slot>
    <!--    <template v-slot:empty>-->
    <!--      <div class="apiotNoData" placeholder="暂无数据"></div>-->
    <!--    </template>-->
  </el-table>
</template>

<script>
// import Sortable from 'sortablejs';
import {debounce} from '@/utils/utils';

export default {
  inheritAttrs: false,
  props: {
    selectKeys: { // 被选中的数据
      type: Array,
      default() {
        return [];
      }
    },
    height: {
      type: Number,
      default: 0
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
      type: String,
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
      default: () => {
      }
    },
    selectName: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      tableHeight: 300,
      curData: [],
      selected: []
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
    this.changeHeight = debounce(this.changeHeight);
  },

  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.multipleTable.doLayout();
    });
  },

  methods: {
    // 单选框点击事件
    handleChangeRadioObj(v) {
      this.$emit('update:currentRadioObj', v);
    },
    // 改变高度
    changeHeight() {
      this.$nextTick(() => {
        if (this.$refs.multipleTable) {
          const parent = this.$refs.multipleTable.$el.parentNode;
          this.tableHeight = parent.offsetHeight;
        }
      });
    },
    //  鼠标移入
    cellMouseEnter(row) {
      if (this.showSelection) {
        row.showIndex = false;
      }
    },
    // 鼠标移出
    cellMouseLeave(row) {
      if (this.showSelection) {
        row.showIndex = true;
      }
    },
    // 全选操作
    selectAll(selection) {
      const res = selection.length !== 0;
      this.curData.forEach((item) => {
        // 导入模板用到
        if (!item.isDisable) {
          item.isChecked = res;
        }
      });
      this.$emit('select-all', selection);
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
      this.$refs.multipleTable.clearSelection();
      this.curData.forEach((item) => {
        item.isChecked = false;
      });
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
    initTable(v) {
      this.curData = JSON.parse(JSON.stringify(v));
      if (this.showSelection) {
        this.curData.forEach((item) => {
          const current = this.selected.find((s) => s.id === item.id);
          if (current) {
            this.$set(item, 'isChecked', true);
            this.$set(item, 'showIndex', false);
          }
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
        this.initTable(v);
      },
      immediate: true,
      deep: true
    },
    selectKeys: {
      immediate: true,
      deep: true,
      handler(v) {
        this.selected = JSON.parse(JSON.stringify(v));
      }
    }
  },
  beforeDestroy() {
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
