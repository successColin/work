<!--
 * @Author: sss
 * @Date: 2022-05-23 16:38:02
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-23 16:38:02
 * @Desc: 文本提示框
-->
<template>
  <div class="textTip" :style="[bgStyle]">
    <div class="textTip__title" v-if="title">
      <span class="lineBlock" v-if="iconName">
        <label-icon
          :name="iconName"
          :color="color"
          :size="$apiot.rpx2px(iconSize)"
        ></label-icon>
      </span>
      <span class="title" :style="[titleStyle]">{{ title }}</span>
    </div>
    <div class="textTip__content" v-if="content">
      <span class="lineBlock" v-if="!title && iconName">
        <label-icon
          :name="iconName"
          :color="color"
          :size="$apiot.rpx2px(34)"
        ></label-icon>
      </span>
      <span :style="[contentStyle]">{{ content }}</span>
    </div>
  </div>
</template>

<script>
import LabelIcon from '@/menuConfigure/components/MenuMain/LabelIcon';
import mpMixin from '@/mixin/mpMixin';

export default {
  mixins: [mpMixin],
  components: { LabelIcon },

  props: {
    // 图标名称
    iconName: String,
    iconSize: {
      type: Number,
      default: 34
    },
    title: String,
    color: String,
    titleStyle: Object,
    content: String,
    contentStyle: Object,
    bgStyle: Object
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.textTip {
  width: 100%;
  box-sizing: border-box;
  &__title {
    .title {
      font-size: $form-el-fontSize;
      @include fontBlob(500);
      color: #333333;
      letter-spacing: 1px;
    }
  }
  &__content {
    margin-top: 10rpx;
    font-size: $form-el-labelFontSize;
    color: #a3a3a3;
    line-height: 32rpx;
    letter-spacing: 1px;
    word-wrap: break-word;
  }
  .lineBlock {
    display: inline-block;
    margin-right: 10rpx;
  }
}
</style>
