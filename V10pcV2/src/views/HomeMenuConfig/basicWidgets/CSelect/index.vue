/**
* @name: index
* @author: DELL
* @date: 2021/8/26 15:15
* @description：index
* @update: 2021/8/26 15:15
*/
<!-- 页面 -->
<template>
  <el-select
      class="selectWrap"
      v-bind="$attrs"
      ref="selectWrap"
      v-on="$listeners"
  >
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>

.selectWrap {
  width: 100%;

  ::v-deep {
    .el-input__inner {
      height: 32px !important;
      line-height: 32px;
      background-color: #fff !important;
      color: #333 !important;
      //border-color: #e9e9e9;
    }

    .el-input__inner:focus {
      //border-color: $component-borderFocus-color;
    }

    .el-input__inner:hover {
      //border-color: $component-borderFocus-color;
    }

    .el-input__icon {
      line-height: 32px;
    }

    .el-select-dropdown {
      //background-color: #202020;
      //border: 1px solid #404040;
    }
  }
}
</style>
