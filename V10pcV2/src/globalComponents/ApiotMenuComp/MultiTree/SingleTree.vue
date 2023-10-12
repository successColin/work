<template>
  <!-- virtualNodeTree -->
  <el-tree
    ref="tree"
    class="elTree"
    :keeps="50"
    :data.sync="treeData"
    node-key="treeId"
    @node-drag-start="handleDragStart"
    @node-drop="handleDrop"
    @node-click="nodeClick"
    :draggable="configData.showTransfer"
    :props="props"
    :highlight-current="true"
    :lazy="true"
    :load="loadNode"
    :allow-drop="allowDrop"
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
import { listMultiTree, singleSave } from '@/api/menuConfig';
import TreeNode from './TreeNode.vue';

export default {
  name: '',
  props: {
    treeData: {
      type: Array,
    },
    configData: {
      type: Object,
    },
    getIdCompId: {
      type: String,
    },
  },

  data() {
    return {
      props: {
        isLeaf: 'isLeaf',
      },
      dragLevel: 0,
    };
  },
  computed: {
    getMulData() {
      return this.configData.multiDataSource;
    },
  },
  mounted() {},
  components: {
    TreeNode,
  },

  inject: ['getAllForm', 'onlyFlag'],

  methods: {
    getTree() {
      return this.$refs.tree;
    },
    handleDragStart(node) {
      this.dragLevel = node.level;
    },
    async singleSave(draggingNode, dropNode, type) {
      const dragDataType = draggingNode.data.dataType;
      const params = {
        formInfo: [],
        removeFileIds: [],
        tableName: this.getMulData[dragDataType - 1].tableInfo.tableName,
        compMap: JSON.stringify(this.getAllForm()),
        isTree: 1,
        isMove: 1,
      };

      params.formInfo.push({
        columnName: 'id',
        columnValue: draggingNode.data[this.getIdCompId],
        compType: 15,
      });
      const selfColumn =
        this.getMulData[dragDataType - 1].selfLevelColumn.columnName;
      if (type === 'inner') {
        if (dragDataType === dropNode.data.dataType) {
          params.formInfo.push({
            columnName: selfColumn,
            columnValue: dropNode.data[this.getIdCompId],
            compType: 15,
          });
        } else {
          params.formInfo.push({
            columnName: selfColumn,
            columnValue:
              this.getMulData[dragDataType - 1].selfLevelColumn.start,
            compType: 15,
          });
        }
      } else if (dragDataType === dropNode.data.dataType) {
        // 同类型的 直接取相同的自相关字段
        params.formInfo.push({
          columnName: selfColumn,
          columnValue: dropNode.data[selfColumn],
          compType: 15,
        });
      } else {
        //  不同类型的 取初始值
        params.formInfo.push({
          columnName: selfColumn,
          columnValue: this.getMulData[dragDataType - 1].selfLevelColumn.start,
          compType: 15,
        });
      }

      if (dragDataType === '2' || dragDataType === '3') {
        const lastColumn =
          this.getMulData[dragDataType - 1].lastLevelColumn.columnName;
        if (type === 'inner') {
          if (dragDataType === dropNode.data.dataType) {
            params.formInfo.push({
              columnName: lastColumn,
              columnValue:
                dropNode.data[lastColumn] ||
                dropNode.parent.data[this.getIdCompId],
              compType: 15,
            });
          } else {
            params.formInfo.push({
              columnName: lastColumn,
              columnValue: dropNode.data[this.getIdCompId],
              compType: 15,
            });
          }
        } else if (dragDataType === dropNode.data.dataType) {
          params.formInfo.push({
            columnName: lastColumn,
            columnValue:
              dropNode.data[lastColumn] ||
              dropNode.parent.data[this.getIdCompId],
            compType: 15,
          });
        } else {
          params.formInfo.push({
            columnName: lastColumn,
            columnValue: dropNode.data[selfColumn],
            compType: 15,
          });
        }
      }
      // console.log(params);
      await singleSave(params);
      this.$message({
        type: 'success',
        message: '移动成功',
      });
      this.$bus.$emit(
        `reloadArea${this.onlyFlag()}`,
        'current',
        this.configData.compId,
      );
    },
    handleDrop(draggingNode, dropNode, type) {
      if (this.dragLevel !== dropNode.level || type === 'inner') {
        // console.log(draggingNode, dropNode, type);
        this.singleSave(draggingNode, dropNode, type);
      }
    },
    allowDrop(draggingNode, dropNode, type) {
      // console.log(draggingNode.data.dataType, dropNode.data.dataType, type);
      if (this.dragLevel === dropNode.level && type !== 'inner') {
        return false;
      }
      if (draggingNode.data.dataType === '1') {
        if (dropNode.data.dataType === '1') {
          return true;
        }
        if (dropNode.data.dataType === '2') {
          if (
            type !== 'inner' &&
            dropNode.data[this.getMulData[1].selfLevelColumn.columnName] ===
              this.getMulData[1].selfLevelColumn.start
          ) {
            return true;
          }
        }
      }
      if (draggingNode.data.dataType === '2') {
        if (dropNode.data.dataType === '1') {
          if (
            type !== 'inner' &&
            dropNode.data[this.getMulData[0].selfLevelColumn.columnName] ===
              this.getMulData[0].selfLevelColumn.start
          ) {
            return false;
          }
          return true;
        }
        if (dropNode.data.dataType === '2') {
          return true;
        }
        if (dropNode.data.dataType === '3') {
          if (
            type !== 'inner' &&
            dropNode.data[this.getMulData[2].selfLevelColumn.columnName] ===
              this.getMulData[2].selfLevelColumn.start
          ) {
            return true;
          }
        }
        if (draggingNode.data.dataType === '3') {
          if (dropNode.data.dataType === '2') {
            if (
              type !== 'inner' &&
              dropNode.data[this.getMulData[1].selfLevelColumn.columnName] ===
                this.getMulData[1].selfLevelColumn.start
            ) {
              return false;
            }
            return true;
          }
          if (dropNode.data.dataType === '3') {
            return true;
          }
        }
      }
      return false;
    },
    loadNode(node, resolve) {
      if (node.level === 0) {
        resolve(this.treeData);
        return;
      }
      this.$emit('getListParams', node, async (params) => {
        params.nodeInfo = document.getElementById(node.data.treeId).innerText;
        const data = await listMultiTree(params);
        if (data.isMore) {
          this.$message({
            type: 'warning',
            duration: 5000,
            showClose: true,
            message: this.$t('menuConfig.multiTreeTip', {
              any: params.nodeInfo,
            }),
          });
        }
        data.forEach((item) => {
          item.treeId = `${item[this.getIdCompId]}${item.dataType}`;
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
    },
  },
};
</script>

<style lang="scss" scoped>
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
