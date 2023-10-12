<template>
  <div class="previewPage">
    <div class="previewPage__content">
      <header class="previewPage__header">
        <div class="previewPage__header--center">
          {{ panelName }}
        </div>
        <div class="previewPage__header--right">
          <div class="previewPage__header--close" @click="closePanle">
            <i class="iconfont icon-guanbi"></i>
            <span>关闭</span>
          </div>
        </div>
      </header>
      <section class="previewPage__body">
        <el-form label-position="top">
          <el-form-item label="预览链接">
            <apiot-input
              readonly
              placeholder="预览链接"
              class="m-b-10"
              v-model="shareUrl"
              ref="shareUrl"
            ></apiot-input>
            <apiot-button class="btn" @click="copyShareUrl">
              <i class="iconfont icon-fuzhi m-r-4"></i>复制链接
            </apiot-button>
          </el-form-item>
          <qrcode-down
            :value="previewInfo"
            title="请使用智慧运维app进行扫描"
          ></qrcode-down>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
import { shortLink } from '@/api/menuManage';
import QrcodeDown from './QrcodeDown';

export default {
  name: 'PreviewPageApp',
  props: {
    panelName: {
      type: String
    },
    menuId: {
      type: [String, Number]
    },
    panelId: {
      type: [String, Number]
    }
  },
  data() {
    return {
      shareUrl: ''
    };
  },
  components: {
    QrcodeDown
  },
  computed: {
    previewInfo() {
      return {
        id: this.panelId || this.menuId,
        panelName: this.panelName,
        isPreviewPanel: this.panelId ? 1 : 0
      };
    },
    originalUrl() {
      const { previewInfo } = this;
      const param = { ...previewInfo };
      param.username = localStorage.getItem('username');
      param.password = localStorage.getItem('password');
      param.isPreview = true;
      const baseUrl = `${this.$store.state.globalConfig.ureportConfig.shareUrl}/onlineApp`;
      let params = Object.keys(param).map((key) => {
        const v = param[key];
        return `${key}=${v}`;
      });
      if (params && params.length > 0) params = `?${params.join('&')}`;
      else params = '';
      return `${baseUrl}${params}`;
    }
  },
  watch: {
    originalUrl: {
      handler() {
        this.createShareUrl();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    closePanle() {
      this.$emit('update:visible', false);
    },
    copyShareUrl() {
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
    },
    async createShareUrl() {
      const data = await shortLink({
        originalUrl: encodeURI(this.originalUrl)
      });
      this.shareUrl = `${this.$store.state.globalConfig.ureportConfig.shareUrl}/share/${data}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.previewPage {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  right: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  &__content {
    position: absolute;
    width: 300px;
    height: 500px;
    background-color: #fff;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  &__header {
    display: flex;
    height: 46px;
    line-height: 46px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    position: relative;
    border-bottom: 1px solid #e9e9e9;
    z-index: 2;
    &--left {
      box-sizing: border-box;
      flex: 0 0 48px;
      border-right: 1px solid #e9e9e9;
      text-align: center;
      .iconfont {
        font-size: 20px;
        color: #9b9b9b;
      }
    }
    &--center {
      position: relative;
      flex: 1;
      padding-left: 14px;
      font-weight: 500;
      color: #333333;
      font-size: 16px;
    }
    &--right {
      margin-left: auto;
    }
    &--close {
      display: flex;
      align-items: center;
      border-left: 1px solid #e9e9e9;
      cursor: pointer;
      padding: 0 20px;
      &:hover {
        i {
          color: $--color-primary;
        }
      }
      i {
        color: #bbc3cd;
        font-size: 16px;
        margin-right: 4px;
      }
      span {
        font-size: 14px;
      }
    }
  }
  &__body {
    height: calc(100% - 46px);
    position: relative;
    padding: 30px;
    .btn {
      margin: 0;
      width: 100%;
      .iconfont {
        color: $--color-primary;
      }
    }
  }
}
</style>
