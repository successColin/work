<!--
 * @Descripttion: 左侧树
 * @Author: ytx
 * @Date: 2023-05-31 14:52:13
 * @Last Modified by: ytx
 * @Last Modified time: 2023-05-31 14:52:13
-->
<template>
  <div class="left__box">
    <search-input
      class="left__box--input"
      @getList="doSearch"
      ref="btn"
      v-model="keyword"
    />
    <el-tree
      ref="tree"
      class="elTree"
      :data="treeData"
      :props="props"
      @node-click="nodeClick"
      node-key="id"
      :highlight-current="true"
      :filter-node-method="filterNode"
      :default-expanded-keys="defaultExpanded"
      :current-node-key="currentNodeKey"
    >
      <div class="custom-tree-node" slot-scope="{ data }">
        <!-- @click="changeCheck" -->
        <div class="treeNode">
          <i
            :class="`iconfont m-r-4 ${getCurDict(data, 1)}`"
            :style="`color:${getCurDict(data, 2)}`"
          ></i>
          <!--  -->
          <div class="treeNode__label" :title="getTreeNodeText(data)">
            {{ getTreeNodeText(data) }}
          </div>
        </div>
      </div>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: {
    treeData: {
      type: Array
    }
  },
  data() {
    return {
      defaultExpanded: [],
      keyword: '',
      props: {
        children: 'children',
        label: 'name'
      },
      currentNodeKey: 0
    };
  },
  watch: {
    treeData(v) {
      const firstChild = v[0]?.children[0];

      this.defaultExpanded = [v[0]?.id];

      if (JSON.stringify(firstChild) !== '{}') {
        this.currentNodeKey = firstChild?.id;
        this.$nextTick(function () {
          this.$refs.tree.setCurrentKey(this.currentNodeKey);
          this.$emit('node-click', firstChild);
        });
      }
    }
  },
  computed: {
    getTreeNodeText() {
      return function (data) {
        const { name, keycode } = data;
        return `${name}-${keycode}`;
      };
    },
    // 获取图标
    getCurDict() {
      return (item, flag) => {
        if (+item.dataType === 1) {
          if (flag === 1) {
            return 'icon-weizhi';
          }
          if (flag === 2) {
            return '#5A80ED';
          }
        } else {
          if (flag === 1) {
            return 'icon-shebei';
          }
          if (flag === 2) {
            return '#34C7BE';
          }
        }
        return '';
      };
    }
  },
  methods: {
    doSearch() {
      this.$refs.tree.filter(this.keyword);
    },
    filterNode(value, data) {
      if (!value) return true;
      const { name, keycode } = data;
      const content = `${name}-${keycode}`;
      return content.indexOf(value) !== -1;
    },
    nodeClick(data, node) {
      this.$emit('node-click', data, node);
      if (data.dataType === 1) {
        this.$refs.tree.setCurrentKey(this.currentNodeKey);
      } else {
        this.currentNodeKey = data.id;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.left__box {
  height: 100%;
  ::v-deep {
    .input__search {
      width: calc(100% - 16px);
      margin: 8px;
    }
  }
}
.elTree {
  height: calc(100% - 50px);
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
.treeNode {
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  line-height: 16px;
  .iconfont {
    font-size: 20px;
  }
}
.treeNode__label {
  width: calc(100% - 20px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
  line-height: 20px;
}
</style>
