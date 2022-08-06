<!--
* @Description: 菜单管理
* @Author: cmk
* @Date: 2021-05-06 10:56:31
* @Last Modified by: cmk
* @Last Modified time: 2021-05-06 10:56:31
-->

<template>
  <apiot-content
    class="menu"
    :asideLoading="asideLoading"
    :contentLoading="contentLoading"
  >
    <template v-slot:sidebar>
      <sidebar-list
        @selectList="changeGroup"
        :asideLoading.sync="asideLoading"
      ></sidebar-list>
    </template>
    <template>
      <second-menu
        class="menu__top"
        @selectList="changeTab"
        ref="tabs"
      ></second-menu>
      <section
        class="menu__wrapper"
        :class="[{ apiotNoData: !menuArr.length }]"
      >
        <header class="menu__header">
          <apiot-button
            type="primary"
            v-if="curItem ? curItem.menuCode === 'sysHome' : false"
            class="tabs__relate"
            @click="showHome = true"
            ><i class="iconfont icon-guanxiguanlian"></i>关联页面</apiot-button
          >
          <apiot-button type="primary" @click="addMenu" v-if="showBtn">
            <i class="iconfont icon-xinzeng m-r-4"></i
            >{{ $t('common.add', { name: $t('menu.menu') }) }}
          </apiot-button>

          <search-input
            @getList="getList"
            v-model="keywords"
            class="m-l-10"
          ></search-input>
          <apiot-button
            @click="exportMenu"
            v-if="showBtn"
            class="fr"
            style="margin-top: 6px"
          >
            <i class="iconfont icon-daochu m-r-4"></i
            >{{ $t('common.export', { name: $t('menu.menu') }) }}
          </apiot-button>
          <el-upload
            class="upload m-l-10 m-r-10 fr"
            action=""
            :on-success="uploadSuccess"
            :before-upload="beforeUpload"
            :http-request="doUpload"
            :show-file-list="false"
            accept="txt"
          >
            <apiot-button v-if="showBtn" :loading="loading">
              <i class="iconfont icon-daoru m-r-4"></i
              >{{ $t('common.import', { name: $t('menu.menu') }) }}
            </apiot-button>
          </el-upload>
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
                :groupId="groupId"
                :groupMenuCode="curItem ? curItem.menuCode : ''"
                @getList="getList"
                @addCancle="addCancle"
                @addSure="addSure"
                @editSure="editSure"
                @deleteMenu="deleteMenu"
              ></menu-card>
            </transition-group>
          </draggable>
        </section>
        <MenuSelect
          :visible.sync="showMenu"
          :tableData="menuArr"
          :showMenu="showMenu"
        ></MenuSelect>
        <MenuHome
          :visible.sync="showHome"
          :showMenu="showHome"
          :moduleId="groupId"
          :list="menuArr"
          @addHomeSuccess="addHomeSuccess"
        ></MenuHome>
      </section>
    </template>
  </apiot-content>
</template>

<script>
import {
  importMenu,
  switchLocation,
  sysMenuAdd,
  sysMenuDelete,
  sysMenuEdit,
  sysMenuList
} from '@/api/menuManage';
import bus from '@/utils/bus';
import MenuCard from './components/MenuCard';
import MenuHome from './components/MenuHome';
import MenuSelect from './components/MenuSelect';
import SecondMenu from './components/SecondMenu';
import SidebarList from './components/Sidebar';

