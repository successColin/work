<template>
  <section
    :class="classList"
    v-if="['start', 'approver', 'copy', 'fill', 'notice'].includes(data.type)"
  >
    <header
      class="header"
      :style="{
        background: headerBackground,
      }"
    >
      <div class="title-box" style="height: 100%">
        <div
          v-if="isStartNode"
          class="title-box"
          style="height: 100%; width: 300rpx"
        >
          <span class="title-text">
            {{ approvalInfo.instanceName }}
          </span>
        </div>
        <div v-else class="title-box" style="height: 100%; width: 300rpx">
          <span class="title-text">{{ data.properties.title }}</span>
        </div>
      </div>
    </header>
    <div class="body">
      <LmPopover v-if="isStartNode">
        <div slot="content">
          <PopupContent :currentUser="currentUser" />
        </div>
        <div slot="reference">
          <UserHeadname
            :userInfo="{ triggerUserName: approvalInfo.triggerUserName }"
            prop="triggerUserName"
          ></UserHeadname>
        </div>
      </LmPopover>

      <LmPopover
        v-if="
          isApprNode && currentUser.length === 1 && currentNode.status !== '3'
        "
      >
        <div slot="content">
          <PopupContent :currentUser="currentUser" />
        </div>
        <div slot="reference">
          <UserHeadname
            :userInfo="{ triggerUserName: currentNode.users[0].userName }"
            prop="triggerUserName"
          ></UserHeadname>
        </div>
      </LmPopover>

      <LmPopover
        v-if="
          isApprNode && currentUser.length === 1 && currentNode.status === '3'
        "
      >
        <div slot="content">
          <PopupContent :currentUser="currentUser" />
        </div>
        <div slot="reference">
          <UserHeadname
            :userInfo="{ triggerUserName: currentNode.users[0].userName }"
            prop="triggerUserName"
          ></UserHeadname>
        </div>
      </LmPopover>

      <UserAvatar
        :value="currentUser"
        v-if="isApprNode && currentUser.length > 1"
      />
      <div v-if="isApprNode && currentUser.length === 0">未生成审批节点</div>
    </div>
    <div
      class="passWrap"
      v-if="!isStartNode && !!currentNode && currentNode.status === '3'"
    >
      <image
        class="passWrap__img"
        src="~@/static/img/flow/flow_complete.svg"
      ></image>
    </div>
  </section>
</template>

<script>
import UserHeadname from '../../../UserHeadname';
import UserAvatar from '../../../UserAvatar';
import { NodeUtils } from '../../util.js';
import LmPopover from '../../../lmPopover';
import PopupContent from './PopupContent';

export default {
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
    return {
      colorMap: {
        3: '#5A80ED',
        1: 'rgb(250, 183, 28)'
      }
    };
  },
  components: {
    UserHeadname,
    UserAvatar,
    LmPopover,
    PopupContent
  },
  computed: {
    classList() {
      const arr = ['flow-path-card'];
      if (this.isStartNode) {
        arr.push('start-node');
      }
      if (this.isApprNode) {
        arr.push('approver');
      }
      return arr.join(' ');
    },
    // 头部背景
    headerBackground() {
      return this.colorMap[this.currentNode && this.currentNode.status] || '';
    },
    // 是否开始节点
    isStartNode() {
      return NodeUtils.isStartNode(this.data);
    },
    // 是审批节点
    isApprNode() {
      return NodeUtils.isApproverNode(this.data);
    },
    // 当前节点
    currentNode() {
      return this.nodeArr.find((item) => item.nodeId === this.data.nodeId);
    },
    currentUser() {
      return this.currentNode?.users || [];
    }
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
$bg-color: #f5f5f7;
$line-color: #bbc3cd;
$base-size: 12px;

@mixin ellipsis($n) {
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;
  @if $n > 1 {
    display: -webkit-box;
    -webkit-line-clamp: $n;
    -webkit-box-orient: vertical;
  } @else {
    white-space: nowrap;
  }
}
.flow-path-card {
  width: 180px;
  min-height: 80px;
  font-size: $base-size;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
  background: #fff;
  .header {
    padding-left: 15px;
    padding-right: 30px;
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: white;
    background: #bbc3cd;
    position: relative;
    box-sizing: border-box;

    .title-box {
      position: relative;
      display: inline-block;
      @include ellipsis(1);
      line-height: 30px;
    }

    .title-input {
      position: absolute;
      left: 0;
      border: none;
      background: inherit;
      color: inherit;
      opacity: 0;

      &:focus {
        border-radius: 6px;
        font-size: $base-size;
        padding: 2px 4px 2px 2px;
        width: 95%;
        //margin-left: 1px;
        height: 22px;
        box-sizing: border-box;
        //box-shadow: 0 0 2px 2px #7ec3e1;
        background-color: $bg-color;
        border-radius: unset;
        color: black;
        opacity: 1;
        outline: none;
        border: none;
      }
    }

    .title-text {
      vertical-align: super;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }

    > .actions {
      position: absolute;
      right: 10px;
      top: 0;
      //visibility: hidden;
      visibility: visible;
    }

    > .actionsTips {
      position: absolute;
      right: 30px;
      top: 0;
    }
  }

  .approver .header .title-input {
    &:focus {
      width: 80%;
    }
  }

  &:not(.start-node):hover {
    .actions {
      visibility: visible;
    }

    .title-text {
      //border-bottom: 1px dashed currentColor;
    }
  }

  .body {
    position: relative;
    padding: 10px 14px 10px 16px;
    min-height: 48px;
    //line-height: 22px;
    box-sizing: border-box;

    .text {
      margin: 0;
      @include ellipsis(4);
    }

    .setFilterData {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4689f5;
      line-height: 17px;
    }
  }

  .icon-wrapper {
    position: absolute;
    top: 0;
    height: 100%;
    width: 14px;
    box-sizing: border-box;

    &.left {
      left: 0;
    }

    &.right {
      right: 0;
    }

    > {
      .right-arrow,
      .left-arrow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
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

.start-node .header > .actionsTips,
.approver .header > .actionsTips,
.fill .header > .actionsTips,
.backend_data .header > .actionsTips,
.webhook .header > .actionsTips,
.notice .header > .actionsTips {
  right: 22px;
}
</style>
