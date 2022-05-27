<!-- 知识库 页面 -->
<template>
  <div class="menuWrap" v-loading="loading">
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
// import { getFunctionList } from '@/api/knowledge';

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
        label: 'menuName',
      }
    };
  },

  components: {},

  computed: {},
  watch: {},

  mounted() {
    // const params = {
    //   menuClientType: 'PC',
    //   keywords: ''
    // };
    // this.fetchFunctionList(params);
    this.fetchFunctionList();
  },

  methods: {
    filterNode(value, data) {
      const { menuLevel } = data;
      if (menuLevel === 1) return true;
      return false;
    },
    renderContent(h, { node }) {
      const { label } = node;
      return (
          <span class="custom-tree-node" title={label}>
          <span class='icon-mokuai iconfont'></span>
          <span class="title">{label}</span>
        </span>
      );
    },
    handleNodeClick(data) {
      this.highLightKey = data.id;
      this.$emit('selectMenu', data);
    },
    reduceList(arr, target = []) {
      arr.forEach((item) => {
        const { menuLevel, children = [] } = item;
        if (menuLevel === 1) {
          const newItem = JSON.parse(JSON.stringify(item));
          newItem.children = [];
          if (Array.isArray(children) && children.length) {
            this.reduceList(children, newItem.children);
          }
          target.push(newItem);
        }
      });
      return target;
    },
    async fetchFunctionList() {
      this.loading = true;
      try {
        this.loading = false;
        // this.list = await getFunctionList(params);
        const menuList = JSON.parse(sessionStorage.vuex).base.routeAuthArr;
        const menuArr = this.reduceList(menuList, []);
        this.list = menuArr;
        this.$nextTick(() => {
          this.highLightKey = this.list.length ? this.list[0].id : null;
          this.$refs.tree.setCurrentKey(this.highLightKey);
          this.$emit('selectMenu', this.list[0]);
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
  width: 100%;
  overflow: auto;

  .treeWrap {
    height: calc(100%);
    overflow: auto;

    ::v-deep {
      .el-icon-caret-right {
        //margin-left: 14px;
        display: block;
      }

      .el-tree-node.is-current > .el-tree-node__content {
        background: #4689F5;
        border-radius: 4px;

        &:after {
          display: block;
        }

        .icon-mokuai {
          color: #ffffff;
        }
        .custom-tree-node span.title {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
        }
      }

      .custom-tree-node {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        .iconfont {
          //margin-left: 24px;
          margin-right: 6px;
          font-size: 20px;
          vertical-align: bottom;
        }

        .icon-mokuai {
          color: #4689F5;
        }

        span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #666666;
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
          border-radius: 4px;
        }
        &:hover .custom-tree-node span.title {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4689F5;
        }
      }
    }
  }
}
</style>
