<!--
 * @Author: sss
 * @Date: 2022-03-16 09:50:04
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-16 09:50:04
 * @Desc: 小弹出框-用于下拉等控件
-->
<template>
  <u-popup
    :show="value"
    mode="bottom"
    @close="closePopup"
    :closeOnClickOverlay="true"
    bgColor="#F6F6F8"
  >
    <slot></slot>
    <footer class="pop__footer">
      <apiot-button
        :custom-style="{
          width: '100%',
          border: 'none',
          borderRadius: 'none',
        }"
        :hairline="false"
        @click="closePopup"
        >取消</apiot-button
      >
    </footer>
  </u-popup>
</template>

<script>
export default {
  components: {},

  props: {
    value: { type: Boolean, default: false }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    closePopup() {
      this.$emit('input', false);
      this.$emit('closePopup');
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.pop__footer {
  margin-top: 20rpx;
}
</style>
