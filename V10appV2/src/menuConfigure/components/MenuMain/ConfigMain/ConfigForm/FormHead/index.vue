<!--
 * @Author: sss
 * @Date: 2022-05-19 19:26:23
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-19 19:26:23
 * @Desc: 表单头
-->
<template>
  <div class="formHead" @click.stop="clickTitle">
    {{ title }}
    <i
      class="appIcon appIcon-xialajiantou"
      :class="[status ? 'isHidden' : '']"
    ></i>
  </div>
</template>

<script>
export default {
  components: {},

  props: {
    title: String
  },

  data() {
    return {
      status: false
    };
  },

  computed: {},

  methods: {
    clickTitle() {
      this.status = !this.status;
      this.$emit('click');
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.formHead {
  position: relative;
  padding: 0 30rpx;
  width: 100%;
  height: 100rpx;
  font-size: 36rpx;
  @include fontBlob(500);
  color: #333333;
  line-height: 100rpx;
  box-shadow: inset 0 -2rpx 0 0 #e9e9e9;
  .appIcon-xialajiantou {
    position: absolute;
    right: 30rpx;
    transition: all 0.2s linear;
    color: #999;
    font-size: 48rpx;
  }
  .isHidden {
    transform: rotate(180deg);
    border-bottom: 0 none;
  }
}
</style>
