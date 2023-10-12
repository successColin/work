import { geoMapKey } from '@/config/index.js';
// #ifdef APP-PLUS || MP-WEIXIN || H5
import amap from '@/utils/wx/amap-wx.130.js';

const amapFun = new amap.AMapWX({ key: geoMapKey.MP_KEY });
// #endif

export default {
  state: {
    selectedLocation: {}, // 地图上选中的点
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
    setSelectedLocation(state, { flag, location = {} }) {
      const position = { ...location };
      position.name = position.name || position.address;
      console.log(state);
      state.selectedLocation[flag] = position;
    },
  },
  actions: {
    // 获取中文状态的详细地址
    getAddress({ commit, state }, position = {}) {
      return new Promise((resolve, reject) => {
        const { location: oldLocation } = state;
        const { currentLocation = {}, locations = [], type = 'set' } = position;
        const { latitude, longitude } = currentLocation;

        if (
          oldLocation.latitude === latitude &&
          oldLocation.longitude === longitude
        ) {
          resolve(oldLocation);
          return false;
        }

        let amapLocation = '';
        if (latitude || longitude) {
          amapLocation = `${longitude},${latitude}`;
        }

        amapFun.getRegeo({
          location: amapLocation,
          success(data) {
            console.log(data);
            if (data.length > 0) {
              const { name, regeocodeData } = data[0];
              const address = name || amapLocation;
              const location = { ...currentLocation };
              location.name = name;
              location.address = address;
              location.regeocodes = regeocodeData;
              if (type === 'set') {
                commit('setLocation', {
                  location,
                  locations,
                });
              }

              resolve(location);
            }
          },
          fail(error) {
            reject(error);
          },
        });
      });
    },
  },
};
