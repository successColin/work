<!--
 * @Author: sss
 * @Date: 2021-11-18 09:29:10
 * @Last Modified by: sss
 * @Last Modified time: 2021-11-18 09:29:10
 * @Desc: 定位地图
-->
<template>
  <view class="apiotFixed" @click="openMap">
    <view class="apiotFixed__address font__ellipsis">{{
      currentLocation.name || '正在定位'
    }}</view>
    <i v-if="!disabled" class="appIcon appIcon-a-shujuxuanzejinru"></i>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: Array, // 默认传进来的坐标系是百度坐标系
    title: {
      type: String,
      default: '地图'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentLocation: {},
      watchFlag: ''
    };
  },

  computed: {},

  watch: {
    value: {
      handler(positions) {
        if (!positions || positions.length === 0) return;
        const location = positions[0];
        const { latitude, longitude } = location;
        if (
          this.currentLocation.latitude === latitude &&
          this.currentLocation.longitude === longitude
        ) return;
        const coordinate = this.transformFromBaiduToGCJ(latitude, longitude); // 百度转gcj
        this.currentLocation = { ...location, ...coordinate };
      },
      immediate: true
    }
  },

  methods: {
    setChange() {
      const location = { ...this.currentLocation };
      if (!location) return;
      const { latitude, longitude, name } = location;
      let value = '';
      if (latitude && longitude) {
        const coordinate = this.transformFromGCJToBaidu(latitude, longitude); // gcj 转 百度
        const { latitude: lat, longitude: lng } = coordinate;
        value = { name, latitude: lat, longitude: lng, lng, lat };
      }
      this.$emit('change', value);
    },
    // 设置当前定位
    async getLocation(p, type = 'getCurrent') {
      if (type === 'getCurrent') p = await this.$location.getCurrentLocation();
      if (!p) return;
      let location = null;
      // #ifdef APP-PLUS || MP-WEIXIN || H5
      const a = await this.$store.dispatch('getAddress', p);
      location = { ...a };
      // #endif
      // #ifdef MP-ALIPAY
      this.$store.commit('setLocation', {
        location: p.currentLocation,
        locations: p.locations
      });
      location = { ...p.currentLocation };
      // #endif
      // 如果没有值默认取当前定位1
      const { value = [] } = this;
      const lo = value[0] || {};
      const { latitude, longitude } = lo;
      if (!latitude && !longitude) this.changeFixed(location);
    },
    // 打开地图
    openMap() {
      if (this.disabled) return;
      this.$store.commit('setSelectedLocation', {
        flag: this.watchFlag,
        location: this.currentLocation
      });
      uni.navigateTo({
        url: `/PagesMap/mapSearch?title=${this.title}&flag=${this.watchFlag}`
      });
    },
    changeFixed(location) {
      this.currentLocation = location;
      this.setChange();
    },
    // 百度转gcj02
    transformFromBaiduToGCJ(latitude, longitude) {
      if (!latitude || !longitude) return {};
      const xPi = (3.14159265358979323846264338327950288 * 3000.0) / 180.0;

      const x = longitude - 0.0065;
      const y = latitude - 0.006;
      const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
      const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
      // eslint-disable-next-line camelcase
      const a_latitude = z * Math.sin(theta);
      // eslint-disable-next-line camelcase
      const a_longitude = z * Math.cos(theta);

      return { latitude: a_latitude, longitude: a_longitude };
    },
    // gcj02转百度
    transformFromGCJToBaidu(latitude, longitude) {
      if (!latitude || !longitude) return {};
      const pi = (3.14159265358979324 * 3000.0) / 180.0;

      const z =
        Math.sqrt(longitude * longitude + latitude * latitude) + 0.00002 * Math.sin(latitude * pi);
      const theta = Math.atan2(latitude, longitude) + 0.000003 * Math.cos(longitude * pi);
      // eslint-disable-next-line camelcase
      const a_latitude = z * Math.sin(theta) + 0.006;
      // eslint-disable-next-line camelcase
      const a_longitude = z * Math.cos(theta) + 0.0065;

      return { latitude: a_latitude, longitude: a_longitude };
    }
  },

  mounted() {
    uni.$on(this.watchFlag, this.changeFixed);
  },

  created() {
    this.watchFlag = `fixed_${this._uid}`;
    this.getLocation();
  },

  beforeDestroy() {
    if (this.watchFlag) uni.$off(this.watchFlag);
  }
};
</script>

<style lang='scss' scoped>
.apiotFixed {
  height: 100%;
  display: flex;
  align-items: center;
  margin: 10rpx 0;
  height: $form-el-height;
  font-size: $form-el-fontSize;
  font-family: $--font-family;
  color: $form-el-valueColor;
  &__address {
    flex: 1;
  }
  .appIcon-a-shujuxuanzejinru {
    flex-shrink: 0;
    color: $form-el-placeholderColor;
    font-size: 48rpx;
  }
}
</style>
