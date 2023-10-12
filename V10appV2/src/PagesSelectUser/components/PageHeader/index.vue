<!--
 * @Author: sss
 * @Date: 2022-11-11 10:08:08
 * @Last Modified by: sss
 * @Last Modified time: 2022-11-11 10:08:08
 * @Desc: 用户列表头部
-->
<template>
  <section class="nav">
    <div class="nav__header">
      <!-- #ifndef MP-ALIPAY -->
      <view class="statusBar" :style="{ height: statusHeight }"></view>
      <!-- #endif -->
      <section class="nav__top" @click.stop="showSelect">
        <span>{{ config.title }}</span>
        <span>{{ `已选择(${selectUsers.length})` }}</span>
      </section>
      <section class="nav__search">
        <apiot-input-search
          ref="navSearch"
          searchFlag="navSearch"
          @search="doSearch"
        ></apiot-input-search>
      </section>
      <section class="nav__tab">
        <p
          v-for="(item, index) in tabArry"
          :key="index"
          @click="changeTab(item, index)"
        >
          <span
            :class="[
              index === currentIndex
                ? `themeColor__bg-font-${getThemeIndex}`
                : '',
            ]"
            >{{ item.name }}</span
          >
        </p>
      </section>
    </div>
    <!-- #ifndef MP-ALIPAY -->
    <view class="statusBar" :style="{ height: statusHeight }"></view>
    <!-- #endif -->
    <view class="nav--placeholder" :style="headerStyle"></view>
    <select-users :show.sync="show"></select-users>
  </section>
</template>

<script>
import SelectUsers from './SelectUsers';

export default {
  inject: ['GetSelectUsers'],
  components: { SelectUsers },

  props: {
    config: Object,
    selectUsers: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      currentIndex: 0,
      show: false
    };
  },

  computed: {
    tabArry() {
      const arry = [
        {
          name: '全部',
          type: 'ALL'
        }
      ];
      const { config } = this;
      if (config.shouldFav) arry.push({ name: '常用', type: 'COMMON' });
      if (config.shouldInRole) arry.push({ name: '按角色', type: 'ROLE' });
      if (config.shouldInOrg) arry.push({ name: '按组织', type: 'ORG' });
      if (config.shouldInPost) arry.push({ name: '按职位', type: 'POST' });

      return arry;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    statusHeight() {
      return `${this.systemInfo.statusBar}px`;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    headerStyle() {
      const top = this.$apiot.rpx2px(80);
      const tab = this.$apiot.rpx2px(88);
      const topHeight = top + tab + 44; // top、tab、搜索栏
      return { height: `${topHeight}px` };
    }
  },

  methods: {
    // 显示已经选择的
    showSelect() {
      if (this.selectUsers.length === 0) return;
      this.show = true;
    },
    // 搜索
    doSearch(param) {
      this.$emit('search', param);
    },
    // 切换tab页
    changeTab(tab, index) {
      this.currentIndex = index;
      this.$emit('changeTab', tab);
    },
    // 清空搜索信息
    clear() {
      this.$refs.navSearch.searchParams = {};
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.nav {
  &__header {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 100;
  }
  .statusBar {
    background: #fff;
  }
  &__top {
    padding: 0 30rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    font-size: 32rpx;
    @include fontBlob(500);
    color: #333333;
    box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  }
  &__tab {
    padding: 0 30rpx;
    background: #fff;
    height: 88rpx;
    line-height: 88rpx;

    p {
      margin-right: 23rpx;
      display: inline-block;
      font-size: 28rpx;
      font-family: $--font-family;
      line-height: 36rpx;
      &::after {
        margin-right: 0;
      }
      span {
        display: inline-block;
        padding: 7rpx 20rpx;
        background: #f6f6f8;
        color: #333333;
        border-radius: 33rpx;
      }
    }
  }
}
</style>
