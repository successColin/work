<!--
 * @Author: sss
 * @Date: 2021-05-06 10:36:54
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-06 10:36:54
 * @Descripttion: 表达式详细信息
-->
<template>
  <apiot-drawer
    v-on="$listeners"
    v-bind="$attrs"
    :title="title"
    :loading.sync="showLoading"
    :hasFooter="expressionGroup !== 1"
    @sure-click="sureClick"
  >
    <el-form
      label-position="top"
      label-width="80px"
      class="form"
      ref="exDetail"
      :model="formData"
      :rules="rules"
    >
      <div class="form--line">
        <el-form-item
          :label="$t('common.name', { name: '' })"
          class="form--child"
          prop="description"
          ref="exDetail-form"
        >
          <apiot-input
            v-model="formData.description"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('common.name', { name: '' }),
              })
            "
          ></apiot-input>
        </el-form-item>
        <el-form-item
          :label="$t('expression.expression', { name: '' })"
          class="form--child"
          prop="expression"
          ref="exDetail-form"
        >
          <apiot-input
            v-model="formData.expression"
            :isForbid="false"
            :isDelSpace="false"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('expression.expression', { name: '' }),
              })
            "
          ></apiot-input>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
          :label="$t('common.remark', { name: '' })"
          class="form--child"
          prop="memo"
          ref="exDetail-form"
        >
          <apiot-input
            v-model="formData.memo"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('common.remark', { name: '' }),
              })
            "
          ></apiot-input>
        </el-form-item>
      </div>
    </el-form>
  </apiot-drawer>
</template>

<script>
import { validateComCron } from '_u/validationRules';
import { addEx, editEx } from '@/api/expression';

export default {
  props: {
    expressionGroup: {
      type: Number,
      default: 1
    },
    expressionType: {
      type: Number,
      default: 2
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 表单数据
      formData: {},
      showLoading: false,
      formItems: [
        { label: 'common.name', prop: 'description' },
        { label: 'expression.expression', prop: 'expression' }
      ]
    };
  },
  computed: {
    rules() {
      const expression = [
        {
          required: true,
          message: this.$t('placeholder.pleaseEnterAny', {
            any: this.$t('expression.expression', { name: '' })
          }),
          trigger: 'change'
        }
      ];
      // 如果时cron表达式时需要做cron表达式校验
      if (this.expressionType === 1) {
        expression.push({ validator: validateComCron, trigger: 'change' });
      }
      return {
        description: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('common.name', { name: '' })
            }),
            trigger: 'change'
          }
        ],
        expression
      };
    }
  },
  methods: {
    // 初始化表单信息
    initFormData(row) {
      // console.log(row);
      this.formData = {};
      this.formData = { ...this.formData, ...row };
    },
    // 新增表达式
    async addExDetail(logData) {
      try {
        const data = await addEx({ ...this.formData, logData });
        this.$emit('addOrEditClick', { data, reload: true });
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.title
          })
        });
      } catch (error) {
        this.showLoading = false;
        let detailError = '';

        Object.keys(error).forEach((key) => {
          const formItem = this.formItems.find((item) => item.prop === key);
          detailError = `${this.$t(formItem.label, { name: '' })}${error[key]}`;
        });

        this.$message.warning(detailError);
      }
    },
    // 编辑表达式
    async editExDetail(logData) {
      try {
        const data = await editEx({ ...this.formData, logData });
        this.$emit('addOrEditClick', { data, reload: true });
        this.showLoading = false;
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.title
          })
        });
      } catch (error) {
        this.showLoading = false;
        let detailError = '';

        Object.keys(error).forEach((key) => {
          const formItem = this.formItems.find((item) => item.prop === key);
          detailError = `${this.$t(formItem.label, { name: '' })}${error[key]}`;
        });

        this.$message.warning(detailError);
      }
    },
    // 保存表达式
    saveDetail() {
      const logData = {
        description: {
          name: this.$t('common.name', { name: '' })
        },
        expression: {
          name: this.$t('expression.expression', { name: '' })
        },
        memo: {
          name: this.$t('common.remark')
        },
        expressionType: {
          name: '表达式类型',
          transFormArr: this.$store.getters.getCurDict('EXPRESSION_TYPE')
        }
      };
      this.formData.expressionType = this.expressionType;
      this.formData.expressionGroup = 2;
      if (this.formData.id) {
        // 编辑
        this.editExDetail(logData);
      } else {
        // 新增
        this.addExDetail(logData);
      }
    },
    sureClick() {
      this.$refs.exDetail.validate((valid) => {
        if (valid) {
          // 验证通过，新增
          this.showLoading = true;
          this.saveDetail();
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 重置数据
    resetForm() {
      this.formData = {};
      this.$refs.exDetail.resetFields();
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
