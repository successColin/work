/**
* @name: index
* @author: DELL
* @date: 2021/9/10 10:11
* @description：index
* @update: 2021/9/10 10:11
*/
<!-- 页面 -->
<template>
  <div class="actionBar">
    <div class="actionBar-left">
      <div
        class="actionBar-showFlowList iconfont icon-liebiaozhanshi"
        @click="toggle"
      ></div>
      <el-popover
        popper-class="flowVersion"
        placement="bottom-start"
        width="400"
        :visible-arrow="false"
        @hide="hideFlowVersion"
        @show="showFlowVersion"
        trigger="click"
      >
        <FlowVerList
          :activeFlow="activeFlow"
          :currentVersion="currentVersion"
        />
        <div
          slot="reference"
          class="border"
          v-show="JSON.stringify(activeFlow) !== '{}'"
        >
          <div class="border-left">
            <span class="iconfont icon-shezhi"></span>版本
          </div>
          <div class="border-icon"></div>
          <div class="border-right">
            <span v-if="currentVersion.version"
              >V{{ currentVersion.version }}</span
            >
          </div>
        </div>
      </el-popover>
      <div class="actionBar-flowName">{{ activeFlow.workflowName }}</div>
      <el-tag class="flowType" :type="tagInfo.type">{{ tagInfo.name }}</el-tag>
    </div>
    <div class="actionBar-right">
      <!--      <apiot-button>暂存</apiot-button>-->
      <apiot-button
        v-show="!['HISTORY', 'CURRENT'].includes(currentVersion.versionStatus)"
        type="primary"
        @click="submit"
        >发布
      </apiot-button>
    </div>
  </div>
</template>

<script>
import { doUpdateVersion } from '@/api/flow';
import FlowVerList from '../FlowVersionList/index';

export default {
  props: {
    activeFlow: {
      type: Object,
      default: () => {}
    },
    currentVersion: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false
    };
  },

  components: {
    FlowVerList
  },

  computed: {
    tagInfo() {
      const isTrue = JSON.stringify(this.currentVersion) !== '{}';
      if (isTrue && this.currentVersion.versionStatus === 'CURRENT') {
        return {
          type: 'success',
          name: '使用中'
        };
      }
      if (isTrue && this.currentVersion.versionStatus === 'HISTORY') {
        return {
          type: 'danger',
          name: '历史'
        };
      }
      if (isTrue && this.currentVersion.versionStatus === 'DESIGN') {
        return {
          type: '',
          name: '设计中'
        };
      }
      return {
        type: '',
        name: '设计中'
      };
    }
  },

  mounted() {
    this.$bus.$off('doCloseFlowListInFlow').$on('doCloseFlowListInFlow', (message) => {
      this.visible = message;
      this.$emit('toggleFlowList', this.visible);
    });
  },
  beforeDestroy() {
    this.$bus.$off('doCloseFlowListInFlow', () => {});
  },
  methods: {
    async submit() {
      // 发布
      if (!this.currentVersion.id) return;
      await doUpdateVersion({ workflowVersionId: this.currentVersion.id });
      this.$bus.$emit('Release_version');
    },
    showFlowVersion() {
      // 流程版本显示了
      // console.log('流程版本显示了');
      this.$bus.$emit('flowNodeConfigIsClose');
      if (this.visible) {
        // '流程版本显示了, 如果流程列表是显示的，流程列表要隐藏了'
        this.toggle();
      }
    },
    hideFlowVersion() {
      // 流程版本显示了
      // console.log('流程版本隐藏了');
    },
    toggle() {
      // 查看流程列表
      this.visible = !this.visible;
      this.$emit('toggleFlowList', this.visible);
      this.$bus.$emit('flowNodeConfigIsClose');
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.actionBar {
  position: relative;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  height: $--actionBar--height;
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  z-index: 1;

  .actionBar-left {
    display: flex;
    align-items: center;

    .actionBar-flowName {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: $--actionBar--height;
    }

    .flowType {
      margin-left: 10px;

      &.el-tag.el-tag--light {
        height: 22px;
        line-height: 22px;
        background-color: #f1f7ff !important;
        border: none;
        color: #4689f5;
      }

      &.el-tag.el-tag--success {
        height: 22px;
        line-height: 22px;
        background-color: #ebfcf7 !important;
        border: none;
        color: #10b98a !important;
      }

      &.el-tag.el-tag--danger {
        height: 22px;
        line-height: 22px;
        background-color: #f1f3f6 !important;
        border: none;
        color: #6b798d !important;
      }
    }

    .actionBar-showFlowList {
      width: 48px;
      height: $--actionBar--height;
      background: #ffffff;
      border-right: 1px solid #e9e9e9;
      font-size: 20px;
      text-align: center;
      color: #bbc3cd;
      line-height: $--actionBar--height;
      cursor: pointer;
      box-sizing: border-box;

      &:hover {
        color: #aaaaaa;
      }
    }

    .border {
      margin: 9px 14px;
      text-align: center;
      //line-height: $--actionBar--height;
      overflow: hidden;
      cursor: pointer;
    }

    .border-left {
      padding: 0 5px 0 10px;
      height: 28px;
      line-height: 28px;
      border-bottom-left-radius: 4px;
      border-top-left-radius: 4px;
      background: #4689f5;
      float: left;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;

      & > .icon-shezhi {
        margin-right: 3px;
        font-size: 16px;
        vertical-align: bottom;
      }
    }

    .border-icon {
      width: 0;
      height: 0;
      border-width: 28px 9px 0 0;
      border-style: solid;
      border-color: #4689f5 #e5f0ff #4689f5 #4689f5;
      float: left;
    }

    .border-right {
      padding: 0 10px 0 5px;
      height: 28px;
      float: right;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
      line-height: 28px;
      background: #e5f0ff;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #4689f5;
    }
  }

  .actionBar-right {
    margin: 9px 20px;
  }
}
</style>
