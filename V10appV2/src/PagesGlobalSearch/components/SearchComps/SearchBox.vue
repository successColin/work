<!--
 * @Author: sss
 * @Date: 2022-03-05 09:56:56
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-05 09:56:56
 * @Desc: 搜索框
-->
<template>
  <section class="searchBox">
    <i
      class="appIcon appIcon-sousuo"
      :class="[isFocus ? getThemeColorFont : '']"
    ></i>
    <input
      v-model="keyword"
      focus
      placeholder-class="inputPlaceholder"
      placeholder="请输入关键字搜索"
      confirm-type="search"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </section>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
      isFocus: true
    };
  },

  computed: {
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    }
  },

  methods: {
    handleFocus() {
      this.isFocus = true;
    },
    handleBlur() {
      this.isFocus = false;
      this.$emit('search', this.keyword);
    }
  }
};
</script>

<style lang='scss' scoped>
.inputPlaceholder {
  font-size: 30rpx;
  font-family: $--font-family;
  font-weight: 400;
  color: #aaaaaa;
}
.searchBox {
  height: $list-search-height;
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  input {
    flex: 1;
    height: 100%;
    font-size: 15px;
  }
  .appIcon-sousuo {
    font-size: 38rpx;
    padding: 20rpx 30rpx;
    color: #bbc3cd;
  }
  .appIcon-saoma {
    padding-right: 30rpx;
    font-size: 48rpx;
    color: #bbc3cd;
  }
}
</style>
