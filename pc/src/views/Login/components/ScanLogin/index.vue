<!--
 * @Descripttion: 切换登录功能
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:46:14
-->
<template>
  <div
    class="scanLogin"
    v-on="$listeners"
    @mouseenter="mouseFun(true)"
    @mouseleave="mouseFun(false)"
  >
    <div class="scanLogin__name" :class="mouseState ? 'nameBgnHover' : ''">
      {{ showState ? $t('login.scanCodeLogin') : $t('login.passwordLogin') }}
    </div>
    <!-- icon 图 -->
    <i
      class="iconfont icon-saomadenglu scanLogin__icon"
      v-if="showState"
      :class="mouseState ? 'iconFontHover' : ''"
    ></i>
    <i
      class="iconfont icon-zhanghaodenglu scanLogin__icon"
      v-else
      :class="mouseState ? 'iconFontHover' : ''"
    ></i>
  </div>
</template>

<script>
export default {
  props: {
    showState: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mouseState: false
    };
  },
  methods: {
    mouseFun(state) {
      this.mouseState = state;
    }
  }
};
</script>

<style lang="scss" scoped>
//@import url(); 引入公共css类
.scanLogin {
  display: flex;
  height: $remto32px;
  &__name {
    width: $remto78px;
    line-height: $remto32px;
    background: #f1f3f6;
    margin-right: $remto6px;
    font-size: $remto12px;
    color: #333333;
    position: relative;
    border-radius: $remto5px;
    text-align: center;
  }
  &__name:after {
    width: $remto5px;
    height: $remto5px;
    border-right: $remto1px solid #f1f3f6;
    border-top: $remto1px solid #f1f3f6;
    transform: rotate(45deg);
    position: absolute;
    right: -$remto4px;
    top: $remto14px;
    background: #f1f3f6;
    content: '';
  }
  &__icon {
    font-size: $remto30px;
    color: #7e8a9c;
  }
  .nameBgnHover {
    background: #ebebeb;
  }
  .iconFontHover {
    color: $loginThemeColor !important;
  }
}
</style>
