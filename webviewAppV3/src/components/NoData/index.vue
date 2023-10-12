<template>
  <div class="noData">
    <img src="@/assets/img/nodata.png" alt="">
    暂无数据
  </div>
</template>

<script setup lang='ts' name="noData">
// console.log(1)
</script>

<style scoped lang="scss">
.noData {
  display: flex;
  flex-direction: column;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #666;
  font-size: 30px;
  img {
    margin-bottom: 30px;
  }
}
</style>