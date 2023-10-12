<template>
  <div class="config globalConfig">
    <h1 class="config__h1">全局配置</h1>
    <el-form label-position="top">
      <el-form-item label="触发动作">
        <apiot-button class="btn triggerAction" @click="triggerConfig">
          <i class="iconfont icon-chufadongzuo m-r-4"></i>配置触发动作
        </apiot-button>
        <apiot-button class="btn" @click="showRelate">
          <i class="iconfont icon-guanxiguanlian m-r-4"></i>查看全局关系
        </apiot-button>
      </el-form-item>
      <el-form-item
        label="分享链接1"
        v-if="!isPanel && $store.state.globalConfig.ureportConfig.shareUrl"
      >
        <apiot-input
          readonly
          placeholder="pc端分享地址"
          class="m-b-10"
          v-model="shareUrl"
          ref="shareUrl"
        ></apiot-input>
        <!-- <apiot-input
          placeholder="这里是帮助信息填写"
          class="m-b-10"
        ></apiot-input> -->
        <apiot-button class="btn" @click="copyShareUrl">
          <i class="iconfont icon-fuzhi m-r-4"></i>复制链接
        </apiot-button>
      </el-form-item>
    </el-form>
    <transition name="slide-bottom">
      <trigger-action
        v-if="showTrigger"
        :showTrigger.sync="showTrigger"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
        :hasTriggerComp="hasTriggerComp"
      ></trigger-action>
    </transition>
    <transition name="slide-bottom">
      <relate-gird
        v-if="showGird"
        :visible.sync="showGird"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
      ></relate-gird>
    </transition>
  </div>
</template>

<script>
import { Encrypt } from '@/utils/utils';
import { shortLink } from '@/api/menuManage';
import RelateGird from './components/RelateGird';
import TriggerAction from './components/TriggerAction';

export default {
  props: {
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    },
    // 是不是面板
    isPanel: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTrigger: false,
      showGird: false,
      shareUrl: ''
    };
  },

  components: {
    TriggerAction,
    RelateGird
  },

  computed: {},

  created() {},

  mounted() {
    this.createShareUrl();
  },

  methods: {
    async triggerConfig() {
      await this.$parent.saveLayout();
      this.showTrigger = true;
    },
    async showRelate() {
      await this.$parent.saveLayout();
      this.showGird = true;
    },
    async createShareUrl() {
      let shareUrl = '';
      if (this.$route.query.isApp === '1') {
        shareUrl = `${this.$store.state.globalConfig.ureportConfig.shareUrl}/onlineApp?isLink=1&flag=1&id=${this.$route.params.id}`;
        const data = await shortLink({
          originalUrl: encodeURI(shareUrl)
        });
        this.shareUrl = `${this.$store.state.globalConfig.ureportConfig.shareUrl}/share/${data}`;
      } else {
        this.shareUrl = `${
          this.$store.state.globalConfig.ureportConfig.shareUrl
        }/sharePage/1?menuId=${Encrypt(this.$route.params.id)}`;
      }
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import '../commonConfig';
.globalConfig {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  .btn {
    margin: 0;
    width: 100%;
    .iconfont {
      color: $--color-primary;
    }
  }
  .triggerAction {
    margin-bottom: 8px;
  }
}
</style>
