/*
 * @Author: sss
 * @Date: 2021-04-27 15:53:39
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-28 09:27:44
 * @descrition: 消息模板
 */

export default {
  messageTemplate: {
    messageTemplate: 'Message Template',
    templateName: 'Template Name',
    sendingService: 'Sending Service',
    receiver: 'Receiver',
    enable: 'Enable',
    variable: 'Variable',
    choice: 'Choice %{any}',
    permanentStaff: 'User',
    fixedRole: 'Role',
    mobileMumber: 'Mobile',
    WX: 'WX',
    email: 'Email',
    service: 'Service',
    contentTemplate: 'Content Template',
    sign: 'Sign',
    templateCode: 'Template Code',
    title: 'Title',
    address: 'Jump Address',
    whether: 'Whether %{any}',
    secrecy: 'Secrecy',
    timeInterval: 'Time Interval',
    duplicateMessageCheck: 'Duplicate Message Check',
    variableName: 'Variable Name',
    variableCode: 'Variable Code',
    serve: 'Serve',
    more: 'More',
    subject: 'Subject',
    isExist: '%{any} is Exist',
    startUp: 'Start Up',
    disable: 'Disable',
    rules: {
      variableCode: 'only letters and underscores are supported',
    },
    viewVarConfirmTip:
      'SQL variables are not extracted, exit will not save SQL and its corresponding variables!',
    serveColumn: {
      name: 'Serve Name',
      code: 'Serve Code',
      provider: 'Service Provider',
      endpoint: 'Domain',
      accessKeyId: 'AccessKeyID',
      accessKeySecret: 'SecretKey',
      corpId: 'CorpID',
      host: 'Host',
      port: 'Port',
      username: 'Account',
      password: 'Authorization',
      rules: {
        required: '%{name} Is Required',
      },
    },
  },
};
