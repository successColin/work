<!--
 * @Author: sss
 * @Date: 2022-04-28 11:17:49
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-28 11:17:49
 * @Desc: 编辑器
-->
<template>
  <div class="apiotWangeditor" v-if="show">
    <Toolbar
      style="border-bottom: 1px solid #e9e9e9"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="flex: 1; overflow-y: hidden"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @onBlur="onBlur"
      @onFocus="onFocus"
      @onChange="onChange"
    />
    <div ref="curEidtor" style="display: none"></div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

import mixin from './mixin';
import './customRender';

export default {
  components: { Editor, Toolbar },

  mixins: [mixin],

  props: {
    editorStyle: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    // 编辑器类型simple=简单
    mode: {
      type: String,
      default: 'default'
    },
    /**
     * dec:用于内容根据标记规则进行转化规则
     * 格式:[{show:Any,value:Any,valueRegExp:RegExp}]
     * show:'显示在标记里的内容'
     * value:'保存时实际的值'
     * valueRegExp:'用来匹配value的正则（一般不要传，特殊的value需要传一下例如：${aa}）'
     */
    markRules: {
      type: Array,
      default: () => []
    },
    // 额外菜单配置
    extraToolbarConfig: {
      type: Object,
      default: () => {}
    },
    // 额外编辑器配置
    extraEditorConfig: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      editor: null,
      content: '',
      changeCount: 0
    };
  },

  mounted() {
    if (this.editorStyle && document.querySelector('.w-e-scroll')) {
      document.querySelector('.w-e-scroll').style = this.editorStyle;
    }
  },
  computed: {
    realMarkRules() {
      const markRules = this.markRules.map((item) => {
        const rule = { ...item };
        // 标记的特殊标识 wangeDitor-widget
        rule.show = `${rule.show}`;
        rule.showRegExp = new RegExp(rule.show, 'g');
        if (!rule.valueRegExp) {
          rule.valueRegExp = new RegExp(`${rule.value}`, 'g');
        }
        return rule;
      });
      return markRules;
    }
  },

  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      this.changeCount = 0;
      this.$nextTick(() => {
        setTimeout(() => {
          this.content = this.value;
          this.setValue(this.content);
        }, 0);
      });
    },
    onBlur() {
      this.$emit('wangeditor_blur', this.editor.getHtml());
    },
    onFocus() {
      this.$emit('wangeditor_focus', this.editor.getHtml());
    },
    getHtmlObj() {
      return { html: this.editor.getHtml(), text: this.editor.getText() };
    },
    clearContent() {
      this.editor.clear();
    },
    // 取出区域内所有img的src
    getSrc(html) {
      const imgReg = /(<img)|(<video).*?(?:>|\/>)/gi;
      // 匹配src属性
      const srcReg = /src=[\\"]?([^\\"]*)[\\"]?/i;
      const arr = html.match(imgReg);
      const imgs = [];
      if (arr) {
        for (let i = 0; i < arr.length; i += 1) {
          const src = arr[i].match(srcReg)[1];
          imgs.push(src);
        }
      }
      return imgs;
    },
    // 数据变化
    onChange() {
      if (this.changeCount === 0) {
        this.changeCount = 1;
        return;
      }
      let str = this.editor.getHtml();
      // 如果有转换规则需要按照规则进行转换
      this.realMarkRules.forEach((item) => {
        str = str.replace(item.showRegExp, item.value);
      });
      // console.log(str);
      // if (str) {
      //   this.replaceImgToken(str);
      // }
      this.$emit('input', str);
      this.$emit('change', { content: str, showContent: str });
    },
    // 替换图片地址
    replaceImgToken(str) {
      const box = this.$refs.curEidtor;
      box.innerHTML = str;
      let flag = false;
      const imgs = box.querySelectorAll('img');
      imgs.forEach((img) => {
        let src = img.getAttribute('src');
        if (src.indexOf('token') === -1) {
          flag = true;
          src = this.$parseImgUrl(src);
        }
        img.setAttribute('src', src);
        img.setAttribute('alt', '');
        img.setAttribute('href', '');
        img.setAttribute('data-href', '');
      });
      const videos = box.querySelectorAll('video');
      videos.forEach((video) => {
        const source = video.querySelector('source');
        let src = source.getAttribute('src');
        if (src.indexOf('token') === -1) {
          flag = true;
          src = this.$parseImgUrl(src);
        }
        source.setAttribute('src', src);
      });
      if (flag) {
        this.editor.clear();
        const resStr = box.innerHTML;
        box.innerHTML = '';
        this.$nextTick(() => {
          this.setValue(resStr);
        });
      }
    },
    // 插入值
    setNode(slateNode) {
      this.editor.insertNode(slateNode);
    },
    setHtml(html) {
      // console.log(html);
      let content = html;
      this.realMarkRules.forEach((item) => {
        content = content.replace(item.valueRegExp, item.show);
      });
      this.editor.dangerouslyInsertHtml(content);
    },
    // 设置编辑器内容
    setValue(value) {
      if (this.editor) {
        this.editor.focus();
        this.setHtml(value);
      } else {
        this.content = value;
      }
    }
  },
  beforeDestroy() {
    const { editor } = this;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  }
};
</script>

<style  lang='scss' scoped>
@import './index';
.apiotWangeditor {
  display: flex;
  flex-direction: column;
  border: 1px solid #e9e9e9;
  ::v-deep {
    &.w-e-full-screen-container {
      z-index: 2000;
    }
    .w-e-text-placeholder {
      position: absolute;
      top: 0px;
      color: #aaaaaa;
    }
  }
}
</style>
