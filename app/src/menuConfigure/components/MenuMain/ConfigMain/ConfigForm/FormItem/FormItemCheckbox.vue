<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-多选框
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
        <apiot-checkboxs
          :value="value"
          :dictKey="
            element.dataSource.dictObj && element.dataSource.dictObj.dictKey
          "
          :sort="element.sort !== 2 ? 'asc' : 'desc'"
          :placeholder="element.placeholder"
          :dropDownStyle="element.dropDownStyle"
          :position="element.anyway === 1 ? 'row' : 'column'"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @change="valueChang"
        ></apiot-checkboxs>
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
