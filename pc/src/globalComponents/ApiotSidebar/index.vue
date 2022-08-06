<template>
  <div class="sidebar" :class="isNeedAdd ? '' : `p-t-${paddingTop}`">
    <div class="sidebar__add" v-if="isNeedAdd">
      <el-popover
        placement="bottom"
        width="200"
        trigger="click"
        v-model="showPopo"
        @hide="doAfterHide"
      >
        <apiot-input
          v-model.trim="input"
          :placeholder="
            $t('placeholder.pleaseEnterAnyName', {
              any: $t('entity.group'),
            })
          "
          class="sidebar__add--input"
          maxlength="30"
        ></apiot-input>
        <div class="sidebar__add--btns">
          <apiot-button @click="doAfterHide" class="sidebar__add--btn">{{
            $t('common.cancle')
          }}</apiot-button>
          <apiot-button
            type="primary"
            @click="doAddGroup"
            class="sidebar__add--btn"
            >{{ $t('common.sure') }}</apiot-button
          >
        </div>
        <apiot-button slot="reference" class="sidebar__add--target">
          <i :class="`iconfont ${addIcon} m-r-6`"></i
          >{{ $t('common.add', { name: $t('entity.group') }) }}
        </apiot-button>
      </el-popover>
    </div>
    <div
      class="sidebar__list"
      :class="{
        'sidebar__list--moving': selectedBackKey !== -1,
        notShowHover: notShowHover,
      }"
    >
      <apiot-nodata v-if="!dragGroupList.length"></apiot-nodata>
      <draggable
        v-model="dragGroupList"
        :disabled="!isNeedMove"
        animation="300"
        handle=".icon-zongxiangtuodong"
        v-on="$listeners"
        v-bind="$attrs"
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
            :class="{
              active: selectedKey === item.id,
              hover: hoverKey === item.id,
            }"
            :style="`animation-duration: ${100 * index}ms`"
            v-for="(item, index) in dragGroupList"
            :key="item.id"
            @click="selectList(item, index)"
            @mousemove="notShowHover = false"
            @mouseenter="hoverKey = item.id"
            @mouseleave="hoverKey = 0"
          >
            <i
              class="iconfont icon-zongxiangtuodong"
              v-if="isNeedMove && !notNeedMoveArr.includes(item.id)"
            ></i>
            <i
              :class="`iconfont ${itemIconArr[0]}`"
              v-show="selectedKey === item.id"
            ></i>
            <i
              :class="`iconfont ${itemIconArr[1]}`"
              v-if="itemIconArr.length === 2"
              v-show="selectedKey !== item.id"
            ></i>
            <div
              class="sidebar__list--notEdit"
              v-if="isEditKey !== item.id"
              :style="`${
                itemIconArr.length === 0 ? 'margin-left: 40px' : ''
              }; ${isEllipsis ? 'width: calc(230px - 3px - 38px)' : ''}`"
            >
              <span
                class="sidebar__list--text font__ellipsis"
                :title="item.name"
                >{{ item.name }}</span
              >
              <el-dropdown
                class="sidebar__list--dropdown"
                :class="[{ curRight: !isNeedNum }]"
                trigger="click"
                ref="dropdown"
                @command="handleCommand"
                placement="bottom"
                :tabindex="-1"
                v-if="isNeedOperate && !notNeedOpeArr.includes(item.id)"
              >
                <i class="iconfont icon-gengduocaozuo"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{ type: 'edit', item: item }">{{
                    $t('entity.changeGroupName')
                  }}</el-dropdown-item>
                  <el-dropdown-item :command="{ type: 'del', item: item }">{{
                    $t('common.delete', { name: $t('entity.group') })
                  }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <span class="sidebar__list--number" v-if="isNeedNum">{{
                item.tableTotal || item.roleTotal || 0
              }}</span>
            </div>
            <apiot-input
              class="sidebar__list--edit"
              @blur="handleSubmitGroupName"
              @keyup.enter.native="enterInput"
              @keydown.native="keyDown"
              @click.native.stop.prevent
              ref="inputVal"
              v-forbid
              maxlength="30"
              v-model="groupname"
              v-if="isEditKey === item.id"
              :placeholder="
                $t('placeholder.pleaseEnterAny', {
                  any: $t('entity.content'),
                })
              "
            ></apiot-input>
          </li>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // 是否需要添加按钮
    isNeedAdd: {
      type: Boolean,
      default: true
    },
    // padding-top 的值
    paddingTop: {
      type: Number,
      default: 10
    },
    // 添加按钮的图标
    addIcon: {
      type: String,
      default: 'icon-xinzengwenjianjia'
    },
    // 是否需要显示子项条数
    isNeedNum: {
      type: Boolean,
      default: true
    },
    // 是否需要拖动
    isNeedMove: {
      type: Boolean,
      default: true
    },
    // 不需要移动的数组
    notNeedMoveArr: {
      type: Array,
      default: () => []
    },
    // 是否需要操作
    isNeedOperate: {
      type: Boolean,
      default: true
    },
    // 某几项不需要操作的分组数组
    notNeedOpeArr: {
      type: Array,
      default: () => []
    },
    // 分组数据
    groupList: {
      type: Array,
      default: () => []
    },
    // 当前Item的icon，为数组，第一项是默认icon，第二项是选中后的icon，如只传一个值，则选中后icon不变
    itemIconArr: {
      type: Array,
      default: () => ['icon-fenzuzhankai', 'icon-fenzuchangtai']
    },
    // 当前index
    curIndex: {
      type: Number,
      default: 0
    },
    isEllipsis: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      input: '', // popo 输入框内容
      showPopo: false, // 是否展示popo
      selectedKey: 0, // 当前选中的key
      selectedBackKey: -1, // 当前选中的key的备份
      notShowHover: false,
      hoverKey: 0, // 悬停样式
      isEditKey: -1, // 当前编辑的id
      groupname: '', // edit 的时候当前group 的名字
      oldGroupname: '', // 备份groupname
      dragGroupList: [],
      transitionName: 'fadeInUp',
      timer: null
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    // 不允许空格
    keyDown(e) {
      if (e.keyCode === 32) {
        e.preventDefault();
        return false;
      }
    },
    enterInput(e) {
      e.target.blur();
    },
    // 修改名字
    handleSubmitGroupName() {
      // 名字未变处理
      if (this.groupname === this.oldGroupname) {
        this.isEditKey = -1;
        return;
      }
      // 为空处理
      if (!this.groupname) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: this.$t('common.notEmpty', {
            name: this.$t('common.name', { name: this.$t('entity.group') })
          })
        });
        this.groupname = this.oldGroupname;
        this.isEditKey = -1;
        return;
      }
      this.$emit('handleSubmitGroupName');
    },
    // 切换分组
    selectList(item, index) {
      this.selectedKey = item.id;
      this.isEditKey = -1;
      this.groupname = item.name;
      //   this.curIndex = index;
      this.$emit('update:curIndex', index);
      this.$emit('selectList', item);
    },
    // 新增取消
    doAfterHide() {
      // 输入框值清空值
      this.input = '';
      this.showPopo = false;
    },
    // 新增操作
    doAddGroup() {
      if (!this.input) {
        return this.$message({
          type: 'warning',
          message: this.$t('common.notEmpty', {
            name: this.$t('common.name', { name: this.$t('entity.group') })
          })
        });
      }
      this.transitionName = 'move-right';
      this.$emit('doAddGroup');
    },
    // 拖拽开始
    dragStart(evt) {
      this.notShowHover = true;
      const eleArr = this.$refs.dropdown;
      if (eleArr.length) {
        eleArr.forEach((ele) => {
          ele.hide();
        });
      }
      this.selectedBackKey = this.dragGroupList[evt.oldIndex].id;
      this.selectedKey = this.selectedBackKey;
      this.$emit('dragStart', evt);
    },
    // 拖拽中
    dragMove(evt) {
      if (this.notNeedMoveArr.includes(evt.relatedContext.element.id)) {
        return false;
      }
    },
    // 拖拽结束
    dragEnd(evt) {
      this.hoverKey = 0;
      this.selectedBackKey = -1;
      // 高度变化动画
      evt.item.style.height = '0px';
      evt.item.style.overflow = 'hidden';
      this.$nextTick(() => {
        evt.item.style = '';
      });
      if (evt.oldIndex === evt.newIndex) {
        return;
      }
      this.selectList(this.dragGroupList[evt.newIndex], evt.newIndex);
      this.$nextTick(() => {
        this.hoverKey = 0;
      });
      this.$emit('dragEnd', evt, this.dragGroupList);
    },
    async handleCommand({ type, item }) {
      // 点击下拉菜单出发的动作
      // console.log(type, item, this.selectedKey);
      // 编辑
      if (type === 'edit') {
        this.isEditKey = item.id;
        this.$nextTick(() => {
          // DOM 更新了
          this.oldGroupname = this.groupname;
          this.$refs.inputVal[0].focus();
        });
        return;
      }
      // 删除
      if (type === 'del') {
        try {
          await this.$confirm(this.$t('common.sureToDelete'), this.$t('common.tip'), {
            confirmButtonText: this.$t('common.sure'),
            cancelButtonText: this.$t('common.cancle'),
            type: 'warning'
          });
          //   this.deleteGroup(item);
          this.transitionName = 'move-right';
          this.$emit('deleteGroup', item);
        } catch (err) {
          // console.log(err);
          this.isEditKey = -1;
        }
      }
    }
  },

  watch: {
    groupList: {
      handler(v1, v2) {
        if (v2 && v2.length === 0) {
          this.transitionName = 'fadeInUp';
        }
        this.dragGroupList = v1;
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang='scss' scoped>
.sidebar {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  box-sizing: border-box;
  &__add {
    flex: 0 0 42px;
    box-sizing: border-box;
    padding: 6px 8px;
    &--input {
      ::v-deep {
        .el-input__inner {
          height: 32px;
          line-height: 32px;
          width: 100%;
          padding: 0 50px 0 12px;
        }
      }
    }
    &--btns {
      margin-top: 10px;
      display: flex;
      justify-content: space-evenly;
    }
    &--btn {
      width: 96px;
    }
    &--target {
      width: 100%;
      .iconfont {
        color: $--color-primary;
      }
    }
  }
  &__list {
    flex: 1;
    width: 100%;
    overflow-y: auto;
    &.notShowHover {
      .sidebar__list--li {
        &.hover {
          background: transparent !important;
          .icon-zongxiangtuodong,
          .icon-gengduocaozuo,
          .sidebar__list--number {
            display: none !important;
          }
        }
      }
    }
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
          // border-left-color: transparent !important;
          // border-top: 1px dashed $--color-primary !important;
          // height: 0px !important;
          // overflow: hidden !important;
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
      .icon-fenzuzhankai {
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
    }
    &--dropdown {
      position: absolute;
      right: 38px;
      &.curRight {
        right: 0;
      }
    }
    &--notEdit {
      position: relative;
      width: calc(230px - 3px - 38px - 18px);
      display: flex;
      align-items: center;
    }
    &--text {
      flex: 0 0 100px;
      max-width: 100px;
      padding: 0 5px;
      color: #333333;
      font-size: 13px;
    }
    &--number {
      position: absolute;
      right: 0;
      display: none;
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
    &--edit {
      margin-left: 6px;
      flex: 1;
      ::v-deep {
        .el-input__inner {
          height: 28px;
          line-height: 28px;
          width: 100%;
          padding: 0 50px 0 8px;
        }
      }
    }
  }
}
</style>
