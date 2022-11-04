<!--
 * @Author: sss
 * @Date: 2021-09-09 13:51:44
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-09 13:51:44
 * @Desc: 忘记密码-重置密码成功
-->
<template>
  <view class="resetSuccess">
    <span class="resetSuccess__title"
      >{{ $t('common.success', { name: $t('loginForgot.reset') }) }}
    </span>
    <span class="resetSuccess__subtitle">
      信息保护中，请放心您提交的基本信息！
    </span>
    <u-image
      class="resetSuccess__icon"
      src="~@/static/img/login_images/resetSuccess.svg"
      :lazy-load="false"
      :fade="false"
      :width="240"
      :height="240"
      mode="heightFix"
      loading-icon="false"
    ></u-image>
    <div class="btn">
      <apiot-button type="primary" shape="circle" @click="finish">{{
        $t('loginForgot.backLogin')
      }}</apiot-button>
    </div>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    verificationResult: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    finish() {
      uni.reLaunch({ url: '/pages/index/index' });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import '../VerificationType/index.scss';

$--name: 'resetSuccess';
$--formName: 'resetSuccessForm';
@include setVerife($--name, $--formName);
.resetSuccess {
  &__title {
    text-align: center;
  }
  &__icon {
    margin: 68rpx auto 0 auto;
  }
}
</style>
