<template>
  <div class="sidebar">
    <div class="sidebar__add">
      <!-- <apiot-button class="sidebar__add--target" @click="addModule">
        <i :class="`iconfont icon-mokuai m-r-6`"></i
        >{{ $t('common.add', { name: $t('menu.module') }) }}
      </apiot-button> -->
    </div>
    <div class="sidebar__scroll" v-if="false">
      <h3 class="sidebar__Htitle">系统模块</h3>
      <div
        class="sidebar__list"
        :class="{
          'sidebar__list--moving': selectedBackKey !== -1,
        }"
      >
        <ul class="sidebar__list--ul">
          <li
            class="sidebar__list--li"
            :style="`animation-duration: ${100 * index}ms;`"
            :class="{
              active: selectedKey === item.id,
              hover: hoverKey === item.id,
              menuMove: relatedKey === item.id,
            }"
            v-for="(item, index) in sysList"
            :key="item.id"
            @click="selectList(item, index)"
            @mouseenter="hoverKey = item.id"
            @mouseleave="hoverKey = -1"
          >
            <!-- <i class="iconfont icon-zongxiangtuodong" v-if="item.id !== 1"></i> -->
            <i :class="`iconfont icon-mokuai1`"></i>
            <span
              class="sidebar__list--text font__ellipsis"
              :title="item.menuName"
              >{{ item.menuName }}</span
            >
          </li>
        </ul>
      </div>
      <h3 class="sidebar__Htitle">自定义模块</h3>
      <div
        class="sidebar__list"
        :class="{
          'sidebar__list--moving': selectedBackKey !== -1,
        }"
      >
        <draggable
          group="menuSidebar"
          v-model="customizeList"
          animation="300"
          handle=".icon-zongxiangtuodong"
          @start="dragStart"
          :move="dragMove"
          @end="dragEnd"
        >
          <transition-group
            tag="ul"
            class="sidebar__list--ul"
            :name="transitionName"
          >
            <li
              class="sidebar__list--li"
              :style="`animation-duration: ${100 * index}ms;`"
              :class="{
                active: selectedKey === item.id,
                hover: hoverKey === item.id,
                menuMove: relatedKey === item.id,
              }"
              v-for="(item, index) in customizeList"
              :key="item.id"
              @click="selectList(item, index)"
              @mouseenter="hoverKey = item.id"
              @mouseleave="hoverKey = -1"
            >
              <i
                class="iconfont icon-zongxiangtuodong"
                v-if="item.id !== 1"
              ></i>
              <i :class="`iconfont icon-mokuai1`"></i>
              <span
                class="sidebar__list--text font__ellipsis"
                :title="item.menuName"
                >{{ item.menuName }}</span
              >
              <el-dropdown
                class="sidebar__list--dropdown"
                ref="dropdown"
                trigger="click"
                @command="handleCommand"
                placement="bottom"
                :tabindex="-1"
                v-if="item.id !== 1"
              >
                <i class="iconfont icon-gengduocaozuo"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ type: 'edit', item: item }">{{
                    $t('common.edit', { name: $t('menu.module') })
                  }}</el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'del', item: item }">{{
                    $t('common.delete', { name: $t('menu.module') })
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
          </transition-group>
        </draggable>
      </div>
    </div>
    <div class="sidebar__scroll">
      <SingleTree
        :treeData="treeData"
        @node-click="selectList"
        @addModule="addModule"
        @editModule="editModule"
        @deleteModule="deleteModule"
        @moveModule="moveModule"
        ref="tree"
      ></SingleTree>
    </div>
    <apiot-dialog
      :title="getCurTitle"
      :loading.sync="showLoading"
      @sure-click="sureClick"
      :visible.sync="dialogVisible"
    >
      <div class="dialog__icon">
        <icon-select :item.sync="iconObj" :key="+new Date()"></icon-select>
        <p class="dialog__icon--text">
          {{ $t('common.tip') }}：<br />
          {{ $t('menu.selectIconTip') }}
        </p>
      </div>
      <el-form
        :model="form"
        :rules="rules"
        label-position="top"
        ref="ruleForm"
        label-width="100px"
        class="dialog__form"
      >
        <el-form-item
          :label="$t('common.name', { name: $t('menu.module') })"
          prop="moduleName"
        >
          <apiot-input
            v-model="form.moduleName"
            maxlength="12"
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                any: $t('menu.module'),
              })
            "
          ></apiot-input>
        </el-form-item>
      </el-form>
    </apiot-dialog>
    <MoveDialog
      :visible.sync="showMoveDialog"
      :showMoveDialog="showMoveDialog"
      :filterItem="filterItem"
      @moveSucess="moveSucess"
    ></MoveDialog>
  </div>
