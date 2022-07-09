<template>
  <apiot-drawer
    :visible.sync="visible"
    v-if="$store.state.globalConfig.menuType === 1"
    direction="ltr"
    :append-to-body="true"
    :hasFooter="false"
    :withHeader="false"
  >
    <section class="content">
      <section class="content__left">
        <!-- 输入框 -->
        <my-search v-model="keywords"></my-search>
        <!-- 最近访问 -->
        <div class="recently" v-if="recentlyTabArr.length !== 0">
          <div class="recently__font">{{ $t('menu.recentVisits') }}</div>
          <div
            class="recently__info font__ellipsis"
            v-for="(item, i) in recentlyTabArr"
            :key="`${item.id}_${i}`"
            :style="`width: calc(${
              100 / recentlyTabArr.length
            }% - 60px);max-width: fit-content`"
            :title="item.menuName"
          >
            <span @click="handleClickMenu(item)">{{ item.menuName }}</span>
          </div>
        </div>
        <!-- 菜单 -->
        <div
          class="content__menuInfo"
          :class="[
            recentlyTabArr.length !== 0
              ? 'content__menuInfo--height2'
              : 'content__menuInfo--height1',
          ]"
        >
          <!-- {{ height }} -->
          <div ref="menu" class="content__container">
            <div>
              <!-- 我的收藏 -->
              <div
                class="collection"
                v-if="menuCenterFavArr.length !== 0"
                :ref="myCollection"
              >
                <div class="collection__font need__pos--height">
                  {{ $t('menu.myCollection') }}
                </div>
                <transition-group
                  class="collection__info"
                  :name="transitionName"
                >
                  <div
                    v-for="item in menuCenterFavArr"
                    :key="`${item.id}`"
                    :title="item.menuName"
                  >
                    <div
                      class="collection__hover titBox"
                      @click="handleClickMenu(item)"
                    >
                      <img
                        class="collection__iconSize"
                        v-if="item.icon && item.icon.imageUrl"
                        :src="item.icon && item.icon.imageUrl"
                      />
                      <i
                        :class="[
                          'iconfont collection__iconSize',
                          item.icon && item.icon.icon,
                        ]"
                        :style="{ color: item.icon && item.icon.color }"
                        v-else-if="item.icon && item.icon.icon"
                      ></i>
                      <div style="flex: 1" class="font__ellipsis">
                        {{ item.menuName }}
                      </div>
                      <!-- 收藏图标 -->
                      <collect-icon
                        :isCollect="true"
                        :defaultShow="false"
                        @click.stop="handleChangeCollect(item)"
                      ></collect-icon>
                    </div>
                  </div>
                </transition-group>
              </div>
              <!-- 线 -->
              <div class="line" v-if="menuCenterFavArr.length !== 0"></div>
              <transition :name="transitionName">
                <!-- 全部菜单 -->
                <waterfall
                  class="allMenu"
                  ref="allMenu"
                  :col="3"
                  :data="allMenus"
                  v-if="isShowAllMenus"
                >
                  <template>
                    <div
                      v-for="(item, index) in allMenus"
                      :key="`${item.id}_${index}`"
                    >
                      <!-- 第一层级 -->
                      <div
                        class="allMenu__title need__pos--height parentTitBox"
                        :ref="`module_${item.id}`"
                        :class="[
                          clickIndex === index ? 'parentTitBox__animation' : '',
                          'font__ellipsis',
                        ]"
                        :title="item.menuName"
                        v-if="item.children"
                      >
                        <img
                          class="allMenu__imgColor"
                          v-if="item.icon && item.icon.imageUrl"
                          :src="item.icon && item.icon.imageUrl"
                        />
                        <i
                          :class="[
                            'iconfont allMenu__iconSize',
                            item.icon && item.icon.icon,
                          ]"
                          :style="{ color: item.icon && item.icon.color }"
                          v-else-if="item.icon && item.icon.icon"
                        ></i>
                        {{ item.menuName }}
                      </div>
                      <!-- <transition-group :name="transitionName"> -->
                      <menu-item
                        :arr="item.children"
                        :handleClickMenu="handleClickMenu"
                        :handleChangeCollect="handleChangeCollect"
                        :transitionName="transitionName"
                      >
                      </menu-item>
                      <!-- <div
                          v-for="(val, i) in item.children"
                          class="allMenu__hover titBox"
                          :key="`${val.id}_${i}`"
                          :title="val.menuName"
                          @click="handleClickMenu(val)"
                        >
                          <div style="flex: 1" class="font__ellipsis">
                            {{ val.menuName }}
                          </div>
                          <collect-icon
                            :isCollect="val.isCollect"
                            @click.stop="handleChangeCollect(val)"
                          ></collect-icon>
                        </div> -->
                      <!-- </transition-group> -->
                    </div>
                  </template>
                </waterfall>
              </transition>
              <transition :name="transitionName">
                <div
                  style="height: 60vh"
                  v-if="allMenus.length === 0"
                  class="apiotNoData"
                  :placeholder="$t('common.noData')"
                ></div>
              </transition>
            </div>
          </div>
        </div>
      </section>
      <section class="content__right">
        <i class="el-icon-close content__right--close" @click="handleClose"></i>
        <!-- 定位的值 -->
        <div ref="positionScroll" class="positionScroll">
          <div>
            <div
              class="positionScroll__posLine"
              :style="`transform: translate(0, ${linetop})`"
            ></div>
            <div
              v-for="(item, i) in positionValArr"
              :key="`${item.id}_${i}`"
              class="position"
              :title="item.menuName"
            >
              <span
                class="position--color font__ellipsis"
                @click="handleGoAnchor(item.id, i)"
                :class="{ 'current--pos': currentIndex === i }"
              >
                {{ item.menuName }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </section>
  </apiot-drawer>
</template>

<script>
import BScroll from 'better-scroll';
import bus from '@/utils/bus';
import { postChangeCollect } from '@/api/menuManage';
import MySearch from '../MySearch';
import CollectIcon from '../CollectIcon';
import MenuItem from './components/MenuItem';

export default {
  props: {
    drawer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 模糊收缩
      keywords: '',
      // 我的收藏描点
      myCollection: 'module_0',
      // 收藏数组
      menuCenterFavArr: [],
      // 最近访问数组
      recentlyTabArr: [],
      // 左侧滚动
      scroll: null,
      // 右侧滚动
      positionScroll: null,
      // 判断下级菜单是否存在
      lowerExist: false,
      // 定位位置
      currentIndex: 0,
      // 点击一次记入一个位置，显示父节点的title
      clickIndex: '',
      // 是否点击右侧列表
      isClickPos: false,
      linetop: 0,
      timer: null,
      isShowAllMenus: true,
      transitionName: 'move-right',
      canFav: true
    };
  },

  components: {
    MySearch,
    CollectIcon,
    MenuItem
  },

  computed: {
    // 右侧定位部分
    positionValArr() {
      const arr = [];
      // 如果有菜单 加入一个对象
      if (this.menuCenterFavArr.length !== 0) {
        arr.push({
          menuName: this.$t('menu.myCollection'),
          id: 0
        });
      }
      arr.push(...this.allMenus);
      return arr || '';
    },
    // 全部菜单
    allMenus() {
      let allArr = this.$store.getters.getRouteArr;
      if (this.keywords) {
        return this.fuzzyQuery(this.keywords, allArr);
      }
      allArr = allArr.filter((item) => item.children);
      return allArr || '';
    },
    // 显示隐藏
    visible: {
      get() {
        return this.drawer;
      },
      set(v) {
        this.$emit('update:drawer', v);
      }
    }
  },

  mounted() {
    // 最近访问
    this.recentlyTabArr = JSON.parse(sessionStorage.getItem('recentlyTabArr')) || [];
    this.getMenuCenterFav();
    bus.$on('routerReset', () => {
      this.recentlyTabArr = JSON.parse(sessionStorage.getItem('recentlyTabArr')) || [];
    });
  },

  methods: {
    // 获取收藏数组
    async getMenuCenterFav() {
      const data = {
        menuClientType: 'PC',
        menuLevel: 'MENU'
      };

      // const data = await this.$store.dispatch('getFavRoute', params);
      // this.favArr = [];
      // children.forEach((menu) => {
      //   data.forEach((favMenu) => {
      //     if (favMenu.id === menu.id) {
      //       menu.isCollect = true;
      //       this.favArr.push(menu);
      //     }
      //   });
      // });
      const res = await this.$store.dispatch('getFavRoute', data);
      this.allMenus.forEach((modules) => {
        if (modules.children) {
          modules.children.forEach((menu) => {
            res.forEach((item, index) => {
              if (menu.id === item.id) {
                menu.isCollect = true;
                res[index] = menu;
              }
            });
          });
        }
      });
      this.menuCenterFavArr = res.reverse();
    },
    resolveKeyword(arr) {
      const tempChildren = arr.filter((child) => {
        if (child.children) {
          return this.resolveKeyword(child.children).length;
        }
        return child.menuName.indexOf(this.keywords) !== -1;
      });
      return tempChildren;
    },
    // 模糊搜索 正则匹配
    fuzzyQuery(keyWord, list) {
      if (!(list instanceof Array)) {
        return;
      }
      const allModuleArr = [...this.$store.getters.getRouteArr];
      if (keyWord) {
        const tempArr = [];
        allModuleArr.forEach((item) => {
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
    // 滑动初始值
    initScroll() {
      if (this.scroll) {
        this.scroll.refresh();
        this.positionScroll.refresh();
      } else {
        setTimeout(() => {
          this.positionScroll = new BScroll(this.$refs.positionScroll, {
            mouseWheel: {
              speed: 20,
              invert: false,
              easeTime: 300
            },
            bounce: false
          });
          // 左右滚动
          this.scroll = new BScroll(this.$refs.menu, {
            mouseWheel: {
              speed: 20,
              invert: false,
              easeTime: 300
            },
            bounce: false,
            probeType: 3
          });
          const { length } = this.positionValArr;
          const arr = [];
          const collectionHeight =
            this.$refs[this.myCollection] && this.$refs[this.myCollection].offsetHeight;
          for (let a = 0; a < length; a += 1) {
            const { id } = this.positionValArr[a];
            const val = this.$refs[`module_${id}`];
            let top = '';
            if (Array.isArray(val)) {
              top = this.$refs[`module_${id}`][0].offsetTop;
            } else {
              top = this.$refs[`module_${id}`].offsetTop;
            }
            arr.push(collectionHeight + top + 1);
          }
          this.scroll.on('scrollEnd', () => {
            this.isClickPos = false;
          });
          this.scroll.on('scroll', (pos) => {
            for (let i = 0; i < arr.length; i += 1) {
              const first = arr[i];
              const second = arr[i + 1];
              if (!second || (-pos.y >= first && -pos.y) < second) {
                if (!this.isClickPos) {
                  this.currentIndex = i;
                  this.linetop = `${i * 30}px`;
                }
                break;
              }
            }
          });
          this.$nextTick(() => {
            setTimeout(() => {
              this.scroll.refresh();
            }, 300);
          });
        }, 0);
      }
    },
    // 点击收藏
    async handleChangeCollect(item) {
      if (!this.canFav) {
        return;
      }
      this.canFav = false;
      const isExist = this.menuCenterFavArr.findIndex((val) => item.id === val.id);
      if (this.menuCenterFavArr.length >= 12 && isExist === -1) {
        this.$message({
          type: 'warning',
          message: this.$t('menu.collectUpTo12Menus')
        });
        this.canFav = true;
        return;
      }
      try {
        item.isCollect = !item.isCollect;
        const params = {
          menuId: item.id,
          isCollect: item.isCollect,
          logData: {
            operateType: 2,
            menuId: {
              name: item.menuName,
              showStr: item.isCollect ? this.$t('menu.collection') : this.$t('menu.unfavorite')
            }
          }
        };
        await postChangeCollect(params);
        setTimeout(() => {
          this.canFav = true;
          this.scroll.refresh();
        }, 500);

        if (item.isCollect) {
          this.menuCenterFavArr.unshift(item);
        } else {
          const i = this.menuCenterFavArr.findIndex((val) => val.id === item.id);
          this.menuCenterFavArr.splice(i, 1);
        }
      } catch (error) {
        item.isCollect = !item.isCollect;
        this.canFav = true;
      }

      // this.getMenuCenterFav();
    },
    // 按钮__关闭
    handleClose() {
      this.$emit('update:drawer', false);
    },
    // 点击菜单
    handleClickMenu(item) {
      if (this.recentlyTabArr.length === 0) {
        // 赋值到data中
        this.recentlyTabArr.unshift(item);
        // 存到 sessionStorage 中
        const arr = [];
        arr.unshift(item);
        sessionStorage.setItem('recentlyTabArr', JSON.stringify(arr));
      } else {
        const isExist = this.recentlyTabArr.findIndex((val) => val.id === item.id);
        // 如果不存在，加入
        if (isExist === -1) {
          this.recentlyTabArr.unshift(item);
          // 如果数组大于8个，删除第一个
          if (this.recentlyTabArr.length > 5) {
            this.recentlyTabArr.pop();
          }
          sessionStorage.setItem('recentlyTabArr', JSON.stringify(this.recentlyTabArr));
        }
      }
      this.$emit('update:drawer', false);
      bus.$emit('changeMenuTab', item);
    },
    // 点击描点
    handleGoAnchor(id, i) {
      this.isClickPos = true;
      // 如有没有菜单 减去
      this.clickIndex = this.menuCenterFavArr.length === 0 ? i : i - 1;
      // this.clickIndex = i;
      this.currentIndex = i;
      this.linetop = `${i * 30}px`;
      const val = this.$refs[`module_${id}`];
      if (Array.isArray(val)) {
        this.scroll.scrollToElement(val[0], 400);
      } else {
        this.scroll.scrollToElement(val, 400);
      }
    }
  },
  watch: {
    visible(now) {
      if (now) {
        this.$nextTick(() => {
          this.initScroll();
        });
        this.transitionName = '';
        this.isShowAllMenus = false;
        this.$nextTick(() => {
          this.isShowAllMenus = true;
          setTimeout(() => {
            this.transitionName = 'move-right';
          }, 0);
          //
        });
      }
    },
    keywords() {
      this.$nextTick(() => {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.scroll.refresh();
        }, 500);
      });
    },
    allMenus() {
      this.isShowAllMenus = false;
      this.$nextTick(() => {
        this.isShowAllMenus = true;
      });
    }
  },
  destroyed() {
    bus.$off('routerReset');
  }
};
</script>

<style lang='scss' scoped>
$hoverColor: #f1f7ff;
.content {
  display: flex;
  height: 100%;
  min-width: 900px;
  &__left {
    flex: 1;
    margin: 20px 22px 0 31px;
  }
  // 最近访问
  .recently {
    align-items: center;
    margin-top: 20px;
    font-size: 14px;
    box-sizing: border-box;
    // max-width: max-content;
    width: auto;
    & > div {
      display: inline-block;
      vertical-align: middle;
    }
    &__font {
      color: #666666;
      margin-right: 8px;
    }
    &__info {
      border-radius: 14px;
      padding: 7px 14px;
      margin-right: 8px;
      background: #f1f3f6;
      color: #666666;
      cursor: pointer;
    }
    &__info:hover {
      color: $--color-primary !important;
      background: #e5f0ff !important;
    }
  }
  // 减去输入框和最近访问
  &__menuInfo--height1 {
    height: calc(100% - 70px);
  }
  // 减去头部的
  &__menuInfo--height2 {
    height: calc(100% - 120px);
  }
  &__menuInfo {
    margin-left: -9px;
    margin-top: 30px;
    position: relative;
    overflow: hidden;
    .content__container {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow-x: hidden;
      overflow-y: hidden;
    }
    .collection {
      font-size: 14px;
      padding-bottom: 30px;

      &__font {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin-left: 10px;
      }
      &__info {
        margin-top: 18px;
        display: flex;
        flex-wrap: wrap;
        & > div {
          width: 33.33%;
        }
      }
      &__hover {
        display: flex;
        align-items: center;
        height: 40px;
        margin-right: 32px;
        color: #666666;
        padding-left: 10px;
        cursor: pointer;
      }
      &__iconSize {
        width: 24px;
        height: 24px;
        font-size: 24px;
        border-radius: 4px;
        margin-right: 14px;
        position: relative;
        z-index: 999;
      }
    }
    .line {
      border-bottom: 1px solid #e9e9e9;
      margin: 0 32px 0 9px;
    }
    // 全部菜单
    .allMenu {
      font-size: 14px;
      &__title {
        font-size: 15px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        margin: 18px 32px 0 0px;
        padding: 13px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
      }
      &__iconSize {
        font-size: 18px;
        margin-right: 7px;
      }
      &__imgColor {
        width: 18px;
        height: 18px;
        margin-right: 7px;
      }
    }
  }
  &__right {
    width: 185px;
    &--close {
      display: flex;
      margin: 20px 20px 100px 150px;
      color: #aaaaaa;
      cursor: pointer;
      font-size: 16px;
      height: 20px;
      width: 20px;
      justify-content: center;
      align-items: center;
    }
    .positionScroll {
      width: 100%;
      height: calc(100% - 140px);
      overflow-x: hidden;
      overflow-y: hidden;
      position: relative;
      &__posLine {
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 30px;
        background: $--color-primary;
        transition: all 0.2s ease-in-out;
        z-index: 999;
      }
      .position {
        border-left: 1px solid #e9e9e9;
        font-size: 14px;
        position: relative;
        height: 30px;
        &--color {
          color: #666666;
          cursor: pointer;
          display: flex;
          padding: 8px 0px 8px 31px;
          width: 150px;
          display: inline-block;
        }
        &--color:hover {
          color: $--color-primary;
        }
        .current--pos {
          color: $--color-primary;
          & > div:first-child {
            transform: scale(1, 1);
          }
        }
      }
    }
  }
}
.titBox {
  position: relative;
  &:after {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: $--color-primary;
    transform: scale(0, 1);
    transform-origin: 0% 50%;
    opacity: 0.1;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }

  &:hover {
    color: $--color-primary;
    transition: all 0.4s;
    i {
      transform: scale(1) !important;
    }
    &:after {
      transition: all 0.4s;
      transform: scale(1, 1);
    }
  }
}
.parentTitBox {
  position: relative;
  &:after {
    width: 100%;
    height: 100%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: $--color-primary;
    transform: scale(0, 1);
    transform-origin: 0% 50%;
    opacity: 0.1;
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
.parentTitBox__animation {
  color: $--color-primary;
  transition: all 0.4s;
  transform: scale(1, 1);
  &:after {
    transition: all 0.4s;
    transform: scale(1, 1);
  }
}
::v-deep {
  .input__search {
    margin-right: 32px;
    width: auto;
  }
}
</style>
