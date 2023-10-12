<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-轮播图
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <!-- <view class="iframe" :style="iframeHeight">
      <iframe v-if="iframeUrl" :src="iframeUrl"></iframe>
    </view> -->
    <view class="swiper">
      <apiot-swiper
        keyName="imgUrl"
        :list="list"
        :height="itemHeight"
        :radius="element.borderType === 2 ? 8 : 0"
        :showType="element.showType === 2 ? 'card' : ''"
        :indicatorType="element.indicatorType"
        imgMode="scaleToFill"
      >
      </apiot-swiper>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  inject: ['getAllForm', 'resolveFormula', 'getFormScreenHeight'],
  components: {},

  mixins: [elementMixin],

  props: {},

  data() {
    return {
      swiperList: []
    };
  },

  computed: {
    itemHeight() {
      const { heightMul = 1 } = this.element;

      const height = heightMul * 110;
      return height;
    },
    list() {
      const { imgArr } = this.element;
      if (imgArr.length === 0) return [];
      return imgArr.map((item) => {
        if (item.imgUrl) item.imgUrl = this.$apiot.getComUrlByToken(item.imgUrl);
        return item;
      });
    }
  },

  methods: {},

  mounted() {},

  created() {}
};
</script>

<style lang='scss' scoped>
.swiper {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  background: #f6f6f8;
}
</style>
