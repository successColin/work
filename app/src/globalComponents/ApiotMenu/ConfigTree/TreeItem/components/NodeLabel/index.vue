<!--
 * @Author: sss
 * @Date: 2022-02-22 10:19:30
 * @Last Modified by: sss
 * @Last Modified time: 2022-02-22 10:19:30
 * @Desc: 树label
-->
<template>
  <view class="treeLabel" @click.stop="clickItem()">
    <span class="name">{{ showValue }}</span>
    <i
      v-if="value.childCount !== 0"
      class="appIcon appIcon-a-shujuxuanzejinru"
    ></i>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: Object,
    elements: Array,
    linkSymbol: String
  },

  data() {
    return {};
  },

  computed: {
    // 筛选出显示的控件
    elementsShow() {
      const { elements } = this;
      return elements.filter((el) => el.singleStatus !== 4) || [];
    },
    showValue() {
      const { elementsShow, value, linkSymbol } = this;
      const show = [];
      elementsShow.forEach((el) => {
        if (value[el.compId]) show.push(value[el.compId]);
      });
      return show.join(linkSymbol);
    }
  },

  methods: {
    clickItem() {
      this.$emit('click', this.value, this.showValue);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.treeLabel {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 25rpx 0;
  font-size: 16px;
  font-family: PingFangSC-Regular, PingFang SC;
  color: #333333;
  line-height: 20px;
  .name {
    flex: 1;
  }
  .appIcon-a-shujuxuanzejinru {
    flex-shrink: 0;
    font-size: 24px;
    color: #bbc3cd;
  }
}
</style>
