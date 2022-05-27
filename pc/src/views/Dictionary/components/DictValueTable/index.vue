<!--
 * @Author: sss
 * @Date: 2021-05-06 15:20:13
 * @Last Modified by:   sss
 * @Last Modified time: 2021-05-06 15:20:13
 * @Descripttion: 枚举值列表
-->
<template>
  <div class="dictValue__content">
    <header class="dictValue__header" v-if="isEdit">
      <apiot-button @click="addDictValue">
        <i class="iconfont icon-xinzeng m-r-4"></i
        >{{ $t('common.add', { name: '' }) }}
      </apiot-button>
    </header>
    <section class="dictValue__main">
      <apiot-table
        v-on="$listeners"
        v-bind="$attrs"
        ref="dictValueList"
        :isAnimate="isAnimate"
        :isNeedRowDrop="isEdit"
        :tableData="tableData"
        :isNeedColumnDrop="false"
        dropClass=".dictValue__main"
        rowKey="sno"
        row-class-name="dictValue__row"
        highlight-current-row
        @current-change="currentChange"
        @row-drop-end="rowDropEnd"
        @row-drop-start="rowDropStart"
      >
        <el-table-column v-if="isEdit" :width="40" align="center" key="1"
          ><i class="iconfont icon-zongxiangtuodong"></i
        ></el-table-column>
        <component
          v-for="(item, index) in columnData"
          :is="item.compName"
          :key="`${item.prop}_${index}`"
          :prop="item.prop"
          :label="`${
            Array.isArray(item.label)
              ? $t(item.label[0], { lang: $t(item.label[1]) })
              : $t(item.label)
          }`"
          :width="item.width"
          :fixed="item.fixed"
          :isRequire="item.isRequire"
          :headTip="item.headTip"
          :editIndex="currentEditIndex"
          :errorCell="errorCell"
          :colorArr="item.colorArr"
          @handleEdit="editColumn"
        ></component>
        <el-table-column
          key="2"
          :sortable="false"
          width="100"
          :label="$t('dictionary.icon')"
        >
          <template slot-scope="scope">
            <div
              class="iconSelect"
              :class="[
                { notEdit: scope.$index !== currentEditIndex },
                { hasDefault: scope.row.icon },
              ]"
              @click="showIconDialog(scope.$index !== currentEditIndex)"
              :style="{
                color: `${scope.row.icon ? scope.row.icon.color : ''}`,
                border: `${scope.row.icon ? '0 none' : ''}`,
              }"
            >
              <i
                :class="`iconfont ${
                  (scope.row.icon ? scope.row.icon.icon : '') || 'icon-jiahao'
                }`"
              ></i>
              <div class="iconSelect__change">
                <i class="iconfont icon-qiehuan"></i>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="isEdit" :sortable="false" width="50">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              :content="$t('common.delete', { name: '' })"
              placement="bottom"
            >
              <i
                class="iconfont icon-shanchu"
                @click="deletDictValue(scope.$index)"
              ></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </apiot-table>
    </section>
    <icon-dialog
      ref="iconDialog"
      :mouseStop="true"
      :visible.sync="iconDialog"
      @iconSelected="iconSelected"
    ></icon-dialog>
  </div>
</template>
<script>
import EditInputColumn from '../EditInputColumn';
import ColorSelectColumn from '../colorSelectColumn';
import IndexNumberColumn from '../EditInputColumn/indexNumber.vue';

export default {
  inheritAttrs: false,
  components: { EditInputColumn, ColorSelectColumn, IndexNumberColumn },
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
    }
  },
  data() {
    return {
      isAnimate: true,
      iconDialog: false,
      currentEditIndex: -1,
      editRow: {},
      errorCell: [],
      columnData: [
        // 枚举值列表的表头
        // 枚举值(中文)
        {
          label: ['dictionary.enumValueLang', 'dictionary.langZH'],
          prop: 'zhCN',
          compName: 'EditInputColumn',
          isRequire: true
        },
        // 英文
        {
          label: 'dictionary.langEN',
          prop: 'enUS',
          compName: 'EditInputColumn',
          isRequire: true
        },
        // 繁体中文
        {
          label: ['dictionary.langTW', 'dictionary.langZH'],
          prop: 'zhTW',
          compName: 'EditInputColumn'
        },

        // 值
        {
          label: 'dictionary.value',
          prop: 'value',
          compName: 'IndexNumberColumn',
          isRequire: true,
          headTip: '大于等于1的整数!'
        },
        // 背景颜色
        {
          label: 'dictionary.bgColor',
          prop: 'color',
          compName: 'ColorSelectColumn',
          width: 120
        },
        // 字体色颜色
        {
          label: 'dictionary.fontColor',
          prop: 'fontColor',
          compName: 'ColorSelectColumn',
          width: 120,
          colorArr: [
            '#333333',
            '#666666',
            '#808080',
            '#AAAAAA',
            '#5A80ED',
            '#EE5E5E',
            '#FCB800',
            '#FC8256',
            '#34C7BE',
            '#A853F2'
          ]
        }
      ]
    };
  },

  computed: {
    getCurStyle() {
      if (this.tempColor && this.tempIcon !== 'icon-jiahao') {
        return `color:${this.tempColor};border: 0 none`;
      }
      return '';
    }
  },

  methods: {
    showIconDialog(notEdit) {
      if (!this.isEdit || notEdit) return;
      this.iconDialog = true;
      this.$nextTick(() => {
        this.$refs.iconDialog.initDialog();
      });
    },
    iconSelected(icon, color) {
      const dicValue = [...this.tableData];
      this.editRow.icon = { icon, color };
      dicValue[this.currentEditIndex] = this.editRow;
      this.$emit('update:tableData', dicValue);
    },
    // 初始化列表信息
    init() {
      this.isAnimate = true;
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
      this.isAnimate = false;
      this.$emit('update:tableData', dicValue);
    },
    // 行被选中时触发
    currentChange(row) {
      if (!this.isEdit) return;
      const index = this.tableData.findIndex(
        (item) => JSON.stringify(item) === JSON.stringify(row)
      );
      if (index !== -1 && index !== this.currentEditIndex) this.handleCurrentChange(row, index);
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
      const base = ['zhCN', 'enUS', 'value'];
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
        const column = this.columnData.find((item) => item.prop === prop);
        if (!cellValue) {
          flag = false;
          // 不能为空
          errorCell = {
            index: checkRow.sno,
            prop,
            errorMsg: `${this.$t('common.notEmpty', {
              name: Array.isArray(column.label)
                ? this.$t(column.label[0], { lang: this.$t(column.label[1]) })
                : this.$t(column.label)
            })}`
          };
        }
        if (
          tableData.findIndex((item, index) => index !== checkIndex && item[prop] === cellValue) !==
          -1
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
        this.isAnimate = false;
        this.$emit('update:tableData', editTable);
      }
    },
    // 添加枚举值
    addDictValue() {
      if (this.verificationDictValue()) {
        const addTable = [...this.tableData];
        const row = { sno: addTable.length + 1, value: addTable.length + 1 };
        addTable.push(row);

        this.editRow = row;
        this.currentEditIndex = addTable.length - 1;
        this.isAnimate = true;
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
      if (newEditIndex !== this.currentEditIndex) this.currentEditIndex = newEditIndex;
      this.isAnimate = true;
      this.$emit('update:tableData', dicValue);
    }
  }
};
</script>
<style lang='scss' scoped>
@import '_v/Dictionary/index.scss';

//右边样式变量
$--name: 'dictValue';
$--headerHeight: 42px;
$--footerHeight: 42px;
$--iconColoe: #aaaaaa;
@include setListLayout($--name, $--headerHeight, $--footerHeight);
.dictValue__main {
  height: calc(100% - 42px);
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
    }
  }
}

$--iconSelect: 28px;
$--iconAddSize: 9px;
.iconSelect {
  position: relative;
  width: $--iconSelect;
  height: $--iconSelect;
  line-height: $--iconSelect;
  border: 1px dashed #d9d9d9;
  background: #ffffff;
  border-radius: 4px;
  text-align: center;
  box-sizing: border-box;
  cursor: pointer;
  will-change: transform;
  .iconfont {
    font-size: $--iconSelect;
  }
  .icon-jiahao {
    font-size: $--iconAddSize !important;
    color: #bbc3cd;
  }
  &:hover:not(.notEdit) {
    border-color: $--color-primary;
    .icon-jiahao {
      color: $--color-primary;
    }
  }
  &.hasDefault:hover:not(.notEdit) {
    .iconSelect__change {
      display: block;
    }
  }
  &__change {
    display: none;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    .icon-qiehuan {
      font-size: 16px !important;
      color: #fff !important;
    }
  }
}
</style>
