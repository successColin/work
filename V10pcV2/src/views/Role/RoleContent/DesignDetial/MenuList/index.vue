<!-- 知识库 页面 -->
<template>
  <div class="menuWrap" v-loading="loading">
    <div class="orgWrapTitleAndSearch" v-if="isNeedSearch">
      <search-input
          @getList="doSearch"
          ref="btn"
          v-model="input"
      />
    </div>
    <div class="treeBox" :class="{otherStyles: !isNeedSearch}">
      <div class="treeWrap">
        <el-tree
            ref="tree"
            :data="list"
            node-key="id"
            :props="defaultProps"
            :expand-on-click-node="true"
            :current-node-key="highLightKey"
            accordion
            :check-strictly="true"
            highlight-current
            :default-checked-keys="defaultCheck"
            :show-checkbox="showCheckbox"
            :filter-node-method="filterNode"
            :render-content="renderContent"
            @node-click="handleNodeClick"
        >
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchModules } from '@/api/user';

export default {
  props: {
    isolationSign: {
      type: String,
      default: ''
    },
    showCheckbox: { // 是否显示复选框
      type: Boolean,
      default: false
    },
    isInitCheck: { // 是否初始化选中
      type: Boolean,
      default: true
    },
    isNeedSearch: { // 是否需要查询
      type: Boolean,
      default: false
    },
    disabledId: { // 默认选中并且不让点击
      type: Number,
      default: 0
    },
    defaultCheck: { // 默认勾选中的菜单
      type: Array,
      default() {
        return [];
      }
    },
    activeType: { // 区分app/ pc
      type: String,
      default: 'PCDesign'
    }
  },
  data() {
    return {
      input: '',
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
    if (this.activeType === 'PCDesign') {
      this.fetchFunctionList();
    } else {
      console.log('app');
      this.fetchAppFunction();
    }
  },

  methods: {
    async fetchAppFunction() {
      const res = await fetchModules({ functionDict: 2 });
      this.list = this.reduceList(res, [], 2);
    },
    doSearch() {
      this.$refs.tree.filter(this.input);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.menuName.indexOf(value) !== -1;
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
    getCheckedKeys() { // 获取选中的界面点数据
      return this.$refs.tree.getCheckedKeys();
    },
    reduceList(arr, target = [], type) {
      arr.forEach((item) => {
        const {
          menuLevel,
          children = [],
          id
        } = item;
        if (id === this.disabledId) {
          item.disabled = true;
        }
        if ((menuLevel === 1 && type === 1) || (menuLevel === 2 && type === 2)) {
          const newItem = JSON.parse(JSON.stringify(item));
          newItem.children = [];
          if (Array.isArray(children) && children.length) {
            this.reduceList(children, newItem.children, type);
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
        const menuArr = this.reduceList(menuList, [], 1);
        this.list = menuArr;
        if (this.isInitCheck) {
          this.$nextTick(() => {
            this.highLightKey = this.list.length ? this.list[0].id : null;
            this.$refs.tree.setCurrentKey(this.highLightKey);
            this.$emit('selectMenu', this.list[0]);
          });
        }
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
  overflow: hidden;

  .orgWrapTitleAndSearch {
    height: 42px;
    width: 100%;
    flex: 42px 0 0;
    line-height: 42px;
    overflow: hidden;
  }

  .treeBox {
    width: 100%;
    height: calc(100% - 42px);
    overflow: auto;
    border-top: 1px solid #e9e9e9;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
    box-sizing: border-box;
  }

  .treeBox.otherStyles {
    height: calc(100%);
    border: none;
  }

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
