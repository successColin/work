import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import base from './base/index';
import dictManage from './dictManage/index';
import Inspection from './Inspection';
import interfaceCommon from './interfaceCommon';
import map from './map/index';
import menu from './menu/index';
import search from './search';
import serverInfo from './serverInfo';
import userCenter from './userCenter';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    base,
    dictManage,
    interfaceCommon,
    menu,
    map,
    userCenter,
    Inspection,
    search,
    serverInfo,
  },
  plugins: [
    createPersistedState({
      storage: {
        // 以uniapp 为例
        getItem: (key) => uni.getStorageSync(key),
        setItem: (key, value) => uni.setStorageSync(key, value),
        removeItem: (key) => uni.removeStorageSync(key),
      },
      reducer(state) {
        // console.log(state);
        return {
          search: state.search,
          serverInfo: state.serverInfo,
        };
      },
    }),
  ],
});
