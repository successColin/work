<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="tip"
    title="自定义提示"
    :isShowSure="false"
    cancelBtnName="关闭"
  >
    <div class="tip__wrapper">
      <ul class="compBox">
        <li
          class="compBox__item"
          v-for="item in getCompArr"
          :key="item.compId"
          @click="insertNode(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <!-- <apiot-wangeditor
        class="editor"
        :key="1"
        ref="submit"
        v-model="submitObj.html"
        :markRules="markRules"
        :menus="basicMenu"
        :editorConfig="editorConfig"
      ></apiot-wangeditor> -->
      <apiot-wangeditor
        class="editor"
        :key="1"
        ref="submit"
        mode="simple"
        v-model="submitObj.html"
        :markRules="markRules"
        :extraToolbarConfig="toolbarConfig"
      >
      </apiot-wangeditor>
    </div>
  </apiot-dialog>
</template>

<script>
export default {
  props: {
    // 所有表单组件
    getCompArr: {
      type: Array
    },
    activeObj: {
      type: Object
    },
    configData: {
      type: Array
    },
    submitObj: {
      type: Object
    }
  },
  data() {
    return {
      basicMenu: ['bold', 'italic', 'underline', 'link', 'image'],
      editorConfig: {
        height: 360
      },
      toolbarConfig: {
        toolbarKeys: ['bold', 'underline', 'italic', 'color', 'bgColor']
      }
    };
  },

  components: {},

  computed: {
    markRules() {
      // 富文本框内容转化规则
      const markRules = this.getCompArr.map((item) => {
        const rule = {};
        rule.show = `<messageVar vartype=${item.compId}>${item.name}</messageVar>`;
        // eslint-disable-next-line no-useless-concat
        rule.value = '$' + `{${item.compId}}`;
        rule.valueRegExp = new RegExp(`\\${rule.value}`, 'g');
        return rule;
      });
      return markRules;
    }
  },

  mounted() {},

  methods: {
    insertNode(info) {
      this.$refs.submit.setNode({
        type: 'messageVar',
        vartype: `$${info.compId}`,
        // vartype: variableType,
        children: [{ text: info.name }]
      }); // 添加一个标记 node DOM节点
    },
    updateValue(v) {
      this.submitObj.html = v;
    }
  }
};
</script>

<style lang='scss' scoped>
.tip {
  &__wrapper {
    height: calc(100% - 10px);
    display: flex;
    align-items: center;
    .compBox {
      box-sizing: border-box;
      width: 190px;
      margin-right: 10px;
      height: 100%;
      border: 1px solid #e9e9e9;
      overflow: auto;
      padding: 6px 10px;
      &__item {
        width: max-content;
        padding: 0 10px;
        height: 24px;
        line-height: 24px;
        background: #e5f0ff;
        border-radius: 4px;
        font-weight: 400;
        color: #4689f5;
        font-size: 13px;
        margin-bottom: 12px;
        cursor: pointer;
      }
    }
    .editor {
      flex: 1;
      height: 100%;
      ::v-deep {
        .w-e-scroll {
          resize: none;
        }
      }
    }
  }
}
</style>
