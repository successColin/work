/**
* @name: apiHeadForm
* @author: DELL
* @date: 2023/2/21 11:06
* @description：apiHeadForm
* @update: 2023/2/21 11:06
*/
<!-- 页面 -->
<template>
  <card>
    <template v-slot:title><span>基本信息</span></template>
    <template>
      <div class="headerForm">
        <el-form
            label-position="top"
            ref="formDetials"
            :model="value"
            :rules="rules"
            label-width="80px"
            class="m-t-10"
        >
          <el-row :gutter="40">
            <el-col :span="12">
              <el-form-item
                label="业务编码"
                prop="keycode">
              <apiot-input v-model="value.keycode" placeholder="请输入业务编码"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="业务名称"  prop="name">
                <apiot-input
                    v-model="value.name"
                    placeholder="请输入业务名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                  label="使用协议"
                  prop="protocol"
              >
                <el-select placeholder="请选择"  v-model="value.protocol">
                  <el-option
                      label="HTTP"
                      :value="0"
                  >
                  </el-option>
                  <el-option
                      label="OPC"
                      :value="1"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="value.protocol===0">
              <el-form-item label="请求地址"  prop="url">
                <apiot-input :isForbid="false" placeholder="请输入请求地址" v-model="value.url"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="value.protocol===0">
              <el-form-item
                  label="请求类型"
                  prop="restType"
              >
                <el-select placeholder="请选择" v-model="value.restType">
                  <el-option
                      label="POST"
                      :value="1"
                  >
                  </el-option>
                  <el-option
                      label="GET"
                      :value="0"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用场景描述"  prop="memo">
                <apiot-input placeholder="请输入描述" v-model="value.memo"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </template>
  </card>
</template>

<script>
// import { IsURL } from '@/views/HomeMenuConfig/constants/common';

const card = () => import('./collapseCard');
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    // 组织
    // const checkUrl = (rule, value, callback) => {
    //   if (!value) {
    //     callback('请输入请求地址!');
    //   } else if (!IsURL(value)) {
    //     callback('请输入正确的url地址!');
    //   } else {
    //     callback();
    //   }
    // };
    return {
      rules: {
        name: [
          { required: true, message: '请输入业务名称', trigger: 'blur' },
        ],
        keycode: [
          { required: true, message: '请输入业务编码', trigger: 'blur' }
        ],
        protocol: [
          { required: true, message: '请选择协议', trigger: 'change' }
        ],
        url: [
          { required: false, message: '请输入地址', trigger: 'blur' }
        ],
        restType: [
          { required: true, message: '请选择请求方式', trigger: 'change' }
        ],
      }
    };
  },

  components: {
    card
  },

  computed: {},

  mounted() {},

  methods: {
    formDetials() {
      return this.$refs.formDetials;
    }
  },
  name: 'apiHeadForm',
};
</script>

<style lang='scss' scoped>
.headerForm{
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .el-form {
    width: 100%;
    .el-form-item{
      //margin-bottom: 0;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
