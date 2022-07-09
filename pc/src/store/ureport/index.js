/*
 * @Description: '实体管理vuex'
 * @Author: cmk
 * @Date: 2021-04-19 17:54:53
 * @Last Modified by: ytx
 * @Last Modified time: 2022-07-09 16:43:39
 */

export default {
  state: {
    isNoodQuery: true,
  },
  mutations: {
    changeIsNoodQuery(state, v) {
      state.isNoodQuery = v;
    },
  },
};
