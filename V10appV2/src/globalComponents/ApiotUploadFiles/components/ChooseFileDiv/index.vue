<!--
 * @Author: sss
 * @Date: 2022-11-26 15:57:25
 * @Last Modified by: sss
 * @Last Modified time: 2022-11-26 15:57:25
 * @Desc: 附件选择弹出框
-->
<template>
  <view class="chooseDiv">
    <template v-if="canAddFolder">
      <div class="chooseDivFile">
        <div class="chooseDiv__item" @tap.stop="addFolder">
          <p class="chooseDiv__item--icon">
            <i class="appIcon appIcon-wenjianjia"></i>
          </p>
          <p class="title">新增文件夹</p>
        </div>
        <div class="chooseDiv__item"></div>
        <div class="chooseDiv__item"></div>
      </div>
    </template>

    <div class="chooseDivFile">
      <!-- #ifdef APP-PLUS -->
      <div
        class="chooseDiv__item file"
        :fileParam="fileParam"
        :isCheckSize="isCheckSize"
        :change:fileParam="inputDiv.dataChange"
        :change:isCheckSize="inputDiv.getCheckSize"
        @tap.stop="inputDiv.clickFile"
      >
        <p class="chooseDiv__item--icon">
          <i class="appIcon appIcon-qitawenjian"></i>
        </p>
        <p class="title">上传文件</p>
      </div>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN || H5 -->
      <div class="chooseDiv__item file" @tap.stop="chooseFiles">
        <p class="chooseDiv__item--icon">
          <i class="appIcon appIcon-qitawenjian"></i>
        </p>
        <p class="title">上传文件</p>
      </div>
      <!-- #endif -->
      <div class="chooseDiv__item image" @tap.stop="chooseImages">
        <p class="chooseDiv__item--icon">
          <i class="appIcon appIcon-tupianwenjian"></i>
        </p>
        <p class="title">上传图片</p>
      </div>
      <div class="chooseDiv__item video" @tap.stop="chooseVideos">
        <p class="chooseDiv__item--icon">
          <i class="appIcon appIcon-shipinwenjian"></i>
        </p>
        <p class="title">上传视频</p>
      </div>
    </div>
    <!-- #ifndef MP -->
    <view ref="uploadFile" id="uploadFile" class="uploadFile"></view>
    <!-- #endif -->
  </view>
</template>

<script>
import chooseFileMixin from '../../chooseFileMixin';

export default {
  mixins: [chooseFileMixin],
  // #ifdef APP-PLUS
  inject: ['uploadFilesApp'],
  // #endif

  components: {},

  props: {
    title: String,
    // 是否能够添加文件
    canAddFolder: {
      type: Boolean,
      default: false,
    },
    // 可以选择的文件个数
    count: {
      type: Number,
      default: 9999,
    },
    sourceType: {
      type: Array,
      default() {
        return ['album', 'camera'];
      },
    },
    // 图片上传参数
    param: {
      type: Object,
      default() {
        return {};
      },
    },
    // 图片尺寸，以MB为单位
    size: {
      type: Number,
      default: 2,
    },
  },

  data() {
    return {
      fileParam: {
        param: {},
        menuId: '',
        token: '',
        serveURL: '',
      },
      isCheckSize: false,
      upLoadIndex: null,
    };
  },

  computed: {},

  watch: {
    upLoadIndex(newV) {
      if (newV !== -1) this.isCheckSize = true;
      else this.isCheckSize = false;
    },
  },

  methods: {
    // 新增文件夹
    addFolder() {
      this.$emit('addFolder');
    },
    // #ifdef MP-WEIXIN
    wxChooseFile() {
      return new Promise((resolve, reject) => {
        wx.chooseMessageFile({
          count: 1,
          type: 'file',
          success({ tempFiles }) {
            resolve(tempFiles);
          },
          fail(error) {
            reject(error);
          },
        });
      });
    },
    // #endif
    // #ifdef H5
    H5ChooseFile() {
      return new Promise((resolve, reject) => {
        uni.chooseFile({
          count: 1,
          success({ tempFiles }) {
            resolve(tempFiles);
          },
          fail(error) {
            reject(error);
          },
        });
      });
    },
    // #endif
    // #ifdef APP-PLUS
    APPFormatParam() {
      this.fileParam.param = { ...this.param };
      this.fileParam.menuId = uni.getStorageSync('curMenuId') || '';
      this.fileParam.token = this.$apiot.getComToken();
      this.fileParam.serveURL = this.$apiot.getComServeUrl();
    },
    // #endif
    // 选择文件
    async chooseFiles(files) {
      const param = {};
      // #ifdef MP-WEIXIN
      files = await this.wxChooseFile();
      // #endif
      // #ifdef H5
      files = await this.H5ChooseFile();
      // #endif

      param.files = files;
      // #ifndef APP-PLUS
      await this.$emit('uploadFiles', param);
      // #endif

      // #ifdef APP-PLUS
      if (files.isFile) {
        param.index = -1;
        param.files = [files];
      } else {
        param.result = { ...files };
        param.index = this.upLoadIndex;
      }
      this.upLoadIndex = this.uploadFilesApp(param);
      // #endif
    },
    // 选择视频
    async chooseVideos() {
      const { sourceType } = this;
      const files = await this.chooseVideo({ sourceType });
      this.$emit('uploadFiles', { files });
    },
    // 选择图片
    async chooseImages() {
      const { count, sourceType } = this;
      const files = await this.chooseImage({ count, sourceType });
      this.$emit('uploadFiles', { files });
    },
  },

  mounted() {},
  created() {
    // #ifdef APP-PLUS
    this.APPFormatParam();
    // #endif
  },
};
</script>

