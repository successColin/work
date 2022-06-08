<template>
  <apiot-drawer
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    :title="panelObj ? panelObj.panelName : ''"
    class="panel__dialog"
    :append-to-body="true"
    :hasFooter="false"
  >
    <ApiotMenu
      :panelObj="panelObj"
      :dataSelObj="dataSelObj"
      v-if="showPanel"
      @closePanle="closePanle"
      @setDataSel="setDataSel"
      ref="menu"
    ></ApiotMenu>
  </apiot-drawer>
</template>

<script>
import ApiotMenu from '@/views/ApiotMenu';

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
      dataSelObj: null
    };
  },

  mounted() {},

  methods: {
    closePanle() {
      this.$emit('update:visible', false);
    },
    setDataSel(arr) {
      this.$emit('setDataSel', arr);
    },
    initSelData(name, value, obj) {
      // console.log(name, value);
      this.dataSelObj = {
        name,
        value,
        showInfo: obj
      };
    }
  },

  components: {
    ApiotMenu
  }
};
</script>

<style lang='scss' scoped>
.panel__dialog {
  ::v-deep {
    .el-drawer__body {
      padding-top: 0;
      height: calc(100% - 54px - 26px);
      .tabMain {
        padding-bottom: 0;
      }
    }
    .tabMain__pane--area {
      padding: 0px 21px 0;
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
