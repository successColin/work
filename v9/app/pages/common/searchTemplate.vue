<template>
  <view class="searchTemplate">
    <m-back-bar>
      <block slot="barTitle">{{ $t('page-searchTitle') }}</block>
    </m-back-bar>
    <view class="search">
      <input
        v-model="searchText"
        type="text"
        focus
        :placeholder="placeholder"
        confirm-type="search"
        @confirm="handleSearch()"
      />
      <m-button
        class="search-btn"
        :isFontBtn="true"
        key="searchBtn"
        :btnClass="searchText ? 'mainColor' : 'searchColor'"
        @elementClick="handleSearch()"
      >
        <block slot="buttonIcon" style="display: inline-block">
          <m-font-icon icon="iconsousuo" :iconSize="34"></m-font-icon>
        </block>
      </m-button>
    </view>
    <view class="seaech-item seaech-history">
      <view class="title">
        <view class="content">{{ $t('page-searchHistory') }}</view>
        <m-button
          class="clearBtn"
          :isFontBtn="true"
          key="clearBtn"
          @elementClick="clearHistory"
        >
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon
              icon="iconqingkonglishi"
              :iconSize="34"
              color="#9B9B9B"
            ></m-font-icon>
          </block>
        </m-button>
      </view>
      <view class="content-block">
        <view
          class="item"
          v-for="(item, index) in searchHistory"
          :key="index"
          @tap.stop="handleClickHistory(item)"
          >{{ item }}</view
        >
      </view>
    </view>
    <!-- <view class="seaech-item">
			<view class="title">
				<view class="content">{{ $t('page-searchHot') }}</view>
			</view>
			<view class="content-block">
				<view class="index" v-for="(item,index) in hotSearch"
					:key="index">
					<view class="xuhao" :class="{hot:index<3}"><text>{{ index+1 }}</text></view>
					<view>{{ item }}</view>
				</view>
			</view>
		</view> -->
  </view>
</template>

<script>
import bus from '@/static/js/bus';
export default {
  data() {
    return {
      placeholder: this.$t('formTip-placeholder'),
      searchText: '',
      onKey: '',
      searchHistory: [],
      hotSearch: [
        this.$t('lang-searchTemplate-fault-repair-order'),
        this.$t('lang-searchTemplate-plan-repair-order'),
        this.$t('lang-searchTemplate-inspection'),
        this.$t('page-knowledge'),
      ], //中文：["故障工单","计划工单","点检","知识库"]
    };
  },
  methods: {
    handleSearch() {
      const onkey = this.onKey;
      if (
        this.searchText !== '' &&
        this.searchHistory.indexOf(this.searchText) === -1
      ) {
        this.searchHistory.unshift(this.searchText);
        uni.setStorageSync('searchHistory', this.searchHistory);
      }
      bus.$emit(onkey, this.searchText);
      uni.navigateBack();
    },
    handleClickHistory(history) {
      this.searchText = history;
    },
    clearHistory() {
      this.searchHistory = [];
      uni.removeStorageSync('searchHistory');
    },
  },
  onLoad(options) {
    this.onKey = options.onKey;
    this.searchHistory = uni.getStorageSync('searchHistory') || [];
  },
};
</script>

<style>
</style>
