<!--
 * @Author: sss
 * @Date: 2022-06-10 09:10:58
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 09:10:58
 * @Desc: 选择人员
-->
<template>
  <view class="pagesSelectUser">
    <page-header
      ref="pageHeader"
      :config="menuConfig"
      :title="menuConfig.title"
      :selectUsers="selectUsers"
      @search="userSearch"
      @changeTab="changeTab"
    ></page-header>
    <div class="pagesSelectUser__content">
      <users-all v-if="currentTab.type === 'ALL'"></users-all>
      <users-common
        ref="userCommon"
        v-else-if="currentTab.type === 'COMMON'"
        mode="data"
        :list="collectionUsers"
      ></users-common>
      <users-role v-else-if="currentTab.type === 'ROLE'"></users-role>
      <users-org v-else-if="currentTab.type === 'ORG'"></users-org>
      <users-post v-else-if="currentTab.type === 'POST'"></users-post>
    </div>

    <footer class="pagesSelectUser__footer">
      <div class="pagesSelectUser__footer--btns">
        <div class="btn cancel" @click="cancel">取消</div>
        <div class="btn sure" @click="sure">确定</div>
      </div>
    </footer>
  </view>
</template>

<script>
import { getUserCollection } from '@/api/pagesSelectUser.js';

import PageHeader from './components/PageHeader';
import UsersAll from './components/UsersAll';
import UsersCommon from './components/UsersCommon';
import UsersRole from './components/UsersRole';
import UsersOrg from './components/UsersOrg';
import UsersPost from './components/UsersPost';

export default {
  components: { PageHeader, UsersAll, UsersCommon, UsersRole, UsersOrg, UsersPost },

  provide() {
    return {
      CollectionUsers: this.getProvideCollectionUsers,
      RefreshCollectionUsers: this.getProvideRefreshCollectionUsers,
      GetSelectUsers: this.getProvideSelectUsers,
      cancelOrAddSelectUsers: this.cancelOrAddSelectUsers,
      GetGlobalParam: this.getGlobalParam,
      changeSelectUsers: this.changeSelectUsers
    };
  },

  props: {},

  data() {
    return {
      rootPath: [{ nodeName: '首页' }],
      // 菜单界面基础配置
      menuConfig: {
        title: '人员', // 名称
        isMultiple: true, // 是否多选
        shouldFav: true, // 是否启用常用收藏
        shouldInOrg: true, // 是否启用按组织选择
        shouldInPost: true, // 是否启用按职位选择
        shouldInRole: true // 是否启用按角色选择
      },
      selectUsers: [],
      globalParam: {},
      collectionUsers: [], // 收藏的用户列表
      currentTab: {
        name: '全部',
        type: 'ALL'
      }
    };
  },

  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    }
  },

  watch: {},

  methods: {
    getGlobalParam() {
      return this.globalParam;
    },
    userSearch(param) {
      this.globalParam.keywords = param.keyword;
      const { type } = this.currentTab;
      if (type === 'ROLE') {
        this.$refs.pageHeader.currentIndex = 0;
        this.changeTab(
          {
            name: '全部',
            type: 'ALL'
          },
          type
        );
      } else {
        this.publishListen({ type: 'userSearch' });
      }
    },
    // 获取选中的人员
    getProvideSelectUsers() {
      return this.selectUsers;
    },
    // 取消或者选中人员
    cancelOrAddSelectUsers(user, isCancel) {
      const { selectUsers, menuConfig } = this;
      const { isMultiple } = menuConfig;
      if (isCancel) {
        const index = selectUsers.findIndex((item) => item.id === user.id);
        if (index !== -1) this.selectUsers.splice(index, 1);
      } else if (!isCancel) {
        if (isMultiple) this.selectUsers.push(user);
        else this.selectUsers = [user];
      }
    },
    // 设置选中的人员
    changeSelectUsers(users) {
      this.selectUsers = [...users];
    },
    // 刷新收藏列表
    getProvideRefreshCollectionUsers() {
      this.getUserCollection();
    },
    // 获取收藏列表
    getProvideCollectionUsers() {
      return this.collectionUsers;
    },
    // 点击不同类型
    changeTab(tab, type) {
      if (type !== 'ROLE') {
        if (this.$refs.pageHeader) this.$refs.pageHeader.clear();
        this.globalParam = {};
      }

      this.currentTab = { ...tab };
    },
    // 获取收藏的用户
    async getUserCollection() {
      try {
        const result = await getUserCollection();
        this.collectionUsers = result;
        uni.stopPullDownRefresh();
      } catch (error) {
        console.error(error);
      }
    },
    // 收藏列表操作
    collectionUsersOp(params) {
      const { type } = params;
      if (type === 'onPullDownRefresh') this.getUserCollection();
      else if (type === 'userSearch') this.$refs.userCommon.doSearch();
    },
    // 取消
    cancel() {
      uni.navigateBack();
    },
    sure() {
      this.$bus.$emit(this.menuConfig.flag, this.selectUsers);
      uni.navigateBack();
    },
    // 触发操作监听
    publishListen(param) {
      const { type } = this.currentTab;
      if (type === 'COMMON') this.collectionUsersOp(param);
      else {
        const name = `SelectUser_${type}`;
        this.$bus.$emit(name, param);
      }
    }
  },

  onLoad(option) {
    let { config } = option;
    if (config) {
      config = JSON.parse(config);
      this.menuConfig = { ...this.menuConfig, ...config };
    }

    // 已经选中的用户
    if (this.menuConfig.flag) {
      this.selectUsers = this.$store.state.selectUser.checkUsers[this.menuConfig.flag] || [];
    }
    this.getUserCollection();
  },

  onReady() {
    // #ifdef APP
    plus.navigator.setStatusBarStyle('dark');
    // #endif
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.publishListen({ type: 'onPullDownRefresh' });
  },
  // 下拉加载更多
  onReachBottom() {
    this.publishListen({ type: 'onReachBottom' });
  }
};
</script>

<style lang='scss' scoped>
.pagesSelectUser {
  &__footer {
    height: 88rpx;

    &--btns {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 19rpx 33rpx;
      display: flex;
      background: #fff;
      z-index: 1001;
      .btn {
        display: inline-block;
        flex: 1;
        height: 72rpx;
        line-height: 72rpx;
        border-radius: 12rpx;
        font-size: 30rpx;
        font-family: $--font-family;
        color: #333333;
        text-align: center;
        &.cancel {
          background: #f1f3f6;
        }
        &.sure {
          margin-left: 24rpx;

          background: #4689f5;
          color: #fff;
        }
      }
    }
  }
}
</style>
