<!--
 * @Author: sss
 * @Date: 2021-05-19 14:38:06
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-19 14:38:06
 * @Desc: 主页面的tab页
-->
<template>
  <div class="pageTabs">
    <el-tabs class="tabs" v-on="$listeners" v-bind="$attrs">
      <el-tab-pane
        v-for="item in tabsArr"
        :label="$t(item.label)"
        :key="item.key"
        :name="item.key"
      >
        <span slot="label">
          {{$t(item.label)}}
          <i v-if="hasUnRead[item.key]" class="circleDot"></i>
        </span>
        <slot :name="item.slotName">
          {{$t(item.label)}}
        </slot>
        <slot :name="item.slotName"></slot>
      </el-tab-pane>
    </el-tabs>
    <article class="btns">
      <slot name="top-btns"></slot>
    </article>
  </div>
</template>

<script>
export default {
  name: 'PageTabs',
  components: {},

  props: {
    tabsArr: {
      type: Array,
      default() {
        return [];
      }
    },
    hasUnRead: {
      type: Object,
      default() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
$--tabTopHeight: 42px;
.pageTabs {
  position: relative;
  height: 100%;
}
.tabs {
  height: 100%;
  background: #fff;
  ::v-deep {
    .el-tabs__header {
      margin: 0 0 10px;
    }
    .el-tabs__item {
      height: $--tabTopHeight;
      line-height: $--tabTopHeight;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #333333;
      &.is-active {
        color: $--color-primary;
        font-weight: 600;
      }
    }
    .el-tabs__active-bar {
      bottom: 2px;
      background: $--color-primary;
    }
    .el-tabs__nav-wrap {
      padding-left: 20px;
    }
    .el-tabs__nav-wrap::after {
      background: #ffffff;
      box-shadow: 0px -1px 0px 0px #ebebeb;
    }
    .el-tabs__content {
      height: calc(100% - 57px);
      .el-tab-pane {
        height: 100%;
      }
    }
    .circleDot{
      width: 5px;
      height: 5px;
      background: #EE5E5E;
      border-radius: 9px;
      display: inline-block;
      vertical-align: text-top;
    }
  }
}
.btns {
  position: absolute;
  top: 0;
  right: 0;
  height: $--tabTopHeight;
  line-height: $--tabTopHeight;
}
</style>
