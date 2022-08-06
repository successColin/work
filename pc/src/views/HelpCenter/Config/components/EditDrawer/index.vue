<!--
 * @Descripttion: 点击编辑抽屉内容
 * @Author: ytx
 * @Date: 2021-06-29 18:02:05
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-29 18:02:05
-->
<template>
  <div class="drawer">
    <apiot-drawer
      v-on="$listeners"
      v-bind="$attrs"
      :loading.sync="showLoading"
      @sure-click="sureClick"
      @close="handleClose"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="drawer__ruleForm"
        v-if="isShow"
      >
        <!-- 输入框 -->
        <div style="display: flex">
          <el-form-item
            v-if="parentId === 4"
            class="drawer__special"
            prop="logUpdateTime"
            style="flex: 1"
          >
            <el-date-picker
              class="drawer__special--time"
              v-model="ruleForm.logUpdateTime"
              type="datetime"
              prefix-icon="el-icon-date"
              :placeholder="pickerPlaceholder"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
            <div class="drawer__empty"></div>
          </el-form-item>
          <el-form-item prop="inputValue" style="flex: 1">
            <apiot-input
              :placeholder="placeholder"
              v-model="ruleForm.inputValue"
            ></apiot-input>
          </el-form-item>
        </div>
        <!-- 富文本 -->
        <el-form-item v-if="parentId !== 2">
          <div class="drawer__title">{{ drawerTitle }}</div>
          <apiot-wangeditor
            ref="wangeditor"
            class="helpCenterShow"
            :value="ruleForm.htmlContent"
            @change="handleWangeditorChange"
          >
          </apiot-wangeditor>
        </el-form-item>
        <!-- 视频上传 -->
        <el-form-item v-else>
          <div class="drawer__title">{{ $t('helpCenter.videoCover') }}</div>
          <!-- 视频封面 -->
          <section class="drawer__uploadImg">
            <el-upload
              class="drawer__avatar"
              action="#"
              list-type="picture-card"
              :before-upload="beforeUploadImg"
              :http-request="httpRequestImg"
              :file-list="imgArr"
            >
              <div class="drawer__avatar--default">
                <i class="el-icon-plus"></i>
                <div>{{ $t('helpCenter.uploadImage') }}</div>
              </div>
              <div slot="file" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleDownloadImg(file)"
                  >
                    <i class="iconfont icon-xiazai"></i>
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click="handleRemoveImg(file)"
                  >
                    <i class="iconfont icon-shanchu"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <div class="tips">
              {{
                $t('helpCenter.warmPrompt', {
                  name: $t('helpCenter.uploadImagesWithinWithResolution'),
                })
              }}
              <!-- 温馨提示：建议上传2MB以内，分辨率500px*310px的图片！ -->
            </div>
          </section>
          <div class="drawer__title">{{ $t('helpCenter.uploadVideo') }}</div>
          <!-- 上传视频 -->
          <section class="drawer__uploadVideo">
            <el-upload
              drag
              action=""
              :before-upload="beforeUploadVideo"
              :http-request="httpRequestVideo"
              :show-file-list="false"
            >
              <div v-show="!isShowVideo">
                <i
                  class="
                    iconfont
                    icon-shangchuanshipin
                    drawer__uploadVideo--icon
                  "
                ></i>
                <div class="drawer__uploadVideo--font1">
                  {{ $t('helpCenter.clickBlankUploadOrDragUpload') }}
                </div>
                <div class="drawer__uploadVideo--font2">
                  {{ $t('helpCenter.VideoSizeIsLessThanSupportFormat') }}
                </div>
                <el-progress
                  class="m-t-10"
                  v-show="videoFlag"
                  :percentage="percentage"
                  color="#409eff"
                ></el-progress>
              </div>
            </el-upload>
            <div class="drawer__uploadVideo--content" v-if="isShowVideo">
              <transition name="move-right">
                <my-video
                  class="drawer__uploadVideo--player"
                  ref="myVideo"
                  :options="playerOptions"
                  :playsinline="true"
                  v-if="isShowVideo"
                ></my-video>
              </transition>
              <div class="drawer__iconButton">
                <i
                  class="iconfont icon-xiazai"
                  @click="handleDownloadVideo"
                ></i>
                <div class="drawer__iconButton--empty"></div>
                <i class="iconfont icon-shanchu" @click="handleRemoveVideo"></i>
              </div>
            </div>
          </section>
        </el-form-item>
      </el-form>
    </apiot-drawer>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="imageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import {
  postDeleteHelpFile,
  postInsertDetail,
  postModifyDetail,
  postUploadHelp
} from '@/api/helpCenter';
import MyVideo from '@/views/HelpCenter/component/MyVideo';
// import { postFileUpload } from '@/api/common';
import { PREFIX, VERSION } from '@/config';

