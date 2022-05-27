<!--
 * @Author: sss
 * @Date: 2021-07-26 14:15:40
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-26 14:15:40
 * @Desc: 站内信
-->
<template>
  <article class="inner">
    <div class="configuration--line title">
      <label class="header__label isRequired">{{
        $t('messageTemplate.title')
      }}</label>
      <codemirror
        ref="innerTitle"
        key="innerTitle"
        com="innerTitle"
        prop="title"
        :height="34"
        @onCmFocus="onCmFocus"
        @contentChange="titleChange"
      ></codemirror>
    </div>
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.address')
      }}</label>
      <apiot-input
        v-model="contentProps.jumpLink"
        :placeholder="
          $t('placeholder.pleaseEnterAny', {
            any: $t('messageTemplate.address'),
          })
        "
      ></apiot-input>
    </div>
    <div class="configuration--line">
      <label class="header__label isRequired">{{
        $t('messageTemplate.contentTemplate')
      }}</label>
      <codemirror
        ref="innerContent"
        key="innerContent"
        com="innerContent"
        prop="content"
        :height="187"
        @onCmFocus="onCmFocus"
        @contentChange="contentChange"
      ></codemirror>
    </div>
  </article>
</template>

<script>
import Codemirror from '../Codemirror';

export default {
  components: { Codemirror },

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
      contentProps: { title: '', jumpLink: '', innerMailCategory: 3 },
      contentTemplate: '',
      variables: []
    };
  },

  computed: {
    curContent() {
      const { contentTemplate, contentProps } = this;
      return {
        ...this.content,
        ...{ contentProps: JSON.stringify(contentProps), content: contentTemplate, messageType: 4 }
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
    }
  },

  methods: {
    init() {
      this.contentTemplate = this.content.content || '';
      const { contentProps } = this.content;
      if (contentProps) this.contentProps = JSON.parse(contentProps);

      this.variables = this.getVariables();
      this.$refs.innerTitle.init({ content: this.contentProps.title, variables: this.variables });
      this.$refs.innerContent.init({ content: this.contentTemplate, variables: this.variables });
    },
    // 编辑聚焦时
    onCmFocus(codemirrorValInfo) {
      // 编辑器聚焦后通知变量区打开“变量注入功能”，并带给变量区对应的编辑器唯一标识，可以正确注入对应编辑器
      this.$bus.$emit('codemirrorVal_open', {
        codemirrorKey: `${codemirrorValInfo.com}_codemirror_markVal`
      });
    },
    // 标题发生变化时
    titleChange(value) {
      this.contentProps.title = value.content;
      // this.$emit('change', this.curContent);
    },
    // 值发生变化时
    contentChange(value) {
      this.contentTemplate = value.content;
      this.$emit('change', this.curContent);
    }
  },

  mounted() {
    this.init();

    // 向标题注入变量
    this.$bus.$on('innerTitle_codemirror_markVal', (info) => {
      this.$refs.innerTitle.setValue(info);
    });
    // 向内容模板注入变量
    this.$bus.$on('innerContent_codemirror_markVal', (info) => {
      this.$refs.innerContent.setValue(info);
    });
  },

  beforeDestroy() {
    this.$bus.$off('innerTitle_codemirror_markVal');
    this.$bus.$off('innerContent_codemirror_markVal');
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
</style>
