<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot="header" slot-scope="scope">
      <label>{{ scope.column.label }}</label>
      <span v-if="isRequire" class="is-require"></span>
      <el-tooltip
        v-if="headTip"
        effect="dark"
        :content="headTip"
        placement="right"
      >
        <i class="iconfont icon-bangzhu"></i>
      </el-tooltip>
    </template>
    <template slot-scope="scope">
      <div
        class="numberInput"
        :class="{ 'is-error': isError(scope.row) }"
        v-if="scope.$index === editIndex"
      >
        <el-input-number
          v-model="scope.row[prop]"
          size="small"
          controls-position="right"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: '',
            })
          "
          :min="1"
          :controls="false"
          @blur="blurInput(scope)"
        ></el-input-number>
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
      default: ''
    },
    inputAttr: {
      type: Object,
      default() {
        return {};
      }
    },
    editIndex: {
      type: Number
    },
    errorCell: {
      type: Array,
      default() {
        return [];
      }
    },
    isRequire: {
      type: Boolean,
      default: false
    },
    headTip: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    isError() {
      return function(row) {
        const error =
          this.errorCell.find((item) => item.index === row.sno && item.prop === this.prop) || {};
        return error.errorMsg || '';
      };
    }
  },

  mounted() {},

  methods: {
    blurInput(scope) {
      this.$emit('handleEdit', scope.row, scope.$index, this.prop);
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../index.scss';
.numberInput {
  ::v-deep {
    .el-input-number--small {
      width: 100% !important;
    }
    .el-input-number .el-input__inner {
      text-align: left;
    }
  }
}
.icon-bangzhu:hover {
  color: $--color-primary;
}
</style>
