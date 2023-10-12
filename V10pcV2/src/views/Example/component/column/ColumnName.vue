<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <apiot-input
        size="small"
        v-model="scope.row.name"
        :ref="`name${scope.row.date}`"
        v-if="showInput === `name${scope.row.date}`"
        @blur="blurInput(scope.row, 'name', scope.row.name)"
      ></apiot-input>
      <p v-else>{{ scope.row.name }}</p>
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
