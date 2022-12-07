/**
* @name: index
* @author: DELL
* @date: 2021/8/20 9:13
* @description：index
* @update: 2021/8/20 9:13
*/
<!-- 页面 -->
<template>
  <div class="uploadGather">
    <div class="cUploadWrap" v-if="!isPublic">
      <div class="uploadImage" v-if="url">
        <el-image :src="url"></el-image>
        <div class="fileModal">
          <span class="icon-shanchu1 iconfont" @click="handleRemove"></span>
        </div>
      </div>
      <div class="uploadWrap" v-if="!url">
        <el-upload
            v-on="$listeners"
            v-bind="$attrs"
            :class="{'hide': fileList.length === 1}"
            action=""
            ref="upload"
            :multiple="false"
            list-type="picture-card"
            :on-error="error"
            :http-request="doUpload"
            :accept="accept"
        >
          <i slot="default" class="el-icon-plus"></i>
          <slot name="tip"></slot>
          <div slot="file" slot-scope="{file}">
            <img
                class="el-upload-list__item-thumbnail"
                :src="file.url" alt=""
            >
            <span class="el-upload-list__item-actions">
<!--        <span-->
              <!--            class="el-upload-list__item-preview"-->
              <!--            @click="handlePictureCardPreview(file)"-->
              <!--        >-->
              <!--          <i class="el-icon-zoom-in"></i>-->
              <!--        </span>-->
              <!--        <span-->
              <!--            v-if="!disabled"-->
              <!--            class="el-upload-list__item-delete"-->
              <!--            @click="handleDownload(file)"-->
              <!--        >-->
              <!--          <i class="el-icon-download"></i>-->
              <!--        </span>-->
        <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
          </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
    </div>
    <div class="cUploadByBtn" v-if="isPublic">
      <el-upload
          v-on="$listeners"
          v-bind="$attrs"
          :class="{'hide': fileList.length === 1}"
          action=""
          ref="upload"
          :multiple="false"
          list-type="picture-card"
          :on-error="error"
          :http-request="doUpload"
          :accept="accept"
      >
        <c-button class="headerWrap__back">
          <span class="icon-shangchuan iconfont"></span> 点击选择文件
        </c-button>
        <slot name="tip"></slot>
      </el-upload>
      <div class="urlWrap" v-if="url" :title="url">
        {{ url }}
        <span class="icon-guanbi iconfont" @click="handleRemove"></span>
      </div>
    </div>
  </div>

</template>

<script>
import {uploadFile} from '@/services/design';

export default {
  inheritAttrs: false,
  props: {
    url: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: '.jpg,.png,.jpeg'
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: []
    };
  },

  components: {},

  computed: {},

  mounted() {
  },
  methods: {
    error() {
    },
    handleRemove() {
      this.fileList = [];
      this.$emit('changeScreenBg', '')
      this.$nextTick(() => {
        document.querySelector('.el-upload-list').innerHTML = '';
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async doUpload(param) {
      const {file} = param;
      this.fileList = [file];
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadFile(formData);
      // const imageUrl = URL.createObjectURL(file);
      // console.log(imageUrl)
      this.$emit('changeScreenBg', res)
      // this.beforeAvatarUpload(file)
    },
    clear() {
      this.fileList = [];
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.uploadGather {
  width: 100%;

  .cUploadWrap {
    width: 100%;

    .uploadImage {
      width: 100%;
      position: relative;

      &:hover .fileModal {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100% - 10px);
        top: 0;
        border-radius: 4px;
        background-color: rgba(0, 0, 0, .2);
        z-index: 1;
        transition: all 1s ease-in;

        & > .iconfont {
          font-size: 23px;
          color: #FFFFFF;
          cursor: pointer;
        }
      }

      .fileModal {
        display: none;
      }
    }

    .uploadWrap {
      ::v-deep {
        .el-upload--picture-card {
          width: 100%;
          height: 90px;
          line-height: 90px;
          background-color: $component-background-color;
          border: 1px dashed $component-border-color;
          border-radius: 0;

          &:hover {
            border-color: $component-borderFocus-color
          }
        }

        .el-upload--picture-card i {
          color: #ffffff;
        }

        .el-upload__tip {
          height: 17px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 17px;
          opacity: .7;
        }
      }

      .hide {
        ::v-deep {
          .el-upload--picture-card {
            display: none;
          }
        }
      }
    }
  }

  .cUploadByBtn {
    ::v-deep {
      .el-upload--picture-card {
        width: 100%;
        height: 52px;
        background: none;
        border: none;

        .el-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .headerWrap__back {
        color: #FFFFFF;

        &:hover {
          .icon-shangchuan {
            color: #4689F5;
            opacity: 1;
          }

          color: #4689F5;
        }
      }

      .el-upload-list {
        display: none !important;
      }

      .el-upload__tip {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        line-height: 17px;
        text-align: left;
      }
    }

    .urlWrap {
      position: relative;
      margin-top: 10px;
      width: 100%;
      height: 32px;
      padding: 6px 54px 6px 12px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border: 1px solid $component-border-color;
      box-sizing: border-box;

      .icon-guanbi {
        position: absolute;
        right: 11px;
        cursor: pointer;

        &:hover {
          color: $component-borderFocus-color;
        }
      }
    }
  }
}

</style>
