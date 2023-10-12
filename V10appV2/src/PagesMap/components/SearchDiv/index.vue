<!--
 * @Author: sss
 * @Date: 2022-12-12 14:32:40
 * @Last Modified by: sss
 * @Last Modified time: 2022-12-12 14:32:40
 * @Desc: None
-->
<template>
  <view class="mapTop">
    <view class="statusBar" :style="{ height: statusHeight }"></view>
    <view class="mapNuveNav bottomLine">
      <view class="mapBack" @click="navbarBack">
        <text :style="{ fontFamily: 'appIcon' }">&#xea7f;</text>
      </view>
      <view class="mapNuveTitle">{{ title }}</view>
      <view class="mapBack"> </view>
    </view>

    <view class="mapSearch__div">
      <view class="mapSearch__div--search">
        <view class="selectCity" @click.stop="selectCity">
          <text style="font-size: 28rpx">{{ selectedCity.name }}</text>
          <text class="icon" :style="{ fontFamily: 'appIcon' }">&#xeac3;</text>
        </view>
        <input
          v-model="keywords"
          class="mapSearch__div--input"
          placeholder="输入搜索地址"
          :focus="isFocus"
          @focus="searchFocus"
          @input="mapSearchByKey"
        />
        <view v-if="keywords" @tap.stop="del">
          <text
            class="del"
            :style="{ fontFamily: 'appIcon', color: themeColor }"
            >&#xeace;</text
          >
        </view>
      </view>
      <view class="mapSearch__div--tips" v-if="isFocus">
        <template v-for="(item, index) in tips">
          <view
            v-if="item.location"
            :key="index"
            @tap="clickTip(item)"
            class="item"
          >
            {{ item.name }}
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import { geoMapKey } from '@/config/index.js';
import { throttle } from '@/utils/index.js';
import amap from '@/utils/wx/amap-wx.130.js';

const amapFun = new amap.AMapWX({ key: geoMapKey.MP_KEY });

export default {
  components: {},

  props: {
    title: String,
    value: Object
  },

  data() {
    return {
      isFocus: false,
      tips: [],
      keywords: '',
      selectedCity: {},
      watchFlag: ''
    };
  },

  computed: {
    location() {
      return this.$store.state.map.location;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    statusHeight() {
      return `${this.systemInfo.statusBar}px`;
    },
    currentLocation() {
      const { location, value } = this;
      if (!value) return location;
      return value;
    },
    themeColor() {
      return this.$store.state.base.themeColor;
    }
  },

  watch: {
    currentLocation: {
      handler(V) {
        if (!V) return;
        const { regeocodes = {}, longitude, latitude } = V;
        const { addressComponent = {} } = regeocodes;
        if (addressComponent.city) {
          const locationStr = `${longitude},${latitude}`;
          this.selectedCity = {
            name: addressComponent.city,
            longitude,
            latitude,
            citycode: addressComponent.city,
            locationStr
          };
        }
        this.keywords = V.name;
      },
      immediate: true
    }
  },

  methods: {
    del() {
      this.keywords = '';
      this.tips = [];
    },
    changeCity(city) {
      if (this.selectedCity.name === city.name) return;

      this.selectedCity = { ...city };
      this.keywords = '';
      this.$emit('changeCity', city);
    },
    clickTip(item) {
      this.isFocus = false;
      this.keywords = item.name;
      this.$emit('clickTip', item);
    },
    selectCity() {
      this.isFocus = false;
      const { selectedCity } = this;
      uni.navigateTo({
        url: `/PagesMap/citySelect?cityName=${selectedCity.name}&flag=${this.watchFlag}`
      });
    },
    // 按钮返回
    navbarBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    // 聚焦
    searchFocus() {
      console.log('searchFocus');
      this.isFocus = true;
    },
    // 失焦
    searchBlur() {
      console.log('searchBlur');
      this.isFocus = false;
    },
    // 获取搜索提示
    getInputTips() {
      const { keywords, selectedCity } = this;
      if (!keywords) return;
      console.log(selectedCity);
      const param = {};
      if (selectedCity.longitude) {
        param.location = selectedCity.locationStr;
        param.city = selectedCity.citycode;
        param.citylimit = true;
      }

      amapFun.getInputtips({
        keywords,
        ...param,
        success: (data) => {
          console.log(data);
          this.tips = [...data.tips];
        },
        fail() {}
      });
    },
    // 根据关键字进行搜索
    mapSearchByKey(e) {
      if (!this.isFocus) return;
      this.keywords = e.detail.value;
      this.getInputTipsThrottle();
    }
  },

  mounted() {},

  created() {
    this.getInputTipsThrottle = throttle(this.getInputTips, 300);

    if (this.v) this.selectedCity = { ...value };

    this.watchFlag = `selectCity_${this._uid}`;
    uni.$on(this.watchFlag, this.changeCity);
  },
  beforeDestroy() {
    if (this.watchFlag) uni.$off(this.watchFlag);
  }
};
</script>

<style lang='scss' scoped>
.mapTop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #ffffff;
}
.mapNuveNav {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  color: #333333;
  font-size: 36rpx;
  @include fontBlob(500);
  height: $navbar-height;
}
.mapBack {
  width: 60rpx;
  padding-left: 30rpx;
  height: $navbar-height;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
}
.bottomLine {
  border-bottom: solid 1rpx #e9e9e9;
}
.mapNuveTitle {
  flex: 1;
  text-align: center;
  display: flex;
  align-items: center;
}
.mapSearch__div {
  display: flex;
  &--search {
    display: flex;
    flex-direction: row;
    padding: 8rpx;
    align-items: center;
    border-bottom: 1rpx solid #e9e9e9;
  }
}
.mapSearch__div--input {
  flex: 1;
  height: 60rpx;
  line-height: 60rpx;
  font-size: 30rpx !important;
}
.selectCity {
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #333333;
  line-height: 36rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 60rpx;
  line-height: 60rpx;
  &::after {
    display: block;
    height: 29rpx;
    width: 1rpx;
    background: #bbc3cd;
  }
}
.icon {
  font-size: 38rpx;
  transform: rotate(90deg);
  color: #bbc3cd;
  border-top: solid 1rpx #bbc3cd;
}
.del {
  font-size: 38rpx;
  color: #bbc3cd;
}
.mapSearch__div--tips {
  padding: 0 30rpx;
}
.item {
  padding: 32rpx 0;
  font-size: 26rpx;
  color: #333333;
  border-bottom: 1rpx solid #e9e9e9;
}
</style>
