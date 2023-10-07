<template>
  <div class="m-fonticon" v-if="icon">
    <i
      class="icon iconfont"
      :style="{
        fontSize: iconSize + 'rpx',
        color: gradient.fontcolor,
        '-webkit-background-clip': gradient.clip,
        '-webkit-text-fill-color': gradient.fill,
        'background-image': gradient.image,
      }"
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
    icon: {
      //文本框图标
      type: String,
      default: '',
    },
    iconSize: {
      //图标大小
      type: Number,
      default: 32,
    },
    iconClass: {
      //icon的样式
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    stack: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    gradient() {
      if (
        this.color &&
        this.color.indexOf(',') !== -1 &&
        this.color.indexOf('rgb') === -1
      ) {
        return {
          clip: 'text',
          fill: 'transparent',
          image: `linear-gradient(180deg,${this.color})`,
        };
      } else {
        return { fontcolor: this.color };
      }
    },
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
.gradient-text-one {
  background-image: linear-gradient(
    180deg,
    rgba(243, 175, 125, 1) 0%,
    rgba(227, 71, 74, 1) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.m-fonticon {
  display: flex;
  align-items: center;
}
</style>

