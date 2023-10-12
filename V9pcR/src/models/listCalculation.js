/*
 * @Author: jwk
 * @Date:   2022-08-23 09:26:11
 * @Desc: 计算栏前端记忆
 */

import pathToRegexp from 'path-to-regexp';

const initState = {
  elementComputedObj: {
  }, // 所有计算栏控件的计算类型集合
};

export default {
  state: initState,
  subscriptions: {
    setup: (({ history, dispatch }) => {
      history.listen(location => {
        const matchMainPage = pathToRegexp('/').exec(location.pathname);
        if (matchMainPage) {
         const calculation = sessionStorage.getItem('calculation') || '{}';
         const newCalculation = JSON.parse(calculation);
          dispatch({
            type: 'listCalculation/updateState',
            payload: {
              ...newCalculation
            },
          });
        }
      });
    }),
  },
  effects: {},
  reducers: {
    // 通用性更新
    updateState(state, { payload }) {
      const obj = { ...state, ...payload };
      console.log(obj);
      sessionStorage.setItem('calculation', JSON.stringify(obj));
      return obj;
    },
  },
};