export default {
  props: {
    // 占位符
    placeholder: {
      type: String,
      default: ''
    },
    // 正文标题
    drawerTitle: {
      type: String,
      default: ''
    },
    // 一级菜单: 1：帮助文档 2：视频教程、3：常见问题 4、更新日志
    parentId: {
      type: Number,
      default: 1
    },
    // 二级菜单
    parentSid: {
      type: [String, Number],
      default: ''
    },
    // 当前表格对象
    currentTableObj: {
      type: Object,
      default: () => {}
    },
    // 判断是否纯在
    isShow: {
      type: Boolean,
      default: false
    },
    // 新增：true；编辑：fasle
    isAddDrawerState: {
      type: Boolean,
      default: true
    },
    // 获取重新拉去数据
    getTableList: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // 图片是否放大
      dialogVisible: false,
      // 是否显示loading
      showLoading: false,
      // 图片路径
      imgArr: [],
      // 上次图片格式
      acceptImg: 'jpeg,png,jpg',
      // 视频路径
      isShowVideo: false,
      videoObj: {
        videoUrl: '',
        // 表单数据
        acceptVideo: 'avi,mov,rmvb,rm,flv,mp4,3gp',
        videoSize: '',
        videoType: ''
      },
      // 视频格式
      ruleForm: {
        // 输入框标题
        inputValue: '',
        // 正文部分
        htmlContent: '',
        logUpdateTime: ''
      },
      // 是否显示进度条
      videoFlag: false,
      percentage: 0,
      // 默认情况下，显示所有菜单
      menus: [
        'head',
        'bold',
        'fontSize',
        // 'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        // 'todo',
        'justify',
        'quote',
        // 'emoticon',
        'image',
        'video',
        'table',
        // 'code',
        'splitLine',
        'undo',
        'redo'
      ],
      playerOptions: {
        width: 300,
        height: 300,
        autoplay: false,
        loop: false, // 使视频一结束就重新开始。
        muted: true, // 默认情况下将静音任何音频。
        language: 'zh-CN',
        notSupportedMessage: this.$t('helpCenter.videoTemporarilyUnavailable'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        flash: { hls: { withCredentials: false } }, // 可以使用rtmp视频
        html5: { hls: { withCredentials: false } }, // 可以使用m3u8视频
        playbackRates: [0.5, 1, 1.5, 2],
        noUITitleAttributes: true
      },
      timeStart: null,

      imgsrc: [],
      initImg: [],
      deleteNameArr: []
    };
  },
  computed: {
    pickerPlaceholder() {
      return this.$t('placeholder.pleaseEnterAny', { any: this.$t('helpCenter.updateLogTime') });
    },
    rules() {
      return {
        inputValue: [{ required: true, message: this.placeholder, trigger: 'change' }],
        logUpdateTime: [{ required: true, message: this.pickerPlaceholder, trigger: 'change' }]
      };
    },
    imageUrl() {
      return this.imgArr[0] && this.imgArr[0].url;
    },
    uploadDisabled() {
      return this.imgArr.length > 0;
    }
  },
  components: {
    MyVideo
  },
  watch: {
    // 赋值
    currentTableObj(v) {
      console.log(v);
      this.ruleForm.inputValue = v.name;
      this.ruleForm.htmlContent = v.html;

      this.$nextTick(() => {
        // this.initImg =
        //   (this.ruleForm.htmlContent && this.$refs.wangeditor
        // .getSrc(this.ruleForm.htmlContent)) ||
        //   [];
      });

      this.ruleForm.logUpdateTime = v.logUpdateTime;
      if (JSON.stringify(v) !== '{}') {
        if (v.imageUrl) {
          this.imgArr = [{ url: v.imageUrl }];
        }
        // 视频
        if (v.url) {
          this.videoObj.videoUrl = v.url;
          this.videoObj.videoSize = v.videoSize;
          this.videoObj.videoType = v.videoType;

          this.isShowVideo = true;
          this.playerOptions.sources = [
            {
              type: v.videoType,
              src: v.url
            }
          ];
        }
      } else {
        if (this.parentId === 2) {
          // 删除图片和视频，需要重新拉去数据
          this.getTableList();
        }
        this.imgArr = [];
        this.isShowVideo = false;
        this.percentage = 0;
        this.videoObj.videoUrl = '';
        this.videoObj.videoSize = '';
        this.videoObj.videoType = '';
        this.playerOptions.sources = [
          {
            type: '',
            src: ''
          }
        ];
      }
    },
    videoObj: {
      deep: true,
      handler(v) {
        if (v.videoUrl) {
          this.isShowVideo = false;
          if (v) {
            this.$nextTick(() => {
              this.isShowVideo = true;
            });
          }
        } else {
          this.isShowVideo = false;
        }
      }
    }
  },
  mounted() {},
  methods: {
    handleClose() {
      this.deleteNameArr = [];
    },
    handleWangeditorChange() {
      // obj
      // 查图片
      // const nowimgs = (obj.content && this.$refs.wangeditor.getSrc(obj.content)) || [];
      // const listArr = [];
      // this.initImg.forEach(async (item) => {
      //   const istrue = nowimgs.find((val) => item === val);
      //   if (!istrue) {
      //     const arr = item.split('/');
      //     const filename = arr[arr.length - 1];
      //     listArr.push(filename);
      //     this.deleteNameArr = listArr;
      //   }
      // });
    },
    // 图片下载
    async handleDownloadImg(file) {
      const obj = this.getFilenameFun(file.url);
      const { filename, type } = obj;
      // 创建a标签
      const link = document.createElement('a');
      // download属性
      link.setAttribute('download', `${this.$t('helpCenter.videoCover')}.${type}`);
      // // href链接
      link.setAttribute(
        'href',
        `${PREFIX}/${VERSION}/system/helpCenterEdit/downHelp?filename=${filename}&localfilename=${this.$t(
          'helpCenter.videoCover'
        )}.${type}`
      );
      link.click();
    },
    // 放大图片
    handlePictureCardPreview(file) {
      this.imgArr = [{ ...file }];
      this.dialogVisible = true;
    },
    // 删除图片
    async handleRemoveImg(file) {
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('helpCenter.image') }),
        this.$t('common.delete', { name: this.$t('helpCenter.image') }),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        const arr = file.url.split('/');
        const filename = arr[arr.length - 1];
        await postDeleteHelpFile({ filename });
        this.imgArr = [];
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.sureClick(false);
      });
    },
    // 下载视频
    async handleDownloadVideo() {
      const { src } = this.playerOptions.sources[0];
      const obj = this.getFilenameFun(src);
      const { filename, type } = obj;
      // 创建a标签
      const link = document.createElement('a');
      // download属性
      link.setAttribute('download', `${this.$t('helpCenter.videoFile')}.${type}`);
      // // href链接
      link.setAttribute(
        'href',
        `${PREFIX}/${VERSION}/system/helpCenterEdit/downHelp?filename=${filename}&localfilename=${this.$t(
          'helpCenter.videoFile'
        )}.${type}`
      );
      link.click();
    },
    // 自定义上传图片
    async httpRequestImg(v) {
      const { file } = v;
      const formData = new FormData();
      formData.append('file', file);
      const res = await postUploadHelp(formData);
      file.url = res;
      this.imgArr.push(file);
    },
    // 上传图片--上传文件之前的钩子
    beforeUploadImg(file) {
      const { type, size } = file;
      const isLt2M = size / 1024 / 1024 < 2;
      const imgType = type.split('/')[1];
      if (!isLt2M) {
        this.$message({
          type: 'warning',
          message: this.$t('helpCenter.uploadaAvatarPictureSizeMustNotExceed')
        });
        return false;
      }
      if (this.acceptImg.indexOf(imgType) === -1) {
        this.$message({
          type: 'warning',
          message: this.$t('helpCenter.PleaseUploadJPEGPNGJPGFormat')
        });
        return false;
      }
      if (this.imgArr.length !== 0) {
        this.$message({
          type: 'warning',
          message: this.$t('helpCenter.onlyOneImageCanBeUploadedForTheVideoCover')
        });
        return false;
      }
      return true;
    },
    // 删除视频
    async handleRemoveVideo() {
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('helpCenter.video') }),
        this.$t('helpCenter.deleteVideo'),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        const { src } = this.playerOptions.sources[0];
        const filename = this.getFilenameFun(src);
        await postDeleteHelpFile({ filename });
        this.videoObj.videoUrl = '';
        this.videoObj.videoSize = '';
        this.videoObj.videoType = '';
        this.percentage = 0;
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.sureClick(false);
      });
    },
    // 自定义上传视频
    async httpRequestVideo(v) {
      const { file } = v;
      const formData = new FormData();
      formData.append('file', file);
      this.videoFlag = true;

      // this.loadingtuo = this.$loading({
      //   lock: true,
      //   text: '请稍等....',
      //   target: document.querySelector('.drts') // 设置加载动画区域
      // });
      const res = await postUploadHelp(formData, this.getPercentage);
      clearInterval(this.timeStart);
      this.percentage = 100;
      this.videoFlag = false;
      // this.loadingtuo.close();

      this.videoObj.videoUrl = res;
      this.playerOptions.sources = [
        {
          type: file.type,
          src: res
        }
      ];
      const videoSize = `${(file.size / 1024 / 1024).toFixed(2)}MB`;
      this.videoObj.videoSize = videoSize;
      this.videoObj.videoType = file.type;
    },
    getPercentage(v) {
      const num = v * 0.3;
      this.percentage = Math.floor(num);
      if (num === 30) {
        this.timeStart = setInterval(() => {
          if (this.percentage >= 30) {
            this.percentage += 1;
          }
          if (this.percentage > 99) {
            this.percentage = 99;
          }
        }, 500);
      }
    },
    // 上传视频前动作
    beforeUploadVideo(file) {
      const isLt500M = file.size / 1024 / 1024 < 500;
      const { type } = file;
      const videoType = type.split('/')[1];
      if (this.videoObj.acceptVideo.indexOf(videoType) === -1) {
        this.$message.error(this.$t('helpCenter.uploadVideoOnlyFormat'));
        return false;
      }
      if (!isLt500M) {
        this.$message.error(this.$t('helpCenter.uploadVideoSizeCannotExceed'));
        return false;
      }
      return true;
    },
    // 确定
    sureClick(isSure = true) {
      this.$refs.ruleForm.validate(async (valid) => {
        this.showLoading = true;
        if (valid) {
          this.deleteNameArr.forEach(async (item) => {
            await postDeleteHelpFile({ item });
          });
          // 1：帮助文档 2：视频教程、3：常见问题 4、更新日志
          let param = {};
          const detailId = (this.currentTableObj && this.currentTableObj.id) || '';
          if (this.parentId === 1 || this.parentId === 3 || this.parentId === 4) {
            const htmlObj = this.$refs.wangeditor.getHtmlObj();
            // 详情 id
            param = {
              parentId: this.parentId, // 一级父节点ID (帮助文档-1 视频教程-2 常见问题-3 更新日志-4)
              detailId, // 三级节点ID
              html: htmlObj.html, // html
              name: this.ruleForm.inputValue, // 模块名称
              txt: htmlObj.text // txt
            };
            if (this.parentId === 4) {
              param.logUpdateTime = this.ruleForm.logUpdateTime;
            } else {
              param.parentSid = this.parentSid;
            }
          } else if (this.parentId === 2) {
            param = {
              parentId: this.parentId, // 一级父节点ID (帮助文档-1 视频教程-2 常见问题-3 更新日志-4)
              detailId, // 三级节点ID
              name: this.ruleForm.inputValue, // 模块名称
              parentSid: this.parentSid, // 二级父节点ID
              videoUrl: this.videoObj.videoUrl,
              imageUrl: this.imageUrl,
              videoSize: this.videoObj.videoSize,
              videoType: this.videoObj.videoType
            };
          }
          try {
            // 后台接口调整，代码逻辑如下：
            if (this.isAddDrawerState) {
              await postInsertDetail(param);
            } else {
              await postModifyDetail(param);
            }
            if (isSure) {
              this.getTableList();
              this.$emit('update:visible', false);
              this.$message({
                type: 'success',
                message: this.isAddDrawerState
                  ? this.$t('common.newSuccess')
                  : this.$t('common.successfullyModified')
              });
            }
            this.showLoading = false;
          } catch (err) {
            this.showLoading = false;
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 获取名称
    getFilenameFun(url) {
      const arr = url.split('/');
      const filename = arr[arr.length - 1];
      const type = filename.split('.')[filename.split('.').length - 1];
      return {
        filename,
        type
      };
    }
  }
};
</script>
<style lang='scss' scoped>
// @import './wangEditor.scss';
$--avataruploaderlength: 104px;
$--videoHeight: 340px;
.drawer {
  &__ruleForm {
    margin: 30px 37px 0;
  }
  &__special {
    .drawer__empty {
      width: 32px;
    }
    &--time {
      ::v-deep {
        .el-input__inner {
          padding-left: 30px !important;
        }
        .el-input__icon {
          height: 46px;
          line-height: 46px;
          font-size: 16px;
        }
      }
    }
    ::v-deep {
      .el-form-item__content {
        display: flex;
      }
    }
  }
  &__title {
    margin: 15px 0 6px;
  }
  &__uploadImg {
    // display: flex;
    .tips {
      display: inline-block;
      font-size: 13px;
      color: #aaaaaa;
      margin-left: 14px;
      position: relative;
      bottom: 5px;
    }
    .drawer__avatar {
      .el-upload-list__item-actions {
        i {
          line-height: 1;
          vertical-align: baseline;
          display: inline-block;
          font-size: 18px;
        }
      }
    }
  }
  &__avatar {
    width: 105px;
    height: 105px;
    overflow: hidden;
    display: inline-block;
    &--default {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      height: 104px;
      i {
        color: #bbc3cd;
        font-size: 17px;
      }
      div {
        line-height: 32px;
        font-size: 12px;
        color: #aaaaaa;
      }
    }
  }
  &__uploadVideo {
    position: relative;
    &--content {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      .drawer__iconButton {
        width: 69px;
        height: 24px;
        background: #ffffff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        position: absolute;
        right: 20px;
        top: 20px;
        display: flex;
        align-items: center;
        i {
          width: 50%;
          height: 100%;
          line-height: 24px;
          text-align: center;
          color: #bbc3cd;
          cursor: pointer;
        }
        i:hover {
          color: $--color-primary;
        }
        &--empty {
          border-right: 1px solid #e9e9e9;
          width: 1px;
          height: 12px;
        }
      }
    }
    &--player {
      width: 300px;
      height: 300px;
      display: flex;
      margin-top: 20px;
    }
    &--icon {
      font-size: 39px;
      color: #d2d7e0;
      margin-bottom: 10px;
    }
    &--font1 {
      font-size: 13px;
      color: #333333;
      line-height: 25px;
    }
    &--font2 {
      font-size: 12px;
      color: #808080;
      line-height: 25px;
    }
    ::v-deep {
      .el-upload,
      .el-upload-dragger {
        width: 100%;
        height: $--videoHeight;
      }
      .el-upload-dragger {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background: #fafafa;
        border: 1px dashed #e9e9e9;
      }
    }
  }
  ::v-deep {
    // 抽屉头部
    .el-drawer__header {
      padding-left: 30px;
    }
    // 输入框
    .el-input__inner {
      border: none;
      border-bottom: 1px solid #e9e9e9;
      border-radius: 0;
      padding: 0;
      height: 46px;
      line-height: 46px;
      font-size: 16px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .disabled {
      .el-upload--picture-card {
        display: none;
      }
    }
    .el-upload--picture-card {
      width: 104px;
      height: 104px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px dashed #e0e0e0;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 104px;
      height: 104px;
    }
    .el-upload:hover {
      border-color: #409eff;
    }
    .el-upload-list--picture-card .el-upload-list__item:focus {
      outline: none;
    }
    .w-e-text-container {
      // height: calc(100vh - 393px) !important;
      height: 100% !important;
    }
    .helpCenterShow {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 310px);
      .w-e-text-container {
        flex: 1;
      }
    }
    .el-dialog__headerbtn {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }
}
</style>
