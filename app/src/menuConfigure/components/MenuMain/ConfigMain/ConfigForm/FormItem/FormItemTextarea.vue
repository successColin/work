<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element topEl">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span>
        <slot name="elTilte"></slot>
      </view>
      <view class="elementContent">
        <apiot-textarea
          :value="value"
          :placeholder="element.placeholder"
          :maxlength="element.maxlength"
          :disabled="
            element.singleStatus === 2 ||
            element.singleStatus === 3 ||
            element.canReadonly
          "
          @input="handleInput"
          @blur="handleBlur"
        ></apiot-textarea>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  components: {},

  mixins: [elementMixin],

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {
    handleBlur(value) {
      this.textValue = value;
      this.valueChang(value);
    },
    handleInput(value) {
      const { element } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = value;
      this.$emit('input', valueObj);
    }
  },
  created() {
    this.textValue = this.value;
    console.log(this.value);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
