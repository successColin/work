<template>
  <div class="tabs">
    <draggable
      group="menu"
      v-model="groupList"
      animation="300"
      @start="dragStart"
      :move="dragMove"
      @end="dragEnd"
    >
      <transition-group tag="ul" class="tabs__ul">
        <li
          class="tabs__li"
          v-for="(item, i) in groupList"
          :key="item.id"
          :class="[{ active: item.id === selectedKey }]"
          @click="selectList(item, i)"
        >
          <i class="iconfont icon-mokuai"></i>
          <span class="wz">{{ item.menuName }}</span>

          <el-dropdown
            class="tabs__li--dropdown"
            ref="dropdown"
            trigger="click"
            @command="handleCommand"
            placement="bottom"
            :tabindex="-1"
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
        </li></transition-group
      >
    </draggable>
    <div
      class="tabs__add"
      v-if="curItem ? curItem.menuType !== 1 : false"
      :class="[{ noList: groupList.length === 0 }, { disabled: groupId === 1 }]"
      @click="addModule"
    >
      <i class="iconfont icon-fangda"></i>
      <span>新增子模块</span>
    </div>

    <apiot-dialog
      :title="getCurTitle"
      :loading.sync="showLoading"
      @sure-click="sureClick"
      :visible.sync="dialogVisible"
    >
      <div class="dialog__icon">
        <icon-select :item.sync="iconObj" v-if="dialogVisible"></icon-select>
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
  </div>
</template>

<script>
import {
  sysMenuList,
  sysMenuAdd,
  sysMenuEdit,
  sysMenuDelete,
  switchLocation
} from '@/api/menuManage';
import IconSelect from '../IconSelect';

