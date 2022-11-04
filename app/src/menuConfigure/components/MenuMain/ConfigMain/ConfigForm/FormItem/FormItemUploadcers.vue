<!--
 * @Author: sss
 * @Date: 2022-03-05 10:33:45
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-05 10:33:45
 * @Desc: 配置控件-证件
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element topEl">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span></view
      >
      <view class="elementContent">
        <apiot-upload-cers
          :fileList="fileList"
          :count="element.maxFileCount"
          :placeholder="element.placeholder"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @select="select"
          @deleteImage="deleteImage"
        >
        </apiot-upload-cers>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';
import { fileUpload, getFileList } from '@/api/menuConfig';

export default {
  components: {},

  mixins: [elementMixin],

  inject: ['getMenuFlag'],

  props: {
    menuId: [String, Number]
  },

  data() {
    return {
      fileList: []
    };
  },

  computed: {},

  methods: {
    async select(pic) {
      const { tempFilePaths } = pic;
      for (let i = 0, len = tempFilePaths.length; i < len; i += 1) {
        const index = pic.otherParam.index - 1;
        // eslint-disable-next-line no-await-in-loop
        await this.upload(tempFilePaths[i], index);
      }

      this.changeFileIds();
    },
    async upload(filePath, index) {
      try {
        const image = await fileUpload(filePath, { menuId: this.getMenuFlag() });
        this.fileList = this.fileList.concat(image);
        console.log(index);
        this.fileList.splice(index, 0, image);
      } catch (error) {
        console.error(error);
      }
    },
    // 获取列表
    async gefileList() {
      if (!this.value) {
        return;
      }
      try {
        const image = await getFileList({ ids: this.value });
        this.fileList = this.fileList.concat(image);
      } catch (error) {
        console.error(error);
      }

      this.changeFileIds();
    },
    // 删除图片
    deleteImage(e) {
      console.log(e);
      const { tempFile } = e;
      const index = this.fileList.findIndex((img) => img.id === tempFile.id);
      if (index !== -1) this.fileList.splice(index, 1);
      this.changeFileIds();
    },
    // 提交
    changeFileIds() {
      const valueObj = {};
      const { element } = this;
      const { compId } = element;
      valueObj[compId] = this.fileIds;
      this.$emit('change', valueObj, element);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
