<template>
  <!-- 资讯内容 -->
  <div class="information">
    <!-- 头部 -->
    <m-back-bar>
      <block slot="barTitle">{{ barTitle }}</block>
      <block slot="barRight">
        <m-font-icon
          icon="iconguanliantianjia"
          :iconSize="36"
          class="information__add"
          @click="handleAdd"
        ></m-font-icon>
      </block>
    </m-back-bar>
    <!-- 分组 -->
    <tab ref="tab" @change="swtichSwiper"></tab>
    <swiper
      class="information__height"
      @change="swipeIndex"
      :current="current"
      :duration="300"
    >
      <swiper-item>
        <scroll-view scroll-y="true" class="information__height">
          <view class="list-item" v-for="(item, index) in 20" :key="'A' + index"
            >A-list {{ index }}</view
          >
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y="true" class="information__height">
          <view class="list-item" v-for="(item, index) in 20" :key="'B' + index"
            >B-list {{ index }}</view
          >
        </scroll-view>
      </swiper-item>
      <swiper-item>
        <scroll-view scroll-y="true" class="information__height">
          <view class="list-item" v-for="(item, index) in 20" :key="'C' + index"
            >C-list {{ index }}</view
          >
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import tab from './components/tab';
export default {
  data() {
    return {
      barTitle: '资讯',
      current: 0,
    };
  },
  components: {
    tab,
  },
  methods: {
    // 获得swiper切换后的current索引
    swipeIndex(index) {
      this.$refs.tab.switchTab(index.detail.current);
    },
    // 通过tab组件回调点击切换的index同步swiper的current索引
    swtichSwiper(index) {
      this.current = index;
    },
    handleAdd() {
      console.log(11111111111);
      uni.navigateTo({
        url: `/pages/information/index`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@charset "utf-8";
@import '@/static/scss/common/_function.scss';
@import '@/static/scss/common/_variable.scss';
.information {
  width: 100%;
  &__add {
    color: #333333;
  }
  &__height {
    height: calc(100vh - #{$page-tab-height});
  }
}

.list-item {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  margin: 4rpx 0;
  background-color: #ffffff;
}
</style>
