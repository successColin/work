<template>
  <baidu-map
    class="map"
    style="height: 500px"
    :center="center"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    @ready="ready"
    @click="mapClick"
  >
    <bm-geolocation
      anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
      :showAddressBar="false"
      :autoLocation="true"
      @locationSuccess="locationSuccess"
      @locationError="locationError"
    ></bm-geolocation>
    <bm-control class="map__search">
      <bm-auto-complete
        :sugStyle="{ zIndex: 10000 }"
        :location="location"
        @confirm="confirm"
        @searchcomplete="searchcomplete"
      >
        <el-input
          ref="map__input"
          style="width: 300px"
          v-model="keyword"
          @focus="flag = true"
          class="map__search--input"
          placeholder="请输入地址关键字"
        ></el-input>
        <!-- 这里指代一个自定义搜索框组件 -->
      </bm-auto-complete>
    </bm-control>
    <bm-city-list
      anchor="BMAP_ANCHOR_TOP_LEFT"
      @changeAfter="changeAfter"
    ></bm-city-list>
  </baidu-map>
</template>

<script>
export default {
  name: '',
  props: {
    configData: {
      type: Object
    },
    curValue: {
      type: [Array, String]
    },
    isConfig: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      center: { lng: 116.331398, lat: 39.897445 },
      zoom: 15,
      BMap: null,
      map: null,
      keyword: '',
      location: '',
      flag: true,
      shouldInit: true
    };
  },
  created() {
    console.log(this.curValue);
    if (this.configData.defaultValueType === 2 && this.curValue) {
      [this.center] = this.curValue;
    }
  },
  components: {},
  methods: {
    ready({ BMap, map }) {
      // console.log(BMap, map);
      this.BMap = BMap;
      this.map = map;
      this.setCenter();
    },
    setCenter() {
      // console.log(this.configData.defaultValueType);
      if (this.configData.defaultValueType === 1 || (this.isConfig && !this.curValue)) {
        const geolocation = new this.BMap.Geolocation();
        // 开启SDK辅助定位
        geolocation.enableSDKLocation();
        geolocation.getCurrentPosition((r) => {
          if (!this.shouldInit) {
            return;
          }
          if (r) {
            this.center = {
              lng: r.point.lng,
              lat: r.point.lat
            };
            this.keyword = '';
            // this.keyword = `${r.address.province}${r.address.city}${r.address.street}`;
            this.location = r.address.city;
            this.map.panTo(r.point);
            this.$emit('changeValue', {
              lng: r.point.lng,
              lat: r.point.lat,
              name: `${r.address.city}`
            });
          } else {
            console.log('定位失败');
          }
        });
      } else {
        this.map.clearOverlays();
        const mk = new this.BMap.Marker(this.center);
        this.map.addOverlay(mk);
        this.map.panTo(this.center);
        setTimeout(() => {
          const elArr = document.querySelectorAll('.tangram-suggestion-main');
          elArr.forEach((el) => {
            el.classList.add('notShowMapRes');
          });
          this.flag = false;
          this.keyword = this.curValue[0].name;
        }, 1000);
      }
    },
    locationSuccess({ point }) {
      const obj = { point };
      this.mapClick(obj);
    },
    locationError({ statusCode }) {
      console.log(statusCode);
    },
    changeAfter() {
      let el = document.querySelector(`#${this.configData.compId} #cur_city_name`);
      if (!el) {
        el = document.querySelector('#cur_city_name');
      }
      this.keyword = '';
      this.location = el.innerHTML;
    },
    confirm({ item }) {
      const elArr = document.querySelectorAll('.tangram-suggestion-main');
      elArr.forEach((el) => {
        el.classList.add('notShowMapRes');
      });
      this.flag = false;
      this.$refs.map__input.blur();
      this.map.clearOverlays();
      const myValue = `${item.value.province}${item.value.city}${item.value.district}${item.value.street}${item.value.business}`;
      const myGeo = new this.BMap.Geocoder();
      // 将地址解析结果显示在地图上，并调整地图视野
      myGeo.getPoint(
        myValue,
        (point) => {
          if (point) {
            const mk = new this.BMap.Marker(point);
            this.map.addOverlay(mk);
            this.map.panTo(point);
            this.$emit('changeValue', {
              lng: point.lng,
              lat: point.lat,
              name: myValue
            });
          } else {
            console.log('您选择的地址没有解析到结果！');
          }
        },
        `${item.value.city}`
      );
    },
    searchcomplete() {
      // console.log(this.flag);
      if (this.flag) {
        const notShowArr = document.querySelectorAll('.notShowMapRes');
        notShowArr.forEach((el) => {
          el.classList.remove('notShowMapRes');
        });
      }
    },
    mapClick({ point }) {
      // console.log(type, target, point);
      const elArr = document.querySelectorAll('.tangram-suggestion-main');
      elArr.forEach((el) => {
        el.classList.add('notShowMapRes');
      });
      this.flag = false;
      this.map.clearOverlays();
      const mk = new this.BMap.Marker(point);
      this.map.addOverlay(mk);
      this.map.panTo(point);
      const myGeo = new this.BMap.Geocoder();
      // 根据坐标得到地址描述
      myGeo.getLocation(point, (result) => {
        if (result) {
          this.keyword = result.address;
          this.$emit('changeValue', {
            lng: point.lng,
            lat: point.lat,
            name: result.address
          });
          // console.log(result.address);
        }
      });
    }
  },
  watch: {
    curValue(v) {
      // console.log(v);
      if (v && this.map && this.BMap) {
        let tempArr = v;
        if (!Array.isArray(v)) {
          tempArr = JSON.parse(v);
        }
        const [point] = tempArr;
        this.map.clearOverlays();
        const mk = new this.BMap.Marker(point);
        this.map.addOverlay(mk);
        this.map.panTo(point);
        this.shouldInit = false;
        setTimeout(() => {
          const elArr = document.querySelectorAll('.tangram-suggestion-main');
          elArr.forEach((el) => {
            el.classList.add('notShowMapRes');
          });
          this.flag = false;
          this.keyword = point.name;
        }, 1000);
      }
      if (!v && this.map && this.map) {
        this.shouldInit = true;
        this.setCenter();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .anchorBL {
    display: none !important;
  }
  .map__search {
    inset: 10px auto auto 76px !important;
    &--res {
      position: absolute;
      top: 42px;
      left: 10px;
    }
  }
  #city_ctrl_form {
    display: flex !important;
    align-items: center !important;
  }
  .citylist_popup_main .city_content_top {
    padding-top: 0 !important;
    height: 45px !important;
    line-height: 45px !important;
  }
  .ui_city_change {
    height: 30px !important;
    a {
      height: 30px !important;
      line-height: 30px !important;
      display: flex !important;
      align-items: center;
      border-color: #e9e9e9 !important;
      i {
        top: -2px !important;
      }
    }
  }
  .ui_city_change_click .ui_city_change_inner i {
    top: 3px !important;
  }
}
</style>
<style>
.notShowMapRes {
  display: none !important;
}
</style>
