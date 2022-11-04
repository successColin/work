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
      >
        <apiot-select-down
          v-model="selectDownValue"
          :canCustom="true"
          :list="selectDownList"
        >
          <i class="appIcon appIcon-shaixuan"></i>
        </apiot-select-down>
      </apiot-tabs>
    </u-sticky>

    <my-todo
      v-if="currentType === 'MyTodo'"
      :filterParam="filterParam"
    ></my-todo>
    <complate-list
      v-else-if="currentType === 'ComplateList'"
      :filterParam="filterParam"
    ></complate-list>
    <cc-tom
      v-else-if="currentType === 'CcTom'"
      :filterParam="filterParam"
    ></cc-tom>
    <launch-byme v-else :filterParam="filterParam"></launch-byme>
  </view>
</template>

<script>
import LaunchByme from './components/LaunchByme';
import MyTodo from './components/MyTodo';
import ComplateList from './components/ComplateList';
import CcTom from './components/CcTom';

export default {
  components: { LaunchByme, MyTodo, ComplateList, CcTom },

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
        },
        {
          name: '抄送给我',
          type: 'CcTom'
        }
      ],
      selectDownValue: '',
      selectDownList: [
        { name: '一周内', value: 1 },
        { name: '近一个月', value: 2 },
        { name: '近三个月', value: 3 },
        { name: '半年内', value: 4 },
        { name: '一年内', value: 5 },
        { name: '全部', value: '' }
      ],
      currentType: 'MyTodo'
    };
  },

  computed: {
    // 过滤条件
    filterParam() {
      const { selectDownValue } = this;
      if (!selectDownValue) return {};
      const paramArray = {
        1: { type: 1, n: 7 }, // 本周
        2: { type: 2, n: 1 }, // 本月
        3: { type: 2, n: 3 }, // 近三个月
        4: { type: 2, n: 6 }, // 近半年
        5: { type: 3, n: 1 } // 本年
      };
      const param = paramArray[selectDownValue] || { type: 1, n: 7 };
      console.log(this.$apiot.moment.getRecentDay(param));
      return {
        beginDate: this.$apiot.moment.getRecentDay(param),
        endDate: this.$apiot.dateFormat()
      };
    },
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
      if (this.currentType !== tab.type) {
        this.currentType = tab.type;
        this.selectDownValue = '';
      }
    }
  },

  onLoad(option) {
    option = option || {};
    this.menuConfig = { ...this.menuConfig, ...option };
  }
};
</script>

<style lang='scss' scoped>
::v-deep {
  .appIcon-shaixuan {
    padding-right: 30rpx;
    font-size: 38rpx;
    color: #bbc3cd;
  }
}
</style>
