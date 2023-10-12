<template>
  <div class="timeControl">
    <div class="timeControl__left">{{ transWord[curValue] }}</div>
    <span class="timeControl__control" @click="des">-</span>
    <div class="timeControl__right">
      <div
        class="timeControl__right--circle"
        :style="`left: ${15 * curValue}px `"
      ></div>
    </div>
    <span class="timeControl__control" @click="add">+</span>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    curTimeVal: {
      type: Number,
    },
  },
  data() {
    return {
      curValue: 4,
      transWord: ['年', '季', '月', '周', '日', '时'],
    };
  },
  components: {},
  methods: {
    des() {
      this.curValue -= 1;
      if (this.curValue < 0) {
        this.curValue = 0;
      }
    },
    add() {
      this.curValue += 1;
      if (this.curValue > 5) {
        this.curValue = 5;
      }
    },
  },
  watch: {
    curValue(v) {
      this.$emit('timeRangeChange', v);
    },
    curTimeVal(v) {
      this.curValue = v;
    },
  },
};
</script>

<style lang="scss" scoped>
.timeControl {
  width: 198px;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  border: 1px solid #e9e9e9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 12px;
  &__left {
    color: #333;
    width: 46px;
    border-right: 1px solid #e9e9e9;
  }
  &__control {
    width: 30px;
    font-weight: bold;
    font-size: 16px;
    cursor: pointer;
    color: #bbc3cd;
    &:hover {
      color: $--color-primary;
    }
  }
  &__right {
    position: relative;
    flex: 1;
    height: 4px;
    border-radius: 3px;
    background-color: #bbc3cd;
    margin-top: 2px;
    &--circle {
      position: absolute;
      width: 16px;
      height: 16px;
      left: 0;
      top: -7px;
      background-color: #fff;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.24);
      border-radius: 50%;
    }
  }
}
</style>
