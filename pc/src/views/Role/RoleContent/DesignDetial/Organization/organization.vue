<!-- 页面 -->
<template>
  <div class="orgWrap" v-loading="loading">
    <div class="selectArrWrap" v-if="selectKeys.length && !isSingle">
      <el-tag
        size="small"
        v-for="tag in selectKeys"
        :key="tag.id"
        closable
        @close="handleClose(tag)"
      >
        <i class="iconfont icon-zuzhi"></i>{{ tag.name }}
      </el-tag>
    </div>
    <div class="orgWrapTitleAndSearch">
      <div class="orgWrapTitleAndSearch__title">{{ title }}</div>
      <div class="orgWrapTitleAndSearch__search">
        <!-- <apiot-input
          :placeholder="$t('placeholder.pleaseEnterkeySearch')"
          v-model="input"
          ref="btn"
          @blur="isActive = false"
          @focus="isActive = true"
          @input="reset"
          @keyup.enter.native="doSearch"
        >
          <i
            slot="prefix"
            class="iconfont icon-sousuo"
            :class="isActive ? 'on' : ''"
            @click="doSearch"
          ></i>
        </apiot-input> -->
        <search-input
          @getList="doSearch"
          ref="btn"
          v-model="input"
        ></search-input>
      </div>
    </div>
    <div class="treeWrap">
      <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        :check-on-click-node="true"
        ref="tree"
        :check-strictly="true"
        lazy
        :default-checked-keys="selectKeys.map((item) => item.id)"
        :load="loadNode"
        :expand-on-click-node="true"
        :render-content="renderContent"
        :props="defaultProps"
        @check="checkNode"
      >
      </el-tree>
    </div>
  </div>
</template>

<script>
import { doFetchOrgTree, doFetchDesignOrg, getPostionTree } from '@/api/role';
import { getUserOrgAuth } from '@/api/user';

export default {
  props: {
    isInherit: {
      type: Number,
      default: 0
    },
    selected: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default() {
        return 'org';
      }
    },
    isSingle: {
      type: Boolean,
      default() {
        return false;
      }
    },
    // 当前所属组织id
    curId: {
      type: Number,
      default() {
        return null;
      }
    },
    useInRoleAndUser: {
      // 用于角色和用户，默认不用用
      type: Boolean,
      default() {
        return false;
      }
    },
    functionType: {
      // 用于角色和用户，默认不用用
      type: String,
      default() {
        return 'role';
      }
    },
    menuId: {
      type: Number
    },
    relationId: {
      type: Number
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'childList',
        isLeaf: ({ childrenTotal }) => !childrenTotal
      },
      loading: false,
      treeData: [],
      isActive: false,
      input: '',
      selectKeys: [] // 勾选的数据
    };
  },
  components: {},
  watch: {},
  computed: {
    title() {
      let title = this.$t('role.organizationFiles');
      if (this.type === 'position') {
        title = this.$t('role.positionFile');
      }
      return title;
    }
  },
  mounted() {
    this.selectKeys = JSON.parse(JSON.stringify(this.selected));
    this.getOrgTree({ parentId: 0 });
    if (this.useInRoleAndUser) {
      this.getOrg();
    }
    this.$refs.btn.$el.onkeydown = () => {
      const _key = window.event.keyCode;
      if (_key === 13) {
        return false;
      }
    };
  },
  methods: {
    reset() {
      // 重置
      if (!this.input) {
        this.getOrgTree({ parentId: 0 });
      }
    },
    doCheckTreeNodes(rows) {
      // 勾选树节点，对外使用组件
      this.$refs.tree.setCheckedKeys(rows);
    },
    handleClose({ id }) {
      // 移除标签
      const index = this.selectKeys.findIndex((item) => item.id === id);
      this.selectKeys.splice(index, 1);
      const keys = this.selectKeys.map((item) => item.id);
      this.$refs.tree.setCheckedKeys(keys);
    },
    checkNode(node) {
      // 复选框操作
      const { id } = node;
      const index = this.selectKeys.findIndex((item) => item.id === id);
      if (this.isSingle) {
        if (index === -1) {
          this.selectKeys = [node];
          this.$refs.tree.setCheckedKeys([id]);
        } else {
          this.$refs.tree.setCheckedKeys([]);
          this.selectKeys = [];
        }
        return;
      }
      if (index === -1) {
        this.selectKeys.push(node);
      } else {
        this.selectKeys.splice(index, 1);
      }
    },
    async loadNode(node, resolve) {
      const { data } = node;
      if (node.level === 0) {
        return resolve([]);
      }
      if (this.isSingle && this.curId) {
        if (String(data.id) === String(this.curId)) {
          return resolve([]);
        }
      }
      const api = this.getSearchApi();
      const params = { parentId: data.id };
      const res = await api(params);
      let childs = res;
      // 组织修改父节点，组织本身及子节点不可选择
      if (this.isSingle && this.curId) {
        childs = res.map((item) => {
          let arr = [];
          if (item.rootPath.indexOf('/') !== -1) {
            arr = item.rootPath.split('/');
          } else {
            arr = [item.rootPath];
          }
          const isCur = arr.filter((obj) => String(obj) === String(this.curId));
          if (String(item.id) === String(this.curId) ||
            isCur.length > 0) {
            item.disabled = true;
          }
          return item;
        });
      }
      resolve(childs);
    },
    doSearch() {
      // 模糊查询
      const params = this.input ? { keywords: this.input } : { parentId: 0 };
      this.getOrgTree(params);
    },
    renderContent(h, { node }) {
      const arr = node.label.replace(RegExp(this.input, 'g'), `<span style="color:red;">${this.input}</span>`);
      const dom = `<span>${arr}</span>`;
      const icon = this.type === 'position' ? 'icon-zhiwei' : 'icon-zuzhi';
      return h(
        'span',
        {
          class: 'custom-tree-node'
        },
        [
          h('span', {
            class: `${icon} iconfont`
          }),
          h('span', {
            domProps: {
              innerHTML: dom
            }
          })
        ]
      );
    },
    async getOrg() {
      // 获取设计过的组织
      const api = this.functionType === 'role' ? doFetchDesignOrg : getUserOrgAuth;
      try {
        let params = {
          menuId: this.menuId,
          [this.functionType === 'role' ? 'roleId' : 'userId']: this.relationId
        };
        if (this.functionType !== 'role' && this.isInherit) {
          params = {
            ...params,
            inherit: this.isInherit
          };
        }
        this.selectKeys = await api(params);
      } catch (e) {
        // console.log(e);
      }
    },
    getSearchApi() {
      let api = doFetchOrgTree;
      if (this.type === 'org') {
        api = doFetchOrgTree;
      } else if (this.type === 'position') {
        api = getPostionTree;
      }
      return api;
    },
    async getOrgTree(params) {
      // 获取树
      try {
        this.loading = true;
        const api = this.getSearchApi();
        const res = await api(params);
        let childs = res;
        if (this.isSingle && this.curId) {
          childs = res.map((item) => {
            let arr = [];
            if (item.rootPath.indexOf('/') !== -1) {
              arr = item.rootPath.split('/');
            } else {
              arr = [item.rootPath];
            }
            const isCur = arr.filter((obj) => String(obj) === String(this.curId));
            if (String(item.id) === String(this.curId) ||
              isCur.length > 0) {
              item.disabled = true;
            }
            return item;
          });
        }
        this.treeData = childs;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    }
  },
  beforeDestory() {}
};
</script>

