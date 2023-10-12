<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot="header" slot-scope="scope">
      <label>{{ scope.column.label }}</label>
      <span v-if="isRequire" class="is-require"></span>
    </template>
    <template slot-scope="scope">
      <apiot-input
        size="small"
        v-model="scope.row[prop]"
        @blur="blurInput(scope)"
        v-bind="inputAttr"
        :placeholder="
          $t('placeholder.pleaseEnterAny', {
            any: '',
          })
        "
      ></apiot-input>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
      default: '',
    },
    inputAttr: {
      type: Object,
      default() {
        return {};
      },
    },
    isRequire: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    blurInput(scope) {
      this.$emit('handleEdit', scope.row, scope.row.index, this.prop);
    },
  },
};
</script>

<style lang="scss" scoped></style>
