<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 17:31:33
 * @Des: 抽屉弹框 封装
-->
<template>
  <el-drawer
    :size="size"
    :modal="false"
    :direction="direction"
    v-on="$listeners"
    v-bind="$attrs"
    :wrapperClosable="false"
    @mousedown.native="handleWrapperMousedown($event)"
    @mouseup.native="handleWrapperMouseup($event)"
    class="drawer"
    :class="[{ curMask: modal }]"
  >
    <span slot="title" class="dialog-title" v-if="showCustomTitle">
      <slot name="title"></slot>
    </span>
    <section class="drawer__content" :style="`bottom:${hasFooter ? 56 : 0}px`">
      <slot></slot>
    </section>
    <section class="drawer__footer" v-if="hasFooter">
      <slot name="otherBtn"></slot>
      <apiot-button @click="cancleClick"
        >{{ $t('common.cancle') }}
      </apiot-button>
      <apiot-button :loading.sync="loading" type="primary" @click="sureClick"
        >{{ $t('common.sure') }}
      </apiot-button>
    </section>
  </el-drawer>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    // 宽度
    size: {
      type: [Number, String],
      default: '71%'
    },
    // 是否展示黑色遮罩
    modal: {
      type: Boolean,
      default: false
    },
    // 出来方向
    direction: {
      type: String,
      default: 'rtl'
    },
    loading: {
      type: Boolean,
      default: false
    },
    // 是否阻止鼠标点击默认事件冒泡
    mouseStop: {
      type: Boolean,
      default: false
    },
    // 是否有底部
    hasFooter: {
      type: Boolean,
      default: true
    },
    showCustomTitle: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      classmodel: false
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    //  确定按钮事件
    sureClick() {
      // 自己业务添加关闭
      this.$emit('update:loading', true);
      this.$emit('sure-click');
    },
    // 取消按钮事件
    cancleClick() {
      this.$emit('update:visible', false);
      this.$emit('cancle-click');
      this.$emit('update:loading', false);
    },
    handleWrapperMousedown(e) {
      if (this.mouseStop) {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
      }
      // 如果为true，则表示点击发生在遮罩层
      this.classmodel = !!e.target.classList.contains('el-drawer__container');
    },
    handleWrapperMouseup(e) {
      if (this.mouseStop) {
        if (e && e.stopPropagation) {
          e.stopPropagation();
        } else {
          window.event.cancelBubble = true;
        }
      }
      if (!!e.target.classList.contains('el-drawer__container') && this.classmodel) {
        this.$emit('update:visible', false);
      }
      this.classmodel = false;
    }
  }
};
</script>

<style lang='scss' scoped>
.drawer {
  line-height: 1;
  &.curMask {
    background: rgba(0, 0, 0, 0.3);
  }
  ::v-deep {
    .el-drawer.rtl,
    .el-drawer.ltr {
      top: 50px;
      bottom: 0;
      height: auto;
    }

    .el-drawer__container {
      outline: none;
    }

    .el-drawer__header {
      margin: 0;
      font-size: 16px;
      padding: 0 22px 0 36px;
      line-height: 56px;
      height: 55px;
      font-weight: 600;
      color: #333333;
      border-bottom: 1px solid #e9e9e9;
    }

    .el-drawer__header > :first-child {
      text-align: left;
      font-weight: 600;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #333;
    }

    .el-drawer__close-btn .el-dialog__close {
      color: #909399;
    }

    .el-drawer__close-btn .el-dialog__close:hover {
      color: $--color-primary;
    }

    .el-drawer__body {
      position: relative;
    }

    .el-drawer__close-btn {
      outline: none;
    }

    .form {
      display: flex;
      flex-wrap: wrap;
      margin: 30px 36px 0;

      &--line {
        display: flex;
        width: 100%;
      }

      &--child {
        flex: 1;
        // flex: 0 0 460px;
        margin-bottom: 24px;
        &.half {
          max-width: calc(50% - 15px);
        }
        &:nth-child(2n) {
          margin-left: 30px;
        }
      }
    }

    .form--child .el-input__inner {
      height: 32px;
      line-height: 32px;
      padding: 0 12px;
    }

    .form--child .el-date-editor--datetime {
      width: 100%;

      .el-input__icon {
        line-height: 32px;
      }

      .el-input__inner {
        padding-left: 30px;
      }
    }

    .el-select {
      width: 100%;
    }
  }

  &__content {
    position: absolute;
    top: 0;
    bottom: 56px;
    left: 0;
    right: 0;
    overflow-y: auto;
  }

  &__footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    height: 56px;
    box-sizing: border-box;
    border-top: 1px solid #e9e9e9;
    padding: 11px 30px 0 0;
    text-align: right;
  }

  &--header {
    height: 56px;
    box-shadow: 0px -1px 0px 0px #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;

    .iconfont {
      cursor: pointer;
    }
  }
}
</style>
