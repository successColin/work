<!--
 * @Author: cmk
 * @Date: 2021-04-16 17:54:03
 * @LastEditors: cmk
 * @LastEditTime: 2021-04-17 08:57:22
 * @Des: 字段选择组装
-->
<template>
  <div class="fieldCol">
    <select-field
      :searchField.sync="searchField"
      v-on="$listeners"
      v-bind="$attrs"
    ></select-field>
    <search-res
      :searchField="searchField"
      v-on="$listeners"
      v-bind="$attrs"
    ></search-res>
    <!-- <multi-dialog

    ></multi-dialog> -->
    <!-- <componenet
      :is="dialogCompName"
      :visible.sync="multiVisible"
      v-on="$listeners"
      v-bind="$attrs"
    ></componenet> -->
    <slot name="dialog"></slot>
  </div>
</template>

<script>
import SelectField from './SelectField';
import SearchRes from './SearchRes';

export default {
  props: {},
  data() {
    return {
      // 搜索字段
      searchField: ''
    };
  },

  components: {
    SelectField,
    SearchRes
    // dialogCompName:
  },

  computed: {},

  mounted() {
    // this.component(this.dialogCompName, (resolve) => require([`${this.dialogPath}`], resolve));
  },

  methods: {},

  watch: {
    searchField(v) {
      // console.log(v);
      // 做搜索操作,赋值searchRes
      this.$emit('getSearchResArr', v);
    }
  }
};
</script>

<style lang='scss' scoped>
.fieldCol {
  position: relative;
}
</style>
