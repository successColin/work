<!--
 * @Descripttion: 组织管理树列表
 * @version:
 * @Author: tjf
 * @Date: 2021-04-08 13:50:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-28 09:30:17
-->
<!-- treeTable -->
<template>
  <div class="treeTable" @mouseenter="drawer = true">
    <el-table
      :data="curData"
      style="width: 100%; margin-bottom: 20px"
      :height="tableHeight"
      :cell-style="{ padding: '0px' }"
      :row-style="{ height: '36px' }"
      row-key="id"
      border
      highlight-current-row
      @resize="changeHeight"
      v-loading="loading"
      @row-click="rowClick"
      v-on="$listeners"
      v-bind="$attrs"
      lazy
      :load="load"
      ref="orgTree"
      :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }"
    >
      <slot></slot>
      <template v-slot:empty>
        <div class="apiotNoData" placeholder="暂无数据"></div>
      </template>
    </el-table>
  </div>
</template>

<script>
import { debounce } from '@/utils/utils';

export default {
  components: {},
  name: 'treeTable',
  data() {
    return {
      // 选中的组织
      selectRows: [],
      // 选中组织的id
      selectedIds: [],
      // 当前已展开节点
      loadNodeMap: new Map(),
      // 当前map节点父id
      curId: '',
      tableHeight: 300
    };
  },
  props: {
    // 组织列表数据
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    loading: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  mounted() {
    this.changeHeight();
    this.changeHeight = debounce(this.changeHeight);
  },
  methods: {
    // 改变高度
    changeHeight() {
      this.$nextTick(() => {
        if (this.$refs.orgTree) {
          const parent = this.$refs.orgTree.$el.parentNode;
          this.tableHeight = parent.offsetHeight;
          // console.log(parent);
        }
      });
    },
    // 列表行点击选中
    rowClick(row) {
      if (!row.hasChildren) return;
      this.$refs.orgTree.store.loadOrToggle(row);
    },
    // 子节点加载
    load(tree, treeNode, resolve) {
      this.$emit('getTreeChild', { parentId: tree.id }, resolve);
      this.loadNodeMap.set(tree.id, { tree, treeNode, resolve });
    },
    // 更新组织列表对应节点
    updateTable(id, rootPath) {
      // 如果父节点有展开，则刷新父节点
      if (this.loadNodeMap.has(id)) {
        const { resolve } = this.loadNodeMap.get(id);
        this.$emit('getTreeChild', { parentId: id }, resolve);
      } else {
        this.checkHasChild(id, rootPath);
      }
    },
    // 根据id修改该节点是否有子节点状态
    checkHasChild(id, rootPath) {
      if (!rootPath) return;
      // changeChild说明该节点没有子节点,设置节点状态
      const roots = rootPath.split('/');
      const index = roots.findIndex((item) => item === String(id));
      if (index === 0) {
        this.$emit('getTreeChild', { parentId: 0 });
      } else {
        this.updateTable(Number(roots[index - 1]));
      }
    },
    checkChange(type, item) {
      if (item.isChecked) {
        this.selectedIds.push(item.id);
        this.selectRows.push(item);
      } else {
        //  如果之前已经选中，则去除该数据
        this.selectedIds = this.selectedIds.filter((obj) => obj !== item.id);
        this.selectRows = this.selectRows.filter((obj) => obj !== item.id);
      }
    },
    // 根据id重新加载节点数据
    reload(id) {
      this.$set(this.$refs.orgTree.store.states.lazyTreeNodeMap, id, []);
    },
    // 删除之后清空选中数据
    reset() {
      this.selectedIds = [];
      this.selectRows = [];
    },
    setCurrentRow(row) {
      this.$refs.orgTree.setCurrentRow(row);
    }
  },
  computed: {
    // 当前组织列表数据
    curData() {
      return JSON.parse(JSON.stringify(this.tableData));
    }
  }
};
</script>

<style lang='scss' scoped>
.treeTable {
  width: 100%;
  height: 100%;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
  background: #fff;
  ::v-deep {
    .userImage {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .el-table {
      border: 0 !important;
    }
    .el-table__empty-text {
      line-height: 60px;
      width: 50%;
      color: #909399;
      height: 100%;
      max-height: 300px;
    }
    .el-table__header {
      th,
      td {
        height: 40px !important;
        line-height: 40px;
        padding: 0;
        background: #f6f7fb;
        border-top: 1px solid #e9e9e9;
      }
    }
    .el-table__body {
      th,
      td {
        height: 36px !important;
        line-height: 36px;
        padding: 0;
        border-right: none;
      }
    }
    .cell {
      align-items: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      .el-table__expand-icon {
        .el-icon-arrow-right {
          font-family: 'iconfont' !important;
          font-size: 13px;
          color: #333;
          &::before {
            content: '\ea22';
          }
        }
      }
    }
    .edit {
      color: #4689f5;
      cursor: pointer;
    }
    .manage {
      display: inline-flex;
      height: 24px;
      align-items: center;
      background: #f1f3f6;
      border-radius: 12px;
      .imageName {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        color: #fff;
        font-size: 10px;
        text-align: center;
        line-height: 24px;
      }
    }
    .icon-zuzhi {
      font-size: 20px;
    }
  }
}
</style>
