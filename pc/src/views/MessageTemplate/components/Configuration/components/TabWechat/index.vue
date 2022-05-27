<!--
 * @Author: sss
 * @Date: 2021-07-26 14:15:40
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-26 14:15:40
 * @Desc: 微信
-->
<template>
  <article class="wechat">
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.serve')
      }}</label>
      <select-serve :messageType="3" v-model="server"></select-serve>
    </div>
    <div class="configuration--line">
      <div class="configuration--line--item">
        <label class="header__label">{{
          $t('messageTemplate.whether', { any: $t('messageTemplate.secrecy') })
        }}</label>
        <apiot-switch
          v-model="contentProps.safe"
          :activeValue="1"
          :inactivevalue="0"
        ></apiot-switch>
      </div>
      <div class="configuration--line--item">
        <label class="header__label">{{
          $t('messageTemplate.whether', {
            any: $t('messageTemplate.duplicateMessageCheck'),
          })
        }}</label>
        <apiot-switch
          v-model="contentProps.enableDuplicateCheck"
          :activeValue="1"
          :inactivevalue="0"
        ></apiot-switch>
      </div>
    </div>
    <div
      class="configuration--line"
      v-if="contentProps.enableDuplicateCheck === 1"
    >
      <label class="header__label">{{
        $t('messageTemplate.timeInterval')
      }}</label>
      <apiot-input
        v-model="contentProps.duplicateCheckInterval"
        slotType="append"
        :placeholder="
          $t('placeholder.pleaseEnterAny', {
            any: $t('messageTemplate.timeInterval'),
          })
        "
      >
        <template slot="append">s</template>
      </apiot-input>
    </div>
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.contentTemplate')
      }}</label>
      <codemirror
        ref="wechatContent"
        key="wechatContent"
        com="wechatContent"
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
      contentProps: { safe: 0, enableDuplicateCheck: 0, duplicateCheckInterval: 1 },
      contentTemplate: '',
      variables: [],
      server: {}
    };
  },

  computed: {
    serverId() {
      return this.server.id || '';
    },
    curContent() {
      const { server, contentTemplate, contentProps, serverId } = this;
      return {
        ...this.content,
        ...{
          contentProps: JSON.stringify(contentProps),
          content: contentTemplate,
          serverId,
          server,
          messageType: 3
        }
      };
    }
  },

  watch: {
    contentProps: {
      handler() {
        this.$emit('change', this.curContent);
      },
      immediate: true,
      deep: true
    },
    server() {
      this.$emit('change', this.curContent);
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
      this.$refs.wechatContent.init({ content: this.contentTemplate, variables: this.variables });
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
      this.$emit('change', this.curContent);
    }
  },

  mounted() {
    this.init();

    // 向编辑器注入变量
    this.$bus.$on('wechatContent_codemirror_markVal', (info) => {
      this.$refs.wechatContent.setValue(info);
    });
  },

  beforeDestroy() {
    this.$bus.$off('wechatContent_codemirror_markVal');
  }
};
</script>

<style lang='scss' scoped>
@import '../tab.scss';
</style>
