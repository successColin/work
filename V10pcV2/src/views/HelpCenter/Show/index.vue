<!--
 * @Descripttion: 帮助中心帮助显示
 * @Author: ytx
 * @Date: 2021-06-29 18:03:55
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:03:55
-->
<template>
  <section class="helpCenterShow">
    <header>
      <div class="helpCenterShow__header">
        <!-- <img src="@/assets/img/pcLoginLog1.svg" alt="" /> -->
        <div class="helpCenterShow__header--title">
          <!-- {{ $t('helpCenter.aPIOTHelpCenter') }} -->
          {{ active }}
        </div>
      </div>
    </header>
    <el-tabs
      class="helpCenterShow__tabs"
      v-model="activeName"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-for="item in tabsArr"
        :label="$t(item.label)"
        :key="item.compName"
        :name="item.compName"
      >
        <!-- v-if="activeName === item.compName" -->
        <component
          :is="item.compName"
          :key="item.compName"
          :ref="item.compName"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import HelpDoc from './HelpDoc';
import VideoTutorial from './VideoTutorial';
import CommonProblem from './CommonProblem';
import UpdateLog from './UpdateLog';

export default {
  data() {
    return {
      active: null,
      activeName: 'HelpDoc',
      tabsOption: [
        {
          label: 'helpCenter.helpDocument',
          compName: 'HelpDoc',
          key: 1
        },
        {
          label: 'helpCenter.videoTutorial',
          compName: 'VideoTutorial',
          key: 2
        },
        {
          label: 'helpCenter.qA',
          compName: 'CommonProblem',
          key: 3
        },
        {
          label: 'helpCenter.updateLog',
          compName: 'UpdateLog',
          key: 4
        }
      ]
    };
  },
  computed: {
    enableHelpCenter() {
      return (
        this.$store.state.globalConfig.themeConfig.helpCenterMenu &&
        this.$store.state.globalConfig.themeConfig.helpCenterMenu.split(',').sort()
      );
    },
    tabsArr() {
      const arr = [];
      this.enableHelpCenter.forEach((v) => {
        const obj = this.tabsOption.find((val) => val.key === +v);
        if (obj) {
          arr.push(obj);
        }
      });
      return arr;
    }
  },
  async mounted() {
    await this.$store.dispatch('fetchThemeConfig', 'THEME_AND_LOGO');
    this.activeName = this.$route.query.id || this.activeName;
    this.active = this.$route.query.name;
  },
  components: {
    HelpDoc, // 帮助文档
    VideoTutorial, // 视频教程
    CommonProblem, // 常见问题
    UpdateLog // 更新日志
  },
  methods: {
    tabClick(tab) {
      this.active = tab.label;
      this.activeName = tab.name;
      this.$nextTick(() => {
        tab.$children[0].init();
      });
    }
  }
};
</script>
<style lang='scss' scoped>
$headerHeight: 64px;
.helpCenterShow {
  position: relative;
  header {
    height: $headerHeight;
    position: absolute;
    top: 0;
    margin-left: 180px;
  }
  &__header {
    display: flex;
    align-items: center;
    height: 100%;
    img {
      // width: 82px;
      height: 22px;
      padding-right: 20px;
      border-right: 1px solid #e9e9e9;
    }
    &--title {
      padding-left: 30px;
      font-size: 22px;
      color: #333333;
    }
  }
  &__tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  ::v-deep {
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__nav {
      height: $headerHeight;
      display: flex;
      align-items: center;
      float: right;
      margin-right: 180px;
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
      font-size: 16px;
    }
    .is-active {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
    }
  }
}
</style>
