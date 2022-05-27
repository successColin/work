<template>
  <div class="input__search">
    <apiot-input
      v-bind="$attrs"
      v-on="$listeners"
      :placeholder="$t('placeholder.pleaseEnterkeySearch')"
      @input.native="searchBlur"
    >
    </apiot-input>
    <i class="iconfont icon-sousuo"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    searchBlur() {
      this.$emit('getList');
    },
    searchInput(e) {
      if (!e.target.value) {
        this.$emit('getList');
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.input__search {
  width: 100%;
  position: relative;
  ::v-deep {
    .el-input__inner {
      height: 36px;
      padding-left: 28px;
      border: none;
      border-bottom: 1px solid #e9e9e9;
      border-radius: 0px;
    }
    .el-input:focus-within + i.icon-sousuo {
      color: $--color-primary;
    }
  }
  .icon-sousuo {
    position: absolute;
    color: #bbc3cd;
    height: 28px;
    top: 50%;
    transform: translateY(-50%);
    left: 1px;
    width: 29px;
    line-height: 30px;
    cursor: pointer;
    font-size: 18px;
    &:hover {
      color: $--color-primary;
    }
  }
}
</style>
