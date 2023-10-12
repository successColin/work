<template>
  <div class="config globalConfig">
    <h1 class="config__h1">全局配置</h1>
    <el-form
      label-position="top"
      v-if="configData[0] && configData[0].userConfig"
    >
      <el-form-item label="左侧默认显示" class="defaultValue">
        <el-select
          v-model="configData[0].userConfig.lds"
          placeholder="请选择"
          class="defaultValue__type"
        >
          <el-option label="组织管理" :value="1"></el-option>
          <el-option label="角色管理" :value="2"></el-option>
          <el-option label="职位管理" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="基础功能显示">
        <p class="switchBox">
          是否启用重置密码
          <el-switch
            v-model="configData[0].userConfig.resetPas"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </p>
        <p class="switchBox">
          是否启用账户状态
          <el-switch
            v-model="configData[0].userConfig.accountStatus"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </p>
        <p class="switchBox">
          是否启用离职功能
          <el-switch
            v-model="configData[0].userConfig.leaveJob"
            class="switchBox__switch"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    configData: {
      type: Array,
    },
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  created() {
    // if (
    //   this.configData &&
    //   this.configData[0] &&
    //   !this.configData[0].userConfig
    // ) {
    //   this.$set(this.configData[0], 'userConfig', {
    //     lds: 1,
    //     resetPas: 1,
    //     accountStatus: 1,
    //     leaveJob: 1,
    //   });
    // }
    // console.log(this.configData[0]);
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped>
@import '../commonConfig';
.globalConfig {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
}
</style>
