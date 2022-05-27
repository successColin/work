export default {
  state: {
    // 近期搜索
    lastSearche: {},
    // 最近一次高级筛选
    lastFilterSeach: {},
  },
  getters: {},
  mutations: {
    setSearchLast(state, { searchFlag, lastSearchList }) {
      state.lastSearche[searchFlag] = lastSearchList;
    },
    setSearchFilter(state, { searchFlag, form }) {
      state.lastFilterSeach[searchFlag] = form;
    },
  },
  actions: {},
};
