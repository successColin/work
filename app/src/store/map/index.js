import { geoMapKey } from '@/config/index.js';
// #ifdef APP-PLUS || MP-WEIXIN
import amap from '@/utils/wx/amap-wx.130.js';
// #endif

export default {
  state: {
    location: {
      latitude: null, // 纬度
      longitude: null, // 经度
      speed: null, // 速度
      name: '', // 地址名称
      address: '', // 定位结构地址
      regeocodes: {}, // 逆地理编码列表,包括具体城市
    },
    locationsPool: [], // 定位池，包括位置变化的一系列点
  },
  getters: {},
  mutations: {
    setLocation(state, { location, locations }) {
      const position = { ...location };
      position.name = position.name || position.address;
      state.location = position;
      state.locationsPool = [...locations];
      console.log(state.location);
    },
  },
  actions: {
    // 获取中文状态的详细地址
    getAddress({ commit }, position) {
      const { currentLocation, locations } = position;
      const { latitude, longitude } = currentLocation;
      let amapLocation = '';
      if (latitude || longitude) {
        amapLocation = `${longitude},${latitude}`;
      }
      const amapFun = new amap.AMapWX({ key: geoMapKey.MP_KEY });
      amapFun.getRegeo({
        location: amapLocation,
        success(data) {
          if (data.length > 0) {
            const { name, regeocodeData } = data[0];
            console.log(data[0]);
            console.log(regeocodeData);
            const address = name || amapLocation;
            const location = { ...currentLocation };
            location.name = name;
            location.address = address;
            location.regeocodes = regeocodeData;
            commit('setLocation', {
              location,
              locations,
            });
          }
        },
        fail() {},
      });
    },
  },
};
