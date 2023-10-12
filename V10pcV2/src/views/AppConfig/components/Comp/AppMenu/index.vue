<template>
  <div
    class="appMenu"
    ref="appMenu"
    @click.stop="selectActive"
    v-loading="loading"
    :class="[
      { borderLight: config.compId === activeObj.compId },
      { isFooter: config.isFooter },
      { hasImg: config.icon.imageUrl || config.icon.icon },
    ]"
  >
    <div
      class="appMenu__box"
      v-if="this.getGroup.showStyle === 1"
      :style="`backgroundColor:${
        this.getGroup.rowNum === 2 || this.getGroup.rowNum === 3
          ? config.bgColor
          : ''
      }`"
    >
      <div class="appMenu__box--1" v-if="this.getGroup.rowNum === 1">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="$parseImgUrl(config.icon.imageUrl)"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <div class="appMneu__right">
          <p class="appMenu__name">{{ config.menuName }}</p>
          <p class="appMenu__des">{{ config.des }}</p>
        </div>
      </div>
      <div class="appMenu__box--2" v-if="this.getGroup.rowNum === 2">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="$parseImgUrl(config.icon.imageUrl)"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
      <div class="appMenu__box--3" v-if="this.getGroup.rowNum === 3">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="$parseImgUrl(config.icon.imageUrl)"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
      <div class="appMenu__box--4" v-if="this.getGroup.rowNum === 4">
        <div
          class="appMenu__icon 222"
          v-if="config.compId === activeObj.compId && config.isFooter"
        >
          <i
            class="iconfont icon-jiahao"
            v-if="!config.selectIcon.imageUrl && !config.selectIcon.icon"
          ></i>
          <img
            :src="$parseImgUrl(config.selectIcon.imageUrl)"
            alt=""
            v-if="config.selectIcon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.selectIcon.icon}`"
            :style="`color: ${config.selectIcon.color}`"
          ></i>
        </div>
        <div class="appMenu__icon 111" v-else>
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="$parseImgUrl(config.icon.imageUrl)"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
      <div class="appMenu__box--5" v-if="this.getGroup.rowNum === 5">
        <div class="appMenu__icon">
          <i
            class="iconfont icon-jiahao"
            v-if="!config.icon.imageUrl && !config.icon.icon"
          ></i>
          <img
            :src="$parseImgUrl(config.icon.imageUrl)"
            alt=""
            v-if="config.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${config.icon.icon}`"
            :style="getJb"
          ></i>
        </div>
        <p class="appMenu__name">{{ config.menuName }}</p>
      </div>
    </div>
    <div
      class="appMenu__bg"
      v-if="this.getGroup.showStyle === 2"
      :class="[{ hasBorder: config.compId !== activeObj.compId }]"
    >
      <img
        :src="$parseImgUrl(config.bgImgUrl)"
        v-if="config.bgImgUrl"
        alt="图片"
      />
    </div>
    <el-dropdown
      class="appMenu__operate"
      v-show="config.routeName === 'configMenu'"
      @command="handleCommand"
    >
      <i class="iconfont icon-gengduocaozuo" @click.stop></i>
      <el-dropdown-menu slot="dropdown" :append-to-body="false">
        <el-dropdown-item command="1">复制菜单</el-dropdown-item>
        <el-dropdown-item command="2">移动菜单</el-dropdown-item>
        <el-dropdown-item command="3">删除菜单</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <groupTree
      :visible.sync="show"
      :show="show"
      :configData="configData"
      v-if="configData && show"
      @sureClick="sureClick"
    ></groupTree>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import { copyAppMenu, deleteAppMenu } from '@/api/appConfig';
import compMixin from '../comp';
import groupTree from '../GroupTree';

