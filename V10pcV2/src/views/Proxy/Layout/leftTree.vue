/**
* @name: leftTree
* @author: DELL
* @date: 2023/2/18 15:02
* @description：leftTree
* @update: 2023/2/18 15:02
*/
<!-- 页面 -->
<template>
  <div class="left" v-loading="loading">
    <div class="left__add">
      <el-popover
          placement="bottom"
          width="200"
          trigger="click"
          v-model="showPopo"
          @hide="doAfterHide"
      >
        <apiot-input
            v-model.trim="input"
            :placeholder="
            $t('placeholder.pleaseEnterAnyName', {
              any: $t('entity.group'),
            })
          "
            class="left__add--input"
            maxlength="30"
        ></apiot-input>
        <div class="left__add--btns">
          <apiot-button @click="doAfterHide" class="left__add--btn">{{
              $t('common.cancle')
            }}</apiot-button>
          <apiot-button
              type="primary"
              @click="doAddGroup"
              class="left__add--btn"
          >{{ $t('common.sure') }}</apiot-button
          >
        </div>
        <apiot-button slot="reference" class="left__add--target">
          <i class="iconfont icon-xinzengwenjianjia m-r-6"></i
          >{{ $t('common.add', { name: $t('entity.group') }) }}
        </apiot-button>
      </el-popover>
    </div>
    <div class="left__search">
      <search-input
          placeholder="请输入关键字查询"
          @getList="doSearch"
          v-model.trim="keyWord"
      ></search-input>
    </div>
    <div class="left__tree">
      <el-tree
          :data="data"
          node-key="identify"
          ref="tree"
          @node-click="nodeClick"
          :filter-node-method="filterNode"
          :default-expanded-keys="defaultExpandedKeys"
          :props="{  children: 'childList',
          label: 'name'}"
      >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span class="iconfont m-r-4" :class="getNodeLeaf(data, node)"></span>
        <span class="custom-tree-label">{{ data.name }}</span>
        <span class="custom-tree-buttons">
          <el-dropdown
              trigger="click"
              ref="dropdown"
              @command="handleCommand"
              placement="bottom"
              :tabindex="-1"
              v-if="checkIsGroup(data)"
          >
                <i class="iconfont icon-gengduocaozuo"
                   @click.stop.prevent v-if="checkIsGroup(data)"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ type: 'addGroup', item: data }">
                    新增子分组
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'editGroup', item: data }">{{
                      $t('entity.changeGroupName')
                    }}</el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'addApi', item: data }">
                    新增代理接口
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'del', item: data }">{{
                      $t('common.delete', { name: $t('entity.group') })
                    }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
        </span>
      </div>
      </el-tree>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { getInitTree, addTreeGroup, delTreeGroup } from '@/api/proxy';

const defaultConfig = {
  confirmButtonText: '确定',
  cancelButtonText: '取消',
  inputErrorMessage: '请输入分组名称!',
  inputPattern: /^.+$/,
  customClass: 'customClass__prompt',
  closeOnHashChange: false
};

