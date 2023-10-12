<!--
 * @Author: ytx
 * @Date: 2021-04-15 19:38:10
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-17 09:29:49
 * @Des: 单表批量导入
-->
<template>
  <section class="tableCom">
    <div class="tableCom__search">
      <div class="tableCom__search--left">
        {{ tableName
        }}<span
          class="tableCom__search--left--memo font__ellipsis"
          :title="tableMemo"
          v-show="tableMemo"
          >({{ tableMemo }})</span
        >
      </div>
      <search-input
        @getList="getColumnList"
        v-model.trim="keyWord"
      ></search-input>
    </div>
    <div
      class="tableCom__table"
      :class="[
        { 'tableCom__table--height1': this.currentMultiArr.length > 0 },
        {
          'tableCom__table--height2': isShowOverflow,
        },
        currentClass,
      ]"
    >
      <apiot-table-edit
        :tableData="tableData"
        row-key="id"
        :dropColumnData="dropColumnData"
        :border="false"
        :isNeedColumnDrop="false"
        @change-selectd="changeSelectd"
        @select-all="selectAll"
        :dropClass="`.${currentClass}`"
        :ref="currentClass"
      >
        <component
          v-for="(item, index) in dropColumnData"
          :key="`${item.prop}_${index}`"
          :label="$t(item.label)"
          :prop="item.prop"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          show-overflow-tooltip
          :width="item.width"
          :colorIndex="item.colorIndex"
          :is="dropColumnData[index].compName"
          :typesPropName="item.typesPropName"
        ></component>
      </apiot-table-edit>
    </div>
  </section>
</template>

<script>
import { listSysEntityColumns } from '@/api/entityManage';
// import { batchInsertColoumns } from '@/api/importTemplate';

export default {
  inheritAttrs: false,
  props: {
    // 给过来的值
    giveChildValue: {
      type: Object,
      default: () => {}
    },
    currentMultiArr: {
      type: Array,
      default: () => []
    },
    // 所有选中数据
    selectedArr: {
      type: Array,
      default: () => []
    },
    isShowOverflow: {
      type: Boolean,
      default: false
    },
    currentClass: {
      type: String,
      default: ''
    },
    // 字段表数据
    fieldTableData: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      keyWord: '',
      tableData: [], // 表格结果数据
      dropColumnData: [
        {
          label: 'importTemplate.fieldName',
          prop: 'columnName',
          compName: 'ElTableColumn'
        },
        {
          label: 'importTemplate.annotation',
          prop: 'memo',
          compName: 'ElTableColumn'
        },
        {
          label: 'common.type',
          prop: 'columnTypeDict',
          // typesPropArr: fieldTypeDict,
          colorIndex: [1, 2, 3, 4, 5, 4, 4],
          typesPropName: 'COLUMNS_TYPE',
          compName: 'TypesColumn'
        }
      ], // 表格列数据
      showLoading: false,
      tableName: '', // 当前表名
      tableMemo: '' // 当前表备注
    };
  },

  components: {},

  computed: {},

  mounted() {},

  watch: {
    currentMultiArr: {
      handler(v) {
        console.log(v);
      },
      deep: true
    }
  },

  methods: {
    getTableData(tableName, tableMemo) {
      this.tableName = tableName;
      this.tableMemo = tableMemo;
      this.getColumnList();
    },
    async getColumnList() {
      try {
        this.showLoading = true;
        const params = {
          keywords: this.keyWord,
          tableName: this.tableName
        };
        const data = await listSysEntityColumns(params);
        // this.tableData = data;

        const arr = [];
        data.forEach((item) => {
          if (item.columnName !== 'id') {
            arr.push(item);
          }
        });
        this.tableData = arr;

        this.fieldTableData.forEach((item) => {
          this.tableData.forEach((val) => {
            if (item.coloumnId === val.id) {
              val.isDisable = true;
              val.isChecked = true;
            }
          });
        });
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 多选操作
    changeSelectd(row, checked) {
      // console.log(row, checked);
      if (checked) {
        // console.log('--------------------', this.currentMultiArr);
        const index = this.tableData.findIndex((item) => item.id === row.id);
        if (index !== -1) {
          this.currentMultiArr.push(this.tableData[index]);
          this.$emit('update:currentMultiArr', this.currentMultiArr);
        }
      } else {
        const index = this.currentMultiArr.findIndex(
          (item) =>
            // console.log(item.id, row.id);
            item.id === row.id
        );
        // console.log(index);
        if (index !== -1) {
          // console.log(this.currentMultiArr);
          this.currentMultiArr.splice(index, 1);
          this.$emit('update:currentMultiArr', this.currentMultiArr);
        }
      }
    },
    selectAll(selection) {
      const arr = [];
      selection.forEach((item) => {
        if (!item.isDisable) {
          arr.push(item);
        }
      });
      this.$emit('update:currentMultiArr', arr);
    },
    changeHeight() {
      setTimeout(() => {
        this.$broadcast('changeHeight');
      }, 500);
    },
    setTableRow(row) {
      this.$nextTick(() => {
        this.$refs[this.currentClass].toggleRowSelection(row, false);
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.tableCom {
  display: flex;
  flex-direction: column;
  flex: 1;
  &__search {
    height: 42px;
    line-height: 42px;
    margin: 0 10px;
    &--left {
      float: left;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      &--memo {
        display: inline-block;
        vertical-align: top;
        max-width: 200px;
      }
    }
    &--right {
      position: relative;
      width: 200px;
      float: right;
      ::v-deep {
        .el-input__inner {
          height: 30px;
          padding-left: 12px;
          padding-right: 30px;
        }
        .el-input:focus-within + i.icon-sousuo {
          color: $--color-primary;
        }
      }
      .icon-sousuo {
        position: absolute;
        color: #d9d9d9;
        height: 28px;
        top: 50%;
        transform: translateY(-50%);
        right: 1px;
        width: 29px;
        line-height: 30px;
        cursor: pointer;
      }
    }
  }
  &__table {
    // flex: 1;
    height: calc(100% - 42px);
    transition: height 0.5s;
    &--height1 {
      height: calc(422px - 42px - 40px - 10px);
    }
    &--height2 {
      height: calc(422px - 42px - 80px - 10px);
    }
  }
}
</style>
