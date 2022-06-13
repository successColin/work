<!--
 * @Descripttion: 用户列表
 * @Author: ytx
 * @Date: 2022-01-08 09:59:33
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-08 09:59:33
-->
<template>
  <div class="listUser">
    <i
      :class="[
        'appIcon',
        isCollect ? 'appIcon-yishoucang haveCollect' : 'appIcon-shoucang',
      ]"
      @click="handleCollect(obj)"
    ></i>
    <div class="listUser__user">
      <user-icon
        class="listUser__user--icon"
        :userInfo="userInfo"
        :size="68"
      ></user-icon>
      <section>
        <div class="listUser__user--userName font__ellipsis">
          {{ userInfo.username }}
        </div>
        <u-checkbox
          class="listUser__user--checkbox"
          :name="obj.id"
        ></u-checkbox>
      </section>
    </div>
  </div>
</template>

<script>
import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';

export default {
  props: {
    obj: {
      type: Object,
      default: () => {}
    },
    isCollect: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  components: {
    UserIcon
  },
  computed: {
    userInfo() {
      return {
        username: this.obj.username
      };
    }
  },
  watch: {},
  mounted() {},
  methods: {
    handleCollect(v) {
      v.isCollect = !v.isCollect;
    }
  }
};
</script>
<style lang='scss' scoped>
.listUser {
  display: flex;
  padding: 0 30rpx;
  align-items: center;

  height: 120rpx;
  .appIcon {
    margin-right: 30rpx;
    font-size: 34rpx;
    color: #e9e9e9;
  }
  .haveCollect {
    color: #fab71c;
  }
  &__user {
    display: flex;
    border-bottom: 1px solid #e9e9e9;
    align-items: center;
    height: 100%;
    flex: 1;
    &--icon {
      width: 68rpx;
      height: 68rpx;
      margin-right: 35rpx;
    }
    &--userName {
      font-size: 32rpx;
      color: #333333;
      flex: 1;
      width: 10px;
    }
    & > section {
      display: flex;
      flex: 1;
      justify-content: space-between;
    }
  }
}
</style>
