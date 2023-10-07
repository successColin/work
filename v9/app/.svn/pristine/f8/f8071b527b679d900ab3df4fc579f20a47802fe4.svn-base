<template>
  <view class="body-content userQualification">
    <m-back-bar>
      <block slot="barTitle">{{ $t('lang-user-qualification-title') }}</block
      ><!--中文：个人资质-->
      <block slot="barRight">
        <m-button @elementClick="handleTopClick()">
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon :iconSize="40"></m-font-icon>
          </block>
        </m-button>
      </block>
    </m-back-bar>
    <view class="qualification-content">
      <!-- 图片上传-->
      <m-upload
        :uploadNum="-1"
        :element="element"
        :base64Url="currentFormData | formValue()"
        :requestConfig="requestConfig()"
        :imageConfig="element"
        @onUpImg="upBasicData"
        @onImgDel="delImgInfo"
        @allImgs="elementValueChang"
      >
      </m-upload>
      <!-- 			<view class="upload-item">
				<m-font-icon icon="iconpaizhaozhaoxiangji" color="#D9D9D9" :iconSize="90"></m-font-icon>
				<view>上传个人资质</view>
			</view> -->
      <!-- 			<view class="sunsin_picture_list">
				<view v-for="(item,index) in upload_picture_list" :key="index" class="sunsin_picture_item">
					<image v-show="item.upload_percent == 100" class="sunsin_width" :data-src="item.path_server" :src="item.path_server"
					 mode="aspectFill" :data-idx="index" @click="previewImgs"></image>
					<text class='del iconfont icon-shanchu right' 
					 @click='deleteImg' :data-url="item.path_server" :data-index="index"
					 >×</text>
				</view>
			</view> -->
      <view class="save-item">
        <m-button
          :btnTilte="$t('basic-save')"
          btnClass="mainColor"
          @elementClick="insertUpdateDate()"
        ></m-button>
      </view>
    </view>
  </view>
</template>

<script>
// import mUpload from '@/components/plugin/uploadImgs/sunui-upimg-basic.vue'
import mUpload from '@/components/mniUpload/MniUpload.vue';
import { mapState } from 'vuex';
import EncryptionPSW from '@/static/js/encryptionPSW.js';
export default {
  components: {
    mUpload,
  },
  data() {
    return {
      upload_picture_list: [],
      tableName: 'user',
      typeId: 2, //资质图片
      fileIds: [], //图片参数
      upImgBasic: {
        basicConfig: {
          url: 'file/uploadFiles',
        },
        notli: true,
        sizeType: true,
      },
      element: {
        visiabled: true,
      },
      currentFormData: {},
      uploadPics: [],
    };
  },
  computed: {
    ...mapState(['userId', 'baseUrl', 'defaultUrl', 'token']),
  },
  filters: {
    formValue(formData, element = {}, type = 2) {
      //type 1-显示id，2-显示name,3-返回对象
      const elementId = element.elementId || '';
      let value = formData[elementId] || '';
      try {
        value = JSON.parse(value);
      } catch (e) {}
      if (type === 1)
        value = typeof value !== 'object' ? value : value.id || '';
      else if (type === 3) value = value || {};
      else value = typeof value !== 'object' ? value : value.name || '';
      //如果字段类型为4：decimal去除后面无用的点
      if (element.relationColumnType === 4 && value)
        value = COMMON_FORMAT_DECIMAL(value);
      return value;
    },
  },
  methods: {
    async upBasicData(e) {
      const _this = this;
      const uploadPics = e.uploadPics,
        otherParam = e.getPicParam;
      // 上传图片但未绑定的图片数组
      this.uploadPics = this.uploadPics.concat(uploadPics);
      // this.userImgPathId = uploadPics[0].id;
      let arrImg = [];
      for (let i = 0, len = uploadPics.length; i < len; i++) {
        try {
          if (uploadPics[i].id != '') {
            // 将未上传的图片信息保存到fileIds数组
            const fileId = uploadPics[i].id;
            this.fileIds[fileId] = {
              typeId: otherParam.relationTypeId,
              stateId: otherParam.relationStateId,
              priorityId: otherParam.relationpriorityId,
            };
          }
        } catch (err) {
          console.log('上传失败...');
        }
      }
    },
    imageConfig() {
      return function (element = {}) {
        return {
          allImgsParam: {
            element: element,
            triggerBaseType: 'upImg',
          },
        };
      };
    },
    requestConfig() {
      let submitUrl = 'file/uploadFiles';
      return {
        submitUrl: 'file/uploadFiles',
        submitParam: EncryptionPSW({ tableName: 'user' }),
        getPicParam: {
          relationId: this.userId,
          relationTableName: 'user',
          relationTypeId: 2,
        },
      };
    },
    //表单控件值发生改变
    async elementValueChang(param) {
      this.uploadPics = param.value;
    },
    // 删除图片
    delImgInfo(e) {
      if (e in this.uploadPics) delete this.uploadPics[e];
    },
    handleTopClick() {
      //处理顶部按钮的点击事件
      let url = '/pages/home/home?pageType=myself';
      uni.navigateTo({
        url: url,
      });
    },
    insertUpdateDate() {
      //新增编辑数据
      let _this = this;
      uni.showNavigationBarLoading();
      let fileString = [];
      if (this.uploadPics.length == 0) {
        uni.hideNavigationBarLoading();
        return;
      }
      for (let i = 0; i < this.uploadPics.length; i++) {
        let file = {
          mainId: this.uploadPics[i].id,
          relationTableName: this.tableName,
          relationId: this.userId,
          relationTypeId: this.typeId,
        };
        fileString.push(file);
      }
      fileString = JSON.stringify(fileString);
      let baseUrl = this.baseUrl || this.defaultUrl;
      var url = baseUrl + 'filesrelations/batchInsert';
      uni.request({
        url: url,
        data: {
          fileString: fileString,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          token: this.token,
        },
        success: (res) => {
          uni.hideNavigationBarLoading();
          if (res.data.success) {
            uni.showToast({
              title: _this.$t('pageTip-successfulPictureUpload'),
              duration: 1000,
            });
            this.uploadPics = [];
          } else {
            uni.showToast({
              title: _this.$t('pageTip-pictureUploadFailed'),
              duration: 1000,
            });
          }
        },
      });
    },
    // 获取上传图片basic
    getUpImgInfoBasic() {
      console.log('后端转成一维数组:', this.basicArr.join().split(','));
    },
  },
};
</script>
