<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-分割线
-->
<template>
  <view
    class="divider"
    :class="{ title: !!element.showLabelTitle, hasRaduis: layout === 'row' }"
  >
    <template v-if="element.showLabelTitle">{{ element.name }}</template>
  </view>
</template>

<script>
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {},

  mixins: [mpMixin],

  props: {
    element: Object,
    // 类型
    lineType: {
      type: Number,
      default: 1
    },
    // 位置
    layout: {
      type: String,
      default: 'column'
    }
  },

  data() {
    return {};
  },

  computed: {},

  watch: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.divider {
  padding-top: 25rpx;
  background: #f6f6f8;
  font-size: 36rpx;
  font-family: PingFangSC-Medium, PingFang SC;
  @include fontBlob(500);
  color: #333333;
  &.title {
    padding: 25rpx 30rpx;
  }
  &.hasRaduis {
    border-radius: -50px;
  }
}
</style>
