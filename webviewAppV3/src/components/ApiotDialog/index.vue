<template>
  <van-dialog
    v-model:show="isShow"
    :title="title"
    :overlay-style="{ background: 'rgba(0,0,0,0.4)' }"
    :showConfirmButton="false"
  >
    <slot></slot>
  </van-dialog>
</template>

<script setup lang="ts" name="apiotDialog">
import { Dialog } from 'vant';
const VanDialog = Dialog.Component; //这句是重点

defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
});
</script>

<style scoped lang="scss">
</style>