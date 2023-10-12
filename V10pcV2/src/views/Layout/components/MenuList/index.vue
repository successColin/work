<template>
  <div class="menuList">
    <h2>{{ moduleObj ? moduleObj.menuName : '' }}</h2>
    <div class="menuList__search">
      <my-search v-model.trim="keywords"></my-search>
    </div>
    <section class="menuList__scroll">
      <div class="menuList__hiddenScroll">
        <el-menu
          :unique-opened="true"
          class="menuTra__menuBox"
          :default-active="activeIndex"
        >
          <MenuItem
            :item="getTraRouteArr"
            @itemClick="menuClick"
            @changeCollect="changeCollect"
          ></MenuItem>
        </el-menu>
      </div>
    </section>
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
      favArr: [],
      allMenu: {},
      canFav: true,
      moduleObj: null,
      activeIndex: '',
      keywords: '',
    };
  },

  components: {
    MenuItem,
    MySearch,
  },

  computed: {
    getTraRouteArr() {
      const allModuleArr = [this.allMenu];
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
        console.log(tempArr[0]);
        return tempArr[0];
      }
      return allModuleArr[0];
    },
  },

  mounted() {
    bus.$on('initMenuList', this.initMenuList);
    this.$bus.$on('changeSelect', this.changeSelect);
  },

  methods: {
    resolveKeyword(menuArr) {
      const arr = [];
      menuArr.forEach((child) => {
        if (
          child.menuName.toLowerCase().indexOf(this.keywords.toLowerCase()) !==
          -1
        ) {
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
    changeSelect(item) {
      this.activeIndex = `${item.id}`;
    },
    initMenuList(moduleObj) {
      if (this.moduleObj && moduleObj.id === this.moduleObj.id) {
        return;
      }
      this.keywords = '';
      this.favArr = [];
      this.allMenu = {};

      this.moduleObj = moduleObj;
      this.$nextTick(() => {
        this.allMenu = moduleObj;
      });
    },
    async menuCenterFav({ id, children }) {
      const params = {
        menuClientType: 'PC',
        menuLevel: 'MENU',
        parentId: id,
      };

      const data = await this.$store.dispatch('getFavRoute', params);
      this.favArr = [];
      children.forEach((menu) => {
        data.forEach((favMenu) => {
          if (favMenu.id === menu.id) {
            menu.isCollect = true;
            this.favArr.push(menu);
          }
        });
      });
    },
    // 改变是否收藏
    async changeCollect(menu) {
      console.log(this.canFav, menu);
      if (!this.canFav) {
        return;
      }
      this.canFav = false;
      if (!menu.isCollect && this.favArr.length >= 12) {
        this.$message({
          type: 'warning',
          message: this.$t('menu.collectUpTo12Menus'),
        });
        this.canFav = true;
        return;
      }
      try {
        menu.isCollect = !menu.isCollect;
        this.$store.getters.getRouteObj[menu.id].isCollect = menu.isCollect;
        console.log(menu);
        await this.postChangeCollect(menu);

        if (menu.isCollect) {
          this.getTraRouteArr.children.unshift(menu);
        } else {
          const curIndex = this.getTraRouteArr.children.findIndex(
            (item) => item.id === menu.id,
          );
          this.getTraRouteArr.children.splice(curIndex, 1);
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
            showStr: isCollect
              ? this.$t('menu.collection')
              : this.$t('menu.unfavorite'),
          },
        },
      });
      setTimeout(() => {
        this.canFav = true;
      }, 500);
    },
    menuClick(menu) {
      this.changeSelect(menu);
      // this.$bus.$emit('showMenu', false);
      bus.$emit('changeMenuTab', menu, true);
    },
  },

  beforeDestroy() {
    bus.$off('initMenuList', this.initMenuList);
    this.$bus.$off('changeSelect', this.changeSelect);
  },
};
</script>

<style lang="scss" scoped>
.menuList {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e9e9e9;
  white-space: nowrap;
  &__search {
    box-sizing: border-box;
    padding: 0px 18px 0;
  }
  h2 {
    box-sizing: border-box;
    padding-top: 10px;
    margin: 0 18px 10px;
    line-height: 40px;
    height: 50px;
    font-size: 13px;
    font-weight: 600;
    color: #333333;
    border-bottom: 1px solid #e9e9e9;
  }
  &__scroll {
    height: calc(100% - #{$layoutHeader} - 38px);
    position: relative;
  }
  &__hiddenScroll {
    overflow: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: -50px;
  }
}
</style>
