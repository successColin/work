<!--
 * @Author: cmk
 * @Date: 2021-04-15 19:38:10
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 09:29:49
 * @Des: 多选弹窗
-->
<template>
  <apiot-dialog
    class="multi"
    :title="$t('entity.selectColumn')"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <div class="multi__search m-b-10">
      <div class="multi__search--left">
        {{ tableName }}
        <!-- (<span
          class="multi__search--left--memo font__ellipsis"
          :title="tableMemo"
          >{{ tableMemo }}</span
        >) -->
      </div>
      <search-input
        @getList="getColumnList"
        v-model.trim="keyWord"
      ></search-input>
    </div>
    <div class="multi__table" v-loading="showLoading">
      <apiot-table
        :tableData="tableData"
        row-key="columnName"
        :dropColumnData="dropColumnData"
        :border="false"
        :lineSelect="true"
        :showRadio="true"
        :currentRadioObj="curFiled"
        @handleChangeRadioObj="handleChangeRadioObj"
        dropClass=".multi__table"
        ref="multiDialogTable"
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
      </apiot-table>
    </div>
  </apiot-dialog>
</template>

<script>
import { listSysEntityColumns } from '@/api/entityManage';

export default {
  inheritAttrs: false,
  props: {
    showFiled: {
      type: Boolean,
      default: false,
    },
    tableName: {
      type: String,
      default: '',
    },
    getFiledArr: {
      type: Array,
    },
  },
  data() {
    return {
      keyWord: '',
      allData: [],
      tableData: [], // 表格结果数据
      dropColumnData: [
        {
          label: 'entity.fieldTable.columnName',
          prop: 'columnName',
          compName: 'ElTableColumn',
        },
        {
          label: 'entity.fieldTable.memo',
          prop: 'memo',
          compName: 'ElTableColumn',
        },
        {
          label: 'entity.fieldTable.columnTypeDict',
          prop: 'columnTypeDict',
          // typesPropArr: fieldTypeDict,
          colorIndex: [1, 2, 3, 4, 5, 4, 4],
          typesPropName: 'COLUMNS_TYPE',
          compName: 'TypesColumn',
        },
      ], // 表格列数据
      showLoading: false,
      tableMemo: '', // 当前表备注
      curFiled: {
        id: '',
        columnName: '',
        columnTypeDict: 1,
        memo: '',
      },
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    async getColumnList() {
      try {
        this.showLoading = true;
        const params = {
          keywords: this.keyWord,
          tableName: this.tableName,
        };
        const data = await listSysEntityColumns(params);
        this.allData = data;
        this.setTableData();
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    },
    setTableData() {
      this.tableData = [];
      this.allData.forEach((data) => {
        if (!this.getFiledArr.includes(data.columnName)) {
          this.tableData.push(data);
        }
      });
      // console.log(this.tableData);
    },
    sureClick() {
      // console.log('按钮点击');
      if (!this.curFiled.columnName) {
        return this.$message.warning('请选择字段');
      }
      this.$emit('fieldSel', this.curFiled);
      this.$emit('update:visible', false);
    },
    handleChangeRadioObj(v) {
      this.curFiled.id = v.id;
      this.curFiled.columnName = v.columnName;
      this.curFiled.columnTypeDict = v.columnTypeDict;
      this.curFiled.memo = v.memo;
    },
  },

  watch: {
    showFiled(v) {
      if (v) {
        this.curFiled = {
          id: '',
          columnName: '',
          columnTypeDict: 1,
          memo: '',
        };
        this.keyWord = '';
        // if (!this.allData.length && this.tableName) {
        this.getColumnList();
        // }
        // if (this.allData.length) {
        //   this.setTableData();
        // }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.multi {
  display: flex;
  flex-direction: column;
  &__search {
    height: 30px;
    line-height: 30px;
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
    flex: 1;
    height: calc(100% - 42px);
    transition: height 0.5s;
    &--height1 {
      height: calc(100% - 42px - 40px);
    }
    &--height2 {
      height: calc(100% - 42px - 80px);
    }
  }
}
</style>
