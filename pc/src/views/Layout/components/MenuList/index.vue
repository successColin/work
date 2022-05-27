<template>
  <div class="menuList">
    <h2>{{ moduleObj ? moduleObj.menuName : '' }}</h2>
    <section class="menuList__scroll">
      <div class="menuList__hiddenScroll">
        <el-menu
          :unique-opened="true"
          class="menuTra__menuBox"
          :default-active="activeIndex"
        >
          <MenuItem :item="allMenu" @itemClick="menuClick"></MenuItem>
        </el-menu>
      </div>
    </section>
  </div>
</template>

<script>
import bus from '@/utils/bus';
import { postChangeCollect } from '@/api/menuManage';
import MenuItem from './MenuItem';

export default {
  data() {
    return {
      favArr: [],
      allMenu: {},
      moduleObj: null,
      activeIndex: ''
    };
  },

  components: {
    MenuItem
  },

  computed: {},

  mounted() {
    bus.$on('initMenuList', this.initMenuList);
    this.$bus.$on('changeSelect', this.changeSelect);
  },

  methods: {
    changeSelect(item) {
      this.activeIndex = `${item.id}`;
    },
    initMenuList(moduleObj) {
      if (this.moduleObj && moduleObj.id === this.moduleObj.id) {
        return;
      }
      this.moduleObj = moduleObj;
      this.favArr = [];
      this.allMenu = {};
      this.$nextTick(() => {
        this.allMenu = moduleObj;
      });

      // this.menuCenterFav(moduleObj);
    },
    async menuCenterFav({ id, children }) {
      const params = {
        menuClientType: 'PC',
        menuLevel: 'MENU',
        parentId: id
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
    async changeCollect(menu, index, type) {
      await this.postChangeCollect(menu);
      menu.isCollect = !menu.isCollect;
      if (type === 'fav') {
        this.favArr.splice(index, 1);
      } else if (menu.isCollect) {
        this.favArr.push(menu);
      } else {
        const curIndex = this.favArr.findIndex((item) => item.id === menu.id);
        this.favArr.splice(curIndex, 1);
      }
    },
    async postChangeCollect({ id }) {
      await postChangeCollect({ menuId: id });
    },
    menuClick(menu) {
      this.changeSelect(menu);
      this.$bus.$emit('showMenu', false);
      bus.$emit('changeMenuTab', menu);
    }
  },

  beforeDestroy() {
    bus.$off('initMenuList', this.initMenuList);
    this.$bus.$off('changeSelect', this.changeSelect);
  }
};
</script>

<style lang='scss' scoped>
.menuList {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-right: 1px solid #e9e9e9;
  white-space: nowrap;
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
    height: calc(100% - #{$layoutHeader});
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
