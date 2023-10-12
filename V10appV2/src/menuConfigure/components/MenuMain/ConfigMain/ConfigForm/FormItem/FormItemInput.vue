<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span>
        <slot name="elTilte"></slot>
      </view>
      <view class="elementContent">
        <apiot-input
          :value="value"
          :type="type"
          :thousandth="element.thousandSign"
          border="none"
          :placeholder="element.placeholder"
          :prefixText="prefixText"
          :suffixText="suffixText"
          :digitNumber="element.decimalPlaces"
          :canVoice="true"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          :enableSpeech="element.enableSpeech"
          @input="handleInput"
          @blur="valueChang"
          :min="minNum"
          :max="maxNum"
        ></apiot-input>

        <i
          v-if="element.singleType === 2"
          @click="handlemakePhoneCall"
          class="appIcon appIcon-bohao elementContent__makePhoneCall"
        ></i>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  inject: ['resolveFormula'],

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
    minNum() {
      return this.getNumber(this.element?.minNumberObj);
    },
    maxNum() {
      return this.getNumber(this.element?.maxNumberObj);
    },
    prefixText() {
      const { decorateType, decorateContent } = this.element;
      if (decorateType === 1) return decorateContent;
      return '';
    },
    suffixText() {
      const { decorateType, decorateContent } = this.element;
      if (decorateType === 2) return decorateContent;
      return '';
    },
    type() {
      const { element } = this;
      const { dataSource, compType } = element;
      let elType = '';
      if (compType === 10) {
        elType = 'integer';
        switch (dataSource.columnTypeDict) {
          case '4':
            elType = 'digit';
            break;

          default:
            break;
        }
      } else {
        elType = 'text';
      }
      return elType;
    }
  },

  methods: {
    // 最大最小值
    getNumber(obj) {
      const defaultVal = undefined;
      if (!obj) return defaultVal;
      const { enable, type, value, formula } = obj;
      if (!enable) return defaultVal;
      if (type === 1) {
        return value;
      }
      if (type === 2) {
        return this.resolveFormula(true, formula);
      }
      return defaultVal;
    },
    handlemakePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.value
      });
    },
    handleInput(value) {
      const { element } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = value;
      this.$emit('input', valueObj);
    }
  },

  mounted() {},

  created() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.elementContent__makePhoneCall {
  font-size: 48rpx;
  color: #bbc3cd;
  margin-left: 10rpx;
}
</style>
