<!--
 * @Author: sss
 * @Date: 2022-05-06 14:38:45
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-06 14:38:45
 * @Desc: 字体图标
-->
<template>
  <section class="apiotButtonFont" @click.stop="clickBtn">
    <span class="apiotButtonFont__icon" :class="fontClass">
      <template v-if="iconName">
        <i
          :class="[suffixName, icon]"
          :style="[{ fontSize: `${size}rpx` }]"
        ></i>
      </template>
      <template v-else>
        <slot></slot>
      </template>
    </span>
  </section>
</template>

<script>
export default {
  components: {},

  props: {
    // 按钮的预置样式，default，primary，error，warning，success,secondary
    type: {
      type: String,
      default: 'default'
    },
    iconName: String,
    suffixName: {
      type: String,
      default: 'appIcon'
    },
    isTheme: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 44
    }
  },

  data() {
    return {};
  },

  computed: {
    icon() {
      const { suffixName, iconName } = this;
      if (!iconName) return '';
      return `${suffixName}-${iconName}`;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    fontClass() {
      const { isTheme, getThemeIndex } = this;

      const classArry = [];
      if (isTheme) classArry.push(`themeColor__font-${getThemeIndex}`);
      return classArry;
    }
  },

  methods: {
    clickBtn() {
      this.$emit('click');
      console.log('clickBtn====');
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.apiotButtonFont {
  animation: throttle 100ms step-end forwards;
  &:active {
    animation: none;
  }
}
.apiotButtonFont__icon {
  display: flex;
  align-items: center;
}
@keyframes throttle {
  from {
    pointer-events: none;
  }
  to {
    pointer-events: all;
  }
}
</style>
