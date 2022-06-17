export default {
  state: {
    userInfo: {},
  },
  mutations: {
    // 个人信息详情
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      uni.setStorageSync('userCenter', userInfo);
    },
  },
  actions: {},
};
