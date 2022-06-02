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
          v-for="(item, index) in options"
          :key="index"
          :label="item[getLable]"
          :value="item[getLable]"
          @click.native="setCurrentRadio(item)"
          class="filterableInput__option"
        >
          <i class="iconfont icon-shujubiao" v-if="dialogType === 1"></i>
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
        @mouseenter="showClose = true"
        @mouseleave="showClose = false"
      >
        <div
          class="filterableInput__result--table"
          :class="[{ dictStyle: dialogType === 3 }]"
        >
          <i class="iconfont icon-shujubiao" v-if="dialogType === 1"></i>
          <i class="iconfont icon-zidian" v-if="dialogType === 3"></i>
          <span class="font__ellipsis" :title="currentRadioObj[getLable]">{{
            currentRadioObj[getLable]
          }}</span>
          <i
            class="el-input__icon el-icon-circle-close"
            @click.stop="deletePanel"
            v-if="dialogType === 4 && currentRadioObj && currentRadioObj.id"
            v-show="showClose"
          ></i>
        </div>
      </div>
    </div>
    <!-- 实体表和字段表: 实体表1，字段表2 -->
    <transition name="dialog-fade">
      <table-or-field-dialog
        :visible.sync="dialogVisible"
        v-if="dialogVisible"
        :currentRadioObj.sync="currentRadioObj"
        :dialogType="dialogType"
        :tableName="tableName"
        :hasPagination="hasPagination"
        :columnTypes="columnTypes"
        :idNeedId="idNeedId"
        :notShowSys="notShowSys"
        :isTree="isTree"
        :title="title"
        :isSelPanel="isSelPanel"
        @sure-click="handleSubmit"
        :tableData="options"
      ></table-or-field-dialog>
    </transition>
  </section>
</template>

<script>
import TableOrFieldDialog from '../TableOrFieldDialog';

export default {
  props: {
    // 弹出类型 1为表名称 2为字段名称 3为字典 4为面板 5为导入模板
    dialogType: {
      type: Number,
      default: 1
    },
    // 字段弹窗接口参数的表名
    tableName: {
      type: String,
      default: 'sys_org'
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
    },
    // 字段不展示系统字段
    notShowSys: {
      type: Boolean,
      default: false
    },
    // 是不是树结构的表
    isTree: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'false'
    },
    isSelPanel: {
      type: Boolean,
      default: false
    },
    // 下拉选择
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // 是否显示弹出框
      dialogVisible: false,
      // 当前选中数据
      currentRadioObj: null,
      showRes: true,
      showClose: false
    };
  },
  components: {
    TableOrFieldDialog
  },
  computed: {
    currentRadioId() {
      if (this.currentRadioObj) {
        switch (this.dialogType) {
          case 1:
            return this.currentRadioObj.tableName;
          case 2:
            return this.currentRadioObj.columnName;
          case 3:
            return this.currentRadioObj.dictName;
          case 4:
            return this.currentRadioObj.panelName;
          case 5:
            return this.currentRadioObj.templateName;
          default:
            return '';
        }
      }
      return '';
    },
    getLable() {
      switch (this.dialogType) {
        case 1:
          return 'tableName';
        case 2:
          return 'columnName';
        case 3:
          return 'dictName';
        case 4:
          return 'panelName';
        case 5:
          return 'templateName';
        default:
          return 'id';
      }
    }
  },
  mounted() {},
  watch: {
    tableName: {
      handler(v) {
        this.tableName = v;
      },
      deep: true,
      immediate: true
    },
    showInfo: {
      handler(v) {
        if (JSON.stringify(v) !== '{}') {
          this.currentRadioObj = v;
        } else {
          this.currentRadioObj = null;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 按钮__添加
    async handleAdd() {
      if (this.dialogType === 2 && !this.tableName) {
        return this.$message({
          type: 'warning',
          message: '请先选择表格'
        });
      }
      if (this.disabled) {
        return false;
      }
      this.dictKeywords = '';
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
      this.showRes = true;
      this.$emit('selectRes', this.currentRadioObj);
    },
    setCurrentRadio(item) {
      // console.log(item);
      this.currentRadioObj = item;
      this.$refs.select.blur();
      this.showRes = true;
      this.$emit('selectRes', this.currentRadioObj);
    },
    deletePanel() {
      this.setCurrentRadio(null);
      this.showRes = false;
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
      .el-input__icon {
        height: 26px;
        line-height: 26px;
        background-color: transparent;
        color: #999;
        font-size: 13px;
        margin-left: auto;
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
