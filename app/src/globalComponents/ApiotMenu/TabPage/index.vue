<!--
 * @Author: sss
 * @Date: 2021-12-15 10:17:38
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-15 10:17:38
 * @Desc: tab页动画
-->
<template>
  <u-transition mode="fade" :show="show" :duration="350">
    <view class="transition">
      <slot></slot>
    </view>
  </u-transition>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {
      show: false
    };
  },

  computed: {
    pageStyle() {
      const { windowHeight, customBar } = this.$store.state.base.systemInfo;
      return { height: `${windowHeight - customBar}px` };
    }
  },

  methods: {},

  mounted() {
    const tiemout = setTimeout(() => {
      this.show = true;
      clearTimeout(tiemout);
    }, 0);
  }
};
</script>

<style lang='scss' scoped>
</style>
