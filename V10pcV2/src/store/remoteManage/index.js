/*
 * @Description: '个人中心vuex'
 * @Author: cmk
 * @Date: 2021-04-19 17:54:53
 * @Last Modified by: cmk
 * @Last Modified time: 2021-06-23 11:39:41
 */
export default {
  state: {
    remoteClient: null,
    userList: [],
  },
  mutations: {
    // 个人信息详情
    setRemoteClient(state, client) {
      console.log(client, 'client');
      state.remoteClient = client;
    },
    setUserList(state, list) {
      state.userList = list;
    },
    delUserList(state, userObj) { // 删除用户
      const arr = state.userList;
      const i = arr.findIndex((item) => item.id === +userObj.id);
      if (i !== -1) {
        arr.splice(i, 1);
        state.userList = arr;
      }
    },
    updateUserInfo(state, userObj) { // 修改用户信息
      const arr = state.userList;
      const i = arr.findIndex((item) => item.id === +userObj.id);
      const targetObj = arr[i] || {};
      if (i === -1) {
        arr.push(userObj);
      } else {
        arr.splice(i, 1, { ...targetObj, ...userObj });
      }
      state.userList = arr;
    },
  },
  actions: {},
};
