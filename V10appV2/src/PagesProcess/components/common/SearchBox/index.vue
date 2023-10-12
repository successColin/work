<template>
  <!-- <u-sticky :customNavHeight="customBar">
  </u-sticky> -->
  <apiot-input-search
    ref="navSearch"
    searchFlag="navSearch"
    @search="doSearch"
    @clearSearchBox="doSearch"
  >
    <template slot="searchRight">
      <div class="apiotInputSearch__input__filter" @click.stop="clickFilter">
        <span class="filter--line"></span>
        <span class="filter--text">筛选</span>
        <i class="appIcon appIcon-shaixuan"></i>
      </div>
    </template>
  </apiot-input-search>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  computed: {
    // systemInfo() {
    //   return this.$store.state.base.systemInfo;
    // },
    // // 顶部固定高度
    // customBar() {
    //   let height = this.systemInfo.customBar;
    //   // #ifdef MP-ALIPAY
    //   height = 0;
    //   // #endif
    //   return height;
    // }
  },
  watch: {},
  mounted() {},
  methods: {
    doSearch(param) {
      this.$emit('search', param);
    },
    // 点击筛选按钮
    clickFilter() {
      this.$emit('clickFilter');
    }
  }
};
</script>
<style lang='scss' scoped>
.apiotInputSearch__input__filter {
  flex-shrink: 0;
  max-width: 153rpx;
  display: flex;
  align-items: center;

  .filter--text {
    margin: 0 6rpx;
  }
  .filter--line {
    margin: 0 18rpx 0 0;
    width: 1rpx;
    height: 28rpx;
    background: #d9d9d9;
  }
}
</style>
