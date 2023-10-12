<template>
  <div>
    <transition-group
      name="move-right"
      class="menuBox"
      :class="[{ needScroll: item.children && item.children.length > 15 }]"
    >
      <div v-for="child in item.children" :key="child.id">
        <el-menu-item
          :index="`${child.id}`"
          :key="child.id"
          class="menuBox__content"
          @click="itemClick(child)"
          :title="child.menuName"
          v-if="+child.menuLevel === 2"
        >
          <span v-showEllipsis="10">{{ child.menuName }}</span
          ><i
            :class="`isCollect iconfont ${
              child.isCollect
                ? 'icon-shoucangxuanzhong'
                : 'icon-shoucangweixuanzhong'
            }`"
            @click.stop="changeCollect(child)"
          ></i>
        </el-menu-item>
        <el-submenu :index="`${child.id}`" class="bbb" v-else>
          <span slot="title">
            <img
              :src="$parseImgUrl(child.icon.imageUrl)"
              class="iconImg"
              v-if="child.icon && child.icon.imageUrl"
            />
            <i
              :class="`iconfont ${child.icon ? child.icon.icon : 'icon_shuju'}`"
              :style="`color:${child.icon ? child.icon.color : '#5A80ED'}`"
              v-else
            ></i>
            <span v-showEllipsis="10">{{ child.menuName }}</span>
          </span>
          <MenuItem
            @changeCollect="changeCollect"
            @itemClick="itemClick"
            :item="child"
          ></MenuItem>
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
    },
    changeCollect(child) {
      this.$emit('changeCollect', child);
    }
  }
};
</script>

<style lang='scss' scoped>
.menuBox {
  box-sizing: border-box;
  border-right: 0 none;
  max-height: 660px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  &.needScroll {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .iconfont {
    font-size: 20px;
    margin-right: 8px;
  }
  .menuList__item--img {
    display: flex;
    align-items: center;
  }
  .iconImg {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  .nav--item__active {
    color: $--color-primary !important;
  }
  &__content {
    span {
      margin-left: 13px;
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
    left: 170px;
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
      &:hover {
        span {
          color: $--color-primary;
        }
      }
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
      font-size: 13px;
      padding-right: 20px;
      &:hover {
        span {
          color: $--color-primary;
        }

        .isCollect {
          opacity: 1;
          transform: scale(1);
        }
      }
    }
    .el-submenu__icon-arrow {
      left: 170px;
      right: auto;
    }
  }
}
</style>
<style lang='scss'>
.el-menu--vertical {
  .el-menu-item-group__title {
    display: none;
  }
}
</style>
