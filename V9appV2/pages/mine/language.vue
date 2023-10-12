<template>
  <view class="language">
    <m-back-bar>
      <block slot="barTitle">{{ $t('page-switchLanguage') }}</block
      ><!--中文：我的二维码-->
    </m-back-bar>
    <view class="menu-container">
      <view class="user-bundle" @click="switchLanguage('zh_CN')">
        <view class="bundle-name" :class="language == 'zh_CN' ? 'current' : ''"
          >中文</view
        >
        <view class="font-icon" v-if="language == 'zh_CN'">
          <m-font-icon
            icon="iconxuanzhong"
            :color="themeColor"
            :iconSize="iconSize"
          ></m-font-icon>
        </view>
      </view>
      <view class="user-bundle" @click="switchLanguage('en_US')">
        <view class="bundle-name" :class="language == 'en_US' ? 'current' : ''"
          >English</view
        >
        <view class="font-icon" v-if="language == 'en_US'">
          <m-font-icon
            icon="iconxuanzhong"
            :color="themeColor"
            :iconSize="iconSize"
          ></m-font-icon>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import $http from '@/common/utils/request/index.js';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      val: 'USER-000001',
      language: uni.getStorageSync('language') || 'zh_CN',
      iconSize: 32,
    };
  },
  computed: {
    ...mapState(['themeColor']),
  },
  methods: {
    switchLanguage(lang) {
      this.language = lang;
      uni.setStorageSync('language', lang); //当前语言
      this.$http
        .post('user/switchLanguage/APP/' + lang)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            uni.redirectTo({
              url: '/pages/home/home?pageType=myself',
            });
            this.$i18n.locale = lang;
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
  },
};
</script>