<style lang='scss' scoped>
.orgWrap {
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .selectArrWrap {
    width: 100%;
    margin-top: 7px;
    padding: 6px 10px 0 10px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    overflow-y: auto;
    //flex: 1;
    max-height: 70px;

    .icon-zuzhi {
      margin-right: 2px;
      vertical-align: bottom;
      color: #4789f5;
    }

    .icon-zhiwei {
      margin-right: 2px;
      vertical-align: bottom;
      color: #fc8256;
    }

    ::v-deep {
      .el-tag {
        margin-right: 4px;
        margin-bottom: 6px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        background: #e5f0ff;
        line-height: 24px;
        border: none;
      }

      .el-tag .el-tag__close {
        color: #aaaaaa;
        top: 0;

        &:hover {
          color: #ffffff;
          background: #333333;
          opacity: 0.2;
        }
      }
    }
  }

  .orgWrapTitleAndSearch {
    height: 42px;
    width: 100%;
    flex: 42px 0 0;
    line-height: 42px;
    overflow: hidden;

    .orgWrapTitleAndSearch__title {
      float: left;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }

    .orgWrapTitleAndSearch__search {
      float: right;

      .on {
        color: $--color-primary;
      }

      ::v-deep {
        .el-input__inner {
          width: 98%;
          height: 30px;
          padding-left: 12px;
          font-size: 14px;
          cursor: pointer;
        }

        .el-input__prefix {
          left: auto;
          right: 15px;
          cursor: pointer;
        }
      }
    }
  }

  .treeWrap {
    width: 100%;
    flex: 1;
    height: calc(100% - 81px);
    border-top: 1px solid #e9e9e9;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
    overflow-y: auto;
    box-sizing: border-box;

    ::v-deep {
      .custom-tree-node .iconfont {
        margin-right: 6px;
        font-size: 20px;
        vertical-align: middle;
        color: #4789f5;
      }

      .custom-tree-node .icon-zuzhi {
        color: #4789f5;
      }

      .custom-tree-node .icon-zhiwei {
        color: #fc8256;
      }

      .el-tree-node__content {
        height: 36px;
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
          background: #f1f7ff;
        }
      }
    }
  }
}
</style>
