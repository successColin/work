<!--
 * @Author: sss
 * @Date: 2022-01-22 08:45:18
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-22 08:45:18
 * @Desc: 配置表单控件
-->
<template>
  <u-form-item :prop="element.compId" v-if="compShow">
    <view class="element normal">
      <view class="elementLabel"
        >{{ element.name
        }}<span v-if="element.shouldRequired" class="required">*</span></view
      >
      <view class="elementContent">
        <apiot-datepicker
          :value="value"
          :title="element.name"
          :mode="element.compType === 8 ? 'date' : 'datetime'"
          :placeholder="element.placeholder"
          :maxDate="maxTime"
          :minDate="minTime"
          :disabled="element.singleStatus === 2 || element.canReadonly"
          :readonly="element.singleStatus === 3 || element.canReadonly"
          @change="valueChang"
        ></apiot-datepicker>
      </view>
    </view>
  </u-form-item>
</template>

<script>
import elementMixin from './elementMixin';

export default {
  components: {},

  mixins: [elementMixin],
  inject: ['resolveFormula'],

  props: {},

  data() {
    return {};
  },

  computed: {
    // 最大时间
    maxTime() {
      const { element } = this;
      const { maxTimeObj } = element;
      const { type, maxTime, formula } = maxTimeObj;
      if (!type || type === 1) return maxTime;
      return this.resolveFormula(true, formula);
    },
    // 最小时间
    minTime() {
      const { element } = this;
      const { minTimeObj } = element;
      const { type, minTime, formula } = minTimeObj;
      if (!type || type === 1) return minTime;
      return this.resolveFormula(true, formula);
    }
  },

  methods: {
    valueChang(value) {
      const { element } = this;
      const { compId } = element;
      const valueObj = {};
      valueObj[compId] = this.$apiot.dateFormat(value, 'yyyy-MM-dd hh:mm:ss');
      this.$emit('change', valueObj, element);
    }
  },

  filters: {
    dataFormat(value) {
      return value ? Number(value) : Number(new Date());
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
