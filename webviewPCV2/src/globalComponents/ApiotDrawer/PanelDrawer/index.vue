<template>
  <apiot-drawer
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    :title="panelObj ? panelObj.panelName : ''"
    class="panel__dialog"
    :append-to-body="true"
    :hasFooter="false"
    :showCustomTitle="true"
  >
    <span slot="title" style="display: flex; align-items: center">
      <span class="panel__dialog--title">{{
        panelObj ? panelObj.panelName : ''
      }}</span>
      <i
        class="iconfont icon-fenxiang"
        v-if="getCanShare"
        @click="getShare"
      ></i>
    </span>
    <ApiotShareDialog
      :visible.sync="showShare"
      v-if="getCanShare"
      :panelObj="panelObj"
    ></ApiotShareDialog>
  </apiot-drawer>
</template>

<script>
export default {
  name: '',
  props: {
    panelObj: {
      type: Object
    },
    showPanel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dataSelObj: null,
      showShare: false
    };
  },
  computed: {
    // 能否显示分享
    getCanShare() {
      if (this.panelObj) {
        return +this.panelObj.enableshare === 1;
      }
      return false;
    }
  },
  mounted() {},

  methods: {
    // 打开分享
    getShare() {
      this.showShare = true;
    },
    closePanle() {
      this.$emit('update:visible', false);
    },
    setDataSel(arr) {
      this.$emit('setDataSel', arr);
    },
    initSelData(name, value, obj) {
      this.dataSelObj = {
        name,
        value,
        showInfo: obj
      };
    }
  },

  components: {},
  watch: {
    showPanel(v) {
      if (v) {
        this.$nextTick(() => {
          this.$refs.menu.touchTab();
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.panel__dialog {
  .icon-fenxiang {
    position: absolute;
    right: 0;
    color: #909399;
    margin-right: 54px;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
  ::v-deep {
    .el-drawer__header {
      padding-left: 20px !important;
    }
    .el-drawer__body {
      padding-top: 0;
      height: calc(100% - 54px - 26px);
      .tabMain {
        padding-bottom: 0;
      }
    }
    .tabMain__pane--area {
      box-sizing: border-box;
      &.firstIsTable {
        padding-top: 0px;
      }
    }
    .tabMain__pane.showBtnsArea.inBottom {
      padding-bottom: 64px;
    }
    .tabMain__pane.showBtnsArea.inBottom .btnsArea {
      height: 64px;
    }
    .tabMain__pane.showBtnsArea .btnsArea .menuMain__btnArea--compList {
      padding-right: 30px;
      padding-left: 20px;
    }
  }
}
</style>
