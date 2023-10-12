<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 14:16:47
 * @Des: 选择人
-->
<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="prop"
  >
    <template slot="header" slot-scope="scope">
      <label>{{ scope.column.label }}</label>
      <span v-if="isRequire" class="is-require"></span>
    </template>

    <template slot-scope="scope">
      <section class="type__more" v-if="!scope.row.edit">
        {{ (scope.row[prop] && scope.row[prop][0].username) || '-' }}
      </section>
      <section v-else class="editEle">
        <apiot-input
          size="small"
          :value="scope.row[prop] && scope.row[prop][0].username"
          placeholder="请选择人员"
          :disabled="true"
        ></apiot-input>
        <i class="iconfont icon-jiahao" @click="handleAdd(scope)"></i>
      </section>
      <!-- 弹出选人 -->
      <apiot-user-dialog
        ref="users"
        :visible.sync="visible"
        title="选择用户"
        :checkedUsers="checkedUsers(scope)"
        :isMult="false"
        @handleSure="handleSure"
      ></apiot-user-dialog>
    </template>
  </el-table-column>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // 当前作用的字段名
    prop: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      visible: false,
      scopeObj: {},
    };
  },
  computed: {
    isRequire() {
      return this.rules.findIndex((item) => item.required === true) !== -1;
    },
    checkedUsers() {
      return function (scope) {
        console.log(scope.row[this.prop]);
        return scope.row[this.prop];
      };
    },
  },
  methods: {
    // handleChange(scope) {
    //   this.$emit('handleEdit', scope.row, scope.row.index, this.prop);
    // },
    // 按钮__添加
    async handleAdd(v) {
      this.scopeObj = v;
      this.visible = true;
    },
    // 点击确定按钮
    handleSure(users) {
      this.visible = false;
      this.scopeObj.row = {
        ...this.scopeObj.row,
        userId: users,
      };
      this.$emit(
        'handleEdit',
        this.scopeObj.row,
        this.scopeObj.$index,
        this.prop,
      );
      console.log(users, this.scopeObj);
    },
  },
};
</script>

<style lang="scss" scoped>
.is-require::after {
  content: '*';
  color: #f56c6c;
  margin-left: 4px;
}
.editEle {
  position: relative;
  .icon-jiahao {
    z-index: 999;
    font-size: 18px;
    color: #aaaaaa;
    position: absolute;
    bottom: 3px;
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
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    &.disabled {
      cursor: not-allowed;
    }
  }
  ::v-deep {
    .el-input.is-disabled .el-input__inner {
      background-color: #fff;
      padding-right: 30px;
    }
  }
}
</style>
