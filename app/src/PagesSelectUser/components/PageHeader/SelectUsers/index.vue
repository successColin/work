<!--
 * @Author: sss
 * @Date: 2022-06-10 11:32:21
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-10 11:32:21
 * @Desc: 选中的用户
-->
<template>
  <section class="selectUsers" v-if="show">
    <view class="selectUsers__header">
      <!-- #ifndef MP-ALIPAY -->
      <view class="statusBar" :style="{ height: statusHeight }"></view>
      <!-- #endif -->
      <section class="selectUsers__top">已选择({{ users.length }})</section>
    </view>
    <!-- #ifndef MP-ALIPAY -->
    <view class="statusBar" :style="{ height: statusHeight }"></view>
    <!-- #endif -->
    <view class="nav--placeholder" :style="headerStyle"></view>
    <users-list
      mode="data"
      cardMode="simulation"
      :list="users"
      :canCollection="false"
      @delete="deleteUser"
    ></users-list>
    <footer class="selectUsers__footer">
      <div class="selectUsers__footer--btns">
        <div class="btn cancel" @click="cancel">取消</div>
        <div class="btn sure" @click="sure">确定</div>
      </div>
    </footer>
  </section>
</template>

<script>
import UsersList from '../../UsersList';

export default {
  name: 'selectUsers',

  inject: ['GetSelectUsers', 'changeSelectUsers'],

  components: {
    UsersList
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      users: []
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
      return { height: `${top}px` };
    },
    // 选中的人员
    checkList() {
      return this.GetSelectUsers();
    }
  },

  watch: {
    checkList: {
      handler(V) {
        this.users = [...V];
      },
      immediate: true
    }
  },

  methods: {
    cancel() {
      this.users = [...this.GetSelectUsers()];
      this.$emit('update:show', false);
    },
    sure() {
      this.changeSelectUsers(this.users);
      this.$emit('update:show', false);
    },
    deleteUser(user) {
      this.users = this.users.filter((item) => item.id !== user.id);
    }
  },

  mounted() {},

  created() {}
};
</script>

<style lang='scss' scoped>
.selectUsers {
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
  }
  &__footer {
    height: 88rpx;

    &--btns {
      z-index: 1001;
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