export default {
  mixins: [compMixin],
  props: {
    groupObj: {
      type: Object,
    },
    i: {
      type: Number,
    },
  },
  data() {
    return {
      showOperate: false,
      show: false,
      loading: false,
    };
  },

  components: { groupTree },

  computed: {
    getGroup() {
      return this.groupObj;
    },
    getJb() {
      if (this.config.enableGradient) {
        return `-webkit-background-clip: text;background-image: linear-gradient(180deg, ${this.config.gradientObj.color1} 0%, ${this.config.gradientObj.color2} 50%,${this.config.gradientObj.color3} 100%);
        -webkit-text-fill-color: transparent;`;
      }
      return `color: ${this.config.icon.color}`;
    },
  },

  mounted() {},

  methods: {
    handleCommand(command) {
      console.log(command, this.configData);

      if (command === '1') {
        // 复制
        this.copyOneMenu();
      } else if (command === '2') {
        // 移动
        this.show = true;
      } else if (command === '3') {
        // 删除
        this.deleteChild();
      }
    },
    // 复制菜单
    async copyOneMenu() {
      this.loading = true;
      const params = {
        sysMenu: {
          parentId: this.config.parentId || '',
          clientType: 2,
          menuLevel: 2,
          menuType: 2,
          menuName: this.config.menuName,
          menuCode: '',
          id: '',
          icon: this.config.icon,
          enableGradient: this.config.enableGradient, // 是否渐变
          // 渐变色
          gradientObj: this.config.gradientObj,
          EnableCornerMarker: this.config.EnableCornerMarker, // 是否启用角标 1 是， 2 否
          hornMarkType: this.config.hornMarkType, // 角标样式 1数字 2红点
          panelHornMarkId: this.config.panelHornMarkId,
          hornMarkNeedPermissions: this.config.hornMarkNeedPermissions,
        },
        parentKey: this.parentKey,
        routeKey: 'configMenu',
        type: 1,
        oldMenuId: this.config.id,
      };
      // 区分首页跟我的
      if (this.parentKey === 'home') {
        params.sysAppInterfaceConfig = {
          functionInterface: null,
          id: 1,
        };
      } else {
        params.sysAppInterfaceConfig = {
          myInterface: null,
          id: 1,
        };
      }
      params.sysMenu.routeName = params.routeKey;
      try {
        const data = await copyAppMenu({ dto: JSON.stringify(params) });
        console.log(data);
        if (!data.sysMenu.id) {
          return;
        }
        const addObj = {
          ...params.sysMenu,
          compId: createUnique(),
          type: 1,
          compName: 'AppMenu',
          configCompName: 'DeployMenuConfig',
          menuCode: data.sysMenu.menuCode,
          menuName: data.sysMenu.menuName,
          id: data.sysMenu.id,
          menuDesignId: data.sysMenu.menuDesignId || '',
          icon: data.sysMenu.icon,
          groupCompId: this.groupObj.compId, // 父级的id
        };
        console.log(addObj);
        this.groupObj.menuArr.push(addObj);
        this.$dispatch('saveFunctionInterface');
      } catch (error) {
        console.log(error);
      } finally {
        this.loading = false;
      }
    },
    // 寻找group
    findGroup(compId) {
      let obj = null;
      this.configData.funcArea.groupArr.forEach((group) => {
        if (obj) {
          return;
        }
        if (group.compId === compId) {
          obj = group;
        }
        if (group.menuArr) {
          group.menuArr.forEach((menu) => {
            if (obj) {
              return;
            }
            if (menu.type === 3) {
              if (menu.childPageConfig) {
                menu.childPageConfig.funcArea.groupArr.forEach((childGroup) => {
                  if (obj) {
                    return;
                  }
                  if (childGroup.compId === compId) {
                    obj = childGroup;
                    obj.fatherMenuId = menu.id;
                  }
                });
              }
            }
          });
        }
      });
      return obj;
    },
    // 确认按钮
    sureClick(compId) {
      console.log(compId);
      if (compId === this.groupObj.compId) {
        return;
      }
      const obj = this.findGroup(compId);
      console.log(obj);
      if (obj.fatherMenuId) {
        this.config.parentId = obj.fatherMenuId;
      } else {
        this.config.parentId = '';
      }
      this.groupObj.menuArr.splice(this.i, 1);
      obj.menuArr.push(this.config);
      this.$dispatch('saveFunctionInterface');
    },
    // 删除
    async deleteChild() {
      if (this.config.id) {
        const params = {
          sysMenu: {
            id: this.config.id,
          },
        };
        await deleteAppMenu(params);
      }
      this.groupObj.menuArr.splice(this.i, 1);
      this.$dispatch('saveFunctionInterface');
    },
  },
};
</script>

<style lang="scss" scoped>
.appMenu {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  // overflow: hidden;
  box-sizing: border-box;
  &:hover {
    .appMenu__operate {
      display: block;
    }
  }
  &__operate {
    display: none;
    position: absolute;
    top: 4px;
    right: 4px;
    width: 18px;
    height: 18px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    line-height: 18px;
    text-align: center;
    cursor: pointer;
    i {
      display: inline-block;
      width: 100%;
      height: 100%;
      font-size: 12px;
      color: #fff;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.6);
    }
    ::v-deep {
      .el-dropdown-menu__item {
        width: 58px;
        height: 36px;
      }
    }
  }
  &.borderLight {
    border: 1px dashed $--color-primary;
  }
  &:hover {
    background: #f1f7ff;
  }
  &.isFooter {
    .appMenu__name {
      width: 24px;
      height: 12px;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 12px;
      margin-top: 6px;
    }
  }
  &.hasImg {
    .appMenu__icon {
      border: 0 none;
    }
  }
  &__icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
    text-align: center;
    i {
      color: #bbc3cd;
    }

    &.borderLight:hover {
      border-color: $--color-primary;
      i {
        color: $--color-primary;
      }
    }
    .full {
      display: block;
      width: 30px;
      height: 30px;
      font-size: 30px;
    }
  }
  &__name {
    width: 100%;
    margin-top: 9px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  &__bg,
  &__box {
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__bg {
    width: 94%;
    height: 70px;
    box-sizing: border-box;
    &.hasBorder {
      border: 1px solid #e9e9e9;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
  .appMenu__box {
    width: 94%;
    &--1,
    &--2 {
      display: flex;
      width: 94%;
      align-items: center;
      .appMenu {
        &__icon {
          width: 34px;
          height: 34px;
          line-height: 34px;
          margin-right: 15px;
          .full {
            display: block;
            width: 34px;
            height: 34px;
            font-size: 34px;
          }
        }
        &__right {
          flex: 1;
        }
        &__name {
          text-align: left;
          margin-top: 0;
          height: 18px;
        }
        &__des {
          font-size: 12px;
          font-weight: 400;
          color: #aaaaaa;
          line-height: 15px;
        }
      }
    }
    &--2 {
      height: 100%;
    }
    &--3,
    &--4,
    &--5 {
      width: 94%;
      .appMenu {
        &__icon {
          width: 34px;
          height: 34px;
          line-height: 34px;
          margin-right: 15px;
          .full {
            display: block;
            width: 34px;
            height: 34px;
            font-size: 34px;
          }
        }
        &__name {
          text-align: left;
          height: 18px;
        }
      }
    }
    &--4,
    &--5 {
      .appMenu__icon {
        margin: 0 auto;
      }
      .appMenu__name {
        margin: 10px auto 0;
        text-align: center;
        height: 18px;
      }
    }
  }
}
</style>
