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
      :isBigDialog="true"
      @close="close"
      title="调用记录详情"
      @sure-click="handleSure"
  >
    <el-form
        label-position="top"
        label-width="80px"
        class="form"
        ref="innerDialog"
        :model="formData"
        @submit.native.prevent
    >
      <el-row :gutter="40">
        <el-col :span="12">
          <el-form-item
              label="请求ID"
              prop="requestId">
            <apiot-input disabled v-model="formData.requestId"/>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item
              label="请求地址"
              prop="requestUrl">
            <apiot-input disabled v-model="formData.requestUrl"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="调用结果"  prop="resultCode">
              <apiot-input disabled v-model="formData.resultCode"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="请求时间"
              prop="requestTime"
          >
            <apiot-input disabled v-model="formData.requestTime"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="响应时间"
              prop="responseTime"
          >
            <apiot-input disabled v-model="formData.responseTime"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
              label="调用说明"
              prop="resultMsg"
          >
            <apiot-input disabled v-model="formData.resultMsg"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
              label="请求头"
              prop="requestHeader"
          >
            <el-input
                type="textarea"
                disabled
                v-model="formData.requestHeader"
                :autosize="{ minRows: 2, maxRows: 6 }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
              label="请求报文"
              prop="requestMsg"
          >
            <el-input
                type="textarea"
                disabled
                v-model="formData.requestMsg"
                :autosize="{ minRows: 2, maxRows: 6 }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item
              label="响应报文"
              prop="responseMsg"
          >
            <el-input
                type="textarea"
                disabled
                v-model="formData.responseMsg"
                :autosize="{ minRows: 2, maxRows: 6 }"
            >
            </el-input>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
  </apiot-dialog>
</template>

<script>

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
  },

  methods: {
    async close() {
      this.formData = {};
    },
    async setValue(value) {
      this.formData = value;
    },
    // 点击确定
    handleSure() {
      this.$emit('update:visible', false);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.innerDialog {
  .form{
    width: 100%;
    height: calc(100%);
    padding-top: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    box-sizing: border-box;
  }
  ::v-deep {
    .form {
      //margin: 20px 0 0 0;
    }
    .el-select{
      width: 100%;
    }
  }
}
</style>
