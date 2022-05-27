<!--
 * @Descripttion: 上传块
 * @Author: ytx
 * @Date: 2022-02-24 08:52:21
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-24 08:52:21
-->
<template>
  <div class="uploadBlock m-r-9">
    <div class="uploadBlock__icon">
      <u-image :src="imgUrl" :width="24" :height="28"></u-image>
    </div>
    <div>{{ title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '新建文件夹'
    },
    url: {
      type: String,
      default: 'DOC.svg'
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    imgUrl() {
      return require(`@/static/img/fileType/${this.url}`);
    }
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.uploadBlock {
  flex: 1;
  text-align: center;
  height: 200rpx;
  background: #ffffff;
  font-size: 28rpx;
  color: #333333;
  &__icon {
    margin: 0 auto;
    margin-bottom: 30rpx;
    margin-top: 30rpx;
    width: 100rpx;
    height: 100rpx;
    background: #f6f6f8;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
