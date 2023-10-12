<!--
 * @Author: sss
 * @Date: 2022-12-13 19:38:45
 * @Last Modified by: sss
 * @Last Modified time: 2022-12-13 19:38:45
 * @Desc: None
-->
<template>
  <view>
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar title="选择城市"> </apiot-navbar>
    <!-- #endif -->
    <div class="citySearch">
      <input
        v-model="keywords"
        class="citySearch--input"
        placeholder="输入关键字搜素"
        placeholder-class="placeholder"
      />
      <i class="appIcon appIcon-sousuo" @tap.stop="doSearch"></i>
    </div>
    <div class="currentCity">
      <i
        class="appIcon appIcon-dingwei icon"
        :class="[`themeColor__font-${getThemeIndex}`]"
      ></i>
      <p class="cityName">当前定位：{{ selectCity.name || '' }}</p>
      <p
        class="icon"
        :class="[`themeColor__font-${getThemeIndex}`]"
        @tap.stop="getLocation"
      >
        <i class="appIcon appIcon-dingdian"></i>
        重新定位
      </p>
    </div>
    <u-index-list
      :scrollTop="scrollTop"
      :index-list="list"
      :customNavHeight="customBar"
    >
      <view class="row">
        <div class="content">
          <span
            :class="[
              selectCity.adcode === '100000'
                ? `themeColor__bg-font-${getThemeIndex}`
                : '',
            ]"
            @tap.stop="clickCity('全国')"
            >全国
          </span>
        </div>
      </view>
      <view class="row">
        <p class="title">热门城市</p>
        <div class="content">
          <span
            v-for="city in hotCitys"
            :key="city.adcode"
            :class="[
              selectCity.adcode === city.adcode
                ? `themeColor__bg-font-${getThemeIndex}`
                : '',
            ]"
            @tap.stop="clickCity(city)"
            >{{ city.name }}
          </span>
        </div>
      </view>
      <u-index-item v-for="(item, index) in list" :key="index">
        <u-index-anchor
          v-if="cities[item]"
          :text="item"
          :height="$apiot.rpx2px(48)"
          bgColor="#F6F6F8"
          color="#808080"
        >
        </u-index-anchor>
        <view
          class="list-cell"
          :class="[
            selectCity.adcode === city.adcode
              ? `themeColor__font-${getThemeIndex}`
              : '',
          ]"
          v-for="city in cities[item]"
          :key="city.adcode"
          @tap.stop="clickCity(city)"
          >{{ city.name }}
        </view>
      </u-index-item>
    </u-index-list>
    <footer class="citySelect__footer">
      <div class="citySelect__footer--btns">
        <div class="btn cancel" @click="cancel">取消</div>
        <div class="btn sure" @click="sure">确定</div>
      </div>
    </footer>
  </view>
</template>

<script>
import CityInfo from './city.js';
import { fontChange } from '@/utils';

