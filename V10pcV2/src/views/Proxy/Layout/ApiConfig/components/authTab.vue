/**
* @name: authTab
* @author: DELL
* @date: 2023/2/23 19:18
* @description：authTab
* @update: 2023/2/23 19:18
*/
<!-- 页面 -->
<template>
  <div class="authTab">
    <el-form
        label-position="top"
        :model="formData"
        :rules="rules"
        ref="formConfig"
        label-width="80px"
        class="m-t-10"
    >
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item
              label="认证类型"
              prop="keycode">
            <el-select
                placeholder="请选择"
                v-model="formData.authType"
                @change="changeAuthType"
            >
              <el-option
                  label="NO_AUTH"
                  :value="0"
              >
              </el-option>
              <el-option
                  label="Basic Auth"
                  :value="1"
              >
              </el-option>
              <el-option
                  label="API Key"
                  :value="2"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" style="visibility: hidden">
          <el-form-item label="业务名称"  prop="name">
            <apiot-input
                disabled
                placeholder="请输入业务名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.authType === 1">
          <el-form-item
              label="用户名"
              prop="username"
          >
            <apiot-input
                @input="changeAuthType"
                :isForbid="false"
                placeholder="请输入用户名"
                v-model="formData.username"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.authType === 1">
          <el-form-item label="密码"  prop="password">
            <apiot-input
                @input="changeAuthType"
                :isForbid="false" placeholder="请输入密码" v-model="formData.password"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.authType === 2">
          <el-form-item
              label="属性"
              prop="key"
          >
            <apiot-input
                @input="changeAuthType"
                :isForbid="false"
                placeholder="请输入属性" v-model="formData.key"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.authType === 2">
          <el-form-item label="值"  prop="value">
            <apiot-input
                @input="changeAuthType"
                :isForbid="false" placeholder="请输入值" v-model="formData.value"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.authType === 2">
          <el-form-item
              label="加入到"
              prop="addTo"
          >
            <el-select
                @change="changeAuthType"
                placeholder="请选择"
                v-model="formData.addTo">
              <el-option
                  label="Header"
                  value="Header"
              >
              </el-option>
              <el-option
                  label="Query String"
                  value="QueryString"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        key: [
          { required: true, message: '请输入属性', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入值', trigger: 'blur' }
        ],
        addTo: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
      },
      formData: {
        authType: 1,
        username: '',
        password: '',
        key: '',
        value: '',
        addTo: 'Header'
      }
    };
  },

  components: {},

  computed: {
  },

  mounted() {},
  methods: {
    changeAuthType() {
      this.$refs.formConfig.clearValidate();
      const { authType, ...rest } = this.formData;
      this.info.commonApiHeader = {
        ...this.info.commonApiHeader,
        authType,
        authBody: JSON.stringify(rest)
      };
    }
  },
  watch: {
    'info.commonApiHeader': {
      deep: true,
      immediate: true,
      handler(v) {
        const { authType = 2, authBody = '{}' } = v;
        try {
          const obj = JSON.parse(authBody);
          const { username = '', password = '', key = '', value = '', addTo = 'Header' } = obj;
          this.formData = {
            authType,
            username,
            password,
            key,
            value,
            addTo
          };
        } catch (e) {
          this.formData = {
            authType: 1,
            username: '',
            password: '',
            key: '',
            value: '',
            addTo: 'Header'
          };
        }
      }
    },
    // formData: {
    //   deep: true,
    //   handler(v) {
    //     const { authType, ...rest } = v;
    //     this.info.commonApiHeader = {
    //       ...this.info.commonApiHeader,
    //       authType,
    //       authBody: JSON.stringify(rest)
    //     };
    //   }
    // }
  },
  name: 'authTab',
};
</script>

<style lang='scss' scoped>
.authTab {
  width: 100%;
  height: 100%;
  position: relative;
  ::v-deep {
    .el-form-item{
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
