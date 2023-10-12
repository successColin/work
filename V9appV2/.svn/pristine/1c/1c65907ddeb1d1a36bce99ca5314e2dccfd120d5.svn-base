<template name="feedback">
  <view class="feedback">
    <m-back-bar>
      <block slot="barTitle">{{ $t('lang-myself-feedback') }}</block
      ><!--中文:意见反馈-->
      <block slot="barRight">
        <m-button @elementClick="handleTopClick()">
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon :iconSize="40"></m-font-icon>
          </block>
        </m-button>
      </block>
    </m-back-bar>
    <view class="banner-view">
      <image :src="image" mode="widthFix" class="feedback-headerimg"></image>
      <view class="tips">{{ $t('page-feedbackTips') }}</view>
      <view class="QA-title"
        ><view
          ><m-font-icon
            icon="iconchangjianwenti"
            color="#fff"
            :iconSize="30"
          ></m-font-icon></view
        ><span>{{ $t('page-feedbackQA') }}</span></view
      >
    </view>
    <view class="tags-container">
      <view class="user-bundle">
        <view class="bundle-name">{{ $t('lang-feedback-type') }}</view
        ><!--中文：反馈类别-->
        <view class="bundle-trigger" @click="showSinglePicker">
          <span class="trigger-item" type="default">{{ pickerText }}</span>
        </view>
        <view class="arrow-right"><span></span></view>
      </view>
      <view class="user-bundle">
        <view class="bundle-name">{{ $t('lang-feedback-select-menu') }}</view
        ><!--中文：选择菜单-->
        <view class="bundle-trigger" @click="showFirstMenuPop">
          <span class="trigger-item" type="default">{{ selectMenuName }}</span>
        </view>
        <view class="arrow-right"><span></span></view>
      </view>
      <view class="tags">
        <view class="tags-title">{{ $t('lang-feedback-feedback') }}</view
        ><!--中文：反馈内容-->
        <!--中文：请填写反馈内容，您的意见是我们提升产品服务的阶梯！-->
        <textarea
          class="feedback-text"
          :placeholder="$t('lang-feedback-feedback-placeholder')"
          placeholder-style="color:#D9D9D9;font-size:14upx;"
          v-model="description"
          style="height: 200upx"
        />
      </view>
    </view>
    <view class="upload-wrap">
      <view class="upload-item">
        <m-upload
          :uploadNum="-1"
          :element="element"
          :base64Url="currentFormData | formValue()"
          :requestConfig="requestConfig()"
          :imageConfig="element"
          @onUpImg="upBasicData"
          @allImgs="elementValueChang"
        >
        </m-upload>
      </view>
    </view>

    <mpvue-picker
      ref="mpvuePicker"
      :pickerValueDefault="pickerValueDefault"
      @onConfirm="onConfirm"
      :pickerValueArray="pickerValueArray"
    />
    <view class="save-item">
      <m-button
        :btnTilte="$t('basic-save')"
        @elementClick="saveFeedback"
        btnClass="mainColor"
      ></m-button>
    </view>
    <!-- 图片上传-->
    <!-- <m-upload  
			
			@onUpImg="upBasicData" 
			@onImgDel="delImgInfo" 
			ref="uImage">
		</m-upload> -->
    <!-- 一级菜单 -->
    <view class="firstMenuPop" v-if="firstMenuShow">
      <view class="title-bar">
        <view class="barTitle">{{ $t('lang-feedback-select-menu') }}</view
        ><!--选择菜单-->
        <view class="barRight" @click="handleHideFirstMenuClick()">
          <view class="buttonIcon" style="display: inline-block">
            <m-font-icon
              icon="iconfanhui"
              color="#333333"
              :iconSize="40"
            ></m-font-icon>
          </view>
        </view>
      </view>
      <view class="menu-container">
        <view
          class="user-bundle"
          v-for="(item, index) in pickerMenuArray"
          @click="openSecondMenu(index)"
          :key="index"
        >
          <view class="bundle-name">{{ item }}</view>
          <view class="arrow-right"><span></span></view>
        </view>
      </view>
    </view>
    <!-- 二级菜单 -->
    <view class="firstMenuPop" v-if="secondMenuShow">
      <view class="title-bar">
        <view class="barTitle">{{ $t('lang-feedback-select-menu') }}</view
        ><!--选择菜单-->
        <view class="barRight" @click="handleGoFirstMenuClick()">
          <view class="buttonIcon" style="display: inline-block">
            <m-font-icon
              icon="iconfanhui"
              color="#333333"
              :iconSize="40"
            ></m-font-icon>
          </view>
        </view>
      </view>
      <view class="menu-container">
        <view
          class="user-bundle"
          v-for="(item, index) in secondMenuArray"
          @click="selectSecondMenu(item)"
          :key="index"
        >
          <view class="bundle-name">{{ item.name }}</view>
          <view class="font-icon" v-if="item.id == selectMenu.id">
            <m-font-icon
              icon="iconxuanzhong"
              color="#d81e06"
              :iconSize="iconSize"
            ></m-font-icon>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import mUpload from '@/components/mniUpload/MniUpload.vue';
