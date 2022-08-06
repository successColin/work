<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-07-21 11:04:07
 * @Des: app配置-升级属性
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
            :label="$t('appconfig.baseLatestVersion')"
            prop="baseLatestVersion"
          >
            <apiot-input
              v-model="appInfo.baseLatestVersion"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.baseLatestVersion'),
                })
              "
            ></apiot-input>
          </el-form-item>
        </div>

        <div class="form--line">
          <el-form-item
            class="form--child"
            :label="$t('appconfig.updateMode')"
            prop="upgradeMode"
          >
            <apiot-select
              v-model="appInfo.upgradeMode"
              :options="typeArr"
              :placeholder="
                $t('placeholder.pleaseSelect', {
                  any: $t('appconfig.updateMode'),
                })
              "
              @change="handleChangeType"
            ></apiot-select>
          </el-form-item>
          <el-form-item
            class="form--child"
            :label="$t('appconfig.iosDownloadUrl')"
            prop="appInfo.iosDownloadUrl"
          >
            <apiot-input
              v-model="iosDownloadUrl"
              slotType="suffix,prepend"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.iosDownloadUrl'),
                })
              "
            >
              <el-select v-model="http" slot="prepend" placeholder="请选择">
                <el-option label="http://" value="http://"></el-option>
                <el-option label="https://" value="https://"></el-option>
              </el-select>
            </apiot-input>
          </el-form-item>
          <!-- <el-form-item
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
          </el-form-item> -->
        </div>

        <div class="form--line">
          <el-form-item
            class="form--child"
            :label="$t('appconfig.androidDownloadUrl')"
            prop="androidDownloadUrl"
          >
            <apiot-input
              v-model="appInfo.androidDownloadUrl"
              :disabled="true"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.androidDownloadUrl'),
                })
              "
            ></apiot-input>
          </el-form-item>
          <el-form-item
            class="form--child"
            :label="$t('appconfig.upgradeURL')"
            prop="upgradeURL"
          >
            <apiot-input
              v-model="appInfo.upgradeURL"
              :disabled="true"
              :placeholder="
                $t('placeholder.pleaseEnterAnyName', {
                  any: $t('appconfig.upgradeURL'),
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
              :on-success="
                (response, file, fileList) =>
                  handleChange(response, file, fileList, 1)
              "
              :multiple="false"
              :before-upload="beforeUpload"
              accept=".apk"
              :file-list="fileList"
              :http-request="doUpload"
              :show-file-list="false"
            >
              <div class="apkInfo" v-if="appInfo.apkObj && appInfo.apkObj.name">
                <i class="icon-APPanzhuangbao iconfont"></i>
                <div class="info">
                  <p class="name">{{ appInfo.apkObj.name }}</p>
                  <p>{{ (appInfo.apkObj.size / 1024 / 1024).tofixed(2) }}Mb</p>
                </div>
                <!-- <i class="icon-shanchu iconfont"></i> -->
              </div>
              <div class="notUpload" v-else>
                <i class="icon-shangchuan iconfont m-r-9"></i>
                {{ $t('appconfig.uploadTips') }}
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
              :on-success="
                (response, file, fileList) =>
                  handleChange(response, file, fileList, 2)
              "
              :multiple="false"
              :before-upload="beforeUpload"
              accept=".wgt"
              :file-list="fileList"
              :http-request="doUpload"
              :show-file-list="false"
            >
              <div class="apkInfo" v-if="appInfo.wgtObj && appInfo.wgtObj.name">
                <i class="icon-APPanzhuangbao iconfont"></i>
                <div class="info">
                  <p class="name">{{ appInfo.wgtObj.name }}</p>
                  <p>{{ (appInfo.wgtObj.size / 1024 / 1024).tofixed(2) }}Mb</p>
                </div>
                <!-- <i class="icon-shanchu iconfont"></i> -->
              </div>
              <div class="notUpload" v-else>
                <i class="icon-shangchuan iconfont m-r-9"></i>
                {{ $t('appconfig.uploadTips') }}
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
import axios from 'axios';
import { Decrypt } from '_u/utils';
import { getInfoByKey, saveParameter } from '@/api/appConfig.js';
import ajax from '@/api/axiosConfig';
import { PREFIX, VERSION } from '@/config';

export default {
  props: {},
  data() {
    // 密码
    return {
      appInfo: {},
      fileList: [],
      accept: '.apk,.wgt',
      uploading: false,
      isSubmit: false,
      infoId: {},
      http: 'http://',
      iosDownloadUrl: ''
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
        }
      ];
    }
  },

  mounted() {
    this.getParamsInfoByKey();
  },

  methods: {
    getParamsInfoByKey() {
      try {
        const param = {
          key: 'UPGRADE_PROPERTIES'
        };
        getInfoByKey(param).then((res) => {
          this.appInfo = res.parameterJson;
          this.infoId = res.id;
        });
      } catch (err) {
        console.log(err);
      }
    },
    async saveUrl() {
      try {
        this.appInfo.iosDownloadUrl = `${this.http}${this.iosDownloadUrl}`;
        const params = {
          id: this.infoId,
          parameterKey: 'UPGRADE_PROPERTIES',
          parameterJson: JSON.stringify(this.appInfo)
        };
        await saveParameter(params);
        this.$message.success('操作成功！');
      } catch (error) {
        console.log(error);
      }
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
            type: 'warning',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    handleChangeType(value) {
      // 校验通过
      console.log(value);
      console.log(this.appInfo);
    },
    handleChange(response, file, fileList, type) {
      const param = new FormData();
      param.append('file', file.raw, file.raw.name);
      this.uploading = true;
      axios({
        method: 'post',
        url: `${PREFIX}/${VERSION}/system/parameter/upload`,
        data: param,
        headers: {
          'content-type': 'multipart/form-data',
          token: Decrypt(localStorage.getItem('token') || '')
        }
      }).then(
        (data) => {
          console.log(data.data.code, 11111111);
          if (data.data.code === '00000') {
            if (type === 1) {
              this.appInfo = {
                ...this.appInfo,
                apkObj: file,
                androidDownloadUrl: data.data.data
              };
            } else {
              this.appInfo = {
                ...this.appInfo,
                wgtObj: file,
                upgradeURL: data.data.data
              };
            }
          }
          this.uploading = false;
        },
        (err) => {
          console.log(err, 222222222222);
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
        ...config
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
    }
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
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        box-sizing: border-box;
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
    .half {
      width: 50%;
      padding-right: 10px;
      box-sizing: border-box;
    }
  }
}
</style>
