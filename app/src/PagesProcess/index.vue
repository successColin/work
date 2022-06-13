<!--
 * @Author: sss
 * @Date: 2022-05-25 11:04:57
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:04:57
 * @Desc: 流程
-->
<template>
  <view class="pagesProcess">
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="menuConfig.title"></apiot-navbar>
    <!-- #endif -->
    <u-sticky :customNavHeight="customBar">
      <apiot-tabs
        :list="tabArry"
        :is-scroll="false"
        :current="currentIndex"
        @change="tabsChange"
      ></apiot-tabs>
    </u-sticky>

    <my-todo v-if="currentType === 'MyTodo'"></my-todo>
    <complate-list v-else-if="currentType === 'ComplateList'"></complate-list>
    <launch-byme v-else></launch-byme>
  </view>
</template>

<script>
import LaunchByme from './components/LaunchByme';
import MyTodo from './components/MyTodo';
import ComplateList from './components/ComplateList';

export default {
  components: { LaunchByme, MyTodo, ComplateList },

  props: {},

  data() {
    return {
      // 菜单界面基础配置
      menuConfig: {
        title: '流程审批' // 名称
      },
      tabArry: [
        {
          name: '待我审批',
          type: 'MyTodo'
        },
        {
          name: '已完成的',
          type: 'ComplateList'
        },
        {
          name: '我发起的',
          type: 'LaunchByme'
        }
      ],
      currentType: 'MyTodo'
    };
  },

  computed: {
    currentIndex() {
      return this.tabArry.findIndex((item) => item.type === this.currentType);
    },
    systemInfo() {
      return this.$store.state.base.systemInfo;
    },
    // 顶部固定高度
    customBar() {
      let height = this.systemInfo.customBar;
      // #ifdef MP-ALIPAY
      height = 0;
      // #endif
      return height;
    }
  },

  methods: {
    tabsChange(index) {
      const tab = this.tabArry[index];
      this.currentType = tab.type;
    }
  },

  onLoad(option) {
    option = option || {};
    this.menuConfig = { ...this.menuConfig, ...option };
  }
};
</script>

<style lang='scss' scoped>
</style>
