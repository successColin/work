<template>
	<view class="myQrcode">
		<m-back-bar>
			<block slot="barTitle">{{$t('lang-qrcode-my')}}</block><!--中文：我的二维码-->
		</m-back-bar>
		<!-- #ifndef MP -->
		<view class="qrcod-econtent">
		<!-- #endif -->
		<!-- #ifdef MP -->
		<view class="qrcod-econtent has_MP">
		<!-- #endif -->
			<view class="qrcod">
				<view class="header">
					<!-- #ifdef MP -->
					<open-data class="header-img" type="userAvatarUrl"></open-data>
					<!-- #endif --> 
					<!-- #ifndef MP -->
					<image class="header-img" :src="userImag"></image>
					<!-- #endif --> 
					
					<view class="header-content">
						<view class="user-name">{{username}}</view>
						<view class="user-sub">{{account}} </view>
					</view>
				</view>
				<view>
					<tki-qrcode cid="myQR" ref="myQR"
						:val="userKey" 
						:onval="onval" 
						:loadMake="loadMake" 
						:usingComponents="true" 
						@result="qrR" />
				</view>
				<view class="footer">{{$t('lang-qrcode-scan')}}</view><!--中文：请扫一扫二维码-->
			</view>
		</view>
	</view>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import tkiQrcode from '@/components/plugin/tki-qrcode/tki-qrcode.vue';

import defalutImage from '@/static/images/default_image.png';
export default {
  components: {
    tkiQrcode,
  },
  data() {
    return {
      val: 'USER-000001',
      defalutImage: defalutImage,
      unit: 'upx', // 单位
      background: '#b4e9e2', // 背景色
      foreground: '#309286', // 前景色
      pdground: '#32dbc6', // 角标色
      icon: '', // 二维码图标
      iconsize: 40, // 二维码图标大小
      lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
      onval: true, // val值变化时自动重新生成二维码
      loadMake: true, // 组件加载完成后自动生成二维码
      src: '', // 二维码生成后的图片地址或base64
    };
  },
  computed: {
    ...mapState({
      username: 'username', //用户名
      userKey: 'userKey', //用户编码
      account: 'account',
      usertelephone: 'usertelephone',
      userImag: 'userImag',
    }),
  },
  methods: {
    qrR(res) {
      this.src = res;
    },
  },
};
</script>