export default {
  components: {},

  props: {},

  data() {
    return {
      config: {},
      scrollTop: 0,
      indexList: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ],
      indexCity: {},
      keywords: '',
      current: {},
      citys: [], // 所有城市
      hotCitys: [],
      selectCity: {},
      isDoSearch: false,
      searchIndexList: [],
      searchCities: {}
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    location() {
      return this.$store.state.map.location;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      const searchHeight = this.$apiot.rpx2px(88);
      return this.systemInfo.customBar;
    },
    list() {
      const { isDoSearch, indexList, searchIndexList } = this;
      return isDoSearch ? searchIndexList : indexList;
    },
    cities() {
      const { isDoSearch, indexCity, searchCities } = this;
      return isDoSearch ? searchCities : indexCity;
    }
  },

  watch: {
    location: {
      handler(V) {
        const { regeocodes } = V;
        const { addressComponent } = regeocodes;
        if (addressComponent.city) {
          const current = this.searchCity(addressComponent.city);
          this.current = { ...current };
        }
      },
      deep: true
    }
  },

  methods: {
    // 根据关键字进行搜索
    doSearch() {
      const { keywords } = this;
      if (keywords) {
        this.searchIndexList = [];
        this.searchCities = {};
        this.isDoSearch = true;
        this.searchCity(keywords, 'MOHU');
      } else this.isDoSearch = false;
    },
    clickCity(city) {
      if (city === '全国') {
        this.selectCity = { adcode: '100000', name: '全国' };
      } else this.selectCity = { ...city };
    },
    // 取消
    cancel() {
      uni.navigateBack();
    },
    sure() {
      uni.$emit(this.config.flag, this.selectCity);
      uni.navigateBack();
    },
    // 设置当前定位
    async getLocation() {
      const p = await this.$location.getCurrentLocation();
      if (!p) return;
      // #ifdef APP-PLUS || MP-WEIXIN || H5
      this.$store.dispatch('getAddress', p);
      // #endif
      // #ifdef MP-ALIPAY
      this.$store.commit('setLocation', {
        location: p.currentLocation,
        locations: p.locations
      });
      // #endif
    },
    // 搜索城市
    searchCity(cityName, type = 'accurate') {
      if (!cityName) return;
      const { citys } = this;
      let info = {};
      const searchIndexList = [];
      const searchCity = {};
      for (let index = 0, len = citys.length; index < len; index += 1) {
        const city = citys[index];
        if (type === 'accurate') {
          // 精确搜索
          if (city.name === cityName) {
            info = { ...city };
            break;
          }
        } else if (city.name.indexOf(cityName) !== -1) {
          const { name } = city;
          const py = fontChange(name, 'first');
          if (searchIndexList.indexOf(py) === -1) searchIndexList.push(py);

          if (searchCity[py]) searchCity[py].push(city);
          else searchCity[py] = [city];
        }
      }
      const arry = searchIndexList.sort((x, y) => x.localeCompare(y));
      this.searchIndexList = [...arry];
      this.searchCities = { ...searchCity };
      return info;
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
    // 获取所有的城市
    getCity() {
      let { citys } = this;
      if (citys.length === 0) {
        const provinces = CityInfo.city;

        provinces.forEach((province) => {
          citys = citys.concat(province.children);
        });
        this.citys = [...citys];
      }

      const { cityName } = this.config;
      if (cityName === '全国') {
        this.selectCity = { adcode: '100000', name: '全国' };
      }
      citys.forEach((city) => {
        const { name, isCommon } = city;
        const py = fontChange(name, 'first');
        // 是否为热门城市
        if (isCommon) this.hotCitys.push(city);
        // 当前城市
        if (cityName === name) {
          this.selectCity = { ...city };
          this.current = { ...city };
        }
        if (this.indexCity[py]) this.indexCity[py].push(city);
        else this.indexCity[py] = [city];
      });

      return citys;
    }
  },

  mounted() {},

  onLoad(option) {
    this.config = option;
    this.getCity();
  }
};
</script>

<style lang='scss' scoped>
.citySearch {
  height: 88rpx;
  display: flex;
  line-height: 88rpx;
  background: #fff;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  &--input {
    margin: 25rpx 30rpx;
    font-size: 30rpx;
    flex: 1;
  }
  .appIcon {
    flex-shrink: 0;
    font-size: 38rpx;
    padding-right: 30rpx;
  }
  .placeholder {
    color: #aaaaaa;
  }
}
.currentCity {
  padding: 0 30rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  line-height: 88rpx;
  background: #fff;
  font-size: 28rpx;
  color: #333333;
  .cityName {
    flex: 1;
  }
  .icon {
    flex-shrink: 0;
  }
  .appIcon {
    font-size: 38rpx;
    padding-right: 13rpx;
  }
}
.row {
  .title {
    padding-left: 30rpx;
    height: 68rpx;
    line-height: 68rpx;
    font-size: 28rpx;
    color: #808080;
  }
  .content {
    padding: 10rpx 80rpx 10rpx 30rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20rpx;
    span {
      height: 75rpx;
      line-height: 75rpx;
      font-size: 30rpx;
      color: #333333;

      background: #ffffff;
      border-radius: 12rpx;
      border: 1px solid #e9e9e9;
      text-align: center;
    }
  }
}
.list-cell {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 24rpx 30rpx;
  overflow: hidden;
  color: #333333;
  font-size: 30rpx;
  background-color: #fff;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
}
.citySelect {
  &__footer {
    height: 88rpx;
    &--btns {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 19rpx 33rpx;
      display: flex;
      background: #fff;
      z-index: 10000;
      .btn {
        display: inline-block;
        flex: 1;
        height: 72rpx;
        line-height: 72rpx;
        border-radius: 12rpx;
        font-size: 30rpx;
        font-family: $--font-family;
        color: #333333;
        text-align: center;
        &.cancel {
          background: #f1f3f6;
        }
        &.sure {
          margin-left: 24rpx;

          background: #4689f5;
          color: #fff;
        }
      }
    }
  }
}
</style>
