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
