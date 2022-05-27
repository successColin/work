<!--
 * @Author: sss
 * @Date: 2022-02-10 11:33:12
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-10 11:33:12
 * @Desc: label框
-->
<template>
  <view class="label">
    <types-column
      v-if="enableDict"
      :value="value || ''"
      :typesPropName="dictName"
      :hornType="labelStyle"
      :size="fontSize + 6"
      :enableDictIcon="enableDictIcon"
    ></types-column>
    <view class="label__value" v-else>{{ value || '' }}</view>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: [Number, String],
    title: [Number, String],
    canShowIcon: {
      type: Boolean,
      default: true
    },
    // 是否是字典
    enableDict: {
      type: Boolean,
      default: true
    },
    dictName: String,
    enableDictIcon: {
      type: Boolean,
      default: false
    },
    labelStyle: [String, Number],
    icon: {
      type: Object,
      default() {
        return {
          icon: '', // 字体图标
          color: '', // 图标颜色
          imageUrl: '' // 自定义图标
        };
      }
    },
    fontSize: {
      type: Number,
      default: 12
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>
