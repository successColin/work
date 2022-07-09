<script>
import { NodeUtils } from './util.js';

const isCondition = (data) => data.type === 'condition';
const notEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;
const hasBranch = (data) => notEmptyArray(data.conditionNodes);
// eslint-disable-next-line no-unused-vars
const stopPro = (ev) => ev.stopPropagation();
// eslint-disable-next-line no-unused-vars
function createNormalCard(ctx, conf, h) {
  const classList = ['flow-path-card'];
  const afterTrue = (isTrue, name) => {
    if (isTrue) {
      classList.push(name);
    }
    return isTrue;
  };
  const isStartNode = afterTrue(NodeUtils.isStartNode(conf), 'start-node');
  const isApprNode = afterTrue(NodeUtils.isApproverNode(conf), 'approver');
  const isFillInNode = afterTrue(NodeUtils.isFillInNode(conf), 'fill');
  const isBackEndNode = afterTrue(NodeUtils.isBackEndNode(conf), 'backend_data');
  const isWebHookNode = afterTrue(NodeUtils.isWebHookNode(conf), 'webhook');
  const isProcedureNode = afterTrue(NodeUtils.isProcedureNode(conf), 'procedure');
  const isNoticeNode = afterTrue(NodeUtils.isNoticeNode(conf), 'notice');
  // const isCopyNode = afterTrue(NodeUtils.isCopyNode(conf), 'copy');
  // const isConditionNode = isCondition(conf);
  const renderText = (str) => {
    if (!str) return '请设置审批人员';
    // eslint-disable-next-line no-undef
    return decodeURIComponent(str);
  };
  return (
    <section class={classList.join(' ')}>
      <header class="header">
        <div class="title-box" style="height: 100%;width:190px;">
          {isStartNode && (
            <span
              class="iconfont icon-shujubiao"
              style="font-size:18px;color:white;margin-right:4px;"
            ></span>
          )}
          <span class="title-text">{conf.properties.title}</span>
          <input
            vModel_trim={conf.properties.title}
            ref={conf.nodeId}
            class="title-input"
            style="margin-top:4px; width: 78%;"
            onClick={stopPro}
            onBlur={(e) => this.changeNodeTitle(e, conf)}
          />
        </div>
        {!!conf.properties.nodeHelp && (
          <div class="actionsTips">
            <el-tooltip
              popper-class="flowTips"
              content={conf.properties.nodeHelp}
              size="200"
              placement="top"
            >
              <span
                class="iconfont icon-bangzhu"
                onClick={() => this.changeNodeHelpInfo(conf, false)}
              ></span>
            </el-tooltip>
          </div>
        )}
        <div class="actions" style="margin-right:4px;">
          {/* eslint-disable-next-line max-len */}
          {/* <i class="el-icon-close icon" onClick={this.eventLancher.bind(ctx, 'deleteNode', conf, ctx.data)}></i> */}
          <el-popover
            placement="right"
            width="196"
            trigger="click"
            popper-class="nodeOperation"
            visible-arrow={false}
          >
            <div class="operationBox">
              <div class="operationItem" onClick={() => this.editNodeTitle(conf)}>
                <span class="iconfont icon-bianji"></span>
                编辑节点
              </div>
              <div class="operationItem" onClick={() => this.changeNodeHelpInfo(conf, true)}>
                <span class="iconfont icon-bangzhu"></span>
                节点帮助说明
              </div>
              {!isStartNode && (
                <div
                  class="operationItem"
                  onClick={this.eventLancher.bind(ctx, 'deleteNode', conf, ctx.data)}
                >
                  <span class="iconfont icon-shanchu"></span>
                  删除节点
                </div>
              )}
            </div>
            <i
              class="iconfont icon-gengduocaozuo"
              ref={`operationClick_${conf.nodeId}`}
              slot="reference"
            ></i>
          </el-popover>
        </div>
      </header>
      <div class="body" onClick={this.eventLancher.bind(ctx, 'edit', conf)}>
        {/* <span class="text">{conf.content}</span> */}
        {isStartNode && (
          <span
            class="text"
            {...{
              domProps: {
                innerHTML: conf.content
              }
            }}
          ></span>
        )}
        {isApprNode && (
          <span
            className="text"
            {...{
              domProps: {
                innerHTML: renderText(conf.content)
              }
            }}
          ></span>
        )}
        {isFillInNode && (
          <span
            class="text"
            {...{
              domProps: {
                innerHTML: renderText(conf.content)
              }
            }}
          ></span>
        )}
        {isBackEndNode && (
          <span
            class="text"
            {...{
              domProps: {
                innerHTML: renderText(conf.content)
              }
            }}
          ></span>
        )}
        {isWebHookNode && (
          <span
            class="text"
            {...{
              domProps: {
                innerHTML: renderText(conf.content)
              }
            }}
          ></span>
        )}
        {isProcedureNode && (
          <span
            class="text"
            {...{
              domProps: {
                innerHTML: renderText(conf.content)
              }
            }}
          ></span>
        )}
        {isNoticeNode && (
          <span
            class="text"
            {...{
              domProps: {
                innerHTML: renderText(conf.content)
              }
            }}
          ></span>
        )}
      </div>
    </section>
  );
}

