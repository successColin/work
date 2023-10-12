<template>
  <div class="previewPage">
    <div class="previewPage__content">
      <header class="previewPage__header">
        <div class="previewPage__header--center">
          {{ panelName }}
        </div>
        <div class="previewPage__header--right">
          <div class="previewPage__header--close" @click="closePanle">
            <i class="iconfont icon-guanbi"></i>
            <span>关闭</span>
          </div>
        </div>
      </header>
      <section class="previewPage__body">
        <ApiotMenu
          class="previewPage__body--page"
          :isPreview="true"
          :previewConfigData="configData"
        ></ApiotMenu>
      </section>
    </div>
  </div>
</template>

<script>
import ApiotMenu from '@/views/ApiotMenu';

export default {
  name: '',
  props: {
    panelName: {
      type: String,
    },
    configData: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  components: {
    ApiotMenu,
  },
  methods: {
    closePanle() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style lang="scss" scoped>
.previewPage {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  // height: 100vh;
  // background: rgba(0, 0, 0, 0.3);
  &__content {
    position: absolute;
    top: 0px;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
  }
  &__header {
    display: flex;
    height: 46px;
    line-height: 46px;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    position: relative;
    border-bottom: 1px solid #e9e9e9;
    z-index: 2;
    &--left {
      box-sizing: border-box;
      flex: 0 0 48px;
      border-right: 1px solid #e9e9e9;
      text-align: center;
      .iconfont {
        font-size: 20px;
        color: #9b9b9b;
      }
    }
    &--center {
      position: relative;
      flex: 1;
      padding-left: 14px;
      font-weight: 500;
      color: #333333;
      font-size: 16px;
    }
    &--right {
      margin-left: auto;
    }
    &--close {
      display: flex;
      align-items: center;
      border-left: 1px solid #e9e9e9;
      cursor: pointer;
      padding: 0 20px;
      &:hover {
        i {
          color: $--color-primary;
        }
      }
      i {
        color: #bbc3cd;
        font-size: 16px;
        margin-right: 4px;
      }
      span {
        font-size: 14px;
      }
    }
  }
  &__body {
    height: calc(100% - 46px);
    position: relative;
    background-color: #f6f6f8;
    &--page {
      margin: 10px;
      margin-bottom: 0;
      width: calc(100% - 20px);
      box-sizing: border-box;
      height: calc(100% - 10px);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.16);
      background-color: #fff;
      position: absolute !important;
    }
  }
}
</style>
