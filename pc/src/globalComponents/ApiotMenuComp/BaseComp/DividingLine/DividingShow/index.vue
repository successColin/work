<template>
  <section class="dividing" :class="[{ isConfig: isConfig }]">
    <div
      :class="`dividing__detail dividing__detail${dividingType}`"
      v-if="dividingType === 1"
    >
      <span class="dividing__detail--name" :class="[{ notShow: !showTitle }]">{{
        dividingName
      }}</span>
    </div>
    <div
      :class="`dividing__detail dividing__detail${dividingType}`"
      v-if="dividingType === 2"
    >
      <span class="dividing__detail--name" :class="[{ notShow: !showTitle }]">{{
        dividingName
      }}</span>
    </div>
    <div
      :class="`dividing__detail dividing__detail${dividingType}`"
      v-if="dividingType === 3"
    >
      <i class="iconfont icon-shujiantoushouqi"></i>
      <span
        class="dividing__detail--name m-r-8"
        :class="[{ notShow: !showTitle }]"
        >{{ dividingName }}</span
      >
      <div class="dividing__detail--line"></div>
    </div>
    <div
      :class="`dividing__detail dividing__detail${dividingType} ${
        showTitle ? '' : 'notShow'
      }`"
      v-if="dividingType === 4"
    >
      <span class="dividing__detail--name" :class="[{ notShow: !showTitle }]">{{
        dividingName
      }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    dividingType: {
      type: Number,
      default: 1
    },
    dividingName: {
      type: String
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  inject: ['isConfig'],
  components: {}
};
</script>

<style lang='scss' scoped>
.dividing {
  box-sizing: border-box;
  padding: 4px 15px;
  width: 100%;
  &.isConfig {
    padding: 4px 15px;
  }
  &__detail {
    width: 100%;
    height: 44px;
    &--name {
      font-size: 16px;
      font-weight: 600;
      color: #333333;
      line-height: 16px;
      &.notShow {
        display: none;
      }
    }
    &--line {
      flex: 1;
      height: 14px;
      border-bottom: 1px solid #e9e9e9;
    }
  }
  &__detail1 {
    height: 32px;
    line-height: 32px;
    margin-bottom: 12px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
  }
  &__detail2 {
    height: 32px;
    line-height: 32px;
    margin-bottom: 12px;
    box-sizing: border-box;
    border-bottom: 1px dashed #e9e9e9;
  }
  &__detail3 {
    display: flex;
    align-items: center;
    margin-left: -4px;
    width: calc(100% + 4px);
    i {
      font-size: 18px;
      color: $--color-primary;
    }
  }
  &__detail4 {
    height: 32px;
    line-height: 32px;
    margin-bottom: 12px;
    box-sizing: border-box;
    border-bottom: 1px solid #e9e9e9;
    &.notShow {
      &:after {
        content: '';
        position: absolute;
        left: 10px;
        bottom: 16px;
        height: 2px;
        width: 30px;
        background-color: $--color-primary;
      }
    }
    .dividing__detail--name {
      position: relative;
      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -6px;
        height: 2px;
        background-color: $--color-primary;
      }
    }
  }
}
</style>
