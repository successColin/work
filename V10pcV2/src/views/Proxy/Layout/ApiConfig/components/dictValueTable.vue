<!--
 * @Author: sss
 * @Date: 2021-05-06 15:20:13
 * @Last Modified by:   sss
 * @Last Modified time: 2021-05-06 15:20:13
 * @Descripttion: 枚举值列表
-->
<template>
  <div class="dictValue__content proxy">
    <section class="dictValue__main">
      <apiot-table-edit
        v-on="$listeners"
        v-bind="$attrs"
        :showSelection="false"
        ref="dictValueList"
        :isNeedRowDrop="isEdit"
        :tableData="tableData"
        :isNeedColumnDrop="false"
        dropClass=".dictValue__main"
        rowKey="sno"
        row-class-name="dictValue__row"
        @current-change="currentChange"
        @row-drop-end="rowDropEnd"
        @row-drop-start="rowDropStart"
        @cell-click="cellClick"
      >
        <el-table-column v-if="isEdit" :width="40" align="center" key="1"
          ><i class="iconfont icon-zongxiangtuodong"></i
        ></el-table-column>
        <component
          v-for="(item, index) in columnData"
          :is="item.compName"
          :key="`${item.prop}_${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :editIndex="currentEditIndex"
          :errorCell="errorCell"
          @handleEdit="editColumn"
        ></component>
        <el-table-column key="2" :sortable="false" label="值" prop="value">
          <template slot-scope="scope">
            <div
              class="coderMirrorBox"
              :class="{
                'is-error': isError(scope.row),
                currentClass: scope.row.index === currentEditIndex,
              }"
            >
              <EditCodeMirror
                :ref="`EditCodeMirror_${scope.row.index}`"
                :value="scope.row.value"
                :height="32"
                :readOnly="getReadOnly(scope.row.index)"
                :variables="getVariables"
                @change="changeRowValue($event, scope.row, scope.row.index)"
              ></EditCodeMirror>
              <div class="error__tip" v-if="isError(scope.row)">
                {{ isError(scope.row) }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column :sortable="false" width="50">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="$t('common.delete', { name: '' })"
              placement="bottom"
            >
              <i
                class="iconfont icon-shanchu"
                @click="deletDictValue(scope.row.index)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </apiot-table-edit>
    </section>
  </div>
</template>
<script>
import DomSize from '@/utils/domResize';
import EditInputColumn from './editInputColumn';
import EditCodeMirror from './codeMirror';

export default {
  inheritAttrs: false,
  components: { EditInputColumn, EditCodeMirror },
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否可以编辑
    isEdit: {
      type: Boolean,
      default: true
    },
    variables: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      iconDialog: false,
      currentEditIndex: -1,
      editRow: {},
      errorCell: [],
      columnData: [
        {
          label: '属性',
          prop: 'key',
          compName: 'EditInputColumn',
          isRequire: true
        }
      ],
      isCodeMirrorActive: false
    };
  },

  computed: {
    getReadOnly() {
      return function (i) {
        if (i === this.currentEditIndex) {
          return false;
        }
        return 'nocursor';
      };
    },
    getVariables() {
      return this.variables.map((item) => ({
        ...item,
        variableCode: item.keycode,
        variableName: item.name,
        variableType: item.dataType === 'OBJECT' ? 5 : 4
      }));
    },
    isError() {
      return function (row) {
        const error =
          this.errorCell.find((item) => item.index === row.sno && item.prop === 'value') || {};
        return error.errorMsg || '';
      };
    },
    getCurStyle() {
      if (this.tempColor && this.tempIcon !== 'icon-jiahao') {
        return `color:${this.tempColor};border: 0 none`;
      }
      return '';
    },
    ele() {
      return document.querySelector('.dictValue__content.proxy');
    }
  },

  methods: {
    changeRowValue(v, row, i) {
      row.value = v;
      this.$set(this.tableData, i, row);
      this.editColumn(row, i, 'value');
    },
    showIconDialog(notEdit) {
      if (!this.isEdit || notEdit) return;
      this.iconDialog = true;
      this.$nextTick(() => {
        this.$refs.iconDialog.initDialog();
      });
    },
    // 初始化列表信息
    init() {
      this.iconDialog = false;
      this.currentEditIndex = -1;
      this.editRow = {};
      this.errorCell = [];
    },
    rowDropStart() {
      return false;
    },
    // 行进行拖拽后，相应的选中行也需要改变
    rowDropEnd(index) {
      const currentDictValue = this.tableData[index.oldIndex];
      const dicValue = [...this.tableData];
      dicValue.splice(index.oldIndex, 1);
      dicValue.splice(index.newIndex, 0, currentDictValue);
      this.currentEditIndex = dicValue.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(this.editRow)
      );
      this.$emit('update:tableData', dicValue);
    },
    // 行被选中时触发
    currentChange(row) {
      if (!this.isEdit) return;
      const index = this.tableData.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(row)
      );
      if (index !== -1 && index !== this.currentEditIndex) {
        this.handleCurrentChange(row, index);
      }
    },
    // 点击行时进行常态与编辑状态切换
    handleCurrentChange(row, index) {
      if (!this.isEdit) return;
      if (this.verificationDictValue()) {
        this.editRow = row;
        this.currentEditIndex = index;
      }
    },
    // 校验枚举值列表
    verificationList() {
      this.verificationDictValue();
      if (this.errorCell.length > 0) return false;
      return true;
    },
    // 校验枚举值一行,每一列都不能为空
    verificationDictValue(row, cIndex, cell) {
      const base = ['key', 'value'];
      if (cell && base.indexOf(cell) === -1) return true;
      const { tableData, editRow, currentEditIndex } = this;
      if (currentEditIndex === -1) return true;
      const checkRow = row || editRow;
      const checkIndex = cIndex || currentEditIndex;
      const ckeckColumn = cell ? [cell] : base;
      let flag = true;

      for (let i = 0, len = ckeckColumn.length; i < len; i += 1) {
        let errorCell = '';
        const prop = ckeckColumn[i];
        const cellValue = checkRow[prop];
        const column = this.columnData.find((item) => item.prop === prop) || {};
        if (!cellValue) {
          flag = false;
          // 不能为空
          errorCell = {
            index: checkRow.sno,
            prop,
            errorMsg: `${this.$t('common.notEmpty', {
              name: column.label || '值'
            })}`
          };
        }
        if (
          tableData.findIndex((item, index) => index !== checkIndex && item[prop] === cellValue) !==
            -1 &&
          prop !== 'value'
        ) {
          flag = false;
          // 不能重复
          errorCell = {
            index: checkRow.sno,
            prop,
            errorMsg: `${this.$t('common.notRepeat', {
              name: Array.isArray(column.label)
                ? this.$t(column.label[0], { lang: this.$t(column.label[1]) })
                : this.$t(column.label)
            })}`
          };
        }
        // 寻找错误信息中是否有该错误
        const index = this.errorCell.findIndex(
          (err) => err.index === checkRow.sno && err.prop === prop
        );
        // 如果有错误信息
        if (errorCell) {
          if (index === -1) this.errorCell.push(errorCell);
          else this.errorCell[index] = errorCell;
          break;
        } else if (!errorCell && index !== -1) this.errorCell.splice(index, 1);
      }
      return flag;
    },
    // 编辑每一列
    editColumn(row, index, prop) {
      if (this.verificationDictValue(row, index, prop)) {
        const editTable = [...this.tableData];
        editTable[index] = { ...editTable[index], ...row };
        this.editRow = row;
        this.$emit('update:tableData', editTable);
      }
    },
    // 添加枚举值
    addDictValue() {
      if (this.verificationDictValue()) {
        const addTable = [...this.tableData];
        const row = { sno: addTable.length + 1, value: '' };
        addTable.push(row);

        this.editRow = row;
        this.currentEditIndex = addTable.length - 1;
        this.$emit('update:tableData', addTable);
      }
    },
    // 删除枚举值
    async deletDictValue(index) {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      if (index === this.currentEditIndex) this.currentEditIndex = -1;
      const dicValue = [...this.tableData];
      const delRow = dicValue[index];
      dicValue.splice(index, 1);
      // 删除时如果删除的数据在错误日志中将对应的错误日志也删除
      const errorCell = [...this.errorCell];
      const newError = errorCell.filter((err) => err.index !== delRow.sno);
      this.errorCell = [...newError];

      dicValue.map((item, sno) => {
        item.sno = sno;
        return item;
      });
      const newEditIndex = dicValue.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(this.editRow)
      );
      if (newEditIndex !== this.currentEditIndex) {
        this.currentEditIndex = newEditIndex;
      }
      this.$emit('update:tableData', dicValue);
    },
    cellClick(row, column) {
      const { property } = column;
      if (property === 'value') {
        this.isCodeMirrorActive = true;
        return;
      }
      this.isCodeMirrorActive = false;
    },
    // reset(ev) {
    //   console.log(ev.target);
    //   this.isCodeMirrorActive = false;
    // },
    setValue(message) {
      if (this.currentEditIndex === -1) return;
      this.$refs[`EditCodeMirror_${this.currentEditIndex}`].setValue(message);
    }
  },
  mounted() {
    // document.addEventListener('click', this.reset);
    this.$bus.$off('chooseVarToHead').$on('chooseVarToHead', (message) => {
      this.setValue(message);
    });
    DomSize.bind(this.ele, () => {
      if (this.$refs.dictValueList) {
        this.$refs.dictValueList.changeHeight();
      }
    });
  },
  beforeDestroy() {
    // document.removeEventListener('click', this.reset);
    this.errorCell = [];
    this.$bus.$off('chooseVarToHead');
    DomSize.remove(this.ele);
    DomSize.destroy();
  }
};
</script>
<style lang="scss" scoped>
@import '../index.scss';

//右边样式变量
$--name: 'dictValue';
$--headerHeight: 42px;
$--footerHeight: 42px;
$--iconColoe: #aaaaaa;
.dictValue__content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.dictValue__main {
  height: calc(100% - 42px);
  ::v-deep {
    .el-table .cell {
      line-height: 40px;
      height: 40px;
    }
  }
}
.coderMirrorBox {
  width: 100%;
  height: 100%;
  //position: relative;
  display: flex;
  align-items: center;
  & .codemirror {
    border: none;
  }
  &.currentClass {
    .codemirror {
      border: 1px solid #e9e9e9;
      background: #ffffff;
    }
  }
  &.is-error {
    .codemirror {
      border-color: #f56c6c;
    }
  }
}

.icon-xinzeng {
  color: $--color-primary;
}
.icon-zongxiangtuodong {
  color: $--iconColoe;
  cursor: move;
}
.icon-shanchu {
  color: $--iconColoe;
}
.dictValue__row {
  &:hover {
    .icon-zongxiangtuodong,
    .icon-shanchu {
      color: $--color-primary;
      cursor: pointer;
    }
    ::v-deep {
      .CodeMirror {
        background: #f5f7fa;
      }
    }
  }
}
</style>
