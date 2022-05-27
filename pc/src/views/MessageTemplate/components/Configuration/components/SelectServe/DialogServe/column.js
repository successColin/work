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
};
