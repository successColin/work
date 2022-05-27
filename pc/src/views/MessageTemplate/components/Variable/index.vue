<!--
 * @Author: sss
 * @Date: 2021-07-19 15:46:57
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-19 15:46:57
 * @Desc: 变量区
-->
<template>
  <div>
    <section class="variable">
      <header class="variable__header">
        <label class="header__label">{{
          $t('messageTemplate.choice', {
            any: $t('messageTemplate.variable'),
          })
        }}</label>
        <select-variable
          v-model="visible"
          class="addVariable"
          @clickVarType="clickVarType"
        ></select-variable>
      </header>
      <div class="variable__content">
        <custom-variable
          :variables.sync="variables"
          @editVar="editVar"
          @delVar="delVar"
          @handleClick="handleClick"
        ></custom-variable>
      </div>
    </section>
    <dialog-innervar
      ref="innerVarDialog"
      :visible.sync="innerVarDialog"
      :variables="variables"
      :title="dialogTilt"
      @sureClick="innerSureClick"
    ></dialog-innervar>
    <dialog-Viewvar
      ref="viewVarDialog"
      :visible.sync="viewVarDialog"
      :variables="variables"
      :title="dialogTilt"
      @sureClick="viewSureClick"
    ></dialog-Viewvar>
  </div>
</template>

<script>
import SelectVariable from './SelectVariable';
import CustomVariable from './CustomVariable';
import DialogInnervar from './DialogInnervar';
import DialogViewvar from './DialogViewvar';
// import { customArry } from './data.json';

export default {
  components: { SelectVariable, CustomVariable, DialogInnervar, DialogViewvar },

  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    sqlScript: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      isOpen: false,
      visible: false,
      codemirrorInfo: {},
      variables: { inArry: [], viewArry: [], envArry: [] },
      innerVarDialog: false,
      viewVarDialog: false,
      envVarDialog: false,
      dialogTilt: ''
    };
  },

  computed: {
    variablesArry() {
      const { inArry, viewArry, envArry } = this.variables;
      return [...inArry, ...viewArry, ...envArry];
    }
  },

  watch: {
    variablesArry(newValue) {
      this.$emit('input', newValue);
    }
  },

  methods: {
    // 点击变量,在打开变量注入功能时，编辑器进行注入
    handleClick(tagInfo) {
      if (this.isOpen) {
        tagInfo.customArry = this.variablesArry;
        const { codemirrorKey } = this.codemirrorInfo;
        this.$bus.$emit(codemirrorKey, tagInfo);
      }
    },
    // 选择需要添加的类型
    clickVarType(type) {
      this.visible = false;
      this.dialogTilt = type.name;
      // 新增输入变量
      if (type.value === 1) {
        this.$refs.innerVarDialog.initFormData();
        this.innerVarDialog = true;
      } else if (type.value === 2) {
        const { sqlScript, variables } = this;
        this.$refs.viewVarDialog.initFormData({
          sqlScript,
          tableData: variables.viewArry
        });
        this.viewVarDialog = true;
      } else this.envVarDialog = true;
    },
    // 编辑变量
    editVar(info) {
      const { variable, index } = info;
      this.dialogTilt = this.$store.state.dictManage.VARIABLE_TYPE.find(
        (item) => item.value === variable.variableType
      ).name;
      if (variable.variableType === 1) {
        this.$refs.innerVarDialog.initFormData(variable, index);
        this.innerVarDialog = true;
      } else if (variable.variableType === 2) {
        const { sqlScript, variables } = this;
        this.$refs.viewVarDialog.initFormData({
          sqlScript,
          tableData: variables.viewArry
        });
        this.viewVarDialog = true;
      } else this.envVarDialog = true;
    },
    // 删除变量
    delVar(info) {
      const { variable, index } = info;
      if (variable.variableType === 1) {
        const { inArry } = this.variables;
        inArry.splice(index, 1);
        this.variables.inArry = [...inArry];
      }
    },
    innerSureClick(dialogInfo) {
      this.innerVarDialog = false;
      const { variable, editIndex } = dialogInfo;
      const { inArry } = this.variables;
      if (editIndex !== -1) inArry[editIndex] = variable;
      else inArry.unshift(variable);
      this.variables.inArry = [...inArry];
    },
    // sql变量
    viewSureClick(dialogInfo) {
      this.viewVarDialog = false;
      this.variables.viewArry = [...dialogInfo.variables];
      this.$emit('change', dialogInfo);
      // this.sqlScript = dialogInfo.sqlScript;
    },
    // 初始化
    init() {
      // 区分输入变量、展示变量、环境变量
      const inArry = [];
      const viewArry = [];
      const envArry = [];
      this.value.forEach((item) => {
        // 输入变量
        if (item.variableType === 1) inArry.push(item);
        // 展示变量
        else if (item.variableType === 2) viewArry.push(item);
        // 环境变量
        else envArry.push(item);
      });
      this.variables = { inArry, viewArry, envArry };
    }
  },

  mounted() {
    this.init();
    // 关闭注入编辑器功能
    this.$bus.$on('codemirrorVal_close', () => {
      // isEmailFirst 用于富文本框首次聚焦导致的问题
      if (!this.codemirrorInfo.isEmailFirst) this.isOpen = false;
    });
    // 打开注入编辑器功能，并记录编辑器唯一标识
    this.$bus.$on('codemirrorVal_open', (codemirrorInfo) => {
      this.isOpen = true;
      this.codemirrorInfo = codemirrorInfo;
    });
  },
  beforeDestroy() {
    this.$bus.$off('codemirrorVal_close');
    this.$bus.$off('codemirrorVal_open');
  }
};
</script>

<style lang='scss' scoped>
.variable {
  margin-right: 10px;
  width: 190px;
  height: 100%;
  flex-shrink: 0;
  border: solid 1px #e9e9e9;
  .header__label {
    line-height: 1;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    padding-bottom: 6px;
    font-family: PingFangSC-Medium, PingFang SC;
    &.isRequired {
      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }
  }
  &__header {
    height: 36px;
    line-height: 36px;
    & label {
      padding: 0 12px;
    }
    &::after {
      display: block;
      content: '';
      height: 1px;
      background: #e9e9e9;
    }
    .addVariable {
      float: right;
      margin-right: 12px;
    }
  }
  &__content {
    height: 380px;
    overflow: auto;
  }
}
</style>
