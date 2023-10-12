<template>
  <view class="user-info userInfo">
    <m-back-bar>
      <block slot="barTitle">{{ $t('lang-userinfo-title') }}</block
      ><!--中文：个人信息编辑-->
      <block slot="barRight">
        <m-button @elementClick="handleTopClick(btn.type, btn.relationTabId)">
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon :iconSize="40"></m-font-icon>
          </block>
        </m-button>
      </block>
    </m-back-bar>
    <view class="user-info-list">
      <view class="user-info-item user-image-item">
        <!-- <view>{{$t('lang-userinfo-header')}}</view> --><!--中文：头像-->
        <!-- <image src="../../static/images/plantingDefault.png" mode="aspectFill" class="workbench-headerimg" @onUpImg="upBasicData" @onImgDel="delImgInfo" ref="uImage"></image> -->
        <!-- 图片上传-->
        <view class="workbench-headerimg">
          <!-- #ifdef MP -->
          <open-data class="user-img" type="userAvatarUrl"></open-data>
          <!-- #endif -->
          <!-- #ifndef MP -->
          <m-upload
            :uploadNum="-1"
            :element="element"
            :requestConfig="requestConfig()"
            :imageConfig="element"
            :newUserImgPath="userImgPath"
            :userImgPath="userImag || picpath"
            uploadType="touxiang"
            @onUpImg="upBasicData"
          >
          </m-upload>

          <!-- #endif -->
        </view>
      </view>
      <view class="user-info-item">
        <view>{{ $t('user-PhoneNumber') }}</view>
        <input
          class="uni-input"
          :placeholder="$t('user-PhoneNumber')"
          v-model="tel"
          value=""
        />
      </view>
      <view class="user-info-item">
        <view>{{ $t('user-Email') }}</view>
        <input
          class="uni-input"
          :placeholder="$t('user-Email')"
          v-model="email"
          value=""
        />
      </view>
      <view class="user-info-item">
        <view>{{ $t('lang-userinfo-signature') }}</view
        ><!--中文：个人签名-->
        <textarea
          class="uni-input"
          auto-height
          :placeholder="$t('lang-userinfo-please-signature')"
          v-model="personalSignal"
          value=""
        /><!--中文：请输入个人签名-->
      </view>
    </view>
    <view class="save-item">
      <m-button
        :btnTilte="$t('basic-save')"
        btnClass="mainColor"
        @elementClick="UpdateDate"
      ></m-button>
    </view>
  </view>
</template>

<script>
// import mUpload from '@/components/plugin/uploadImgs/sunui-upimg-basic.vue'
import { mapState, mapMutations } from 'vuex';
import defaultImage from '@/static/images/default_image.png';
import state from '@/store/state.js';
import $http from '@/common/utils/request/index.js';
import store from '@/store/index';
import { fileApi } from '@/common/request/api.js';
import mUpload from '@/components/mniUpload/MniUpload.vue';
import EncryptionPSW from '@/static/js/encryptionPSW.js';
export default {
  components: {
    mUpload,
  },
  data() {
    return {
      tel: state.telephone,
      email: state.email,
      personalSignal: state.personalSignal,
      upload_picture_list: [],
      tableName: 'user',
      userId: state.userId,
      token: state.token,
      picpath: defaultImage,
      typeId: 1, //头像图片
      fileIds: [], //图片参数
      upImgBasic: {
        basicConfig: {
          url: 'file/uploadFiles',
        },
        notli: true,
        sizeType: true,
        count: 1,
        isAddImage: false,
        isDelIcon: false,
      },
      isUploading: true,
      isExist: 0,
      userImgPath: '',
      userImgPathId: '',
      element: {
        visiabled: true,
      },
      currentFormData: {},
      uploadPics: [],
    };
  },
  computed: {
    ...mapState(['userImag']),
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
    ...mapMutations(['UPDATE_USER_STATE']),
    upBasicData(e) {
      const uploadPics = e.uploadPics,
        otherParam = e.getPicParam;
      console.log(e);
      this.userImgPath = uploadPics[0].url;
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
      return {
        submitUrl: 'file/textEditorUpload',
        submitParam: {},
      };
    },
    handleTopClick() {
      //处理顶部按钮的点击事件
      let url = '/pages/home/home?pageType=myself';
      uni.redirectTo({
        url: url,
      });
    },
    UpdateDate() {
      //保存修改信息、头像
      let submitparam = {
        email: this.email,
        telephone: this.tel,
        id: this.userId,
        personalSignal: this.personalSignal,
        picpath: this.userImgPath,
      };
      this.$http
        .post('user/update', submitparam)
        .then((res) => {
          const result = res.data;
          console.log(
            '=========================================================='
          );
          if (result.success) {
            uni.showToast({
              title: this.$t('lang-myself-ModifiedSuccess'),
              duration: 1000,
              icon: 'none',
            });
            this.UPDATE_USER_STATE(submitparam);
          } else {
            uni.showToast({
              title: this.$t('lang-userinfo-faile'), // 中文：'修改失败',
              duration: 1000,
              icon: 'none',
            });
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
  },
};
</script>

