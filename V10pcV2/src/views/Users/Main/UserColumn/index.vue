<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <User
          :prop="keyName"
          :row="scope.row"
          v-bind="$attrs"
      ></User>
    </template>
  </el-table-column>
</template>

<script>
import User from './Users';

export default {
  inheritAttrs: false,
  props: {
    keyName: {
      type: String,
      default: 'name',
    }
  },
  data() {
    return {};
  },

  components: {
    User
  },

  computed: {
  },

  mounted() {
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
