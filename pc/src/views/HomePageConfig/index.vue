/**
* @name: index
* @author: DELL
* @date: 2022/3/25 9:46
* @description：index
* @update: 2022/3/25 9:46
*/
<!-- 页面 -->
<template>
  <div
      class="menu"
      :asideLoading="asideLoading"
      :contentLoading="contentLoading"
  >
    <template>
      <section
          class="menu__wrapper"
          :class="[{ apiotNoData: !menuArr.length }]"
      >
        <header class="menu__header">
          <apiot-button type="primary" @click="addMenu">
            <i class="iconfont icon-xinzeng m-r-4"></i
            >新增页面
          </apiot-button>
          <search-input @getList="getList" v-model="keywords"></search-input>
        </header>

        <section class="menu__content">
          <draggable
              v-model="menuArr"
              group="menu"
              animation="300"
              handle=".icon-hengxiangtuodong"
              @start="dragStart"
              :move="dragMove"
              @end="dragEnd"
          >
            <transition-group :name="transitionName" class="menu__father">
              <menu-card
                  v-for="(item, index) in menuArr"
                  :key="item.id"
                  :isMoving="isMoving"
                  :index="index"
                  :item="item"
                  class="m-r-14"
                  :groupName="groupName"
                  :groupId="270"
                  @getList="getList"
                  @addCancle="addCancle"
                  @addSure="addSure"
                  @editSure="editSure"
                  @deleteMenu="deleteMenu"
              ></menu-card>
            </transition-group>
          </draggable>
        </section>
      </section>
    </template>
  </div>
</template>

<script>
import bus from '@/utils/bus';
import { getFunctionList, saveFunction, delFunction, editHomePage, switchMenu } from '@/api/homePage';
import MenuCard from './components/MenuCard';

