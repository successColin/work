<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-07-21 11:04:07
 * @Des: 个人中心-账户安全
-->
<template>
  <div class="update">
    <div class="update__content" v-loading="uploading">
      <el-form
        class="form"
        label-position="top"
        ref="detail"
        label-width="80px"
        :model="appInfo"
      >
        <div class="form--line">
          <el-form-item
            class="form--child"
            :label="$t('appconfig.appVersion')"
            prop="appVersion"
          >
            <apiot-input
              v-model="appInfo.appVersion"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.appVersion'),
                })
              "
            ></apiot-input>
          </el-form-item>
          <el-form-item
            class="form--child"
            :label="$t('appconfig.updateMode')"
            prop="upgradeMode"
          >
            <apiot-select
              v-model="appInfo.upgradeMode"
              :options="typeArr"
              :placeholder="
                $t('placeholder.pleaseSelect', { any: $t('appconfig.updateMode') })
              "
              @change="handleChangeType"
            ></apiot-select>
          </el-form-item>
        </div>

        <div class="form--line">
          <el-form-item
            class="form--child"
            :label="$t('appconfig.iosDownloadUrl')"
            prop="iosDownloadUrl"
          >
            <apiot-input
              v-model="appInfo.iosDownloadUrl"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.iosDownloadUrl'),
                })
              "
            ></apiot-input>
          </el-form-item>
          <el-form-item
            class="form--child"
            :label="$t('appconfig.installAtionPackAgeURL')"
            prop="installAtionPackAgeURL"
          >
            <apiot-input
              v-model="appInfo.installAtionPackAgeURL"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.installAtionPackAgeURL'),
                })
              "
            ></apiot-input>
          </el-form-item>
        </div>

        <div class="form--line">
          <el-form-item
            class="form--child"
            :label="$t('appconfig.upgradeURL')"
            prop="upgradeURL"
          >
            <apiot-input
              v-model="appInfo.upgradeURL"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.upgradeURL'),
                })
              "
            ></apiot-input>
          </el-form-item>
          <el-form-item
            class="form--child"
            :label="$t('appconfig.androidDownloadUrl')"
            prop="androidDownloadUrl"
          >
            <apiot-input
              v-model="appInfo.androidDownloadUrl"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.androidDownloadUrl'),
                })
              "
            ></apiot-input>
          </el-form-item>
        </div>

        <div class="form--line">
          <el-form-item
            class="form--child"
            :label="$t('appconfig.apkInstallationPackageUpload')"
            prop="androidDownloadUrl"
          >
            <el-upload
              class="uploadArea"
              action=""
              :on-success="handleChange"
              :multiple="false"
              :before-upload="beforeUpload"
              :accept="accept"
              :file-list="fileList"
              :http-request="doUpload"
              :show-file-list="false"
            >
              <div class="notUpload">
                <i class="icon-shangchuan iconfont m-r-9"></i>
                {{ $t('appconfig.uploadTips') }}
              </div>
              <div class="apkInfo">
                <i class="icon-APPanzhuangbao iconfont"></i>
                <div class="info">
                  <p class="name">eqweqwe.apk</p>
                  <p>12.23Mb</p>
                </div>
                <i class="icon-shanchu iconfont"></i>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item
            class="form--child"
            :label="$t('appconfig.appUpdatePackageUpload')"
            prop="androidDownloadUrl"
          >
            <el-upload
              class="uploadArea"
              action=""
              :on-success="handleChange"
              :multiple="false"
              :before-upload="beforeUpload"
              :accept="accept"
              :file-list="fileList"
              :http-request="doUpload"
              :show-file-list="false"
            >
              <div class="notUpload">
                <i class="icon-shangchuan iconfont m-r-9"></i>
                {{ $t('appconfig.uploadTips') }}
              </div>
              <div class="apkInfo">
                <i class="icon-APPanzhuangbao iconfont"></i>
                <div class="info">
                  <p class="name">eqweqwe.apk</p>
                  <p>12.23Mb</p>
                </div>
                <i class="icon-shanchu iconfont"></i>
              </div>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <footer class="update__footer">
      <apiot-button type="primary" @click="saveUrl" class="saveBtn"
        >保存</apiot-button
      >
    </footer>
  </div>
</template>

<script>
import { Decrypt } from '_u/utils';
import axios from 'axios';
import ajax from '@/api/axiosConfig';
// import { editUserPassword } from '@/api/userCenter.js';

