<template>
  <el-tree
    ref="tree"
    class="elTree"
    :data="treeData"
    node-key="treeId"
    @node-drag-start="handleDragStart"
    @node-drop="handleDrop"
    @node-click="nodeClick"
    :draggable="false"
    :props="props"
    :highlight-current="true"
    :lazy="true"
    :load="loadNode"
    :allow-drop="allowDrop"
    :default-expanded-keys="defaultShowKeys"
  >
    <div class="custom-tree-node" slot-scope="{ node, data }">
      <TreeNode
        :node="node"
        :data="data"
        :configData="configData"
        :getIdCompId="getIdCompId"
        v-on="$listeners"
        v-bind="$attrs"
      ></TreeNode>
    </div>
  </el-tree>
</template>

<script>
import {
  // listDeviceTree,
  listFaultTree,
  singleSave
} from '@/api/menuConfig';
import TreeNode from './TreeNode.vue';

export default {
  name: '',
  props: {
    treeData: {
      type: Array
    },
    configData: {
      type: Object
    },
    getIdCompId: {
      type: String
    }
  },

  data() {
    return {
      props: {
        isLeaf: 'isLeaf'
      },
      dragLevel: 0,
      dragId: 0,
      defaultShowKeys: ['1-G']
    };
  },
  mounted() {},
  components: {
    TreeNode
  },

  inject: ['getAllForm', 'onlyFlag'],

  methods: {
    getTree() {
      return this.$refs.tree;
    },
    handleDragStart(node) {
      this.dragLevel = node.level;
      this.dragId = node.data.id;
    },
    async singleSave(type, draggingNode, dropNode) {
      let tempDropNode = dropNode;
      if (type !== 'inner') {
        tempDropNode = dropNode.parent;
      }
      let formInfo = [];
      if (+draggingNode.data.dataType === 1 && +tempDropNode.data.dataType === 1) {
        formInfo = [
          {
            columnName: 'id',
            columnValue: draggingNode.data.id,
            compType: 15
          },
          {
            columnName: 'parent_id',
            columnValue: tempDropNode.data.id,
            compType: 15
          }
        ];
      }
      if (+draggingNode.data.dataType === 2 && +tempDropNode.data.dataType === 1) {
        formInfo = [
          {
            columnName: 'id',
            columnValue: draggingNode.data.id,
            compType: 15
          },
          {
            columnName: 'parent_id',
            columnValue: 0,
            compType: 15
          },
          {
            columnName: 'position_id',
            columnValue: tempDropNode.data.id,
            compType: 15
          }
        ];
      }
      if (+draggingNode.data.dataType === 2 && +tempDropNode.data.dataType === 2) {
        formInfo = [
          {
            columnName: 'id',
            columnValue: draggingNode.data.id,
            compType: 15
          },
          {
            columnName: 'parent_id',
            columnValue: tempDropNode.data.id,
            compType: 15
          },
          {
            columnName: 'position_id',
            columnValue: tempDropNode.data.positionId,
            compType: 15
          }
        ];
      }
      const params = {
        formInfo: [],
        removeFileIds: [],
        tableName: +draggingNode.data.dataType === 1 ? 'sys_position' : 'sys_device',
        compMap: JSON.stringify(this.getAllForm()),
        isTree: 1,
        isMove: 1
      };
      params.formInfo = formInfo;
      if (formInfo.length) {
        await singleSave(params);
        this.$message({
          type: 'success',
          message: '移动成功'
        });
        this.$bus.$emit('reloadArea', 'current', this.onlyFlag(), this.configData.compId);
      }
    },
    handleDrop(draggingNode, dropNode, type) {
      if (this.dragLevel !== dropNode.level || type === 'inner') {
        this.singleSave(type, draggingNode, dropNode);
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.id === 1 && type !== 'inner') {
        return false;
      }
      if (+draggingNode.data.dataType === 1 && +dropNode.data.dataType === 2) {
        return false;
      }
      return true;
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        resolve(this.treeData);
        return;
      }
      this.$emit('getListParams', node, async (params) => {
        // const data = await listDeviceTree(params);
        const data = await listFaultTree(params);
        data.forEach((item) => {
          item.treeId = `${item.id}-${item.dataType}`;
          if (!item.childCount) {
            item.isLeaf = true;
          } else {
            item.isLeaf = false;
          }
        });
        resolve(data);
      });
    },
    nodeClick(data, node) {
      this.$emit('node-click', data, node);
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
    .el-tree-node__content {
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      height: 32px;
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
