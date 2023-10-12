<template  name="selectServer">
  <view class="server-info">
    <m-back-bar>
      <block slot="barTitle">{{ barTitle }}</block>
      <block slot="barRight" @click="setServerUrl('back')">
        <m-button>
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon iconSize="40"></m-font-icon>
          </block>
        </m-button>
      </block>
    </m-back-bar>
    <view class="serverContent">
      <view class="leftPart" :class="[themeClass_]">
        <ul>
          <li
            :class="tab == 'server' ? 'selected' : ''"
            @click="changeTab('server')"
          >
            {{ $t('lang-selectServe-server') }}
          </li>
          <!--中文：服务器-->
          <li
            :class="tab == 'language' ? 'selected' : ''"
            @click="changeTab('language')"
          >
            {{ $t('lang-language') }}
          </li>
          <!-- <li>显示</li> -->
        </ul>
      </view>
      <view class="rightPart" v-if="tab == 'server'">
        <view class="serverItem">
          <p>{{ $t('lang-selectServe-formal-environment') }}</p>
          <!--中文：正式环境-->
          <view class="inputItem">
            <view class="inputBox">
              <input
                type="text"
                name="formalServer"
                v-model="formalServer"
                @blur="setServerUrl('formalServer')"
              />
            </view>
            <view class="radioItem">
              <radio
                value="1"
                @click="changeServer(1, 'formalServer')"
                name="serverUrl"
                :checked="'1' == checkIndex"
              />
            </view>
          </view>
        </view>
        <view class="serverItem">
          <p>{{ $t('lang-selectServe-intranet-test-environment') }}</p>
          <!--中文：内网测试环境-->
          <view class="inputItem">
            <view class="inputBox">
              <input
                type="text"
                name="inTestServer"
                v-model="inTestServer"
                @blur="setServerUrl('inTestServer')"
              />
            </view>
            <view class="radioItem">
              <radio
                value="2"
                @click="changeServer(2, 'inTestServer')"
                name="serverUrl"
                :checked="'2' == checkIndex"
              />
            </view>
          </view>
        </view>
        <view class="serverItem">
          <p>{{ $t('lang-selectServe-extranet-test-environment') }}</p>
          <!--中文：外网测试环境-->
          <view class="inputItem">
            <view class="inputBox">
              <input
                type="text"
                name="outTestServer"
                v-model="outTestServer"
                @blur="setServerUrl('outTestServer')"
              />
            </view>
            <view class="radioItem">
              <radio
                value="3"
                @click="changeServer(3, 'outTestServer')"
                name="serverUrl"
                :checked="'3' == checkIndex"
              />
            </view>
          </view>
        </view>
        <view class="serverItem">
          <p>{{ $t('lang-selectServe-other') }}</p>
          <!--中文：其它-->
          <view class="inputItem">
            <view class="inputBox">
              <input
                type="text"
                name="otherTestServer"
                v-model="otherTestServer"
                @blur="setServerUrl('otherTestServer')"
              />
            </view>
            <view class="radioItem">
              <radio
                value="4"
                @click="changeServer(4, 'otherTestServer')"
                name="serverUrl"
                :checked="'4' == checkIndex"
              />
            </view>
          </view>
        </view>
      </view>
      <!-- 多语言选择 -->
      <view class="rightPart" v-if="tab == 'language'">
        <view class="serverItem">
          <view class="inputItem">
            <view class="inputBox language"> 中文 </view>
            <view class="radioItem language">
              <radio
                value="1"
                @click="changeLanguage('zhCN')"
                name="language"
                :checked="'zhCN' == language"
              />
            </view>
          </view>
          <view class="inputItem">
            <view class="inputBox language"> English </view>
            <view class="radioItem language">
              <radio
                value="2"
                @click="changeLanguage('enUS')"
                name="language"
                :checked="'enUS' == language"
              />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Vue from 'vue';
