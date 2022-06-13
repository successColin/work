<!-- 页面 -->
<template>
  <div class="treeWrap" v-loading="loading">
    <el-tree
      :default-expanded-keys="[-10]"
      ref="tree"
      highlight-current
      lazy
      node-key="id"
      :data="treeData"
      :check-on-click-node="true"
      :check-strictly="true"
      :current-node-key="highLightKey"
      :load="loadNode"
      :expand-on-click-node="true"
      :render-content="renderContent"
      :props="defaultProps"
      @node-click="checkNode"
    >
    </el-tree>
  </div>
</template>

<script>
import { getListSort, getPageTemplate } from '@/api/importTemplate';

export default {
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'childList',
        isLeaf: (data) => {
          const { count } = data;
          return !count;
        }
      },
      treeData: [],
      loading: false,
      level: 1,
      highLightKey: null, // 高亮节点
      detailArr: [],
      checkedKey: [],
      isOne: true
    };
  },
  mounted() {
    this.loading = false;
    this.getTreeList();
  },
  methods: {
    // 获取树
    async getTreeList() {
      try {
        this.loading = true;
        await this.getPageTemplateFun(-10);
        const res = await getListSort();
        res.unshift({
          name: '系统模板',
          id: -10,
          count: this.detailArr.length
        });
        this.treeData = res;
        this.level = 1;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    checkNode(data) {
      if (data.children) {
        // 选中节点
        this.highLightKey = data.id;
        this.$bus.$emit('getTreeDate', data);
      }
    },
    async loadNode(node, resolve) {
      const { data } = node;
      if (node.level === 0 || node.level === 2) {
        return resolve([]);
      }
      await this.getPageTemplateFun(data.id, resolve);
      this.level = 3;
    },
    // 获取详情
    async getPageTemplateFun(id, resolve) {
      const params = { current: 1, size: 9999, parentid: id };
      const res = await getPageTemplate(params);
      const arr = [];
      res.records.forEach((item) => {
        arr.push({
          ...item,
          name: item.templateName,
          children: true
        });
      });
      if (resolve) {
        if (this.isOne) {
          this.$nextTick(() => {
            const arrOne = arr[0];
            this.highLightKey = arr.length ? arrOne.id : null;
            console.log(this.highLightKey);
            this.$refs.tree.setCurrentKey(this.highLightKey);
            this.$bus.$emit('getTreeDate', arrOne);
          });
          this.isOne = false;
        }
        resolve(arr);
      } else {
        this.detailArr = arr;
      }
    },
    // 渲染内容
    renderContent(h, { node }) {
      const { level, label } = node;
      let icon = null;
      if (this.level === 1 && level === 1) {
        icon = 'icon-fenzuchangtai';
      } else if (
        (this.level === 2 && level === 2) ||
        (this.level === 3 && level === 2) ||
        (this.level === 2 && level === 1)
      ) {
        icon = 'icon-chufashijian';
      } else if (this.level === 3 && level === 1) {
        icon = 'icon-fenzuchangtai';
      }
      return (
        <span class="custom-tree-node">
          <span class={`${icon} iconfont`}></span>
          <span title={`${label}`}>{label}</span>
        </span>
      );
    }
  }
};
</script>

<style lang='scss' scoped>
.treeWrap {
  width: 100%;
  height: calc(100% - 20px);
  overflow: auto;
  margin: 10px 0;

  ::v-deep {
    .el-tree {
      height: 100%;
    }
    .custom-tree-node {
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
              content: '\ea0e' !important;
            }
          }
        }
      }
    }

    .custom-tree-node .icon-chufashijian {
      color: #34c7be;
    }

    .custom-tree-node .icon-fenzuchangtai {
      color: #fab71c;
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
  }
}
</style>
