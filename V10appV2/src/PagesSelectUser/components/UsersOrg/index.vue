<!--
 * @Author: sss
 * @Date: 2022-06-13 10:30:12
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-13 10:30:12
 * @Desc: 按照组织
-->
<template>
  <view class="usersOrg">
    <tree-path :rootPath.sync="rootPath" @click="clickPath"></tree-path>
    <users-list mode="data" :list="listData" :nodeId="parentId">
      <div class="usersOrg__post">
        <common-treenode
          v-for="(post, index) in postData"
          :key="index"
          :value="post"
          prefixIcon="zhiwei"
          prefixIconColor="#FC8256"
          @click="handleClick"
        ></common-treenode>
      </div>
    </users-list>
  </view>
</template>

<script>
import { getOrg } from '@/api/pagesSelectUser.js';
import userMixin from '../userMixin';

import TreePath from '../TreePath';
import UsersList from '../UsersList';
import CommonTreenode from '../CommonTreenode';

export default {
  components: { TreePath, UsersList, CommonTreenode },

  mixins: [userMixin],

  props: {
    users: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      rootPath: [{ nodeName: '首页', rootPath: '' }],
      rootPathStr: '',
      postData: [],
      treeNodes: {},
      parentId: 0,
      refreshOrg: true,
      size: 9999,
      treeNodeUsersNumber: {} // 获取每个树节点人员的个数
    };
  },

  computed: {},

  watch: {
    parentId: {
      handler(newValue) {
        if (this.refreshOrg) this.getOrg(newValue);
      },
      immediate: true
    }
  },

  methods: {
    // 点击路径
    clickPath(node) {
      const { nodeId, nodeName, rootPath } = node;
      if (nodeName === '首页') {
        this.rootPath = [{ nodeName: '首页', rootPath: '' }];
        // eslint-disable-next-line prefer-destructuring
        this.postData = this.treeNodes[0];
        this.listData = [];
        this.treeNodeUsersNumber = {};
      } else {
        this.postData = this.treeNodes[nodeId];
        this.listData = this.treeNodeUsersNumber[nodeId];
      }

      this.refreshOrg = false;
      this.parentId = nodeId || 0;
      this.rootPathStr = rootPath;
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 10
        });
      });
    },
    async getOrg(parentId) {
      try {
        const result = await getOrg({ parentId });
        this.postData = [...result];
        uni.stopPullDownRefresh();
        // 处理树路径对应的数据
        this.treeNodes[parentId] = [...result];
        this.$nextTick(() => {
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 10
          });
        });
      } catch (error) {
        console.error(error);
      }
    },
    async handleClick(node) {
      this.refreshOrg = true;
      const { id: nodeId, name: nodeName = '空', rootPath } = node;
      this.parentId = nodeId;
      this.rootPathStr = rootPath;
      this.rootPath.push({ nodeName, nodeId, rootPath });
      // 请求对应的人员接口
      this.listData = [];

      if (nodeId in this.treeNodeUsersNumber) this.listData = this.treeNodeUsersNumber[nodeId];
      else {
        this.otherParam = {
          searchType: 1,
          rootPath
        };
        await this.getUserList();
        this.treeNodeUsersNumber[nodeId] = [...this.listData];
      }
    },
    async listenOp(params) {
      const { type } = params;
      if (this.parentId === 0) {
        if (type === 'onPullDownRefresh') this.getOrg(0);
        return;
      }

      if (type === 'onPullDownRefresh') {
        this.rootPath = [{ nodeName: '首页', rootPath: '' }];
        this.rootPathStr = '';
        this.refreshOrg = true;
        this.postData = [];
        this.listData = [];
        this.treeNodes = {};
        this.treeNodeUsersNumber = {};
        this.parentId = 0;
      } else if (type === 'userSearch') {
        await this.getUserList();
        this.treeNodeUsersNumber[this.parentId] = [...this.listData];
      } else {
        await this.loadNextUsersList();
        this.treeNodeUsersNumber[this.parentId] = [...this.listData];
      }
    }
  },

  mounted() {
    this.$bus.$on('SelectUser_ORG', this.listenOp);
  },

  beforeDestroy() {
    this.$bus.$off('SelectUser_ORG');
  }
};
</script>

<style lang='scss' scoped>
.usersOrg__post {
  padding: 0 30rpx;
  background: #fff;
}
</style>
