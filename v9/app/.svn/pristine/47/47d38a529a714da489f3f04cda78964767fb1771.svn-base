<template name="mMap">
  <view>
    <view class="page-body">
      <map
        class="m-map"
        id="map1"
        :latitude="latitude"
        :longitude="longitude"
        show-location="true"
        :markers="covers"
        @regionchange="onRegionChange"
        :style="mapStyle"
      >
        <cover-image
          class="headerBtn"
          src="../../static/images/posheader.png"
        ></cover-image>
        <cover-view class="okBtn" @click="handleOkBtn" v-show="!latLon">{{
          $t('lang-map-ok')
        }}</cover-view>
        <cover-view class="offBtn" @click="handleOffBtn">{{
          $t('basic-cancel')
        }}</cover-view>
        <cover-image
          class="controls-img"
          @click="handleCurrPos"
          src="../../static/images/position.png"
        ></cover-image>
        <cover-image
          v-if="!latLon"
          class="controls-pos"
          @click="handleCurrPos"
          src="../../static/images/location.png"
        ></cover-image>
      </map>
      <view class="pointContent" :style="conList">
        <view v-if="latLon" class="poslist">
          <view class="font1">
            <view class="name">地图位置</view>
          </view>
          <view class="font2">{{ haveaddress }}</view>
        </view>
        <view v-else>
          <view v-show="this.isClickDow" class="iconsty">
            <m-font-icon
              icon="APP_31"
              :iconSize="40"
              class="icon"
              @click="handleDow"
            ></m-font-icon>
          </view>
          <input
            class="input"
            placeholder="搜索地点"
            v-model="searchName"
            @blur="blurInp"
            @confirm="handleConfirm"
            @focus="focusInp"
            confirm-type="search"
            hold-keyboard="true"
          />
          <scroll-view
            scroll-y="true"
            style="height: 60vh"
            @scrolltolower="handleLower"
          >
            <view
              class="poslist"
              v-for="(item, i) of sidePosition"
              :key="i"
              @click="handlechange(item, i)"
            >
              <view class="font1">
                <view class="name">{{ item.name }}</view>
                <m-font-icon
                  class="icon"
                  icon="iconxuanzhong"
                  :iconSize="40"
                  :style="item.check ? 'display:inline-block' : 'display:none'"
                ></m-font-icon>
              </view>
              <view class="font2"
                >{{ item.distance }}m{{ $t('lang-map-inner') }} |
                {{ item.city || '' }} {{ item.address }}</view
              >
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
// #ifdef APP-PLUS
let mapSearch = weex.requireModule('mapSearch');
// #endif
// #ifdef MP-WEIXIN
import QQMapWX from '../../common/map/qqmap-wx-jssdk.min.js';
// #endif
export default {
  data() {
    return {
      latLon: '', // 传过来的经纬度
      qqmapsdk: null, // sdk 方法
      key: 'QTMBZ-4OLW6-2RBSY-M75PM-WORRE-5YB7X', // 腾讯地图 中使用 keyss
      navMap: '', // 地图对象
      isclickList: false, // 是否是点击
      regionChangeNum: 1,
      latitude: 39.909,
      longitude: 116.39742,
      changeLongitude: '',
      changeLatitude: '',
      address: '', // 当前位置
      haveaddress: '', // 数据库中的地址
      pageIndex: 1,
      searchName: '',
      beforeSearchName: '',
      isClickDow: false,
      elementId: '',
      covers: [
        // 坐标
        {
          // 当前位置
          id: 1,
          latitude: 39.909,
          longitude: 116.39742,
          iconPath: '../../static/images/curr.png',
          width: 50,
          height: 50,
          // #ifdef MP-WEIXIN
          alpha: 0,
          // #endif
        },
      ],
      sidePosition: [], // 列表数组
    };
  },
  computed: {
    mapStyle() {
      return this.latLon
        ? 'height: 90vh;'
        : this.isClickDow
        ? 'height: 45vh;'
        : 'height: 60vh;';
    },
    conList() {
      return this.latLon
        ? 'height: 10vh;'
        : this.isClickDow
        ? 'height: 55vh;'
        : 'height: 40vh;';
    },
  },
  methods: {
    // 下拉的icon
    handleDow() {
      this.isClickDow = false;
    },
    // 点击键盘搜索
    handleConfirm() {
      this.pageIndex = 1;
      this.sidePosition = [];
      uni.hideKeyboard();
    },
    // 获取焦点事件
    focusInp(e) {
      this.isClickDow = true;
    },
    // input 失去焦点时
    blurInp() {
      this.pageIndex = 1;
      this.sidePosition = [];
      this.getList();
    },
    // list 滚动到最底下时
    handleLower(e) {
      this.pageIndex++;
      this.getList();
    },
    // 发送信息的页面
    // $emit(eventName, data)
    handleOkBtn() {
      let data = `${this.address},${this.changeLatitude},${this.changeLongitude}`;
      uni.$emit(this.elementId, {
        data,
      });
      uni.navigateBack();
    },
    // 取消返回上个页面
    handleOffBtn() {
      uni.navigateBack();
    },
    // app 移动图标
    moveToLocation(val) {
      let nmap = this.navMap;
      nmap.moveToLocation({
        longitude: val.longitude,
        latitude: val.latitude,
      });
    },
    // 赋值 有经纬度的时候
    giveDate(curpos, address, movepos) {
      // 当前位置，当前地址，移动位置
      this.latitude = movepos.latitude; //当前位置经度
      this.longitude = movepos.longitude; //当前位置纬度
      this.covers[0].latitude = curpos.latitude; //当前位置经度
      this.covers[0].longitude = curpos.longitude; //当前位置纬度
      this.covers[1].latitude = movepos.latitude; //移动置经度
      this.covers[1].longitude = movepos.longitude; //移动位置纬度
      this.address = address || this.address; //当前位置纬度
    },
    // 赋值 没有经纬度的时候
    giveDate1(curpos, address) {
      this.latitude = curpos.latitude; //当前位置经度
      this.longitude = curpos.longitude; //当前位置纬度
      this.covers[0].latitude = curpos.latitude; //当前位置经度
      this.covers[0].longitude = curpos.longitude; //当前位置纬度
      this.address = address || this.address; //当前位置纬度
    },
    givemoveDate(movepos, address) {
      this.latitude = movepos.latitude; //当前位置经度
      this.longitude = movepos.longitude; //当前位置纬度
      this.address = address || this.address; //当前位置纬度
    },
    // 点击列表
    handlechange(val, index) {
      this.isclickList = true;
      this.sidePosition.forEach((item) => (item.check = false));
      this.sidePosition[index].check = true;
      let pos = val.location;
      let address = val.name === '地图位置' ? val.address : val.name;
      // #ifdef APP-PLUS
      this.givemoveDate(pos, address);
      // #endif
      // #ifdef MP-WEIXIN
      this.givemoveDate(pos, address);
      // #endif
    },
    // 获取数组
    getList() {
      uni.hideKeyboard();
      if (this.searchName !== this.beforeSearchName) {
        this.sidePosition = [];
        this.pageIndex = 1;
      }
      this.beforeSearchName = this.searchName;
      let point = {
        latitude: this.changeLatitude,
        longitude: this.changeLongitude,
      };
      // 获取周边地理位置
      // #ifdef APP-PLUS
      mapSearch.reverseGeocode(
        {
          point: { latitude: point.latitude, longitude: point.longitude },
        },
        (res) => {
          this.address = res.address;
          mapSearch.poiSearchNearBy(
            {
              point: { latitude: point.latitude, longitude: point.longitude },
              key: this.searchName,
              radius: 9999999,
              index: this.pageIndex,
            },
            (res) => {
              if (this.pageIndex === 1) {
                this.sidePosition.push({
                  location: {
                    longitude: point.longitude,
                    latitude: point.latitude,
                  },
                  distance: 0,
                  address: this.address,
                  check: true,
                  name: '地图位置',
                });
              }
              res.poiList.forEach((val, i) => {
                val.check = false;
                this.sidePosition.push(val);
              });
            }
          );
        }
      );
      // #endif
      // #ifdef MP-WEIXIN
      let poi_options = 'radius=5000;page_size=10;page_index=' + this.pageIndex;
      this.searchName
        ? (poi_options += ';address_format=' + this.searchName)
        : '';
      if (this.searchName) {
        this.qqmapsdk.search({
          keyword: this.searchName,
          location: {
            latitude: point.latitude,
            longitude: point.longitude,
          },
          page_index: this.pageIndex,
          success: (res) => {
            if (this.pageIndex === 1) {
              this.sidePosition.push({
                location: {
                  longitude: point.longitude,
                  latitude: point.latitude,
                },
                distance: 0,
                address: this.address,
                check: true,
                name: '地图位置',
              });
            }
            res.data.forEach((val) => {
              val.check = false;
              val.name = val.title; // 统一处理成 name
              val.distance = val._distance; // 统一处理
              val.location.latitude = val.location.lat;
              val.location.longitude = val.location.lng;
              this.sidePosition.push(val);
            });
          },
          fail: (error) => {
            uni.showModal({
              title: '提示',
              content: JSON.stringify(error),
            });
          },
        });
      } else {
        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude: point.latitude,
            longitude: point.longitude,
          },
          get_poi: 1,
          poi_options: poi_options,
          success: (res) => {
            this.address = res.result.address;
            if (this.pageIndex === 1) {
              this.sidePosition.push({
                location: {
                  longitude: point.longitude,
                  latitude: point.latitude,
                },
                distance: 0,
                address: this.address,
                check: true,
                name: '地图位置',
              });
            }
            res.result.pois.forEach((val) => {
              val.check = false;
              val.name = val.title; // 统一处理成 name
              val.distance = val._distance; // 统一处理
              val.location.latitude = val.location.lat;
              val.location.longitude = val.location.lng;
              this.sidePosition.push(val);
            });
          },
          fail: (error) => {
            uni.showModal({
              title: '提示',
              content: JSON.stringify(error),
            });
          },
        });
      }
      // #endif
      // #ifdef H5
      // https://apis.map.qq.com/ws/place/v1/search
      // uni.request({
      // 	url: 'https://apis.map.qq.com/ws/place/v1/search',
      // 	data: '',
      // 	method: 'GET',
      // 	success: (res) => {
      // 	},
      // 	fail: (error) => {
      // 	}
      // })
      this.$http
        .get(
          'https://apis.map.qq.com/ws/place/v1/search',
          {
            output: 'jsonp',
            key: 'QTMBZ-4OLW6-2RBSY-M75PM-WORRE-5YB7X',
            boundary: `nearby(${point.latitude},${point.longitude},1000)`,
          },
          {
            dataType: 'jsonp',
          }
        )
        .then((res) => {})
        .catch((err) => {});
      // #endif
    },
    // 移动地图变化
    onRegionChange(e) {
      if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
        if (!this.latLon) {
          this.pageIndex = 1;
          this.sidePosition = [];
          this.navMap = uni.createMapContext('map1', this);
          this.navMap.getCenterLocation({
            success: (res) => {
              this.changeLongitude = res.longitude;
              this.changeLatitude = res.latitude;
              if (!this.isclickList) {
                this.sidePosition = [];
                this.pageIndex = 1;
                this.getList();
              }
              this.isclickList = false;
            },
            fail: () => {
              uni.showToast({
                title: '获取定位失败',
                icon: 'none',
              });
            },
          });
        }
      }
    },
    // 点击当前位置图标
    handleCurrPos() {
      let curpos = {
        latitude: this.covers[0].latitude,
        longitude: this.covers[0].longitude,
      };
      this.moveToLocation(curpos);
    },
    // 初始化地图
    init() {
      uni.getLocation({
        type: 'gcj02', //返回可以用于uni.openLocation的经纬度
        success: (curpos) => {
          let movepos = '';
          if (this.latLon) {
            let latLon = this.latLon.split(',');
            movepos = {
              latitude: Number(latLon[1]),
              longitude: Number(latLon[2]),
            };
            this.haveaddress = latLon[0];
            this.covers.push({
              // 移动的位置
              id: 2,
              latitude: 39.909,
              longitude: 116.39742,
              iconPath: '../../static/images/location.png',
              width: 50,
              height: 50,
            });
            this.giveDate(curpos, '', movepos);
          } else {
            this.giveDate1(curpos);
            // #ifdef MP-WEIXIN
            this.changeLongitude = curpos.longitude;
            this.changeLatitude = curpos.latitude;
            this.getList();
            // #endif
            // #ifdef APP-PLUS
            let navMapNative = uni.createMapContext('map1', this).$getAppMap(); // uni-app map中的地图
            navMapNative.onstatuschanged = (e) => {
              this.changeLongitude = e.center.longitude;
              this.changeLatitude = e.center.latitude;
              if (!this.isclickList) {
                this.sidePosition = [];
                this.pageIndex = 1;
                this.getList();
              }
              this.isclickList = false;
            };
            // #endif
          }
        },
        fail: (error) => {
          uni.showModal({
            title: '提示',
            content: JSON.stringify(error),
          });
        },
      });
    },
  },
  onLoad(options) {
    this.elementId = options.elementId;
    this.latLon = options.latLon;
    // #ifdef MP-WEIXIN
    this.qqmapsdk = new QQMapWX({
      key: this.key,
    });
    // #endif
  },
  mounted() {
    this.navMap = uni.createMapContext('map1', this); // uni-app map中的地图
    this.init(); // 初始化
  },
};
</script>
<style lang="scss" scoped>
.page-body {
  flex: 1;
  width: 750rpx;
  height: 100vh;
  background: #fff;
  position: relative;
  padding-bottom: 5rem;
  overflow: hidden;
  .m-map {
    width: 750rpx;
    height: 60vh;
    position: relative;
    .headerBtn {
      width: 750rpx;
      /* #ifdef APP-PLUS */
      height: 180rpx;
      /* #endif */
      /* #ifndef APP-PLUS */
      height: 250rpx;
      /* #endif */
    }
    .okBtn,
    .offBtn {
      width: 120rpx;
      height: 60rpx;
      text-align: center;
      line-height: 50rpx;
      position: absolute;
      color: white;
      font-size: 30rpx;
      z-index: 99999;
      /* #ifdef MP */
      top: 150rpx;
      /* #endif */
      /* #ifndef MP */
      top: 80rpx;
      /* #endif */
    }
    .okBtn {
      right: 30rpx;
      background-color: #05c160;
      border-radius: 5rpx;
    }
    .offBtn {
      left: 25rpx;
      font-size: 35rpx;
    }
    .controls-img {
      width: 100rpx;
      height: 100rpx;
      position: absolute;
      right: 40rpx;
      bottom: 90rpx;
      z-index: 99999;
    }
    .controls-pos {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50px;
      height: 50px;
      margin-top: -60px;
      margin-left: -25px;
    }
  }
  .pointContent {
    width: 750rpx;
    height: 40vh;
    position: absolute;
    bottom: 0;
    background: white;
    .iconsty {
      display: flex;
      flex-direction: row;
      z-index: 99999;
      .icon {
        flex: 1;
        text-align: center;
        margin-top: 10rpx;
      }
    }
    .input {
      background: #f2f2f2;
      height: 4vh;
      border-radius: 28rpx;
      width: 690rpx;
      height: 60rpx;
      margin: 0 auto;
      margin-top: 10rpx;
      margin-bottom: 10rpx;
      padding-left: 30rpx;
    }
    .poslist {
      width: 690rpx;
      margin: 0 auto;
      margin-top: 40rpx;
      .font1 {
        font-size: 34rpx;
        display: flex;
        flex-direction: row;
        height: 45rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        .icon {
          color: #31d387;
          flex: 1;
          text-align: right;
        }
        .name {
          flex: 3;
        }
      }
      .font2 {
        color: #cccccc;
        font-size: 24rpx;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
}
</style>
