<!--
 * @Author: sss
 * @Date: 2022-10-28 09:01:20
 * @Last Modified by: sss
 * @Last Modified time: 2022-10-28 09:01:20
 * @Desc: 列表控件-进度条
-->
<template>
  <view
    class="listLabel"
    :class="[element.alignStyle === 2 ? 'labelRight' : '']"
    :style="[labelStyle]"
  >
    <span class="listLabel__title" v-if="element.showLabelTitle"
      >{{ element.name }}：</span
    >
    <apiot-progress-bar :value="value"></apiot-progress-bar>
  </view>
</template>

<script>
import indexMixin from './indexMixin';

export default {
  mixins: [indexMixin],

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
</style>
