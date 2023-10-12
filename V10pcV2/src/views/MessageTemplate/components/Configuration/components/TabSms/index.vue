<!--
 * @Author: sss
 * @Date: 2021-07-26 14:15:40
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-26 14:15:40
 * @Desc: 短信
-->
<template>
  <article class="smsSystem">
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.serve')
      }}</label>
      <select-serve :messageType="1" v-model="server"></select-serve>
    </div>
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.sign')
      }}</label>
      <apiot-input
        v-model="contentProps.signName"
        :placeholder="
          $t('placeholder.pleaseEnterAny', {
            any: $t('messageTemplate.sign'),
          })
        "
      ></apiot-input>
    </div>
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.templateCode')
      }}</label>
      <apiot-input
        v-model="contentProps.templateCode"
        :placeholder="
          $t('placeholder.pleaseEnterAny', {
            any: $t('messageTemplate.templateCode'),
          })
        "
      ></apiot-input>
    </div>
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.contentTemplate')
      }}</label>
      <codemirror
        ref="sms"
        key="sms"
        com="smsContent"
        prop="content"
        :height="200"
        @onCmFocus="onCmFocus"
        @contentChange="contentChange"
      ></codemirror>
    </div>
  </article>
</template>

<script>
import Codemirror from '../Codemirror';
import SelectServe from '../SelectServe';

export default {
  components: { Codemirror, SelectServe },

  inject: ['getVariables'],

  props: {
    content: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      contentProps: { signName: '', templateCode: '' },
      signName: '',
      templateCode: '',
      contentTemplate: '',
      server: {},
      variables: []
    };
  },

  computed: {
    // contentProps() {
    //   const { signName, templateCode } = this;
    //   return { signName, templateCode };
    // },
    serverId() {
      return this.server.id || '';
    },
    smsContent() {
      const { server, contentTemplate, contentProps, serverId } = this;
      return {
        ...this.content,
        ...{
          contentProps: JSON.stringify(contentProps),
          content: contentTemplate,
          serverId,
          server,
          messageType: 1
        }
      };
    }
  },

  watch: {
    contentProps: {
      handler() {
        this.$emit('change', this.smsContent);
      },
      immediate: true,
      deep: true
    },
    server() {
      this.$emit('change', this.smsContent);
    }
  },

  methods: {
    init() {
      this.contentTemplate = this.content.content || '';
      const { contentProps, serverId, server = {} } = this.content;
      if (contentProps) this.contentProps = JSON.parse(contentProps);
      server.id = serverId || '';
      this.server = { ...server };

      this.variables = this.getVariables();
      this.$refs.sms.init({ content: this.contentTemplate, variables: this.variables });
    },
    // 编辑聚焦时
    onCmFocus(codemirrorValInfo) {
      // 编辑器聚焦后通知变量区打开“变量注入功能”，并带给变量区对应的编辑器唯一标识，可以正确注入对应编辑器
      this.$bus.$emit('codemirrorVal_open', {
        codemirrorKey: `${codemirrorValInfo.com}_codemirror_markVal`
      });
    },
    // 值发生变化时
    contentChange(value) {
      this.contentTemplate = value.content;
      this.$emit('change', this.smsContent);
    }
  },

  mounted() {
    // console.log('==================================2');
    this.init();

    // 向编辑器注入变量
    this.$bus.$on('smsContent_codemirror_markVal', (info) => {
      this.$refs.sms.setValue(info);
    });
  },

  beforeDestroy() {
    this.$bus.$off('smsContent_codemirror_markVal');
  }
};
</script>

<style lang='scss' scoped>
@import '../tab.scss';
</style>
