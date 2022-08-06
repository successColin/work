<template>
  <div class="config selDataInit">
    <h1 class="config__h1">基本信息</h1>
    <el-form label-position="top" :model="form" :rules="rules" ref="form">
      <el-form-item label="面板名称" prop="name">
        <apiot-input
          v-model="form.name"
          placeholder="请输入面板名称"
        ></apiot-input>
      </el-form-item>
      <el-form-item label="面板类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择面板类型"
          :disabled="curDrawerType === 2"
        >
          <!-- <el-option :value="0" label="系统"></el-option> -->
          <el-option :value="1" label="公用"></el-option>
          <el-option :value="2" label="私用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="展示类型" prop="type" v-if="configData[0]">
        <el-select
          v-model="configData[0].selShowType"
          placeholder="请选择面板类型"
          @change="changeType"
          :disabled="curDrawerType === 2"
        >
          <el-option :value="1" label="列表"></el-option>
          <el-option :value="2" label="单表树"></el-option>
          <el-option :value="3" label="列表+单表树"></el-option>
          <el-option :value="4" label="多表树"></el-option>
          <el-option :value="5" label="列表+多表树"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="描述" prop="memo">
        <apiot-input
          type="textarea"
          :rows="4"
          v-model="form.memo"
          placeholder="请输入面板描述"
        ></apiot-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { addPanel, modifyPanel } from '@/api/menuConfig';

export default {
  props: {
    configData: {
      type: Array
    },
    // 当前弹窗类型
    curDrawerType: {
      type: Number,
      default: 1
    },
    row: {
      type: Object
    }
  },
  data() {
    return {
      form: {
        name: '',
        type: 2,
        memo: ''
      },
      rules: {
        name: [{ required: true, message: '请输入面板名称', trigger: 'change' }],
        type: [{ required: true, message: '请选择面板类型', trigger: 'change' }],
        memo: [{ required: true, message: '请输入面板描述', trigger: 'change' }]
      },
      rowInfo: null,
      hasAdd: false
    };
  },

  components: {},

  computed: {},

  mounted() {
    if (this.row.panelName) {
      this.initFormData(this.row);
    }
  },

  methods: {
    initFormData(row) {
      // console.log(row);
      this.form.name = row.panelName;
      this.form.type = row.panelType;
      this.form.memo = row.memo;
      this.rowInfo = row;
    },
    async submitSel() {
      await this.$refs.form.validate();
      let data = null;
      if (this.curDrawerType === 1 && !this.hasAdd) {
        data = await this.addPanel();
      } else {
        data = await this.editPanel();
      }
      return data;
    },
    async addPanel() {
      const params = {
        memo: this.form.memo,
        panelName: this.form.name,
        panelType: this.form.type,
        panelClassify: 2,
        clientType: this.$route.query.isApp === '1' ? 2 : 1
      };
      if (this.form.type === 2) {
        params.relationMenuDesignId = this.$route.query.id;
      }
      try {
        const data = await addPanel(params);
        this.rowInfo = data;
        this.hasAdd = true;
        return data;
        // this.$message({
        //   type: 'success',
        //   message: '新增成功'
        // });
      } catch (error) {
        if (error.panelName) {
          return this.$message({
            type: 'warning',
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
        panelClassify: 2
      };
      console.log(params);
      try {
        const data = await modifyPanel(params);
        return data;
        // this.$message({
        //   type: 'success',
        //   message: '编辑成功'
        // });
      } catch (error) {
        if (error.panelName) {
          return this.$message({
            type: 'warning',
            message: `面板名称 ${error.panelName}`
          });
        }
      }
    },
    // 更改类型
    changeType(v) {
      this.$emit('changeType', v);
    }
  },

  watch: {
    form: {
      handler(v) {
        if (v && this.hasAdd) {
          this.rowInfo.memo = v.memo;
          this.rowInfo.panelName = v.name;
          this.rowInfo.panelType = v.type;
        }
      },
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';
</style>
