/*
 * @Description: '实体管理vuex'
 * @Author: cmk
 * @Date: 2021-04-19 17:54:53
 * @Last Modified by: ytx
 * @Last Modified time: 2022-05-09 18:36:33
 */
import { getListByKey } from '@/api/globalConfig';
import { changeThemeColor } from '@/utils/themeColorClient';

export default {
  state: {
    logoUrl: require('@/views/Layout/components/LayoutHeader/images/logo.png'), // logo图片
    logoHeight: 18, // logo 图片的高度
    menuType: 1, // 1 是v9 2 是传统 3 模块菜单
    themeConfig: {}, // 主题配置正常数据
    themeConfigArr: [], // 主题配置源数据
  },
  getters: {
    getMenuType(state) {
      return state.menuType;
    },
    getThemeConfig(state) {
      return state.themeConfig;
    },
  },
  mutations: {
    // 设置logo高度
    setLogoHeight(state, logoHeight) {
      state.logoHeight = logoHeight;
    },
    // 将原数据处理成正常数据
    reduceDataToThemeConfig(state, res = []) {
      let obj = {};
      res.forEach((item) => {
        const { attributeKey, attributeValue } = item;
        if (attributeKey === 'themeColor') {
          const a =
            attributeValue || localStorage.getItem('theme_color') || '#4689f5';
          obj = {
            ...obj,
            [attributeKey]: a,
          };
          changeThemeColor(a);
        } else if (
          attributeKey === 'menuStyle' ||
          attributeKey === 'homePageLogoWidth'
        ) {
          const b = Number(attributeValue);
          obj = {
            ...obj,
            [attributeKey]: b,
          };
        } else {
          obj = {
            ...obj,
            [attributeKey]: attributeValue,
          };
        }
      });
      state.themeConfigArr = res;
      state.themeConfig = obj;
      console.log(state);
      state.menuType = state.themeConfig.menuStyle || 1;
    },
    // 设置主题及相关配置
    setThemeConfig(state, { key, value }) {
      state.themeConfig[key] = value;
    },
    // 更改菜单类型
    changeMenuType(state, v) {
      state.menuType = v;
    },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async fetchThemeConfig({ commit }, key) {
      const res = await getListByKey({ parameterKey: key });
      commit('reduceDataToThemeConfig', res);
    },
  },
};
