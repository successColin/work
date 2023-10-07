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
        :rules="rules"
        ref="numberValidateForm"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="名称" prop="name" required >
            <global-input v-model="obj.name"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="edit" label="服务器IP" prop="ip" required>
            <global-input v-model="obj.ip"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="edit" label="服务器端口" prop="port" required>
            <global-input v-model="obj.port"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="edit" label="帐号" prop="username">
            <global-input v-model="obj.username"></global-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="edit" label="密码" prop="password">
            <global-input v-model="obj.password"></global-input>
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
        name: [
          { required: true, message: '请输入名称', trigger: 'change' },
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        ip: [
          { required: true, message: '请输入IP', trigger: 'change' },
          { required: true, message: '请输入IP', trigger: 'blur'}
        ],
        port: [
          { required: true, message: '请输入端口', trigger: 'change' },
          { required: true, message: '请输入端口', trigger: 'blur'}
        ],
        username: [
          { required: false, message: '请输入帐号', trigger: 'change' },
          { required: false, message: '请输入帐号', trigger: 'blur'}
        ],
        password: [
          { required: false, message: '请输入密码', trigger: 'change' },
          { required: false, message: '请输入密码', trigger: 'blur'}
        ]
      }
    };
  },

  components: {
  },

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
      //height: 58px;
      margin-bottom: 12px;
      &.edit{
        .el-form-item__label{
          margin-bottom: 7px;
        }
      }
      .el-form-item__error{
        padding-top: 0;
      }
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
