<template name="mLabel">
  <!-- 显示框，可以显示任何数据，但不提交数据没必填验证-->
  <view
    class="mLabel formElemets"
    v-if="element.visiabled"
    :class="[
      element.labletPositon || 'left',
      isFocus ? inputFocusClass : '',
      element.readonly ? 'readonly' : '',
    ]"
  >
    <label
      class="text"
      :class="isLabelColor ? '' : 'drakcolor'"
      v-if="!isLogin"
    >
      {{ element.label }}
      <span
        v-if="element.requisite"
        class="icon iconfont iconmust-fill2 requisite"
      ></span>
    </label>
    <label
      :class="[showContent || isFocus ? 'text' : 'hide']"
      v-else
      :style="{ color: isFocus ? themeColorCode : '' }"
    >
      {{ element.label }}
    </label>
    <view class="content" :class="{ hasrelationTab: element.relationTabId }">
      <slot name="labels"></slot>
      <input
        class="input"
        :value="showContent"
        :disabled="disabled_"
        :password="element.inputType === 'password' && showPassword"
        :type="inputType"
        :placeholder="element.placeholderText"
        placeholder-class="placeholder"
        placeholder-style="color:#AAAAAA"
        :confirm-hold="false"
        auto-blur="true"
        @input="changeLabelColor"
        @focus="inputFocus"
        @blur="inputBlur"
      />
      <!-- 扫描按钮 -->
      <!-- #ifdef APP-PLUS -->
      <m-button
        v-if="element.elementFormat && !element.readonly"
        class="button"
        :isFontBtn="true"
        btnClass="mainColor"
        @elementClick="handleButton(element.elementFormat)"
      >
      <!-- #endif -->
      <!-- #ifndef APP-PLUS -->
      <m-button
        v-if="element.elementFormat && !element.readonly && QRType !== '0'"
        class="button"
        :isFontBtn="true"
        btnClass="mainColor"
        @elementClick="handleButton(element.elementFormat)"
      >
      <!-- #endif -->
        <block slot="buttonIcon" style="display: inline-block">
          <m-font-icon :icon="btnIcon" :iconSize="38"></m-font-icon>
        </block>
      </m-button>
      <slot name="btns"></slot>
    </view>
  </view>
</template>

