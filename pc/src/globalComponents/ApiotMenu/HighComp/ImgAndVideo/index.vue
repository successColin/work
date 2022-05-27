<template>
  <div
    class="imgAndVideo"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
  >
    <el-form-item :prop="`${configData.compId}`">
      <span class="span-box" slot="label">
        <span> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>

      <apiot-input
        v-model="parent.form[configData.compId]"
        v-show="false"
      ></apiot-input>
      <el-upload
        drag
        action=""
        :accept="accept"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
        :http-request="doUpload"
        :file-list="fileList"
        :disabled="configData.canReadonly"
        list-type="picture-card"
      >
        <i class="iconfont icon-jiahao"></i>
        <div
          slot="file"
          slot-scope="{ file }"
          class="file"
          @mouseenter="file.showOperate = true"
          @mouseleave="file.showOperate = false"
        >
          <img
            v-if="!isVedio(file.name)"
            v-show="file.url"
            class="file__img"
            :src="file.url"
          />
          <video
            v-else
            v-show="file.url"
            class="file__img"
            :src="file.url"
          ></video>
          <div class="file__progress" v-show="file.percentage !== 100">
            <el-progress
              :percentage="file.percentage"
              :show-text="false"
              color="#FAB71C"
              type="circle"
            ></el-progress>
          </div>
          <div
            class="file__cancleUpload"
            v-show="file.percentage !== 100"
            @click="cancleUpload(file)"
          >
            <i class="iconfont icon-guanbi"></i>
          </div>

          <div
            class="file__operateBox"
            v-show="file.percentage === 100 && file.showOperate"
          >
            <el-tooltip effect="dark" content="预览" placement="top"
              ><i class="iconfont icon-chakan" @click="preview(file)"></i
            ></el-tooltip>
            <el-tooltip effect="dark" content="下载" placement="top">
              <a
                :href="`${file.url}?response-content-type=application/octet-stream`"
                class="file__operateBox--xiazai"
              >
                <i class="iconfont icon-xiazai"></i> </a
            ></el-tooltip>
            <el-tooltip effect="dark" content="删除" placement="top"
              ><i class="iconfont icon-guanbi" @click="delFile(file)"></i
            ></el-tooltip>
          </div>
        </div>
      </el-upload>
      <apiot-dialog
        :visible.sync="dialogVisible"
        class="previewDialog"
        :isShowSure="false"
        cancelBtnName="关闭"
      >
        <img
          width="100%"
          v-if="!isVedio(dialogFile.name)"
          :src="dialogFile.url"
          alt=""
        />
        <video
          v-else
          width="100%"
          :src="dialogFile.url"
          controls="controls"
        ></video>
      </apiot-dialog>
    </el-form-item>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import axios from 'axios';
import { batchUpload, getFileList } from '@/api/menuConfig';
import compMixin from '../../compMixin';

