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
      :title="title"
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
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item
              label="实体表"
              prop="tableName">
            <filterable-input
                placeholder="请选择关联表"
                title="关联表"
                :dialogType="1"
                :showInfo="{tableName: formData.tableName}"
                @selectRes="selectTable($event, 'tableName')"
            ></filterable-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="唯一键组合"  prop="columnName">
            <el-select
                v-model="formData.columnName"
                multiple
                filterable
                collapse-tags
                @change="change('columnName')"
                placeholder="请选择"
            >
              <el-option
                  v-for="item in options"
                  :key="item.columnName"
                  :label="`${item.columnName}`"
                  :value="item.columnName">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="权限"
              prop="tableAuth"
          >
            <el-select
                placeholder="请选择"
                @change="change('tableAuth')"
                v-model="formData.tableAuth">
              <el-option
                  label="全部"
                  value="0"
              >
              </el-option>
              <el-option
                  label="新增"
                  value="1"
              >
              </el-option>
              <el-option
                  label="编辑"
                  value="2"
              >
              </el-option>
            </el-select>
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
    details: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    type: {
      type: String,
      default() {
        return 'add';
      }
    }
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
        columnName: [
          {
            required: true,
            message: '请选择唯一键',
            trigger: 'blur'
          }
        ],
        tableAuth: [
          {
            required: true,
            message: '请选择权限',
            trigger: 'blur'
          }
        ]
      };
    },
  },

  methods: {
    async close() {
      this.formData = {
        columnName: []
      };
      this.$refs.innerDialog.clearValidate();
    },
    async open() {
      const { columnName, ...rest } = this.value;
      this.formData = {
        ...rest,
        columnName: columnName ? columnName.split(',') : []
      };
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
    async selectTable({ tableName }, key) {
      if (tableName !== this.value.tableName) {
        this.formData.tableName = tableName;
        this.formData.columnName = [];
        await this.getList(tableName);
        this.change(key);
      }
    },
    // 点击确定
    handleSure() {
      this.$refs.innerDialog.validate((valid) => {
        if (valid) {
          const { columnName = [], tableName, ...rest } = this.formData;
          const { commonApiMappingTables = [] } = this.details;
          if (commonApiMappingTables.find((item) => item.tableName === tableName) && this.type === 'add') {
            this.$message.error(`已经存在实体表${tableName},请重新选择实体表!`);
            this.showLoading = false;
            return false;
          }
          this.$bus.$emit('sureTableClick', {
            type: this.type,
            value: {
              ...rest,
              tableName,
              columnName: columnName.join(',')
            },
            options: this.options
          });
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
