/*
 * @Author: cmk
 * @Date: 2021-04-07 08:47:38
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-19 16:54:24
 * @Des:
 */
import { fetchHomeRoute } from '@/api/design';
import { getLoginConfig } from '@/api/login';
import { menuCenter, menuCenterFav } from '@/api/menuManage';
import { selectColorArr } from '@/config';
import bus from '@/utils/bus';
// import router from '@/router';

function resolveMenu(module, state) {
  if (module.children) {
    module.children.forEach((menu) => {
      menu.zIndex = module.zIndex + 1;
      if (+menu.menuLevel === 2) {
        menu.isCollect = false;
        // console.log(menu.routeName, 'menu');
        if (!menu.routeName || /^MENU/.test(menu.routeName)) {
          menu.path = `/menu/${menu.id}?title=${menu.menuName}`;
          menu.routeName = 'ApiotMenu';
        } else if (/^homeMenu/.test(menu.routeName)) {
          // console.log(menu.routeName, 'menu.routeName');
        } else {
          menu.path = `/${menu.routeName}`;
        }
        if (!state.allRouteName.includes(menu.routeName)) {
          // arr.push(...tmepRoute);
          state.allRouteName.push(menu.routeName);
        }
      } else {
        resolveMenu(menu, state);
      }
    });
  }
}

function arrToObj(arr, obj) {
  if (Array.isArray(arr)) {
    arr.forEach((item) => {
      obj[item.id] = item;
      if (item.children) {
        arrToObj(item.children, obj);
      }
    });
  }
}
export default {
  state: {
    allRouteName: ['home'], // 所有路由的名字,默认路由名字home必须包含
    clientModuleArr: ['menu'], // 用户自定义模块的名字
    routeArr: [], // 异步获取的路由
    routeAuthArr: [], // 异步获取的路由
    routeObj: {}, // 路由对象
    homeArr: [], // 主页菜单
    curModuleId: -1, // 当前模块id
    curMenuId: -1, // 当前菜单id
    loginThemeColor: '#4689f5',
    loginConfig: {},
  },
  getters: {
    getRouteArr(state) {
      return state.routeArr;
    },
    getRouteObj(state) {
      return state.routeObj;
    },
    getCurMenu(state) {
      return (menuId) => state.routeObj[menuId];
    },
    getMenuResource(state) {
      return (menuId) => {
        const temp = state.routeObj[menuId];
        if (temp && temp.resourceItemIds) {
          return [...new Set(temp.resourceItemIds)];
        }
        return [];
      };
    },
  },
  mutations: {
    changeRouteArr(state, arr) {
      state.routeArr = arr;
      const routeObj = {};
      arrToObj(arr, routeObj);
      state.routeObj = routeObj;
      const recentlyTabArr =
        JSON.parse(sessionStorage.getItem('recentlyTabArr')) || [];
      const navTabArr = JSON.parse(sessionStorage.getItem('navTabArr')) || [];

      const recentlyTabArrNew = [];
      const navTabNew = [];

      recentlyTabArr.forEach((val) => {
        if (routeObj[val.id]) {
          recentlyTabArrNew.push(val);
        }
      });
      navTabArr.forEach((val) => {
        if (routeObj[val.id]) {
          navTabNew.push(val);
        }
      });
      sessionStorage.setItem(
        'recentlyTabArr',
        JSON.stringify(recentlyTabArrNew),
      );
      sessionStorage.setItem('navTabArr', JSON.stringify(navTabNew));
      bus.$emit('routerReset');
    },
    changeRouteAuthArr(state, arr) {
      state.routeAuthArr = arr;
    },
    changeLoginThemeColor(state, val) {
      document
        .getElementsByTagName('body')[0]
        .style.setProperty('--loginThemeColor', val);
      state.routeAuthArr = val;
    },
    changeLoginConfig(state, val) {
      state.loginConfig = val;
    },
    // 更改当前路由id
    changeCurMenuId(state, id) {
      state.curMenuId = id;
    },
    changeHomeArr(state, arr) {
      state.homeArr = arr;
    },
  },
  actions: {
    // 获取登录配置
    async getLoginConfigFun({ commit }) {
      const res = (await getLoginConfig()) || [];
      const obj = {};
      res.forEach((item) => {
        const { attributeKey, attributeValue } = item;
        obj[attributeKey] = attributeValue;
      });
      const themeColor = obj.themeColor
        ? selectColorArr[Number(obj.themeColor) - 1]
        : '#4689f5';
      if (themeColor) {
        commit('changeLoginThemeColor', themeColor);
      }
      commit('changeLoginConfig', obj);
    },
    //   获取服务器的路由
    async getRoute({ commit, state }) {
      const params = {
        keywords: '',
        menuClientType: 'PC',
      };
      try {
        state.allRouteName = ['home', 'homePage'];
        const data = await menuCenter(params);
        const arr = [];
        data.forEach((module) => {
          if (module.children) {
            module.zIndex = 1;
            resolveMenu(module, state);
          }
          if (module.routeName !== 'sysHome') {
            arr.push(module);
          }
        });
        commit('changeRouteArr', arr);
        commit('changeRouteAuthArr', data);
      } catch (error) {
        console.log(error);
        // router.push('/login');
      }
    },
    // 获取主页的路由
    async getHomeRoute({ commit }) {
      try {
        const res = await fetchHomeRoute();
        const newRes = res.map((item) => {
          const { homePageId } = item;
          item.path = `/homePage/${homePageId}`;
          return item;
        });
        commit('changeHomeArr', newRes);
      } catch (e) {
        console.log(e);
      }
    },
    // eslint-disable-next-line
    async getFavRoute({ state }, params) {
      try {
        const data = await menuCenterFav(params);
        data.forEach((menu) => {
          menu.isCollect = true;
          if (menu.parentId !== 0) {
            if (!menu.routeName || /^MENU/.test(menu.routeName)) {
              menu.path = `/menu/${menu.id}?title=${menu.menuName}`;
            } else {
              menu.path = `/${menu.routeName}`;
            }
          }
        });
        // console.log(state);
        return Promise.resolve(data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
  },
};
