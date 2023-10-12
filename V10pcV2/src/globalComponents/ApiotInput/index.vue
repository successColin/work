<!--
 * @Descripttion: 通用input框
 * @Author: ytx
 * @Date: 2021-04-12 11:25:37
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:25:19
-->
<template>
  <el-input
    ref="elInput"
    class="apiotInput"
    :class="[{ hasLimit: isShowWordLimit }]"
    v-bind="$attrs"
    v-on="$listeners"
    v-forbid="isForbid"
    :maxlength="maxlength"
    :show-word-limit="isShowWordLimit"
    @keydown.native="keyDown"
    @blur="valueBlur"
  >
    <div v-for="(item, i) in slotTypeArr" :key="i" :slot="item">
      <slot :name="item"></slot>
    </div>
  </el-input>
</template>

<script>
export default {
  name: 'myInput',
  props: {
    // input 最大输入据长度限制
    maxlength: {
      type: [Number, String],
    },
    // 插槽类型
    slotType: {
      type: String,
      default: '',
    },
    isForbid: {
      type: Boolean,
      default: true,
    },
    // 去空格
    isDelSpace: {
      type: Boolean,
      default: true,
    },
    // 不去单引号
    notDelDot: {
      type: Boolean,
      default: false,
    },
  },
  inheritAttrs: false,
  data() {
    return {
      isNeedPrevent: false,
      keyEvent: false,
    };
  },
  computed: {
    isShowWordLimit() {
      return !!this.maxlength;
    },
    slotTypeArr() {
      return this.slotType.split(',');
    },
  },
  methods: {
    keyDown(e) {
      if (e.keyCode === 32 && this.isDelSpace) {
        e.preventDefault();
        return false;
      }
    },
    focus() {
      this.$refs.elInput.focus();
    },
    select() {
      this.$refs.elInput.select();
    },
    valueBlur(e) {
      if (!this.notDelDot) {
        e.target.value = e.target.value.replace(/[']/g, '');
        e.target.dispatchEvent(new Event('input'));
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.apiotInput {
  ::v-deep {
    input {
      // cursor: pointer;
    }
  }
}
.hasLimit {
  ::v-deep {
    .el-input__inner {
      padding-right: 50px !important;
    }
  }
}
</style>
