<!-- 页面 -->
<template>
  <div class="listWrap relateData">
    <apiot-table
      dropClass=".relateData"
      :tableData="list"
      row-key="id"
      ref="Tables"
      :select-on-indeterminate="true"
      :showSelection="false"
      :isNeedColumnDrop="false"
      :isAnimate="false"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      v-loadMore="loadMore"
    >
      <el-table-column width="40">
        <template #header slot-scope>
          <el-checkbox
            :value="isCheckAll()"
            :checked="isCheckAll()"
            @change="handleCheckAllChange"
          >
          </el-checkbox>
        </template>
        <template slot-scope="scope">
          <span v-if="scope.row.showIndex && !checkIschecked(scope.row)">{{
            scope.row.index + 1
          }}</span>
          <el-checkbox
            v-else
            :value="!!checkIschecked(scope.row)"
            @change="changeSelected(scope.row, !checkIschecked(scope.row))"
          ></el-checkbox>
        </template>
      </el-table-column>
      <component
        v-for="item in columnArr"
        :key="item.column"
        :is="item.column"
        v-on="$listeners"
        :fileUrl="fileUrl"
        :edit="edit"
        :selectKeys="selectKeys"
      >
      </component>
    </apiot-table>
  </div>
</template>

<script>
import { getShareList } from '@/api/knowledge';

export default {
  props: {
    groupType: {
      type: String,
      default: 'all',
    },
    updateData: {
      type: Function,
      default: () => {},
    },
    edit: {
      type: Boolean,
      default: false,
    },
    selectList: {
      type: Function,
      default: () => {},
    },
    selectKeys: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
    fileUrl: {
      type: Function,
      default: () => {},
    },
    configData: {
      type: Object,
    },
  },
  data() {
    return {
      selected: [],
      checkAll: false,
      editFileName: '',
      columnArr: [],
    };
  },

  components: {},

  computed: {
    renderFileName() {
      return function (name, obj) {
        if (
          obj &&
          name &&
          ((obj.treeType && obj.treeType !== 1) ||
            (obj.sysKlTree &&
              obj.sysKlTree.treeType &&
              obj.sysKlTree.treeType !== 1))
        ) {
          const realNameArr = name.toString().split('.');
          const len = realNameArr.length;
          const newRealName = realNameArr.slice(0, len - 1);
          return newRealName.join('.');
        }
        return name;
      };
    },
    checkIschecked() {
      return function (obj) {
        return this.selectKeys.find((item) => {
          if (item.sysKlTree && obj.sysKlTree) {
            return item.sysKlTree.id === obj.sysKlTree.id;
          }
          return item.id === obj.id;
        });
      };
    },
    isCheckAll() {
      return function () {
        if (!this.selectKeys.length && !this.list.length) return false;
        return this.selectKeys.length === this.list.length;
      };
    },
  },

  mounted() {
    this.initColumn();
  },

  methods: {
    loadMore() {
      this.$emit('loadMore');
    },
    // 初始化列
    initColumn() {
      const arr = this.configData.tableColumn;
      this.columnArr = arr.filter((item) => item.show);
    },
    async updateShare(row) {
      // 修改分享人
      try {
        const shareUserList = await getShareList({
          id: row.id || row.sysKlTree.id,
          userId: this.$store.state.userCenter.userInfo.id,
          keywords: '',
        });
        this.$emit('showShareUserList', {
          row,
          shareUserList: shareUserList || [],
        });
      } catch (e) {
        // console.log(e);
      }
    },
    preView(item) {
      this.$emit('preview', item);
    },
    handleCheckAllChange(e) {
      const list = e ? this.list : [];
      this.checkAll = e;
      this.selectList(list);
      this.updateData('edit', false);
    },
    //  鼠标移入
    cellMouseEnter(row) {
      row.showIndex = false;
    },
    // 鼠标移出
    cellMouseLeave(row) {
      row.showIndex = true;
    },
    handleSelectionChange(row) {
      const newRow = JSON.parse(JSON.stringify(row));
      const arr = [];
      if (row.length) {
        newRow.forEach((item) => {
          const obj = {
            ...item,
            showIndex: false,
          };
          arr.push(obj);
        });
      }
      this.selectList(arr);
      this.updateData('edit', false);
    },
    changeSelected(row) {
      const list = [...this.selectKeys];
      const index = list.findIndex((item) => {
        if (row.sysKlTree && item.sysKlTree) {
          const istrue = item.sysKlTree.id === row.sysKlTree.id;
          return istrue;
        }
        if (!row.sysKlTree && item.sysKlTree) {
          const istrue = item.sysKlTree.id === row.id;
          return istrue;
        }
        if (row.sysKlTree && !item.sysKlTree) {
          const istrue = item.id === row.sysKlTree.id;
          return istrue;
        }
        if (!row.sysKlTree && !item.sysKlTree) {
          const istrue = item.id === row.id;
          return istrue;
        }
        return false;
      });
      if (index === -1) {
        list.push(row);
      } else {
        list.splice(index, 1);
      }
      this.checkAll = this.list.length === list.length;
      this.selectList(list);
      this.updateData('edit', false);
    },
  },
  name: 'ListContent',
};
</script>

<style lang="scss" scoped>
.listWrap {
  height: 100%;
  margin: 0 10px;
  .inputWrap {
    ::v-deep {
      .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
    }
  }
  .listWrap__img {
    margin-right: 14px;
    vertical-align: middle;
    cursor: pointer;

    & + span {
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-table--border .el-table__cell {
      border-right: none;
    }
    .el-table__row > td:first-child {
      border-right: 1px solid #ebeef5;
    }
    .el-table__header .el-table_1_column_1 {
      border-right: 1px solid #ebeef5;
    }
  }
}
</style>
