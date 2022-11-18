<!--
 * @Author: sss
 * @Date: 2022-06-14 14:19:45
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-14 14:19:45
 * @Desc: 角色用户
-->
<template>
  <view class="rolesUserModal" :style="showStyle">
    <view class="rolesUserModal__header">
      <!-- #ifndef MP-ALIPAY -->
      <view class="statusBar" :style="{ height: statusHeight }"></view>
      <!-- #endif -->
      <section class="rolesUserModal__top">
        <span class="backBtn" @click.stop="back"
          ><i class="appIcon appIcon-fanhuijiantou"></i>按角色</span
        >
        <span class="roleName">{{ `角色“${role.roleName}”` }}</span>
        <span>{{ `已选择(${checkList.length})` }}</span>
      </section>
      <section class="rolesUserModal__search">
        <apiot-input-search
          ref="pagesSelectUserSearch"
          searchFlag="pagesSelectUserSearch"
          @search="doSearch"
        ></apiot-input-search>
      </section>
    </view>
    <!-- #ifndef MP-ALIPAY -->
    <view class="statusBar" :style="{ height: statusHeight }"></view>
    <!-- #endif -->
    <view class="nav--placeholder" :style="headerStyle"></view>
    <section class="roles__users">
      <users-list mode="data" :list="list"></users-list>
    </section>
  </view>
</template>

<script>
import UsersList from '../../../UsersList';

export default {
  components: { UsersList },

  inject: ['GetSelectUsers'],

  props: {
    users: {
      type: Array,
      default() {
        return [];
      }
    },
    show: {
      type: Boolean,
      default: false
    },
    role: Object
  },

  data() {
    return {
      list: []
    };
  },

  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    statusHeight() {
      return `${this.systemInfo.statusBar}px`;
    },
    headerStyle() {
      const top = this.$apiot.rpx2px(80);
      const topHeight = top + 44; // top、tab、搜索栏
      return { height: `${topHeight}px` };
    },
    // 选中的人员
    checkList() {
      return this.GetSelectUsers();
    },
    showStyle() {
      if (this.show) return {};
      return { display: 'none' };
    }
  },

  watch: {
    users: {
      handler(V) {
        this.doSearch();
      },
      immediate: true
    }
  },

  methods: {
    back() {
      this.$emit('update:show', false);
      this.list = this.users;
      this.$refs.pagesSelectUserSearch.searchParams = {};
    },
    // 搜索
    doSearch(param = {}) {
      const { keyword } = param;
      if (!keyword) this.list = this.users;
      else {
        this.list = this.users.filter((user) => {
          const { username = '', telephone = '', email = '' } = user;
          return (
            username.indexOf(keyword) !== -1 ||
            `${telephone}`.indexOf(keyword) !== -1 ||
            email.indexOf(keyword) !== -1
          );
        });
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.rolesUserModal {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: #fff;
  &__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1001;
  }
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
    .backBtn {
      display: flex;
      align-items: center;
      height: 80rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
      line-height: 80rpx;
      .appIcon {
        font-size: 40rpx;
      }
    }
  }
}
</style>
