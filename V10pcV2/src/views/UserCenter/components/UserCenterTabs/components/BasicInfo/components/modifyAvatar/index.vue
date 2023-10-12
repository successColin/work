<!--
 * @Author: tjf
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-07-20 19:32:06
 * @Des: 个人中心-修改头像
-->
<template>
  <section class="avatar-dialog">
    <el-dialog
      v-on="$listeners"
      v-bind="$attrs"
      close-on-click-modal
      :title="$t('common.modify') + $t('userCenter.avatar')"
      class="curMask"
      :visible="visible"
      v-loading="uploading"
      :modal-append-to-body="false"
    >
      <div class="avatar">
        <div class="avatar__content">
          <ImgCutter
            ref="imgCutterModal"
            :boxWidth="600"
            :boxHeight="344"
            v-if="visible"
            :tool="false"
            rate="1:1"
            :canImgScale="false"
            :previewMode="false"
            :originalGraph="true"
            :DoNotDisplayCopyright="true"
            @cutDown="cutDown"
            :isModal="false"
          ></ImgCutter>
        </div>
      </div>
    </el-dialog>
  </section>
</template>

<script>
import axios from 'axios';
import { Decrypt } from '@/utils/utils';
import ImgCutter from './ImgCutter/ImgCutter';
// import myUpload from 'vue-image-crop-upload/upload-1.vue';

export default {
  props: {
    userInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      isEditName: false,
      isEditSign: false,
      loading: true,
      uploading: false
    };
  },

  components: {
    ImgCutter
    // myUpload
  },

  computed: {},

  mounted() {},

  watch: {},

  methods: {
    async cutDown(item) {
      // console.log(item);
      if (item.file.size > 10240 * 1024) {
        return this.$message.success(this.$t('userCenter.avatarUploadTips'));
      }
      this.uploading = true;
      const param = new FormData();
      param.append('file', item.file, item.file.name);
      axios({
        method: 'post',
        url: '/api/v1/system/personalCenter/modifyAvatar',
        data: param,
        headers: {
          'content-type': 'multipart/form-data',
          token: Decrypt(localStorage.getItem('token') || '')
        }
      }).then(
        (data) => {
          // console.log(data);
          if (data.data.code === '00000') {
            this.$message.success(this.$t('common.successfullyModified'));
            this.$emit('update:visible', false);
            this.$emit('getUserCenterInfo');
          }
          this.uploading = false;
        },
        () => {
          this.uploading = false;
        }
      );
    },
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl) {
      // console.log('-------- crop success --------');
      this.imgDataUrl = imgDataUrl;
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    // cropUploadSuccess(jsonData, field) {
    //   // console.log('-------- upload success --------');
    //   // console.log(jsonData);
    //   // console.log(field);
    // },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    // cropUploadFail(status, field) {
    //   // console.log('-------- upload fail --------');
    //   // console.log(status);
    //   // console.log(field);
    // },
    forIe9(e) {
      // 传入name，src name中必须包含后缀名
      this.$nextTick(() => {
        this.$refs.imgCutterModal.putImgToCanv(e);
        this.$parent.clearUploadValue();
      });
    }
  }
};
</script>

<style lang='scss' scoped>
.avatar-dialog {
  width: 100%;
  overflow: hidden;
  font-size: 13px;
  .avatar {
    &__content {
      width: 100%;
      padding-top: 16px;
      color: #333333;
      box-sizing: border-box;
    }
    &__footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1;
      height: 56px;
      box-sizing: border-box;
      border-top: 1px solid #e9e9e9;
      padding: 11px 30px 0 0;
      text-align: right;
    }
  }
  .whole-line {
    width: 100%;
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 20px;
      position: relative;
    }
  }
}
::v-deep {
  .v-modal {
    background: rgba(0, 0, 0, 0.3);
  }
  .el-dialog {
    width: 640px;
    height: 460px;
    border-radius: 8px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    height: 54px;
    padding: 16px 20px;
  }

  .el-dialog__title {
    vertical-align: top;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .el-dialog__body {
    height: 486px;
    box-sizing: border-box;
    padding: 4px 20px 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    padding: 16px 20px 17px;
  }

  .el-dialog__headerbtn {
    top: 18px;
  }
}
</style>
