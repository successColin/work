/**
* @name: INDEX
* @author: DELL
* @date: 2022/8/20 16:21
* @description：INDEX
* @update: 2022/8/20 16:21
*/
<!-- 页面 -->

<script>
import { getFlowTree } from '@/api/flow';
import { NodeUtils } from './util.js';

let nodeArr = [];
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
  const currentNode = nodeArr.find((item) => item.nodeId === conf.nodeId);
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
          </div>
          {!!conf.properties.nodeHelp && (
              <div class="actionsTips">
                <el-tooltip
                    popper-class="flowTips"
                    content={conf.properties.nodeHelp}
                    size="200"
                    placement="top"
                >
                  <span class="iconfont icon-bangzhu"></span>
                </el-tooltip>
              </div>
          )}
        </header>
        <div class="body">
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
        {
          !!currentNode && currentNode.status === 3 && <div class="passWrap">
            <el-tooltip
                popper-class="flowTips"
                content="已完成"
                size="200"
                placement="top"
            >
              <span class="icon-shenpitongguo iconfont"></span>
            </el-tooltip>
          </div>
        }
        {
          !!currentNode && currentNode.status === 1 && <div class="passWrap">
            <el-tooltip
                popper-class="flowTips"
                content="待执行"
                size="200"
                placement="top"
            >
              <span class="icon-dengdaiqueren iconfont"></span>
            </el-tooltip>
          </div>
        }
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
    const currentNode = nodeArr.find((item) => item.nodeId === conf.nodeId);
    return (
        <section class="flow-path-card condition">
          <header class="header">
            <div class="title-box" style="height: 30px;width:160px;">
              <span class="title-text">{conf.properties.title}</span>
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
                ></span>
                  </el-tooltip>
                </div>
            )}
          </header>
          <div class="body">
            <div
                class="text"
                {...{
                  domProps: {
                    innerHTML: conf.content || '所有数据可进入该分支'
                  }
                }}
            ></div>
            {!conf.content && (
                <span class="setFilterData">
              设置筛选条件
            </span>
            )}
          </div>
          {
            !!currentNode && currentNode.status === 3 && <div class="passWrap">
              <el-tooltip
                  popper-class="flowTips"
                  content="已完成"
                  size="200"
                  placement="top"
              >
                <span class="icon-shenpitongguo iconfont"></span>
              </el-tooltip>
            </div>
          }
          {
            !!currentNode && currentNode.status === 1 && <div class="passWrap">
              <el-tooltip
                  popper-class="flowTips"
                  content="待执行"
                  size="200"
                  placement="top"
              >
                <span class="icon-dengdaiqueren iconfont"></span>
              </el-tooltip>
            </div>
          }
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
  return (
      <div class="add-node-btn-box flex  justify-center">
        <div class="add-node-btn">
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
    instanceId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      data: {},
      isFull: false, // 是否全屏
      scaleVal: 100, // 流程图缩放比例 100%
      step: 5, // 缩放步长
    };
  },

  components: {},

  computed: {},

  mounted() {
    if (this.instanceId) {
      this.init();
    }
  },

  methods: {
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
     * @param e
     */
    changeFull(e) {
      e.stopPropagation();
      this.isFull = !this.isFull;
    },
    async init() {
      try {
        const res = await getFlowTree({ instanceId: this.instanceId });
        const { treeVo = {}, nodes: nodeIds } = res;
        this.data = treeVo;
        nodeArr = nodeIds || [];
        this.$nextTick(() => {
          this.doScroll();
        });
      } catch (e) {
        console.log(e);
      }
    },
    doScroll() {
      const nodeMainWidth = document.querySelector('.flowBox  .nodeMain').offsetWidth;
      const contentWidth = document.querySelector('.flowBox  .cardMainWrap').offsetWidth;
      document.querySelector('.flowBox .cardMain').scrollLeft = (nodeMainWidth - contentWidth) / 2;
    }
  },
  render(h) {
    return (
        <div class={`flowBox ${this.isFull ? 'fullScreenWrap' : ''}`}>
          <div class="scale-slider">
            <el-tooltip className="item" effect="dark" content="放大" placement="top-start">
              <i class="icon-fangda iconfont" onClick={(e) => this.changeScale(e, this.step)}></i>
            </el-tooltip>
            <el-tooltip className="item" effect="dark" content="缩小" placement="top-start">
              <i class="icon-suoxiao iconfont" onClick={(e) => this.changeScale(e, -this.step)}></i>
            </el-tooltip>
            <el-tooltip
                className="item"
                effect="dark"
                content={!this.isFull ? '启用全屏' : '退出全屏'}
                placement="top-start"
            >
              <i
                  class={`iconfont ${this.isFull ? 'icon-quxiaoquanping' : 'icon-quanping'}`}
                  onClick={(e) => this.changeFull(e)}
              ></i>
            </el-tooltip>
          </div>
          <div class="cardMain">
            <div class="cardMainWrap" style={{ transform: `scale(${this.scaleVal / 100})` }}>
              <div class="nodeMain">
                {this.data && NodeFactory.call(this, this, this.data, h)}
                {addEndNode(h)}
              </div>
            </div>
          </div>
        </div>

    );
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
@import 'index';
.flowBox{
  width: 100%;
  height: 100%;
  position: relative;
  &.fullScreenWrap{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 88;
  }
  .scale-slider {
    position: absolute;
    right: 20px;
    top: 16px;
    width: 120px;
    height: 34px;
    display: flex;
    background: #FFFFFF;
    align-items: center;
    justify-content: space-around;
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
      color: #BBC3CD;
      cursor: pointer;
    }
    .iconfont:hover {
      color: #4689f5;
    }
  }

  .cardMain {
    width: 100%;
    height: 100%;
    position: relative;
    background: #f5f5f7;
    overflow-y: auto;
    overflow-x: auto;
    .cardMainWrap{
      position: relative;
      text-align: center;
      transform-origin: center center;
      //transform: scale(0.5);
      //display: flex;
      //align-items: center;
      //justify-content: center;
      .nodeMain{
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        transform-origin: 0 0;
      }
    }
  }

}
.cardMain::-webkit-scrollbar {
  //width: 0 !important;
}
.passWrap{
  position: absolute;
  right: -14px;
  top: calc(50% - 10px);
  .icon-shenpitongguo{
    font-size: 28px;
    color: #34c7be;
  }
  .icon-dengdaiqueren{
    font-size: 28px;
    color: #ee5e5e;
  }
}
</style>
