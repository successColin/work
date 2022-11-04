<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-外部地址
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <!-- #ifdef H5 || APP-PLUS -->
    <view class="iframe" :style="iframeHeight">
      <iframe :src="iframeUrl" :key="uuid"></iframe>
    </view>
    <view :uuid="uuid" :change:uuid="renderScript.dataChange"></view>
    <!-- #endif -->

    <!-- #ifdef MP -->
    小程序不支持该控件
    <!-- #endif -->
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  inject: [
    'getAllForm',
    'resolveFormula',
    'getFormScreenHeight',
    'getMenuFlag',
  ],
  components: {},

  mixins: [elementMixin],

  props: {},

  data() {
    return {
      iframeUrl: '',
      uuid: null,
    };
  },

  computed: {
    formHeight() {
      return this.getFormScreenHeight();
    },
    iframeHeight() {
      const { sizeType } = this.element;
      let { heightMul = 1 } = this.element;

      // 尺寸选择
      if (sizeType === 2) {
        // #ifdef MP
        heightMul = 1;
        // #endif
        const height = `${this.$apiot.rpx2px(heightMul * 156)}px`;
        return {
          height,
        };
      }
      // 全屏
      return { height: `${this.formHeight}px` };
    },
    // 全局配置-域名相关
    globalDomain() {
      if (this.element.showType !== 1) return '';
      const { UREPORT_URL } = this.$store.state.base.globalConfig;
      console.log(UREPORT_URL);
      const domain =
        UREPORT_URL.find((item) => item.attributeKey === 'appHomepageUrl') ||
        {};
      if (!domain.attributeValue) return '';
      return domain.attributeValue;
    },
    // 获取自定义界面url
    customUrl() {
      const { globalDomain, element } = this;
      if (!globalDomain) return '';
      const { innerLink } = element;

      return `${globalDomain}/appCustomPage/${innerLink}`;
    },
  },

  methods: {
    // 接收外联界面传递回来的信息
    reciveMessage(msg = {}) {
      console.log(msg);
      const {
        operationType,
        id,
        menuFilter,
        CSMUuid,
        sysMenuDesignId,
        panelName,
        panelFilter,
        panelData,
        panelFixData,
      } = msg;
      if (operationType === 'menu') {
        this.$bus.$emit('clickMenu', { menu: { id }, menuFilter });
      } else if (operationType === 'pane') {
        const panelObj = { id, panelName, panelFilter, panelData };
        const urlParams = {
          ejectComId: id,
          parentCompId: id,
          parentSysMenuDesignId: sysMenuDesignId,
          menuFlag: this.getMenuFlag(),
          mustLoad: true,
        };
        this.$store.dispatch('jumpPanel', {
          panel: panelObj,
          sourceFlagId: CSMUuid,
          urlParams,
          isCunstom: true,
          formData: panelFixData,
        });
      }
    },
    init() {
      const { paramsArr, showType, outerLink } = this.element;

      let url = '';
      if (showType === 1) url = this.customUrl;
      else url = outerLink;

      if (!url) return;
      const urlParam = [];
      paramsArr.forEach((param) => {
        const { type, name, fixed, formula } = param;
        let value = fixed;
        if (type === 2) {
          value = this.resolveFormula(true, formula);
        }
        urlParam.push(`${name}=${value}`);
      });

      // 如果是自定义界面需要设置3个固定参数
      if (showType === 1) {
        urlParam.push(`CSMToken=${this.$apiot.getComToken()}`);
        urlParam.push(`CSMUuid=${this.uuid}`);
        urlParam.push('CSMIsWebview=2');
      }
      if (urlParam.length > 0) url = `${url}?${urlParam.join('&')}`;
      this.iframeUrl = url;
    },
  },

  mounted() {},

  created() {
    this.uuid = this._uid;
    this.init();
    console.log('iframe==================================');
    console.log(this.element);
  },
};
</script>

<!-- #ifdef H5 || APP-PLUS -->
<script module="renderScript" lang="renderjs">
export default {
  data() {
    return {
      currentUUid:null
    }
  },
  methods: {
    dataChange(e){
      this.currentUUid = e
    },
    sendMsg(info = {}){
      const {data={}} = info
      console.log(data)
      const {CSMUuid, id}= data
      console.log(this.currentUUid)
      // 向页面传参
      if(+CSMUuid === this.currentUUid && id) {
        this.$ownerInstance.callMethod('reciveMessage',info.data)
      }
    }
  },
  mounted() {
    // 获取iframe网页种传递的信息
    window.addEventListener('message', this.sendMsg, false);
  },
  beforeDestroy() {
    window.removeEventListener('message',this.sendMsg);
  }
}
</script>
<!-- #endif -->

<style lang='scss' scoped>
.iframe {
  width: 100%;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
