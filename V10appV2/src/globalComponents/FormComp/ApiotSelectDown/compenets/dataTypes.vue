<!--
 * @Author: sss
 * @Date: 2022-03-03 16:37:09
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-03 16:37:09
 * @Desc:
-->
<template>
  <view class="type" :style="typeStyleObj">
    <i
      v-if="mode === 3 && icon && icon.icon"
      class="icon iconfont"
      :class="icon.icon"
      :style="{ color: icon.color, fontSize: '20px' }"
    ></i>
    <span class="name font__ellipsis">{{ value }}</span>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: [Number, String],
    icon: [Object, String],
    fontColor: String,
    color: String,
    mode: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {};
  },

  computed: {
    typeStyleObj() {
      if (this.mode !== 2) return { width: '100%' };
      const obj = {
        background: this.color,
        color: this.fontColor,
        padding: '5rpx 10rpx',
        borderRadius: '100px',
        lineHeight: 'normal'
      };
      return obj;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.type {
  display: inline-flex;
  align-items: center;

  .icon {
    margin-right: 8rpx;
    min-height: 12px;
  }
}
</style>
