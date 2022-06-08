<template>
  <div class="fileManage">
    <div class="fileManage__number">{{ num }}</div>
    <div class="fileManage__desc">{{ dec }}</div>
    <div class="fileManage__placeholder" v-if="placeholder">
      {{ placeholder }}
    </div>
    <div class="fileManage__button">
      <i :class="`iconfont ${icon}`"></i>
      {{ buttonName }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 1
    },
    dec: {
      type: String,
      default: ''
    },
    buttonName: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.fileManage {
  width: 100%;
  height: 36px;
  border: 1px solid #e9e9e9;
  display: flex;
  align-items: center;
  position: relative;
  &__number {
    width: 20px;
    height: 20px;
    background: #4689f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-left: 16px;
  }
  &__desc {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    margin-left: 8px;
  }
  &__placeholder {
    font-size: 14px;
    color: #aaaaaa;
    margin-left: 40px;
    border-left: 1px solid #e9e9e9;
    height: 100%;
    display: flex;
    align-items: center;
    padding-left: 14px;
  }
  &__button {
    height: 100%;
    position: absolute;
    right: 0;
    width: 114px;
    background: #ffffff;
    border-left: 1px solid #e9e9e9;
    font-size: 14px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    .iconfont {
      font-size: 16px;
      color: #4689f5;
      margin-right: 5px;
    }
  }
}
</style>