</template>

<script>
import { switchLocation, sysMenuAdd, sysMenuDelete, sysMenuEdit, menuList } from '@/api/menuManage';
import bus from '@/utils/bus';
import IconSelect from '../IconSelect';
import SingleTree from './SingleTree.vue';
import MoveDialog from '../MoveDialog';

export default {
  inheritAttrs: false,
  props: {
    // 侧边loading
    asideLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sysList: [], // 系统模块
      customizeList: [], // 自定义模块
      backGroupList: [], // 备份分组数据
      selectedKey: 0, // 当前选中的key
      selectedBackKey: -1, // 当前选中的key的备份
      hoverKey: -1, // 悬停样式
      curIndex: 0, // 当前选中的数据下标
      curType: 1, // 当前是新增 1 还是编辑 2 状态
      showLoading: false, // dialog loading 控制
      dialogVisible: false, // dialog 的显示隐藏
      form: {
        moduleName: ''
      },
      // 当前icon对象
      iconObj: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      // 当前菜单停靠的id
      relatedKey: -1,
      menuCode: '', // 菜单code
      transitionName: 'fadeInUp',
      timer: null,
      selectKey: 1, // 树选中key
      treeData: [
        {
          id: -1,
          menuName: '系统模块',
          menuType: 1,
          icon: {
            icon: 'icon-mokuai1',
            color: '#fab71c'
          },
          children: []
        },
        {
          id: -2,
          menuName: '自定义模块',
          menuType: 2,
          icon: {
            icon: 'icon-mokuai1',
            color: '#fab71c'
          },
          children: []
        }
      ],
      parentId: 0,
      showMoveDialog: false, // 展示移动的dialog
      filterItem: null
    };
  },

  components: {
    IconSelect,
    SingleTree,
    MoveDialog
  },

  computed: {
    getCurTitle() {
      return this.curType === 1
        ? this.$t('common.add', { name: this.$t('menu.module') })
        : this.$t('common.edit', { name: this.$t('menu.module') });
    },
    rules() {
      return {
        moduleName: [
          {
            required: true,
            message: this.$t('placeholder.pleaseEnterAnyName', {
              any: this.$t('menu.module')
            }),
            trigger: 'change'
          }
        ]
      };
    }
  },

  mounted() {
    this.resetGroup();
    bus.$on('menuMove', this.menuMove);
    bus.$on('menuMoveEnd', this.menuMoveEnd);
  },
  activated() {
    // this.resetGroup();
    // this.sysMenuList();
  },
  methods: {
    // 更改form的值
    changeForm(data) {
      this.changeTabChange(true);
      this.getFeatureArr.form = {
        ...data
      };
      this.$nextTick(() => {
        this.changeTabChange(false);
      });
    },
    // 新增模块
    addModule(data) {
      this.curType = 1;
      this.parentId = data.id > 0 ? data.id : 0;
      this.selectKey = data.id;
      this.dialogVisible = true;

      this.iconObj = {
        icon: '',
        color: '',
        imageUrl: ''
      };
    },
    // 编辑模块
    editModule(data) {
      this.curType = 2;
      this.form.moduleName = data.menuName;
      this.parentId = data.parentId > 0 ? data.parentId : 0;
      this.selectKey = data.id;
      if (data.icon) {
        this.iconObj = data.icon;
      }
      this.dialogVisible = true;
    },
    // 删除模块
    deleteModule(data) {
      this.selectKey = data.id;
      this.sysMenuDelete();
    },
    // 移动模块
    moveModule(data) {
      console.log(data);
      this.filterItem = data;
      this.showMoveDialog = true;
    },
    moveSucess() {
      this.treeData = [
        {
          id: -1,
          menuName: '系统模块',
          menuType: 1,
          icon: {
            icon: 'icon-mokuai1',
            color: '#fab71c'
          },
          children: []
        },
        {
          id: -2,
          menuName: '自定义模块',
          menuType: 2,
          icon: {
            icon: 'icon-mokuai1',
            color: '#fab71c'
          },
          children: []
        }
      ];
      this.$nextTick(() => {
        this.sysMenuList();
      });
    },
    // dialog确认按钮点击
    sureClick() {
      if (this.iconObj.icon === '' && this.iconObj.imageUrl === '') {
        this.showLoading = false;
        return this.$message({
          type: 'warning',
          message: this.$t('placeholder.pleaseSelect', { any: this.$t('menu.icon') })
        });
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.showLoading = true;
          if (this.curType === 1) {
            this.sysMenuAdd();
          } else {
            this.sysMenuEdit();
          }
        } else {
          this.showLoading = false;
          return false;
        }
      });
    },
    // 切换分组
    selectList(item) {
      this.$emit('selectList', item);
    },
    // 拖拽开始
    dragStart(evt) {
      const eleArr = this.$refs.dropdown;
      if (eleArr.length) {
        eleArr.forEach((ele) => {
          ele.hide();
        });
      }
      this.selectedBackKey = this.customizeList[evt.oldIndex].id;

      this.backGroupList = JSON.parse(JSON.stringify(this.customizeList));
    },
    dragMove(evt) {
      // 不允许停靠
      if (evt.relatedContext.element.type === 'menu') return false;
      if (evt.relatedContext.element.id === 1) return false;
    },
    // 拖拽结束
    dragEnd(evt) {
      this.hoverKey = -1;
      this.selectedBackKey = -1;
      this.relatedKey = -1;
      // 高度变化动画
      evt.item.style.height = '0px';
      evt.item.style.overflow = 'hidden';
      this.$nextTick(() => {
        evt.item.style = '';
      });
      if (evt.oldIndex === evt.newIndex) {
        return;
      }
      this.selectList(this.customizeList[evt.newIndex], evt.newIndex);

      const params = {
        id: this.backGroupList[evt.oldIndex].id,
        sno: this.backGroupList[evt.oldIndex].sno,
        switchSno: this.backGroupList[evt.newIndex].sno,
        logData: {
          operateType: 4,
          name: this.$t('menu.menuModule'),
          switchName: this.backGroupList[evt.oldIndex].menuName
        }
      };
      this.switchLocation(params);
    },
    async handleCommand({ type, item }) {
      // console.log(item);
      // 编辑
      if (type === 'edit') {
        // console.log('编辑');
        this.curType = 2;
        this.form.moduleName = item.menuName;
        if (item.icon) {
          this.iconObj = item.icon;
        }
        this.dialogVisible = true;
        return;
      }
      // 删除
      if (type === 'del') {
        try {
          this.sysMenuDelete();
          // console.log('删除');
        } catch (err) {
          // console.log(err);
        }
      }
    },
    // 重置数据
    resetForm() {
      this.form = {
        moduleName: ''
      };
      this.$refs.ruleForm.resetFields();
    },
    // 菜单move
    menuMove(context) {
      if (context.element.type === 'module') {
        this.relatedKey = context.element.id;
      } else {
        this.relatedKey = -1;
      }
    },
    // 菜单move结束
    menuMoveEnd() {
      this.relatedKey = -1;
      // 每次删除拖过来的元素
      this.customizeList = this.customizeList.filter((item) => item.type === 'module');
    },
    // 获取列表
    async sysMenuList() {
      try {
        this.$emit('update:asideLoading', true);
        this.transitionName = 'fadeInUp';
        const data = await menuList({ menuLevel: 1, clientType: 1, parentId: 0 });
        this.$emit('update:asideLoading', false);
        this.sysList = [];
        this.customizeList = [];
        data.forEach((item) => {
          if (!item.childCount) {
            item.isLeaf = true;
          } else {
            item.isLeaf = false;
          }
          item.type = 'module';
          if (item.menuType === 1) {
            this.sysList.push(item);
          } else {
            this.customizeList.push(item);
          }
        });
        this.treeData[0].children = this.sysList;
        this.treeData[1].children = this.customizeList;
        this.selectList(this.sysList[0], 0);
        this.selectKey = this.sysList[0].id;
        this.$nextTick(() => {
          this.$refs.tree.getTree().setCurrentKey(this.selectKey);
        });
      } catch (error) {
        this.$emit('update:asideLoading', false);
      }
    },
    // 重置分组
    resetGroup() {
      this.sysMenuList();
    },
    // 新增分组
    async sysMenuAdd() {
      try {
        const params = {
          parentId: this.parentId,
          menuName: this.form.moduleName,
          icon: this.iconObj,
          menuLevel: 1,
          menuType: 2,
          clientType: 1,
          menuCode: '',
          sno:
            this.customizeList.length === 0
              ? 0
              : this.customizeList[this.customizeList.length - 1].sno + 1,
          logData: {
            operateType: 1,
            menuName: {
              name: this.$t('menu.menuModule')
            },
            icon: {
              name: this.$t('menu.icon'),
              showStr: this.iconObj.imageUrl
                ? this.iconObj.imageUrl
                : `${this.iconObj.icon}(${this.iconObj.color})`
            }
          }
        };
        this.transitionName = 'move-right';
        const data = await sysMenuAdd(params);
        data.type = 'module';
        this.showLoading = false;
        this.dialogVisible = false;
        // this.customizeList.push(data);
        // this.selectList(data, this.customizeList.length - 1);
        console.log(this.selectKey, this.parentId);
        this.$refs.tree.getTree().setCurrentKey(this.selectKey);
        const form = this.$refs.tree.getTree().getCurrentNode();
        const node = this.$refs.tree.getTree().getNode(form);
        if (node.expanded) {
          const params1 = { menuLevel: 1, clientType: 1, parentId: this.parentId };
          const data1 = await menuList(params1);
          const arr = [];
          data1.forEach((item) => {
            if (!item.childCount) {
              item.isLeaf = true;
            } else {
              item.isLeaf = false;
            }
            item.type = 'module';
            arr.push(item);
          });
          console.log(arr);
          this.$refs.tree.getTree().updateKeyChildren(this.selectKey, arr);
        } else {
          node.loaded = false;
          node.isLeaf = false;
        }
        this.$store.dispatch('getRoute');
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('menu.module') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        if (error.menuName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('menu.module') })} ${error.menuName}`
          });
        }
      }
    },
    // 编辑分组
    async sysMenuEdit() {
      try {
        const params = {
          parentId: this.parentId,
          menuName: this.form.moduleName,
          icon: this.iconObj,
          id: this.selectKey,
          logData: {
            operateType: 2,
            menuName: {
              name: this.$t('menu.menuModule')
            },
            icon: {
              name: this.$t('menu.icon'),
              showStr: this.iconObj.imageUrl
                ? this.iconObj.imageUrl
                : `${this.iconObj.icon}(${this.iconObj.color})`
            }
          }
        };

        await sysMenuEdit(params);
        // console.log(data);
        this.showLoading = false;
        this.dialogVisible = false;
        // this.customizeList[this.curIndex].menuName = data.menuName;
        // this.customizeList[this.curIndex].icon = this.iconObj;
        this.$refs.tree.getTree().setCurrentKey(this.selectKey);
        const form = this.$refs.tree.getTree().getCurrentNode();
        const node = this.$refs.tree.getTree().getNode(form);
        node.data.icon = params.icon;
        node.data.menuName = params.menuName;
        this.$store.dispatch('getRoute');
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.edit', { name: this.$t('menu.module') })
          })
        });
      } catch (error) {
        this.showLoading = false;
        if (error.menuName) {
          return this.$message({
            type: 'warning',
            message: `${this.$t('common.name', { name: this.$t('menu.module') })} ${error.menuName}`
          });
        }
      }
    },
    // 删除分组
    async sysMenuDelete() {
      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      this.transitionName = 'move-right';
      await sysMenuDelete({
        id: this.selectKey,
        logData: {
          operateType: 3,
          name: this.$t('menu.menuModule'),
          value: 'menuName',
          deleteArr: [this.customizeList[this.curIndex]]
        }
      });
      const form = this.$refs.tree.getTree().getCurrentNode();
      const node = this.$refs.tree.getTree().getNode(this.selectKey);
      if (form.id === this.selectKey) {
        this.selectKey = node.parent.data.id < 0 ? 1 : node.parent.data.id;
        this.$refs.tree.getTree().setCurrentKey(this.selectKey);
        const curForm = this.$refs.tree.getTree().getCurrentNode();
        this.selectList(curForm);
      }
      this.$refs.tree.getTree().remove(node);
    },
    // 修改排序
    async switchLocation(params) {
      await switchLocation(params);
    }
  },
  watch: {
    dialogVisible(v) {
      if (!v) {
        this.resetForm();
      }
    }
  },
  beforeDestroy() {
    bus.$off('menuMove', this.menuMove);
    bus.$off('menuMoveEnd', this.menuMoveEnd);
  }
};
</script>

<style lang='scss' scoped>
.sidebar {
  display: flex;
  width: 250px;
  height: 100%;
  flex-direction: column;
  box-sizing: border-box;
  &__add {
    flex: 0 0 10px;
    box-sizing: border-box;
    padding: 6px 8px;
    &--target {
      width: 100%;
      .iconfont {
        color: $--color-primary;
      }
    }
  }
  &__scroll {
    width: 100%;
    overflow-y: auto;
  }
  &__Htitle {
    padding-left: 40px;
    height: 34px;
    line-height: 34px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #808080;
  }
  &__list {
    flex: 1;
    // overflow-y: auto;
    &.sidebar__list--moving {
      .sidebar__list--li {
        &.active,
        &.hover {
          background: transparent !important;
          .icon-zongxiangtuodong,
          .icon-gengduocaozuo,
          .sidebar__list--number {
            display: none !important;
          }
        }
        &.active {
          // border-top: 2px dashed $--color-primary !important;
          // border-width: 1px !important;
          // border-style: solid !important;
          // border-image: url(~@/assets/img/border-blue-circle.svg) 1 round !important;
          height: 10px !important;
          overflow: hidden !important;
          margin: 0 10px;
          background-color: $--hover-color !important;
          border-radius: 2px !important;
          border: 1px dashed $--color-primary !important;
          i,
          span,
          div {
            visibility: hidden;
          }
        }
      }
    }
    ::v-deep {
      .menuCard {
        display: none !important;
      }
    }
    &--li {
      position: relative;
      height: 36px;
      line-height: 36px;
      display: flex;
      align-items: center;
      border-radius: 2px;
      border-left: 3px solid transparent;
      padding-right: 10px;
      cursor: pointer;
      box-sizing: border-box;
      transition: height 300ms;
      .icon-zongxiangtuodong {
        position: absolute;
        display: none;
        color: $--color-primary;
        left: 14px;
        cursor: move;
      }
      .icon-fenzuchangtai,
      .icon-mokuai1 {
        font-size: 18px;
        color: #fab71c;
        margin-left: 38px;
      }
      .icon-gengduocaozuo {
        display: none;
        font-size: 18px;
        color: $--color-primary;
      }
      &.active,
      &.hover {
        background: $--hover-color;
        .icon-zongxiangtuodong,
        .icon-gengduocaozuo,
        .sidebar__list--number {
          display: block;
        }
      }
      &.active {
        border-left-color: $--color-primary;
      }
      &.ghost {
        border-top: 1px dashed $--color-primary !important;
        height: 0px !important;
        overflow: hidden !important;
      }
      &.menuMove {
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
      }
    }
    &--dropdown {
      position: absolute;
      right: 10px;
    }
    &--text {
      flex: 0 0 100px;
      max-width: 100px;
      padding: 0 5px;
      color: #333333;
      font-size: 13px;
    }
    &--number {
      display: none;
      margin-left: 10px;
      box-sizing: border-box;
      text-align: center;
      padding: 0 8px;
      min-width: 28px;
      height: 20px;
      line-height: 20px;
      background: $--color-primary;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .dialog {
    &__icon {
      display: flex;
      box-sizing: border-box;
      padding: 10px 0 20px;
      border-bottom: 1px solid #e9e9e9;
      &--text {
        padding-top: 8px;
        margin-left: 14px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #aaaaaa;
        line-height: 20px;
      }
    }
    &__form {
      margin-top: 14px;
    }
  }
}
</style>
