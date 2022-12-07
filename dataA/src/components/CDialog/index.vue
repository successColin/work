/**
* @name: index
* @author: DELL
* @date: 2021/10/29 16:16
* @description：弹框
* @update: 2021/10/29 16:16
*/
<!-- 页面 -->
<template>
  <el-dialog
      :modal="false"
      v-on="$listeners"
      v-bind="$attrs"
      :title="title"
      class="CDialog"
      :class="{[classStyle]:true}"
      :destroy-on-close="true"
  >
    <slot></slot>
    <span slot="footer" class="dialog-footer" v-if="isNeedBtn">
      <slot name="otherBtn"></slot>
      <el-button v-if="isNeedCancelBtn" @click="handleCancle">取 消</el-button>
      <el-button v-if="isNeedOkBtn" type="primary" @click="handleOk">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    classStyle: { // middlingDialog, normalDialog, largeDialog
      type: String,
      default: 'normalDialog'
    },
    isNeedCancelBtn: {
      type: Boolean,
      default: true
    },
    isNeedOkBtn: {
      type: Boolean,
      default: true
    },
    isNeedBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    handleCancle() {
      this.$emit('update:visible', false);
      this.$emit('handleCancel');
    },
    handleOk() {
      this.$emit('handleOk');
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.CDialog {

  ::v-deep {
    .el-dialog__header {
      display: flex;
      align-items: center;
      height: 54px;
      padding: 0 20px;
      background: #131E45;
      border-bottom: 1px solid #233366;
      text-align: left;
      box-sizing: border-box;

      .el-dialog__title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #4689F5;
      }
    }

    .el-dialog__headerbtn {
      color: #4689F5;
    }

    .el-dialog__footer {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      justify-content: flex-end;
      background: #182551;
      box-shadow: 0px 0px 1px 0px #2f437f;

      .el-button, .dialog-footer {
        display: flex;
        height: 30px;
        line-height: 30px;
        padding: 0 20px;
        border-radius: 0;
      }

      .el-button--primary {
        background-color: #4689F5;
        border-color: #4689F5;

        &:hover {
          background-color: #4796e8;
        }
      }
    }
  }

  &.normalDialog {
    ::v-deep {
      .el-dialog {
        width: 640px;
      }

      .el-dialog__body {
        height: 462px;
        padding: 0;
        background: #131E45;
        box-sizing: border-box;
      }
    }
  }

  &.middlingDialog {
    ::v-deep {
      .el-dialog {
        width: 930px;
      }

      .el-dialog__body {
        height: 522px;
        padding: 0;
        background: #131E45;
        box-sizing: border-box;
      }
    }
  }
  &.largeDialog {
    ::v-deep {
      .el-dialog {
        width: 1120px;
      }

      .el-dialog__body {
        height: 522px;
        padding: 0;
        background: #131E45;
        box-sizing: border-box;
      }
    }
  }
}
</style>
