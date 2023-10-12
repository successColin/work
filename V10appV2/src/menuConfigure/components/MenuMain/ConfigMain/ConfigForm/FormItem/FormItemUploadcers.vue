<!--
 * @Author: sss
 * @Date: 2022-01-22 09:20:36
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:20:36
 * @Desc: 配置表单-证件
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element topEl">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span>
        <span class="tip" v-if="!element.canReadonly">{{ tip }}</span>
      </view>
      <template v-if="noData">
        <span class="nodata"> 无证件 </span>
      </template>
      <template v-else>
        <view class="upload" v-for="item in count" :key="item">
          <apiot-upload-files
            mode="image"
            :title="`上传${element.name}`"
            :fileList="filesObj[item]"
            :limit="1"
            :isCer="true"
            :size="maxFileSize"
            showType="grid"
            :param="uploadParam"
            :disabled="disabled"
            :readonly="readonly"
            :otherParam="item | otherParamFilter"
            @success="success"
            @delFile="deleteImage(item)"
          ></apiot-upload-files>
        </view>
      </template>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  components: {},

  mixins: [elementMixin],

  inject: ['getMenuFlag'],

  props: {
    menuId: [String, Number]
  },

  data() {
    return {
      fileIds: '',
      filesObj: {},
      isLoading: false
    };
  },

  filters: {
    otherParamFilter(index) {
      return { index };
    }
  },

  watch: {
    value: {
      handler(v) {
        if (v === this.fileIds) return;
        this.gefileList();
      },
      immediate: true
    }
  },

  computed: {
    noData() {
      const { disabled, value = [] } = this;
      if ((!value || value.length === 0) && disabled) return true;
      return false;
    },
    disabled() {
      const { element } = this;
      return element.singleStatus === 2 || element.canReadonly;
    },
    readonly() {
      const { element } = this;
      return element.singleStatus === 3 || element.canReadonly;
    },
    maxFileSize() {
      return this.element.maxFileSize;
    },
    uploadParam() {
      const { menuId } = this;
      if (!menuId) return;
      return { menuId };
    },
    count() {
      const { maxFileCount } = this.element;
      return maxFileCount || 1;
    },
    tip() {
      const { maxFileSize } = this;
      return `大小${maxFileSize}M内`;
    }
  },

  methods: {
    success({ files, otherParam }) {
      const { index } = otherParam;
      this.filesObj[index] = files;

      this.changeFileIds();
    },
    // 获取列表
    async gefileList() {
      this.fileIds = this.value;
      if (!this.value) return;
      try {
        const arry = this.value.split(',');
        const { count } = this;
        const images = {};
        for (let i = 0; i < count; i += 1) {
          let id = '';
          if (i <= arry.length) id = arry[i] || '';

          let image = [];
          if (id) {
            // eslint-disable-next-line no-await-in-loop
            image = await this.$store.dispatch('get_userCenter_filesInfo', id);
          }
          images[i + 1] = image;
        }
        this.filesObj = images;
      } catch (error) {
        console.error(error);
      }
    },
    // 删除图片
    deleteImage(index) {
      this.filesObj[index] = [];
      this.changeFileIds();
    },
    // 提交
    changeFileIds() {
      const valueObj = {};
      const { element } = this;
      const { compId } = element;

      const files = [];
      const { count } = this;
      let hasFiles = false;
      for (let i = 0; i < count; i += 1) {
        const fileList = this.filesObj[i + 1] || [];
        if (fileList.length === 0) files.push('');
        else {
          hasFiles = true;
          files.push(fileList[0].id);
        }
      }
      const fileIds = hasFiles ? files.join(',') : '';
      this.fileIds = fileIds;
      valueObj[compId] = fileIds;
      this.$emit('change', valueObj, element);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.tip {
  display: inline-block;
  margin-left: 8rpx;
  font-size: 26rpx;
  color: #c1c1c1;
}
.upload {
  margin-top: 10rpx;
}
.nodata {
  font-size: $form-el-fontSize;
  color: $form-el-placeholderColor;
}
</style>
