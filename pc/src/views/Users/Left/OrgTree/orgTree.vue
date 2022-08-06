<!-- 页面 -->
<template>
  <div class="treeWrap" v-loading="loading">
    <el-tree
      :data="treeData"
      node-key="id"
      :check-on-click-node="true"
      ref="tree"
      :check-strictly="true"
      lazy
      :current-node-key="highLightKey"
      @node-click="checkNode"
      :load="loadNode"
      highlight-current
      :expand-on-click-node="true"
      :render-content="renderContent"
      :props="defaultProps"
    >
    </el-tree>
  </div>
</template>

<script>
import { doFetchOrgTree } from '@/api/role';

export default {
  props: {
    isolationSign: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'childList',
        isLeaf: ({ childrenTotal }) => !childrenTotal
      },
      treeData: [],
      loading: false,
      highLightKey: null // 高亮节点
    };
  },
  components: {},

  computed: {},

  mounted() {
    this.loading = false;
    this.getOrgTree({ parentId: 0 });
  },
  watch: {},

  methods: {
    checkNode(data) {
      // 选中节点
      this.highLightKey = data.id;
      this.$bus.$emit(`selectTreeNode_${this.isolationSign}`, data);
    },
    async loadNode(node, resolve) {
      const { data } = node;
      if (node.level === 0) {
        return resolve([]);
      }
      const params = { parentId: data.id };
      const res = await doFetchOrgTree(params);
      resolve(res);
    },
    renderContent(h, { node }) {
      return (
        <span class="custom-tree-node">
          <span class="icon-zuzhi iconfont"></span>
          <span>{node.label}</span>
        </span>
      );
    },
    async getOrgTree(params) {
      // 获取树
      try {
        this.loading = true;
        const res = await doFetchOrgTree(params);
        this.treeData = res;
        this.$nextTick(() => {
          this.highLightKey = res.length ? res[0].id : null;
          this.$refs.tree.setCurrentKey(this.highLightKey);
          this.$bus.$emit(`selectTreeNode_${this.isolationSign}`, res[0] || {});
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
        // console.log(e);
      }
    }
  },
  name: 'List'
};
</script>

<style lang='scss' scoped>
.treeWrap {
  width: 100%;
  height: 100%;
  overflow: auto;

  ::v-deep {
    .custom-tree-node .iconfont {
      margin-right: 6px;
      font-size: 20px;
      vertical-align: middle;
      color: #4789f5;
    }

    .el-icon-caret-right {
      margin-left: 14px;
    }

    .el-tree-node.is-current > .el-tree-node__content {
      background: $--hover-color;

      &:after {
        display: block;
      }
    }

    .el-tree-node__content {
      height: 36px;
      line-height: 36px;
      position: relative;

      &:after {
        content: '';
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        height: 36px;
        width: 3px;
        background: #4689f5;
      }

      &:hover {
        background: $--hover-color;
      }
    }
    .el-tree__empty-block {
      min-height: 300px;
    }
  }
}
</style>
