<!-- 头部返回栏 -->
<template>
	<!-- #ifndef MP -->  
	<view name="m-backbar" class="m-backbar">
	<!-- #endif -->
	<!-- #ifdef MP -->
	<view name="m-backbar" class="m-backbar" :class="[backStyle !== 'backStyleNoBack'?'MP-back':'']">
	<!-- #endif -->
		<!-- #ifdef APP-PLUS || MP -->  
		<view class="app-statusBar"> 
			<!-- #ifdef APP-PLUS -->  
			<view class="top_view" :style="{background:backStyleObj.statusBarBgColor}"></view>  
			<!-- #endif --> 
			<!-- #ifdef MP -->
			<view class="top_view" :style="{background:backStyleObj.statusBarBgColor}"></view>  
			<!-- #endif --> 
		</view>  
		<!-- #endif --> 
		<!-- #ifdef MP -->  
		<view class="backbar_title" v-if="backStyle !== 'backStyleNoBack'"><view class="content" :style="{background: themeColorCode}">{{ appName }}</view></view> 
		<!-- #endif -->
		<view class="backbar" :class="[backStyle]" :style="{background: backStyle === 'backStyleNoBack' ? themeColorCode:''}">
			<view class="bar-title"><slot name="barTitle"></slot></view>
			<view class="backBtn bar-left">
				<m-button v-if="backStyle !== 'backStyleNoBack'" :isFontBtn="true" @elementClick="hangdleBackClick">
					<m-font-icon icon="iconfanhui" :iconSize="39" slot="buttonIcon" :color="colorCode"></m-font-icon>
				</m-button>
				<slot name="barLeft"></slot>
			</view>
			<view class="bar-right"><slot name="barRight"></slot></view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  props: {
    colorCode: {
      type: String,
      default: '#333333',
    },
    backStyle: {
      type: String,
      default: '',
    },
    statusBarBgColor: {
      type: String,
    },
  },
  computed: {
    ...mapState(['appName', 'themeColorCode', 'isOriginHei']),
    backStyleObj() {
      return {
        statusBarBgColor:
          this.statusBarBgColor !== 'transparent'
            ? this.themeColorCode
            : 'transparent',
      };
    },
  },
  methods: {
    ...mapMutations(['STATE_INIT', 'SET_bundle']),
    ...mapMutations('list', ['SET_LIST_REFRESH']),
    ...mapMutations('Toast', ['TOAST_REQUESTURLS', 'SET_TOAST_LOADING']),
    hangdleBackClick() {
      //返回时清空loading状态
      this.TOAST_REQUESTURLS('clear');
      this.SET_TOAST_LOADING();
      this.STATE_INIT();
      uni.navigateBack();
    },
    hangdleNavClick() {
      let params = {};
      this.$emit('navClick', params);
    },
  },
};
</script>
<style>
.app-statusBar {
  height: var(--status-bar-height);
  width: 100%;
  flex-shrink: 0;
}
.app-statusBar .top_view {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 999;
}
.m-backbar {
  margin-bottom: var(--status-bar-height);
}
.hasStatusTop {
  margin-top: var(--status-bar-height);
}
.bar-title{
	max-width: 60%;
}
</style>