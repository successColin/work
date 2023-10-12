<template>
  <van-loading v-show="loading.show" size="24px" vertical class="loadingClass">
    加载中...
  </van-loading>
</template>

<script setup lang='ts' name="apiotLoading">
import { useLoadingStore } from '@/store/loading';
const loading = useLoadingStore();
</script>

<style scoped lang="scss">
.loadingClass {
  position: fixed !important;
  top: 40%;
  left: 50%;
  display: flex;
  justify-content: center;
  transform: translateX(-50%);
  z-index: 9999;
}
</style>