const createFunc = (...arg) => createNormalCard.call(arg[0], ...arg);
const nodes = {
  start: createFunc,
  approver: createFunc,
  copy: createFunc,
  fill: createFunc,
  backend_data: createFunc,
  webhook: createFunc,
  procedure: createFunc,
  notice: createFunc,
  // eslint-disable-next-line no-unused-vars
  empty: (_) => '',
  // eslint-disable-next-line no-unused-vars
  condition_group_end: (_) => '',
  // eslint-disable-next-line no-unused-vars
  condition(ctx, conf) {
    return (
      <section class="flow-path-card condition">
        <header class="header">
          <div class="title-box" style="height: 30px;width:160px;">
            <span class="title-text">{conf.properties.title}</span>
            <input
              vModel_trim={conf.properties.title}
              class="title-input"
              style="margin-top:4px;"
              onClick={stopPro}
              ref={conf.nodeId}
              onBlur={(e) => this.changeNodeTitle(e, conf)}
            />
          </div>
          {/* <span class="priority">优先级{conf.properties.priority + 1}</span> */}
          {!!conf.properties.nodeHelp && (
            <div class="actionsTips">
              <el-tooltip
                popper-class="flowTips"
                content={conf.properties.nodeHelp}
                placement="top"
              >
                <span
                  class="iconfont icon-bangzhu"
                  onClick={() => this.changeNodeHelpInfo(conf, false)}
                ></span>
              </el-tooltip>
            </div>
          )}
          <div class="actions">
            <el-popover
              placement="right"
              width="196"
              trigger="click"
              popper-class="nodeOperation"
              visible-arrow={false}
            >
              <div class="operationBox">
                <div class="operationItem" onClick={() => this.editNodeTitle(conf)}>
                  <span class="iconfont icon-bianji"></span>
                  编辑节点
                </div>
                <div class="operationItem" onClick={() => this.changeNodeHelpInfo(conf, true)}>
                  <span class="iconfont icon-bangzhu"></span>
                  节点帮助说明
                </div>
                <div
                  class="operationItem"
                  onClick={this.eventLancher.bind(ctx, 'deleteNode', conf, ctx.data)}
                >
                  <span class="iconfont icon-shanchu"></span>
                  删除节点
                </div>
              </div>
              <i
                class="iconfont icon-gengduocaozuo"
                ref={`operationClick_${conf.nodeId}`}
                slot="reference"
              ></i>
            </el-popover>
          </div>
        </header>
        <div class="body" onClick={this.eventLancher.bind(ctx, 'edit', conf)}>
          <div
            class="text"
            {...{
              domProps: {
                innerHTML: conf.content || '所有数据可进入该分支'
              }
            }}
          ></div>
          {!conf.content && (
            <span class="setFilterData" onClick={this.eventLancher.bind(ctx, 'edit', conf)}>
              设置筛选条件
            </span>
          )}
        </div>
      </section>
    );
  }
};

