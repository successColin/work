<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:25:54
 * @Des: tab 页面封装
-->
<template>
  <transition name="slide-bottom">
    <div class="tabs" v-if="showTabs && tabsArr.length">
      <apiot-button class="tabs__return" @click="handleReturnBtn">
        <i :class="`iconfont ${icon}`"></i>{{ $t('common.return') }}
      </apiot-button>
      <slot name="button"></slot>
      <el-tabs v-on="$listeners" v-bind="$attrs">
        <el-tab-pane
          :label="item.label"
          :name="item.key"
          v-for="item in tabsArr"
          :key="item.key"
          lazy
        >
          <!-- <component :is="item.compName"></component> -->
          <slot :name="item.compName"></slot>
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    icon: {
      type: String,
      default: 'icon-fanhui'
    },
    showTabs: {
      type: Boolean,
      default: false
    },
    tabsArr: {
      type: Array,
      default() {
        // 该数组的项必须包括 label compName key
        return [];
      }
    }
  },
  data() {
    return {
      activeName: ''
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.activeName = this.tabsArr[0]?.key;
  },

  methods: {
    handleReturnBtn() {
      this.$emit('update:showTabs', false);
      this.$emit('handleReturn');
    }
  }
};
</script>

<style lang='scss' scoped>
.tabs {
  position: fixed;
  top: -200px;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 102;
  background: rgba(0, 0, 0, 0.3);
  ::v-deep {
    .tabs__return {
      top: $tabsHeaderToHeader;
    }
    & > .el-tabs {
      position: absolute;
      left: 0;
      right: 0;
      top: $tabsHeaderToHeader;
      bottom: 0;
      background: #f6f6f8;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      height: calc(100% - #{$layoutHeader} - 200px) !important;
    }
  }
  &__return {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100px;
    height: 46px;
    border-width: 0 1px 0 0;
    border-color: #ebebeb;
    border-radius: 0;
    color: #333333;
    font-size: 16px;

    i {
      font-size: 20px;
      margin-right: 8px;
      color: #9b9b9b;
    }

    &:hover,
    &:active,
    &:focus {
      border-color: #ebebeb !important;
      background-color: #fff !important;
      i {
        color: $--color-primary;
      }
    }
  }

  ::v-deep {
    .el-tabs {
      height: 100%;
    }

    .el-tabs__header {
      margin: 0;
      background-color: #fff;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      height: 46px;
      line-height: 46px;
    }

    .el-tabs__nav-wrap::after {
      height: 0;
    }

    .el-tabs__nav-scroll {
      display: flex;
      justify-content: center;
    }

    .el-tabs__item {
      color: #333333;
      font-size: 16px;
      font-weight: 400;

      &.is-active {
        color: $--color-primary;
        font-family: PingFangSC-Medium;
        font-weight: 600;
      }
      &:hover {
        color: $--color-primary;
      }
    }

    .el-tabs__content {
      height: calc(100% - 46px - 10px);
      margin: 10px 10px 0;
      background-color: #fff;
    }

    .el-button:active {
      border-color: #c8dcfc;
    }

    .el-tab-pane {
      height: 100%;
      // overflow: hidden;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .el-tabs__item:focus.is-active.is-focus:not(:active) {
      box-shadow: none;
    }
  }
}
</style>
