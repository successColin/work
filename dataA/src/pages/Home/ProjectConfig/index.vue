/**
* @name: index
* @author: DELL
* @date: 2021/10/30 9:35
* @description：index
* @update: 2021/10/30 9:35
*/
<!-- 页面 -->
<template>
  <div class="configWrap">
    <el-form
        ref="numberValidateForm"
        :model="obj"
        label-position="top"
        label-width="80px"
        @submit.native.prevent
    >
      <el-form-item
          label="项目名称"
          required
          prop="name"
          :rules="rules.name"
      >
        <global-input v-model="obj.name"></global-input>
      </el-form-item>
      <el-form-item
          label="数据库"
          prop="datasourceId"
      >
        <DataBaseConfig
            @change="changeDatasourceId"
            v-model="obj.datasourceId"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const DataBaseConfig = () => import('./DatabaseConfig/index');

export default {
  props: {
    viewObj: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    // const changeDatasourceId = (rule, value, callback) => {
    //   console.log(value, 'zzzzzzzz');
    //   callback();
    // }
    return {
      obj: {},
      rules: {
        name: [
          {required: true, message: '请输入名称', trigger: 'change'},
          {required: true, message: '请输入名称', trigger: 'blur'}
        ],
        datasourceId: [
          {required: true, message: '请选择数据库', trigger: 'change'}
        ]
      }
    };
  },

  components: {DataBaseConfig},

  computed: {},

  mounted() {
    this.obj = this.viewObj;
  },

  methods: {
    changeDatasourceId(value) {
      this.obj = {
        ...this.obj,
        datasourceId: value
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.configWrap {
  padding: 20px 40px;
  box-sizing: border-box;

  ::v-deep {
    .el-form-item {
      margin-bottom: 20px;
    }

    .el-form-item__content {
      line-height: unset;
    }

    .el-form-item__label {
      height: 18px;
      margin-bottom: 4px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 18px;
    }
  }
}
</style>