export default {
  props: {},
  data() {
    // 密码
    return {
      appInfo: {},
      fileList: [],
      accept: '.apk',
      uploading: false,
    };
  },

  components: {},

  computed: {
    typeArr() {
      return [
        {
          value: 1,
          name: this.$t('appconfig.updatePackage')
        },
        {
          value: 2,
          name: this.$t('appconfig.installationPackage')
        },
        {
          value: 3,
          name: this.$t('appconfig.manualUpdate')
        }
      ];
    }
  },

  mounted() {},

  methods: {
    saveUrl() {
      this.$refs.detail.validate((valid) => {
        if (!this.curData.leaderId) {
          this.showLeadRequired = true;
          return false;
        }
        if (valid) {
          this.$emit('submit', this.curData);
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    },
    async doUpload(param) {
      const { file } = param;
      await this.beforeUpload(file);
    },
    beforeUpload(file) {
      // 上传校验
      return new Promise((resolve, reject) => {
        const { name } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          this.$message({
            type: 'error',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    handleChangeType(response, file) {
      // 校验通过
      this.$emit('upload-file', file);
      this.fileList = [file];
    },
    handleChange(file, fileList) {
      console.log(file);
      console.log(fileList);
      const param = new FormData();
      param.append('file', fileList.raw, fileList.raw.name);
      this.uploading = true;
      axios({
        method: 'post',
        url: '/file/upload',
        data: param,
        headers: {
          'content-type': 'multipart/form-data',
          token: Decrypt(localStorage.getItem('token') || '')
        }
      }).then(
        (data) => {
          console.log(data);
          if (data.data.code === '00000') {
            // this.$message.success(this.$t('common.successfullyModified'));
            // this.$emit('update:visible', false);
            // this.$emit('getUserCenterInfo');
          }
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        }
      );
    },
    async relationsFile(item) {
      // 并发进行上传文件，上传的时候要进行管理，如果上传的过程中已经有文件还在上传，就不需要重新上传
      const { name } = item;
      const formData = new FormData();
      formData.append('file', item.raw);
      formData.append('name', name);
      formData.append('uploadUserName', this.userInfo.username);
      this.uploadingFiles.push(item); // 放入上传中进行管理
      const source = axios.CancelToken.source();
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: Decrypt(localStorage.getItem('token') || '')
        },
        cancelToken: source.token
      };
      // eslint-disable-next-line no-shadow
      const fetch = axios.create({
        withCredentials: true,
        ...config,
        // onUploadProgress: (progressEvent) => {
        //   // 对原生进度事件的处理
        //   // eslint-disable-next-line no-mixed-operators
        //   const upload = (progressEvent.loaded / progressEvent.total) * 100 || 0;
        //   const pr = upload.toFixed();
        //   const realIndex = this.fileList.findIndex((obj) => obj.uid === uid);
        //   if (realIndex === -1) return;
        //   this.$set(this.fileList, realIndex, { ...item, upload: Number(pr), source, treeType });
        // }
      });
      // 添加响应拦截器
      fetch.interceptors.response.use(
        (res) => {
          const codeNumber = res.data.code;
          if (codeNumber === '00000') {
            return res.data.data;
          }
          return Promise.reject(res.data);
        },
        (error) => Promise.reject(error)
      );
      fetch
        .post(`${ajax.baseURL}file/upload`, formData, config)
        .then(() => {
          this.delFileFromUploadingFiles(item);
          this.initKonwledge({});
        })
        .catch(() => {
          this.delFileFromUploadingFiles(item);
        });
    },
  }
};
</script>

<style lang='scss' scoped>
@import '../SystemUrl/index.scss';

$--name: 'update';
@include setListLayout($--name);
.update {
  ::v-deep {
    .uploadArea {
      height: 68px;
      background: #fafafa;
      border-radius: 4px;
      .el-upload {
        width: 100%;
        height: 100%;
      }
      .notUpload {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #aaaaaa;
        font-size: 12px;
      }
      .apkInfo {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .icon-APPanzhuangbao {
          font-size: 40px;
          color: #34c7be;
          margin: 0 10px;
        }
        .info {
          width: calc(100% - 90px);
          text-align: left;
          padding: 10px 0;
          box-sizing: border-box;
          height: 100%;
          line-height: 22px;
          color: #808080;
          .name {
            color: #333333;
          }
        }
        .icon-shanchu {
          color: #bbc3cd;
        }
      }
    }
  }
}
</style>
