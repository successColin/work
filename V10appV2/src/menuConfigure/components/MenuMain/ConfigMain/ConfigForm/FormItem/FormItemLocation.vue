<!--
 * @Author: sss
 * @Date: 2022-01-22 09:45:24
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 09:45:24
 * @Desc: 配置表单-定位
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
        <apiot-Fixed
          :value="location"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @change="fixedChang"
        ></apiot-Fixed>
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
    return {
      location: []
    };
  },

  computed: {},

  watch: {
    value: {
      handler(newValue) {
        if (newValue) {
          try {
            let location = newValue;
            if (typeof newValue === 'string') location = JSON.parse(newValue);
            // eslint-disable-next-line prefer-destructuring
            if (location.length > 0) location = location[0];
            const { lat, latitude, lng, longitude } = location;
            location.latitude = latitude || lat;
            location.longitude = longitude || lng;
            this.location = [location];
          } catch (error) {
            this.location = [];
          }
        }
      },
      immediate: true
    }
  },

  methods: {
    fixedChang(value) {
      if (value && value.longitude) {
        value = JSON.stringify([value]);
      } else value = '';
      this.valueChang(value);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
.elementContent {
  overflow: hidden;
}
</style>
