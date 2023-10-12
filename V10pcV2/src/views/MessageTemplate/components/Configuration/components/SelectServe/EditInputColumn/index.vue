<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot="header">
      <label>{{ label }}</label>
      <span v-if="isRequire" class="is-require"></span>
    </template>
    <template slot-scope="scope">
      <div :class="{ 'is-error': isError(scope.row) }" v-if="scope.row.edit">
        <apiot-input
          size="small"
          v-model="scope.row[prop]"
          @blur="handleBlur(scope)"
          @input="handleInput(scope)"
          v-bind="inputAttr"
          :placeholder="
            $t('placeholder.pleaseEnterAny', {
              any: '',
            })
          "
          :show-password="showPassword"
        ></apiot-input>
        <div class="error__tip" v-if="isError(scope.row)">
          {{ isError(scope.row) }}
        </div>
      </div>
      <div v-else style="width: 100%">
        <div v-if="showPassword" class="noEditEle">
          <span v-show="!scope.row.isShowEle">******</span>
          <span v-show="scope.row.isShowEle">
            {{ scope.row[prop] || '-' }}
          </span>
          <i
            class="iconfont icon-mimaxianshi"
            @click="handleClick(scope.row)"
            v-show="scope.row.isShowEle"
          ></i>
          <i
            class="iconfont icon-yincang"
            @click="handleClick(scope.row)"
            v-show="!scope.row.isShowEle"
          ></i>
        </div>
        <div v-else>
          {{ scope.row[prop] || '-' }}
        </div>
      </div>
    </template>
  </el-table-column>
</template>

<script>
import { debounce } from '@/utils/utils';

export default {
  props: {
    prop: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    inputAttr: {
      type: Object,
      default() {
        return {};
      },
    },
    errorCell: {
      type: Array,
      default() {
        return [];
      },
    },
    rules: {
      type: Array,
      default() {
        return [];
      },
    },
    showPassword: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columnValue: '',
      isInput: false,
    };
  },

  components: {},

  computed: {
    isError() {
      return function (row) {
        const error =
          this.errorCell.find(
            (item) => item.index === row.id && item.prop === this.prop,
          ) || {};
        return error.errorMsg || '';
      };
    },
    isRequire() {
      return this.rules.findIndex((item) => item.required === true) !== -1;
    },
  },

  mounted() {},

  created() {
    this.debouncedVerification = debounce((row, index) => {
      this.verification(row, index);
    });
  },

  methods: {
    handleClick(row) {
      this.$set(row, 'isShowEle', !row.isShowEle);
    },
    verification(row) {
      let flag = true;
      let errorCell = '';
      const { isRequire, columnValue, label, prop } = this;
      if (isRequire && !columnValue) {
        const { message } = this.rules.find((item) => item.required === true);
        errorCell = {
          index: row.id,
          prop,
          errorMsg: this.$t(message, { any: label }),
        };
        flag = false;
      }
      // 寻找错误信息中是否有该错误
      const index = this.errorCell.findIndex(
        (err) => err.index === row.id && err.prop === prop,
      );
      const megs = [...this.errorCell];
      // 如果有错误信息
      if (errorCell) {
        if (index === -1) megs.push(errorCell);
        else megs[index] = errorCell;
        this.$emit('columnError', row);
      } else if (!errorCell && index !== -1) megs.splice(index, 1);
      this.$emit('update:errorCell', megs);
      return flag;
    },
    handleBlur(scope) {
      // 为了兼容没有修改内容，直接失焦的情况
      const { prop } = this;
      this.isInput = true;
      let value = scope.row[prop];
      if (typeof value !== 'number') value = value || '';
      this.columnValue = `${value}`;
      if (this.verification(scope.row)) {
        this.$emit('handleEdit', scope.row, scope.row.index, this.prop);
      }
    },
    handleInput(scope) {
      let value = scope.row[this.prop];
      if (typeof value !== 'number') value = value || '';
      this.columnValue = `${value}`;
      this.debouncedVerification(scope.row);
    },
  },
};
</script>

<style lang="scss" scoped>
@import './index.scss';
.noEditEle {
  display: flex;
  justify-content: space-between;
  & > span:first {
    position: relative;
    top: -3px;
  }
  span {
    display: block;
    width: 80%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.iconfont {
  color: #c0c4cc;
  font-size: 18px;
  cursor: pointer;
}
</style>
