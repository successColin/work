<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单-NFC
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal noboder" @click.stop="gotoNFC">
      <section class="nfc" :class="[`themeColor__bg-font-${getThemeIndex}`]">
        <i class="appIcon appIcon-NFC"></i>
        <span class="title">
          {{ time ? `${time}s` : '' }} {{ element.name }}
        </span>
      </section>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from '../elementMixin';
import StaticNFC from './NFC.js';

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
    return {
      rootId: '',
      time: 0,
      staticNFC: null
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    gotoNFC() {
      if (this.time) return;
      this.staticNFC = new StaticNFC({
        tagId: this.rootId,
        timeout: 30000,
        readCallback: (res) => {
          if (res.tagId === this.rootId) {
            this.valueChang(res.value);
          } else this.time = 0;
        },
        timeoutCallback: (res) => {
          if (res.tagId === this.rootId) {
            this.time = res.time;
          } else this.time = 0;
        }
      });

      try {
        this.staticNFC.redNfc();
        this.$apiot.toast(this.$t('inspection.lang-NFC-near'));
      } catch (error) {
        const { code, platform } = error;
        if (code !== 400) return;
        let msg = 'NFC功能不支持,请检测NFC功能是否开启';
        if (platform === 'ios') msg = '苹果手机,暂不支持NFC功能';
        this.$apiot.toast(msg);
      }
    }
  },

  mounted() {},

  created() {
    this.rootId = this._uid;
  }
};
</script>

<style lang='scss' scoped>
@import '../index.scss';
.noboder {
  box-shadow: none !important;
}
.nfc {
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
  .appIcon-NFC {
    display: inline-block;
    font-size: 40rpx;
    margin-right: 15rpx;
  }
}
</style>
