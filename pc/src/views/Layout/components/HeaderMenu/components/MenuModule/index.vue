<template>
  <apiot-drawer
    :visible.sync="visible"
    direction="ltr"
    :modal="false"
    :append-to-body="true"
    :hasFooter="false"
    :withHeader="false"
    class="drawer"
    v-if="[3].includes($store.getters.getMenuType)"
  >
    <div class="drawer__noScroll">
      <transition name="move-right">
        <section class="module" v-if="favArr.length">
          <h2 class="module__title m-b-10">收藏模块</h2>
          <transition-group class="module__wrapper" tag="ul" name="move-right">
            <li
              class="module__item"
              v-for="(moduleObj, index) in favArr"
              :key="moduleObj.id"
              @click="openMneuList(moduleObj)"
            >
              <div class="module__img">
                <img
                  :src="$parseImgUrl(moduleObj.icon.imageUrl)"
                  class="iconImg"
                  v-if="moduleObj.icon && moduleObj.icon.imageUrl"
                />
                <i
                  :class="`iconfont ${
                    moduleObj.icon ? moduleObj.icon.icon : 'icon_shuju'
                  }`"
                  :style="`color:${
                    moduleObj.icon ? moduleObj.icon.color : '#5A80ED'
                  }`"
                  v-else
                ></i>
              </div>
              <p class="font__ellipsis">{{ moduleObj.menuName }}</p>
              <i
                :class="`isCollect iconfont ${
                  moduleObj.isCollect
                    ? 'icon-shoucangxuanzhong'
                    : 'icon-shoucangweixuanzhong'
                }`"
                @click.stop="changeCollect(moduleObj, index, 'fav')"
              ></i>
            </li>
          </transition-group>
        </section>
      </transition>

      <section class="module">
        <h2 class="module__title m-b-10">全部模块</h2>
        <ul class="module__wrapper">
          <li
            class="module__item"
            v-for="(moduleObj, index) in getModule"
            :key="moduleObj.id"
            @click="openMneuList(moduleObj)"
          >
            <div class="module__img">
              <img
                :src="$parseImgUrl(moduleObj.icon.imageUrl)"
                class="iconImg"
                v-if="moduleObj.icon && moduleObj.icon.imageUrl"
              />
              <i
                :class="`iconfont ${
                  moduleObj.icon ? moduleObj.icon.icon : 'icon_shuju'
                }`"
                :style="`color:${
                  moduleObj.icon ? moduleObj.icon.color : '#5A80ED'
                }`"
                v-else
              ></i>
            </div>
            <p class="font__ellipsis">{{ moduleObj.menuName }}</p>
            <i
              :class="`isCollect iconfont ${
                moduleObj.isCollect
                  ? 'icon-shoucangxuanzhong'
                  : 'icon-shoucangweixuanzhong'
              }`"
              @click.stop="changeCollect(moduleObj, index, 'all')"
            ></i>
          </li>
        </ul>
      </section>
    </div>

    <i class="iconfont icon-guanbi" @click="visible = false"></i>
  </apiot-drawer>
</template>

<script>
import bus from '@/utils/bus';
import { postChangeCollect } from '@/api/menuManage';

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      favArr: [], // 收藏数组
      timer: null,
      canFav: true
    };
  },

  components: {},

  computed: {
    // 显示隐藏
    visible: {
      get() {
        return this.drawer;
      },
      set(v) {
        this.$emit('update:drawer', v);
      }
    },
    // 获取module
    getModule() {
      return this.$store.getters.getRouteArr;
    }
  },

  mounted() {
    this.menuCenterFav();
    this.$nextTick(() => {
      this.getFirstModule();
    });
  },

  methods: {
    async menuCenterFav() {
      const params = {
        menuClientType: 'PC',
        menuLevel: 'MODULE'
      };

      const data = await this.$store.dispatch('getFavRoute', params);
      this.favArr = [];
      this.getModule.forEach((moduleObj) => {
        data.forEach((favModule) => {
          if (favModule.id === moduleObj.id) {
            moduleObj.isCollect = true;
            this.favArr.push(moduleObj);
          }
        });
      });
    },
    // 改变是否收藏
    async changeCollect(menu) {
      if (!this.canFav) {
        return;
      }
      this.canFav = false;
      try {
        menu.isCollect = !menu.isCollect;
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
    },
    // 点击跳转菜单列表
    openMneuList(moduleObj) {
      this.visible = false;
      const index = this.getModule.findIndex((item) => {
        if (moduleObj.id === item.id) {
          return true;
        }
        return false;
      });
      if (index !== -1) {
        sessionStorage.moduleIndex = index;
      }
      bus.$emit('initMenuList', moduleObj);
      bus.$emit('openMenuList', true);
    },

    // 循环直至获取到值
    getFirstModule() {
      this.timer = setInterval(() => {
        if (this.getModule.length) {
          clearInterval(this.timer);
          bus.$emit('initMenuList', this.getModule[sessionStorage.moduleIndex || 0]);
        }
      }, 100);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang='scss' scoped>
.icon-guanbi {
  position: absolute;
  right: 16px;
  top: 16px;
  font-size: 16px;
  color: #aaaaaa;
  cursor: pointer;
  &:hover {
    color: $--color-primary;
  }
}
.drawer__noScroll {
  position: absolute;
  left: 0;
  right: -30px;
  height: 100%;
  overflow: scroll;
}
.module {
  &__title {
    box-sizing: border-box;
    font-weight: 600;
    color: #333333;
    text-shadow: 0px 4px 20px rgba(0, 0, 0, 0.14);
    height: 48px;
    font-size: 16px;
    line-height: 48px;
    padding-left: 20px;
    border-bottom: 1px solid #e9e9e9;
  }
  &__wrapper {
    padding-left: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  &__item {
    position: relative;
    box-sizing: border-box;
    width: 120px;
    height: 140px;
    text-align: center;
    margin-right: 24px;
    margin-bottom: 10px;
    padding-top: 24px;
    border-radius: 8px;
    cursor: pointer;
    background-color: #fff;
    // box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.14);
    &:hover {
      background: #f1f3f6;
      .isCollect {
        display: block;
      }
    }
    p {
      margin-top: 26px;
      font-weight: 400;
      color: #666666;
      font-size: 13px;
      line-height: 20px;
      text-shadow: 0px 4px 20px rgba(0, 0, 0, 0.14);
    }
    .isCollect {
      position: absolute;
      display: none;
      right: 8px;
      top: 8px;
      color: #fab71c;
      font-size: 13px;
    }
  }
  &__img {
    overflow: hidden;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    margin: 0 auto;
    .iconImg {
      width: 60px;
      height: 60px;
    }
    .iconfont {
      font-size: 60px;
    }
  }
}
</style>
