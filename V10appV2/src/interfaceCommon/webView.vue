<!--
 * @Author: sss
 * @Date: 2022-08-10 14:30:06
 * @Last Modified by: sss
 * @Last Modified time: 2022-08-10 14:30:06
 * @Desc: 外部连接
-->
<template>
  <view>
    <!-- #ifndef MP -->
    <apiot-navbar
      navStyle="hasBack"
      :title="config.title || '外部链接'"
    ></apiot-navbar>
    <!-- #endif -->

    <web-view
      id="web-view-1"
      class="webview"
      :style="{ top: `${systemInfo.customBar}px` }"
      :src="webviewUrl"
      :webview-styles="webviewStyles"
      @message="getMessage"
    ></web-view>
  </view>
</template>

<script>
import parser from '@/utils/formula';

export default {
  components: {},

  props: {},

  data() {
    return {
      webViewType: 1, // 平台类型：1=app；2=h5；3=钉钉小程序
      config: {
        isOuterLink: false, // 是否为外部链接
        isCustomPage: false, // 是否自定义界面
        customPageId: null, // 自定义界面id
        flag: null // 外部链接为标识
      },
      webviewStyles: {
        progress: true,
        height: '20px'
      }
    };
  },

  computed: {
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 全局配置-域名相关
    globalDomain() {
      if (!this.config.isCustomPage) return '';
      const { UREPORT_URL } = this.$store.state.base.globalConfig;
      const domain = UREPORT_URL.find((item) => item.attributeKey === 'appHomepageUrl') || {};
      if (!domain.attributeValue) return '';
      return domain.attributeValue;
    },
    // 获取自定义界面url
    customUrl() {
      const { globalDomain, config, webViewType } = this;
      if (!globalDomain) return '';
      const { customPageId, uuid } = config;

      return `${globalDomain.trim()}/appCustomPage/${customPageId}?CSMToken=${this.$apiot.getComToken()}&CSMUuid=${uuid}&CSMIsWebview=${webViewType}`;
    },
    // 外部链接跳转
    outerLink() {
      const { config } = this;
      const { isOuterLink, flag } = config;
      if (!isOuterLink) return;
      console.log(this.$store.state.menu.jumpMenuFilter);
      console.log(flag);
      const obj = this.$store.state.menu.jumpMenuFilter[flag] || {};
      const { urlParams = {} } = obj;
      const arry = [];
      Object.keys(urlParams).forEach((key) => {
        arry.push(`${key}=${urlParams[key]}`);
      });

      let { outerLink = '' } = obj;
      if (arry.length > 0) outerLink = `${outerLink}?${arry.join('&')}`;
      return outerLink;
    },
    // webview对应的url
    webviewUrl() {
      const { customUrl, outerLink, config } = this;
      const { url, isCustomPage, isOuterLink } = config;
      // eslint-disable-next-line no-nested-ternary
      return isCustomPage ? customUrl : isOuterLink ? outerLink : url;
    }
  },

  methods: {
    // 接收外联界面传递回来的信息
    reciveMessage(msg = {}) {
      const {
        operationType,
        id,
        menuFilter,
        CSMUuid,
        sysMenuDesignId,
        panelName,
        dialogTitle,
        panelFilter,
        panelData,
        panelFixData
      } = msg;
      if (operationType === 'menu') {
        this.$bus.$emit('clickMenu', { menu: { id }, menuFilter, isCunstom: true });
      } else if (operationType === 'pane') {
        const panelObj = { id, panelName: dialogTitle || panelName, panelFilter, panelData };
        const urlParams = {
          ejectComId: id,
          parentCompId: id,
          parentSysMenuDesignId: sysMenuDesignId,
          menuFlag: this.config.id,
          mustLoad: true
        };
        const config = {
          panel: panelObj,
          sourceFlagId: CSMUuid,
          urlParams
        };
        // 处理传递参数以及过滤条件
        if (panelFilter) {
          config.filters = {};
          panelFilter.forEach((item, index) => {
            const { filterTermType, filterTermSql, filterTermStr, compId } = item;
            config.filters[compId] = [];
            if (filterTermType === 1) {
              // 普通的过滤条件
              const newFilterTermStr = this.reduceNormalFilter(filterTermStr, panelFixData);
              item.filterTermStr = JSON.stringify(newFilterTermStr);
            }
            if (filterTermType === 2) {
              // sql过滤条件
              const str = this.reduceSqlFilter(filterTermSql, panelFixData);
              item.filterTermSql = str;
            }
            if (config.filters[compId]) config.filters[compId].push(item);
            else config.filters[compId] = [item];
          });
        }
        // 处理传递参数
        config.panelFixData = {};
        panelData.forEach((item) => {
          const { paneComp } = item;
          config.panelFixData[paneComp.compId] = panelFixData[paneComp.compId];
        });
        this.$store.dispatch('jumpPanel', config);
      }
    },
    // 获取webview返回的信息
    getMessage(info) {
      console.log('getMessage=======================');
      console.log(info);
      const { data = {} } = info.detail;
      let arg = {};
      if (this.webViewType === 1 && data.length > 0) {
        // eslint-disable-next-line prefer-destructuring
        arg = data[0];
      } else arg = data;

      const { CSMUuid, id } = arg;
      // 向页面传参
      if (+CSMUuid === this.config.uuid && id) this.reciveMessage(arg);
    },
    // h5界面获取webview返回参数
    getH5Message(info = {}) {
      const { data = {} } = info;
      const { CSMUuid, id } = data;
      // 向页面传参
      if (+CSMUuid === this.config.uuid && id) this.reciveMessage(data);
    },
    // 处理公式
    formulaConversion(formulaStr) {
      let str = this.regProcess(formulaStr);
      let res = parser.parse(`${str}`);
      if (res.error) {
        str = str.replace(/\$([A-Za-z0-9]{6})\$/g, () => '"0"');
        res = parser.parse(`${str}`);
      }
      // 最终错误把字符串返回
      if (res.error) {
        return false;
      }
      console.log(res, 'res');
      return res.result;
    },
    reduceNormalFilter(filterTermStr, formData) {
      if (!filterTermStr) return {};
      // 处理普通的过滤条件
      const newFilterTermStr = JSON.parse(filterTermStr);
      const { termArr = [] } = newFilterTermStr;
      termArr.forEach((termItem) => {
        termItem.forEach((term) => {
          const { valueType, content } = term;
          if (valueType === 2) {
            const result = this.formulaConversion(content);
            term.valueType = 1;
            term.content = result;
          }
        });
      });
      return newFilterTermStr;
    },
    reduceSqlFilter(filterTermSql, formData) {
      // 处理sql过滤条件
      let str = this.regProcess(filterTermSql);
      const reg = /GET_FIELD_VALUE\('[\w\d\s]+'\)/g;
      str = str.replace(reg, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取当前用户
      str = str.replace(/GET_USER_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取用户组织
      str = str.replace(/GET_ORG_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取用户角色
      str = str.replace(/GET_ROLES_ID\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取日期
      str = str.replace(/GET_DATE\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取日期时间
      str = str.replace(/GET_DATETIME\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取年份
      str = str.replace(/GET_YEAR\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取月份
      str = str.replace(/GET_MONTH\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取星期
      str = str.replace(/GET_WEEK\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取天
      str = str.replace(/GET_DAY\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      // 获取时间撮
      str = str.replace(/GET_TIMESTAMP\(\)/g, (text) => {
        const result = this.formulaConversion(text);
        return result ? `'${result}'` : '';
      });
      return str;
    },
    regProcess(str = '') {
      console.log('regProcess===================');
      console.log(str);
      // 将公式中的特殊字符去除
      if (!str) return '';
      let formulaRes = str
        .replace(/\[|\]/g, '')
        .replace(/!==/g, '<>')
        .replace(/!=/g, '<>')
        .replace(/===(?!=)/g, '=')
        .replace(/==(?!=)/g, '=');
      formulaRes = formulaRes.replace(/\$([A-Za-z0-9]{6})\$/g, '');
      const newStr = formulaRes.replace(
        /\$\d+-(\d+)-([a-zA-Z0-9_\-\u4e00-\u9fa5]+)\$/g,
        (...arr) => `${arr[1]}`
      );
      return newStr;
    }
  },

  mounted() {
    // #ifdef APP-PLUS
    const { windowHeight, customBar } = this.systemInfo;
    const currentWebview = this.$scope.$getAppWebview();
    const wv = currentWebview.children()[0];
    wv.setStyle({
      // 设置web-view距离顶部的距离以及自己的高度，单位为px
      top: customBar,
      height: windowHeight - customBar
    });
    // #endif

    // #ifdef H5
    // 获取iframe网页种传递的信息
    window.addEventListener('message', this.getH5Message, false);
    // #endif

    console.log(this.customUrl);
  },

  beforeDestroy() {
    // #ifdef H5
    window.removeEventListener('message', this.getH5Message);
    // #endif
  },

  onLoad(option) {
    // #ifdef H5
    this.webViewType = 2;
    // #endif
    // #ifdef MP-ALIPAY
    this.webViewType = 3;
    // #endif
    // #ifdef MP-WEIXIN
    this.webViewType = 4;
    // #endif

    option = option || {};
    this.config = { ...option };
    // 是否为自定义界面
    if (option.isCustomPage === '1') this.config.isCustomPage = true;
    else this.config.isCustomPage = false;
    // 是否为外部链接
    if (option.isOuterLink === '1') this.config.isOuterLink = true;
    else this.config.isOuterLink = false;
    this.config.uuid = this._uid;
  },
  onReady() {
    // #ifdef MP
    uni.setNavigationBarTitle({
      title: this.config.title || '外部链接'
    });
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.themeColor
    });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
</style>
