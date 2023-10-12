<!--
 * @Author: sss
 * @Date: 2023-05-12 11:30:39
 * @Last Modified by: sss
 * @Last Modified time: 2023-05-12 11:30:39
 * @Desc: 电子签名
-->
<template>
  <div
    class="signature"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
    ]"
    v-if="showInput"
  >
    <el-form-item
      :prop="`${configData.compId}`"
      :class="{ 'is-required': isConfig && configData.shouldRequired }"
    >
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
      <div class="signature__box">
        <div class="signature__box__div">
          <apiot-input
            v-model="parent.form[this.configData.compId]"
            v-show="false"
          ></apiot-input>
          <span
            v-if="!parent.form[configData.compId]"
            class="placeholderColor"
            >{{ configData.placeholder }}</span
          >
          <div v-else-if="fileUrl" class="signatureimg" @click="preview()">
            <el-image
              class="image"
              style="height: 100%"
              :src="$parseImgUrl(fileUrl)"
              fit="contain"
            ></el-image>
          </div>
        </div>
        <span
          v-if="!configData.canReadonly"
          class="btn"
          @click="showDialog = true"
          >{{ fileUrl ? '重签' : '签名' }}</span
        >
      </div>
      <apiot-input
        v-model="parent.form[configData.compId]"
        v-show="false"
      ></apiot-input>
    </el-form-item>

    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>

    <apiot-dialog
      :visible.sync="showDialog"
      :isShowCancel="false"
      @sure-click="sure"
      title="签名"
    >
      <signature-box
        ref="signatureBox"
        v-if="showDialog"
        :canChangColor="configData.thousandSign"
        :waterColor="configData.waterColor"
        :showLastImg="showLastImg"
      ></signature-box>

      <apiot-button slot="btn" @click="reset"> 重签 </apiot-button>
    </apiot-dialog>

    <image-zoom
      v-if="previewVisible"
      :previewObj="previewObj"
      :picList="picList"
      v-on:hideImgPreview="hideImgPreview"
      :isShowDelBtn="false"
      :isShowShareBtn="false"
    ></image-zoom>
  </div>
</template>

<script>
import {
  batchUpload,
  deleteFileFun,
  uploadSignature,
  getFileList,
} from '@/api/menuConfig';
import { downloadSingle } from '@/api/knowledge';
import { debounce, formatDate } from '@/utils/utils';
import compMixin from '../../compMixin';
import SignatureBox from './SignatureBox';
import Handwriting from './SignatureBox/signature';
import imageZoom from '../../RelatedData/RelateApply/ImageZoom';

