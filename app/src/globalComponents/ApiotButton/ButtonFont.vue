<!--
 * @Author: sss
 * @Date: 2022-05-06 14:38:45
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-06 14:38:45
 * @Desc: 字体图标
-->
<template>
  <section class="apiotButtonFont" v-if="iconName" @click.stop="clickBtn">
    <span class="apiotButtonFont__icon" :class="[]">
      <i :class="[suffixName, icon]"></i>
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
  &__icon {
    i {
      font-size: 44rpx;
    }
  }
}
</style>
