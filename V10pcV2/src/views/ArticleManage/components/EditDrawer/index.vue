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
        label-position="top"
        :model="curData"
        :rules="rules"
        ref="curData"
        class="drawer__curData"
      >
        <!-- 文章标题 -->
        <el-form-item prop="title" label="文章标题">
          <apiot-input
            :placeholder="placeholder"
            v-model="curData.title"
            class="drawer__curData--input"
          ></apiot-input>
          <div class="drawer__curData--suspension">
            <!-- 是否置顶 -->
            置顶
            <apiot-switch
              v-model="curData.isPlacedTop"
              :active-value="1"
              :inactive-value="0"
              class="m-l-8 m-r-20"
            ></apiot-switch>
            分享
            <apiot-switch
              v-model="curData.isShare"
              :active-value="1"
              :inactive-value="0"
              class="m-l-6 m-r-20"
            ></apiot-switch>
            评论
            <div class="m-l-6 m-r-20 commentCheck">
              <apiot-switch
                v-model="curData.isComment"
                :active-value="1"
                :inactive-value="0"
              ></apiot-switch>
              <el-checkbox
                v-model="curData.audit"
                class="m-l-12 m-r-4"
                :true-label="1"
                :false-label="2"
              >
                是否控制评论
              </el-checkbox>
            </div>
          </div>
        </el-form-item>
        <div class="form__line">
          <!-- 展示风格 -->
          <el-form-item class="hlaf" label="展示风格">
            <el-select
              v-model="curData.articleType"
              popper-class="articleType"
              class="drawer__curData--articleType"
              @change="changeType"
            >
              <el-option
                v-for="item in imgOption"
                :key="item.index"
                :value="item.index"
              >
                <img
                  :src="require(`../images/${item.index}.svg`)"
                  style="width: 70px"
                />
                <span style="margin-left: 10px; font-size: 13px">
                  {{ item.label }}
                </span>
              </el-option>
            </el-select>
            <div class="drawer__curData--articleTypeVal">
              <img :src="require(`../images/${curData.articleType}.svg`)" />
              <span style="margin-left: 10px; font-size: 13px">
                {{ imgOption[curData.articleType - 1].label }}
              </span>
            </div>
          </el-form-item>
          <!-- 上传图片 -->
          <el-form-item
            class="hlaf"
            prop="articleCover"
            :label="$t('announce.articleCover')"
          >
            <el-upload
              :class="`upload ${isShowUpload ? '' : 'noShowUpload'}`"
              action=""
              drag
              accept=".png, .jpg,.jpeg,"
              :on-success="uploadSuccess"
              :on-change="uploadChange"
              :before-upload="beforeUpload"
              :http-request="doUpload"
              :file-list="fileList"
              list-type="picture-card"
            >
              <i class="iconfont icon-jiahao"></i>
              <div
                slot="file"
                slot-scope="{ file }"
                class="file"
                @mouseenter="mouseenter(file)"
                @mouseleave="mouseleave(file)"
              >
                <img
                  v-show="file.url"
                  class="file__img"
                  :src="$parseImgUrl(file.url)"
                />
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
                  class="file__operateBox fontHover"
                  v-show="file.percentage === 100 && file.showOperate"
                >
                  <el-tooltip effect="dark" content="删除" placement="top"
                    ><i
                      class="iconfont icon-guanbi file__operateBox--shanchu"
                      @click.stop="delFile(file)"
                    ></i
                  ></el-tooltip>
                </div>
              </div>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 富文本 -->
        <el-form-item label="文章内容" v-if="isShow">
          <apiot-wangeditor
            ref="wangeditor"
            class="helpCenterShow"
            :value="curData.html"
            :extraEditorConfig="editorConfig"
            @change="handleWangeditorChange"
          >
          </apiot-wangeditor>
        </el-form-item>
        <!-- 视频上传 -->
      </el-form>
    </apiot-drawer>
  </div>
</template>

<script>
import axios from 'axios';
import {
  insertArticle,
  batchUpload,
  modifyArticle,
} from '@/api/articleManage.js';

