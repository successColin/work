<template>
  <el-upload
    class="upload"
    :class="[{ isImg: uploadType === 2 }]"
    drag
    action=""
    :accept="fileAccept"
    :on-success="uploadSuccess"
    :before-upload="beforeUpload"
    :http-request="doUpload"
  >
    <div class="el-upload__text" v-if="uploadType === 1">
      <apiot-button class="uploadBtn"
        ><i class="iconfont icon-shangchuan m-r-4"></i>上传</apiot-button
      >
      <apiot-input
        class="uploadInput"
        readonly
        v-model="curUrl"
        :title="curUrl"
      ></apiot-input>
    </div>
    <div class="el-upload__img" v-if="uploadType === 2">
      <img :src="curUrl" alt="" v-if="curUrl" />
      <i class="iconfont icon-jiahao" v-else></i>
    </div>
  </el-upload>
</template>

<script>
import { upload } from '@/api/appConfig';

export default {
  props: {
    // 地址
    fileUrl: {
      type: String,
      default: ''
    },
    // 接受类型
    fileAccept: {
      type: String
    },
    // 大小限制
    fileLimit: {
      type: Number,
      default: 3
    },
    uploadType: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      curUrl: ''
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.curUrl = this.fileUrl;
  },

  methods: {
    // 上传成功
    uploadSuccess(response) {
      // console.log(response);
      if (response) {
        this.curUrl = response;
        this.$emit('update:fileUrl', response);
      }
    },
    // 上传之前
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const { size, type } = file;
        const newSize = size <= this.fileLimit * 1024 * 1024;
        if (!type) {
          this.$message({
            type: 'error',
            message: '不支持该类型附件上传'
          });
          reject(file);
          return;
        }

        if (!newSize) {
          this.$message({
            type: 'error',
            message: this.$t('knowledge.size_more')
          });
          reject(file);
          return;
        }
        resolve(file);
      });
    },
    // 自定义上传
    async doUpload(param) {
      const { file } = param;

      const formData = new FormData();
      formData.append('file', file);
      const res = await upload(formData);
      return res;
    }
  }
};
</script>

<style lang='scss' scoped>
.el-upload__text {
  width: 100%;
  display: flex;
  align-items: center;
  .uploadBtn {
    margin-right: 10px;
    .icon-shangchuan {
      color: $--color-primary;
    }
  }
  .uploadInput {
    flex: 1;
    ::v-deep {
      .el-input__inner {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
.el-upload__img {
  width: 100%;
  height: 90px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
  }
  .iconfont {
    font-size: 16px;
    color: #bbc3cd;
    &:hover {
      color: $--color-primary;
    }
  }
}

::v-deep {
  .el-upload {
    width: 100%;
  }
  .el-upload-dragger {
    width: 100%;
    border-width: 0;
    height: 32px;
  }
  .el-upload-list {
    display: none;
  }
}
.isImg {
  ::v-deep {
    .el-upload-dragger {
      width: 100%;
      height: auto;
      border-width: 1px;
    }
  }
}
</style>
