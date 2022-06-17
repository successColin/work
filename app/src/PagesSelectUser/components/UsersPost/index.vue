<!--
 * @Author: sss
 * @Date: 2022-06-13 10:30:12
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-13 10:30:12
 * @Desc: 按照组织
-->
<template>
  <view class="usersPost">
    <apiot-tree-path
      :rootPath.sync="rootPath"
      :offsetTop="offsetTop"
      @click="clickPath"
    ></apiot-tree-path>
    <div class="usersPost__post">
      <common-treenode
        v-for="(post, index) in listData"
        :key="index"
        :value="post"
        prefixIcon="zhiwei"
        prefixIconColor="#FC8256"
        @click="handleClick"
      ></common-treenode>
    </div>
    <section class="usersPost__users" v-if="isPostInit">
      <user-card
        v-for="(user, index) in users"
        :key="index"
        :value="user"
      ></user-card>
    </section>
  </view>
</template>

<script>
import { getPost } from '@/api/pagesSelectUser.js';

import UserCard from '../UserCard';
import CommonTreenode from '../CommonTreenode';

export default {
  components: { UserCard, CommonTreenode },

  inject: ['SetOtherParam'],

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
      rootPath: [],
      rootPathStr: '',
      listData: [],
      treeNodes: {},
      parentId: 0,
      refreshUser: false,
      refreshPost: true,
      isPostInit: false
    };
  },

  computed: {
    offsetTop() {
      const height = this.$apiot.rpx2px(80) + this.$apiot.rpx2px(88);
      return height + 44;
    }
  },

  watch: {
    parentId: {
      handler(newValue) {
        if (this.refreshPost) this.getPost(newValue);
      },
      immediate: true
    }
  },

  methods: {
    // 点击路径
    clickPath(node) {
      const { nodeId, nodeName, rootPath } = node;
      if (nodeName === '首页') {
        this.rootPath = [];
        // eslint-disable-next-line prefer-destructuring
        this.listData = this.treeNodes[0];
      } else this.listData = this.treeNodes[nodeId];
      this.refreshPost = false;
      this.parentId = nodeId || 0;
      this.rootPathStr = rootPath;
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 10
        });
        this.SetOtherParam({ searchType: 2, rootPath: this.rootPathStr });
      });
    },
    async getPost(parentId) {
      try {
        const result = await getPost({ parentId });
        this.listData = [...result];
        // 处理树路径对应的数据
        this.treeNodes[parentId] = [...result];
        this.$nextTick(() => {
          this.isPostInit = true;
          if (this.refreshUser) this.SetOtherParam({ searchType: 2, rootPath: this.rootPathStr });
          this.refreshUser = false;
          uni.pageScrollTo({
            scrollTop: 0,
            duration: 10
          });
        });
      } catch (error) {
        console.error(error);
      }
    },
    handleClick(node) {
      this.refreshPost = true;
      this.refreshUser = true;
      const { id: nodeId, name: nodeName = '空', rootPath } = node;
      this.parentId = nodeId;
      this.rootPathStr = rootPath;
      if (this.rootPath.length === 0) this.rootPath.push({ nodeName: '首页', rootPath: '' });
      this.rootPath.push({ nodeName, nodeId, rootPath });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.usersPost {
  &__post {
    padding: 0 30rpx;
    background: #fff;
  }
}
</style>
