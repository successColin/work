<!-- 页面 -->
<template>
  <div class="orgWrap" v-loading="loading">
    <div class="selectArrWrap" v-show="selectKeys.length && !isSingle">
      <el-tag
        size="small"
        v-for="tag in selectKeys"
        :key="tag.id"
        closable
        @close="handleClose(tag)"
      >
        <i class="iconfont icon-zhiwei"></i>{{ tag.name }}
      </el-tag>
    </div>
    <div class="orgWrapTitleAndSearch">
      <div class="orgWrapTitleAndSearch__title">
        {{ $t('post.positionFile') }}
      </div>
      <div class="orgWrapTitleAndSearch__search">
        <!-- <el-input
          ref="btn"
          :placeholder="$t('placeholder.pleaseEnterkeySearch')"
          v-model="input"
          @change="doSearch"
          @blur="isActive = false"
          @focus="isActive = true"
          @keyup.enter.native="doSearch"
        >
          <i
            slot="prefix"
            class="iconfont icon-sousuo"
            :class="isActive ? 'on' : ''"
            @click="doSearch"
          ></i>
        </el-input> -->
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
import { getUserPostList } from '@/api/postManage';

export default {
  props: {
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
    posArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      defaultProps: {
        label: 'name',
        children: 'childList',
        isLeaf: 'leaf'
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
  computed: {},
  mounted() {
    this.selectKeys = JSON.parse(JSON.stringify(this.posArr));
    this.getOrgTree({ parentId: 0 });
    this.$refs.btn.$el.onkeydown = () => {
      const _key = window.event.keyCode;
      if (_key === 13) {
        return false;
      }
    };
  },
  methods: {
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
      if (String(data.id) === String(this.curId)) {
        return resolve([]);
      }
      const params = { parentId: data.id };
      const res = await getUserPostList(params);
      let childs = res;
      childs = res.map((item) => {
        if (String(item.id) === String(this.curId) || item.rootPath.indexOf(this.curId) !== -1) {
          item.disabled = true;
        }
        if (item.childrenTotal > 0) {
          item.leaf = false;
        } else {
          item.leaf = true;
        }
        return item;
      });
      resolve(childs);
    },
    doSearch() {
      // 模糊查询
      const params = this.input ? { keywords: this.input } : { parentId: 0 };
      // const params = value ? { keywords: value } : { parentId: 0 };
      this.getOrgTree(params);
    },
    renderContent(h, { node }) {
      const arr = node.label.replace(
        RegExp(this.input, 'g'),
        `<span style="color:red;">${this.input}</span>`
      );
      const dom = `<span>${arr}</span>`;
      return h(
        'span',
        {
          class: 'custom-tree-node'
        },
        [
          h('span', {
            class: 'icon-zhiwei iconfont'
          }),
          h('span', {
            domProps: {
              innerHTML: dom
            }
          })
        ]
      );
      // return (
      //     <span class="custom-tree-node">
      //       <span class="icon-zuzhi iconfont"></span>
      //        <span>{node.label}</span>
      //     </span>);
    },
    async getOrgTree(params) {
      // 获取树
      try {
        this.loading = true;
        const res = await getUserPostList(params);
        let childs = res;
        childs = res.map((item) => {
          if (String(item.id) === String(this.curId) || item.rootPath.indexOf(this.curId) !== -1) {
            item.disabled = true;
          }
          if (item.childrenTotal > 0) {
            item.leaf = false;
          } else {
            item.leaf = true;
          }
          return item;
        });
        this.treeData = childs;
        this.loading = false;
      } catch (e) {
        this.loading = false;
        // console.log(e);
      }
    }
  },
  beforeDestory() {}
};
</script>

<style lang='scss' scoped>
.orgWrap {
  padding: 0 20px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .selectArrWrap {
    width: 100%;
    //height: 38px;
    padding: 6px 10px 0 10px;
    box-sizing: border-box;
    border: 1px solid #e9e9e9;
    overflow-y: auto;
    //flex: 1;
    max-height: 70px;

    .icon-zhiwei {
      margin-right: 2px;
      vertical-align: bottom;
      color: #fc8256;
    }

    ::v-deep {
      .el-tag {
        margin-right: 4px;
        margin-bottom: 6px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        background: #ffede1;
        line-height: 24px;
        border: none;
      }

      .el-tag .el-tag__close {
        color: #aaaaaa;

        &:hover {
          //color: #ffffff;
          //background: #333333;
          //opacity: 0.2;
          color: #6b798d;
          background: none;
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
      font-size: 13px;
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
          font-size: 13px;
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
