<!--
 * @Author: sss
 * @Date: 2022-03-10 14:42:54
 * @Last Modified by: sss
 * @Last Modified time: 2022-03-10 14:42:54
 * @Desc: 树-点击路径
-->
<template>
  <u-sticky
    :offsetTop="offsetTop"
    :customNavHeight="customBar"
    v-if="rootPath.length"
  >
    <section class="treePath">
      <div class="treePath__content">
        <scroll-view
          scroll-x="true"
          class="scroll-Y"
          :scroll-left="scrollLeft"
          scroll-with-animation
        >
          <section class="treePath__path">
            <div
              v-for="(item, index) in rootPath"
              :key="index"
              class="treePath__path--item"
              :class="[index === rootPath.length - 1 ? 'activitied' : '']"
              :id="`path_${index}`"
              @click="clickPath(item, index, index === rootPath.length - 1)"
            >
              <i
                v-if="index !== 0 && index < rootPath.length"
                class="appIcon appIcon-a-shujuxuanzejinru"
              ></i>
              <span>{{ item.nodeName }}</span>
            </div>
          </section>
        </scroll-view>
      </div>
    </section>
  </u-sticky>
</template>

<script>
export default {
  components: {},

  props: {
    rootPath: Array,
    offsetTop: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      scrollLeft: 0
    };
  },

  computed: {
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.statusBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    }
  },

  watch: {
    rootPath() {
      this.$nextTick(() => {
        this.scrollLeft = this.rootPath.length * 200;
      });
    }
  },

  methods: {
    // 点击路径
    clickPath(node, index, isActitive) {
      console.log('clickPath');
      const rootPath = [...this.rootPath];
      if (isActitive) return;

      const del = index + 1;
      rootPath.splice(del, rootPath.length - del);
      this.$emit('update:rootPath', rootPath);
      this.$emit('click', node, index);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.treePath {
  background: #fff;
  &__content {
    box-sizing: border-box;
    width: 100%;
    padding: 0 30rpx;
    overflow: hidden;
  }
  &__path {
    display: flex;
    align-items: center;

    &--item {
      flex-shrink: 0;
      height: 88rpx;
      font-size: 28rpx;
      font-family: $--font-family;
      color: #333333;
      display: flex;
      align-items: center;
      .appIcon-a-shujuxuanzejinru {
        font-size: 38rpx;
      }
    }
    .activitied {
      color: #808080;
    }
  }
}
</style>
