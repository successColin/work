<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    class="shareDialog"
    okBtnName="复制"
    title="分享页面"
    :isShowSure="false"
  >
    <div class="shareDialog__content">
      <p class="shareDialog__content--title">访问短链接</p>
      <p class="shareDialog__content--link m-b-12">
        <apiot-input
          class="shareDialog__content--url m-r-8"
          readonly
          v-model="shareUrl2"
        ></apiot-input>
        <apiot-button type="primary" @click="sureClick(shareUrl2)">
          <i class="iconfont icon-chuanfujian m-r-4"></i>复制链接
        </apiot-button>
      </p>

      <p class="shareDialog__content--tip">
        仅限平台内成员登录系统后根据权限访问
      </p>
    </div>
    <div class="shareDialog__content" style="padding-bottom: 30px">
      <p class="shareDialog__content--title">访问长链接</p>
      <p class="shareDialog__content--link m-b-12">
        <apiot-input
          class="shareDialog__content--url m-r-8"
          readonly
          v-model="shareUrl1"
        ></apiot-input>
        <apiot-button type="primary" @click="sureClick(shareUrl1)">
          <i class="iconfont icon-chuanfujian m-r-4"></i>复制链接
        </apiot-button>
      </p>

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
      type: Object,
    },
  },
  data() {
    return {
      shareUrl1: '',
      shareUrl2: '',
    };
  },
  mounted() {
    this.initUrl();
  },

  methods: {
    async initUrl() {
      console.log(this.panelObj);
      const panelObj = JSON.parse(JSON.stringify(this.panelObj));
      delete panelObj.pageConfig;
      this.shareUrl1 = `${
        this.$store.state.globalConfig.ureportConfig.shareUrl
      }/sharePage/2?panelObj=${JSON.stringify(panelObj)}&menuId=${
        this.panelObj.id
      }`;
      // &account=admin&psd=123qwe!
      const data = await shortLink({
        originalUrl: encodeURI(this.shareUrl1),
      });
      this.shareUrl2 = `${this.$store.state.globalConfig.ureportConfig.shareUrl}/share/${data}`;
    },
    sureClick(shareUrl) {
      // 创建输入框元素
      const oInput = document.createElement('input');
      // 将想要复制的值
      oInput.value = shareUrl;
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
    },
  },
};
</script>

<style scoped lang="scss">
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
    padding: 26px 20px 0px;
    &--title {
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      line-height: 30px;
      font-weight: 600;
    }
    &--link {
      display: flex;
      align-items: center;
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
