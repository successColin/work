<!--
 * @Author: sss
 * @Date: 2022-06-13 10:57:27
 * @Last Modified by: sss
 * @Last Modified time: 2022-06-13 10:57:27
 * @Desc: 树节点
-->
<template>
  <p
    class="commonTreeNode"
    :class="[{ animateListClick: isClick }]"
    @click.stop="handleClick"
  >
    <i
      v-if="prefixIcon"
      class="prefixIcon appIcon"
      :class="[`appIcon-${prefixIcon}`]"
      :style="{ color: prefixIconColor }"
    ></i>
    <span class="name">{{ value[showColumn] }}</span>
    <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
  </p>
</template>

<script>
export default {
  components: {},

  props: {
    value: Object,
    showColumn: {
      type: String,
      default: 'name'
    },
    prefixIcon: {
      type: String,
      default: 'jiaose'
    },
    prefixIconColor: {
      type: String,
      default: '#4689F5'
    }
  },

  data() {
    return {
      isClick: false
    };
  },

  computed: {},

  methods: {
    handleClick() {
      this.isClick = true;
      setTimeout(() => {
        this.isClick = false;
      }, 250);
      this.$emit('click', this.value);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.commonTreeNode {
  padding: 30rpx 0;
  display: flex;
  align-items: center;
  background: #fff;
  box-shadow: inset 0 -1rpx 0 0 #e9e9e9;
  .prefixIcon {
    font-size: 60rpx;
    margin-right: 10rpx;
  }
  .name {
    font-size: 32rpx;
    font-family: $--font-family;
    color: #333333;
    flex: 1;
  }
  .appIcon-a-shujuxuanzejinru {
    font-size: 48rpx;
    color: #bbc3cd;
  }
}
</style>
