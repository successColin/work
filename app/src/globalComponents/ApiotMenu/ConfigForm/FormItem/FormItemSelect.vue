<!--
 * @Author: sss
 * @Date: 2022-01-22 09:20:36
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:20:36
 * @Desc: 配置表单-输入框
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
        <apiot-select-down
          :value="value"
          :dictKey="
            element.dataSource.dictObj && element.dataSource.dictObj.dictKey
          "
          :placeholder="element.placeholder"
          :dropDownStyle="element.dropDownStyle"
          :multiple="element.dropDownType === 2"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @change="valueChang"
        ></apiot-select-down>
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

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