function addNodeButton(ctx, data, h, isBranch = false) {
  // 只有非条件节点和条件分支树下面的那个按钮 才能添加新分支树
  // eslint-disable-next-line no-unused-vars
  const couldAddBranch = !hasBranch(data) || isBranch;
  const isEmpty = data.type === 'empty';
  if (isEmpty && !isBranch) {
    return '';
  }

  const process = [
    // 流程节点
    {
      name: '审批',
      eventName: 'addApprovalNode',
      color: '#EE5E5E',
      icon: 'icon-shenpi'
    },
    {
      name: '分支',
      eventName: 'appendBranch',
      color: '#BBC3CD',
      icon: 'icon-fenzhi'
    },
    {
      name: '子流程',
      eventName: '',
      color: '#5A80ED',
      icon: 'icon-ziliucheng'
    }
    // { name: '抄送人', eventName: 'addCopyNode', color: '#5A80ED' },
  ];
  const dataProcessing = [
    // 数据处理节点
    {
      name: '填写',
      eventName: 'addFillInNode',
      color: '#34C7BE',
      icon: 'icon-tianxie'
    },
    // {
    //   name: '外部接口',
    //   eventName: 'addWebHookNode',
    //   color: '#FAB71C',
    //   icon: 'icon-waibujiekou'
    // },
    {
      name: '后台数据',
      eventName: 'addBackEndDataNode',
      color: '#FAB71C',
      icon: 'icon-houtaishuju'
    },
    {
      name: '存储过程',
      eventName: 'addProcedureNode',
      color: '#FAB71C',
      icon: 'icon-cunchuguocheng'
    },
    {
      name: '消息通知',
      eventName: 'addMessageNode',
      color: '#FC8256',
      icon: 'icon-cunchuguocheng'
    }
  ];
  return (
    <div class="add-node-btn-box flex  justify-center">
      <div class="add-node-btn">
        <el-popover
          visible-arrow={false}
          placement="right"
          trigger="click"
          width="340"
          transition="ltr-drawer-in"
          popper-class="nodeSelection"
        >
          <div class="node-content">
            <div class="node-title">流程结构</div>
            <el-row gutter={10} class="box">
              {process.map((item) => (
                <el-col span={8} key={item.name}>
                  <div
                    class="box-item"
                    onClick={ctx.eventLancher.bind(ctx, item.eventName, data, isBranch)}
                  >
                    <div class="condition-icon">
                      <i class={`iconfont ${item.icon}`} style={{ color: item.color }}></i>
                    </div>
                    <div class="node-name">{item.name}</div>
                  </div>
                </el-col>
              ))}
            </el-row>
            <div class="node-title">数据处理</div>
            <el-row gutter={10} class="box">
              {dataProcessing.map((item) => (
                <el-col span={8} key={item.name}>
                  <div class="box-item">
                    <div
                      class="condition-icon"
                      onClick={ctx.eventLancher.bind(ctx, item.eventName, data, isBranch)}
                    >
                      <i class={`iconfont ${item.icon}`} style={{ color: item.color }}></i>
                    </div>
                    <div class="node-name">{item.name}</div>
                  </div>
                </el-col>
              ))}
            </el-row>
          </div>
          <button class="btn" type="button" slot="reference">
            <i class="icon-jiahao iconfont"></i>
          </button>
        </el-popover>
      </div>
    </div>
  );
}

