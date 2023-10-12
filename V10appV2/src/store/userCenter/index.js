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
    // 设置用户签名图片地址
    setSignatureImage(state, img) {
      if (img) {
        state.userInfo.signatureImage = img;
      }
    },
  },
  actions: {},
};
