<!--
 * @Author: sss
 * @Date: 2021-07-26 14:15:40
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-26 14:15:40
 * @Desc: 邮件
-->
<template>
  <article class="email">
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.serve')
      }}</label>
      <select-serve :messageType="2" v-model="server"></select-serve>
    </div>
    <div class="configuration--line title">
      <label class="header__label isRequired">{{
        $t('messageTemplate.subject')
      }}</label>
      <codemirror
        ref="emailTitle"
        key="emailTitle"
        com="emailTitle"
        prop="title"
        :height="34"
        @onCmFocus="onCmFocus"
        @contentChange="contentChange"
      ></codemirror>
    </div>
    <div class="configuration--line content">
      <label class="header__label isRequired">{{
        $t('messageTemplate.contentTemplate')
      }}</label>
      <apiot-wangeditor
        ref="emailContent"
        v-model="contentTemplate"
        :markRules="markRules"
        :editorConfig="editorConfig"
        @change="change"
        @wangeditor_focus="wangeditorFocus"
      >
      </apiot-wangeditor>
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
      isEmailFirst: true,
      contentProps: { subject: '' },
      contentTemplate: '',
      server: {},
      variables: [],
      editorConfig: { focus: true }
    };
  },

  computed: {
    serverId() {
      return this.server.id || '';
    },
    curContent() {
      const { server, contentTemplate, contentProps, serverId } = this;
      console.log(contentTemplate, 'contentTemplate');
      return {
        ...this.content,
        ...{
          contentProps: JSON.stringify(contentProps),
          content: contentTemplate,
          serverId,
          server,
          messageType: 2
        }
      };
    },
    markRules() {
      // 富文本框内容转化规则
      const markRules = this.variables.map((item) => {
        const rule = { ...item };
        rule.show = `<messageVar vartype=${rule.variableType}>${rule.variableName}</messageVar>`;
        // eslint-disable-next-line no-useless-concat
        rule.value = '$' + `{${rule.variableCode}!}`;
        rule.valueRegExp = new RegExp(`\\${rule.value}`, 'g');
        return rule;
      });
      return markRules;
    }
  },

  watch: {
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
      this.$refs.emailTitle.init({ content: this.contentProps.subject, variables: this.variables });
      this.$refs.emailContent.setValue(this.contentTemplate);
    },
    // 富文本聚焦
    wangeditorFocus() {
      this.$nextTick(() => {
        this.$bus.$emit('codemirrorVal_open', {
          codemirrorKey: 'emailContent_codemirror_markVal',
          isEmailFirst: this.isEmailFirst
        });
        this.isEmailFirst = true;
      });
    },
    // 编辑聚焦时
    onCmFocus(codemirrorValInfo) {
      // 编辑器聚焦后通知变量区打开“变量注入功能”，并带给变量区对应的编辑器唯一标识，可以正确注入对应编辑器
      this.$bus.$emit('codemirrorVal_open', {
        codemirrorKey: `${codemirrorValInfo.com}_codemirror_markVal`
      });
    },
    // 内容发送变化
    change() {
      this.$emit('change', this.curContent);
    },
    // 标题发生变化时
    contentChange(value) {
      this.contentProps.subject = value.content;
      this.$emit('change', this.curContent);
    },
    // 创建标记节点
    createMartDom(markText, type) {
      const htmlNode = document.createElement('input');
      htmlNode.className = `custom__varible type_${type}`;
      // const htmlText = `${markText}`;
      // htmlNode.innerHTML = htmlText;
      htmlNode.setAttribute('disabled', true);
      htmlNode.setAttribute('value', `${markText}`);
      return htmlNode;
    }
  },

  mounted() {
    this.init();

    // 向标题注入变量
    this.$bus.$on('emailTitle_codemirror_markVal', (info) => {
      this.$refs.emailTitle.setValue(info);
    });

    // 向内容注入变量
    this.$bus.$on('emailContent_codemirror_markVal', (info) => {
      const { variable, customArry } = info;
      const { variableType, variableName } = variable;
      this.variables = customArry;
      // const node = this.createMartDom(variableName, variableType);
      this.$refs.emailContent.setNode({
        type: 'messageVar',
        vartype: variableType,
        children: [{ text: variableName }]
      }); // 添加一个标记 node DOM节点
    });
  },

  beforeDestroy() {
    this.$bus.$off('emailTitle_codemirror_markVal');
    this.$bus.$off('emailContent_codemirror_markVal');
  }
};
</script>

<style lang='scss' scoped>
@import '../tab.scss';
.title {
  ::v-deep {
    .codemirror {
      padding: 0 0 0 12px;
      & .CodeMirror pre.CodeMirror-line {
        padding: 0;
      }
    }
  }
}
.email {
  ::v-deep {
    .w-e-scroll {
      height: 140px;
    }
  }
}
</style>
