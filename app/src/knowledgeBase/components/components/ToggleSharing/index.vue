<!--
 * @Descripttion: 切换分享
 * @Author: ytx
 * @Date: 2022-05-30 11:47:29
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-30 11:47:29
-->
<template>
  <div class="toggleSharing">
    <apiot-actionsheet
      :actions="moreOper"
      :show="isToggleSharing"
      @select="handleMoreOpen"
      @close="handleClose"
    ></apiot-actionsheet>
  </div>
</template>

<script>
export default {
  props: {
    isToggleSharing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      moreOper: [
        { name: '他人分享', methods: this.handleOthersShare },
        { name: '我的分享', methods: this.handleMyShare }
      ],
      delectShow: false // 删除
    };
  },
  components: {},
  computed: {},
  mounted() {},
  methods: {
    // 他人分享
    handleOthersShare() {
      this.$emit('handleOthersShare');
    },
    // 我的分享
    handleMyShare() {
      this.$emit('handleMyShare');
    },
    handleClose(v) {
      this.$emit('update:isToggleSharing', v);
    },
    // 更多
    handleMoreOpen(v) {
      v.methods();
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
