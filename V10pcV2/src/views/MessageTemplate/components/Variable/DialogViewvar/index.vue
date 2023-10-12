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
    :isBigDialog="true"
    :loading.sync="showLoading"
    @sure-click="handleSure"
  >
    <div class="varContent">
      <div class="varInput">
        <div class="varInput__header">选择变量</div>
        <article class="inVariable">
          <el-tooltip
              v-for="(item, index) in variables.inArry"
              :key="`inVarable_${index}`"
              effect="dark"
              :content="item.variableCode"
              placement="right"
          >
            <p
                class="inVariable__varible"
                :class="{ isCurrent: current === `1_${index}` }"
            >
          <span
              :ref="`var_item_${item.variableType}_${index}`"
              class="inVariable__varible--item varibleItem"
              @click.stop="clickVar(item, index)"
          >
            <label class="varibleItem red__fontColor">{{
                item.variableName
              }}</label>
          </span>
            </p>
          </el-tooltip>
        </article>
      </div>
      <div class="varMain">
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
<!--          <apiot-input-->
<!--              v-model="newSqlString"-->
<!--              :isDelSpace="false"-->
<!--              type="textarea"-->
<!--              :rows="3"-->
<!--              @input="sqlInput"-->
<!--          ></apiot-input>-->
          <codemirror
              ref="sqlInput"
              key="sqlInput"
              com="sqlInput"
              prop="newSqlString"
              :height="90"
              @onCmFocus="onCmFocus"
              @onCmBlur="onCmBlur"
              @contentChange="contentChange"
          ></codemirror>
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
    </div>
  </apiot-dialog>
</template>

<script>
import { extractVariableFromSql } from '@/api/messageTemplate';
import EditInputColumn from './EditInputColumn';
import Codemirror from '../../Configuration/components/Codemirror';

export default {
  components: { EditInputColumn, Codemirror },

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
      isFocus: false,
      current: -1,
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
    // 编辑聚焦时
    onCmFocus() {
      // 编辑器聚焦后通知变量区打开“变量注入功能”，并带给变量区对应的编辑器唯一标识，可以正确注入对应编辑器
      this.isFocus = true;
    },
    onCmBlur() {
      this.isFocus = false;
    },
    // 值发生变化时
    contentChange(value) {
      this.disabled = false;
      this.newSqlString = value.content;
    },
    // 变量选择
    clickVar(variable, index) {
      this.current = `${variable.variableType}_${index}`;
      this.$refs.sqlInput.setValue({ variable });
    },
    // 初始化
    initFormData(row, editIndex = -1) {
      this.newSqlString = row.sqlScript;
      this.sqlString = row.sqlScript;
      this.tableData = row.tableData;
      this.editIndex = editIndex;
      this.disabled = true;
      this.$nextTick(() => {
        this.$refs.sqlInput.init({ content: this.newSqlString, variables: this.variablesArry });
      });
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
        if (exitVar) this.$message.warning(`变量:${exitVar}已经存在！`);
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
  .varContent {
    display: flex;
    width: 100%;
    //flex-direction: column;
    height: 100%;
  }
  .varInput{
    width: 240px;
    height: calc(100% - 10px);
    margin-right: 10px;
    //margin-bottom: 10px;
    border: solid 1px #e9e9e9;
    .varInput__header{
      height: 36px;
      padding: 0 12px;
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 36px;
      box-sizing: border-box;
      border-bottom: solid 1px #e9e9e9;
    }
    .inVariable{
      height: calc(100% - 36px);
      &__varible {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .red {
          &__fontColor {
            background: #ffeaeb;
            color: #ee5e5e;
            cursor: pointer;
          }
          &__btn--hover {
            &:hover {
              color: #ee5e5e;
            }
          }
        }
        &:hover {
          background: #fafafa;
        }
        &--item {
          flex: 1;

          & label {
            margin: 6px 0 6px 9px;
            padding: 0 10px;
            display: inline-block;
            height: 24px;
            line-height: 24px;
            background: #e5f0ff;
            border-radius: 4px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #4689f5;
          }
          ::v-deep {
            .el-input__inner {
              height: 28px;
            }
          }
        }
        &--btn {
          flex-shrink: 0;
          width: 28px;
          color: #bbc3cd;
          text-align: center;
          font-size: 8px;
          &:hover {
            color: #4689f5;
          }
        }
        .sepLine {
          width: 1px;
          height: 8px;
          background: #e9e9e9;
        }
      }
    }
  }
  .varMain{
    flex: 1;
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