export default {
  data() {
    return {
      defaultExpandedKeys: [], // 默认展开的节点
      loading: false,
      input: '',
      keyWord: '', // 模糊查询
      showPopo: false,
      oConfig: {}, // 新增分组什么删除的
      data: []
    };
  },

  components: {},

  computed: {
    checkIsGroup() {
      return function (data) {
        return data.type === 1;
      };
    },
    getNodeLeaf() {
      return function (data, { expanded }) {
        const icon = expanded ? 'icon-fenzuzhankai' : 'icon-fenzuchangtai';
        return {
          [this.checkIsGroup(data) ? icon : 'icon-dailijiekou']: true
        };
      };
    }
  },

  mounted() {
    this.init();
    // this.$bus.$off('api_change_config').$on('api_change_config', () => {
    //   this.init();
    // });
    this.$bus.$off('api_tree_change').$on('api_tree_change', async (message) => {
      await this.init();
      this.keyWord = '';
      this.$nextTick(() => {
        this.initSelectNode(message);
      });
    });
    this.$bus.$off('del_api_node').$on('del_api_node', async (message) => {
      await this.upLevel(message.id);
      this.$refs.tree.remove(message);
    });
  },

  methods: {
    filterNode(value, data) {
      if (value && data.name.indexOf(value) === -1) {
        return false;
      }
      return true;
    },
    nodeClick(data) {
      this.$bus.$emit('proxyNodeClick', data);
    },
    setCurrentKey(key) { // 设置选中的节点
      this.$refs.tree.setCurrentKey(key);
    },
    async init() {
      this.loading = true;
      const res = await getInitTree();
      this.data = res;
      const key = res[0]?.identify || '';
      this.$nextTick(() => {
        this.setCurrentKey(key);
        this.defaultExpandedKeys = key ? [key] : [];
        this.$bus.$emit('proxyNodeClick', res[0] || {});
      });
      this.loading = false;
    },
    doSearch() {
      this.$refs.tree.filter(this.keyWord);
    },
    handleCommand(config) {
      const { type, item: { id, name } } = config;
      if (type === 'addGroup') {
        const params = { parentId: id };
        this.makeGroup('新增子分组', params, defaultConfig);
      }
      if (type === 'editGroup') {
        const options = {
          ...defaultConfig,
          inputValue: name
        };
        const params = { id };
        this.makeGroup('编辑分组', params, options);
      }
      if (type === 'del') {
        this.$confirm(`此操作将删除${name}该分组, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await delTreeGroup({ groupId: id });
          await this.upLevel(id);
          this.$refs.tree.remove(config.item);
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        });
      }
      if (type === 'addApi') {
        this.$bus.$emit('proxyNodeClick', { type: 2, groupId: id || '' });
      }
    },
    async upLevel(id) { // 返回上层
      const res = this.getNode(JSON.parse(JSON.stringify(this.data)), id);
      if (JSON.stringify(res) === '{}') {
        await this.init();
      } else {
        this.setCurrentKey(res.identify);
        this.defaultExpandedKeys = res.identify ? [res.identify] : [];
        this.$bus.$emit('proxyNodeClick', res || {});
      }
    },
    getNode(arr, id) {
      let result = {};
      const findNode = (a = [], tid) => {
        for (let i = 0; i < a.length; i += 1) {
          const item = a[i] || {};
          const { childList } = item;
          if (childList && Array.isArray(childList) && childList.length) {
            if (childList.some((c) => c.id === tid)) {
              result = item;
              break;
            } else {
              findNode(childList, tid);
            }
          }
        }
      };
      findNode(arr, id);
      return result;
    },
    makeGroup(title, params, options) {
      this.$prompt('分组名称', title, {
        ...options,
      }).then(async ({ value }) => {
        const res = await this.commonCheckGroup({ name: value, ...params });
        await this.init();
        this.$nextTick(() => {
          this.initSelectNode(res);
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    doAfterHide() {
      // 输入框值清空值
      this.input = '';
      this.showPopo = false;
    },
    // 新增操作
    async doAddGroup() {
      if (!this.input) {
        return this.$message({
          type: 'warning',
          message: this.$t('common.notEmpty', {
            name: this.$t('common.name', { name: this.$t('entity.group') })
          })
        });
      }
      this.transitionName = 'move-right';
      const params = { parentId: 0, name: this.input };
      const res = await this.commonCheckGroup(params);
      this.doAfterHide();
      await this.init();
      this.$nextTick(() => {
        this.initSelectNode(res);
      });
    },
    async commonCheckGroup(params) { // 通用操作分组
      this.loading = true;
      const res = await addTreeGroup(params);
      return res;
    },
    initSelectNode(res) { // 重新设置数据
      this.setCurrentKey(res);
      this.defaultExpandedKeys = res ? [res] : [];
      const data = this.$refs.tree.getCurrentNode();
      this.$bus.$emit('proxyNodeClick', data || {});
    }
  },
  beforeDestroy() {
    this.$bus.$off('api_tree_change');
    this.$bus.$off('del_api_node');
  },
  name: 'leftTree',
};
</script>

<style lang='scss' scoped>
.left {
  width: 100%;
  height: 100%;
  &__add {
    flex: 0 0 42px;
    box-sizing: border-box;
    padding: 6px 8px;
    &--input {
      ::v-deep {
        .el-input__inner {
          height: 32px;
          line-height: 32px;
          width: 100%;
          padding: 0 50px 0 12px;
        }
      }
    }
    &--btns {
      margin-top: 10px;
      display: flex;
      justify-content: space-evenly;
    }
    &--btn {
      width: 96px;
    }
    &--target {
      width: 100%;
      .iconfont {
        color: $--color-primary;
      }
    }
  }
  &__search {
    position: relative;
    margin: 0 auto 6px auto;
    width: 224px;
    text-align: center;
    overflow: hidden;

    ::v-deep {
      .el-input__inner {
        height: 30px;
        padding-left: 12px;
        padding-right: 30px;
      }
      .input__search {
        width: 100%;
      }

      .el-input:focus-within + i.icon-sousuo {
        color: $--color-primary;
      }
    }

    .icon-sousuo {
      position: absolute;
      color: #d9d9d9;
      height: 28px;
      top: 50%;
      transform: translateY(-50%);
      right: 1px;
      width: 29px;
      line-height: 30px;
      cursor: pointer;
    }
  }
  &__tree {
    width: 100%;
    height: calc(100% - 42px - 36px);
    overflow-y: auto;
    overflow-x: hidden;
    .custom-tree-node {
      width: 100%;
      flex: 1;
      display: flex;
    }
    .icon-fenzuchangtai, .icon-fenzuzhankai {
      color: #FAB71C;
      vertical-align: bottom;
    }
    .icon-dailijiekou {
      color: #5A80ED;
      vertical-align: bottom;
    }
    .custom-tree-label {
      display: inline-block;
      width: calc(100% - 24px - 50px);
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .custom-tree-buttons {
      position: absolute;
      right: 8px;
      display: none;
      .icon-gengduocaozuo {
        color: $--color-primary;
      }
    }
    ::v-deep {

      .el-tree-node.is-current > .el-tree-node__content {
        background: $--hover-color;

        &:after {
          display: block;
        }
        .custom-tree-buttons{
          display: block;
          top: 0;
        }
      }
      .el-icon-caret-right {
        margin-left: 14px;
      }
      .el-tree-node {
        max-width: 240px;
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
        &:hover .custom-tree-buttons{
          display: block;
          top: 0;
        }
      }
    }

  }
}
</style>