import feedbackHead from '@/static/images/feedback_head.png';
import state from '@/store/state.js';
import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
import EncryptionPSW from '@/static/js/encryptionPSW.js';
export default {
  components: {
    mUpload,
    mpvuePicker,
  },
  data() {
    return {
      image: feedbackHead,
      pickerValueDefault: [],
      pickerText: '',
      basetype: '',
      description: '',
      pickerValueArray: [
        {
          label: this.$t('lang-feedback-system-defects'), // 中文：'系统缺陷',
          value: 1,
        },
        {
          label: this.$t('lang-feedback-functional-requirements'), // 中文：'功能需求',
          value: 2,
        },
        {
          label: this.$t('lang-feedback-optimization-suggestions'), // 中文：'优化建议',
          value: 3,
        },
      ],
      pickerMenuText: '',
      pickerMenuArray: ['PC', 'APP'],
      pickerMenuSecondArray: [],
      secondMenuArray: [],
      firstMenuShow: false,
      secondMenuShow: false,
      selectMenu: '',
      selectMenuName: '',
      selectFirstMenu: '',
      upload_picture_list: [],
      tableName: 'feedback',
      userId: state.userId,
      typeId: '2', //资质图片
      fileIds: [], //图片参数
      upImgBasic: {
        basicConfig: {
          url: 'file/uploadFiles',
        },
        notli: true,
        sizeType: true,
      },
      iconSize: 32,
      element: {
        visiabled: true,
      },
      currentFormData: {},
      uploadPics: [],
    };
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
      this.uploadPics = uploadPics;
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
        submitParam: EncryptionPSW({ tableName: 'feedback' }),
        getPicParam: {
          relationId: this.userId,
          relationTableName: 'feedback',
          relationTypeId: 2,
        },
      };
    },
    //表单控件值发生改变
    async elementValueChang(param) {
      // this.uploadPics = param.value;
    },
    handleTopClick() {
      //处理顶部按钮的点击事件
      let url = '/pages/home/home?pageType=myself';
      uni.navigateTo({
        url: url,
      });
    },
    setType(item) {
      let types = ['default', 'primary', 'success', 'warning', 'error'];
      // if(this.type == 'default'){
      // 	this
      // }
      // let randomIndex = Math.floor(Math.random() * 4)
      item.type = item.type == 'default' ? 'error' : 'default';
      item.inverted = !item.inverted;
    },
    // 删除图片
    async delImgInfo(e) {
      const index = this.fileIds.indexOf(e);
      this.fileIds.splice(index, 1);
      console.log('你删除的图片地址为:', e);
    },
    // 获取上传图片basic
    getUpImgInfoBasic() {
      console.log('后端转成一维数组:', this.basicArr.join().split(','));
    },
    showSinglePicker(params) {
      this.$refs.mpvuePicker.show();
    },
    onConfirm(e) {
      this.pickerText = e.label;
      this.basetype = e.id;
    },
    showFirstMenuPop() {
      this.firstMenuShow = true;
    },
    openSecondMenu(e) {
      this.firstMenuShow = false;
      this.secondMenuShow = true;
      if (e == '0') {
        this.getPcFunction(e);
      }
      this.terminalType = e + 1;
      this.firstSelectMenu = this.pickerMenuArray[e];
    },
    selectSecondMenu(e) {
      this.secondMenuShow = false;
      this.selectMenuName = this.firstSelectMenu + '-' + e.name;
      this.selectMenu = e;
    },
    handleGoFirstMenuClick() {
      this.firstMenuShow = true;
      this.secondMenuShow = false;
    },
    handleHideFirstMenuClick() {
      this.firstMenuShow = false;
    },
    getPcFunction(type) {
      let url = '';
      if (type == '0') {
        url = 'feedback/getPCfunction';
      } else if (type == '1') {
        url = 'feedback/getAPPfunction';
      }
      this.$http
        .post(url, { userId: state.userId })
        .then((res) => {
          const result = res.data;
          if (result.success) {
            this.secondMenuArray = res.data.data;
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    saveFeedback() {
      this.$http
        .post('feedback/insert', {
          basetype: this.basetype,
          description: this.description,
          functionId: this.selectMenu.id,
          terminalType: this.terminalType,
          userId: state.userId,
        })
        .then((res) => {
          const result = res.data;
          if (result.success) {
            uni.showToast({
              title: this.$t('lang-feedback-feedback-success'), //中文：'意见反馈成功',
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
<style scoped>
.haveStatusBar {
  height: var(--status-bar-height);
}
.firstMenuPop {
  padding-top: var(--status-bar-height);
}
</style>
