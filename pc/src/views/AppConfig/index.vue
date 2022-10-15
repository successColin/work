<template>
  <section class="appConfig">
    <el-tabs
      class="appConfig__header"
      v-model="activeName"
      @tab-click="handleSelect"
    >
      <el-tab-pane
        v-for="item in tabsArr"
        :label="item.label"
        :key="item.routeName"
        :name="item.routeName"
      >
      </el-tab-pane>
    </el-tabs>
    <router-view ref="routeView" />
    <apiot-button
      v-if="activeName !== 'paramPage'"
      type="primary"
      @click="saveLayout()"
      class="saveBtn"
      >保存</apiot-button
    >
  </section>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'funcPage'
    };
  },

  components: {},
  provide() {
    return {
      isConfig: true,
    };
  },
  computed: {
    tabsArr() {
      return [
        // {
        //   label: '登录界面',
        //   routeName: 'login'
        // },
        // {
        //   label: '信息维护',
        //   routeName: 'infoMaintain'
        // },
        {
          label: '功能界面',
          routeName: 'funcPage'
        },
        {
          label: '我的界面',
          routeName: 'mine'
        },
        {
          label: '参数设定',
          routeName: 'paramPage'
        }
      ];
    }
  },

  mounted() {
    // console.log(this.$route.name);
    this.$nextTick(() => {
      this.activeName = this.$route.name;
    });
  },

  methods: {
    handleSelect() {
      this.$router.replace({ path: `/appConfig/${this.activeName}` });
    },
    saveLayout() {
      this.$refs.routeView.saveFunctionInterface(1);
    }
  }
};
</script>

<style lang='scss' scoped>
.appConfig {
  position: relative;
  .saveBtn {
    position: absolute;
    right: 10px;
    top: 6px;
  }
  &__header {
    background-color: #fff;
    ::v-deep {
      .el-tabs__header {
        width: 100%;
        margin-bottom: 0;
      }
      .el-tabs__nav-wrap {
        display: flex;
        justify-content: center;
        height: 42px;
      }
      .el-tabs__content {
        display: none;
      }
      .el-tabs__nav-scroll {
        margin-left: 20px;
      }
      .el-tab-pane {
        height: 100%;
      }
      .el-tabs__nav {
        height: 42px;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__item {
        font-size: 14px;
      }
      .is-active {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
      }
    }
  }
}
</style>
