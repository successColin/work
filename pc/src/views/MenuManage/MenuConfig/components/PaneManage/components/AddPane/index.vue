<template>
  <apiot-dialog
    class="addPane"
    v-on="$listeners"
    v-bind="$attrs"
    :title="getTitle"
    @sure-click="sureClick"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="top"
      label-width="80px"
      class="form"
    >
      <el-form-item label="面板名称" prop="name" v-if="curDrawerType !== 3">
        <apiot-input
          v-model="form.name"
          placeholder="请输入面板名称"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="面板类型"
        prop="panelType"
        v-if="curDrawerType !== 3"
      >
        <el-select
          v-model="form.type"
          placeholder="请选择面板类型"
          :disabled="curDrawerType !== 1"
        >
          <!-- <el-option :value="0" label="系统"></el-option> -->
          <el-option :value="1" label="公用"></el-option>
          <el-option :value="2" label="私用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="复制到菜单"
        prop="menuId"
        v-if="curDrawerType === 3 && rowInfo && rowInfo.panelType === 2"
      >
        <filterable-input
          ref="filterableInput"
          placeholder="请选择菜单"
          :showInfo="menuObj"
          :hasPagination="true"
          :dialogType="6"
          @selectRes="selectMenu"
        ></filterable-input>
      </el-form-item>
      <el-form-item
        label="能否应用于流程"
        prop="type"
        v-if="curDrawerType !== 3"
      >
        <ApiotSwitch
          :key="form.name"
          v-model="form.enableWorkflow"
          :activeValue="1"
          :inactivevalue="2"
        ></ApiotSwitch>
      </el-form-item>
      <el-form-item label="描述" prop="memo" v-if="curDrawerType !== 3">
        <apiot-input
          type="textarea"
          :rows="4"
          v-model="form.memo"
          placeholder="请输入面板描述"
        ></apiot-input>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
import { addPanel, modifyPanel, copyPanel } from '@/api/menuConfig';

export default {
  name: 'addPane',
  props: {
    // 当前弹窗类型
    curDrawerType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      form: {
        name: '',
        type: 2,
        enableWorkflow: 2,
        menuId: '',
        memo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入面板名称', trigger: 'change' }],
        type: [{ required: true, message: '请选择面板类型', trigger: 'change' }],
        memo: [{ required: true, message: '请输入面板描述', trigger: 'change' }]
      },
      rowInfo: null,
      menuObj: {}
    };
  },
  computed: {
    getTitle() {
      if (this.curDrawerType === 1) {
        return '新增面板';
      }
      if (this.curDrawerType === 2) {
        return '编辑面板';
      }
      if (this.curDrawerType === 3) {
        return '复制面板';
      }
      return '新增面板';
    }
  },
  components: {},
  methods: {
    initFormData(row) {
      // console.log(row, this.curDrawerType);
      this.form.name = row.panelName;
      this.form.type = row.panelType;
      this.form.enableWorkflow = row.enableWorkflow;
      this.form.memo = row.memo;
      this.form.menuId = this.$route.params.id;
      this.rowInfo = row;
      this.menuObj.id = this.$route.params.id;
      this.menuObj.menuName = this.$route.query.menuName;
    },
    resetForm() {
      this.form = {
        name: '',
        type: 1,
        memo: ''
      };
      this.$refs.form.resetFields();
    },
    sureClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // console.log(this.curDrawerType);
          if (this.curDrawerType === 1) {
            this.addPanel();
          } else if (this.curDrawerType === 2) {
            this.editPanel();
          } else if (this.curDrawerType === 3) {
            this.copyPanle();
          }
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    async addPanel() {
      const params = {
        memo: this.form.memo,
        panelName: this.form.name,
        panelType: this.form.type,
        enableWorkflow: this.form.enableWorkflow,
        panelClassify: 1,
        clientType: this.$route.query.isApp === '1' ? 2 : 1
      };
      if (this.form.type === 2) {
        params.relationMenuDesignId = this.$route.query.id;
      }
      try {
        await addPanel(params);
        this.$emit('addPaneRes');
        this.$emit('update:visible', false);
        this.$message({
          type: 'success',
          message: '新增成功'
        });
      } catch (error) {
        if (error.panelName) {
          return this.$message({
            type: 'error',
            message: `面板名称 ${error.panelName}`
          });
        }
      }
    },
    async editPanel() {
      const params = {
        ...this.rowInfo,
        memo: this.form.memo,
        panelName: this.form.name,
        enableWorkflow: this.form.enableWorkflow,
        panelClassify: 1
      };
      try {
        await modifyPanel(params);
        this.rowInfo = null;
        this.$emit('editRes', params);
        this.$emit('update:visible', false);
        this.$message({
          type: 'success',
          message: '编辑成功'
        });
      } catch (error) {
        if (error.panelName) {
          return this.$message({
            type: 'error',
            message: `面板名称 ${error.panelName}`
          });
        }
      }
    },
    selectMenu(menu) {
      // console.log(menu);
      this.menuObj = menu;
      this.form.menuId = menu.id;
    },
    async copyPanle() {
      const params = {
        // memo: this.form.memo,
        // panelName: this.form.name,
        // enableWorkflow: this.form.enableWorkflow,
        // panelClassify: 1,
        panelId: this.rowInfo.id
      };
      if (this.rowInfo.panelType === 2) {
        params.menuId = this.form.menuId;
        params.oldMenuId = this.$route.params.id;
      }
      try {
        await copyPanel(params);
        console.log(params.menuId === params.oldMenuId);
        if (this.rowInfo.panelType !== 2 || params.menuId === params.oldMenuId) {
          this.$emit('addPaneRes');
        }
        this.rowInfo = null;
        this.$emit('update:visible', false);
        this.$message({
          type: 'success',
          message: '复制成功'
        });
      } catch (error) {
        if (error.panelName) {
          return this.$message({
            type: 'error',
            message: `面板名称 ${error.panelName}`
          });
        }
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.addPane {
  ::v-deep {
    .el-dialog__body {
      overflow-y: scroll;
    }
    .el-select {
      width: 100%;
    }
  }
}
</style>
