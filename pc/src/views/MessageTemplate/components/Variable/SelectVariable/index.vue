<!--
 * @Author: sss
 * @Date: 2021-07-19 14:43:30
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-19 14:43:30
 * @Desc: 变量类型
-->
<template >
  <el-popover
    class="selectVariable"
    v-on="$listeners"
    v-bind="$attrs"
    popper-class="custom"
  >
    <i slot="reference" class="iconfont icon-xinzeng"></i>
    <section class="selectVariable__content">
      <p
        class="selectVariable__content--item"
        v-for="(item, index) in $store.state.dictManage.VARIABLE_TYPE"
        :key="`type_${index}`"
        @click="clickVarType(item)"
      >
        {{ item.name }}
      </p>
    </section>
  </el-popover>
</template>

<script>
export default {
  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {
    // 选择变量类型
    clickVarType(item) {
      this.$emit('clickVarType', item);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.icon-xinzeng {
  font-size: 16px;
  color: $--color-primary;
  cursor: pointer;
}
.selectVariable {
  ::v-deep {
    .variablePop {
      padding: 0 !important;
    }
  }
  &__content {
    width: 120px;
    overflow: auto;

    &--item {
      padding: 0 12px;
      height: 36px;
      line-height: 36px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      &:hover {
        background: #f1f7ff;
      }
    }
  }
}
</style>
