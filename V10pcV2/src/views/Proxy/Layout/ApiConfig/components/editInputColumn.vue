<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot="header" slot-scope="scope">
      <label>{{ scope.column.label }}</label>
      <span v-if="isRequire" class="is-require"></span>
    </template>
    <template slot-scope="scope">
      <div
        class="editInput"
        :class="{ 'is-error': isError(scope.row) }"
        v-if="scope.row.index === editIndex"
      >
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
        <div class="error__tip" v-if="isError(scope.row)">
          {{ isError(scope.row) }}
        </div>
      </div>
      <p v-else>{{ scope.row[prop] || '-' }}</p>
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
    editIndex: Number,
    errorCell: {
      type: Array,
      default() {
        return [];
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

  computed: {
    isError() {
      return function (row) {
        const error =
          this.errorCell.find(
            (item) => item.index === row.sno && item.prop === this.prop,
          ) || {};
        return error.errorMsg || '';
      };
    },
  },

  mounted() {},

  methods: {
    blurInput(scope) {
      this.$emit('handleEdit', scope.row, scope.row.index, this.prop);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../index.scss';
.editInput {
  width: 100%;
}
</style>
