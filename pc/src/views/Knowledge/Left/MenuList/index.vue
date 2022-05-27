<!-- 知识库 页面 -->
<template>
  <div class="menuWrap" v-loading="loading">
    <div class="search">
      <search-input
        :placeholder="$t('knowledge.search_function')"
        style="width: 224px"
        v-model="filterText"
      ></search-input>
    </div>
    <div class="treeWrap">
      <el-tree
        ref="tree"
        :data="list"
        node-key="id"
        :props="defaultProps"
        :expand-on-click-node="true"
        :current-node-key="highLightKey"
        accordion
        highlight-current
        :filter-node-method="filterNode"
        :render-content="renderContent"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </div>
  </div>
</template>
<script>
import { getFunctionList } from '@/api/knowledge';

export default {
  props: {
    isolationSign: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      filterText: '',
      list: [],
      highLightKey: null, // 高亮节点
      loading: false,
      defaultProps: {
        children: 'children',
        label: 'menuName'
      }
    };
  },

  components: {},

  computed: {},
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },

  mounted() {
    const params = {
      menuClientType: 'PC',
      keywords: ''
    };
    this.fetchFunctionList(params);
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.menuName.indexOf(value) !== -1;
    },
    renderContent(h, { node }) {
      const { label, level } = node;
      const iconname = level === 1 ? 'icon-mokuai1' : 'icon-mokuai';
      return (
        <span class="custom-tree-node" title={label}>
          <span class={`${iconname} iconfont`}></span>
          <span>{label}</span>
        </span>
      );
    },
    handleNodeClick(data) {
      this.highLightKey = data.id;
      this.$bus.$emit(`selectMenu_${this.isolationSign}`, data);
    },
    async fetchFunctionList(params) {
      this.loading = true;
      try {
        this.loading = false;
        this.list = await getFunctionList(params);
        this.$nextTick(() => {
          this.highLightKey = this.list.length ? this.list[0].id : null;
          this.$refs.tree.setCurrentKey(this.highLightKey);
          this.$bus.$emit(`selectMenu_${this.isolationSign}`, this.list[0]);
        });
      } catch (e) {
        this.loading = false;
      }
    }
  },
  name: 'Left'
};
</script>

<style lang='scss' scoped>
.menuWrap {
  //width: 100%;
  height: 100%;
  width: 240px;
  overflow: auto;

  .search {
    width: 100%;
    height: 42px;
    padding-top: 6px;
    padding-right: 8px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .treeWrap {
    height: calc(100% - 42px);
    overflow: auto;

    ::v-deep {
      .el-icon-caret-right {
        margin-left: 14px;
        display: none;
      }

      .el-tree-node.is-current > .el-tree-node__content {
        background: $--hover-color;

        &:after {
          display: block;
        }

        .icon-mokuai {
          color: #4689f5;
        }
      }

      .custom-tree-node {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .iconfont {
          margin-left: 24px;
          margin-right: 6px;
          font-size: 20px;
          vertical-align: bottom;
        }

        .icon-mokuai1 {
          color: #fab71c;
        }

        .icon-mokuai {
          color: #bbc3cd;
        }

        span {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
      }

      .el-tree-node__content {
        height: 36px;
        line-height: 36px;
        position: relative;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

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
}
</style>
