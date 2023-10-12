/**
* @name: dataConverDialog
* @author: DELL
* @date: 2023/3/2 14:20
* @description：dataConverDialog
* @update: 2023/3/2 14:20
*/
<!-- 页面 -->
/**
* @name: entityTableDialog
* @author: DELL
* @date: 2023/3/1 15:16
* @description：entityTableDialog
* @update: 2023/3/1 15:16
*/
<!-- 页面 -->
<template>
  <apiot-dialog
      v-bind="$attrs"
      v-on="$listeners"
      class="innerDialog"
      @open="open"
      @close="close"
      title="数据转换"
      :loading.sync="showLoading"
      @sure-click="handleSure"
  >
    <template v-slot:btn>
      <apiot-button @click="reset">清空</apiot-button>
    </template>
    <el-form
        label-position="top"
        label-width="80px"
        class="form"
        ref="innerDialog"
        :model="formData"
        :rules="rules"
        @submit.native.prevent
    >
      <el-row :gutter="40">
        <el-col :span="24">
          <el-form-item
              label="转换方式"
              prop="transformType">
            <el-radio-group v-model="formData.transformType" @change="clear">
              <apiot-radio :label="0">编码转ID</apiot-radio>
              <apiot-radio :label="1">自定义</apiot-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="formData.transformType===0">
          <el-form-item
              label="表名"
              prop="tableName">
            <filterable-input
                placeholder="请选择实体表"
                title="实体表"
                :dialogType="1"
                :showInfo="{tableName: formData.tableName}"
                @selectRes="selectTable"
            ></filterable-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.transformType===0">
          <el-form-item label="编码字段"  prop="keycodeField">
            <filterable-input
                placeholder="请选择字段"
                :tableArr="options"
                :showInfo="{columnName: formData.keycodeField}"
                :dialogType="2"
                @selectRes="selectColumnRes($event, 'keycodeField')"
            ></filterable-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.transformType===0">
          <el-form-item
              label="ID字段"
              prop="idFiled"
          >
            <filterable-input
                placeholder="请选择字段"
                :tableArr="options"
                :showInfo="{columnName: formData.idFiled}"
                :dialogType="2"
                @selectRes="selectColumnRes($event, 'idFiled')"
            ></filterable-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.transformType===1">
          <el-form-item
              label="SQL语句"
              prop="sqlScript"
          >
            <el-input
                type="textarea"
                placeholder="这是一段SQL"
                v-model="formData.sqlScript"
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </apiot-dialog>
</template>

<script>
import { listSysEntityColumns } from '@/api/entityManage';

export default {
  components: {},

  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
  },

  data() {
    return {
      options: [],
      showLoading: false,
      formData: {}
    };
  },

  computed: {
    title() {
      if (this.type === 'edit') {
        return '编辑实体表';
      }
      return '添加实体表';
    },
    rules() {
      return {
        tableName: [
          {
            required: true,
            message: '请选择表名',
            trigger: 'blur'
          },
        ],
        idFiled: [
          {
            required: true,
            message: '请选择id字段',
            trigger: 'blur'
          }
        ],
        keycodeField: [
          {
            required: true,
            message: '请选择编码字段',
            trigger: 'blur'
          }
        ],
        sqlScript: [
          {
            required: true,
            message: '请选择SQL',
            trigger: 'blur'
          }
        ]
      };
    },
  },

  methods: {
    clear() {
      this.$refs.innerDialog.clearValidate();
    },
    async close() {
      this.formData = {};
      this.$refs.innerDialog.clearValidate();
    },
    async open() {
      this.formData = this.value;
      if (this.value.tableName) {
        await this.getList(this.value.tableName);
      }
    },
    change(key) {
      this.$refs.innerDialog.validateField(key, (valid) => {
        if (valid) {
          return true;
        }
        return false;
      });
    },
    async getList(tableName) {
      const res = await listSysEntityColumns({
        keywords: '',
        tableName
      });
      this.options = res;
    },
    // 初始化
    async selectTable({ tableName }) {
      if (tableName !== this.value.tableName) {
        this.formData.tableName = tableName;
        this.formData.keycodeField = '';
        this.formData.idFiled = '';
        await this.getList(tableName);
        this.change('tableName');
      }
    },
    async selectColumnRes(v, key) {
      this.formData[key] = v.columnName;
      this.change(key);
    },
    reset() {
      const { sourceDataKey, rowIndex } = this.formData;
      this.$bus.$emit('sureClickInDataConverDialog', {
        sourceDataKey,
        rowIndex,
        transformType: 0,
        tableName: '',
        idFiled: '',
        keycodeField: '',
        sqlScript: ''
      });
      this.$emit('update:visible', false);
    },
    // 点击确定
    handleSure() {
      this.$refs.innerDialog.validate((valid) => {
        if (valid) {
          this.$bus.$emit('sureClickInDataConverDialog', this.formData);
          this.$emit('update:visible', false);
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
    .el-select{
      width: 100%;
    }
  }
}
</style>
