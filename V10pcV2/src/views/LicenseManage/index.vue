/**
* @name: index
* @author: DELL
* @date: 2022/9/6 15:17
* @description：index
* @update: 2022/9/6 15:17
*/
<!-- 页面 -->
<template>
  <div class="contentWrap">
    <SplitLine title="授权文件" />
    <el-form
      label-position="top"
      label-width="80px"
      :model="formLabelAlign"
      @submit.native.prevent
    >
      <el-form-item label="上传授权文件">
        <el-upload
          class="upload-demo"
          action=""
          :limit="1"
          ref="uploads"
          :show-file-list="false"
          :accept="accept"
          :before-upload="beforeUpload"
          :http-request="doUpload"
        >
          <apiot-button size="small" type="default">
            <i class="icon-shangchuan iconfont"></i>
          </apiot-button>
        </el-upload>
      </el-form-item>
      <SplitLine title="授权信息" />
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="PC端用户量">
            <el-input
              v-model="info.extra.pcUserCount"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="APP端用户量">
            <el-input
              v-model="info.extra.appUserCount"
              :disabled="true"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="颁发日期">
            <el-input v-model="info.notBefore" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="到期日期">
            <el-input v-model="info.notAfter" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { doUploadLicense, getLicense } from '@/api/licenseManage';
import SplitLine from './splitLine';

export default {
  data() {
    return {
      accept: '.lic',
      info: {}
    };
  },

  components: {
    SplitLine
  },

  computed: {},

  mounted() {
    this.init();
  },

  methods: {
    beforeUpload(file) {
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name } = file;
        const nameArr = name.split('.');
        const type = nameArr.at(-1);
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'warning',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    async doUpload({ file }) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        await doUploadLicense(formData);
        this.$message.success('上传成功!');
        await this.init();
        this.$refs.uploads.clearFiles();
      } catch (e) {
        this.$refs.uploads.clearFiles();
        // this.$message.warning('上传失败!');
      }
    },
    async init() {
      try {
        const res = await getLicense();
        this.info = res;
      } catch (e) {
        this.info = {
          extra: {
            appUserCount: 0,
            pcUserCount: 0
          },
          notAfter: '',
          notBefore: ''
        };
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  ::v-deep {
    .el-form {
      .el-form-item {
        padding: 0 20px;
      }
      .el-upload .el-button {
        display: inline-block;
        min-width: 400px;
        & > span {
          float: right;
          padding-left: 14px;
          border-left: 1px solid #dcdfe6;
          &:hover {
            border-color: #c8dcfc;
          }
        }
        .icon-shangchuan {
          color: #bbc3cd;
        }
      }
      .el-upload .el-button:hover > span {
        border-color: #c8dcfc;
      }
      .el-upload .el-button:active > span {
        border-color: #3f7bdd;
      }
    }
  }
}
</style>
