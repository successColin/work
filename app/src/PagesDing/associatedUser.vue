<!--
 * @Descripttion: 关联用户
 * @Author: ytx
 * @Date: 2022-06-27 08:44:35
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-27 08:44:35
-->
<template>
  <div class="associatedUser">
    <div class="associatedUser__box">
      <div class="associatedUser__box--dec1">
        <i class="appIcon appIcon-riqi"></i>
        请关联您的账号密码
      </div>
      <div class="associatedUser__box--dec2">
        为了数据同步，首次登录需关联账号和密码！
      </div>
      <mode-account :isAssociatedUser="true" :code="code"></mode-account>
    </div>
  </div>
</template>

<script>
import ModeAccount from '@/Login/components/ModeAccount';

export default {
  data() {
    return {
      code: ''
    };
  },
  components: {
    ModeAccount
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {},
  onLoad(option) {
    this.code = option.code;
  }
};
</script>
<style lang='scss' scoped>
.associatedUser {
  height: 100vh;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.31);
  padding: 0 60rpx;
  &__box {
    background: #fff;
    border-radius: 40rpx;
    margin-top: 300rpx;
    &--dec1 {
      font-size: 36rpx;
      color: #333333;
      padding-top: 74rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 48rpx;
        color: #cc3534;
      }
    }
    &--dec2 {
      padding-top: 16rpx;
      font-size: 24rpx;
      color: #808080;
      text-align: center;
    }
  }
}
</style>
