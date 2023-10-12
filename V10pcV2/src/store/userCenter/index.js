/*
 * @Description: '个人中心vuex'
 * @Author: cmk
 * @Date: 2021-04-19 17:54:53
 * @Last Modified by: cmk
 * @Last Modified time: 2021-06-23 11:39:41
 */
export default {
  state: {
    userInfo: {},
    allUser: {},
    token: '',
  },
  mutations: {
    // 个人信息详情
    setUserInfo(state, userInfo) {
      // console.log(userInfo);
      state.userInfo = userInfo;
    },
    // 个人信息详情
    setAllUser(state, userInfo) {
      if (userInfo.id) {
        state.allUser[userInfo.id] = userInfo;
      } else {
        state.allUser = {};
      }
    },
    setToken(state, token) {
      state.token = token;
    },
  },
  actions: {},
};
