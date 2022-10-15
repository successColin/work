/*
 * @Author: sss
 * @Date: 2021-04-27 15:53:39
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-28 09:27:29
 * @descrition: 消息模板
 */

export default {
  messageTemplate: {
    messageTemplate: '消息模板',
    templateName: '模板名称',
    sendingService: '发送服务',
    receiver: '接收人',
    enable: '是否启用',
    variable: '变量',
    choice: '选择%{any}',
    permanentStaff: '固定人员',
    fixedRole: '固定角色',
    mobileMumber: '变量手机号',
    WX: '变量微信号',
    email: '变量邮件',
    service: '配置服务',
    contentTemplate: '内容模板',
    sign: '签名',
    templateCode: '短信模板编码',
    title: '标题',
    address: '跳转地址',
    whether: '是否%{any}',
    secrecy: '保密',
    timeInterval: '重复消息检查时间间隔',
    duplicateMessageCheck: '重复消息检查',
    variableName: '变量名称',
    variableCode: '变量编码',
    serve: '服务',
    more: '添加更多',
    subject: '邮件主题',
    isExist: '%{any}已经存在',
    startUp: '启动',
    disable: '禁用',
    rules: {
      variableCode: '只支持字母和下划线',
    },
    viewVarConfirmTip: 'SQL变量未提取，退出将无法保存SQL与其对应变量！',
    serveColumn: {
      name: '服务名称',
      code: '服务编码',
      provider: '服务商',
      endpoint: '接口域名',
      accessKeyId: '应用ID',
      accessKeySecret: '应用密钥',
      applyPublicKey: '应用公钥',
      applyPrivateKey: '应用私钥',
      corpId: '企业ID',
      host: '代理地址',
      port: '代理端口',
      username: '账号',
      password: '授权码',
      rules: {
        required: '%{name}必填',
      },
    },
  },
};
