<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-评分
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
        <apiot-rate :showType="showType"></apiot-rate>
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

  computed: {
    showType() {
      const obj = {
        1: 'star', // 五角星；
        2: 'line-exp', // 线性表情；
        3: 'facial-exp', // 面性表情；
        4: 'flag' // 红旗
      };
      return obj[this.element.dividingType];
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

  mounted() {
    console.log(this.element);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.elementContent {
  height: 88rpx;
  line-height: 88rpx;
}
</style>
