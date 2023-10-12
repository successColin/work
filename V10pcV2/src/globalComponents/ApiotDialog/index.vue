<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-24 11:49:38
 * @Des: dialog 分装
-->
<template>
  <el-dialog
    v-on="$listeners"
    v-bind="$attrs"
    :modal="false"
    :close-on-click-modal="false"
    @mousedown.native="handleWrapperMousedown($event)"
    @mouseup.native="handleWrapperMouseup($event)"
    class="curMask"
    :class="{
      bigDialog: isBigDialog,
    }"
    @keydown.esc.native.stop="escKeyDown"
    @open="open"
    tabindex="0"
  >
    <span slot="title" class="dialog-title" v-if="showCustomTitle">
      <slot name="title"></slot>
    </span>
    <slot></slot>
    <span
      slot="footer"
      class="dialog-footer"
      v-if="isShowFooter"
      ref="curDialog"
    >
      <slot name="btn"></slot>
      <apiot-button @click="clearClick" v-if="isShowClear">
        {{ $te(clearBtnName) ? $t(clearBtnName) : clearBtnName }}
      </apiot-button>
      <apiot-button @click="cancleClick" v-if="isShowCancel">
        {{ $te(cancelBtnName) ? $t(cancelBtnName) : cancelBtnName }}
      </apiot-button>
      <apiot-button
        type="primary"
        :loading.sync="loading"
        v-if="isShowSure"
        @click.stop.prevent="sureClick"
      >
        {{ $te(okBtnName) ? $t(okBtnName) : okBtnName }}
      </apiot-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    okBtnName: {
      type: String,
      default: 'common.sure'
    },
    cancelBtnName: {
      type: String,
      default: 'common.cancle'
    },
    clearBtnName: {
      type: String,
      default: 'common.clear'
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 是否阻止鼠标点击默认事件冒泡
    mouseStop: {
      type: Boolean,
      default: false
    },
    // 是否显示确定按钮
    isShowSure: {
      type: Boolean,
      default: true
    },
    isShowCancel: {
      type: Boolean,
      default: true
    },
    // 是否显示清空按钮
    isShowClear: {
      type: Boolean,
      default: false
    },
    isShowFooter: {
      type: Boolean,
      default: true
    },
    // 弹出框是否大号
    isBigDialog: {
      type: Boolean,
      default: false
    },
    // 是否自定义标题
    showCustomTitle: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  data() {
    return {
      classmodel: false
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //  确定按钮事件
    sureClick() {
      // this.loading = true;
      this.$emit('update:loading', true);
      this.$emit('sure-click');
    },
    // 取消按钮事件
    cancleClick() {
      this.$emit('update:visible', false);
      this.$emit('cancle-click');
      // this.loading = false;
      this.$emit('update:loading', false);
    },
    clearClick() {
      this.$emit('update:loading', false);
      this.$emit('clear-click');
    },
    handleWrapperMousedown(e) {
      if (this.mouseStop) {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
      }
      // 如果为true，则表示点击发生在遮罩层
      this.classmodel = !!e.target.classList.contains('el-dialog__wrapper');
    },
    handleWrapperMouseup(e) {
      if (this.mouseStop) {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
      }
      if (!!e.target.classList.contains('el-dialog__wrapper') && this.classmodel) {
        this.$emit('update:visible', false);
      }
      this.classmodel = false;
    },
    escKeyDown() {
      this.$emit('update:visible', false);
      this.$emit('cancle-click');
    },
    open() {
      this.$emit('open');
    }
  }
};
</script>

<style lang='scss' scoped>
.curMask {
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.bigDialog {
  ::v-deep {
    .el-dialog {
      width: 930px;
      & > .el-dialog__body {
        height: 522px;
      }
    }
  }
}

::v-deep {
  .el-dialog {
    width: 640px;
    border-radius: 8px;
    margin: 0 !important;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    height: 54px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    .el-dialog__headerbtn {
      top: auto;
    }
  }

  .el-dialog__title {
    vertical-align: top;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .el-dialog__body {
    height: 422px;
    box-sizing: border-box;
    padding: 10px 20px 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    padding: 16px 20px 17px;
  }

  .el-dialog__headerbtn {
    top: 18px;
  }
}
</style>
