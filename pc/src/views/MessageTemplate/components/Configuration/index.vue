<!--
 * @Author: sss
 * @Date: 2021-07-23 14:47:29
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-23 14:47:29
 * @Desc: 配置区
-->
<template>
  <page-tabs class="configuration" :tabsArr="tabsArr" v-model="activitedTab">
    <div slot="top-btns" class="log__btn">
      <select-sms-type
        :checkedTypes="supportTypes"
        @checkTypes="checkTypes"
      ></select-sms-type>
    </div>
    <tab-sms slot="com_1" :content="smsContent" @change="changeSMS"></tab-sms>
    <tab-email
      slot="com_2"
      :content="emailContent"
      @change="changeEmail"
    ></tab-email>
    <tab-wechat
      slot="com_3"
      :content="wechatContent"
      @change="changeWechat"
    ></tab-wechat>
    <tab-inner
      slot="com_4"
      :content="innerContent"
      @change="changeInner"
    ></tab-inner>
    <tab-ding
      slot="com_5"
      @change="changeDing"
      :content="dingContent"/>
  </page-tabs>
</template>

<script>
import PageTabs from './components/PageTabs';
import SelectSmsType from './components/SelectSmsType';
import TabSms from './components/TabSms';
import TabEmail from './components/TabEmail';
import TabInner from './components/TabInner';
import TabWechat from './components/TabWechat';
import TabDing from './components/TabDing';

export default {
  components: { SelectSmsType, TabSms, TabEmail, TabInner, TabWechat, TabDing, PageTabs },

  props: {
    // 消息支持类型
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      smsType: '',
      activitedType: '',
      activitedTab: ''
    };
  },

  computed: {
    // 消息正文
    contents() {
      return this.value.contents || [];
    },
    // 支持消失类型
    supportTypes() {
      return this.value.supportTypes || [];
    },
    // 短信配置内容
    smsContent() {
      return this.contents.find((item) => item.messageType === 1) || {};
    },
    // 邮件配置内容
    emailContent() {
      return this.contents.find((item) => item.messageType === 2) || {};
    },
    // 微信配置内容
    wechatContent() {
      return this.contents.find((item) => item.messageType === 3) || {};
    },
    // 站内信配置内容
    innerContent() {
      return this.contents.find((item) => item.messageType === 4) || {};
    },
    // 钉钉信配置内容
    dingContent() {
      return this.contents.find((item) => item.messageType === 5) || {};
    },
    tabsArr() {
      return (
        this.$store.state.dictManage.MESSAGE_TYPE.filter(
          (item) => this.supportTypes.indexOf(item.value) !== -1
        ) || []
      );
    }
  },

  watch: {
    supportTypes(newValue) {
      const tabNameArry = this.activitedTab.split('_');

      // 判断活动的tab页是否在显示的配置服务列表中
      let isExist = false;
      if (newValue.length > 0 && tabNameArry.length > 1) {
        const value = Number(tabNameArry[1]);
        isExist = newValue.indexOf(value) !== -1;
      }
      // 如果不在，默认显示配置服务列表的第一项
      if (this.tabsArr.length > 0 && !isExist) this.activitedTab = `name_${this.tabsArr[0].value}`;
    }
  },

  methods: {
    changeEmail(content) {
      this.changecOnfigurationObj(content, 2);
    },
    changeWechat(content) {
      this.changecOnfigurationObj(content, 3);
    },
    changeDing(content) {
      this.changecOnfigurationObj(content, 5);
    },
    changeInner(content) {
      this.changecOnfigurationObj(content, 4);
    },
    changeSMS(content) {
      this.changecOnfigurationObj(content, 1);
    },
    changecOnfigurationObj(content, type) {
      const configurationObj = { ...this.value };
      const contents = [...this.contents];
      const index = contents.findIndex((item) => item.messageType === type);
      if (index === -1) contents.push(content);
      else contents[index] = content;
      configurationObj.contents = contents;
      this.$emit('input', configurationObj);
    },
    // 选择消息支持类型
    checkTypes(messageInfo) {
      const configurationObj = { ...this.value };
      configurationObj.supportTypes = messageInfo.checkTypes;
      this.$emit('input', configurationObj);
    }
  },

  mounted() {
    this.activitedTab = `name_${this.tabsArr[0].value}`;
  }
};
</script>

<style lang='scss' scoped>
</style>
