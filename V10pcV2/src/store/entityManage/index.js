/*
 * @Description: '实体管理vuex'
 * @Author: cmk
 * @Date: 2021-04-19 17:54:53
 * @Last Modified by: cmk
 * @Last Modified time: 2021-04-21 17:27:17
 */
export default {
  state: {
    entityGroup: [], // 实体缓存
  },
  mutations: {
    // 设置实体缓存
    setEntityGroup(state, groupArr) {
      state.entityGroup = groupArr;
    },
  },
  actions: {},
};
