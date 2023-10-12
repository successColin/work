<template>
  <view class="dateRange">
    <view class="mDatePicker noBorder" :class="[element.labletPositon]">
      <label class="text">{{ element.label }}</label>
      <div class="content startDate">
        <input
          class="input"
          :value="value.start"
          disabled="true"
          @tap="showPicker('start')"
        />
      </div>
    </view>
    <view class="mDatePicker" :class="[element.labletPositon]">
      <label class="text">{{ $t('time-to') }}</label>
      <div class="content">
        <input
          class="input"
          :value="value.end"
          disabled="true"
          @tap="showPicker('end')"
        />
      </div>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    element: {
      type: Object,
      default() {
        return {};
      },
    },
    isEllipsis: { type: Boolean, default: false },
    sourceType: { type: String, default: 'form' }, //来源 list forme advancedFilter
    value: {
      type: Object,
      default() {
        return { start: '', end: '' };
      },
    }, //值
  },
  methods: {
    showPicker(type) {
      if (type === 'start') this.$emit('selectStart');
      else this.$emit('selectEnd');
    },
  },
};
</script>
<style scoped>
.dateRange {
  border-bottom: solid 1px #f5f5f5;
}
</style>
