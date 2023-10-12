export default {
  state: {
    search: {
      // 搜索界面的下拉框
      downPropObj: {},
    },
  },
  getters: {
    getICSearchDown(state) {
      return state.search.downPropObj;
    },
  },
  mutations: {
    setICSearchDown(state, { flag, list }) {
      state.search.downPropObj[flag] = list;
    },
  },
  actions: {},
};
