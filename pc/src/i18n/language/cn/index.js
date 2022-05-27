/*
 * @Descripttion:
 * @version:
 * @Author: tjf
 * @Date: 2021-04-25 14:23:58
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-20 15:01:13
 */
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';
import appconfig from './appconfig';
import common from './common';
import dictionary from './dictionary';
import entity from './entityManage';
import expression from './expression';
import globalConfig from './globalConfig';
import helpCenter from './helpCenter';
import importTemplate from './importTemplate';
import login from './login';
import menuConfig from './menuConfig';
import menu from './menuManage';
import messageShow from './messageShow';
import messageTemplate from './messageTemplate';
import org from './orgManage';
import post from './postManage';
import role from './role';
import systemLog from './systemLog';
import tenant from './tenant';
import timedTask from './timedTask';
import userCenter from './userCenter';

export default {
  ...common,
  ...dictionary,
  ...login,
  ...entity,
  ...expression,
  ...org,
  ...tenant,
  ...post,
  ...role,
  ...zhLocale,
  ...menu,
  ...messageTemplate,
  ...globalConfig,
  ...userCenter,
  ...systemLog,
  ...helpCenter,
  ...menuConfig,
  ...timedTask,
  ...importTemplate,
  ...messageShow,
  ...appconfig,
};
