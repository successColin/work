<!-- * @描述: 通用复选框 -->
<template>
  <el-select
    v-bind="$attrs"
    v-on="$listeners"
    ref="apiotSelect"
    class="apiotSelect"
  >
    <slot name="selectHeader"></slot>
    <slot></slot>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.name"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleClose() {
      this.$refs.apiotSelect.handleClose();
    }
  }
};
</script>
<style lang='scss' scoped>
.apiotSelect {
  width: 100%;
}
</style>
