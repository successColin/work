export default {
  // 短信
  Column_1: [
    {
      label: 'messageTemplate.serveColumn.name',
      prop: 'serverName',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.provider',
      prop: 'provider',
      compName: 'EditSelectColumn',
      dictName: 'SMS_PROVIDER',
      width: 100,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.endpoint',
      prop: 'endpoint',
      compName: 'EditInputColumn',
      width: 160,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.accessKeyId',
      prop: 'accessKeyId',
      compName: 'EditInputColumn',
      width: 200,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.accessKeySecret',
      prop: 'accessKeySecret',
      compName: 'EditInputColumn',
      width: 160,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
  ],
  // 邮件
  Column_2: [
    {
      label: 'messageTemplate.serveColumn.name',
      prop: 'serverName',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.host',
      prop: 'host',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.port',
      prop: 'port',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.username',
      prop: 'username',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.password',
      prop: 'password',
      compName: 'EditInputColumn',
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
  ],
  // 微信
  Column_3: [
    {
      label: 'messageTemplate.serveColumn.name',
      prop: 'serverName',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.corpId',
      prop: 'corpId',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.accessKeyId',
      prop: 'agentId',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.accessKeySecret',
      prop: 'corpSecret',
      compName: 'EditInputColumn',
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
  ],
  // dingding
  Column_5: [
    {
      label: 'messageTemplate.serveColumn.name',
      prop: 'serverName',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.corpId',
      prop: 'corpId',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.accessKeyId',
      prop: 'agentId',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.applyPublicKey',
      prop: 'appKey',
      compName: 'EditInputColumn',
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.applyPrivateKey',
      prop: 'appSecret',
      compName: 'EditInputColumn',
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
  ],
  // 浙政钉
  Column_6: [
    // 服务名称
    {
      label: 'messageTemplate.serveColumn.name',
      prop: 'serverName',
      compName: 'EditInputColumn',
      width: 150,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    // 平台地址
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.platformAddress',
      prop: 'domain',
      compName: 'EditInputColumn',
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    // 协议
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.agreement',
      prop: 'protocal',
      compName: 'EditSelectColumn',
      dictName: 'ZZD_AGREEMENT',
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    // 应用key
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.applicationKey',
      prop: 'accessKey',
      compName: 'EditInputColumn',
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
    // 应用秘钥
    {
      type: 'serverProps',
      label: 'messageTemplate.serveColumn.applicationSecretKey',
      prop: 'secretKey',
      compName: 'EditInputColumn',
      showPassword: true,
      rules: [
        {
          required: true,
          message: 'messageTemplate.serveColumn.rules.required',
        },
      ],
    },
  ],
};
