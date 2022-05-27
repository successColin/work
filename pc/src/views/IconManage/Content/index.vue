<!-- 页面 -->
<template>
  <div class="contentWrap" v-loading="loading">
    <div class="searchWrap">
      <div class="searchWrap_selectAll" v-if="isShow()">
        <apiot-checkbox @change="selectAll" :value="isCheckAll()">
          {{ $t('role.selectAll') }}({{ type ? 0 : selectedArr.length }})
        </apiot-checkbox>
      </div>
      <div class="searchWrap__box">
        <apiot-input
          :placeholder="$t('placeholder.pleaseEnterkeySearch')"
          v-model="input"
          @blur="isActive = false"
          @focus="isActive = true"
          slotType="prefix"
        >
          <i
            slot="prefix"
            class="iconfont icon-sousuo"
            :class="isActive ? 'on' : ''"
          ></i>
        </apiot-input>
      </div>
      <div class="searchWrap_btn" v-if="isShow()">
        <apiot-button type="primary" style="margin-right: 0px" @click="toggle">
          <i class="icon-shangchuan iconfont"></i>
          {{ $t('icon.UploadIcon') }}
        </apiot-button>
        <apiot-button @click="del">
          <i class="iconfont icon-shanchu"></i>
          {{ $t('icon.deleteicon') }}
        </apiot-button>
      </div>
    </div>
    <div class="iconWrap">
      <div
        v-for="item in iconArr()"
        :key="item.id"
        class="iconWrap__box"
        :class="{
          checked: hoverKey === item.id || selectedArr.includes(item.id),
        }"
        @mouseenter="hoverKey = item.id"
        @mouseleave="hoverKey = ''"
        @click="changeIcon(item.id)"
      >
        <div
          class="iconfont iconStyle"
          :class="item.value"
          v-show="!isShow()"
        ></div>
        <img class="imgWrap" :src="item.iconUrl" alt="" v-show="isShow()" />
        <p class="iconWrap__name">{{ item.iconName }}</p>
        <apiot-checkbox
          :value="selectedArr.includes(item.id)"
          class="checkStyle"
          @change="changeIcon(item.id)"
        >
        </apiot-checkbox>
      </div>
      <!-- <apiot-nodata v-if="!iconArr().length"> </apiot-nodata> -->
      <div
        v-if="!iconArr().length"
        class="apiotNoData"
        :placeholder="$t('common.noData')"
      ></div>
    </div>
    <apiot-dialog
      :visible.sync="visible"
      :title="$t('icon.UploadIcon')"
      :destroy-on-close="true"
      v-on:sure-click="handleOk"
      @close="handleClose"
      v-on:cancle-click="handleCancel"
    >
      <div class="uploadWrap">
        <div class="uploadWrap__btn">
          <el-upload
            action="/"
            :on-success="handleChange"
            :multiple="true"
            :before-upload="beforeUpload"
            :accept="accept"
            :limit="limit"
            :on-exceed="limitMessage"
            list-type="picture"
            :http-request="doUpload"
          >
            <apiot-button type="primary">
              <i class="icon-shangchuan iconfont"></i>
              {{ $t('icon.Clickupload') }}
            </apiot-button>
          </el-upload>
          <apiot-button @click="delImage">
            <i class="iconfont icon-shanchu"></i>
            {{ $t('icon.deleteicon') }}
          </apiot-button>
        </div>
        <div class="uploadWrap_nodata">
          <div class="uploadWrap_box" v-if="!fileList.length">
            <el-upload
              class="upload-drag"
              drag
              :limit="limit"
              :before-upload="beforeUpload"
              :on-success="handleChange"
              :on-exceed="limitMessage"
              :on-change="change"
              action="/"
              multiple
              :on-progress="handleProgress"
              :http-request="doUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                {{ $t('icon.uploadiconbutton') }}
              </div>
              <div class="el-upload__tip">{{ $t('icon.Supportsbatch') }}</div>
            </el-upload>
          </div>
          <div class="uploadWrap_imageBox" v-if="fileList.length">
            <div
              v-for="item in fileList"
              :key="item.uid"
              class="iconWrap__box animate__animated animate__zoomInRight"
              :class="{
                checked:
                  hoverKey === item.uid || selectedArr.includes(item.uid),
              }"
              @mouseenter="hoverKey = item.uid"
              @mouseleave="hoverKey = ''"
              @click="changeIcon(item.uid, 'upload')"
            >
              <div class="iconSvg" :class="item.value">
                <img width="38px" height="38px" :src="item.url" />
              </div>
              <p class="iconWrap__name">{{ item.name }}</p>
              <apiot-checkbox
                :value="selectedArr.includes(item.uid)"
                class="checkStyle"
                @change="changeIcon(item.uid, 'upload')"
              >
              </apiot-checkbox>
            </div>
          </div>
        </div>
      </div>
    </apiot-dialog>
  </div>
