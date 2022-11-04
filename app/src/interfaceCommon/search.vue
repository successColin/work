<!--
 * @Author: sss
 * @Date: 2022-03-05 09:38:35
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-05 09:38:35
 * @Desc: 通用搜索
-->
<template>
  <view class="search">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="$t('common.search')"></apiot-navbar>
    <!-- #endif -->
    <u-sticky :customNavHeight="customBar">
      <search-box
        ref="searchBox"
        :list="list"
        :enableScan="enableScan"
        @search="handleSearch"
      ></search-box>
    </u-sticky>

    <section class="lastSearches">
      <header class="lastSearches__header">
        <span>最近搜索</span>
        <p @click="delLastSearche"><i class="appIcon appIcon-shanchu"></i></p>
      </header>
      <div class="lastSearches__content">
        <p
          class="lastSearches__content--item"
          :class="[
            index === lastSearchesIndex ? `activited ${getThemeColorBg}` : '',
          ]"
          v-for="(item, index) in lastSearche"
          :key="index"
          @click.stop="clickLastSearchesItem(item, index)"
        >
          {{ item.value }}
        </p>
      </div>
    </section>
  </view>
</template>

<script>
import SearchBox from './components/SearchComps/SearchBox.vue';

export default {
  components: { SearchBox },

  props: {},

  data() {
    return {
      searchInfo: {
        searchFlag: 'common' // 用于取缓存中的近期搜索
      },
      lastSearche: [], // 最近搜索列表
      lastSearchesIndex: -1, // 最近搜索点击序号
      enableScan: false // 是否启动扫描
    };
  },

  computed: {
    // 搜索框-下拉框内容
    getICSearchDown() {
      return this.$store.getters.getICSearchDown;
    },
    list() {
      const { searchInfo } = this;
      const { flag = 'common' } = searchInfo;
      return this.getICSearchDown[flag];
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.customBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    },
    getThemeColorBg() {
      return this.$store.getters.getThemeColorBg;
    }
  },

  methods: {
    // 点击最近搜索
    clickLastSearchesItem(search, index) {
      this.lastSearchesIndex = index;
      this.$refs.searchBox.setKeyword({ keyword: search.value });
    },
    // 删除近期搜索缓存
    delLastSearche() {
      this.$store.commit('setSearchLast', {
        searchFlag: this.searchInfo.searchFlag,
        lastSearchList: []
      });
      this.lastSearche = [];
      this.lastSearchesIndex = -1;
    },
    // 处理搜索
    handleSearch(e) {
      const { flag } = this.searchInfo;
      // 记录到搜索缓存中
      const { keyword } = e;
      if (keyword) {
        const lastSearche = [...this.lastSearche];
        const index = lastSearche.findIndex((v) => v.value === keyword);
        if (index !== -1) lastSearche.splice(index, 1);
        lastSearche.unshift({ value: keyword, time: new Date().getTime() });
        this.$store.commit('setSearchLast', {
          searchFlag: this.searchInfo.searchFlag,
          lastSearchList: lastSearche
        });
      }
      this.$bus.$emit(flag, { flag, searchParams: e });
      uni.navigateBack();
    },
    // 获取缓存中的近期搜索，并将大于一个星期的近期搜索删除
    getLastSearches() {
      const { searchFlag } = this.searchInfo;
      const { lastSearche } = this.$store.state.search;
      const menuLastSearche = lastSearche[searchFlag] || [];
      const newLastSearch = menuLastSearche.filter((V) => {
        const current = new Date().getTime();
        return this.$apiot.moment.getDifferDate(V.time, current, 1) <= 7;
      });
      this.lastSearche = [...newLastSearch];
      this.$store.commit('setSearchLast', { searchFlag, lastSearchList: newLastSearch });
    }
  },

  onLoad(option = {}) {
    if (option.searchParams !== '{}') {
      const param = JSON.parse(option.searchParams);
      param.changeDown = true;

      this.$nextTick(() => {
        this.$refs.searchBox.setKeyword(param);
      });
    }

    if (option.enableScan) this.enableScan = true;
    this.searchInfo = { ...this.searchInfo, ...option };
    this.getLastSearches();
  },
  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('common.search')
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.search {
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  background: #fff;
}
.lastSearches {
  padding: 0 30rpx;
  font-family: $--font-family;

  &__header {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    color: #333333;
    .appIcon {
      padding-left: 30rpx;
      font-size: 19px;
      color: #bbc3cd;
    }
  }
  &__content {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333333;
    &--item {
      margin-right: 18rpx;
      padding: 15rpx 30rpx;
      background: #f6f6f8;
      border-radius: 100px;
      &.activited {
        color: #fff;
      }
    }
  }
}
</style>
