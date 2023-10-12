/**
* @name: INDEX
* @author: DELL
* @date: 2022/8/20 16:21
* @description：INDEX
* @update: 2022/8/20 16:21
*/
<!-- 页面 -->

<script>
import UserHeadname from '@/globalComponents/ApiotColumn/UserColumn/UserHeadname/index';
import { getFlowTree } from '@/api/flow';
import url from '@/assets/img/flow_complete.svg';
// import { Decrypt } from '_u/utils';
import UserAvatar from '../UserAvatar';
import { NodeUtils } from './util.js';

let nodeArr = [];
const isCondition = (data) => data.type === 'condition';
const notEmptyArray = (arr) => Array.isArray(arr) && arr.length > 0;
const hasBranch = (data) => notEmptyArray(data.conditionNodes);
// eslint-disable-next-line no-unused-vars
const stopPro = (ev) => ev.stopPropagation();
const colorMap = {
  3: '#5A80ED',
  1: 'rgb(250, 183, 28)'
};
const operatorMap = {
  1: '执行同意操作',
  2: '执行撤回操作',
  3: '执行驳回操作',
  4: '执行转审操作',
  5: '执行加签操作',
  6: '执行提交操作'
};

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
  // const renderText = (str) => {
  //   if (!str) return '请设置审批人员';
  //   // eslint-disable-next-line no-undef
  //   const strDom = decodeURIComponent(str);
  //   const token = Decrypt(localStorage.getItem('token') || '');
  //   return strDom.replaceAll(/token=(.*?)"/g, `token=${token}"`);
  // };
  const currentNode = nodeArr.find((item) => item.nodeId === conf.nodeId);
  // const userArr = currentNode?.users.filter((item) => item.actionTime);
  const userArr = currentNode?.users || [];
  // eslint-disable-next-line max-len
  const dom = userArr.map((item, i) => (<div class={(i + 1) !== userArr.length ? 'domMain' : 'domMain2'}>
    <div class="operatorList">
      <UserHeadname userInfo={{ triggerUserName: item.userName }} prop="triggerUserName"/>
      <span class="actionTime m-l-10">{item.actionTime && item.actionTime.substring(0, 16)}</span>
    </div>
    {item.actionType && <div class="operatorStr">{operatorMap[item.actionType]}</div>}
    {(i + 1) !== userArr.length && <el-divider class="divider"></el-divider>}
  </div>));
  return (
      <section class={classList.join(' ')}>
        <header class="header" style={{ background: colorMap[currentNode?.status] }}>
          <div class="title-box" style="height: 100%;width:120px;">
            {isStartNode && (
                <div class="title-box" style="height: 100%;width:120px;">
                  <span class="title-text">{this.approvalInfo.instanceName}</span>
                </div>
            )}
            {!isStartNode && (
                <div class="title-box" style="height: 100%;width:120px;">
                  <span class="title-text">{conf.properties.title}</span>
                </div>
            )}
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
          {!currentNode?.users.length && '暂无审批人员'}
          {isStartNode && (
              <el-popover
                  placement="top-start"
                  width="220"
                  popper-class="flowChat"
                  trigger="hover"
              >
                <div>
                  {dom}
                </div>
                <div slot="reference">
                  <UserHeadname userInfo={{ triggerUserName: this.approvalInfo.triggerUserName }}
                                prop="triggerUserName"></UserHeadname>
                </div>
              </el-popover>
          )}
          {(isApprNode && currentNode?.users.length === 1 && currentNode.status !== '3') && (
              <el-popover
                  placement="top-start"
                  width="220"
                  popper-class="flowChat"
                  trigger="hover"
              >
                <div>
                  {dom}
                </div>
                <div slot="reference">
                  <UserHeadname userInfo={{ triggerUserName: currentNode.users[0].userName }}
                                prop="triggerUserName"></UserHeadname>
                </div>
              </el-popover>
          )}
          {(isApprNode && currentNode?.users.length === 1 && currentNode.status === '3') && (
              <el-popover
                  placement="top-start"
                  width="220"
                  popper-class="flowChat"
                  trigger="hover"
              >
                <div>
                  {dom}
                </div>
                <div slot="reference">
                  <UserHeadname
                      userInfo={{ triggerUserName: currentNode.users[0].userName }}
                      prop="triggerUserName"></UserHeadname>
                </div>
              </el-popover>
          )}
          {(isApprNode && currentNode?.users.length > 1) && (
              <UserAvatar value={currentNode?.users}/>
          )}
        </div>
        {
          !isStartNode && !!currentNode && currentNode.status === '3' && <div class="passWrap">
            <img src={url}/>
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
  backend_data: () => '',
  webhook: () => '',
  procedure: () => '',
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
                <img src={url} alt=""/>
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

  const res = [];
  let branchNode = '';
  const selfNode = (
      <div class="node-wrap">
        <div class={`node-wrap-box ${data.type}`}>
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
  !['procedure', 'webhook', 'backend_data'].includes(data.type) && res.push(selfNode);
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
    },
    approvalInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      styleConfig: [
        {
          c: '#5A80ED',
          n: '已流转'
        },
        {
          c: 'rgb(250, 183, 28)',
          n: '处理中'
        },
        {
          c: '#BBC3CD',
          n: '未流转'
        }
      ],
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
        const {
          treeVo = {},
          nodes: nodeIds
        } = res;
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
            <span class="split"></span>
            <el-tooltip className="item" effect="dark" content="放大" placement="top-start">
              <i class="icon-fangda iconfont" onClick={(e) => this.changeScale(e, this.step)}></i>
            </el-tooltip>
            <el-tooltip className="item" effect="dark" content="缩小" placement="top-start">
              <i class="icon-suoxiao iconfont" onClick={(e) => this.changeScale(e, -this.step)}></i>
            </el-tooltip>
          </div>
          <div class="des">
            {/* eslint-disable-next-line max-len */}
            {this.styleConfig.map((item) => (
                <span class="m-r-20"> <span class="stylesIcon m-r-6"
                                            style={{ background: item.c }}></span>{item.n}</span>))}
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

.flowBox {
  width: 100%;
  height: 100%;
  position: relative;

  .des {
    width: 100%;
    height: 32px;
    line-height: 22px;
    background: #FFFFFF;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;

    .stylesIcon {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
  }

  &.fullScreenWrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 88;

    .des {
      width: 100%;
      height: 42px;
      padding-left: 20px;
      line-height: 42px;
      box-sizing: border-box;
    }

    .cardMain {
      width: 100%;
      height: calc(100% - 42px);
      box-sizing: border-box;
    }
  }

  .scale-slider {
    position: absolute;
    right: 20px;
    top: 58px;
    width: 120px;
    height: 34px;
    display: flex;
    background: #FFFFFF;
    align-items: center;
    justify-content: space-around;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    z-index: 99;

    .split {
      width: 1px;
      height: 14px;
      background: #E9E9E9;
    }

    .scaleWrap {
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
    height: calc(100% - 52px);
    padding: 13px 0;
    position: relative;
    background: #f5f5f7;
    overflow-y: auto;
    overflow-x: auto;
    box-sizing: border-box;

    .cardMainWrap {
      position: relative;
      text-align: center;
      transform-origin: center center;
      //transform: scale(0.5);
      //display: flex;
      //align-items: center;
      //justify-content: center;
      .nodeMain {
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        transform-origin: 0 0;
      }
    }
  }

  ::v-deep {
    .user__name {
      max-width: 60px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

.cardMain::-webkit-scrollbar {
  //width: 0 !important;
}

.passWrap {
  position: absolute;
  right: 10px;
  top: calc(50% - 4px);

  .icon-shenpitongguo {
    font-size: 28px;
    color: #34c7be;
  }

  .icon-dengdaiqueren {
    font-size: 28px;
    color: #ee5e5e;
  }

  img {
    width: 40px;
  }
}

.operatorList {
  display: flex;
  align-items: center;
}

.domMain {
  padding: 0 0 10px 0;

  ::v-deep {
    .el-divider {
      margin: 5px 0 0 0;
      background: unset;
      border-bottom: 1px dashed #e9e9e9;
    }
  }
}

.domMain2 {
  padding: 0;

  ::v-deep {
    .el-divider {
      margin: 5px 0 0 0;
      background: unset;
      border-bottom: 1px dashed #e9e9e9;
    }
  }
}

.operatorStr {
  height: 25px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 25px;
}

.actionTime {
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #808080;
}
</style>
