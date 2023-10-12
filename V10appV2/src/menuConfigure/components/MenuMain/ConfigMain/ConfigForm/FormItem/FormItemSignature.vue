<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-电子签名
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal">
      <view class="elementLabel"
        >{{ element.name }}
        <span v-if="element.shouldRequired" class="required">*</span>
      </view>
      <view class="elementContent">
        <div class="elementContent__div">
          <span v-if="!fileUrl" class="elementContent__placeholderColor"
            >请上传电子签名</span
          >
          <div v-else class="elementContent__img" @click.stop="prview">
            <image :src="fileUrl"></image>
          </div>
        </div>
        <apiot-button-font v-if="!disabled" :isTheme="true" @click="openSign">{{
          fileUrl ? '重签' : '签名'
        }}</apiot-button-font>
      </view>
    </view>
    <u-popup
      :show="show"
      mode="bottom"
      :round="15"
      :safeAreaInsetBottom="false"
      @open="openSign"
      @close="closeSign"
      :closeOnClickOverlay="true"
      bgColor="#F6F6F8"
    >
      <Signature
        ref="signatureBox"
        :show="show"
        :param="uploadParam"
        :canChangColor="element.thousandSign"
        :waterColor="element.waterColor"
        :watermark="watermark"
        :lastImgUrl="signatureImage"
        :showLastImg="showLastImg"
        @success="saveSuccess"
      ></Signature>
    </u-popup>
  </u-form-item>
</template>

<script>
import Signature from '../../../Signature';
import elementMixin from './elementMixin';
import { fileUpload, uploadSignature, deleteFile } from '@/api/menuConfig';

export default {
  components: { Signature },

  mixins: [elementMixin],

  props: {
    menuId: [String, Number]
  },

  data() {
    return {
      show: false,
      popHeight: 300,
      fileList: [],
      fileIds: '',
      watermark: '' // 电子签章水印信息
    };
  },

  computed: {
    disabled() {
      const { element } = this;
      return element.singleStatus === 2 || element.singleStatus === 3 || element.canReadonly;
    },
    uploadParam() {
      const { menuId } = this;
      if (!menuId) return;
      return { menuId };
    },
    fileUrl() {
      const { fileList } = this;
      if (!this.value || fileList.length === 0) return;
      return this.$apiot.getComUrlByToken(fileList[0].url);
    },
    // 是否需要加水印
    isWatermark() {
      return this.$store.getters.getWatermark;
    },
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    },
    // 用户签名图片
    signatureImage() {
      const { signatureImage } = this.userInfo;
      if (!signatureImage) return '';
      return this.$apiot.getComUrlByToken(signatureImage);
    },
    // 是否显示上一次签名
    showLastImg() {
      const { element, value, signatureImage } = this;
      const { showContent } = element;
      if (showContent && !value && signatureImage) return true;
      return false;
    }
  },

  watch: {
    value: {
      handler(v) {
        if (v === this.fileIds) return;
        this.gefileList();
      },
      immediate: true
    },
    fileList: {
      handler() {
        const files = [];
        this.fileList.forEach((item) => {
          files.push(item.id);
        });
        this.fileIds = files.join(',');
      },
      immediate: true,
      deep: true
    },
    show(v) {
      if (v) {
        const { userInfo } = this;
        const currentDate = this.$apiot.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss');
        this.watermark = `${userInfo.username} ${currentDate}`;
      }
    }
  },

  methods: {
    async doDel() {
      // 删除之前的电子签名
      const ids = this.fileIds;
      if (!ids) return;
      try {
        await deleteFile({ ids });
      } catch (e) {
        console.log(e);
      }
    },
    async saveW(file) {
      // 保存水印图片
      const img = await fileUpload(file, this.uploadParam);
      this.fileList = img;
      this.changeFileIds();
      this.show = false;
    },
    async saveUserSignature(file) {
      // 保存用户的电子签章
      const res = await uploadSignature(file, this.uploadParam);
      this.$store.commit('setSignatureImage', res.url);
    },
    closeSign() {
      this.show = false;
    },
    openSign() {
      this.show = true;
    },
    // 提交
    changeFileIds() {
      const valueObj = {};
      const { element } = this;
      const { compId } = element;

      const files = [];
      this.fileList.forEach((item) => {
        files.push(item.id);
      });
      valueObj[compId] = files.join(',');
      this.$emit('change', valueObj, element);
    },
    saveSuccess(event) {
      console.log(event);
      // this.doDel();
      this.saveW(event.pathW);
      this.saveUserSignature(event.path);
    },
    // 获取列表
    async gefileList() {
      if (!this.value) return;
      try {
        const image = await this.$store.dispatch('get_userCenter_filesInfo', this.value);
        this.fileList = [...image];
      } catch (error) {
        console.error(error);
        this.fileList = [];
      }
    },
    prview() {
      this.$apiot.preview.previewFile({
        file: this.fileList,
        isWatermark: false,
        fileParamUrl: 'url',
        fileParamName: 'name'
      });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.elementContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88rpx;
  font-size: $form-el-fontSize;
  &__div {
    flex: 1;
  }
  &__img {
    width: 180rpx;
    height: 77rpx;
    background: #f6f6f8;
    image {
      width: 100%;
      height: 100%;
    }
  }
  &__placeholderColor {
    color: $form-el-placeholderColor;
  }
}
</style>
