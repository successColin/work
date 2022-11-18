<!--
 * @Descripttion: 弹出框__修改密码
 * @Author: ytx
 * @Date: 2021-05-12 13:47:23
 * @Last Modified by: ytx
 * @Last Modified time: 2021-05-12 13:47:23
-->
<template>
  <apiot-dialog
    class="changePassword"
    v-on="$listeners"
    v-bind="$attrs"
    :visible="visible"
    destroy-on-close
    @sure-click="handleReleaseSubmit"
    @close="handleReset"
    :loading="loading"
    :title="type === 'add' ? '新增文件存储服务' : '编辑文件存储服务'"
  >
    <el-form
      label-position="top"
      ref="ruleForm"
      class="release"
      :model="formData"
    >
      <el-form-item
        label="服务类型"
        prop="class"
      >
        <apiot-select
          v-model="formData.class"
          :options="platformOptions"
          :disabled="type === 'edit'"
        ></apiot-select>
      </el-form-item>
      <el-form-item
        label="平台编码"
        prop="platform"
      >
        <apiot-input
          class="input"
          v-model="formData.platform"
          :isForbid="false"
          :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
          :disabled="type === 'edit'"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="地址"
        prop="endPoint"
      >
        <apiot-input
          class="input"
          v-model="formData.endPoint"
          :isForbid="false"
          :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="账号"
        prop="accessKey"
      >
        <apiot-input
          class="input"
          v-model="formData.accessKey"
          :isForbid="false"
          :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="密钥"
        prop="secretKey"
      >
        <input-password
          v-model="formData.secretKey"
          prependWidth="70px"
          :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
          :isShow="true"
        >
        </input-password>
      </el-form-item>
      <el-form-item
        label="存储桶"
        prop="bucketName"
      >
        <apiot-input
          class="input"
          v-model="formData.bucketName"
          :isForbid="false"
          :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="基础目录"
        prop="basePath"
      >
        <apiot-input
          class="input"
          v-model="formData.basePath"
          :isForbid="false"
          :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="访问域名"
        prop="domain"
      >
        <apiot-input
          class="input"
          v-model="formData.domain"
          :isForbid="false"
          :placeholder="$t('placeholder.pleaseEnterAnyName', { any: '' })"
          :disabled="type === 'edit'"
        ></apiot-input>
      </el-form-item>
      <el-form-item
        label="是否为默认存储"
        prop="defaultStorage"
      >
        <ApiotSwitch
          v-model="formData.defaultStorage"
          @change="(value) => changeRadio(value, 'defaultStorage')"
          :activeValue="true"
          :inactivevalue="false"
        ></ApiotSwitch>
      </el-form-item>
      <el-form-item
        label="是否启用服务"
        prop="enableStorage"
      >
        <ApiotSwitch
          v-model="formData.enableStorage"
          @change="(value) => changeRadio(value, 'enableStorage')"
          :activeValue="1"
          :inactivevalue="2"
        ></ApiotSwitch>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
import { saveGlobal, updateFileStorageServers } from '@/api/globalConfig';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    curData: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    },
    fileStorages: {
      type: Array,
      default: () => []
    },
    configArr: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      platformOptions: [
        {
          name: 'MinIO',
          value: 'MinIO'
        },
        {
          name: '阿里云',
          value: 'AliyunOss'
        },
        {
          name: 'AWS S3',
          value: 'AwsS3'
        },
        {
          name: '百度云',
          value: 'BaiduBos'
        },
        {
          name: '华为云',
          value: 'HuaweiObs'
        },
        {
          name: '本地',
          value: 'Local'
        },
        {
          name: '七牛云',
          value: 'QiniuKodo'
        },
        {
          name: '腾讯云',
          value: 'TencentCos'
        },
        {
          name: '又拍云',
          value: 'UpyunUSS'
        }
      ],
      rules: {
        menuName: [{ required: true, message: '请输入名称', trigger: 'change' }],
        linkAdress: [{ required: true, message: '请输入第三方链接', trigger: 'change' }]
      },
      formData: {},
      loading: false
    };
  },
  watch: {
    curData(v) {
      this.formData = {
        ...v
      };
    }
  },
  computed: {
  },
  methods: {
    // 按钮__确定
    handleReleaseSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          //
          this.loading = true;
          const fileStorages = [...this.fileStorages];
          if (this.formData.defaultStorage) {
            const oldIndex = fileStorages.findIndex((item) => item.defaultStorage);
            if (oldIndex !== -1) {
              const oldData = {
                ...fileStorages[oldIndex],
                defaultStorage: false
              };
              fileStorages.splice(oldIndex, 1, oldData);
            }
          }
          if (this.type === 'add') {
            if (fileStorages.findIndex((item) => item.platform === this.formData.platform) === -1) {
              fileStorages.push(this.formData);
            } else {
              this.$message({
                type: 'success',
                message: '平台编码不能重复'
              });
              return false;
            }
          } else if (this.type === 'edit') {
            const index = fileStorages.findIndex((item) =>
              item.platform === this.formData.platform);
            fileStorages.splice(index, 1, this.formData);
            // fileStorages.push(this.formData);
          }
          const param = {
            parameterKey: 'FILE_SERVER',
            attributeKey: 'fileStorages',
            attributeValue: JSON.stringify(fileStorages)
          };
          await saveGlobal(param);
          await this.$store.dispatch('fetchConfigFun', 'FILE_SERVER');
          await updateFileStorageServers({ infos: JSON.stringify(fileStorages) });
          this.$emit('update:visible', false);
          this.handleReset();
          this.loading = false;
        } else {
          this.loading = false;
          return false;
        }
      });
    },
    // 关闭重置值
    handleReset() {
      this.formData = {};
      this.$emit('update:curData', {});
    },
    async changeRadio(value, key) {
      console.log(value);
      console.log(this.formData);
      this.formData[key] = value;
    },
  }
};
</script>
<style lang='scss' scoped>
.changePassword {
  .el-form-item {
    margin-bottom: 20px;
  }

  &__tips {
    // float: right;
    font-size: 12px;
    color: #808080;
    margin-bottom: 16px;
  }

  ::v-deep {
    .el-alert {
      border: none !important;
    }
    .el-form-item{
      width: 50%;
      float: left;
      padding: 0 10px;
      box-sizing: border-box;
    }
  }
}
</style>
