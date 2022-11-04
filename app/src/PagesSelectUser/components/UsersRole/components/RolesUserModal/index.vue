<!--
 * @Author: sss
 * @Date: 2022-06-14 14:19:45
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-14 14:19:45
 * @Desc: 角色用户
-->
<template>
  <view class="rolesUserModal" :style="showStyle">
    <u-sticky :customNavHeight="customBar">
      <section class="rolesUserModal__top">
        <span class="backBtn" @click.stop="back"
          ><i class="appIcon appIcon-fanhuijiantou"></i>按角色</span
        >
        <span class="roleName">{{ `角色“${role.roleName}”` }}</span>
        <span>{{ `已选择(${checkList.length})` }}</span>
      </section>
      <section class="rolesUserModal__search">
        <apiot-input-search
          searchFlag="pagesSelectUserSearch"
        ></apiot-input-search>
      </section>
    </u-sticky>
    <section class="roles__users">
      <user-card
        v-for="(user, index) in users"
        :key="index"
        :value="user"
      ></user-card>
    </section>
  </view>
</template>

<script>
import UserCard from '../../../UserCard';

export default {
  components: { UserCard },

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
    return {};
  },

  computed: {
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
    // 选中的人员
    checkList() {
      return this.GetSelectUsers();
    },
    showStyle() {
      if (this.show) return {};
      return { display: 'none' };
    }
  },

  methods: {
    back() {
      this.$emit('update:show', false);
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