<script>
// #ifdef APP-PLUS
import Static_NFC from '@/static/js/NFC.js';
import { readCardInit, readCard, closeReadCard } from '@/static/js/bridge.js';
// #endif
import { ELEMENT_INPUT_FORMAT } from '@/common/constant/element.js';
import { ELEMENT_SCAN } from '@/common/functions/element.js';
import { mapState, mapMutations } from 'vuex';
export default {
  name: 'mSearchSelect',
  props: {
    element: {
      type: Object,
      default() {
        return {};
      },
    },
    isEllipsis: { type: Boolean, default: false },
    showPassword: { type: Boolean, default: false },
    sourceType: { type: String, default: 'list' }, //来源 list forme advancedFilter
    value: { type: [Number, String] }, //值
    inputFocusClass: { type: String, default: 'inputFocus-red' },
    isLogin: { type: Boolean, default: false },
  },
  data() {
    return {
      showContent: '',
      isFocus: false,
      isInit: true,
      isLabel: false,
      isNumber: false,
      readRfidStatus: false, // 如果是rfid读卡的时候，对应的状态
      timer: null,
    };
  },
  computed: {
    ...mapState(['themeColorCode', 'readCardType', 'QRType']),
    // 读卡有2中方式：true=rfid射频读卡方式，适用于zc6000；false=nfc读卡，适用于zc4000与手机
    isRfid() {
      return this.readCardType === 'RFID';
    },
    isLabelColor() {
      //控制label颜色
      //可编辑并且没有值的时候，颜色变深
      if (!this.element.readonly && !this.showContent && !this.isLabel)
        return false;
      else return true;
    },
    inputType() {
      const type = this.element.inputType;
      if (type) return type === 'password' ? 'text' : type;
      else return this.isNumber ? 'digit' : 'text';
    },
    disabled_() {
      //如果存在按钮或者只读时不可编辑
      let inputDisabled = false;
      if (this.element.readonly || this.btnIcon) inputDisabled = true;
      return inputDisabled;
    },
    btnIcon() {
      //按钮图标
      return ELEMENT_INPUT_FORMAT[this.element.elementFormat] || '';
    },
  },
  watch: {
    value(newVal, oldVal) {
      if (this.sourceType !== 'list') {
        this.showContent = newVal;
      }
    },
    showContent(newVal) {
      if (this.sourceType !== 'list' && !this.isInit) {
        this.$emit('changeValue', {
          triggerBaseType: 2,
          element: this.element,
          value: this.showContent,
        });
      }
      this.isInit = false;
    },
  },
  methods: {
    ...mapMutations(['STATE_formElementFocus']),
    // #ifdef APP-PLUS
    handleButton(type) {
      //处理感应事件，例如NFC、二维码、条形码
      const _this = this;
      this.isInit = false;
      if (type === 1) {
        if (this.isRfid) {
          //rfid
          this.getCardByRfid();
        } else {
          // nfc
          const i18nMsg = (name) => {
            return this.$t(name);
          };
          new Static_NFC({
            readNFC: true,
            $i18nMsg: i18nMsg,
            callback(res) {
              _this.showContent = res.value;
            },
          });
        }
      } else if (type === 2) {
        //二维码
        ELEMENT_SCAN({}, (option) => {
          this.showContent = option.scancode;
        });
      }
    },
    clearRfid(isEnd) {
      // isEnd是否已经结束，如果结束，需要清空定时器，以及关闭读卡功能
      if (isEnd) {
        closeReadCard();
      }
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.readRfidStatus = false;
    },
    // 获取rfid读卡
    getCardByRfid() {
      if (this.readRfidStatus) return;
      this.timer = setTimeout(() => {
        // 读取超时关闭
        uni.showModal({
          title: this.$t('basic-modalTip'), //中文：'提示',
          content: this.$t('basic-timeout'), // 中文：'读取超时，请重新读取',
          showCancel: false,
          confirmText: this.$t('basic-confirm'),
        });
        this.clearRfid(true);
      }, 8000);
      readCardInit(() => {
        this.readRfidStatus = true;
        uni.showLoading({ title: this.$t('inspection-readNFC') }); // 中文：'准备读取NFC'
        setTimeout(() => {
          uni.hideLoading();
          uni.showToast({
            title: this.$t('inspection-NFCLabel'), // 中文：'请将NFC标签靠近！'
            icon: 'none',
          });
          this.readCardInfo();
        }, 1000);
      });
    },
    readCardInfo() {
      if (this.readRfidStatus) {
        readCard(
          (arg) => {
            this.clearRfid(false);
            this.showContent = arg[0];
          },
          () => {
            // 未读取到数据继续读取
            setTimeout(() => this.readCardInfo(), 1000);
          }
        );
      }
    },
    // #endif
    //设置聚焦
    inputFocus(e) {
      this.isFocus = true;
      this.STATE_formElementFocus(true);
    },
    inputConfirm() {
      this.isFocus = false;
    },
    inputBlur(e) {
      //失焦
      this.isInit = false;
      this.$nextTick(() => {
        this.isFocus = false;
        if (this.showContent === e.target.value)
          this.STATE_formElementFocus(false);

        this.showContent = e.target.value;
      });
    },
    changeLabelColor(event) {
      this.isLabel = event.detail.value ? true : false;
    },
  },
  created() {
    if (this.sourceType !== 'list') this.showContent = this.value;

    const intType = [2, 4, 7]; //业务表字段是数字类型的
    this.isNumber =
      intType.indexOf(this.element.relationColumnType) !== -1 ? true : false;
  },
  beforeDestroy() {
    // #ifdef APP-PLUS
    if (this.isRfid) this.clearRfid(true);
    // #endif
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