export default {
  name: 'menuManage',
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
      showMenu: false, // 展示多选菜单
      showHome: false, // 展示主页菜单
      curItem: null
    };
  },

  components: {
    SidebarList,
    MenuCard,
    MenuSelect,
    SecondMenu,
    MenuHome
  },

  computed: {
    showBtn() {
      if (this.curItem) {
        if (['adminModule', 'sysHome'].includes(this.curItem.menuCode)) {
          return false;
        }
      }
      return true;
    }
  },

  mounted() {},

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
      const params = {
        menuLevel: 2,
        menuType: 2,
        parentId: this.groupId,
        menuName,
        icon,
        clientType: 1,
        menuCode: '',
        sno: this.menuArr[this.menuArr.length - 1].sno + 1,
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
      await sysMenuDelete({
        id: this.menuArr[index].id,
        logData: {
          operateType: 3,
          name: this.$t('menu.menu'),
          value: 'menuName',
          deleteArr: [this.menuArr[index]]
        }
      });
      this.transitionName = 'move-right';
      this.menuArr.splice(index, 1);
      await this.$store.dispatch('getRoute');
      await this.$store.dispatch('getHomeRoute');
    },
    // 改变分组
    changeGroup(item) {
      this.$refs.tabs.changeGroup(item);
    },
    // 更改tab切换
    changeTab(item) {
      this.curItem = item;
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
      console.log(evt.relatedContext);
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
    async dragEnd(evt) {
      bus.$emit('menuMoveEnd');
      this.isMoving = false;
      console.log(evt.originalEvent.pageY);
      if (evt.originalEvent.pagey >= 142) {
        this.isCurGroup = true;
      }
      if (!this.isCurGroup && this.relateGroupId !== -1) {
        const curItem = this.menuArr[evt.newIndex];
        if (curItem.menuType === 2) {
          const params = { menuLevel: 2, parentId: this.relateGroupId };
          const data = await sysMenuList(params);
          this.sysMenuEdit(
            {
              ...curItem,
              index: evt.newIndex,
              parentId: this.relateGroupId,
              sno: data.length ? data[data.length - 1].sno + 1 : 1
            },
            true
          );
        } else {
          this.$message({
            type: 'warning',
            message: this.$t('menu.noChangeModule')
          });
        }
      }
      if (evt.originalEvent.pageY >= 142 && evt.originalEvent.pageX >= 260) {
        await this.switchLocation({
          id: this.backMenuArr[evt.oldIndex].id,
          sno: this.backMenuArr[evt.oldIndex].sno,
          switchSno: this.backMenuArr[evt.newIndex].sno,
          logData: {
            operateType: 4,
            name: this.$t('menu.menu'),
            switchName: this.backMenuArr[evt.oldIndex].menuName
          }
        });
      }

      this.sysMenuList();
    },
    addHomeSuccess() {
      this.sysMenuList();
      this.$store.dispatch('getHomeRoute');
    },
    // 获取列表
    async sysMenuList() {
      try {
        this.contentLoading = true;
        const params = { menuLevel: 2, parentId: this.groupId, keywords: this.keywords };
        this.transitionName = 'fadeInUp';
        const data = await sysMenuList(params);
        this.contentLoading = false;
        data.forEach((item) => {
          item.state = 1;
          item.type = 'menu';
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
        const data = await sysMenuAdd(params);
        this.contentLoading = false;

        if (this.menuArr.length > 1) {
          this.menuArr = [];
          await this.switchLocation({
            id: data.id,
            sno: data.sno,
            switchSno: 1
          });
          this.sysMenuList();
        } else {
          this.menuArr = [];
          this.sysMenuList();
        }
        this.$store.dispatch('getRoute');
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('menu.menu') })
          })
        });
      } catch (error) {
        this.contentLoading = false;
        if (error.menuName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('menu.menu') })} ${error.menuName}`
          });
        }
      }
    },
    // 编辑菜单
    async sysMenuEdit(
      { index, parentId = this.groupId, id, menuName, icon, enabled, menuCode, sno },
      isMoveGroup = false
    ) {
      try {
        const params = {
          parentId,
          menuName,
          icon,
          id,
          enabled,
          menuCode,
          sno,
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
        await sysMenuEdit(params);
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
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('menu.menu') })} ${error.menuName}`
          });
        }
      }
    },
    // 修改排序
    async switchLocation(params) {
      params.parentId = this.groupId;
      await switchLocation(params);
    },
    // 上传成功
    async uploadSuccess() {
      await this.getList();
      this.$store.dispatch('getRoute');
      this.loading = false;
      this.$message({
        type: 'success',
        msg: '上传成功'
      });
    },
    // 上传之前
    beforeUpload(file) {
      return new Promise((resolve) => {
        resolve(file);
      });
    },
    // 自定义上传
    async doUpload(param) {
      const { file } = param;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('menuId', this.groupId);
      this.loading = true;
      try {
        const res = await importMenu(formData);
        return res;
      } catch (error) {
        this.loading = false;
      }
    },
    // 导出菜单
    exportMenu() {
      this.showMenu = true;
    }
  }
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
  &__top {
    height: 42px;
    border-bottom: 1px solid rgba(235, 235, 235, 1);
    box-sizing: border-box;
  }
  &__wrapper {
    box-sizing: border-box;
    padding: 0px 0px 0 10px;
    height: calc(100% - 42px);
    display: flex;
    flex-direction: column;
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
