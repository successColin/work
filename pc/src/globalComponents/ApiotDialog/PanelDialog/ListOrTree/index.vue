<template>
  <el-button-group class="btn__tab">
    <apiot-button
      :disabled="disabled && curType !== 1"
      class="btn__tab--item"
      :class="[{ active: curType === 1 }]"
      @click="changeShowType(1)"
    >
      <i class="iconfont icon-liebiaozhanshi"></i>
    </apiot-button>
    <apiot-button
      :disabled="disabled && curType !== 2"
      class="btn__tab--item"
      :class="[{ active: curType === 2 }]"
      @click="changeShowType(2)"
    >
      <i class="iconfont icon-shuzhanshi"></i>
    </apiot-button>
  </el-button-group>
</template>

<script>
export default {
  name: '',
  props: {
    curTypeValue: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      curType: 1
    };
  },
  components: {},
  mounted() {},
  methods: {
    changeShowType(v) {
      this.curType = v;
      this.$emit('update:curTypeValue', v);
      this.$emit('changeShowType', v);
    },
    changeCurType(v) {
      this.curType = v;
    }
  },
  watch: {
    curTypeValue: {
      handler(v) {
        this.curType = v;
      },
      immediate: true
    }
  }
};
</script>

<style lang='scss' scoped>
.btn {
  &__tab {
    box-sizing: border-box;
    width: 100px;
    height: 30px;
    display: flex;
    &--item {
      width: 40px;
      border: 1px solid #e9e9e9;
      color: #333333;
      cursor: pointer;
      line-height: 30px;
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: $--color-primary;
      &:not(:first-child) {
        margin-left: 1px;
      }
      &.active {
        background-color: $--color-primary !important;
        border-color: $--color-primary !important;
        color: #fff !important;
      }
    }
  }
}
</style>
