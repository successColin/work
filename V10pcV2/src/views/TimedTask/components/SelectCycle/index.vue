<!--
 * @Descripttion: 可搜索、可弹出选择框(与 FilterableInput 相似 50%)
 * @Author: ytx
 * @Date: 2021-07-01 09:23:05
 * @Last Modified by: ytx
 * @Last Modified time: 2021-07-01 09:23:05
-->
<template>
  <section class="SelectCycle">
    <div class="SelectCycle__con" :class="[{ disabled: disabled }]">
      <!-- 搜索框 -->
      <el-select
        v-bind="$attrs"
        :value="currentRadioId"
        :disabled="disabled"
        filterable
        class="SelectCycle__select"
        ref="select"
        @blur="showRes = true"
      >
        <el-option
          v-for="item in options"
          :key="item[optionKey]"
          :label="item[optionLabel]"
          :value="item[optionKey]"
          @click.native="setCurrentRadio(item)"
          class="SelectCycle__option"
        >
          <span class="SelectCycle__option--label">{{
            item[optionLabel]
          }}</span>
        </el-option>
      </el-select>
      <!-- 添加 -->
      <i
        class="iconfont icon-jiahao"
        @click="handleAdd"
        :class="[{ disabled: disabled }]"
      ></i>
      <!-- 结果值 -->
      <div
        class="SelectCycle__result"
        v-if="currentRadioObj && showRes"
        @click="changeRes"
      >
        <div class="SelectCycle__result--table">
          <span class="font__ellipsis" :title="currentRadioObj[optionLabel]">{{
            currentRadioObj[optionLabel]
          }}</span>
        </div>
      </div>
    </div>
    <!-- 实体表和字段表: 实体表1，字段表2 -->
    <transition name="dialog-fade">
      <apiot-table-dialog
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        :show="dialogVisible"
        :columnArr="columnArr"
        :currentRadioObj.sync="currentRadioObj"
        :title="dialogTitle"
        :getList="getPopupsList"
        :paramsObj="paramsObj"
        :hasPagination="hasPagination"
        @sure-click="handleSubmit"
      ></apiot-table-dialog>
    </transition>
  </section>
</template>

<script>
export default {
  props: {
    dialogTitle: {
      type: String,
      default: ''
    },
    // 展示结果
    showInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 列表
    columnArr: {
      type: Array,
      default: () => []
    },
    // 参数
    paramsObj: {
      type: Object,
      default: () => {}
    },
    // 下拉框的值
    optionArray: {
      type: Array,
      default: () => []
    },
    // 获取弹出的数据
    getListFun: {
      type: Function,
      default: () => {}
    },
    optionLabel: {
      type: String,
      default: ''
    },
    optionKey: {
      type: String,
      default: 'id'
    },
    hasPagination: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 下拉选择
      options: [],
      // 是否显示弹出框
      dialogVisible: false,
      // 当前选中数据
      currentRadioObj: null,
      showRes: true
    };
  },
  components: {},
  computed: {
    currentRadioId() {
      if (this.currentRadioObj) {
        return this.currentRadioObj[this.optionKey];
      }
      return '';
    }
  },
  mounted() {},
  watch: {
    // 赋值
    showInfo: {
      handler(v) {
        // console.log(this.optionArray);
        if (v && v[this.optionKey]) {
          this.currentRadioObj = this.optionArray.find(
            (item) => v[this.optionKey] === item[this.optionKey]
          );
          // console.log(this.currentRadioObj);
        } else {
          this.currentRadioObj = null;
        }
      },
      deep: true,
      immediate: true
    },
    optionArray: {
      handler(v) {
        if (this.disabled) {
          return;
        }
        this.options = v;
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 按钮__添加
    async handleAdd() {
      if (this.disabled) {
        return false;
      }
      this.dialogVisible = true;
    },
    // 弹出框值
    async getPopupsList(params) {
      const popupsList = this.getListFun(params);
      return popupsList;
    },
    // 弹出框__确定
    handleSubmit() {
      if (!this.currentRadioObj) {
        return this.$message({
          type: 'warning',
          message: this.$t('common.placeSelectData')
        });
      }
      this.dialogVisible = false;
      this.$emit('selectRes', this.currentRadioObj);
    },
    // 单选值
    setCurrentRadio(item) {
      // console.log(item);
      this.currentRadioObj = item;
      this.$refs.select.blur();
      this.$emit('selectRes', this.currentRadioObj);
    },
    // 更改展现形式
    changeRes() {
      if (this.disabled) {
        return false;
      }
      this.showRes = false;
      this.$refs.select.focus();
    }
  }
};
</script>
<style lang='scss' scoped>
.SelectCycle {
  position: relative;
  &__select {
    width: 100%;
    &:focus-within + .icon-jiahao {
      border-color: $--color-primary;
      background: #f1f7ff;
      color: $--color-primary;
    }
  }
  &__option {
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 24px;
      margin-right: 8px;
      color: #5a80ed;
      font-weight: normal;
    }
    &--label {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
    }
  }
  &__result {
    position: absolute;
    height: 32px;
    left: 0;
    bottom: 0;
    right: 32px;
    &--table {
      display: flex;
      align-items: center;
      position: absolute;
      top: 3px;
      right: 3px;
      bottom: 3px;
      left: 3px;
      background: #e5f0ff;
      border-radius: 4px;
      cursor: pointer;
      i {
        width: 28px;
        height: 100%;
        background: #5a80ed;
        line-height: 24px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        border-radius: 4px 0 0 4px;
        margin-right: 4px;
      }
      span {
        font-size: 13px;
        font-weight: 400;
        color: #333333;
        line-height: 18px;
        margin-left: 6px;
      }
    }
  }
  &__con {
    &:hover:not(.disabled) {
      .icon-jiahao {
        border-color: $--color-primary;
        background: #f1f7ff;
        color: $--color-primary;
      }
      ::v-deep {
        .el-input__inner {
          border-color: $--color-primary;
        }
      }
    }
    &.disabled {
      .SelectCycle__result--table {
        cursor: not-allowed;
        background: #f1f3f6;
      }
      .icon-shujubiao {
        background-color: #bbc3cd;
      }
    }
    .icon-jiahao {
      font-size: 18px;
      color: #aaaaaa;
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      cursor: pointer;
      border-left: 1px dashed #d9d9d9;
      transition: border-color 300ms ease-in-out;
      &.disabled {
        cursor: not-allowed;
      }
    }
  }
}
::v-deep {
  .el-input__inner {
    // border: 1px dashed #d9d9d9;
    border-style: dashed;
    border-color: #d9d9d9;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .el-radio__label {
    display: none;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 12px;
  }
  .el-select {
    width: 100%;
    height: 32px;
  }
}
</style>