</template>

<script>
import axios from 'axios';
import { definedIconGroupID, Decrypt } from '@/utils/utils';
import { getIconList, batchDeleteIcon } from '@/api/iconManage';
import fetch from '@/api/axiosConfig';

export default {
  props: {
    iconMessage: {
      type: Object,
      default: () => {}
    },
    baseType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      loading: false,
      accept: '.png,.svg,.eps',
      input: '',
      isActive: false,
      visible: false,
      hoverKey: '',
      selectedArr: [],
      fileList: [],
      type: '',
      limit: 15,
      groupArr: []
    };
  },

  components: {},

  computed: {
    iconArr() {
      // 模糊查询
      return function() {
        const groupArr = this.groupArr || [];
        const arr =
          groupArr.filter(
            (item) =>
              item.iconName.toLowerCase().indexOf(this.input) !== -1 &&
              item.iconType === this.baseType
          ) || [];
        return arr;
      };
    },
    isCheckAll() {
      // 是否是全选
      return function() {
        if (this.type) return false;
        const arr = this.groupArr.filter((item) => item.iconType === this.baseType) || [];
        if (!arr.length || !this.selectedArr.length) return false;
        return arr.length === this.selectedArr.length;
      };
    },
    isShow() {
      return function() {
        return definedIconGroupID.includes(this.iconMessage.id);
      };
    }
  },
  watch: {
    baseType: {
      immediate: true,
      deep: true,
      handler(newValue, old) {
        if (newValue !== old) {
          this.fetchIcon(this.iconMessage);
        }
      }
    },
    iconMessage: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue.id) {
          this.fetchIcon(newValue);
        }
      }
    }
  },

  mounted() {},

  methods: {
    async fetchIcon({ id, groupArr }) {
      if (definedIconGroupID.includes(id)) {
        this.selectedArr = [];
        const params = {
          iconClassify: id,
          iconType: this.baseType
        };
        this.loading = true;
        try {
          groupArr = await getIconList(params);
          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      }
      this.groupArr = groupArr;
    },
    handleProgress(event, file, fileList) {
      console.log(event, file, fileList);
    },
    async delImage() {
      if (!this.fileList.length) return;
      if (!this.selectedArr.length) {
        this.$message({
          type: 'error',
          message: this.$t('icon.pleaseUploadFile')
        });
        return;
      }
      try {
        await this.$confirm(this.$t('icon.sureDel'), this.$t('common.tip'), { type: 'warning' });
        this.fileList = this.fileList.filter((item) => !this.selectedArr.includes(item.uid));
        this.selectedArr = [];
      } catch (e) {
        // console.log(e);
      }
    },
    async doUpload(param) {
      const { file } = param;
      await this.beforeUpload(file);
    },
    beforeUpload(file) {
      // 上传校验
      // console.log(file);
      return new Promise((resolve, reject) => {
        const { name, size } = file;
        const nameArr = name.split('.');
        const type = nameArr[nameArr.length - 1];
        const newSize = size / 1025 < 25;
        // console.log(name);
        if (this.accept.indexOf(type.toLowerCase()) === -1) {
          // console.log(1111111111111);
          this.$message({
            type: 'error',
            message: this.$t('icon.notSupportIcon')
          });
          reject(file);
          return;
        }
        if (!newSize) {
          // console.log(2222222);
          this.$message({
            type: 'error',
            message: this.$t('icon.beforeUploading')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    handleChange(response, file) {
      this.fileList.push(file);
    },
    change(file, fileList) {
      console.log(file, fileList);
    },
    limitMessage(files) {
      if (files.length > this.limit) {
        this.$message({
          type: 'error',
          message: this.$t('icon.messageUploadNumber')
        });
      }
      if (this.fileList.length > this.limit) {
        this.$message({
          type: 'error',
          message: this.$t('icon.messageUploadNumber')
        });
      }
    },
    async handleOk() {
      const formData = new FormData();
      if (!this.fileList.length) {
        this.$message({
          type: 'error',
          message: this.$t('icon.pleaseUploadToSave')
        });
        return;
      }
      this.fileList.forEach((item) => {
        formData.append('files', item.raw);
      });
      formData.append('iconClassify', this.iconMessage.id);
      formData.append('iconType', this.baseType);
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          token: Decrypt(localStorage.getItem('token') || '')
        }
      };
      const instance = axios.create({
        withCredentials: true,
        ...config,
        onUploadProgress: (progressEvent) => {
          // 对原生进度事件的处理
          console.log(progressEvent);
        }
      });
      instance
        .post(`${fetch.baseURL}system/icon/batchUpload`, formData, config)
        .then(() => {
          this.fetchIcon(this.iconMessage);
          this.handleCancel();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleClose() {
      this.fileList = [];
      this.type = false;
      this.selectedArr = [];
    },
    handleCancel() {
      this.visible = false;
      this.handleClose();
    },
    selectAll(value) {
      // 全选操作
      if (value) {
        const arr = this.groupArr.filter((item) => item.iconType === this.baseType) || [];
        this.selectedArr = arr.map((item) => item.id) || [];
      } else {
        this.selectedArr = [];
      }
    },
    changeIcon(id, type) {
      // 单选
      const index = this.selectedArr.findIndex((item) => item === id);
      this.type = type;
      // if (this.type) {
      //   this.selectedArr = [];
      // }
      if (index === -1) {
        this.selectedArr.push(id);
      } else {
        this.selectedArr.splice(index, 1);
      }
    },
    async del() {
      if (!this.selectedArr.length) {
        this.$message({ type: 'error', message: this.$t('icon.pleaseUploadFileToDelete') });
        return;
      }
      const ids = this.selectedArr.join(',');
      try {
        await this.$confirm(this.$t('icon.sureDel'), this.$t('common.tip'), { type: 'warning' });
        await batchDeleteIcon({ ids });
        this.selectedArr = [];
        this.fetchIcon(this.iconMessage);
        this.$message({
          type: 'success',
          message: this.$t('icon.deleteSuccess')
        });
      } catch (e) {
        // console.log(e);
      }
    },
    toggle() {
      this.visible = !this.visible;
      this.selectedArr = [];
    }
  },
  name: 'IconContent'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .on {
    color: $--color-primary;
  }

  .searchWrap {
    padding: 5.5px 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
    overflow: hidden;

    .searchWrap_selectAll {
      float: left;
      line-height: 29px;
      ::v-deep {
        .el-checkbox__label {
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
        }
      }
    }

    .searchWrap_btn {
      float: right;
      display: flex;
      height: 30px;
      margin-right: 10px;

      .icon-shanchu {
        color: $--color-primary;
        margin-right: 4px;
        vertical-align: bottom;
      }

      .icon-shangchuan {
        margin-right: 4px;
        vertical-align: bottom;
      }

      ::v-deep {
        .el-icon-plus {
          border: 1px solid;
        }
      }
    }

    .searchWrap__box {
      width: 200px;
      float: right;
      height: 30px;
      line-height: 30px;
      text-align: right;

      ::v-deep {
        .el-input__inner {
          width: 98%;
          height: 30px;
          padding-left: 12px;
          font-size: 13px;
          cursor: pointer;
        }

        .el-input__prefix {
          left: auto;
          right: 15px;
          cursor: pointer;
        }
      }
    }
  }

  .iconWrap {
    width: 100%;
    height: calc(100% - 42px);
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
  }
  //.noData {
  //  width: 100%;
  //  height: calc(100% - 42px);
  //  background: url("../../../assets/img/nodata.svg") center 35% no-repeat;
  //  min-height: 60px;
  //  text-align: center;
  //  display: flex;
  //  justify-content: center;
  //  align-items: center;
  //  .el-table__empty-text{
  //    line-height: 60px;
  //    width: 50%;
  //    color: #909399;
  //  }
  //}
  .uploadWrap {
    width: 100%;
    height: 100%;
    position: relative;

    .uploadWrap__btn {
      width: 100%;
      position: absolute;
      height: 38px;
      top: -4px;

      & > :first-child {
        display: inline-block;
        margin-right: 8px;
      }

      .icon-shanchu {
        color: $--color-primary;
        margin-right: 4px;
        vertical-align: bottom;
      }

      .icon-shangchuan {
        margin-right: 4px;
      }

      ::v-deep {
        .el-upload-list {
          display: none;
        }
      }
    }

    .uploadWrap_nodata {
      width: 100%;
      height: calc(100% - 32px);
      position: absolute;
      top: 32px;
      border: 1px solid #e9e9e9;

      .uploadWrap_box {
        width: 100%;
        height: 100%;
        background: url('../../../assets/img/noDataAndWz.svg') center 70px
          no-repeat;
        background-size: 130px;

        .upload-drag {
          width: 100%;
          height: 100%;

          ::v-deep {
            .el-upload {
              width: 100%;
              height: 100%;
            }

            .el-upload-dragger {
              box-sizing: border-box;
              text-align: center;
              cursor: pointer;
              position: relative;
              overflow: hidden;
              background: none;
              width: 100%;
              height: 100%;
              border: none;

              &.is-dragover {
                background-color: rgba(32, 159, 255, 0.06);
                border: 2px dashed #409eff;
              }
            }

            .el-icon-upload {
              display: none;
            }

            .el-upload__text {
              position: absolute;
              top: 190px;
              width: 100%;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              text-align: center;
            }

            .el-upload__tip {
              position: absolute;
              top: 210px;
              width: 100%;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #808080;
              line-height: 20px;
              text-align: center;
            }
          }
        }
      }

      .uploadWrap_imageBox {
        width: 100%;
        height: 100%;
        padding: 0 5px;
        overflow-y: auto;

        .iconWrap__box {
          float: left;
          margin-top: 10px;
        }
      }
    }
  }

  .iconWrap__box {
    float: left;
    width: 96px;
    height: 106px;
    position: relative;
    margin-left: 5px;
    margin-right: 5px;
    margin-top: 10px;
    text-align: center;
    cursor: pointer;

    &.checked {
      box-shadow: 0px 0px 0px 1px #e9e9e9;
      background: #fafafa;
      transition: all 0.2s ease-in;
      & .checkStyle {
        display: block;
      }
    }

    .checkStyle {
      display: none;
      position: absolute;
      top: 6px;
      right: 6px;
    }
  }

  .iconStyle {
    margin: 22px 29px;
    font-size: 38px;
    color: #bbc3cd;
    border-radius: 4px;
  }
  .imgWrap {
    width: 38px;
    height: 38px;
    display: inline-block;
    margin: 22px 29px;
  }
  .iconSvg {
    margin: 22px 25px 17px 25px;
    color: #bbc3cd;
    border-radius: 4px;
  }

  .iconWrap__name {
    padding: 0 5px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 16px;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
