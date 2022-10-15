<template>
  <div
    class="enclosure"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { noBottom: !configData.showLabelTitle },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
    v-loading="loading"
  >
    <el-form-item :prop="`${configData.compId}`">
      <span class="span-box" slot="label" v-if="configData.showLabelTitle">
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
        class="upload"
        :class="[{ isDisabled: !isConfig && configData.canReadonly }]"
        drag
        multiple
        action=""
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
        :http-request="doUpload"
        :file-list="fileList"
        :disabled="configData.canReadonly"
      >
        <div class="el-upload__text">
          <apiot-button
            class="uploadBtn"
            :disabled="configData.singleStatus === 2"
            ><i class="iconfont icon-shangchuan m-r-4"></i
            >{{ configData.placeholder }}</apiot-button
          >
          将文件拖到框内，或点击按钮上传
        </div>
        <div
          slot="file"
          slot-scope="{ file }"
          class="file"
          @mouseenter="mouseenter(file)"
          @mouseleave="mouseleave(file)"
        >
          <img
            class="file__img"
            :class="[
              {
                canPreview: ['imageFile', 'vedio', 'PDF'].includes(
                  getCurIconName(file.name)
                ),
              },
            ]"
            :src="require(`@/assets/img/${getCurIconName(file.name)}.svg`)"
            @click="preview(file)"
          />
          <span
            class="file__name font__ellipsis"
            :class="[
              {
                canPreview: ['imageFile', 'vedio', 'PDF'].includes(
                  getCurIconName(file.name)
                ),
              },
            ]"
            :title="file.name"
            @click="preview(file)"
            >{{ file.name }}</span
          >
          <!-- <span
            class="file__size"
            v-show="file.percentage === 100 && !file.showOperate"
            >{{ resolveSize(file.size) }}</span
          > -->
          <span
            class="file__time"
            v-show="file.percentage === 100 && !file.showOperate"
            >{{ file.uploadTime }}</span
          >
          <div
            class="file__cancleUpload"
            v-show="file.percentage !== 100"
            @click="cancleUpload(file)"
          >
            <i class="iconfont icon-guanbi"></i>
          </div>
          <div class="file__progress" v-show="file.percentage !== 100">
            <el-progress
              :percentage="file.percentage"
              color="#FAB71C"
              :show-text="false"
            ></el-progress>
          </div>
          <div
            class="file__operateBox"
            v-show="file.percentage === 100 && file.showOperate"
          >
            <a
              class="file__operateBox--xiazai file__operateBox--line"
              :class="[{ isDisabled: configData.canReadonly }]"
              @click.stop="download(`${file.url}`, file.name)"
            >
              <i class="iconfont icon-xiazai"></i>
              下载
            </a>
            <i
              class="iconfont icon-guanbi"
              @click="delFile(file)"
              v-if="!configData.canReadonly"
            ></i>
          </div>
        </div>
      </el-upload>
      <image-zoom
        v-if="previewVisible"
        :previewObj="previewObj"
        :picList="picList"
        v-on:hideImgPreview="hideImgPreview"
        :isShowDelBtn="false"
        :isShowShareBtn="false"
      ></image-zoom>
      <apiot-dialog
        width="68%"
        :title="dialogFile.name"
        :visible.sync="videoVisible"
        :isShowSure="false"
        v-on:cancle-click="cancelPreview"
      >
        <video-preview
          :previewObj="previewObj"
          v-if="videoVisible"
        ></video-preview>
      </apiot-dialog>
      <PdfPreview
        :title="dialogFile.name"
        :visible.sync="pdfVisible"
        v-if="pdfVisible"
        :isShowSure="false"
        :previewObj="previewObj"
        :isBigDialog="true"
      ></PdfPreview>
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
import { downloadSingle } from '@/api/knowledge';
import { saveAs } from '@/utils/utils';
import compMixin from '../../compMixin';
import imageZoom from '../../RelatedData/RelateApply/ImageZoom';

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
      idsArr: [],
      flag: true,
      unwatch: null,
      dialogFile: {},
      previewVisible: false,
      videoVisible: false,
      previewObj: {},
      picList: [],
      loading: false,
      pdfVisible: false
    };
  },
  mixins: [compMixin],

  components: { imageZoom },

  computed: {},

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
    async download(url, filename) {
      const data = await downloadSingle({ url });
      saveAs(data, filename);
    },
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
    getCurIconName(name) {
      const ext = name.split('.')[1];
      const obj = {
        XLS: ['xls', 'xlsx'],
        zipFile: ['zip', 'rar'],
        TXT: ['txt'],
        PPT: ['ppt', 'pptx'],
        PDF: ['pdf'],
        DOC: ['doc', 'docx'],
        imageFile: ['png', 'jpg', 'jpeg', 'gif'],
        vedio: ['mp4', 'avi', 'mov'],
        audioFile: ['mp3']
      };
      const res = Object.keys(obj).find((key) => {
        if (obj[key].includes(ext.toLowerCase())) {
          return true;
        }
        return false;
      });
      if (res) {
        return res;
      }
      return 'else';
    },
    resolveSize(size) {
      if (size / 1024 < 100) {
        return `${(size / 1024).toFixed(2)}kb`;
      }
      return `${(size / 1024 / 1024).toFixed(2)}M`;
    },
    // 上传成功
    uploadSuccess(response, file) {
      // console.log(this.fileList);
      file.url = response[0].url;
      file.id = response[0].id;
      file.uploadTime = response[0].uploadTime;
      if (file.percentage === 99) {
        file.percentage = 100;
      }
    },
    // 上传之前
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const { size } = file;
        const newSize = size <= this.configData.maxFileSize * 1024 * 1024;
        // if (!type) {
        //   this.$message({
        //     type: 'warning',
        //     message: '不支持该类型附件上传'
        //   });
        //   reject(file);
        //   return;
        // }

        if (!newSize) {
          this.$message({
            type: 'warning',
            message: this.$t('knowledge.size_more')
          });
          reject(file);
          return;
        }
        if (this.fileList.length >= this.configData.maxFileCount) {
          this.$message({
            type: 'warning',
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
          type: 'warning',
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
    // 删除文件 有id才是真删除 不然是取消上传
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
    mouseenter(file) {
      this.timer = setTimeout(() => {
        file.showOperate = true;
      }, 200);
    },
    mouseleave(file) {
      clearTimeout(this.timer);
      file.showOperate = false;
    },
    async preview(file) {
      // console.log(file);
      this.dialogFile = file;
      // this.dialogVisible = true;
      if (this.getCurIconName(file.name) === 'imageFile') {
        this.previewObj.sysKlTree = this.dialogFile;
        this.picList = [];
        this.fileList.forEach((liObj) => {
          if (this.getCurIconName(liObj.name) === 'imageFile') {
            this.picList.push({
              sysKlTree: liObj
            });
          }
        });
        if (this.$store.state.globalConfig.waterConfig.enableWaterMask === '1') {
          const index = this.picList.findIndex((item) => item.sysKlTree.id === file.id);
          if (index !== -1) {
            this.loading = true;
            const data = await downloadSingle({ url: this.picList[index].sysKlTree.url });
            this.loading = false;
            this.picList[index].sysKlTree.blob = data;
          }
        }
        this.previewVisible = true;
      }
      if (this.getCurIconName(file.name) === 'vedio') {
        this.previewObj.sysKlTree = this.dialogFile;
        this.videoVisible = true;
      }
      if (this.getCurIconName(file.name) === 'PDF') {
        this.previewObj.sysKlTree = this.dialogFile;
        console.log(this.previewObj);
        this.pdfVisible = true;
      }
    },
    hideImgPreview() {
      // 关闭预览
      this.previewVisible = false;
    },
    cancelPreview() {
      this.previewObj = {};
    }
  },
  watch: {
    idsArr: {
      handler(v) {
        this.flag = false;
        // this.parent.form[this.configData.compId] = v.join();
        this.$set(this.parent.form, this.configData.compId, v.join());
        this.$nextTick(() => {
          this.flag = true;
        });
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
.enclosure {
  position: relative;
  box-sizing: border-box;
  padding: 2px 15px 18px 15px;
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 35px;
    &.noBottom {
      padding-bottom: 0;
      min-height: 58px;
    }
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
    .el-upload {
      width: 100%;
      .el-upload-dragger {
        width: 100%;
        height: 36px;
        background: #fafafa;
        border-radius: 4px;
        .el-upload__text {
          display: flex;
          align-items: center;
          height: 100%;
          padding-left: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #aaaaaa;
          .uploadBtn {
            height: 26px;
            line-height: 26px;
            margin-right: 10px;
          }
          .icon-shangchuan {
            color: $--color-primary;
          }
        }
      }
    }
    .el-upload__tip {
      line-height: 1;
      margin-top: 0;
    }
    .el-upload-list__item {
      transition: none !important;
    }
    .isDisabled {
      .el-upload--text {
        display: none;
      }
    }
  }
  .upload {
    line-height: 0;
    .file {
      display: flex;
      position: relative;
      align-items: center;
      height: 36px;
      overflow: hidden;
      background: #ffffff;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;
      padding-left: 10px;
      padding-right: 10px;
      .canPreview {
        cursor: pointer;
      }
      &__img {
        width: 24px;
        margin-right: 4px;
      }
      &__name {
        flex: 1;
        width: 134px;
        color: #333333;
      }
      &__size {
        margin-left: auto;
        margin-right: 10px;
        color: #808080;
      }
      &__time {
        margin-left: auto;
        color: #808080;
      }
      &__cancleUpload {
        position: absolute;
        right: 10px;
        cursor: pointer;
        &:hover {
          color: $--color-primary;
        }
      }
      &__progress {
        position: absolute;
        left: 38px;
        right: 42px;
        bottom: 8px;
        height: 2px;
        ::v-deep {
          .el-progress {
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            line-height: 0;
            .el-progress-bar__outer {
              height: 2px !important;
            }
          }
        }
      }
      &__operateBox {
        position: absolute;
        right: 10px;
        &--xiazai {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-weight: 400;
          color: #333333;
          font-size: 13px;
          cursor: pointer;
          margin-right: 28px;
          &.isDisabled {
            margin-right: 0;
            &:after {
              content: '';
              width: 0;
              height: 0;
            }
          }
          .iconfont {
            font-weight: normal;
            color: #bbc3cd;
            font-size: 16px;
          }
          &:hover {
            color: $--color-primary;
            .iconfont {
              color: $--color-primary;
            }
          }
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
        .icon-guanbi {
          color: #bbc3cd;
          cursor: pointer;
          font-size: 16px;
          &:hover {
            color: $--color-primary;
          }
        }
      }
    }
  }
}
</style>
