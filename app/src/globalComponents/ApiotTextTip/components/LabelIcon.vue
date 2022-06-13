<!--
 * @Author: sss
 * @Date: 2021-12-17 16:37:40
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-17 16:37:40
 * @Desc: 图标
-->
<template>
  <view class="labelIcon" :class="{ imgIcon: isImg }">
    <i
      v-if="!isImg"
      :class="[iconName]"
      :style="{ color: color, fontSize: `${size}px` }"
    ></i>
    <u-image
      v-else
      :src="iconName"
      :width="size"
      height="100%"
      mode="widthFix"
      :lazyLoad="true"
      :fade="false"
    ></u-image>
  </view>
</template>

<script>
export default {
  name: 'icon',
  components: {},

  props: {
    // 图标名称
    name: String,
    // 前缀
    customPrefix: {
      type: String,
      default: 'iconfont'
    },
    // 颜色
    color: String,
    size: [String, Number]
  },

  data() {
    return {};
  },

  computed: {
    // 是否为字体图标
    isImg() {
      return this.name.indexOf('/') !== -1;
    },
    iconName() {
      const { customPrefix, name, isImg } = this;
      if (isImg) return name;
      return `${customPrefix} ${name}`;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.labelIcon {
  display: inline-block;
  &.imgIcon {
    vertical-align: -6rpx;
  }
}
</style>
