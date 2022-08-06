<template>
  <div class="tabs">
    <apiot-button class="tabs__return" @click="returnMenuRole">
      <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
    </apiot-button>
    <el-tabs v-model="activeName">
      <el-tab-pane
        :label="item.label"
        :name="item.key"
        v-for="item in tabsArr"
        :key="item.key"
        :lazy="true"
        :disabled="item.disabled"
      >
        <span
          slot="label"
          :class="[{ zhanwei: item.key === 'zhanwei' }]"
          class="label"
          ><i :class="`iconfont ${item.icon}`" v-if="item.icon"></i>
          {{ item.label }}</span
        >
        <component
          :is="item.compName"
          v-if="item.compName === activeName"
        ></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PageConfig from './components/PageConfig';
import FlowConfig from './components/FlowConfig/Process/index';
import ParamsConfig from './components/ParamsConfig';
import PaneManage from './components/PaneManage';

export default {
  name: 'MenuConfig',
  data() {
    return {
      activeName: 'PageConfig',
      tabsArr: [
        {
          label: '表单设计',
          key: 'PageConfig',
          compName: 'PageConfig'
        },
        // {
        //   label: '流程设定',
        //   key: 'FlowConfig',
        //   compName: 'FlowConfig'
        // },
        {
          label: '参数设定',
          key: 'ParamsConfig',
          compName: 'ParamsConfig'
        },
        {
          label: '|',
          key: 'zhanwei',
          compName: '',
          disabled: true
        },
        {
          label: '面板管理',
          key: 'PaneManage',
          compName: 'PaneManage',
          icon: 'icon-mianbanguanli'
        }
      ]
    };
  },

  components: {
    PageConfig,
    FlowConfig,
    ParamsConfig,
    PaneManage
  },

  computed: {},

  mounted() {
    this.activeName = this.$route.query.compName || this.tabsArr[0].key;
    if (sessionStorage.enableWorkflow === '1') {
      this.tabsArr.splice(1, 0, {
        label: '流程设定',
        key: 'FlowConfig',
        compName: 'FlowConfig'
      });
    }
  },

  methods: {
    returnMenuRole() {
      /*
      let str = `/menuRole/${this.$route.params.id}?menuName=${this.$route.query.menuName}`;
      if (this.$route.query.isApp) {
        str = `/menuRole/${this.$route.params.id}?menuName=$
        {this.$route.query.menuName}&isApp=${this.$route.query.isApp}`;
      }
      this.$router.push(str);
      */
      if (sessionStorage.menuBackPath) {
        this.$router.replace(sessionStorage.menuBackPath);
      } else {
        this.$router.replace('/menuManage');
      }
    }
  },

  beforeRouteLeave(from, to, next) {
    sessionStorage.configData = '';
    next();
  }
};
</script>

<style lang='scss' scoped>
.tabs {
  height: 100%;
  width: 100%;
  // min-width: 1440px;
  background: rgba(0, 0, 0, 0.3);
  &__return {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100px;
    height: 46px;
    border-width: 0 1px 1px 0;
    border-color: #ebebeb;
    border-radius: 0;
    color: #333333;
    font-size: 16px;

    i {
      font-size: 20px;
      margin-right: 8px;
      color: #9b9b9b;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: #ebebeb !important;
      background-color: #fff !important;
      i {
        color: $--color-primary;
      }
    }
  }

  & > ::v-deep {
    .el-tabs {
      height: 100%;
      & > .el-tabs__header {
        margin: 0;
        background-color: #fff;
        box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
        height: 46px;
        line-height: 46px;
        border-bottom: 1px solid #e9e9e9;
        box-sizing: border-box;
        & > .el-tabs__nav-wrap {
          &::after {
            height: 0;
          }

          & > .el-tabs__nav-scroll {
            display: flex;
            justify-content: center;
          }
        }
      }

      .el-tabs__item {
        color: #333333;
        font-size: 16px;
        font-weight: 400;
        .zhanwei {
          color: #e0e0e0;
        }
        &.is-active {
          color: $--color-primary;
          font-family: PingFangSC-Medium;
          font-weight: 600;
          .iconfont {
            color: $--color-primary;
          }
        }
        .iconfont {
          font-weight: normal;
          font-size: 20px;
          margin-right: 2px;
          color: #bbc3cd;
          vertical-align: -1px;
        }
      }

      & > .el-tabs__content {
        height: calc(100% - 46px);
        background-color: #fff;
        & > .el-tab-pane {
          height: 100%;
          // overflow: hidden;
          overflow-x: auto;
          overflow-y: hidden;
        }
      }

      .el-button:active {
        border-color: #c8dcfc;
      }

      .el-tabs__item:focus.is-active.is-focus:not(:active) {
        box-shadow: none;
      }
    }
  }
}
</style>
