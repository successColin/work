<template>
  <div class="menuTra">
    <div class="menuTra__search">
      <my-search v-model="keywords"></my-search>
    </div>
    <div class="menuTra__noScroll">
      <el-menu
        :unique-opened="true"
        class="menuTra__menuBox"
        :default-active="activeIndex"
        :default-openeds="getOpenedArr"
        :collapse="true"
      >
        <transition-group name="move-right">
          <el-submenu
            :index="item.id.toString()"
            v-for="item in getTraRouteArr"
            :key="item.id"
            :title="item.menuName"
          >
            <template slot="title">
              <img
                :src="$parseImgUrl(item.icon.imageUrl)"
                class="iconImg"
                v-if="item.icon && item.icon.imageUrl"
              />
              <i
                :class="`iconfont ${item.icon ? item.icon.icon : 'icon_shuju'}`"
                :style="`color:${item.icon ? item.icon.color : '#5A80ED'}`"
                v-else
              ></i>
              <span v-showEllipsis="10">{{ item.menuName }}</span>
            </template>
            <el-menu-item-group>
              <MenuItem
                :item="item"
                @itemClick="itemClick"
                @changeCollect="changeCollect"
              ></MenuItem>
            </el-menu-item-group>
          </el-submenu>
        </transition-group>
      </el-menu>
    </div>
  </div>
</template>

<script>
import bus from '@/utils/bus';
import { postChangeCollect } from '@/api/menuManage';
import MySearch from '../HeaderMenu/components/MySearch';
import MenuItem from './MenuItem';

export default {
  data() {
    return {
      keywords: '',
      favArr: [],
      canFav: true,
      activeIndex: '',
      openedArr: []
    };
  },

  components: {
    MySearch,
    MenuItem
  },

  computed: {
    // 选出为true的favArr
    getFavArr() {
      return this.favArr.filter((menu) => menu.isCollect);
    },
    getTraRouteArr() {
      const favObj = {
        menuName: this.$t('menu.myCollection'),
        id: -1,
        children: this.getFavArr,
        icon: {
          color: '#FAB71C',
          icon: 'icon-caidanshoucang',
          imageUrl: ''
        }
      };
      const allModuleArr = [...this.$store.getters.getRouteArr];
      if (this.getFavArr.length) {
        allModuleArr.unshift(favObj);
      }
      const tempAllArr = JSON.parse(JSON.stringify(allModuleArr));
      if (this.keywords) {
        const tempArr = [];
        tempAllArr.forEach((item) => {
          if (item.children) {
            const tempChildren = this.resolveKeyword(item.children);
            if (tempChildren.length) {
              const tempItem = JSON.parse(JSON.stringify(item));
              tempItem.children = tempChildren;
              tempArr.push(tempItem);
            }
          }
        });
        return tempArr;
      }
      return allModuleArr;
    },
    getOpenedArr() {
      if (this.keywords) {
        const arr = [];
        this.getTraRouteArr.forEach((item) => {
          arr.push(item.id.toString());
          if (item.children) {
            item.children.forEach((menu) => {
              arr.push(menu.id.toString());
            });
          }
        });
        return arr;
      }
      return [];
    }
  },

  mounted() {
    this.menuCenterFav();
    this.$bus.$on('changeSelect', this.changeSelect);
  },

  methods: {
    changeSelect(item) {
      this.activeIndex = `${item.id}`;
    },
    resolveKeyword(menuArr) {
      const arr = [];
      menuArr.forEach((child) => {
        if (child.menuName.toLowerCase().indexOf(this.keywords.toLowerCase()) !== -1) {
          arr.push(child);
        } else if (child.children) {
          const res = this.resolveKeyword(child.children);
          if (res.length) {
            child.children = res;
            arr.push(child);
          }
        }
      });
      return arr;
    },
    itemClick(item) {
      this.changeSelect(item);
      // this.$bus.$emit('showMenu', false);
      bus.$emit('changeMenuTab', item);
    },
    // 获取收藏的菜单
    async menuCenterFav() {
      const params = {
        menuClientType: 'PC',
        menuLevel: 'MENU'
      };

      const data = await this.$store.dispatch('getFavRoute', params);
      this.favArr = [];
      data.forEach((favMenu, index) => {
        const menu = this.$store.getters.getRouteObj[favMenu.id];
        if (menu) {
          menu.isCollect = true;
          data[index] = menu;
        }
      });
      this.favArr = data.reverse();
    },
    // 改变是否收藏
    async changeCollect(menu) {
      // console.log(this.canFav);
      if (!this.canFav) {
        return;
      }
      this.canFav = false;
      if (!menu.isCollect && this.favArr.length >= 12) {
        this.$message({
          type: 'warning',
          message: this.$t('menu.collectUpTo12Menus')
        });
        this.canFav = true;
        return;
      }
      try {
        menu.isCollect = !menu.isCollect;
        this.$store.getters.getRouteObj[menu.id].isCollect = menu.isCollect;
        await this.postChangeCollect(menu);

        if (menu.isCollect) {
          this.favArr.unshift(menu);
        } else {
          const curIndex = this.favArr.findIndex((item) => item.id === menu.id);
          this.favArr.splice(curIndex, 1);
        }
      } catch (error) {
        menu.isCollect = !menu.isCollect;
        this.canFav = true;
      }
    },
    async postChangeCollect({ id, isCollect, menuName }) {
      await postChangeCollect({
        menuId: id,
        isCollect,
        logData: {
          operateType: 2,
          menuId: {
            name: menuName,
            showStr: isCollect ? this.$t('menu.collection') : this.$t('menu.unfavorite')
          }
        }
      });
      setTimeout(() => {
        this.canFav = true;
      }, 500);
    }
  },

  beforeDestroy() {
    this.$bus.$off('changeSelect', this.changeSelect);
  }
};
</script>

<style lang='scss' scoped>
.menuTra {
  position: relative;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #fff;
  border-right: 1px solid #e9e9e9;
  .notShow {
    position: absolute;
    left: -10000px;
    width: 0;
    height: 0;
    overflow: hidden;
    padding: 0;
    border: 0 none;
  }
  &__search {
    box-sizing: border-box;
    padding: 14px 18px 0;
  }
  &__noScroll {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: -30px;
    overflow-y: auto;
  }

  &__menuBox {
    box-sizing: border-box;
    padding-top: 10px;
    border-right: 0 none;
    margin-left: -2px;
    width: 240px;
    .iconfont {
      font-size: 20px;
      margin-right: 8px;
    }
    .iconImg {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
    .nav--item__active {
      color: $--color-primary !important;
    }
    .isCollect {
      position: absolute;
      left: 190px;
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
        font-size: 13px;
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
        position: relative;
        &:hover .isCollect {
          opacity: 1;
          transform: scale(1);
        }
      }
      .el-submenu__icon-arrow {
        left: 192px;
        right: auto;
      }
    }
  }
}
</style>
