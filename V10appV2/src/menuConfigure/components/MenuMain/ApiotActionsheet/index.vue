<!--
 * @Descripttion: 操作菜单
 * @Author: ytx
 * @Date: 2022-02-08 16:16:45
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-08 16:16:45
-->
<template>
  <div @touchmove.stop.prevent>
    <u-action-sheet
      :actions="actions"
      :closeOnClickAction="closeOnClickAction"
      :closeOnClickOverlay="true"
      :show="show"
      :cancelText="cancelText"
      @close="handleClose"
      @select="handleSelect"
    ></u-action-sheet>
  </div>
</template>

<script>
export default {
  props: {
    actions: {
      type: Array,
      default: () => []
    },
    closeOnClickAction: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  methods: {
    handleSelect(v) {
      this.$emit('select', v);
    },
    handleClose() {
      this.$emit('close', false);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
