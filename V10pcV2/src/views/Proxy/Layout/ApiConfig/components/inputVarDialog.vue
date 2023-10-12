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
      :model="variables"
      :rules="rules"
      @submit.native.prevent
    >
      <div class="form--line">
        <el-form-item
          :label="$t('messageTemplate.variableName')"
          class="form--child"
          prop="name"
          ref="entity-form"
        >
          <apiot-input
            v-model="variables.name"
            :placeholder="
              $t('placeholder.pleaseEnterAny', {
                any: $t('messageTemplate.variableName'),
              })
            "
          ></apiot-input>
        </el-form-item>
      </div>
      <div class="form--line">
        <el-form-item
            label="变量默认值"
            class="form--child"
            prop="initValue"
            ref="entity-form"
        >
          <apiot-input
              v-model="variables.initValue"
              placeholder="请输入默认值"
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
    };
  },

  computed: {
    rules() {
      return {
        initValue: [
          {
            required: true,
            message: '请输入默认值',
            trigger: 'blur'
          },
        ],
        name: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('messageTemplate.variableName')
            }),
            trigger: 'blur'
          }
        ]
      };
    },
  },

  methods: {
    // 初始化
    initFormData() {
    },
    // 点击确定
    handleSure() {
      this.$refs.innerDialog.validate((valid) => {
        if (valid) {
          // 验证变量编码是否重复
          this.$emit('sureClick', this.variables);
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
