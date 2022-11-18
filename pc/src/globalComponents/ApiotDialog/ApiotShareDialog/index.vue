<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    class="shareDialog"
    okBtnName="复制"
    title="分享页面"
    @sure-click="sureClick"
  >
    <div class="shareDialog__content">
      <p class="shareDialog__content--title">访问链接</p>
      <apiot-input
        class="shareDialog__content--url m-b-12"
        readonly
        v-model="shareUrl"
      ></apiot-input>
      <p class="shareDialog__content--tip">
        仅限平台内成员登录系统后根据权限访问
      </p>
    </div>
  </apiot-dialog>
</template>

<script>
import { shortLink } from '@/api/menuManage';

export default {
  props: {
    panelObj: {
      type: Object
    }
  },
  data() {
    return {
      shareUrl: ''
    };
  },
  mounted() {
    this.initUrl();
  },

  methods: {
    async initUrl() {
      const panelObj = JSON.parse(JSON.stringify(this.panelObj));
      delete panelObj.pageConfig;
      const shareUrl = `${
        this.$store.state.globalConfig.ureportConfig.shareUrl
      }/sharePage/2?panelObj=${JSON.stringify(panelObj)}&menuId=${this.panelObj.id}`;
      const data = await shortLink({
        originalUrl: encodeURI(shareUrl)
      });
      this.shareUrl = `${this.$store.state.globalConfig.ureportConfig.shareUrl}/share/${data}`;
    },
    sureClick() {
      // 创建输入框元素
      const oInput = document.createElement('input');
      // 将想要复制的值
      oInput.value = this.shareUrl;
      // 页面底部追加输入框
      document.body.appendChild(oInput);
      // 选中输入框
      oInput.select();
      // 执行浏览器复制命令
      document.execCommand('Copy');
      // 弹出复制成功信息
      this.$message.success('复制成功');
      // 复制后移除输入框
      oInput.remove();
    }
  }
};
</script>

<style scoped lang='scss'>
.shareDialog {
  ::v-deep {
    .el-dialog__body {
      position: relative;
      padding: 0;
      height: calc(100% - 54px);
      border-radius: 0 0 8px 8px;
    }
  }
  &__content {
    padding: 26px 20px 30px;
    &--title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 30px;
      font-weight: 600;
    }
    &--tip {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #aaaaaa;
      line-height: 18px;
    }
  }
}
</style>
