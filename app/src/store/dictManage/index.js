import { listDict } from '@/api/dictManage';
import vue from 'vue';

export default {
  state: {
    USER_STATE: [], // 用户状态
    TABLES_TYPE: [], // 实体__表类型
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
    PROCESS_STATUS: [
      // 流程状态
      {
        name: '被驳回',
        value: 'REJECTED',
        zhCN: '被驳回',
        enUS: 'Rejected',
      },
      {
        name: '进行中',
        value: 'IN_PROGRESS',
        zhCN: '进行中',
        enUS: 'Inprogress',
      },
      {
        name: '已完成',
        value: 'COMPLETED',
        zhCN: '已完成',
        enUS: 'Completed',
      },
      {
        name: '已撤回',
        value: 'REVOKED',
        zhCN: '已撤回',
        enUS: 'Revoked',
      },
    ],
  },
  getters: {
    getCurDict(state) {
      return function (dictName) {
        return state[dictName];
      };
    },
  },
  mutations: {
    // 初始化
    setCurrentDict(state, { dictName, dictArr }) {
      dictArr.forEach((item) => {
        item.name = item[`${uni.getStorageSync('apiotLanguage')}`] || item.zhCN;
        item.value = +item.value;
      });
      if (state[dictName]) state[dictName] = dictArr;
      else vue.set(state, dictName, dictArr);
    },
    // 更换语言
    changeLanguage(state) {
      //   待定
      Object.keys(state).forEach((key) => {
        if (Array.isArray(state[key])) {
          state[key].forEach((item) => {
            if (item[`${uni.getStorageSync('apiotLanguage')}`]) {
              item.name = item[`${uni.getStorageSync('apiotLanguage')}`];
            }
          });
        }
      });
    },
  },
  actions: {
    async getCurrentDict({ commit }, dictName) {
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
