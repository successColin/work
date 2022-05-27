<!--
 * @Author: sss
 * @Date: 2021-07-30 11:14:03
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-30 11:14:03
 * @Desc: 弹出框-新增编辑SQL变量1
-->
<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="viewDialog"
    :loading.sync="showLoading"
    @sure-click="handleSure"
  >
    <div>
      <section class="sqlBox">
        <header class="sqlBox__header">
          <label>填写SQL</label>
          <apiot-button
            class="btn"
            :disabled="disabled"
            @click="extractVariable"
          >
            <i class="iconfont icon-shanchu m-r-4"></i>提取变量
          </apiot-button>
        </header>
        <apiot-input
          v-model="newSqlString"
          :isDelSpace="false"
          type="textarea"
          :rows="3"
          @input="sqlInput"
        ></apiot-input>
      </section>
      <section class="viewDialog__main">
        <apiot-table
          :isNeedRowDrop="false"
          :tableData="tableData"
          :isNeedColumnDrop="false"
          dropClass=".viewDialog__main"
        >
          <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :label="$t(item.label)"
            :width="item.width"
            :colorIndex="item.colorIndex"
            @handleEdit="handleEdit"
          ></component>
        </apiot-table>
      </section>
    </div>
  </apiot-dialog>
</template>

<script>
import { extractVariableFromSql } from '@/api/messageTemplate';
import EditInputColumn from './EditInputColumn';

export default {
  components: { EditInputColumn },

  props: {
    operate: {
      type: String,
      default: 'add'
    },
    variables: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {
      tableData: [],
      showLoading: false,
      formData: { variableType: 1 },
      editIndex: -1,
      newSqlString: '',
      sqlString: '',
      disabled: true,
      columnData: [
        // 变量编码
        {
          label: 'messageTemplate.variableCode',
          prop: 'variableCode',
          compName: 'TypesColumn',
          colorIndex: 2
        },
        // 变量名称
        {
          label: 'messageTemplate.variableName',
          prop: 'variableName',
          compName: 'EditInputColumn'
        }
      ]
    };
  },

  computed: {
    variablesArry() {
      const { inArry, viewArry, envArry } = this.variables;
      return [...inArry, ...viewArry, ...envArry];
    }
  },

  methods: {
    // 初始化
    initFormData(row, editIndex = -1) {
      this.newSqlString = row.sqlScript;
      this.sqlString = row.sqlScript;
      this.tableData = row.tableData;
      this.editIndex = editIndex;
      this.disabled = true;
    },
    // 根据Sql获取变量
    async extractVariable() {
      try {
        if (!this.newSqlString) return;
        let variables = await extractVariableFromSql({
          sqlScript: this.newSqlString
        });
        let exitVar = '';
        variables = variables.map((element) => {
          const isExitOtherType = this.variablesArry.findIndex(
            (item) => item.variableCode === element.variableCode && item.variableType !== 2
          );

          // 如果改变量之前已经存在，则显示名称不改变
          const varInfo =
            this.tableData.find((item) => item.variableCode === element.variableCode) || '';
          if (varInfo) element.variableName = varInfo.variableName;
          // 与其它类型的变量对比，如果存在则提示
          if (isExitOtherType !== -1) exitVar = `${exitVar}${element.variableCode},`;
          return element;
        });
        if (exitVar) this.$message.error(`变量:${exitVar}已经存在！`);
        else {
          this.disabled = true;
          this.sqlString = this.newSqlString;
          this.tableData = variables;
        }
      } catch (e) {
        this.disabled = true;
      }
    },
    // 点击确定
    async handleSure() {
      try {
        if (!this.disabled) {
          await this.$confirm(this.$t('messageTemplate.viewVarConfirmTip'), this.$t('common.tip'), {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
          });
        }
        this.$emit('sureClick', {
          variables: this.tableData,
          sqlScript: this.sqlString
        });
        this.showLoading = false;
      } catch (e) {
        this.showLoading = false;
      }
    },
    handleEdit(row, index) {
      this.tableData[index] = row;
    },
    sqlInput() {
      if (this.disabled) this.disabled = false;
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.viewDialog {
  div {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .sqlBox {
    flex-shrink: 0;
    margin-bottom: 10px;
    border: solid 1px #ebebeb;
    &__header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      border-bottom: solid 1px #ebebeb;
      label {
        padding-left: 14px;
        flex: 1;
        height: 36px;
        line-height: 36px;
        font-size: 13px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
      }
      .btn {
        height: 36px;
        flex-shrink: 0;
        border-top: 0;
        border-bottom: 0;
        border-right: 0;
        border-radius: 0;
        .iconfont {
          color: $--color-primary;
        }
      }
    }
  }
  &__main {
    flex: 1;
    box-sizing: border-box;
    overflow: hidden;
  }
  ::v-deep {
    .form {
      margin: 20px 0 0 0;
    }
    .el-textarea__inner {
      border: none;
      border-radius: 0;
    }
    .el-button.is-disabled {
      .iconfont {
        color: #c0c4cc !important;
      }
    }
  }
}
</style>
