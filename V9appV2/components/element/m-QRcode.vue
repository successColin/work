<template name="mQrcode">
  <!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
  <view v-if="element.visiabled">
    <view
      class="mQrcode formElemets"
      :class="[
        element.labletPositon || 'left',
        element.readonly ? 'readonly' : '',
      ]"
    >
      <label class="text" :class="value || element.readonly ? '' : 'drakcolor'">
        {{ element.label }}
        <span
          v-if="element.requisite"
          class="icon iconfont iconmust-fill2 requisite"
        ></span>
      </label>
      <view class="content" :class="{ hasrelationTab: element.relationTabId }">
        <view class="qrcode-item">
          <!-- <p>{{value}}</p> -->
          <input class="input" :value="value" disabled="true" />
          <!-- <m-font-icon icon="APP_59" color="#C62127" :iconSize="iconsize"></m-font-icon> -->
          <m-button
            v-if="value"
            class="button select"
            :isFontBtn="true"
            btnClass="mainColor"
          >
            <block slot="buttonIcon" style="display: inline-block">
              <m-font-icon
                icon="APP_59"
                @click="checkQrcode"
                :iconSize="38"
              ></m-font-icon>
            </block>
          </m-button>
        </view>
      </view>
      <!-- 二维码弹窗 -->
      <view class="qrcode-pop" v-if="showCode">
        <view class="qrcode-wrap">
          <tki-qrcode
            class="qrcode-image"
            cid="myQR"
            ref="myQR"
            :val="value"
            :onval="onval"
            :loadMake="loadMake"
            :usingComponents="true"
            :size="270"
            :longtap="true"
            @result="qrR"
          />
          <p>{{ $t('basic-saveQrcode') }}</p>
          <button class="cancel-qrcode" type="default" @click="checkQrcode">
            取消
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import tkiQrcode from '@/components/plugin/tki-qrcode/tki-qrcode.vue';
export default {
  name: 'mQrcode',
  components: {
    tkiQrcode,
  },
  data() {
    return {
      icon: '', // 二维码图标
      iconsize: 40, // 二维码图标大小
      lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
      onval: true, // val值变化时自动重新生成二维码
      loadMake: true, // 组件加载完成后自动生成二维码
      src: '', // 二维码生成后的图片地址或base64
      showCode: false,
    };
  },
  props: {
    element: {
      type: Object,
      default() {
        return {};
      },
    },
    sourceType: { type: String, default: 'form' }, //来源 list forme advancedFilter
    value: { type: [Number, String] }, //值
  },
  methods: {
    qrR(res) {
      console.log(res);
      this.src = res;
    },
    checkQrcode() {
      this.showCode = this.showCode ? false : true;
    },
    saveQrcode() {
      this.$refs.myQR._saveCode();
    },
  },
};
</script>
<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
