<!-- 页面 -->
<template>
  <div class="treeWrap" v-loading="loading">
    <el-tree
        :data="treeData"
        node-key="rootPath"
        :check-on-click-node=true
        ref="tree"
        :check-strictly=true
        :current-node-key="highLightKey"
        @node-click="checkNode"
        highlight-current
        lazy
        :load="loadNode"
        :expand-on-click-node="true"
        :render-content="renderContent"
        :props="defaultProps"
    >
    </el-tree>
  </div>
</template>

<script>
import { doFetchGroup, getRoleLiistById } from '@/api/role';

export default {
  props: {
    isSearch: {
      type: Boolean,
      default: false,
    },
    isolationSign: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'childList',
        isLeaf: (data) => {
          if (Object.prototype.hasOwnProperty.call(data, 'roleName')) {
            return true;
          }
          const { roleTotal } = data;
          return !roleTotal;
        },
      },
      treeData: [],
      loading: false,
      level: 1,
      highLightKey: null, // 高亮节点
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
    checkNode(data) { // 选中节点
      this.highLightKey = data.id;
      this.$bus.$emit(`selectTreeNode_${this.isolationSign}`, data);
    },
    async loadNode(node, resolve) {
      const { data } = node;
      if (node.level === 0 || node.level === 2) {
        return resolve([]);
      }
      const params = { groupId: data.id };
      const res = await getRoleLiistById(params);
      const newRes = res.map((item) => ({
        ...item,
        rootPath: `${item.groupId}_${item.id}`
      }));
      this.level = 3;
      resolve(newRes);
    },
    renderContent(h, { node }) {
      const {
        level,
        data,
        label,
      } = node;
      let icon = null;
      let name = null;

      if (this.level === 1 && level === 1) {
        icon = 'icon-fenzuchangtai';
        name = label;
      } else if ((this.level === 2 && level === 2)
          || (this.level === 3 && level === 2)
          || (this.level === 2 && level === 1)
      ) {
        icon = 'icon-jiaose';
        name = data.roleName;
      } else if (this.level === 3 && level === 1) {
        icon = 'icon-fenzuchangtai';
        name = label;
      }
      if (this.isSearch) {
        icon = 'icon-jiaose';
        name = data.roleName;
      }
      return (
          <span class="custom-tree-node">
            <span class={`${icon} iconfont`}></span>
            <span title={`${name}`}>{name}</span>
          </span>);
    },
    async getOrgTree(params) { // 获取树
      try {
        this.loading = true;
        const res = await doFetchGroup(params);
        const newRes = res.map((item) => ({
          ...item,
          rootPath: item.id
        }));
        this.treeData = newRes;
        this.level = 1;
        this.$nextTick(() => {
          this.highLightKey = newRes.length ? newRes[0].rootPath : null;
          this.$refs.tree.setCurrentKey(this.highLightKey);
          this.$bus.$emit(`selectTreeNode_${this.isolationSign}`, newRes[0] || {});
        });
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    async getRoleList(params) { // 获取角色列表树
      try {
        this.loading = true;
        const res = await getRoleLiistById(params);
        this.level = 2;
        const newRes = res.map((item) => ({
          ...item,
          rootPath: item.id
        }));
        this.treeData = newRes;
        this.loading = false;
        this.$nextTick(() => {
          this.highLightKey = newRes.length ? newRes[0].rootPath : null;
          this.$refs.tree.setCurrentKey(this.highLightKey);
          this.$bus.$emit(`selectTreeNode_${this.isolationSign}`, newRes[0] || {});
        });
      } catch (e) {
        this.loading = false;
      }
    },
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
    .custom-tree-node{
      width: calc(100% - 32px);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .custom-tree-node .iconfont {
      margin-right: 6px;
      font-size: 20px;
      vertical-align: bottom;
    }

    .el-tree-node {
      &.is-expanded {
        & > .el-tree-node__content {
          & > .custom-tree-node {
            & > .icon-fenzuchangtai:before {
              content: "\ea0e" !important;
            }
          }
        }
      }
    }

    .custom-tree-node .icon-jiaose {
      color: #EE5E5E;
    }

    .custom-tree-node .icon-fenzuchangtai {
      color: #FAB71C;
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
        background: #4689F5;
      }

      &:hover {
        background: $--hover-color;
      }
    }
  }
}
</style>