<!-- #ifdef APP-PLUS -->
<script module="inputDiv" lang="renderjs">
export default {
  data() {
    return {
      fileDom:null,
      ownerInstance:null,
      fileParam:null,
      file:null,
      fileF:null,
      isUpload:false,
    }
  },
  methods: {
    async getCheckSize(e){
      if(e){
        this.isUpload = true;
        const param ={
          isSuccess:false
        }
        this.fetchRequest(this.file).then( result => {
          console.log('Success:12', JSON.stringify(result))
          if(result.code === '00000') {
            param.isSuccess = true
            param.file = result.data[0]
          }
        }).catch(error =>{
          param.file = this.fileF
          param.msg = error;
        }).finally(()=>{
          this.isUpload = false;
          this.ownerInstance.callMethod('chooseFiles',param);
        })
      }
    },
    dataChange(e){
      this.fileParam = e
    },
    addElement() {
      var cli = document.getElementById("uploadFile")
      const inputDom = document.createElement('input');
      inputDom.type = 'file';
      inputDom.value = '';
      inputDom.addEventListener('change',(e)=>{
        const file = e.target.files[0]
        const {size,name} = file;
        const fileF = {
          size,
          path:'',
          name,
          isFile:true
        }
        this.file = file;
        this.fileF = fileF
        // 上传图片前需要先检查大小
        this.ownerInstance.callMethod('chooseFiles',fileF);
      })
      this.fileDom = inputDom
      cli.appendChild(inputDom);
    },
    clickFile(e,ownerInstance){
      if (!this.ownerInstance) this.ownerInstance = ownerInstance
      if(!this.isUpload) this.fileDom.click()
    },
    fetchRequest(file){
      const {menuId,token,serveURL,param} =this.fileParam
      const header = {
        menuId,
        token,
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
      const url = `${serveURL}application/file/batchUpload`
      const formData = new FormData();
      formData.append('files', file);
      formData.append('menuId', menuId);
      for (let keys in param) {
        formData.append(keys, param[keys]);
      }
      return fetch(url, {
        method: 'POST',
        headers: header,
        body: formData
      }).then(
        response => response.json()
      )
    }
  },
  mounted() {
    this.addElement()
  },
}
</script>
<!-- #endif -->

<style lang='scss' scoped>
.chooseDiv {
  padding: 0 30rpx 30rpx 30rpx;
  .chooseDivFile {
    display: flex;
  }
  .uploadFile {
    display: none;
    width: 100%;
  }
  &__item {
    flex: 1;
    padding: 32rpx 0;

    &--icon {
      margin: 0 auto 20rpx auto;
      padding: 20rpx;
      width: 60rpx;
      height: 60rpx;
      background: #f6f6f8;
      border-radius: 50%;
      .appIcon {
        width: 60rpx;
        height: 60rpx;
      }
    }
    .title {
      font-size: 28rpx;
      color: #333333;
      text-align: center;
    }
  }
}
</style>
