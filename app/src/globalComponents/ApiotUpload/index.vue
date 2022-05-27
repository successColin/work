<!--
 * @Author: sss
 * @Date: 2022-01-12 15:23:01
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-12 15:23:01
 * @Desc: 图片上传
-->
<template>
  <view class="apiotUpload">
    <uni-file-picker
      :auto-upload="false"
      :value="fileList"
      :limit="limit"
      :readonly="readonly"
      :disabled="disabled"
      :fileMediatype="mode"
      @select="select"
      @delete="deleteImage"
    >
    </uni-file-picker>
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
export default {
  name: 'apiotUpload',
  components: {},

  props: {
    mode: {
      type: String,
      default: 'image'
    },
    fileList: Array,
    httpRequest: {
      type: Function,
      default() {
        return function () {};
      }
    },
    limit: {
      type: Number,
      default: 9
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
    return {
      imageValue: [],
      uploadLish: [
        {
          name: '1.png',
          uploadData: '2021-01-01 15:00:00',
          url: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
        },
        {
          name: '2.png',
          uploadData: '2021-01-01 15:00:00',
          url: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
        },
        {
          name: '3.png',
          uploadData: '2021-01-01 15:00:00',
          url: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
        },
        {
          name: '4.png',
          uploadData: '2021-01-01 15:00:00',
          url: 'https://cdn.uviewui.com/uview/swiper/1.jpg'
        }
      ]
    };
  },

  computed: {
    showList() {
      const { uploadLish, fileList = [] } = this;
      return [...uploadLish, ...fileList];
    },
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    }
  },

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
.apiotUpload {
  width: 100%;
  &__btn {
    height: 39px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #e9e9e9;
  }
  .appIcon-shangchuan {
    margin-right: 4rpx;
    font-size: 24px;
  }
}
</style>
