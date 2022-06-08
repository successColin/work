<template>
  <div
    class="menuCard"
    :class="[{ hover: isHover && !isMoving }]"
    v-loading="loading"
    element-loading-background="hsla(0,0%,100%,.9)"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
    :style="`animation-duration: ${100 * Math.ceil((index + 1) / 4)}ms;`"
  >
    <div class="menuCard__normal" v-if="curState === 1">
      <div class="menuCard__top">
        <icon-select
          :key="1"
          :shouldScale="true"
          class="m-l-14 m-r-8"
          :notEdit="true"
          :item="item.icon"
        ></icon-select>
        <div class="menuCard__normalText">
          <p
            :class="[{ isSysMenu: item.menuType === 1 }]"
            :sysTitle="$t('menu.system')"
            :title="item.menuName"
            class="font__ellipsis"
          >
            {{ item.menuName }}
          </p>
          <!-- <p v-showEllipsis>{{ groupName }}</p> -->
        </div>
      </div>
      <div class="menuCard__bottom">
        <i class="iconfont icon-hengxiangtuodong"></i>
        <transition name="move-left">
          <div class="menuCard__iconSet" v-show="isHover && !isMoving">
            <el-tooltip
              effect="dark"
              :content="$t('common.edit', { name: '' })"
              :enterable="false"
              placement="bottom"
            >
              <i class="iconfont icon-bianji" @click.stop="editMenu"></i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="$t('role.copy', { name: '' })"
              :enterable="false"
              placement="bottom"
            >
              <i
                class="iconfont icon-fuzhi"
                @click.stop="copyMenu"
                v-if="item.menuType !== 1 && groupMenuCode !== 'sysHome'"
              ></i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="$t('common.delete', { name: '' })"
              :enterable="false"
              placement="bottom"
            >
              <i
                class="iconfont icon-shanchu"
                @click="deleteMenu"
                v-if="item.menuType !== 1 && groupMenuCode !== 'sysHome'"
              ></i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="解绑"
              :enterable="false"
              placement="bottom"
            >
              <i
                class="iconfont icon-jiechuguanlian"
                @click="deleteMenu"
                v-if="groupMenuCode === 'sysHome'"
              ></i>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              :content="`${item.enabled ? $t('menu.hidden') : $t('menu.show')}`"
              :enterable="false"
              placement="bottom"
            >
              <el-switch
                class="m-l-2"
                v-model="item.enabled"
                :active-value="true"
                :inactive-value="false"
                v-if="item.menuType !== 1"
                @change="change"
              >
              </el-switch>
            </el-tooltip>
          </div>
        </transition>
        <i
          class="iconfont icon-caidansheji"
          v-if="item.menuType !== 1 && groupMenuCode !== 'sysHome'"
          @click="enterMenuRole"
        ></i>
      </div>
    </div>
    <div
      class="menuCard__addOrEdit"
      v-if="curState === 2 || curState === 3"
      v-apiotClickOutside="clickoutside"
    >
      <div class="menuCard__top">
        <icon-select
          :key="2"
          :shouldScale="true"
          class="m-l-14 m-r-8"
          :item="item.icon"
          @iconSelected="iconSelected"
        ></icon-select>
        <div class="menuCard__input">
          <apiot-input
            ref="nameInput"
            :placeholder="
              $t('placeholder.pleaseEnterAnyName', {
                any: $t('menu.menu'),
              })
            "
            maxlength="12"
            :readonly="item.menuType === 1"
            v-model="menuName"
          ></apiot-input>
        </div>
      </div>
      <div class="menuCard__bottom btns">
        <apiot-button type="primary" @click="sure" class="btn btns--add">{{
          $t('common.save')
        }}</apiot-button>
        <apiot-button @click="cancle" class="btn btns--cancle">{{
          $t('common.cancle')
        }}</apiot-button>
      </div>
    </div>
  </div>
</template>

<script>
import { copyMenu } from '@/api/menuManage';
import IconSelect from '../IconSelect';

