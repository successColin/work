<!--  -->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
  >
    <template slot-scope="scope">
      <apiot-input
        type="textarea"
        autosize
        resize="none"
        size="small"
        v-model="scope.row.address"
        :ref="`address${scope.row.date}`"
        v-if="showInput === `address${scope.row.date}`"
        @blur="blurInput(scope.row, 'address', scope.row.address)"
      ></apiot-input>
      <p v-else class="textSl">{{ scope.row.address }}</p>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    showInput: {
      type: String
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    blurInput(row, name, value) {
      this.$emit('blurInput', row, name, value);
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
