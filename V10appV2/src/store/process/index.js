export default {
  state: {
    // 流程面板配置信息
    processConfigs: {},
    // 流程节点信息
    processNodes: [],
  },
  getters: {},
  mutations: {
    // 设置流程面板配置信息
    setProcessConfig(state, { config, nodeId }) {
      state.processConfigs[nodeId] = { ...config };
    },
    // 设置流程节点信息
    setProcessNodes(state, nodes) {
      state.processNodes = nodes;
    },
  },
  actions: {},
};
