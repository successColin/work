<!--
 * @Author: sss
 * @Date: 2022-04-06 16:15:28
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-06 16:15:28
 * @Desc: 选择框
-->
<template>
  <section class="box" @click.stop="check">
    <i
      class="box__icon"
      :class="[
        checked
          ? `appIcon appIcon-a-fuxuankuangxuanzhong themeColor__font-${getThemeIndex}`
          : 'nochecked',
      ]"
    ></i>
    <slot></slot>
  </section>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {
      checked: false
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    check() {
      this.checked = !this.checked;
      if (this.checked) this.$emit('checked');
      else this.$emit('unchecked');
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.box {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular, PingFang SC;
  font-size: 28rpx;
  color: #333333;
  width: fit-content;
  margin: 0 auto;
  &__icon {
    padding: 16rpx;
    font-size: 16px;
    &.nochecked {
      &::after {
        content: '';
        display: block;
        width: 14px;
        height: 14px;
        border: 1px solid #d9d9d9;
        border-radius: 3px;
      }
    }
  }
}
</style>
