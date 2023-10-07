<template>
  <div class="m-fonticon" v-if="icon">
    <i
      class="icon iconfont"
      :style="{ fontSize: iconSize + 'rpx', color: color }"
      :class="[icon, iconClass]"
      @click="onClick()"
    >
      <slot></slot>
    </i>
  </div>
</template>

<script>
export default {
  props: {
    icon: String, //文本框图标
    iconSize: {
      //图标大小
      type: Number,
      default: 32,
    },
    iconClass: String, //icon的样式
    color: String,
  },
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
};
</script>
<style>
.icon {
  width: 100%;
}
</style>

