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
          border="none"
          :placeholder="element.placeholder"
          :prefixText="prefixText"
          :suffixText="suffixText"
          :digitNumber="element.decimalPlaces"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @input="handleInput"
          @blur="valueChang"
        ></apiot-input>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

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
      if (compType === 10) elType = 'integer';
      switch (dataSource.columnTypeDict) {
        case '4':
          elType = 'digit';
          break;

        default:
          break;
      }
      return elType;
    }
  },

  methods: {
    handleInput(value) {
      const { element } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = value;
      this.$emit('input', valueObj);
    }
  },

  mounted() {},

  created() {
    console.log('输入框=====================');
    console.log(this.element);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
