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
  height: 32px;
  &__name {
    width: 78px;
    line-height: 32px;
    background: #f1f3f6;
    margin-right: 6px;
    font-size: 12px;
    color: #333333;
    position: relative;
    border-radius: 5px;
    text-align: center;
  }
  &__name:after {
    width: 5px;
    height: 5px;
    border-right: 1px solid #f1f3f6;
    border-top: 1px solid #f1f3f6;
    transform: rotate(45deg);
    position: absolute;
    right: -4px;
    top: 14px;
    background: #f1f3f6;
    content: '';
  }
  &__icon {
    font-size: 30px;
    color: #7e8a9c;
  }
  .nameBgnHover {
    background: #ebebeb;
  }
  .iconFontHover {
    color: $--hover-iconColor !important;
  }
}
</style>
