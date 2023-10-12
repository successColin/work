<!--
 * @Author: sss
 * @Date: 2021-07-30 11:14:03
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-30 11:14:03
 * @Desc: 弹出框-新增编辑输入变量
-->
<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    class="innerDialog"
    :loading.sync="showLoading"
    @sure-click="handleSure"
  >
    <el-form
      label-position="top"
      label-width="80px"
      class="form"
      ref="innerDialog"
      :model="formData"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="form--line">
        <el-form-item
          :label="$t('messageTemplate.variableCode')"
          class="form--child"
          prop="variableCode"
          ref="entity-form"
        >
          <apiot-input
            v-model="formData.variableCode"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('messageTemplate.variableCode'),
              })
            "
          ></apiot-input>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('messageTemplate.variableName')"
          class="form--child"
          prop="variableName"
          ref="entity-form"
        >
          <apiot-input
            v-model="formData.variableName"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('messageTemplate.variableName'),
              })
            "
          ></apiot-input>
        </el-form-item>
      </div>
    </el-form>
  </apiot-dialog>
</template>

<script>
export default {
  components: {},

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
      showLoading: false,
      formData: { variableType: 1 },

      editIndex: -1
    };
  },

  computed: {
    rules() {
      return {
        variableCode: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('messageTemplate.variableCode')
            }),
            trigger: 'change'
          },
          {
            required: true,
            pattern: /^[A-Za-z_]+$/,
            message: this.$t('messageTemplate.rules.variableCode'),
            trigger: 'change'
          }
        ],
        variableName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('messageTemplate.variableName')
            }),
            trigger: 'change'
          }
        ]
      };
    },
    variablesArry() {
      const { inArry, viewArry, envArry } = this.variables;
      return [...inArry, ...viewArry, ...envArry];
    }
  },

  methods: {
    // 初始化
    initFormData(row = {}, editIndex = -1) {
      if (this.$refs.innerDialog) {
        this.$nextTick(() => {
          this.$refs.innerDialog.clearValidate(['variableCode', 'variableName']);
        });
      }
      this.formData = { ...{ variableType: 1 }, ...row };
      this.editIndex = editIndex;
    },
    // 点击确定
    handleSure() {
      this.$refs.innerDialog.validate((valid) => {
        if (valid) {
          // 验证变量编码是否重复
          let isExit = this.variablesArry.findIndex(
            (item) => item.variableCode === this.formData.variableCode
          );
          // 编辑情况下
          if (this.editIndex !== -1) {
            const isExitInner = this.variables.inArry.findIndex(
              (item, index) =>
                item.variableCode === this.formData.variableCode && index !== this.editIndex
            );

            const isExitOtherType = this.variablesArry.findIndex(
              (item) => item.variableCode === this.formData.variableCode && item.variableType !== 1
            );
            if (isExitInner !== -1 || isExitOtherType !== -1) isExit = 1;
            else isExit = -1;
          }
          // 新增
          if (isExit !== -1) this.$message.warning(`变量:${this.formData.variableCode}已经存在！`);
          else {
            this.$emit('sureClick', {
              variable: this.formData,
              editIndex: this.editIndex
            });
          }
        }
        this.showLoading = false;
        return false;
      });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.innerDialog {
  ::v-deep {
    .form {
      margin: 20px 0 0 0;
    }
  }
}
</style>
