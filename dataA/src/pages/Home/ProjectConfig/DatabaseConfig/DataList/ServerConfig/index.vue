/**
* @name: index
* @author: DELL
* @date: 2021/11/1 10:01
* @description：index
* @update: 2021/11/1 10:01
*/
<!-- 页面 -->
<template>
  <div class="serveWrap">
    <el-form
        label-position="top"
        label-width="80px"
        @submit.native.prevent
        :model="obj"
        ref="numberValidateForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="数据库名称" prop="datasourceName" required :rules="rules.datasourceName">
            <global-input v-model="obj.datasourceName"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="主机名/IP" prop="ip" required :rules="rules.ip">
            <global-input v-model="obj.ip"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="端口" prop="port" required :rules="rules.port">
            <global-input type="number" v-model="obj.port"></global-input>
          </el-form-item>
        </el-col>
        <el-row :gutter="20" class="rowWrap">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username" required :rules="rules.username">
              <global-input v-model="obj.username"></global-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password" required :rules="rules.password">
              <global-input v-model="obj.password" show-password></global-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
          <el-form-item label="数据库" required prop="datasourceType" :rules="rules.datasourceType">
            <c-select
                v-model="obj.datasourceType"
                :options="options"
            >
            </c-select>
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
      obj: {},
      options: [
        {value: 1, label: 'MYSQL'},
        {value: 2, label: 'ORACLE'},
        {value: 3, label: 'SQLSERVER'}
      ],
      rules: {
        datasourceName: [
          { required: true, message: '请输入名称', trigger: 'change' },
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        ip: [
          { required: true, message: '请输入主机名/IP', trigger: 'change' },
          {required: true, message: '请输入主机名/IP', trigger: 'blur'}
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'change' },
          {required: true, message: '请输入端口', trigger: 'blur'}
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        datasourceType: [
          { required: true, message: '请选择数据库类型', trigger: 'change' }
        ]
      }
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.obj = JSON.parse(JSON.stringify(this.info));
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.serveWrap {
  padding: 20px 40px;
  box-sizing: border-box;

  ::v-deep {
    .el-form-item {
      height: 58px;
      margin-bottom: 12px;
    }

    .el-row::after, .el-row::before {
      display: none;
    }

    .el-form-item__label {
      height: 18px;
      margin-bottom: 2px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: inherit;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    input[type="number"] {
      -moz-appearance: textfield;
    }
  }
}
</style>