export default {
  data() {
    return {
      loading: false,
      asideLoading: true,
      contentLoading: true,
      keywords: '',
      groupId: 1,
      relateGroupId: -1,
      groupName: '', // 模块名称
      menuArr: [],
      backMenuArr: [], // 备份菜单
      isCurGroup: false, // 是否当前分组
      isMoving: false, // 是否拖动
      transitionName: 'fadeInUp', // 切换动画
      showMenu: false // 展示多选菜单
    };
  },

  components: {
    MenuCard,
  },

  computed: {},

  mounted() {
    this.getList();
  },

  methods: {
    // 添加菜单
    addMenu() {
      this.menuArr.unshift({
        id: +new Date(),
        state: 2,
        type: 'menu',
        menuName: '',
        parentId: this.groupId,
        icon: {
          icon: '',
          color: '',
          imageUrl: ''
        },
        sno: 0 // 如果只有一个sno从0开始
      });
    },
    // 取消新增
    addCancle() {
      this.menuArr.shift();
    },
    // 确认新增
    addSure({ menuName, icon }) {
      console.log(icon);
      const params = {
        menuName,
        // icon,
        colour: icon.color,
        designJson: 0,
        imageName: icon.icon,
        imageUrl: icon.imageUrl,
      };
      this.sysMenuAdd(params);
    },
    // 确认编辑
    editSure(params) {
      this.sysMenuEdit(params);
    },
    // 获取数据
    getList() {
      this.sysMenuList();
    },
    // 删除菜单
    async deleteMenu(index) {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      await delFunction({
        id: this.menuArr[index].id
      });
      this.transitionName = 'move-right';
      this.menuArr.splice(index, 1);
      // this.$store.dispatch('getRoute');
    },
    // 改变分组
    changeGroup(item) {
      this.groupId = item.id;
      this.menuArr = [];
      this.groupName = item.menuName;
      this.sysMenuList();
    },
    // 拖拽开始
    dragStart() {
      this.isMoving = true;
      this.backMenuArr = JSON.parse(JSON.stringify(this.menuArr));
      this.transitionName = 'move-right';
    },
    dragMove(evt) {
      this.isMoving = true;
      bus.$emit('menuMove', evt.relatedContext);
      if (this.groupId === evt.relatedContext.element.id) {
        this.isCurGroup = true;
        this.relateGroupId = -1;
      } else {
        this.isCurGroup = false;
        this.relateGroupId = evt.relatedContext.element.id;
      }
      if (evt.relatedContext.element.type === 'module') {
        return false;
      }
      this.isCurGroup = true;
      this.relateGroupId = -1;
      if (evt.relatedContext.element.type === 'menu' && evt.relatedContext.element.state === 2) {
        return false;
      }
    },
    // 拖拽结束
    dragEnd(evt) {
      bus.$emit('menuMoveEnd');
      this.isMoving = false;
      if (evt.originalEvent.screenX >= 260) {
        this.isCurGroup = true;
      }
      if (!this.isCurGroup) {
        const curItem = this.menuArr[evt.newIndex];
        if (curItem.menuType === 2) {
          this.sysMenuEdit({ ...curItem, index: evt.newIndex, parentId: this.relateGroupId }, true);
        } else {
          this.$message({
            type: 'error',
            message: this.$t('menu.noChangeModule')
          });
        }
        return;
      }
      this.switchLocation({
        id: this.backMenuArr[evt.oldIndex].id,
        aimSno: this.backMenuArr[evt.newIndex].sno,
        logData: {
          operateType: 4,
          name: this.$t('menu.menu'),
          switchName: this.backMenuArr[evt.oldIndex].menuName
        }
      });
    },
    // 获取列表
    async sysMenuList() {
      try {
        this.contentLoading = true;
        this.transitionName = 'fadeInUp';
        const data = await getFunctionList({ keywords: this.keywords });
        this.contentLoading = false;
        data.forEach((item) => {
          const { colour, imageUrl, imageName } = item;
          item.state = 1;
          item.type = 'menu';
          item.icon = {
            icon: imageName,
            imageUrl,
            color: colour
          };
        });
        if (data.length) {
          this.menuArr = data;
        }
      } catch (error) {
        this.contentLoading = false;
      }
    },
    // 新增菜单
    async sysMenuAdd(params) {
      try {
        this.contentLoading = true;
        this.transitionName = 'move-right';
        const data = await saveFunction(params);
        this.contentLoading = false;

        if (this.menuArr.length > 1) {
          this.menuArr = [];
          await this.switchLocation({
            id: data.id,
            aimSno: data.sno,
          });
          await this.sysMenuList();
        } else {
          this.menuArr = [];
          await this.sysMenuList();
        }
        this.$message({
          type: 'success',
          message: this.$t('common.success', { name: this.$t('common.add', { name: this.$t('menu.menu') }) })
        });
      } catch (error) {
        this.contentLoading = false;
        if (error.menuName) {
          return this.$message({
            type: 'error',
            message: `${this.$t('common.name', { name: this.$t('menu.menu') })} ${error.menuName}`
          });
        }
      }
    },
    // 编辑菜单
    async sysMenuEdit({
      index,
      parentId = this.groupId,
      id,
      menuName,
      icon,
      enabled,
      menuCode
    },
    isMoveGroup = false) {
      try {
        const params = {
          colour: icon.color,
          designJson: 0,
          imageName: icon.icon,
          imageUrl: icon.imageUrl,
          parentId,
          menuName,
          id,
          enabled,
          menuCode,
          logData: {
            operateType: 1,
            parentId: {
              name: this.$t('menu.menuModule'),
              showStr: this.groupName
            },
            menuName: {
              name: this.$t('menu.menu')
            },
            icon: {
              name: this.$t('menu.icon'),
              showStr: icon.imageUrl ? icon.imageUrl : `${icon.icon}(${icon.color})`
            }
          }
        };
        // console.log(params);
        this.contentLoading = true;
        await editHomePage(params);
        this.contentLoading = false;
        if (isMoveGroup) {
          this.menuArr.splice(index, 1);
        } else {
          this.menuArr[index].state = 1;
          this.menuArr[index].menuName = menuName;
          this.menuArr[index].icon = icon;
        }
        this.$store.dispatch('getRoute');
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.$t('menu.menu') })
          })
        });
      } catch (error) {
        this.contentLoading = false;
        if (error.menuName) {
          return this.$message({
            type: 'error',
            message: `${this.$t('common.name', { name: this.$t('menu.menu') })} ${error.menuName}`
          });
        }
      }
    },
    // 修改排序
    async switchLocation(params) {
      await switchMenu(params);
    },
    // 上传成功
    async uploadSuccess() {
      await this.getList();
      this.loading = false;
      this.$message({
        type: 'success',
        msg: '上传成功'
      });
    }
  },
  name: 'HomePageConfig',
};
</script>

<style lang='scss' scoped>
.menu {
  .icon-daoru,
  .icon-daochu {
    color: $--color-primary;
  }

  &__header {
    padding-right: 10px;
  }

  &__wrapper {
    box-sizing: border-box;
    padding: 0px 0px 0 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }

  &__header {
    line-height: 42px;
  }

  &__content {
    flex: 1;
    overflow-y: auto;
  }

  &__father {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .upload {
    display: inline-flex;
  }
}
</style>