export default {
  props: {
    // 占位符
    placeholder: {
      type: String,
      default: '',
    },
    // 正文标题
    drawerTitle: {
      type: String,
      default: '',
    },
    // 当前表格对象
    currentTableObj: {
      type: Object,
      default: () => {},
    },
    // 新增：true；编辑：fasle
    isAddDrawerState: {
      type: Boolean,
      default: true,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    // 当前分组
    group: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isShowUpload: true,
      imgOption: [
        {
          label: '大图展示',
          index: 1,
        },
        {
          label: '小图展示',
          index: 2,
        },
        {
          label: '三图展示',
          index: 3,
        },
        {
          label: '纯文本展示',
          index: 4,
        },
      ],
      // 是否显示loading
      showLoading: false,
      // 视频格式
      curData: {
        title: '',
        articleType: 1,
        isPlacedTop: 1,
        isShare: 1,
        isComment: 1,
        articleCover: '',
        html: '',
        audit: 2,
      },
      fileList: [
        // {
        //   url: 'https://v10.mingcloud.top:9000/v10/article/2022-11-12/636f5060a10a02644aa77f73.jpeg',
        //   percentage: 100,
        //   showOperate: false
        // }
      ],
      editorConfig: { placeholder: '请输入内容' },
    };
  },
  computed: {
    rules() {
      return {
        title: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAny', {
              any: this.$t('announce.announcementTitle'),
            }),
            trigger: 'change',
          },
        ],
      };
    },
    getMaxLength() {
      if (+this.curData.articleType === 3) {
        return 3;
      }
      return 1;
    },
  },
  created() {
    this.initConfig();
  },
  components: {},
  watch: {
    // 赋值
    currentTableObj(v) {
      if (JSON.stringify(v) !== '{}') {
        this.curData = JSON.parse(JSON.stringify(v));
        console.log(this.curData);
        this.curData.html = v.html || '';
        const arr = this.curData.articleCover.split(',');
        this.fileList = [];
        arr.forEach((item) => {
          this.fileList.push({
            url: item,
            percentage: 100,
            showOperate: false,
          });
        });
        if (this.$refs.curData) {
          this.$refs.curData.clearValidate();
        }
        this.uploadChange();
      }
    },
    isShow(v) {
      if (!v) {
        this.fileList = [];
        this.curData.title = '';
        this.curData.articleType = 1;
        this.curData.isPlacedTop = 1;
        this.curData.isShare = 1;
        this.curData.isComment = 1;
        this.curData.audit = 2;
        this.isShowUpload = true;
        this.curData.articleCover = '';
        this.curData.html = '';
      } else if (this.$refs.curData) {
        this.$refs.curData.clearValidate();
      }
    },
  },
  mounted() {},
  methods: {
    // 更改类型
    changeType(i) {
      if ([1, 2].includes(i) && this.fileList.length > 1) {
        this.curData.articleCover = '';
        this.fileList = [];
      }
      this.uploadChange();
    },
    // 富文本上传接口重写
    initConfig() {
      this.editorConfig = {
        placeholder: '请输入内容',
        MENU_CONF: {
          uploadImage: {
            // 自定义上传图片
            customUpload: async (file, insertFn) => {
              const formData = new FormData();
              formData.append('files', file);
              const res = await batchUpload(formData);
              res.forEach(async (item) => {
                insertFn(item, '', item);
              });
            },
          },
          uploadVideo: {
            // 自定义上传视屏
            customUpload: async (file, insertFn) => {
              const formData = new FormData();
              formData.append('files', file);
              const res = await batchUpload(formData);
              res.forEach((item) => {
                insertFn(item, '', item);
              });
            },
          },
        },
      };
    },
    handleClose() {
      this.$emit('update:currentTableObj', {});
    },
    handleWangeditorChange() {},
    resolveSize(size) {
      return `${(size / 1024).toFixed(2)}kb`;
    },
    // 上传成功
    uploadSuccess(response, file) {
      [file.url] = response;
      if (file.percentage === 99) {
        file.percentage = 100;
      }
    },
    // 上传变化
    uploadChange() {
      if (
        [1, 2].includes(this.curData.articleType) &&
        this.fileList.length >= 1
      ) {
        this.isShowUpload = false;
        return;
      }
      if (this.curData.articleType === 3 && this.fileList.length >= 3) {
        this.isShowUpload = false;
        return;
      }
      this.isShowUpload = true;
    },
    // 上传之前
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        const { size } = file;
        const newSize = size <= 200 * 1024 * 1024;

        if (!newSize) {
          this.$message({
            type: 'warning',
            message: this.$t('knowledge.size_more'),
          });
          reject(file);
          return;
        }
        if (this.fileList.length >= this.getMaxLength) {
          this.$message({
            type: 'warning',
            message: '上传文件数量超过最大限制',
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
      if (this.fileList.length >= this.getMaxLength) {
        this.$message({
          type: 'warning',
          message: '上传文件数量超过最大限制',
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
        showOperate: false,
      });

      const formData = new FormData();
      formData.append('files', file);
      console.log(formData);
      const res = await batchUpload(
        formData,
        this.uploadProgress(this.fileList[this.fileList.length - 1]),
        source,
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
      if (index !== -1) {
        this.fileList.splice(index, 1);
      }
      this.isShowUpload = true;
    },
    hideImgPreview() {
      // 关闭预览
      this.previewVisible = false;
    },
    cancelPreview() {
      this.previewObj = {};
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
    // 确定
    sureClick() {
      this.$refs.curData.validate(async (valid) => {
        if (valid) {
          if (this.fileList.length !== this.getMaxLength) {
            this.showLoading = false;
            return this.$message({
              type: 'warning',
              message: `请上传${this.getMaxLength}张文章封面`,
            });
          }
          const coverPageArr = [];
          this.fileList.forEach((item) => {
            coverPageArr.push(item.url);
          });
          this.showLoading = true;
          const detailId =
            (this.currentTableObj && this.currentTableObj.id) || '';
          const htmlObj = this.$refs.wangeditor.getHtmlObj();
          const param = {
            ...this.curData,
            html: htmlObj.html, // html
            txt: htmlObj.text, // txt
            id: detailId,
            articleCover: coverPageArr.join(','),
            groupId: this.group.id,
            logData: {
              operateType: this.isAddDrawerState ? 1 : 2,
              title: {
                name: this.$t('announce.announcementTitle'),
              },
              html: {
                name: this.$t('importTemplate.content'),
              },
              isPlacedTop: {
                name: this.$t('announce.topOrNot'),
              },
              enable: {
                name: this.$t('common.state'),
              },
            },
          };
          try {
            // 后台接口调整，代码逻辑如下：
            if (this.isAddDrawerState) {
              await insertArticle(param);
            } else {
              await modifyArticle(param);
            }
            this.$emit('update:visible', false);
            this.$emit('getTableList');
            this.$message({
              type: 'success',
              message: this.isAddDrawerState
                ? this.$t('common.newSuccess')
                : this.$t('common.successfullyModified'),
            });
            this.showLoading = false;
          } catch (err) {
            console.log(err);
            this.showLoading = false;
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// @import './wangEditor.scss';
$--avataruploaderlength: 104px;
$--videoHeight: 340px;
.drawer {
  &__curData {
    margin: 30px 37px 0;
    &--input {
      ::v-deep {
        .el-input__inner {
          height: 36px !important;
        }
      }
    }
    &--suspension {
      position: absolute;
      right: 0;
      top: -38px;
      display: flex;
      align-items: center;

      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      .commentCheck {
        border-radius: 13px;
        border: 1px solid #e9e9e9;
        height: 24px;
        display: flex;
        align-items: center;
        padding: 3px 13px 3px 3px;
        // padding: 3px;
        // padding-right: 13px;
      }
    }
    &--articleType {
      ::v-deep {
        .el-input__inner {
          height: 54px !important;
          line-height: 54px !important;
        }
      }
    }
    &--articleTypeVal {
      display: flex;
      align-items: center;
      position: absolute;
      left: 8px;
      top: 10px;
      img {
        height: 38px;
      }
    }
  }
  &__type {
    display: flex;
    align-items: center;
    height: 56px;
    cursor: pointer;
    &--box {
      height: 100%;
      border: 1px solid transparent;
      border-bottom-width: 4px;
      margin-right: 14px;
      border-radius: 4px;
      overflow: hidden;
      &.active {
        border-color: $--color-primary;
      }
    }
  }
  .upload {
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
        .iconfont {
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
        &--xiazai {
          position: absolute;
          right: 24px;
          text-decoration: none;
          cursor: pointer;
          &.isDisabled {
            right: 2px;
          }
        }
        &--shanchu {
          position: absolute;
          right: 2px;
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
  }
  ::v-deep {
    .el-upload-list__item {
      transition: none;
    }
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
    &.isDisabled {
      .el-upload--picture-card {
        display: none;
      }
    }
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
  ::v-deep {
    // 抽屉头部
    .el-drawer__header {
      padding-left: 30px;
    }
    // 输入框
    .el-input__inner {
      font-size: 14px;
      height: 32px;
      line-height: 30px;
      border-radius: 4px;
      border: 1px solid #e9e9e9;
      &:focus {
        border: 1px solid #1989fa;
      }
    }
    .el-form-item {
      padding: 0 15px;
      box-sizing: border-box;
      display: inline-block;
      margin-bottom: 22px;
      width: 100%;
      &__label {
        line-height: 1;
        color: #333333;
        padding-bottom: 6px;
      }
    }
    .hlaf {
      width: 50%;
      position: relative;
    }
    .disabled {
      .el-upload--picture-card {
        display: none;
      }
    }
    .el-upload--picture-card {
      width: 54px;
      height: 54px;
      background: #fafafa;
      border-radius: 4px;
      border: 1px dashed #e0e0e0;
    }
    .upload,
    .el-upload-list--picture-card {
      display: flex;
    }
    .el-upload-list--picture-card .el-upload-list__item {
      width: 54px;
      height: 54px;
      margin-bottom: 0;
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
      .w-e-text-container {
        flex: 1;
      }
      .w-e-scroll {
        height: calc(100vh - 520px);
      }
    }
    .el-dialog__headerbtn {
      position: absolute;
      top: 5px;
      right: 10px;
    }
  }
  .noShowUpload {
    ::v-deep {
      .el-upload--picture-card {
        display: none;
      }
    }
  }
}
</style>
