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
export default {
  inject: ['getAllForm'],
  props: {
    classId: {
      type: Number,
      default: 1
    }
  },
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
        url: `/knowledgeBase/components/SearchRelationpage/index?formObj=${this.getAllForm() &&
          JSON.stringify(this.getAllForm())}`
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.searchButton {
  height: 100%;
  position: relative;
  box-shadow: inset 0px -1px 0px 0px #e9e9e9;
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
