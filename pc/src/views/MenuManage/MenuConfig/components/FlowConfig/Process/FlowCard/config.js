export default {
  start: { // 开始节点
    type: 'start',
    content: '所有人',
    properties: { title: '发起人', initiator: 'ALL', nodeHelp: '', }
  },
  approver: { // 审批节点
    type: 'approver',
    content: '请设置审批人',
    properties: { title: '审批节点', nodeHelp: '', }
  },
  copy: { //
    type: 'copy',
    content: '发起人自选',
    properties: {
      title: '抄送人',
      menbers: [],
      userOptional: true,
      nodeHelp: '',
    }
  },
  fill: { // 填写节点
    type: 'fill',
    content: '请设置填写人',
    properties: {
      title: '填写节点',
      nodeHelp: '',
    }
  },
  condition: { // 分支节点
    type: 'condition',
    // content: '请设置条件',
    content: '',
    properties: { title: '分支', conditions: [], initiator: null, nodeHelp: '', }
  },
  backend_data: { //  后台数据节点
    type: 'backend_data',
    content: '请设置后台数据',
    properties: { title: '后台数据', nodeHelp: '', }
  },
  webhook: { // 外部接口
    type: 'webhook',
    content: '请设置外部接口请求',
    properties: { title: '外部接口', nodeHelp: '', }
  },
  notice: { // 消息通知
    type: 'notice',
    content: '请设置消息模板',
    properties: { title: '消息通知', nodeHelp: '', }
  },
  procedure: {
    type: 'procedure',
    content: '请设置存储过程数据',
    properties: { title: '存储过程', nodeHelp: '', }
  },
  branch: { type: 'branch', content: '', properties: {} },
  empty: { type: 'empty', content: '', properties: {} }, // 分支开始节点
  condition_group_end: { type: 'condition_group_end', content: '', properties: {} }
};
