<template>
  <el-form @submit.native.prevent class="input__search">
    <apiot-input
      ref="input"
      :placeholder="getPlaceholder()"
      v-bind="$attrs"
      v-on="$listeners"
      @input.native="searchInput"
      @keyup.enter.native="searchBlur"
      @blur.native="inputBlur"
    ></apiot-input>
    <i class="iconfont icon-sousuo" @click="searchBlur"></i>
  </el-form>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getPlaceholder() {
      return function() {
        return this.placeholder || this.$t('placeholder.pleaseEnterkeySearch');
      };
    }
  },

  mounted() {},

  methods: {
    searchBlur() {
      this.$parent.current = 1;
      this.$emit('getList');
    },
    searchInput(e) {
      if (!e.target.value) {
        this.$parent.current = 1;
        this.$emit('getList');
      }
    },
    inputBlur(e) {
      this.$emit('blur', e);
    },
    focus() {
      this.$refs.input.focus();
    }
  }
};
</script>

<style lang='scss' scoped>
.input__search {
  position: relative;
  width: 200px;
  float: right;
  ::v-deep {
    .el-input__inner {
      height: 30px;
      padding-left: 12px;
      padding-right: 30px;
      border: 1px solid #e9e9e9 !important;
      &:hover {
        border-color: #c0c4cc !important;
      }
    }
    .el-input:focus-within + i.icon-sousuo {
      color: $--color-primary;
    }
  }
  .icon-sousuo {
    position: absolute;
    color: #d9d9d9;
    height: 28px;
    top: 50%;
    transform: translateY(-50%);
    right: 1px;
    width: 29px;
    line-height: 30px;
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
}
</style>
