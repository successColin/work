<template>
  <div
      class="json-editor-wrap"
      :class="{fullScreen: isFull}"
  >
    <div
        class="json-editor"
    >
      <textarea ref="textarea"/>

    </div>
    <div class="operWrap">
      <span :class="`iconfont icon-fuzhi start${mathClassId}class`" :data-clipboard-text="value"></span>
      <span class="split"></span>
      <span
          class="iconfont"
          :class="{'icon-quanping': !isFull, 'icon-quxiaoquanping': isFull}"
          @click="isFull=!isFull"
      ></span>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import {createUnique} from '@/utils/utils';

// eslint-disable-next-line no-undef
require('script-loader!jsonlint');

export default {
  name: 'JsonEditor',
  /* eslint-disable vue/require-prop-types */
  props: {
    value: {
      type: String,
      default() {
        return '{}';
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      isFull: false, // 是否全屏
      jsonEditor: false,
      cursor: null,
      clipboard: null,
      mathClassId: null
    };
  },
  watch: {
    value(value) {
      this.$nextTick(() => {
        const editorValue = this.jsonEditor.getValue();
        if (value !== editorValue) {
          const value1 = JSON.parse(this.value);
          this.jsonEditor.setValue(JSON.stringify(value1, null, 2));
        }
      });
    }
  },
  mounted() {
    this.mathClassId = createUnique();
    this.clipboard = new Clipboard(`.start${this.mathClassId}class`);
    this.clipboard && this.clipboard.on('success', () => {
      this.$message.success('复制成功！');
    });
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'cobalt',
      lint: true,
      ...this.config
    });
    this.$nextTick(() => {
      // this.jsonEditor.refresh();
      this.jsonEditor.setValue(JSON.stringify(JSON.parse(this.value.replace(/\\/g, '')), null, 2));
      // this.jsonEditor.focus();
    });
    this.jsonEditor.on('change', (cm) => {
      this.$emit('changed', cm.getValue());
      this.$emit('input', cm.getValue());
    });
    this.jsonEditor.on('blur', (cm) => {
      this.$emit('blur', cm.getValue());
      this.cursor = cm.getCursor();
    });
  },
  methods: {
    getValue() {
      return this.jsonEditor.getValue();
    },
    focus() {
      this.jsonEditor.focus();
    }
  },
  beforeDestroy() {
    this.clipboard && this.clipboard.destroy();
    this.mathClassId = null;
  }
};
</script>

<style lang="scss" scoped>
.json-editor-wrap {
  position: relative;
  height: 300px;

  &.fullScreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    height: calc(100%);
    background: #192757;

    .json-editor {
      height: 100%;
    }
  }

  .operWrap {
    position: absolute;
    bottom: 10px;
    right: 10px;
    width: 60px;
    height: 22px;
    display: flex;
    padding: 4px 8px;
    justify-content: space-between;
    align-items: center;
    background: #192757;
    border: 1px solid #2F437F;
    box-sizing: border-box;
    z-index: 3;

    &:hover {
      border: 1px solid #4689F5;
    }

    .iconfont {
      color: #FFFFFF;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        color: #4689F5;
      }
    }

    .split {
      display: block;
      width: 1px;
      height: 13px;
      background-color: #2F437F;
    }
  }

  .json-editor {
    height: 100%;
    position: relative;
    overflow: auto;
    font-size: 18px;
    line-height: 1;
    border: 1px solid #2F437F;
    box-sizing: border-box;

    ::v-deep {
      .cm-s-cobalt.CodeMirror, .cm-s-cobalt .CodeMirror-gutters {
        background: #192757;
      }

      .cm-s-cobalt .CodeMirror-gutters {
        border-right: 1px solid #2f437f;
      }

      .CodeMirror {
        height: auto;
        min-height: 300px;
      }

      .CodeMirror-linenumber {
        font-size: 13px;
      }

      .CodeMirror-scroll {
        min-height: 300px;
      }

      .CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like {
        font-size: 13px;
      }

      .cm-s-rubyblue span.cm-string {
        color: #f08047;
      }

      .jsonEditor__text {
        vertical-align: 2px;
        padding: 2px 10px;
        background: #e5f0ff;
        border-radius: 4px;
        color: #4689f5;
        font-size: 14px;
      }
    }
  }
}
</style>
