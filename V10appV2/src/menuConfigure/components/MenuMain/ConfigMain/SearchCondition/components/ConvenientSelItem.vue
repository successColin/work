<!--
 * @Author: sss
 * @Date: 2023-05-25 19:44:23
 * @Last Modified by: sss
 * @Last Modified time: 2023-05-25 19:44:23
 * @Desc: 便捷搜索-下拉框
-->
<template>
  <view
    class="convenientSelItem"
    :class="[isActivited ? `themeColor__bg-font-${getThemeIndex}` : '']"
    @click.stop="handleClick"
  >
    <view>
      {{ showLable }}
      <i
        class="appIcon appIcon-xialasanjiao"
        :class="[
          isActivited ? `isActivited themeColor__font-${getThemeIndex} ` : '',
        ]"
      ></i>
    </view>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    placeholder: String,
    isActivited: Boolean,
    value: Array
  },

  data() {
    return {};
  },

  computed: {
    showLable() {
      const { value, placeholder } = this;
      if (value && value.length > 0) return value[0].name;
      return placeholder;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    handleClick() {
      console.log('handleClick===============');
      this.$emit('click');
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.convenientSelItem {
  position: relative;
  flex-shrink: 0;
  margin-right: 15rpx;
  padding: 13rpx 24rpx 13rpx 43rpx;
  font-size: 28rpx;
  color: #333333;
  background: #f8f8f8;
  border-radius: 100px;

  .appIcon-xialasanjiao {
    margin: 6rpx 0 0 14rpx;
    font-size: 20rpx;
    color: #d9d9d9;
    transition: all 0.2s linear;
  }
  .isActivited {
    transform: rotate(180deg);
  }
  &__content {
    position: absolute;
    left: 0;
    right: 0;
    height: 20px;
    background: #fff;
  }
}
</style>
