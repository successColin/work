<!-- 页面 -->
<template>
  <el-form v-on="$listeners" v-bind="$attrs" :rules="rules" :model="formData">
    <el-row
      :gutter="gutter"
      class="form_el_row_wrap"
      style="margin: 0 !important"
    >
      <el-col :span="12">
        <el-form-item :label="$t('role.name')" prop="roleName">
          <apiot-input
            v-model="formData.roleName"
            maxlength="30"
            show-word-limit
            v-forbid
            :placeholder="$t('role.palceEnterName')"
          ></apiot-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('role.group')" prop="groupId">
          <el-select
            :disabled="formData.id ? false : true"
            v-model="formData.groupId"
          >
            <el-option
              v-for="items in roleGroupList"
              :key="items.id"
              :label="items.name"
              :value="items.id"
            >
              <i
                class="iconfont icon-fenzuchangtai"
                style="font-size: 22px; color: #fab71c; margin-right: 10px"
              ></i
              >{{ items.name }}
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item :label="$t('role.memo')" prop="memo">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="$t('role.pleaseEnterkeySearch')"
            v-model="formData.memo"
          >
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    roleGroupList: {
      type: Array,
      default: () => []
    },
    formData: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      gutter: 30
    };
  },

  components: {},

  computed: {},

  mounted() {
    // console.log(this.formData);
  },

  methods: {},
  name: 'formItem'
};
</script>

<style lang='scss' scoped>
.form_el_row_wrap {
  padding: 34px 21px;
  -webkit-font-smoothing: antialiased;

  ::v-deep {
    .el-form-item__label {
      margin-bottom: 4px;
      height: 18px;
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
    }

    .el-input__inner {
      height: 32px;
    }

    .el-select {
      width: 100%;
    }

    .el-form-item__error {
      padding: 4px;
    }

    .el-input__icon {
      line-height: 32px;
    }
  }
}
</style>
