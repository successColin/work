<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件-开关
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span>
        <slot name="elTilte"></slot>
      </view>
      <view class="elementContent switch">
        <SwitchEL
          v-model="V"
          :disabled="
            element.singleStatus === 2 ||
            element.singleStatus === 3 ||
            element.canReadonly
          "
          :activeValue="element.activeValue"
          :inactiveValue="element.inactiveValue"
          :showContent="element.showContent"
          @change="valueChang"
        ></SwitchEL>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import SwitchEL from '../../../SwitchEl';
import elementMixin from './elementMixin';

export default {
  components: {
    SwitchEL
  },

  mixins: [elementMixin],

  props: {},

  data() {
    return {
      V: ''
    };
  },

  computed: {},

  watch: {
    value: {
      handler(v) {
        this.V = v;
      },
      immediate: true
    }
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.switch {
  height: $form-el-height;
  display: flex;
  align-items: center;
  padding: 10rpx 0;
}
</style>