function NodeFactory(ctx, data, h) {
  if (!data || JSON.stringify(data) === '{}') return;
  const showErrorTip = ctx.verifyMode && NodeUtils.checkNode(data) === false;
  const res = [];
  let branchNode = '';
  const selfNode = (
    <div class="node-wrap">
      <div class={`node-wrap-box ${data.type} ${showErrorTip ? 'error' : ''}`}>
        {nodes[data.type].call(ctx, ctx, data, h)}
        {addNodeButton.call(ctx, ctx, data, h)}
      </div>
    </div>
  );

  if (hasBranch(data)) {
    // 如果节点是数组 一定为条件分支 添加分支样式包裹
    branchNode = (
      <div class="branch-wrap">
        <div class="branch-box-wrap">
          <div class="branch-box  flex justify-center relative">
            <button class="btn" onClick={this.eventLancher.bind(ctx, 'appendConditionNode', data)}>
              添加条件
            </button>
            {data.conditionNodes.map((d) => NodeFactory.call(ctx, ctx, d, h))}
          </div>
        </div>
        {data.type !== 'empty' && addNodeButton.call(ctx, ctx, data, h, true)}
      </div>
    );
  }

  if (isCondition(data)) {
    return (
      <div class="col-box">
        <div class="center-line"></div>
        <div class="top-cover-line"></div>
        <div class="bottom-cover-line"></div>
        {selfNode}
        {branchNode}
        {NodeFactory.call(ctx, ctx, data.childNode, h)}
      </div>
    );
  }
  // eslint-disable-next-line no-unused-expressions
  res.push(selfNode);
  // eslint-disable-next-line no-unused-expressions
  branchNode && res.push(branchNode);
  // eslint-disable-next-line no-unused-expressions
  data.childNode && res.push(NodeFactory.call(ctx, ctx, data.childNode, h));
  return res;
}

// eslint-disable-next-line no-unused-vars
function addEndNode(h) {
  return <section class="end-node">流程结束</section>;
}

export default {
  props: {
    scaleVal: {
      type: Number,
      default: 1
    },
    data: {
      type: Object,
      default() {
        return {};
      },
      required: true
    },
    // 点击发布时需要校验节点数据完整性 此时打开校验模式
    verifyMode: {
      type: Boolean,
      default: true
    }
  },
  watch: {},
  methods: {
    changeNodeTitle(ev, config) {
      // console.log(ev, '修改节点名称', ev.target.value, config);
      this.$emit('updateNodeTitle', config);
    },
    /**
     *事件触发器 统筹本组件所有事件并转发到父组件中
     * @param { Object } 包含event（事件名）和args（事件参数）两个参数
     */
    eventLancher(event, ...args) {
      // args.slice(0,-1) vue 会注入MouseEvent到最后一个参数 去除事件对象
      const param = {
        event,
        args: args.slice(0, -1)
      };
      const n = args.length;
      const e = args[n - 1];
      e.stopPropagation();
      this.$emit('emits', param);
    },
    editNodeTitle(conf) {
      const { nodeId } = conf;
      // eslint-disable-next-line no-unused-expressions
      this.$refs[`operationClick_${nodeId}`] && this.$refs[`operationClick_${nodeId}`].click();
      // eslint-disable-next-line no-unused-expressions
      this.$refs[nodeId] && this.$refs[nodeId].focus();
    },
    changeNodeHelpInfo(conf, isFlag) {
      this.$emit('changeHelpInfo', conf);
      if (isFlag) {
        this.trggleClick(conf);
      }
    },
    trggleClick(conf) {
      const { nodeId } = conf;
      this.$refs[`operationClick_${nodeId}`].click();
    }
  },
  render(h) {
    return (
        <div class="cardMain">
          <div style={{ transform: `scale(${this.scaleVal / 100})` }}>
            <div style="display: inline-flex; flex-direction: column; align-items: center;transform-origin: 0 0;">
              {this.data && NodeFactory.call(this, this, this.data, h)}
              {addEndNode(h)}
            </div>
          </div>
        </div>
    );
  }
};
</script>

<style lang="scss" scoped>
@import 'index';
.cardMain {
  width: calc(100% - 310px);
  height: 100%;
  overflow-y: auto;
  overflow-x: auto;
}
.cardMain::-webkit-scrollbar {
  //width: 0 !important;
}
</style>
