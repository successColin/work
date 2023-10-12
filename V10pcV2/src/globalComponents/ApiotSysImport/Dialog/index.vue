<!-- 页面 -->
<template>
  <el-dialog
    :title="title"
    v-on="$listeners"
    v-bind="$attrs"
    :close-on-click-modal="false"
  >
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <div v-if="!isHideFooter">
        <apiot-button @click="handleCancel" v-if="!isHideCancel">
          {{ $te(cancelBtnName) ? $t(cancelBtnName) : cancelBtnName }}
        </apiot-button>
        <apiot-button
          type="primary"
          @click="handleOk"
          v-if="!isHideOk"
          :loading.sync="loading"
        >
          {{ $te(okBtnName) ? $t(okBtnName) : okBtnName }}
        </apiot-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    isHideFooter: {
      type: Boolean,
      default: false
    },
    isHideCancel: {
      type: Boolean,
      default: false
    },
    isHideOk: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    okBtnName: {
      type: String,
      default: 'common.sure'
    },
    cancelBtnName: {
      type: String,
      default: 'common.cancle'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    handleCancel() {
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
.dialog-footer {
  min-height: 30px;
  display: block;
}

::v-deep {
  .el-dialog {
    width: 640px;
    border-radius: 8px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    height: 54px;
    padding: 16px 20px;
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
