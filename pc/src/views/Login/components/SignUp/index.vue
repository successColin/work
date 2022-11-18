<!--
 * @Descripttion: 登录主页，下方注册和app下载
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:47:06
-->
<template>
  <div class="signUp">
    <!-- app 下载弹出框 -->
    <div class="signUp__download" v-if="+configs.enableAPPDownload === 1">
      <div class="signUp__downTitle">
        {{ $t('login.downloadAPP') }}
      </div>
      <el-popover placement="bottom" trigger="click">
        <img :src="androidCode" alt="" width="150" height="150" />
        <div slot="reference" class="signUp__download--anzhuo">
          <i class="iconfont icon-anzhuo"></i>
        </div>
      </el-popover>
      <el-popover placement="bottom" trigger="click">
        <img :src="iosCode" alt="" width="150" height="150" />
        <div slot="reference" class="signUp__download--IOS">
          <i class="iconfont icon-IOS"></i>
        </div>
      </el-popover>
    </div>
    <div></div>
    <!-- 还没有账号？立即注册 -->
    <div class="signUp__jump" v-if="+configs.enableRegistration === 1">
      <span>{{ $t('login.noAccountYet') }}</span>
      <span class="signUp__jump--btn loginFontHover" @click="handleJump">
        {{ $t('login.signUpNow') }}
      </span>
    </div>
  </div>
</template>

<script>
import androidCode from '@/assets/img/androidCode.png';
import iosCode from '@/assets/img/iosCode.png';

export default {
  props: {
    configs: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    androidCode() {
      return androidCode;
    },
    iosCode() {
      return iosCode;
    }
  },
  methods: {
    handleJump() {
      this.$router.push('/register');
    }
  }
};
</script>
<style lang='scss' scoped>
.signUp {
  width: 100%;
  display: flex;
  justify-content: space-between;
  &__jump {
    font-size: 13px;
  }
  &__jump--btn {
    // 立即注册按钮
    color: $loginThemeColor;
  }
  // &__jump--btn:hover {
  //   color: darken($loginThemeColor, 90%);
  // }
  &__download {
    &--anzhuo,
    &--IOS {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      i {
        color: #fff;
      }
    }
    &--anzhuo {
      background: #4689f5;
      margin-left: 8px;
    }
    &--IOS {
      background: #34c7be;
      margin-left: 4px;
    }
  }
  &__download,
  &__jump {
    height: 5px;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
  }
  &__downTitle {
    font-size: 13px;
    text-decoration: none;
    // color: $--color-primary;
  }
  :focus {
    outline: 0;
  }
}
</style>