import { mapState, mapMutations } from 'vuex';
import VueI18n from 'vue-i18n';
import {
  THEME_COLOR_TYPE,
  THEME_COLOR_VALUE,
} from '@/common/constant/themeColor.js';
Vue.use(VueI18n);
export default {
  data() {
    return {
      barTitle: this.$t('lang-selectServe-basic-configuration'), //中文：'基础配置',
      checkIndex: 1,
      index: 1,
      formalServer: '',
      inTestServer: '',
      outTestServer: '',
      otherTestServer: '',
      tab: 'server',
      language: '',
    };
  },
  computed: {
    ...mapState(['defaultUrl', 'themeColor']),
    themeClass_() {
      //与主题she检修关联
      const mainColor = ['mainColor', 'whiteColor'];
      return this.themeColor !== 'red'
        ? 'mainColor-' + this.themeColor
        : 'mainColor';
    },
  },
  methods: {
    ...mapMutations([
      'UPDATE_SERVERURL_STATE',
      'UPDATE_THEME_COLOR',
      'SET_LOGIN_CONFIG',
    ]),
    changeServer(index, name) {
      this.checkIndex = index;
      uni.setStorageSync('baseUrlIndex', index);
      this.setServerUrl(name);
      let baseUrl = uni.getStorageSync('baseUrl');
      this.UPDATE_SERVERURL_STATE(baseUrl); //设置地址
      this.getThemeStyle();
      uni.reLaunch({
        url: '/pages/index/index',
      });
    },
    setServerUrl(name) {
      let url = '';
      if (name == 'back') {
        if (this.checkIndex == 1) {
          name = 'formalServer';
        } else if (this.checkIndex == 2) {
          name = 'inTestServer';
        } else if (this.checkIndex == 3) {
          name = 'outTestServer';
        } else if (this.checkIndex == 4) {
          name = 'otherTestServer';
        }
      }
      switch (name) {
        case 'formalServer':
          uni.setStorageSync(name, this.formalServer);
          if (this.checkIndex == 1) {
            url = this.formalServer;
          }
          break;
        case 'inTestServer':
          uni.setStorageSync(name, this.inTestServer);
          if (this.checkIndex == 2) {
            url = this.inTestServer;
          }
          break;
        case 'outTestServer':
          uni.setStorageSync(name, this.outTestServer);
          if (this.checkIndex == 3) {
            url = this.outTestServer;
          }
          break;
        case 'otherTestServer':
          uni.setStorageSync(name, this.otherTestServer);
          if (this.checkIndex == 4) {
            url = this.otherTestServer;
          }
          break;
        default:
          url = this.formalServer;
          uni.setStorageSync(name, this.formalServer);
          break;
      }

      // 设置全局配置
      uni.setStorageSync('baseUrl', url || this.defaultUrl);
      // #ifndef H5
      this.$http.setConfig((config) => {
        if (uni.getStorageSync('baseUrl')) {
          config.baseUrl = uni.getStorageSync('baseUrl');
        }

        config.baseUrl = url || this.defaultUrl;
        config.header = {
          'content-type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
        };
        return config;
      });
      // #endif
    },
    changeTab(item) {
      this.tab = item;
    },
    changeLanguage(lang) {
      uni.setStorageSync('language', lang);
      this.language = lang;
      this.$i18n.locale = lang;
      console.log(this.$i18n.locale);
      uni.getStorageInfo({
        success: function (res) {
          let keys = res.keys;
          let reg = /^[0-9]+.?[0-9]*$/;
          for (let i = 0; i < keys.length; i++) {
            if (
              reg.test(keys[i]) ||
              keys[i] == 'bundleVersions' ||
              keys[i] == 'homeTemplate' ||
              keys[i] == 'bundlePermissiones'
            ) {
              uni.removeStorageSync(keys[i]);
            }
          }
        },
      });
      uni.redirectTo({
        url: 'login',
      });
    },
    getThemeStyle: function () {
      this.$http
        .post(
          'pcHomePageConfig/selectline',
          {},
          {
            noToken: true,
          }
        )
        .then((res) => {
          const themeColor = res.data.data.appThemeColor;
          if (!!themeColor) {
            let param = {
              color: THEME_COLOR_TYPE[themeColor],
              colorCode: THEME_COLOR_VALUE[themeColor],
            };
            this.UPDATE_THEME_COLOR(param); //设置地址
            this.SET_LOGIN_CONFIG(res.data.data); //设置地址
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
  },
  mounted() {
    this.formalServer = uni.getStorageSync('formalServer') || '';
    this.inTestServer = uni.getStorageSync('inTestServer') || '';
    this.outTestServer = uni.getStorageSync('outTestServer') || '';
    this.otherTestServer = uni.getStorageSync('otherTestServer') || '';
    this.checkIndex = uni.getStorageSync('baseUrlIndex') || 1;
    this.language = uni.getStorageSync('language') || 'zh_CN';
    uni.getStorageInfo({
      success: function (res) {
        console.log(res.keys);
      },
    });
  },
};
</script>
