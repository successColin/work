<script>
// eslint-disable-next-line no-unused-vars
import { updateVersionTree, getNodeInfo, updateNodeInfo, editNode } from '@/api/flow';
import FlowCard from './FlowCard';
import FlowActionBar from './FlowActionBar';
import FlowList from './FlowList';
import ConfigDrawer from './ConfigDrawer';
import FlowHelpInfoDialog from './FlowHelpInfoDialog';
import { NodeUtils } from './FlowCard/util.js';

export default {
  name: 'Process',
  components: {
    FlowActionBar,
    FlowCard,
    FlowList,
    ConfigDrawer,
    FlowHelpInfoDialog
  },
  props: {
    activeFlow: { // 选中的流程
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeVersion: {}, // 当前使用的流程版本
      nodeInfoId: null, // 节点配置信息
      nodeInfo: {}, // 节点配置信息
      visible: true, // 每次初始化默认打开流程列表
      data: {}, // 流程图数据
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
      updateId: 0, // key值 用于模拟$forceUpdate
      activeData: null, // 被激活的流程卡片数据，用于属性面板编辑
      isProcessCmp: true,
      verifyMode: false,
      drawer: false, // 配置属性弹框
      helpInfoVisible: false, // 节点帮助信息弹框
      loading: false,
      nodeDataSource: {} // 节点属性原值
    };
  },
  mounted() {
    this.$bus.$off('handle-close-flowConfig').$on('handle-close-flowConfig', () => {
      this.drawer = false;
      this.activeData = null;
    });
    this.$bus.$off('handle-close-flowGlobalConfig').$on('handle-close-flowGlobalConfig', () => {
      this.drawer = false;
    });
    this.$bus.$off('chooseFlowVersion').$on('chooseFlowVersion', (message) => {
      // 流程版本
      // console.log(message, 'this.activeVersion');
      this.activeVersion = message;
      this.data = {};
      this.data = message.workflowTree;
      this.updateId += 1;
      // console.log(this.data, 'render');
    });
  },
  beforeDestroy() {
    this.$bus.$off('handle-close-flowConfig');
    this.$bus.$off('handle-close-flowGlobalConfig');
    this.$bus.$off('chooseFlowVersion');
  },
  methods: {
    toggle(visible) {
      // 流程列表显示隐藏
      this.visible = visible;
    },
    // 给父级组件提供的获取流程数据得方法
    getData() {
      this.verifyMode = true;
      if (NodeUtils.checkAllNode(this.data)) {
        return Promise.resolve({ formData: this.data });
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ target: this.tabName });
    },
    changeHelpInfo(config) {
      // 修改帮助信息
      // console.log('弹框谈谈谈', config);
      this.helpInfoVisible = true;
      this.activeData = config;
      this.submitFlowTree();
    },
    async updateNodeTitle(obj) {
      // console.log(obj, '修改');
      // 修改标题名称
      await this.submitFlowTree();
      await editNode({
        id: obj.nodeId,
        nodeTitle: obj.properties.title,
        nodeType: obj.type.toUpperCase(),
        prevNodeId: obj.prevId || null,
        workflowVersionId: this.activeVersion.id
      });
    },
    /**
     * 接收所有FlowCard事件触发
     * @param { Object } data - 含有event(事件名称)/args(参数)两个属性
     */
    async eventReciver({ event, args }) {
      console.log(event, ...args, 'xxxxx');
      const { id: flowVersionId, versionStatus } = this.activeVersion;
      // eslint-disable-next-line no-unreachable
      if (event === 'edit') {
        // eslint-disable-next-line prefer-destructuring
        this.activeData = args[0]; // 打开属性面板
        await this.fetchNodeDetials();
        // console.log(event, args[0], this.activeData);
        return;
      }
      if (['HISTORY', 'CURRENT'].includes(versionStatus)) {
        this.$message.error('历史版本或者使用中的版本不允许添加删除节点');
        return;
      }
      // 本实例只监听了第一层数据（startNode）变动
      // 为了实时更新  采用$forceUpdate刷新 但是由于某些条件下触发失效（未排除清除原因）
      // 使用key + 监听父组件updateId方式强制刷新
      // const newData = { ...args };
      NodeUtils.setFlowVersinId(flowVersionId);
      await NodeUtils[event](...args);
      await this.forceUpdate();
    },

    async fetchNodeDetials() {
      // 获取节点详情
      try {
        const { nodeId, type } = this.activeData;
        const data = await getNodeInfo({ nodeId });
        const { attributes = '{}', id } = data;
        const obj = JSON.parse(attributes);
        const newAttributes = {
          ...obj,
        };
        if (type === 'condition') {
          newAttributes.tableName = this.data.type === 'start' ? this.data.properties.tableName : '';
        }
        if (!attributes) {
          this.nodeInfo = {};
        } else {
          this.nodeInfo = newAttributes;
        }
        this.nodeInfoId = id;
        this.nodeDataSource = data;
        this.$nextTick(() => {
          this.drawer = true;
        });
      } catch (e) {
        // console.log(e);
      }
    },
    async submitFlowGlobalConfig(config) {
      // 提交全局属性配置
      try {
        this.loading = true;
        await updateVersionTree({
          id: this.activeVersion.id,
          globalAttributes: config
        });
        this.$message.success('保存成功!');
        this.activeVersion = {
          ...this.activeVersion,
          globalAttributes: config
        };
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    handleCancelHelp() {
      this.helpInfoVisible = false;
      this.activeData = null;
    },
    doSubmitInfo(value) {
      // 修改帮助信息
      this.activeData.properties = value;
      this.handleCancelHelp();
      this.forceUpdate();
    },
    async forceUpdate() {
      this.updateId += 1;
      await this.submitFlowTree();
    },
    async submitFlowTree() {
      // 提交流程数据
      try {
        await updateVersionTree({
          id: this.activeVersion.id,
          workflowTree: this.data
        });
      } catch (e) {
        // console.log(e);
      }
    },
    /**
     * 控制流程图缩放
     * @param { Object } val - 缩放增量 是step的倍数 可正可负
     */
    changeScale(e, val) {
      e.stopPropagation();
      const v = this.scaleVal + val;
      if (v > 0 && v <= 200) {
        // 缩放介于0%~200%
        this.scaleVal = v;
      }
    },
    /**
     * 属性面板提交事件
     * @param { Object } value - 被编辑的节点的properties属性对象
     */
    async onPropEditConfirm(value, content, others) {
      this.activeData.content = content || '请设置条件';
      // console.log(value);
      // const oldProp = this.activeData.properties;
      // this.activeData.properties = value;
      // 修改优先级
      if (NodeUtils.isConditionNode(this.activeData)) {
        // eslint-disable-next-line no-unused-expressions
        // value.priority !== oldProp.priority
        // && NodeUtils.resortPrioByCNode(this.activeData, oldProp.priority, this.data);
        NodeUtils.setDefaultCondition(this.activeData, this.data);
      }
      if (others) {
        this.activeVersion = {
          ...this.activeVersion,
          globalAttributes: {
            ...this.activeVersion.globalAttributes,
            tableRelation: others
          }
        };
      }
      await this.handleUpdateNodeInfo(value, content);
      // if (NodeUtils.isStartNode(this.activeData)) this.$emit('startNodeChange', this.data);
      this.onClosePanel();
    },
    async handleUpdateNodeInfo(value, content) {
      const { config } = value;
      const { id, ...rest } = this.nodeDataSource;
      const params = {
        // workflowNode: {
        id,
        ...rest,
        nodeContent: content,
        attributes: JSON.stringify(config),
        // }
        // workflowNodeAttr: {
        //   id: this.nodeInfoId,
        //   nodeId: this.activeData.nodeId
        // }
      };
      try {
        await updateNodeInfo(params);
        await this.forceUpdate();
      } catch (e) {
        console.log(e);
      }
    },
    /**
     * 属性面板取消事件
     */
    onClosePanel() {
      this.drawer = false;
      this.activeData = null;
    },
    chooseOtherFlow(flowItem) {
      // 选中的流程
      this.activeFlow = flowItem;
    },
    // 传formIds 查询指定组件 未传时  判断所有组件
    isFilledPCon(formIds) {
      let res = false;
      // eslint-disable-next-line no-use-before-define
      const loopChild = (parent, callback) => parent.childNode && loop(parent.childNode, callback);
      const loop = (data, callback) => {
        if (res || !data) return; // 查找到就退出
        if (Array.isArray(data.conditionNodes)) {
          const uesd = data.conditionNodes.some((c) => {
            const cons = c.properties.conditions || [];
            // 只要有节点设置了条件 说明就有组件作为条件被使用
            // eslint-disable-next-line max-len
            return Array.isArray(formIds)
              ? cons.some((item) => formIds.includes(item.formId))
              : cons.length > 0;
          });
          // eslint-disable-next-line no-unused-expressions
          uesd ? callback() : data.conditionNodes.forEach((t) => loopChild(t, callback));
        }
        loopChild(data, callback);
      };
      // eslint-disable-next-line no-return-assign
      loop(this.data, () => (res = true));
      return res;
    },
    doCloseDrawer() {
      this.drawer = false;
      this.$bus.$emit('flowNodeConfigIsClose');
    }
  },
  // eslint-disable-next-line no-unused-vars
  render(h) {
    return (
      <div class="flow-wrap">
        <flow-action-bar
          activeFlow={this.activeFlow}
          currentVersion={this.activeVersion}
          onToggleFlowList={this.toggle}
        />
        <div class="flow-container" onClick={this.doCloseDrawer}>
          <div class="scale-slider">
            <span class="scaleWrap">{this.scaleVal}%</span>
            <i class="icon-fangda iconfont" onClick={(e) => this.changeScale(e, this.step)}></i>
            <i class="icon-suoxiao iconfont" onClick={(e) => this.changeScale(e, -this.step)}></i>
          </div>
          <flow-card
            verifyMode={this.verifyMode}
            key={this.updateId}
            data={this.data}
            onEmits={this.eventReciver}
            onUpdateNodeTitle={this.updateNodeTitle}
            onChangeHelpInfo={this.changeHelpInfo}
            scaleVal={this.scaleVal}
          />
          <config-drawer
            onhandleCloseConfig={this.onPropEditConfirm}
            drawer={this.drawer}
            activeData={this.activeData}
            nodeInfo={this.nodeInfo}
            flowData={this.data}
            currentVersion={this.activeVersion}
            onSubmitGlobalConfig={this.submitFlowGlobalConfig}
            loading={this.loading}
          />
          <flow-help-info-dialog
            onHandleCancelHelp={this.handleCancelHelp}
            visible={this.helpInfoVisible}
            activeData={this.activeData}
            onHandleSubmit={this.doSubmitInfo}
          />
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="scss">
$bg-color: #f5f5f7;
.flow-wrap {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 111;
}

.flow-container {
  display: inline-block;
  background: $bg-color;
  padding: 20px 20px 0 20px;
  width: 100%;
  height: calc(100% - 46px);
  box-sizing: border-box;
  text-align: center;
  overflow: auto;
}

.scale-slider {
  position: fixed;
  right: 357px;
  bottom: 16px;
  width: 144px;
  height: 34px;
  display: flex;
  padding-left: 9px;
  background: #FFFFFF;
  align-items: center;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16);
  border-radius: 4px;
  z-index: 99;
  .scaleWrap{
    display: inline-block;
    width: 48px;
    font-size: 12px;
    border-right: 1px solid #E9E9E9;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #444444;
  }

  .iconfont {
    display: inline-block;
    padding: 4px;
    background: #fff;
    margin-left: 10px;
    margin-right: 10px;
    color: #BBC3CD;
    cursor: pointer;
  }
  .iconfont:hover {
    color: #4689f5;
  }
}
</style>
