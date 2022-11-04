<!--
 * @Descripttion: 筛选
 * @Author: ytx
 * @Date: 2022-01-29 16:26:32
 * @Last Modified by: ytx
 * @Last Modified time: 2022-01-29 16:26:32
-->
<template>
  <section class="popupLine">
    <div
      :class="[
        'popupLine__type',
        item.name ? 'popupLine__bgd' : '',
        item.state ? 'popupLine__selected' : '',
      ]"
      v-for="(item, index) in arr"
      :key="index"
      @click="handleClick(item)"
    >
      <i
        v-if="item.url"
        class="popupLine__type--img appIcon"
        :class="item.url"
      ></i>
      <i
        v-if="item.state && item.name"
        class="popupLine__type--selected appIcon appIcon-shaixuanxuanzhong"
      ></i>
      {{ item.name }}
    </div>
  </section>
</template>

<script>
export default {
  props: {
    arr: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleClick(v) {
      if (v.name) {
        this.arr.forEach((item) => {
          item.state = false;
        });
        v.state = true;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.popupLine {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  &__type {
    // flex: 1;
    margin-top: 10px;
    width: 30%;
    margin-right: 18rpx;
    height: 68rpx;
    border-radius: 12px;
    font-size: 28rpx;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    &--img {
      width: 33rpx;
      height: 37rpx;
      margin-right: 11rpx;
    }
    &--selected {
      width: 28rpx;
      height: 28rpx;
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  // &__type:last-child {
  //   margin-right: 0;
  // }
  &__bgd {
    background: #f6f6f8;
  }
  &__selected {
    background: #f1f7ff;
  }
}
</style>
