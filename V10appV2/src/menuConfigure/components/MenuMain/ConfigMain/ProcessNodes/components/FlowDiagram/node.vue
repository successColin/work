<!--
 * @Descripttion: 节点
 * @Author: ytx
 * @Date: 2023-07-20 15:34:08
 * @Last Modified by: ytx
 * @Last Modified time: 2023-07-20 15:34:08
-->
<template>
  <div class="node">
    <div class="col-box" v-if="data.type === 'condition'">
      <div class="center-line"></div>
      <div class="top-cover-line"></div>
      <div class="bottom-cover-line"></div>
      <!-- 节点 -->
      <div class="node-wrap">
        <div :class="['node-wrap-box', data.type]">
          <!-- 节点 -->
          <self-node
            :data="data"
            :nodeArr="nodeArr"
            :approvalInfo="approvalInfo"
          ></self-node>
          <section
            class="flow-path-card condition"
            v-if="data.type === 'condition'"
          >
            <header class="header">
              <div class="title-box" style="height: 30px; width: 160px">
                <span class="title-text">{{ data.properties.title }}</span>
              </div>
              <div class="actionsTips" v-if="!!data.properties.nodeHelp">
                <span class="iconfont icon-bangzhu"></span>
              </div>
            </header>
            <div class="body">
              <div
                class="text"
                v-html="data.content || '所有数据可进入该分支'"
              ></div>
              <span v-if="!data.content" class="setFilterData">
                设置筛选条件
              </span>
            </div>
            <div
              v-if="!!currentNode && currentNode.status === 3"
              class="passWrap"
            >
              <image
                class="passWrap__img"
                src="~@/static/img/flow/flow_complete.svg"
              ></image>
            </div>
          </section>
          <!-- 线条 -->
          <node-line :data="data"></node-line>
        </div>
      </div>
      <!-- 分支节点 -->
      <div class="branch-wrap" v-if="hasBranch">
        <div class="branch-box-wrap">
          <div class="branch-box flex justify-center relative">
            <div v-for="(item, i) in data.conditionNodes" :key="i">
              <node
                v-if="item.childNode"
                :data="item.childNode"
                :nodeArr="nodeArr"
                :approvalInfo="approvalInfo"
              />
            </div>
          </div>
        </div>
        <node-line :data="data"></node-line>
      </div>
    </div>

    <div
      class="node-wrap"
      v-if="
        !['procedure', 'webhook', 'backend_data', 'empty'].includes(data.type)
      "
    >
      <div :class="['node-wrap-box', data.type]">
        <self-node
          :data="data"
          :nodeArr="nodeArr"
          :approvalInfo="approvalInfo"
        ></self-node>
        <node-line :data="data"></node-line>
      </div>
    </div>
    <!-- 分支节点 -->
    <div class="branch-wrap" v-if="hasBranch">
      <div class="branch-box-wrap">
        <div class="branch-box flex justify-center relative">
          <div v-for="(item, i) in data.conditionNodes" :key="i">
            <node
              v-if="item"
              :data="item"
              :nodeArr="nodeArr"
              :approvalInfo="approvalInfo"
              :class="
                i === 0
                  ? 'firstNode'
                  : i === data.conditionNodes.length - 1
                  ? 'lastNode'
                  : ''
              "
            />
          </div>
        </div>
      </div>
      <node-line :data="data"></node-line>
    </div>
    <node
      v-if="data.childNode"
      :data="data.childNode"
      :nodeArr="nodeArr"
      :approvalInfo="approvalInfo"
    />
  </div>
</template>

<script>
import NodeLine from './components/NodeLine';
import SelfNode from './components/SelfNode';

export default {
  name: 'node',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    nodeArr: {
      type: Array,
      default: () => []
    },
    approvalInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  components: {
    NodeLine,
    SelfNode
  },
  computed: {
    // 是否有分支
    hasBranch() {
      return Array.isArray(this.data.conditionNodes) && this.data.conditionNodes.length > 0;
    },

    // 当前节点
    currentNode() {
      return this.nodeArr.find((item) => item.nodeId === this.data.nodeId);
    },
    isCondition() {
      return this.data.type === 'condition';
    }
  }
};
</script>
<style lang='scss' scoped>
@import './index';
.node {
  display: flex;
  flex-direction: column;
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

  &__img {
    width: 80rpx;
    height: 80rpx;
  }
}
</style>
