<!-- * @描述: 通用按钮 -->
<template>
  <el-button
    v-bind="$attrs"
    v-on="$listeners"
    :class="[{ button__full: isFull }]"
    class="button"
    @click="removeFocus"
  >
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  props: {
    isFull: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    removeFocus() {
      const isTouch = 'ontouchend' in document;
      if (isTouch) {
        return;
      }
      const input = document.getElementById('removeFocus') || this.createFocusInput();
      input.focus();
    },
    createFocusInput() {
      const input = document.createElement('input');
      input.id = 'removeFocus';
      // input.style.visibility = 'hidden';
      input.style.position = 'fixed';
      input.style.width = '0px';
      input.style.height = '0px';
      input.style.padding = '0px';
      input.style.border = '0px';
      input.style.left = '-10000px';
      document.body.appendChild(input);
      return input;
    }
  }
};
</script>
<style lang="scss" scoped>
.button__full {
  width: 100%;
  height: 100%;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ::v-deep {
    span {
      display: flex;
      align-items: center;
    }
  }
}
</style>
