<!--
 * @Author: sss
 * @Date: 2022-10-28 09:01:20
 * @Last Modified by: sss
 * @Last Modified time: 2022-10-28 09:01:20
 * @Desc: 列表控件-图片
-->
<template>
  <view
    v-if="icon"
    class="listImgs"
    :class="[isLeft ? 'left' : 'top', source === 1 ? 'listIcon' : '']"
  >
    <template v-if="source === 1">
      <label-icon
        :name="icon.icon"
        :color="icon.color"
        customPrefix="iconfont"
        :size="31"
      ></label-icon>
    </template>
    <template v-else>
      <div
        class="pics"
        @click.stop="previewImage"
        :style="{ height: `${imageHeight}px` }"
      >
        <div class="listImgs_image">
          <image
            mode="widthFix"
            :src="firstImagUrl"
            :style="{ top: `-${topH}px` }"
            @load="imageLoad"
          ></image>
        </div>
        <div class="subscript" v-if="images.length > 1">
          +{{ images.length - 1 }}
        </div>
      </div>
    </template>
  </view>
</template>

<script>
import LabelIcon from '../../../LabelIcon';

export default {
  components: { LabelIcon },

  props: {
    element: Object,
    value: [Object, Number, String, Boolean],
    // 来源 1=来源字典；2=来源字段
    source: {
      type: Number,
      default: 1
    },
    iconValue: {
      type: [Object, String],
      default: ''
    },
    // 图片样式,只有来源为字段时才能采用；1=小图；2=大图
    imgType: {
      type: Number,
      default: 2
    },
    // 高度
    imgHeight: {
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      images: [],
      imageLoadHeight: 0,
      queryInfo: null
    };
  },

  computed: {
    // 是否需要加水印
    isWatermark() {
      return this.$store.getters.getWatermark;
    },
    // 是否左右布局
    isLeft() {
      const { source, imgType } = this;
      if (source === 1) return true;
      if (imgType === 1) return true;
      return false;
    },
    // 图标名称
    icon() {
      const { source, iconValue } = this;
      if (source === 2) return iconValue;
      const { iconDictKey, colorDictKey, iconValue: iconParam, colorValue } = iconValue;
      const iconDictValues = this.$store.getters.getCurDict(iconDictKey);
      let colorDictValues = {};
      const iconDictValue = iconDictValues.find((dic) => dic.value === iconParam) || '';
      // 如果图标不为空
      if (iconDictValue && iconDictValue.icon.icon) {
        const param = {
          icon: iconDictValue.icon.icon
        };
        if (iconDictKey === colorDictKey) colorDictValues = [...iconDictValues];
        else {
          colorDictValues = this.$store.getters.getCurDict(colorDictKey);
          let colorDictValue = colorDictValues.find((dic) => dic.value === colorValue) || '';
          if (!colorDictValue) colorDictValue = [...iconDictValues];
          param.color = colorDictValue.icon.color;
        }
        return param;
      }
      return '';
    },
    // 首张图
    firstImagUrl() {
      const { source, images } = this;
      if (source === 1 || images.length === 0) return '';
      const img = images[0];
      return this.$apiot.getComUrlByToken(img.url);
    },
    imageHeight() {
      const { imgHeight } = this;
      const h = imgHeight * 180;
      return this.$apiot.rpx2px(h);
    },
    // 加载出来图片的偏移量
    topH() {
      const { imageHeight, imageLoadHeight } = this;
      return this.$apiot.preview.calculateOffset(imageHeight, imageLoadHeight);
    }
  },

  watch: {
    iconValue: {
      handler() {
        if (this.source === 2) this.gefileList();
      },
      immediate: true
    }
  },

  methods: {
    // 获取列表
    async gefileList() {
      if (!this.iconValue) return;
      try {
        const image = await this.$store.dispatch('get_userCenter_filesInfo', this.iconValue);
        this.images = [...image];
      } catch (error) {
        console.error(error);
      }
    },
    // 图片预览
    previewImage() {
      this.$apiot.preview.previewFile({
        file: this.images,
        isWatermark: this.isWatermark,
        fileParamUrl: 'url',
        fileParamName: 'name',
        currentIndex: 0
      });
    },
    imageLoad() {
      // this.imageLoadHeight = height;
      this.queryInfo.select('.listImgs_image').boundingClientRect();
      this.queryInfo.exec((data) => {
        if (data.length > 0) {
          this.imageLoadHeight = data[0].height;
        }
      });
    }
  },

  mounted() {
    // 获取元素节点信息，请查看uniapp相关文档
    this.queryInfo = uni.createSelectorQuery().in(this);
    // #ifdef MP-ALIPAY
    this.queryInfo = uni.createSelectorQuery();
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.listImgs {
  flex-shrink: 0;
  .pics {
    position: relative;
    border-radius: 10rpx;
    overflow: hidden;
  }
  &_image {
    width: 100%;
    position: absolute;
    image {
      height: 100%;
      width: 100%;
    }
  }
  &.left {
    margin-right: 20rpx;
    .pics {
      width: 180rpx;
      height: 234rpx;
    }
  }
  &.top {
    width: 100%;
    margin-bottom: 20rpx;
    .pics {
      width: 100%;
      height: 234rpx;
    }
  }
  &.listIcon {
    width: 62rpx;
    height: 62rpx;
  }
  .subscript {
    color: #fff;
    background: rgba(0, 0, 0, 0.22);
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 24rpx;
    line-height: 29rpx;
    padding: 0 10rpx;
    border-radius: 14rpx;
  }
}
</style>
