/**
* @name: index
* @author: DELL
* @date: 2021/10/29 14:51
* @description：index
* @update: 2021/10/29 14:51
*/
<!-- 页面 -->
<template>
  <div class="inputWrap">
    <el-input
        ref="input"
        v-on="$listeners"
        v-bind="$attrs"
    />
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    focus(){
      this.$refs.input.focus();
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.inputWrap {
  ::v-deep {
    .el-input__inner {
      color: #ffffff;
      height: 32px;
      line-height: 32px;
      background-color: $component-background-color;
      border-color: $component-border-color;

      &:hover {
        border-color: $component-borderFocus-color;
      }
    }

    .el-input.is-active .el-input__inner, .el-input__inner:focus {
      border-color: $component-borderFocus-color;
      transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    }

    .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled), .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
      border-color: $component-border-color;
    }

    .el-input-number__decrease, .el-input-number__increase {
      width: 20px;
    }

    .el-input-number {
      width: 100%;
    }

    input::-webkit-input-placeholder {
      /* WebKit browsers */
      color: rgba(255, 255, 255, 0.51) !important;
    }

    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: rgba(255, 255, 255, 0.51) !important;
    }

    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: rgba(255, 255, 255, 0.51) !important;
    }

    input:-ms-input-placeholder {
      /* Internet Explorer 10+ */
      color: rgba(255, 255, 255, 0.51) !important;
    }
  }
}
</style>
