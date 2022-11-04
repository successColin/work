<!--
 * @Author: sss
 * @Date: 2022-06-10 09:10:58
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 09:10:58
 * @Desc: 选择人员
-->
<template>
  <view class="pagesSelectUser">
    <u-sticky :customNavHeight="customBar">
      <section class="pagesSelectUser__top">
        <span>{{ menuConfig.title }}</span>
        <span>{{ `已选择(${selectUsers.length})` }}</span>
      </section>
      <section class="pagesSelectUser__search">
        <apiot-input-search
          ref="pagesSelectUserSearch"
          searchFlag="pagesSelectUserSearch"
          @search="userSearch"
        ></apiot-input-search>
      </section>
      <section class="pagesSelectUser__tab">
        <p
          v-for="(item, index) in tabArry"
          :key="index"
          @click="changeTab(index)"
        >
          <span
            :class="[
              index === currentIndex
                ? `themeColor__bg-font-${getThemeIndex}`
                : '',
            ]"
            >{{ item.name }}</span
          >
        </p>
      </section>
    </u-sticky>
    <div class="pagesSelectUser__content">
      <users-all v-if="currentTab.type === 'ALL'" :users="listData"></users-all>
      <users-common
        v-else-if="currentTab.type === 'COMMON'"
        :users="collectionUsers"
      ></users-common>
      <users-role
        v-else-if="currentTab.type === 'ROLE'"
        :users="listData"
      ></users-role>
      <users-org
        v-else-if="currentTab.type === 'ORG'"
        :users="listData"
      ></users-org>
      <users-post
        v-else-if="currentTab.type === 'POST'"
        :users="listData"
      ></users-post>
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
import { getUserList, getUserCollection } from '@/api/pagesSelectUser.js';

import UsersAll from './components/UsersAll';
import UsersCommon from './components/UsersCommon';
import UsersRole from './components/UsersRole';
import UsersOrg from './components/UsersOrg';
import UsersPost from './components/UsersPost';

export default {
  components: { UsersAll, UsersCommon, UsersRole, UsersOrg, UsersPost },

  provide() {
    return {
      CollectionUsers: this.getProvideCollectionUsers,
      RefreshCollectionUsers: this.getProvideRefreshCollectionUsers,
      SetOtherParam: this.setProvideOtherParam,
      GetSelectUsers: this.getProvideSelectUsers,
      cancelOrAddSelectUsers: this.cancelOrAddSelectUsers
    };
  },

  props: {},

  data() {
    return {
      rootPath: [{ nodeName: '首页' }],
      // 菜单界面基础配置
      menuConfig: {
        title: '人员' // 名称
      },
      selectUsers: [],
      tabArry: [
        {
          name: '全部',
          type: 'ALL'
        },
        {
          name: '常用',
          type: 'COMMON'
        },
        {
          name: '按角色',
          type: 'ROLE'
        },
        {
          name: '按组织',
          type: 'ORG'
        },
        {
          name: '按职位',
          type: 'POST'
        }
      ],
      currentIndex: 0,
      current: 1,
      size: 20,
      listData: [],
      otherParam: {},
      collectionUsers: [], // 收藏的用户列表
      isMultiple: false // 是否多选
    };
  },

  computed: {
    currentTab() {
      return this.tabArry[this.currentIndex] || {};
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.statusBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  watch: {
    currentTab: {
      handler() {
        if (this.$refs.pagesSelectUserSearch) this.$refs.pagesSelectUserSearch.searchParams = {};
        this.otherParam = {};
        this.getUserList();
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    userSearch(param) {
      this.otherParam.keywords = param.keyword;
      this.getUserList();
      console.log(param);
    },
    // 获取选中的人员
    getProvideSelectUsers() {
      return this.selectUsers;
    },
    // 取消或者选中人员
    cancelOrAddSelectUsers(user, isCancel) {
      const { selectUsers, isMultiple } = this;
      console.log('cancelOrAddSelectUsers');
      if (isCancel) {
        const index = selectUsers.findIndex((item) => item.id === user.id);
        if (index !== -1) this.selectUsers.splice(index, 1);
      } else if (!isCancel) {
        if (isMultiple) this.selectUsers.push(user);
        else this.selectUsers = [user];
      }
    },
    // 刷新收藏列表
    getProvideRefreshCollectionUsers() {
      this.getUserCollection();
    },
    // 获取收藏列表
    getProvideCollectionUsers() {
      return this.collectionUsers;
    },
    // 设置搜索条件
    setProvideOtherParam(param) {
      console.log('setProvideOtherParam====');
      this.otherParam = { ...param };
      this.getUserList();
    },
    // 点击不同类型
    changeTab(index) {
      this.currentIndex = index;
    },
    // 获取收藏的用户
    async getUserCollection() {
      try {
        const result = await getUserCollection();
        this.collectionUsers = result;
      } catch (error) {
        console.error(error);
      }
    },
    async getUserList(loadType = '') {
      try {
        let page = this.current;
        let pageSize = this.size;
        if (loadType === 'loadnext') {
          this.current += 1;
          page = this.current;
        } else if (loadType === 'reload') {
          page = 1;
          pageSize *= page;
        } else {
          this.current = 1;
          page = 1;
        }
        const params = {
          current: page,
          size: pageSize,
          orders: [{ asc: true, column: '' }],
          ...this.otherParam
        };
        const result = await getUserList(params);
        let list = null;
        if (loadType === 'loadnext') {
          list = this.listData.concat(result.records);
        } else {
          this.totalPage = Math.ceil(result.total / pageSize);
          list = result.records;
        }

        this.listData = [...list];
        this.isLoading = false;
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    },
    // 取消
    cancel() {
      uni.navigateBack();
    },
    sure() {
      this.$bus.$emit(this.menuConfig.flag, this.selectUsers);
      uni.navigateBack();
    }
  },

  onLoad(option) {
    if (option.isMultiple === '1') this.isMultiple = true;
    else this.isMultiple = false;

    // 已经选中的用户
    if (option.flag) {
      this.selectUsers = this.$store.state.selectUser.checkUsers[option.flag] || [];
    }
    this.menuConfig = { ...this.menuConfig, ...option };
    this.getUserCollection();
  }
};
</script>

<style lang='scss' scoped>
.pagesSelectUser {
  &__top {
    padding: 0 30rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    font-size: 32rpx;
    @include fontBlob(500);
    color: #333333;
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  }
  &__tab {
    padding: 0 30rpx;
    background: #fff;
    height: 88rpx;
    line-height: 88rpx;

    p {
      margin-right: 23rpx;
      display: inline-block;
      font-size: 28rpx;
      font-family: $--font-family;
      line-height: 36rpx;
      &::after {
        margin-right: 0;
      }
      span {
        display: inline-block;
        padding: 7rpx 20rpx;
        background: #f6f6f8;
        color: #333333;
        border-radius: 33rpx;
      }
    }
  }

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
