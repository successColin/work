<!--
 * @Descripttion: 搜索跳转按钮
 * @Author: ytx
 * @Date: 2022-01-05 14:20:35
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-05 14:20:35
-->
<template>
  <div class="searchButton">
    <!-- 点击遮罩层 -->
    <div class="searchButton__mask" @click="handleJump"></div>
    <apiot-input
      class="searchButton__search"
      prefixIcon="appIcon-sousuo"
      placeholder="在全部文件中搜索"
      :isTheme="false"
    ></apiot-input>
  </div>
</template>

<script>
// 这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
// 例如：import 《组件名称》 from '《组件路径》';

export default {
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 点击搜索
    handleJump() {
      uni.navigateTo({
        animationType: 'pop-in',
        url: 'components/SearchPage/index'
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.searchButton {
  height: 100%;
  position: relative;
  &__mask {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    z-index: 1;
  }
}
</style>
