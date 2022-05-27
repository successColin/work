<!--
 * @Descripttion: 更多操作/收藏
 * @Author: ytx
 * @Date: 2022-02-21 09:01:36
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-21 09:01:36
-->
<template>
  <apiot-popup :show="show" @close="handleClose">
    <section class="rename">
      <div class="rename__title">{{ title }}</div>
      <apiot-input
        class="rename__search"
        placeholder="请输入重命名"
      ></apiot-input>
      <footer>
        <u-button
          class="rename__cancel m-r-12"
          text="取消"
          @click="handleClose"
        ></u-button>
        <u-button
          class="rename__ok"
          type="primary"
          text="确定"
          @click="handleOk"
        ></u-button>
      </footer>
    </section>
  </apiot-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '文件重命名'
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {
    show(v) {
      console.log(v);
    }
  },
  mounted() {},
  methods: {
    // 取消、关闭
    handleClose() {
      this.$emit('close');
    },
    // 按钮__确定
    handleOk() {
      this.$emit('ok');
    }
  }
};
</script>
<style lang='scss' scoped>
.rename {
  margin: 0 30rpx;
  &__title {
    margin-top: 30rpx;
    line-height: 80rpx;
  }
  &__search {
    margin: 20rpx 0 40rpx;
    ::v-deep {
      .u-input {
        background: #fafafa;
      }
      .u-border {
        border-color: #fff !important;
      }
    }
  }
  footer {
    display: flex;
    padding: 19rpx 3rpx;
    background: #ffffff;
  }
}
</style>
