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
  },
  mutations: {
    // 个人信息详情
    setUserInfo(state, userInfo) {
      // console.log(userInfo);
      state.userInfo = userInfo;
    },
  },
  actions: {},
};
