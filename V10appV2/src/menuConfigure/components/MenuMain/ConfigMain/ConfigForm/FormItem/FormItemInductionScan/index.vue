<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单-扫描
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal noboder">
      <section
        class="scanning"
        :class="[`themeColor__bg-font-${getThemeIndex}`]"
        @click.stop="gotoScan"
      >
        <i class="appIcon appIcon-saoma"></i>
        <span class="title"> {{ element.name }} </span>
      </section>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from '../elementMixin';

export default {
  components: {},

  mixins: [elementMixin],

  props: {
    // 最长可输入长度
    maxlength: {
      type: Number,
      default: 140
    }
  },

  data() {
    return {};
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 扫描项目类型，为了兼容h5定制化扫描1=标准；2=泸州老窖
    scanItemType() {
      const scanTypeArry = this.$store.getters.getCurDict('SCAN_ITEM_TYPE') || [];
      let type = 1;
      if (scanTypeArry.length > 0) {
        type = scanTypeArry[0].value;
      }
      return type;
    }
  },

  methods: {
    async gotoScan() {
      try {
        const { scanItemType } = this;
        const qrResult = await this.$apiot.scanCode({ scanItemType });
        const { result } = qrResult;
        this.valueChang(result);
      } catch (error) {
        console.error(error);
      }
    }
  },

  mounted() {},

  created() {}
};
</script>

<style lang='scss' scoped>
@import '../index.scss';
.noboder {
  box-shadow: none !important;
}
.scanning {
  width: 100%;
  margin: 12rpx 0;
  // margin: 4px 15px;
  height: $form-el-height;
  line-height: $form-el-height;
  text-align: center;

  border-radius: 12rpx;
  .title {
    font-size: $form-el-labelFontSize;
    color: $form-el-valueColor !important;
  }
  .appIcon-saoma {
    display: inline-block;
    font-size: 40rpx;
    margin-right: 15rpx;
  }
}
</style>
