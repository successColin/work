<!--
 * @Descripttion: 帮助中心配置
 * @Author: ytx
 * @Date: 2021-06-29 18:02:59
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:02:59
-->
<template>
  <div class="helpCenterConfig">
    <el-tabs
      class="helpCenterConfig__tabs"
      v-model="activeName"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="(item, i) in tabsArr"
        :label="$t(item.label)"
        :key="item.compName"
        :name="item.compName"
      >
        <component
          :is="item.compName"
          :key="`${item.compName}_${i}`"
          :ref="item.compName"
        ></component>
        <!-- <transition name="move-right">
        </transition> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import HelpDoc from './HelpDoc';
import VideoTutorial from './VideoTutorial';
import CommonProblem from './CommonProblem';
import UpdateLog from './UpdateLog';

export default {
  data() {
    return {
      activeName:
        (JSON.parse(sessionStorage.getItem('helpCenter')) &&
          JSON.parse(sessionStorage.getItem('helpCenter')).configActiveName) ||
        'HelpDoc'
    };
  },
  computed: {
    tabsArr() {
      return [
        {
          label: 'helpCenter.helpDocument',
          compName: 'HelpDoc'
        },
        {
          label: 'helpCenter.videoTutorial',
          compName: 'VideoTutorial'
        },
        {
          label: 'helpCenter.qA',
          compName: 'CommonProblem'
        },
        {
          label: 'helpCenter.updateLog',
          compName: 'UpdateLog'
        }
      ];
    }
  },
  components: {
    HelpDoc, // 帮助文档
    VideoTutorial, // 视频教程
    CommonProblem, // 常见问题
    UpdateLog // 更新日志
  },
  mounted() {
    this.$refs[this.activeName][0].init();
  },
  methods: {
    tabClick(tab) {
      this.activeName = tab.name;
      const data = {
        configActiveName: tab.name
      };
      sessionStorage.setItem('helpCenter', JSON.stringify(data));
      this.$nextTick(() => {
        tab.$children[0].init();
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.helpCenterConfig {
  background: #ffffff;
  &__tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  ::v-deep {
    .el-tabs__nav-scroll {
      margin-left: 20px;
    }
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content {
      flex: 1;
    }
    .el-tab-pane {
      height: 100%;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
    .el-tabs__item {
      font-size: 13px;
    }
    .is-active {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
    }
  }
}
</style>
