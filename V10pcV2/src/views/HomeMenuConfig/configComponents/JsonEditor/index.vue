<template>
  <div class="json-editor-wrap" :class="{ fullScreen: isFull }">
    <div class="json-editor">
      <textarea ref="textarea" />
    </div>
    <div class="operWrap">
      <el-tooltip class="item" effect="dark" content="复制" placement="top">
        <span
          :class="`iconfont icon-fuzhi start${mathClassId}class`"
          :data-clipboard-text="value"
        ></span>
      </el-tooltip>
      <span class="split"></span>
      <el-tooltip
        class="item"
        effect="dark"
        :content="isFull ? '还原' : '全屏'"
        placement="top"
      >
        <span
          class="iconfont"
          :class="{ 'icon-quanping': !isFull, 'icon-quxiaoquanping': isFull }"
          @click="isFull = !isFull"
        ></span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import CodeMirror from 'codemirror';
import 'codemirror/addon/lint/lint.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/eclipse.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/json-lint';
import { createUnique } from '@/utils/utils';

/* eslint-disable import/no-webpack-loader-syntax  */
/* eslint-disable import/no-extraneous-dependencies  */
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
    if (this.clipboard) {
      this.clipboard.on('success', () => {
        this.$message.success('复制成功！');
      });
    }
    this.jsonEditor = CodeMirror.fromTextArea(this.$refs.textarea, {
      lineNumbers: true,
      mode: 'application/json',
      gutters: ['CodeMirror-lint-markers'],
      theme: 'eclipse',
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
    if (this.clipboard) {
      this.clipboard.destroy();
    }
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
    background: #fff;

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
    background: #fff;
    border: 1px solid #e9e9e9;
    box-sizing: border-box;
    z-index: 3;

    &:hover {
      border: 1px solid #4689f5;
    }

    .iconfont {
      color: #bbc3cd;
      font-size: 13px;
      line-height: 1;
      cursor: pointer;

      &:hover {
        color: #4689f5;
      }
    }

    .split {
      display: block;
      width: 1px;
      height: 13px;
      background-color: #bbc3cd;
    }
  }

  .json-editor {
    height: 100%;
    position: relative;
    overflow: auto;
    font-size: 18px;
    line-height: 1;
    border: 1px solid #e9e9e9;
    border-radius: 4px;
    box-sizing: border-box;

    ::v-deep {
      .cm-s-cobalt.CodeMirror,
      .cm-s-cobalt .CodeMirror-gutters {
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

      .CodeMirror pre.CodeMirror-line,
      .CodeMirror pre.CodeMirror-line-like {
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
        font-size: 13px;
      }
    }
  }
}
</style>
