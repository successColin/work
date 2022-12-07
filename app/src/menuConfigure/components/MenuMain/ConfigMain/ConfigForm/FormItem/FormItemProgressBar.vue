<!--
 * @Author: sss
 * @Date: 2022-10-28 09:01:20
 * @Last Modified by: sss
 * @Last Modified time: 2022-10-28 09:01:20
 * @Desc: 表单控件-进度条
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
        <apiot-progress-bar :value="value"></apiot-progress-bar>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  mixins: [elementMixin],

  components: {},

  props: {},

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
::v-deep{
  .element::after{
    box-shadow: none !important
  }
}
</style>