export default {
  props: {
    // 是否拖动中
    isMoving: {
      type: Boolean,
      default: false
    },
    // state 1 是常态 2是添加 3是编辑状态
    index: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => {}
    },
    // 模块名称及id
    groupId: {
      type: Number,
      default: -1
    },
    // 模块表示
    groupMenuCode: {
      type: String,
      default: ''
    },
    groupName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isHover: false, // 是否悬浮
      menuName: '', // 输入框菜单名称
      iconObj: {
        icon: '',
        color: '',
        imageUrl: ''
      },
      showLoading: false,
      loading: false
    };
  },

  components: {
    IconSelect
  },

  computed: {
    curState() {
      return this.item.state;
    }
  },

  mounted() {},

  methods: {
    getStyle(index) {
      return `animation-duration: ${100 * (index / 4)}ms;`;
    },
    // 按钮取消点击事件
    cancle() {
      if (this.item.state === 3) {
        this.item.state = 1;
      }
      if (this.item.state === 2) {
        this.$emit('addCancle');
      }
    },
    clickoutside() {
      if (this.item.state === 2) {
        return;
      }
      this.item.state = 1;
    },
    // 按钮确定点击事件
    sure() {
      if (this.iconObj.icon === '' && this.iconObj.imageUrl === '') {
        return this.$message({
          type: 'warning',
          message: this.$t('placeholder.pleaseSelect', { any: this.$t('menu.icon') })
        });
      }
      if (this.menuName === '') {
        return this.$message({
          type: 'warning',
          message: this.$t('placeholder.pleaseEnterAnyName', {
            any: this.$t('menu.menu')
          })
        });
      }
      if (this.item.state === 2) {
        const params = {
          menuName: this.menuName,
          icon: this.iconObj
        };
        this.$emit('addSure', params);
      } else if (this.item.state === 3) {
        const params = {
          index: this.index,
          id: this.item.id,
          menuName: this.menuName,
          icon: this.iconObj,
          enabled: this.item.enabled,
          menuCode: this.item.menuCode,
          sno: this.item.sno
        };
        this.$emit('editSure', params);
      }
    },
    // 是否显示change
    change() {
      const params = {
        index: this.index,
        id: this.item.id,
        menuName: this.item.menuName,
        icon: this.item.icon,
        enabled: this.item.enabled,
        sno: this.item.sno
      };
      this.$emit('editSure', params);
    },
    // 删除菜单
    deleteMenu() {
      this.$emit('deleteMenu', this.index);
    },
    // 编辑菜单
    editMenu() {
      this.menuName = this.item.menuName;
      this.item.state = 3;
    },
    // 复制菜单
    async copyMenu() {
      console.log(this.groupId, this.item.id);
      this.loading = true;
      try {
        await copyMenu({
          menuId: this.item.id,
          modelMenuId: this.groupId
        });
        this.loading = false;
        this.$emit('getList');
        this.$message({
          type: 'success',
          message: '复制成功'
        });
        this.$store.dispatch('getRoute');
      } catch (e) {
        this.loading = false;
      }
    },
    iconSelected(obj) {
      // console.log(obj);
      this.iconObj = obj;
    },
    enterMenuRole() {
      sessionStorage.menuBackPath = this.$route.path;
      const str = `/menuConfig/${this.item.id}?menuName=${this.item.menuName}&id=${this.item.menuDesignId}`;
      // this.$router.replace(`/menuRole/${this.item.id}?menuName=${this.item.menuName}`);
      this.$router.replace(str);
    }
  },

  watch: {
    'item.state': {
      handler(v) {
        if (v === 3 && this.item.icon) {
          this.iconObj = JSON.parse(JSON.stringify(this.item.icon));
        }
        if (v === 3 || v === 2) {
          this.$nextTick(() => {
            this.$refs.nameInput.focus();
          });
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang='scss' scoped>
.menuCard {
  vertical-align: top;
  flex: 0 0 calc(25% - 14px);
  height: 100px;
  display: inline-flex;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e9e9e9;
  margin-bottom: 14px;
  box-sizing: border-box;
  overflow: hidden;
  &__normal,
  &__addOrEdit {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  &__top {
    flex: 0 0 66px;
    display: flex;
    align-items: center;
  }
  &__normalText {
    flex: 1;
    p.isSysMenu {
      position: relative;
      &:after {
        content: attr(sysTitle);
        position: absolute;
        width: max-content;
        padding: 0 6px;
        height: 16px;
        line-height: 16px;
        background: #bbc3cd;
        border-radius: 4px;
        color: #fff;
        font-weight: 400;
        font-size: 12px;
        text-align: center;
        margin-top: 2px;
        margin-left: 4px;
      }
    }
  }
  &__bottom {
    position: relative;
    flex: 0 0 32px;
    box-sizing: border-box;
    border-top: 1px solid #e9e9e9;
    background: #fafbfd;
    display: flex;
    align-items: center;
    .iconfont {
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      margin-left: 8px;
      color: #aaaaaa;
      &:hover {
        color: $--color-primary;
      }
    }
    .icon-hengxiangtuodong {
      position: relative;
      z-index: 1;
      width: 44px;
      border-right: 1px solid #e9e9e9;
      cursor: move;
      margin-left: 0;
      background: #fafbfd;
    }
    .icon-caidansheji {
      position: absolute;
      width: 34px;
      height: 34px;
      right: 20px;
      top: -17px;
      line-height: 34px;
      text-align: center;
      font-size: 24px;
      border-radius: 50%;
      color: #e9e9e9;
      border: 1px solid #e9e9e9;
      background-color: #fff;
      transition: all 400ms;
      &:hover {
        color: #fff !important;
        background-color: $--hover-bgColor !important;
      }
    }
  }
  &__iconSet {
    display: flex;
    align-items: center;
    ::v-deep {
      .el-switch {
        transform: scale(0.7);
      }
      // .el-switch__core {
      //   height: 14px;
      //   line-height: 14px;
      // }
    }
  }
  &.hover {
    box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
    .icon-caidansheji {
      color: #fff;
      background-color: $--color-primary;
    }
  }
  &__icon {
    .iconfont {
      font-size: 32px;
      color: #fab71c;
    }
  }
  &__normalText {
    p:first-child {
      font-size: 13px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      width: 80%;
    }
  }
  &__input {
    flex: 1;
    ::v-deep {
      .el-input__inner {
        border: 0 none;
        padding: 0;
        font-size: 13px;
        font-weight: 400;
        color: #333333;
      }
    }
  }
  .btns {
    flex-direction: row-reverse;
    .btn {
      width: 46px;
      height: 22px;
      line-height: 22px;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 12px;
      font-weight: 400;
    }
    &--add {
      margin-right: 14px;
    }
    &--cancle {
      color: #333333;
      margin-right: 10px;
    }
  }
}
</style>
