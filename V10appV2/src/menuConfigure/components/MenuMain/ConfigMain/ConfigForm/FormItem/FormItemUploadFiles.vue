<!--
 * @Author: sss
 * @Date: 2022-01-22 09:20:36
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:20:36
 * @Desc: 配置表单-文件上传
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
        <span class="nodata"> {{ `无${modeTile}` }} </span>
      </template>
      <view class="upload" v-else>
        <apiot-upload-files
          :mode="mode"
          :title="element.placeholder || `上传${element.name}`"
          :fileList="fileList"
          :limit="count"
          :size="element.maxFileSize"
          :showType="showTypeName"
          :param="uploadParam"
          :disabled="disabled"
          :readonly="disabled"
          @success="success"
          @delFile="deleteImage"
        ></apiot-upload-files>
      </view>
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
      fileList: [],
      fileIds: ''
    };
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
    }
  },

  computed: {
    disabled() {
      const { element } = this;
      return element.singleStatus === 2 || element.singleStatus === 3 || element.canReadonly;
    },
    noData() {
      const { disabled, value = [] } = this;
      if ((!value || value.length === 0) && disabled) return true;
      return false;
    },
    modeTile() {
      const { mode } = this;
      if (mode === 'image') return '图片';
      if (mode === 'veido') return '视频';
      return '附件';
    },
    mode() {
      const { element } = this;
      const { compType } = element;
      if (compType === 13) return 'file';
      if (compType === 24) return 'veido';
      return 'image';
    },
    showTypeName() {
      if (this.element.showType === 1) return 'grid';
      return 'list-card';
    },
    uploadParam() {
      const { menuId } = this;
      if (!menuId) return;
      return { menuId };
    },
    count() {
      const { maxFileCount } = this.element;
      return maxFileCount || 999999;
    },
    tip() {
      const { element, count } = this;
      const { maxFileSize, adviseTip } = element;
      if (adviseTip) return adviseTip;
      if (count === 999999) return `图片大小${maxFileSize}M内`;
      return `大小${maxFileSize}M内,数量不超过${count}`;
    }
  },

  methods: {
    success({ files }) {
      this.fileList = [...files];
      this.changeFileIds();
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
    // 删除图片
    deleteImage({ files }) {
      this.fileList = [...files];
      this.changeFileIds();
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
.nodata {
  font-size: $form-el-fontSize;
  color: $form-el-placeholderColor;
}
</style>
