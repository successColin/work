export default {
  state: {
    checkUsers: {},
  },
  mutations: {
    // 设置人员选择框中的选中人员
    setSelectUserCheck(state, { selectFlag, checkUsers }) {
      state.checkUsers[selectFlag] = checkUsers;
    },
  },
  actions: {},
};
