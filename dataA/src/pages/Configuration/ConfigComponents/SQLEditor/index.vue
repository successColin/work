<template>
  <div
      class="sql-editor-wrap"
      :class="{fullScreen: isFull}"
  >
    <div class="sql-editor">
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
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/cobalt.css';
import 'codemirror/mode/sql/sql';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint';
// 上边两个是定义提示的前提，下边定义自动提示是哪种模式，此处为sql
import 'codemirror/addon/hint/sql-hint';
// 引入keymap
import 'codemirror/addon/comment/comment';
import 'codemirror/keymap/sublime';
import {createUnique} from '@/utils/utils';

export default {
  name: 'SQLEditor',
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
      jsonEditor: false,
      cursor: null,
      isFull: false, // 是否全屏
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
      keyMap: 'sublime',
      indentUnit: 4,
      tabSize: 4,
      mode: 'text/x-mysql',
      theme: 'cobalt',
      showCursorWhenSelecting: true,
      option: {
        autofocus: true
      },
      //  这是针对sql有自定义表和字段的，这样可以把自己的表和字段也放入提示里。如果数据是异步请求获取的，可以通过editor.setOption('hintOptions', data)
      hintOptions: {
        tables: {
          table1: ['col_A', 'col_B', 'col_C'],
          table2: ['other_columns1', 'other_columns2']
        }
      },
      ...this.config
    });
    this.$nextTick(() => {
      // this.jsonEditor.refresh();
      // this.jsonEditor.setValue(this.value, null, 2);
      // this.jsonEditor.focus();
    });
    this.jsonEditor.setValue(this.value, null, 2);
    // this.jsonEditor.focus();
    this.jsonEditor.on('change', (instance, change) => {
      // cm.showHint();
      // 自动补全的时候，也会触发change事件，所有坐下判断，以免死循环，正则是为了不让空格，换行之类的也提示
      // 通过change对象你可以自定义一些规则去判断是否提示
      // if (change.origin !== 'complete' && /\w|\./g.test(change.text[0])) {
      //   instance.showHint()
      // }
      this.$emit('changed', instance.getValue());
      this.$emit('input', instance.getValue());
    });
    this.jsonEditor.on('blur', (cm) => {
      this.cursor = cm.getCursor();
      this.$emit('blur', cm.getValue());
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
.sql-editor-wrap {
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

  .sql-editor {
    height: 100%;
    position: relative;
    overflow: auto;
    font-size: 18px;
    line-height: 1;
    border: 1px solid #2F437F;
    box-sizing: border-box;

    ::v-deep {
      .cm-s-cobalt.CodeMirror, .cm-s-cobalt .CodeMirror-gutters {
        background-color: #192757;
      }

      .CodeMirror {
        height: auto;
        min-height: 300px;
      }

      .cm-s-cobalt .CodeMirror-gutters {
        border-right: 1px solid #2f437f;
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
