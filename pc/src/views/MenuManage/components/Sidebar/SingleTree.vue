<template>
  <el-tree
    ref="tree"
    class="elTree"
    :data="treeData"
    node-key="id"
    @node-drop="handleDrop"
    :allow-drop="allowDrop"
    :allow-drag="allowDrag"
    @node-click="nodeClick"
    draggable
    :props="props"
    :highlight-current="true"
    :lazy="true"
    :load="loadNode"
    :default-expanded-keys="[-1, -2]"
    :filter-node-method="filterNode"
  >
    <div class="custom-tree-node" slot-scope="{ node, data }">
      <TreeNode
        :node="node"
        :data="data"
        v-on="$listeners"
        v-bind="$attrs"
      ></TreeNode>
    </div>
  </el-tree>
</template>

<script>
import { menuList } from '@/api/menuManage';
import TreeNode from './TreeNode.vue';

export default {
  name: '',
  props: {
    treeData: {
      type: Array
    },
    filterIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      props: {
        isLeaf: 'isLeaf'
      },
      dragLevel: 0,
      dragId: 0
    };
  },
  mounted() {},
  components: {
    TreeNode
  },

  methods: {
    getTree() {
      return this.$refs.tree;
    },
    filterNode(value, data) {
      if (this.filterIds.includes(data.id)) {
        return false;
      }
      return true;
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        resolve(this.treeData);
        this.$nextTick(() => {
          this.$refs.tree.filter();
        });
        return;
      }
      if (![-1, -2].includes(node.data.id)) {
        const params = { menuLevel: 1, clientType: 1, parentId: node.data.id };
        const data = await menuList(params);
        data.forEach((item) => {
          if (!item.childCount) {
            item.isLeaf = true;
          } else {
            item.isLeaf = false;
          }
        });
        resolve(data);
        this.$nextTick(() => {
          this.$refs.tree.filter();
        });
      } else {
        resolve(node.data.children);
        this.$nextTick(() => {
          this.$refs.tree.filter();
        });
      }
    },
    nodeClick(data, node) {
      if (data.id === -1 || data.id === -2) {
        return;
      }
      this.$emit('node-click', data, node);
    },
    handleDrop(draggingNode, dropNode, type) {
      console.log(draggingNode, dropNode, type);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (draggingNode.level === dropNode.level && type !== 'inner') {
        return true;
      }
      return false;
    },
    allowDrag(node) {
      console.log(node);
      if (node.data.id < 0 || node.parent.data.id === -1) {
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang='scss' scoped>
.elTree {
  overflow-y: auto;
  width: 100%;
  .custom-tree-node {
    flex: 1;
    width: calc(100% - 24px);
    overflow: hidden;
  }
  ::v-deep {
    .el-tree-node {
      width: 240px;
      max-width: 240px;
    }
    .el-tree-node__content {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      height: 34px;
      &:hover {
        background-color: $--hover-color;
      }
    }
    .el-tree-node__loading-icon {
      position: absolute;
      background-color: #fff;
      margin: 0 0 0 6px;
    }
    .el-tree-node.is-drop-inner > .el-tree-node__content .treeNode__label {
      background-color: #4689f5;
    }
    .el-tree-node > .el-tree-node__content {
      border-left: 3px solid transparent;
    }
    .el-tree-node.is-current > .el-tree-node__content {
      border-left: 3px solid $--color-primary;
      .treeNode__label {
        color: $--color-primary;
      }
    }
    .el-tree-node.is-current > .el-tree-node__content {
      background-color: $--hover-color;
    }
    .el-tree-node__loading-icon {
      background-color: $--hover-color;
    }
  }
}
</style>
