<!--
 * @Descripttion: 可搜索、可弹出选择框
 * @Author: ytx
 * @Date: 2021-07-01 09:23:05
 * @Last Modified by: ytx
 * @Last Modified time: 2021-07-01 09:23:05
-->
<template>
  <section class="filterableInput">
    <div class="filterableInput__con" :class="[{ disabled: disabled }]">
      <el-select
        v-bind="$attrs"
        :value="currentRadioId"
        :disabled="disabled"
        filterable
        class="filterableInput__select"
        ref="select"
        @blur="showRes = true"
      >
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item[getLable]"
          :value="item[getLable]"
          @click.native="setCurrentRadio(item)"
          class="filterableInput__option"
        >
          <span class="filterableInput__option--label">{{
            item[getLable]
          }}</span>
        </el-option>
      </el-select>
      <i
        class="iconfont icon-jiahao"
        @click="handleAdd"
        :class="[{ disabled: disabled }]"
      ></i>
      <div
        class="filterableInput__result"
        v-if="currentRadioObj && showRes"
        @click="changeRes"
      >
        <div class="filterableInput__result--table">
          <span class="font__ellipsis" :title="currentRadioObj[getLable]">{{
            currentRadioObj[getLable]
          }}</span>
        </div>
      </div>
    </div>
    <!-- 实体表和字段表: 实体表1，字段表2 -->
    <transition name="dialog-fade">
      <store-process-dialog
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        :currentRadioObj.sync="currentRadioObj"
        :hasPagination="hasPagination"
        :columnTypes="columnTypes"
        :idNeedId="idNeedId"
        @sure-click="handleSubmit"
      ></store-process-dialog>
    </transition>
  </section>
</template>

<script>
import { listProcedures } from '@/api/menuConfig';
import StoreProcessDialog from './StoreProcessDialog';

export default {
  props: {
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
    // 有无分页
    hasPagination: {
      type: Boolean,
      default: false
    },
    // 字段类型集合
    columnTypes: {
      type: String,
      default: ''
    },
    idNeedId: {
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
  components: {
    StoreProcessDialog
  },
  computed: {
    currentRadioId() {
      if (this.currentRadioObj) {
        return this.currentRadioObj.proceduresName;
      }
      return '';
    },
    getLable() {
      return 'proceduresName';
    }
  },
  mounted() {
    this.getList();
  },
  watch: {
    showInfo: {
      handler(v) {
        if (JSON.stringify(v) !== '{}') {
          // console.log(v);
          this.currentRadioObj = {
            id: +v.sysProceduresId
          };
          const index = this.options.findIndex((option) => {
            if (option.id === this.currentRadioObj.id) {
              return true;
            }
            return false;
          });
          if (index !== -1) {
            this.$set(this.currentRadioObj, 'proceduresName', this.options[index].proceduresName);
          }
        } else {
          this.currentRadioObj = null;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 获取列表数据
    async getList() {
      if (this.disabled) {
        return;
      }
      const params = {
        keywords: this.dictKeywords
      };
      const res = await listProcedures(params);
      this.options = res;
      if (this.currentRadioObj && !this.currentRadioObj.proceduresName) {
        const index = this.options.findIndex((option) => {
          if (option.id === this.currentRadioObj.id) {
            return true;
          }
          return false;
        });
        if (index !== -1) {
          this.$set(this.currentRadioObj, 'proceduresName', this.options[index].proceduresName);
        }
      }
    },
    // 按钮__添加
    async handleAdd() {
      if (this.disabled) {
        return false;
      }
      this.dictKeywords = '';
      await this.getList();
      this.dialogVisible = true;
    },

    // 弹出框__确定
    handleSubmit() {
      // console.log(this.currentRadioObj);
      if (!this.currentRadioObj) {
        return this.$message({
          type: 'warning',
          message: '请选择数据'
        });
      }
      this.dialogVisible = false;
      // console.log('确定');
      this.$emit('selectRes', this.currentRadioObj);
    },
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
.filterableInput {
  position: relative;
  width: calc(50% - 15px);
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
      &.dictStyle {
        background-color: #ebfcf7;
        i {
          background-color: #34c7be;
        }
      }
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
      .filterableInput__result--table {
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

    ::v-deep {
      .el-input__inner {
        border: 1px dashed #d9d9d9;
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
  }
}
</style>