export default {
  name: '',
  data() {
    return {
      form: {
        moduleName: ''
      },
      iconObj: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      curType: 1,
      dialogVisible: false,
      showLoading: false,
      groupList: [],
      backGroupList: [],
      groupId: 1,
      groupName: '',
      curIndex: 0,
      selectedKey: 1,
      curItem: null,
      showMenu: false
    };
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
  components: {
    IconSelect
  },
  mounted() {
    this.curIndex = +sessionStorage.__curMenuTabIndex__ || 0;
  },
  methods: {
    changeGroup(item) {
      this.curItem = item;
      this.groupId = item.id;
      this.groupList = [];
      this.groupName = item.menuName;
      this.sysMenuList();
    },
    // 新增模块
    addModule() {
      this.curType = 1;
      this.dialogVisible = true;
      this.iconObj.icon = '';
      this.iconObj.color = '';
      this.iconObj.imageUrl = '';
      this.form.moduleName = '';
      if (this.$refs.ruleForm) {
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
      }
    },
    // 获取列表
    async sysMenuList() {
      const data = await sysMenuList({ menuLevel: 1, clientType: 1, parentId: this.groupId });
      data.forEach((item) => {
        item.type = 'module';
      });
      this.groupList = data;
      if (data.length) {
        this.selectList(this.groupList[this.curIndex], this.curIndex);
      } else {
        this.$emit('selectList', this.curItem);
      }
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
          this.sysMenuDelete(item);
          // console.log('删除');
        } catch (err) {
          // console.log(err);
        }
      }
    },
    // dialog确认按钮点击
    sureClick() {
      if (this.iconObj.icon === '' && this.iconObj.imageUrl === '') {
        this.showLoading = false;
        return this.$message({
          type: 'error',
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
    selectList(item, index) {
      // console.log(item);
      sessionStorage.__curMenuTabIndex__ = index;
      this.selectedKey = item.id;
      this.curIndex = index;
      this.menuCode = item.menuCode;
      this.$emit('selectList', item);
    },
    // 新增分组
    async sysMenuAdd() {
      let sno = 1;
      if (this.groupList.length) {
        sno = this.groupList[this.groupList.length - 1].sno + 1;
      }
      try {
        const params = {
          parentId: this.groupId,
          menuName: this.form.moduleName,
          icon: this.iconObj,
          menuLevel: 1,
          menuType: 2,
          clientType: 1,
          menuCode: '',
          sno,
          logData: {
            operateType: 1,
            parentId: {
              name: this.$t('menu.menuModule'),
              showStr: this.groupName
            },
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
        const data = await sysMenuAdd(params);
        data.type = 'module';
        this.showLoading = false;
        this.dialogVisible = false;
        this.groupList.push(data);
        this.selectList(data, this.groupList.length - 1);
        this.$message({
          type: 'success',
          message: this.$t('common.success', {
            name: this.$t('common.add', { name: this.$t('menu.module') })
          })
        });
      } catch (error) {
        console.log(error);
        this.showLoading = false;
        if (error.menuName) {
          return this.$message({
            type: 'error',
            message: `${this.$t('common.name', { name: this.$t('menu.module') })} ${error.menuName}`
          });
        }
      }
    },
    // 编辑分组
    async sysMenuEdit() {
      try {
        const params = {
          parentId: this.groupId,
          menuName: this.form.moduleName,
          icon: this.iconObj,
          menuCode: this.menuCode,
          id: this.selectedKey,
          logData: {
            operateType: 2,
            parentId: {
              name: this.$t('menu.menuModule'),
              showStr: this.groupName
            },
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
        const data = await sysMenuEdit(params);
        // console.log(data);
        this.showLoading = false;
        this.dialogVisible = false;
        this.groupList[this.curIndex].menuName = data.menuName;
        this.groupList[this.curIndex].icon = this.iconObj;
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
            type: 'error',
            message: `${this.$t('common.name', { name: this.$t('menu.module') })} ${error.menuName}`
          });
        }
      }
    },
    // 删除分组
    async sysMenuDelete(item) {
      console.log(item);

      await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      });
      this.transitionName = 'move-right';
      await sysMenuDelete({
        id: item.id,
        logData: {
          operateType: 3,
          name: this.$t('menu.menuModule'),
          value: 'menuName',
          deleteArr: [item]
        }
      });
      const index = this.groupList.findIndex((v) => v.id === item.id);
      this.groupList.splice(index, 1);
      // this.resetGroup();
      this.curIndex = 0;
      if (this.groupList.length) {
        this.selectList(this.groupList[this.curIndex], this.curIndex);
      }
    },
    // 拖拽开始
    dragStart(evt) {
      const eleArr = this.$refs.dropdown;
      if (eleArr.length) {
        eleArr.forEach((ele) => {
          ele.hide();
        });
      }
      this.selectedBackKey = this.groupList[evt.oldIndex].id;
      this.selectedKey = this.selectedBackKey;

      this.backGroupList = JSON.parse(JSON.stringify(this.groupList));
    },
    dragMove(evt) {
      // 不允许停靠
      if (evt.relatedContext.element.type === 'menu') return false;
    },
    // 拖拽结束
    dragEnd(evt) {
      this.selectedBackKey = -1;
      if (evt.oldIndex === evt.newIndex) {
        return;
      }
      this.selectList(this.groupList[evt.newIndex], evt.newIndex);

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
    // 修改排序
    async switchLocation(params) {
      await switchLocation(params);
    }
  }
};
</script>

<style lang='scss' scoped>
.tabs {
  line-height: 42px;
  display: flex;
  align-items: center;
  &__ul {
    display: flex;
    align-items: center;
  }
  &__li {
    position: relative;
    padding: 0 32px 0 12px;
    display: inline-flex;
    align-items: center;
    &.active {
      .icon-mokuai {
        color: $--color-primary;
      }
      .wz {
        color: $--color-primary;
      }
      &:after {
        content: '';
        position: absolute;
        left: 12px;
        right: 30px;
        bottom: 0;
        height: 1px;
        background-color: $--color-primary;
      }
    }
    cursor: pointer;
    .icon-mokuai {
      font-size: 16px;
      color: #bbc3cd;
      margin-right: 4px;
    }
    .wz {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
    &--dropdown {
      position: absolute;
      right: 10px;
    }
    .icon-gengduocaozuo {
      display: none;
      font-size: 18px;
      color: $--color-primary;
    }
    &:hover {
      .icon-gengduocaozuo {
        display: block;
      }
      .icon-mokuai {
        color: $--color-primary;
      }
      .wz {
        color: $--color-primary;
      }
    }
  }
  &__add {
    display: flex;
    align-items: center;
    color: $--color-primary;
    cursor: pointer;
    &.noList {
      i {
        margin-left: 10px;
      }
      span {
        display: inline-block;
      }
    }
    &.disabled {
      cursor: not-allowed;
      color: #999;
    }
    i {
      font-size: 16px;
    }
    span {
      display: none;
      margin-left: 4px;
      font-size: 14px;
      font-weight: 500;
    }
  }
  &__relate {
    margin-left: 10px;
    i {
      margin-right: 4px;
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
