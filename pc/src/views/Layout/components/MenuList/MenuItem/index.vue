<template>
  <div>
    <transition-group name="move-right" class="menuBox">
      <div
        :index="child.id.toString()"
        v-for="child in item.children"
        :key="child.id"
      >
        <el-menu-item
          :index="`${child.id}`"
          class="menuList__item menuBox__content"
          @click="itemClick(child)"
          :title="child.menuName"
          v-if="+child.menuLevel === 2"
        >
          <div class="menuList__item--img">
            <img
              :src="child.icon.imageUrl"
              class="iconImg"
              v-if="child.icon && child.icon.imageUrl"
            />
            <i
              :class="`iconfont ${child.icon ? child.icon.icon : 'icon_shuju'}`"
              :style="`color:${child.icon ? child.icon.color : '#5A80ED'}`"
              v-else
            ></i>
          </div>
          <span class="menuList__item--text" v-showEllipsis>
            {{ child.menuName }}
          </span>
        </el-menu-item>
        <el-submenu :index="`${child.id}`" v-else>
          <span slot="title">
            <img
              :src="child.icon.imageUrl"
              class="iconImg"
              v-if="child.icon && child.icon.imageUrl"
            />
            <i
              :class="`iconfont ${child.icon ? child.icon.icon : 'icon_shuju'}`"
              :style="`color:${child.icon ? child.icon.color : '#5A80ED'}`"
              v-else
            ></i>
            <span v-showEllipsis>{{ child.menuName }}</span>
          </span>
          <MenuItem @itemClick="itemClick" :item="child"></MenuItem>
        </el-submenu>
      </div>
    </transition-group>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object
    }
  },
  name: 'MenuItem',
  data() {
    return {};
  },
  mounted() {},
  components: {},
  methods: {
    itemClick(item) {
      this.$emit('itemClick', item);
    }
  }
};
</script>

<style lang='scss' scoped>
.menuBox {
  box-sizing: border-box;
  padding-top: 10px;
  border-right: 0 none;
  .iconfont {
    font-size: 20px;
    margin-right: 18px;
  }
  .nav--item__active {
    color: $--color-primary !important;
  }
  &__content {
    span {
      color: #666666;
      &:hover {
        color: $--color-primary;
      }
    }
    &.is-active {
      background-color: #edf3fe;
      span {
        color: $--color-primary;
      }
    }
  }
  .isCollect {
    position: absolute;
    left: 226px;
    color: #fab71c;
    font-size: 13px;
    will-change: transform;
    transition: all 400ms;
    opacity: 0;
    transform: scale(0);
  }
  ::v-deep {
    .el-submenu__title {
      height: 48px;
      line-height: 48px;
    }
    .el-menu-item-group__title {
      height: 0;
      padding: 0;
      overflow: hidden;
    }
    .el-menu-item {
      height: 44px;
      line-height: 44px;
      color: #333;
      position: relative;
      &:hover .isCollect {
        opacity: 1;
        transform: scale(1);
      }
    }
    .el-submenu__icon-arrow {
      left: 228px;
      right: auto;
    }
  }
}
.menuList {
  &__item {
    position: relative;
    display: flex;
    height: 44px;
    align-items: center;
    cursor: pointer;
    padding: 0 18px;
    color: #666666;

    &--img {
      overflow: hidden;
      width: 24px;
      height: 24px;
      margin-right: 18px;
      display: flex;
      align-items: center;
      .iconImg {
        vertical-align: top;
        width: 20px;
        height: 20px;
        margin: 0;
      }
      .iconfont {
        font-size: 20px;
      }
    }
    &--text {
      font-size: 13px;
      font-weight: 400;
    }
  }
}
</style>
