/*
 * @Descripttion:
 * @version:
 * @Author: sss
 * @Date: 2021-04-25 14:23:58
 * @LastEditors: sss
 * @LastEditTime: 2021-05-20 15:01:13
 */
import common from './common';
import login from './login';
import tabNavMenu from './tabNavMenu';
import inspection from './inspection';
import mine from './mine';
import message from './message';
import calendar from './calendar';

export default {
  ...common,
  ...login,
  ...tabNavMenu,
  ...inspection,
  ...mine,
  ...message,
  ...calendar
};
