import { listDict } from '@/api/dictManage';

export default {
  state: {
    USER_STATE: [], // 用户状态
    TABLES_TYPE: [
      // {
      //   zhCN: '系统',
      //   enUS: 'system',
      //   value: 1,
      //   name: '系统',
      // },
      // { zhCN: '客户', enUS: 'client', value: 2, name: '客户' },
    ], // 实体__表类型
    REQUISITE_TYPE: [], // 实体__是否必填
    COLUMNS_TYPE: [], // 实体__字段类型
    INDEXES_TYPE: [{ name: 'Normal', value: 1 }], // 实体__索引类型
    INDEXES_METHOD: [{ name: 'Btree', value: 1 }], // 实体__索引方法
    TENANT_STATE: [], // 租户__状态
    TENANT_TYPE: [], // 租户__类型
    DATASOURCE_TYPE: [], // 租户__数据源类型
    DRIVER_TYPE: [], // 租户__驱动类型
    TENANT_USER_STATE: [], // 租户用户状态
    TENANT_USER_TYPE: [], // 租户用户类型
    DICT_TYPE: [], // 字典分组
    PASSWORD_VALIDITY_PERIOD: [], // 全局参数__密码有效期
    LOGIN_DURATION: [], // 全局参数__登录时长
    EXPRESSION_GROUOP: [], // 表达式__分组
    EXPRESSION_TYPE: [], // 表达式__类型
    TEMPLATE_TYPE: [], // 导入模板__类型
    INNER_MAIL_TYPE: [], // 消息模板__站内信类型
    MESSAGE_TYPE: [], // 消息模板__服务类型
    RECEIVER_TYPE: [], // 消息模板__消息接收对象类型
    VARIABLE_TYPE: [], // 消息模板__消息变量类型
    SMS_PROVIDER: [], // 消息模板__短信服务商类型
    JOB_TYPE: [], // 定时任务类型
    JOB_STATUS: [], // 定时任务状态
    JOB_EXECUTE_RESULT: [], // 定时任务执行结果
    // DICT-00128(打印模板模板类型),DICT-00131(打印模板元素类型)
    TRIGGER_TYPE: [
      {
        name: '影响控件属性',
        value: 1,
        zhCN: '影响控件属性',
        enUS: 'AffectControlProp',
      },
      {
        name: '调用外部接口',
        value: 2,
        zhCN: '调用外部接口',
        enUS: 'CallExterInterface',
      },
      {
        name: '影响后台数据',
        value: 3,
        zhCN: '影响后台数据',
        enUS: 'AffectBackData',
      },
      {
        name: '调用存储过程',
        value: 4,
        zhCN: '调用存储过程',
        enUS: 'CallStoredProcedure',
      },
    ], // 勿删，动作类型 , 没存数据库，前端使用
  },
  getters: {
    getCurDict(state) {
      return function(dictName) {
        return state[dictName];
      };
    },
  },
  mutations: {
    // 初始化
    setCurrentDict(state, { dictName, dictArr }) {
      if (dictArr) {
        dictArr.forEach((item) => {
          item.name = item[`${localStorage.apiotLanguage}`] || item.zhCN;
          item.value = +item.value;
        });
        state[dictName] = dictArr;
      }
    },
    // 更换语言
    changeLanguage(state) {
      //   待定
      Object.keys(state).forEach((key) => {
        if (Array.isArray(state[key])) {
          state[key].forEach((item) => {
            if (item[`${localStorage.apiotLanguage}`]) {
              item.name = item[`${localStorage.apiotLanguage}`];
            }
          });
        }
      });
    },
  },
  actions: {
    async getCurrentDict({ commit }, dictName) {
      // 判断是否请求过该dict
      // const arr = dictName.split(',');
      // const index = arr.findIndex((name) => {
      //   if (!state[name]) {
      //     return true;
      //   }
      //   if (state[name].length === 0) {
      //     return true;
      //   }
      //   return false;
      // });
      // if (index === -1) {
      //   return;
      // }
      const data = await listDict({ dictKeys: dictName });
      const dictArr = Array.isArray(dictName) ? dictName : dictName.split(',');
      dictArr.forEach((dict) => {
        commit('setCurrentDict', {
          dictName: dict,
          dictArr: data[dict.trim()],
        });
      });
    },
  },
};