export default {
  props: {
    fileDeleteIds: {
      type: Array
    }
  },
  data() {
    return {
      curCompType: 2,
      fileList: [
        // {
        //   name: '0E004168-6E21-4cd8-8DF4-184B4DA5AD7E.png',
        //   percentage: 100,
        //   response:
        //     'http://v9.mingcloud.top:9000/v10/HelpCenter/0E004168-6E21-4cd8-8DF4-184B4DA5AD7E.png',
        //   size: 1571,
        //   status: 'success',
        //   uid: 1629258101424,
        //   showOperate: false
        // }
      ],
      accept: '.png, .jpg,.jpeg, .gif, .mp4, .avi',
      dialogFile: {},
      dialogVisible: false,
      idsArr: [],
      flag: true, // 控制是否要加载图片
      unwatch: null
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    isVedio() {
      return (name) => {
        if (name) {
          const ext = name.split('.')[1];
          // const imageFile= ['png', 'jpg', 'jpeg', 'gif'],
          const vedio = ['mp4', 'avi'];
          if (vedio.includes(ext)) {
            return true;
          }
        }
        return false;
      };
    }
  },

  mounted() {
    this.unwatch = this.$watch(`parent.form.${this.configData.compId}`, (v) => {
      if (v && this.flag) {
        this.getFileList();
      }
      if (!v) {
        this.fileList = [];
      }
    });
  },

  methods: {
    async getFileList() {
      if (this.parent.form[this.configData.compId]) {
        const data = await getFileList({
          ids: this.parent.form[this.configData.compId]
        });
        data.forEach((item) => {
          item.showOperate = false;
          item.percentage = 100;
        });
        this.fileList = data;
        // console.log(data);
      }
    },

    resolveSize(size) {
      return `${(size / 1024).toFixed(2)}kb`;
    },
    // 上传成功
    uploadSuccess(response, file) {
      // console.log(this.fileList);
      file.url = response[0].url;
      file.id = response[0].id;
      if (file.percentage === 99) {
        file.percentage = 100;
      }
    },
    // 上传之前
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const { size } = file;
        const newSize = size <= this.configData.maxFileSize * 1024 * 1024;

        if (!newSize) {
          this.$message({
            type: 'error',
            message: this.$t('knowledge.size_more')
          });
          reject(file);
          return;
        }
        if (this.fileList.length >= this.configData.maxFileCount) {
          this.$message({
            type: 'error',
            message: '上传文件数量超过最大限制'
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
      const source = axios.CancelToken.source();
      if (this.fileList.length >= this.configData.maxFileCount) {
        this.$message({
          type: 'error',
          message: '上传文件数量超过最大限制'
        });
        return;
      }
      this.fileList.push({
        name: file.name,
        size: file.size,
        percentage: 0,
        uid: file.uid,
        status: '',
        source,
        showOperate: false
      });

      const formData = new FormData();
      formData.append('files', file);
      // eslint-disable-next-line max-len
      const menuId =
        this.showType && this.showType.menuId ? this.showType.menuId : this.$route.params.id;
      formData.append('menuId', menuId);
      const res = await batchUpload(
        formData,
        this.uploadProgress(this.fileList[this.fileList.length - 1]),
        source
      );
      return res;
    },
    // 进度
    uploadProgress(file) {
      return (percentage) => {
        if (percentage === 100) {
          percentage = 99;
        }
        file.percentage = percentage;
      };
    },
    // 取消上传
    cancleUpload(file) {
      file.source.cancel('取消上传');
      this.delFile(file);
    },
    // 删除文件
    delFile(file) {
      const index = this.fileList.findIndex((item) => {
        if (item.id === file.id || item.uid === file.uid) {
          return true;
        }
        return false;
      });
      if (file.percentage === 100) {
        this.fileDeleteIds.push(file.id);
      }
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
    },
    preview(file) {
      // console.log(file);
      this.dialogFile = file;
      this.dialogVisible = true;
    }
  },

  watch: {
    idsArr: {
      handler(v) {
        this.flag = false;
        this.parent.form[this.configData.compId] = v.join();
        this.flag = true;
      },
      deep: true
    },
    fileList: {
      handler(v) {
        this.idsArr = [];
        v.forEach((file) => {
          if (file.id) {
            this.idsArr.push(file.id);
          }
        });
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  }
};
</script>

<style lang='scss' scoped>
.imgAndVideo {
  position: relative;
  box-sizing: border-box;
  padding: 2px 15px 18px 15px;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 15px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .span-box {
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
    }
    .el-upload--picture-card {
      width: 104px;
      height: 104px;
      &:hover {
        .icon-jiahao {
          color: $--color-primary;
        }
      }
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 104px;
      height: 104px;
    }
    .el-upload-dragger {
      height: 100%;
      width: 100%;
      border: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .el-upload-list__item {
      transition: none !important;
    }
  }

  .file {
    position: relative;
    overflow: hidden;
    background: #ffffff;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    &__img {
      width: 100%;
      height: 100%;
    }
    &__cancleUpload {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
    }
    &__progress {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      ::v-deep {
        .el-progress {
          line-height: 0;
          width: 84px;
          height: 84px;
          .el-progress-bar__outer {
            height: 2px !important;
          }
          .el-progress-circle {
            width: 84px !important;
            height: 84px !important;
          }
        }
      }
    }
    &__operateBox {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      .iconfont {
        color: #fff;
        font-size: 16px;
        cursor: pointer;
      }
      &--xiazai {
        text-decoration: none;
        cursor: pointer;
      }
      &--line {
        position: relative;
        &:after {
          content: '';
          position: absolute;
          width: 1px;
          height: 12px;
          background-color: #e9e9e9;
          right: -14px;
        }
      }
    }
  }
  .previewDialog {
    img,
    video {
      width: 100%;
      height: 400px;
    }
  }
  .icon-jiahao {
    font-size: 22px;
    font-weight: normal;
    color: #bbc3cd;
    &:hover {
      color: $--color-primary;
    }
  }
  .notShow {
    visibility: hidden;
  }
}
</style>
