<template>
  <apiot-drawer
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    :title="panelObj ? panelObj.panelName : ''"
    class="panel__dialog"
    direction="btt"
    :with-header="false"
    custom-class="panel__full"
    :modal="true"
    :append-to-body="true"
    :hasFooter="false"
  >
    <header class="panel__full--header">
      <apiot-button class="return" @click="closePanle">
        <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
      </apiot-button>
      <span class="m-l-14">{{ panelObj ? panelObj.panelName : '' }}</span>
    </header>
    <ApiotMenu
      class="panel__full--content"
      :panelObj="panelObj"
      :dataSelObj="dataSelObj"
      v-if="showPanel"
      @closePanle="closePanle"
      @setDataSel="setDataSel"
      ref="menu"
      v-bind="$attrs"
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

<style lang='scss'>
.panel__full {
  height: auto !important;
  top: 50px !important;
  bottom: 0;
  background-color: #f6f6f8 !important;
  .drawer__content {
    overflow: hidden;
  }
  &--header {
    height: 46px;
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  }
  &--content {
    top: 46px !important;
    margin: 10px 10px 0;
    box-shadow: 0px 0px 4px 0px rgb(0 0 0 / 30%);
    height: calc(100% - 46px - 10px) !important;

    .tabMain__pane--area {
      box-sizing: border-box;
      &.firstIsTable {
        padding-top: 0px;
      }
    }
    .tabMain__tabs .tabMain__pane.showBtnsArea.inBottom {
      padding-bottom: 64px;
    }
    .tabMain__pane.showBtnsArea.inBottom .btnsArea {
      height: 64px;
    }
    .tabMain__pane.showBtnsArea .btnsArea .menuMain__btnArea--compList {
      padding-right: 30px;
      padding-left: 20px;
    }
    .menuMain__card {
      padding: 0 10px;
    }
  }
  .return {
    // position: absolute;
    // left: 0;
    // top: 0;
    z-index: 1;
    width: 100px;
    height: 46px;
    border-width: 0 1px 0 0;
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
}
</style>
