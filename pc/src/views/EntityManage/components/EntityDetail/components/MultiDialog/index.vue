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
    :loading.sync="showLoading"
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <div
      class="multi__res"
      v-show="getCurrntMultiArr.length"
      :class="[
        {
          'multi__res--auto': isShowOverflow,
        },
      ]"
    >
      <transition-group name="el-zoom-in-center">
        <apiot-tag
          class="m-l-4 m-t-4"
          @deleteSelf="deleteSelf(item)"
          v-for="item in getCurrntMultiArr"
          :key="item"
          :item="item"
        ></apiot-tag>
      </transition-group>
    </div>

    <div class="multi__search">
      <div class="multi__search--left">
        {{ tableName }}(<span
          class="multi__search--left--memo font__ellipsis"
          :title="tableMemo"
          >{{ tableMemo }}</span
        >)
      </div>
      <search-input @getList="getColumnList" v-model="keyWord"></search-input>
    </div>
    <div
      class="multi__table"
      :class="[
        { 'multi__table--height1': this.getCurrntMultiArr.length > 0 },
        {
          'multi__table--height2': isShowOverflow,
        },
      ]"
    >
      <apiot-table
        :tableData="tableData"
        row-key="columnName"
        :dropColumnData="dropColumnData"
        :border="false"
        @change-selectd="changeSelectd"
        @tableInited="tableInited"
        @select-all="selectAll"
        :lineSelect="true"
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
    multiStr: {
      type: String,
      default: ''
    },
    multiArr: {
      type: Array,
      default() {
        return [];
      }
    },
    multiVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      keyWord: '',
      tableData: [], // 表格结果数据
      dropColumnData: [
        {
          label: 'entity.fieldTable.columnName',
          prop: 'columnName',
          compName: 'ElTableColumn'
        },
        {
          label: 'entity.fieldTable.memo',
          prop: 'memo',
          compName: 'ElTableColumn'
        },
        {
          label: 'entity.fieldTable.columnTypeDict',
          prop: 'columnTypeDict',
          // typesPropArr: fieldTypeDict,
          colorIndex: [1, 2, 3, 4, 5, 4, 4],
          typesPropName: 'COLUMNS_TYPE',
          compName: 'TypesColumn'
        }
      ], // 表格列数据
      currentMulti: '', // 当前多选
      currentMultiArr: [],
      getCurrntMultiArr: [], // 获取当前
      showLoading: false,
      tableName: '', // 当前表名
      tableMemo: '', // 当前表备注
      update: true
    };
  },

  components: {},

  computed: {
    // 计算是否出现滚动条
    // 当条目大于3并且包含的字符大于62个的时候
    // 当条目大于12且包含的字符大于14的时候
    isShowOverflow() {
      const res =
        (this.getCurrntMultiArr.length > 12 && this.getCurrntMultiArr.join('').length > 14) ||
        (this.getCurrntMultiArr.length > 3 && this.getCurrntMultiArr.join('').length > 62);
      return res;
    }
  },

  mounted() {},

  methods: {
    getTableData(tableName, tableMemo, multiStr, multiArr) {
      this.tableName = tableName;
      this.tableMemo = tableMemo;
      this.currentMulti = multiStr;
      this.currentMultiArr = multiArr;
      if (multiStr) {
        this.getCurrntMultiArr = multiStr.split(',');
      } else {
        this.getCurrntMultiArr = [];
      }
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
        this.tableData = data;
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 多选操作
    changeSelectd(row, checked) {
      // console.log(row, checked);
      if (checked) {
        this.getCurrntMultiArr.push(row.columnName);
        this.currentMultiArr.push(row);
      } else {
        const index = this.getCurrntMultiArr.indexOf(row.columnName);
        this.getCurrntMultiArr.splice(index, 1);
        this.currentMultiArr.splice(index, 1);
      }
      this.currentMulti = this.getCurrntMultiArr.join(',');
      setTimeout(() => {
        this.$broadcast('changeHeight');
      }, 200);
    },
    selectAll(selection) {
      const res = selection.length !== 0;
      this.getCurrntMultiArr = [];
      this.currentMultiArr = [];
      if (res) {
        selection.forEach((row) => {
          this.getCurrntMultiArr.push(row.columnName);
        });
        this.currentMultiArr = selection;
      }
      this.currentMulti = this.getCurrntMultiArr.join(',');
      setTimeout(() => {
        this.$broadcast('changeHeight');
      }, 200);
    },
    // 表格初始化完成
    tableInited(data) {
      if (this.getCurrntMultiArr.length) {
        data.forEach((row) => {
          if (this.getCurrntMultiArr.includes(row.columnName)) {
            this.$refs.multiDialogTable.toggleRowSelection(row, true);
          }
        });
      }
    },
    sureClick() {
      // console.log('按钮点击');
      this.$emit('update:multiStr', this.currentMulti);
      this.$emit('update:multiArr', this.currentMultiArr);
      this.$emit('update:visible', false);
    },
    // 删除自己
    deleteSelf(item) {
      const index = this.getCurrntMultiArr.indexOf(item);
      this.getCurrntMultiArr.splice(index, 1);
      this.currentMultiArr.splice(index, 1);
      this.currentMulti = this.getCurrntMultiArr.join(',');
      this.$refs.multiDialogTable.toggleRowSelection(this.tableData[index], false);
    }
  },

  watch: {
    multiVisible(v) {
      if (!v) {
        this.keyWord = '';
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.multi {
  display: flex;
  flex-direction: column;
  &__res {
    box-sizing: border-box;
    max-height: 80px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid #e9e9e9;
    transition: all 0.5s;
    &--auto {
      overflow-y: auto;
      min-height: 80px;
    }
  }
  &__search {
    height: 42px;
    line-height: 42px;
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