export default {
  mixins: [compMixin],

  components: {
    SignatureBox,
    imageZoom,
  },

  props: {},

  data() {
    return {
      showDialog: false,
      fileList: [],
      picList: [],
      previewVisible: false,
      previewObj: {},
      fileIds: '',
      unwatch: null,
      imgWatermark: null,
    };
  },

  computed: {
    fileUrl() {
      const { fileList } = this;
      if (!this.parent.form[this.configData.compId] || fileList.length === 0) {
        return;
      }
      return fileList[0].url;
    },
    previewList() {
      const { fileList } = this;
      return fileList.map((file) => this.$parseImgUrl(file.url));
    },
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    },
    // 是否显示上一次签名
    showLastImg() {
      const value = this.parent.form[this.configData.compId];
      const { signatureImage } = this.userInfo;
      const { configData } = this;
      const { showContent } = configData;
      if (showContent && !value && signatureImage) return true;
      return false;
    },
  },

  watch: {
    fileList: {
      handler(v) {
        const files = [];
        v.forEach((item) => {
          files.push(item.id);
        });
        const ids = files.join(',');
        this.fileIds = ids;
        this.parent.form[this.configData.compId] = ids;
        console.log(this.parent.form);
      },
      deep: true,
    },
  },

  methods: {
    hideImgPreview() {
      // 关闭预览
      this.previewVisible = false;
    },
    async preview() {
      const file = this.fileList[0];
      this.previewObj.sysKlTree = file;
      this.picList = [];
      this.fileList.forEach((liObj) => {
        this.picList.push({
          sysKlTree: liObj,
        });
      });
      if (this.$store.state.globalConfig.waterConfig.enableWaterMask === '1') {
        const index = this.picList.findIndex(
          (item) => item.sysKlTree.id === file.id,
        );
        if (index !== -1) {
          this.loading = true;
          const data = await downloadSingle({
            url: this.picList[index].sysKlTree.url,
          });
          this.loading = false;
          this.picList[index].sysKlTree.blob = data;
        }
      }
      this.previewVisible = true;
    },
    async saveW(file) {
      let resFile = file;
      if (!resFile) {
        const { userInfo } = this;
        const currentDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
        const watermark = `${userInfo.username} ${currentDate}`;
        resFile = await this.$refs.signatureBox.save(watermark); // 加防伪水印
      }

      // 保存水印图片
      const menuId = this.$route.params.id || this.$route.query.menuId;

      const formData = new FormData();
      formData.append('files', resFile);
      formData.append('menuId', menuId);
      const img = await batchUpload(formData);
      this.fileList = img;
      this.showDialog = false;
      return img;
    },
    async saveUserSignature() {
      // 保存用户的电子签章
      const file = await this.$refs.signatureBox.save();
      this.saveW();
      const menuId = this.$route.params.id || this.$route.query.menuId;

      const formData = new FormData();
      formData.append('files', file);
      formData.append('menuId', menuId);
      await uploadSignature(formData);
    },
    async doDel() {
      // 删除之前的电子签名
      const id = this.parent.form[this.configData.compId];
      if (!id) return;
      try {
        await deleteFileFun({ id });
      } catch (e) {
        console.log(e);
      }
    },
    async sure() {
      this.saveUserSignature();
      // this.doDel();
    },
    reset() {
      this.$refs.signatureBox.reset();
    },
    async getFileList() {
      if (this.parent.form[this.configData.compId]) {
        const data = await getFileList({
          ids: this.parent.form[this.configData.compId],
        });
        this.fileList = data;
      }
    },
    // 获取到上一次签名并加上水印
    async getLast() {
      const { signatureImage } = this.userInfo;
      if (!signatureImage || this.configData.defaultValueType !== 2) {
        this.fileList = [];
        return;
      }
      this.imgWatermark = new Handwriting();
      const url = this.$parseImgUrl(signatureImage);
      await this.imgWatermark.setImg(url);
      const { userInfo } = this;
      const currentDate = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
      const watermark = `${userInfo.username} ${currentDate}`;
      const file = await this.imgWatermark.saveCanvas(watermark);
      await this.saveW(file);
    },
    // 监听
    watchThing(v) {
      if (v && v !== this.fileIds) {
        this.getFileList();
      }
      if (!v) {
        this.getLast();
      }
    },
  },

  mounted() {
    if (!this.isConfig) {
      // 等待single接口返回
      setTimeout(() => {
        this.unwatch = this.$watch(
          `parent.form.${this.configData.compId}`,
          debounce(this.watchThing),
          {
            immediate: true,
          },
        );
      }, 300);
    }
  },

  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .imgWrap {
    background: #fff;
    img {
      max-width: 100%;
    }
  }
}
.signature {
  position: relative;
  box-sizing: border-box;
  padding: 14px 15px 10px 15px;
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  &__box {
    position: relative;
    &__div {
      position: relative;
      border: 1px solid #e9e9e9;
      box-sizing: border-box;
      height: 32px;
      line-height: 29px;
      padding: 0 12px;
      color: #333333;
      border-radius: 4px;
      .placeholderColor {
        font-size: 13px;
        color: #aaaaaa;
      }
      .signatureimg {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 56px;
        height: 24px;
        background: #f6f6f8;
        border-radius: 4px;
      }
    }
    .btn {
      border-left: 1px solid #e9e9e9;
      position: absolute;
      top: 0;
      right: 0;
      margin-left: -47px;
      margin-top: 1px;
      width: 30px;
      text-align: center;
      color: #aaaaaa;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      &:not(.disabled):hover {
        color: $--color-primary;
      }
      &.disabled {
        cursor: default;
      }
    }
  }
}
</style>
