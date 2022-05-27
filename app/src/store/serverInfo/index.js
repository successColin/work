export default {
  state: {
    serverAddress: [],
    customAdress: {
      name: '其他环境',
      url: '',
      isCheck: false,
      type: 1,
    },
  },
  getters: {},
  mutations: {
    setServerInfoAddress(state, address = {}) {
      const serverArry = [];
      const names = {
        production: '正式环境',
        testExtranet: '外网测试环境',
        testIntranet: '内网测试环境',
      };
      Object.keys(address).forEach((key) => {
        const url = address[key];

        if (url) {
          let isCheck = false;
          if (!state.customAdress.isCheck) isCheck = serverArry.length === 0;
          if (isCheck) uni.setStorageSync('currentServe', url);
          serverArry.push({
            flag: key,
            name: names[key],
            url,
            isCheck,
            type: 2,
          });
        }
      });
      state.serverAddress = [...serverArry];
    },
    setServerCheck(state, { type, flag, url }) {
      console.log(url);
      uni.setStorageSync('currentServe', url);
      if (type === 1) {
        // 其他环境
        state.customAdress.isCheck = true;
        state.serverAddress.map((item) => {
          item.isCheck = false;
          return item;
        });
      } else {
        state.customAdress.isCheck = false;
        state.serverAddress.map((item) => {
          if (item.flag === flag) item.isCheck = true;
          else item.isCheck = false;
          return item;
        });
      }
    },
    // 设置其他环境地址
    setServerCustomAdress(state, url) {
      state.customAdress.url = url;
    },
  },
  actions: {},
};
