<!--
 * @Author: sss
 * @Date: 2022-03-05 10:28:16
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-05 10:28:16
 * @Desc: 证件图片上传1
-->
<template>
  <view class="apiotUploadCers">
    <div
      class="apiotUploadCers__content"
      :class="[`pic${count}`, count !== 2 ? 'hasBottom' : '']"
    >
      <div v-for="i in count" :key="i" class="apiotUploadCers__content--item">
        <uni-file-picker
          :auto-upload="false"
          :value="fileList[i] || []"
          :limit="1"
          :readonly="readonly"
          :disabled="disabled"
          :image-styles="{ width: '100%', height: '250rpx' }"
          return-type="object"
          :otherParam="{ index: i }"
          @select="select"
          @delete="deleteImage"
        >
          <section class="apiotUploadCers__add">
            <i class="appIcon appIcon-shangchuantubiao"></i>
            {{ placeholder }}
          </section>
        </uni-file-picker>
      </div>
    </div>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    fileList: Array,
    placeholder: {
      type: String,
      default: '请上传图片'
    },
    // 证件数
    count: {
      type: Number,
      default: 1
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 图片尺寸，以MB为单位
    size: {
      type: Number,
      default: 2
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    select(e) {
      const { tempFiles } = e;
      const { size } = this;
      const index = tempFiles.findIndex((item) => item.size > size * 1024 * 1024);
      if (index !== -1) {
        this.$refs.uToast.show({
          type: 'error',
          message: `单张图片不能超过${size}MB`
        });
        return;
      }
      this.$emit('select', e);
    },
    deleteImage(e) {
      this.$emit('deleteImage', e);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.apiotUploadCers {
  &__content {
    &.pic2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 18rpx 18rpx;
    }
    &.hasBottom &--item {
      &:not(:last-child) {
        margin-bottom: 20rpx;
      }
    }
  }
  &__add {
    text-align: center;
    color: #666666;
    .appIcon {
      font-size: 50rpx;
      display: block;
    }
  }
}
</style>
