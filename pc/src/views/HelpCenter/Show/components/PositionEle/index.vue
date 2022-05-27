<!--
 * @Descripttion: 右侧固定
 * @Author: ytx
 * @Date: 2021-06-04 09:03:43
 * @Last Modified by: ytx
 * @Last Modified time: 2021-06-04 09:03:43
-->
<template>
  <el-card class="positionEle" v-show="position.length > 1">
    <div
      v-for="(item, index) in position"
      :key="index"
      class="positionEle__item"
      :class="{ currentSelected: rightClickIndex === index }"
      @click="handleJump(index, item)"
    >
      <i></i>
      <div class="font__ellipsis">
        {{ item.title || item }}
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    position: {
      type: Array,
      default: () => []
    },
    jumpToEle: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // 右侧点击位置
      rightClickIndex: 0
    };
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    // 跳转对应的值
    handleJump(index, item) {
      this.rightClickIndex = index;
      this.jumpToEle(index, item);
    }
  }
};
</script>
<style lang='scss' scoped>
.positionEle {
  width: 140px;
  position: absolute;
  right: 33px;
  top: 0;
  font-size: 13px;
  color: #666666;
  &__item {
    height: 36px;
    display: flex;
    align-items: center;
    cursor: pointer;
    i {
      width: 4px;
      height: 4px;
      background: #bbc3cd;
      border-radius: 50%;
      display: inline-block;
      margin: 0 14px 0 22px;
    }
    .font__ellipsis {
      flex: 1;
    }
  }
  .currentSelected {
    i {
      background: $--color-primary;
    }
    color: $--color-primary;
  }
  ::v-deep {
    // 右侧固定
    .el-card__body {
      padding: 10px 0;
    }
  }
}
</style>
