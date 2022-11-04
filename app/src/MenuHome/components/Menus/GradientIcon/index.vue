<!--
 * @Author: sss
 * @Date: 2021-09-27 11:28:49
 * @Last Modified by: sss
 * @Last Modified time: 2021-09-27 11:28:49
 * @Desc: 渐变色图标
-->
<template>
  <i
    :class="['iconfont', icon]"
    :style="[
      iconColor,
      { fontSize: `${size}rpx`, width: `${size}rpx`, height: `${size}rpx` },
    ]"
  ></i>
</template>

<script>
export default {
  components: {},

  props: {
    // 图标大小
    size: {
      type: Number,
      default: 40
    },
    // 图标
    icon: {
      type: String,
      default: ''
    },
    // 图标颜色
    color: {
      type: String,
      default: ''
    },
    // 是否需要渐变色
    enableGradient: {
      type: Number,
      default: 0
    },
    // 图标渐变色颜色
    gradientObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  computed: {
    // 渐变色
    iconColor() {
      const { enableGradient, color, gradientObj } = this;
      let obj = {};
      if (!enableGradient) obj.color = color;
      else {
        const colorArry = [];
        if (typeof gradientObj === 'object') {
          Object.keys(gradientObj).forEach((item) => {
            if (Object.prototype.hasOwnProperty.call(gradientObj, item)) {
              colorArry.push(gradientObj[item]);
            }
          });
        } else {
          colorArry.push(gradientObj);
        }
        if (colorArry.length > 1) {
          obj = {
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent',
            'background-image': `linear-gradient(180deg,${colorArry.join(',')})`
          };
        } else {
          obj.color = colorArry.join(',');
        }
      }
      return obj;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>
