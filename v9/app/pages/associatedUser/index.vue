<!--
 * @Descripttion: 关联用户
 * @Author: ytx
 * @Date: 2022-06-27 14:47:13
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-27 14:47:13
-->
<template>
  <div class="associatedUser">
    <div class="associatedUser__box">
      <div class="associatedUser__box--dec1">
        <i class="iconfont zhengjian_bundle" :style="themeCode"></i>
        请关联您的账号密码
      </div>
      <div class="associatedUser__box--dec2">
        为了数据同步，首次登录需关联账号和密码！
      </div>
      <login-com :isAssociatedUser="true" :code="code"></login-com>
    </div>
  </div>
</template>

<script>
import LoginCom from '@/pages/login/login.vue';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      code: '',
    };
  },
  components: { LoginCom },
  computed: {
    ...mapState(['themeColorCode']),
    themeCode() {
      return this.themeColorCode ? `color: ${this.themeColorCode}` : '';
    },
  },
  watch: {},
  mounted() {},
  methods: {},
  onLoad(option) {
    this.code = option.code;
  },
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
    overflow: hidden;
    &--dec1 {
      font-size: 36rpx;
      color: #333333;
      padding-top: 74rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        font-size: 48rpx;
        margin-right: 8px;
      }
    }
    &--dec2 {
      padding-top: 16rpx;
      font-size: 24rpx;
      color: #808080;
      text-align: center;
    }
  }
  ::v-deep {
    .loginMenu__footer--btn {
      padding: 60rpx 0 80rpx 0;
      width: 100%;
    }
    .loginMenu__center {
      padding-top: 60rpx;
    }
  }
}
</style>
