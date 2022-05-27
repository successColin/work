<!--
 * @Author: sss
 * @Date: 2021-07-05 09:43:14
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-05 09:43:14
 * @Desc: 表达式 正则表达式 cron表达式
-->
<template>
  <apiot-content
    class="expression"
    :asideLoading="asideLoading"
    :contentLoading="contentLoading"
  >
    <template v-slot:sidebar>
      <apiot-sidebar
        ref="exBar"
        :groupList="sideBarList"
        :isNeedAdd="false"
        :isNeedNum="false"
        :isNeedMove="false"
        :isNeedOperate="false"
        @selectList="selectList"
      ></apiot-sidebar>
    </template>
    <template>
      <apiot-page-tabs
        v-model="currentTab"
        :tabsArr="tabList"
        @tab-click="tabClick"
      >
        <Regular
          ref="regular"
          slot="Regular"
          :expressionGroup="expressionGroup"
          :contentLoading.sync="contentLoading"
        ></Regular>
        <Cron
          ref="corn"
          slot="Corn"
          :expressionGroup="expressionGroup"
          :contentLoading.sync="contentLoading"
        ></Cron>
      </apiot-page-tabs>
    </template>
  </apiot-content>
</template>

<script>
import Cron from './components/tabContent/Corn';
import Regular from './components/tabContent/Regular';

export default {
  name: 'Expression',
  components: { Cron, Regular },

  props: {},

  data() {
    return {
      asideLoading: true,
      contentLoading: false,
      currentTab: 'regular', // 当前选中的tab页
      tabList: [
        // tab基本信息
        {
          label: 'expression.regExTab',
          slotName: 'Regular',
          key: 'regular'
        },
        {
          label: 'expression.cornExTab',
          slotName: 'Corn',
          key: 'corn'
        }
      ],
      expressionGroup: 1
    };
  },

  computed: {
    getGropSide() {
      return this.$refs.exBar;
    },
    sideBarList() {
      // 左侧列表
      return this.$store.state.dictManage.EXPRESSION_GROUOP.map((item) => {
        // 获取表达式分组
        const { value, zhCN } = item;
        item.id = value;
        item.name = zhCN;
        return item;
      });
    }
  },

  methods: {
    tabClick(tab) {
      this.$broadcast('changeHeight');
      this.$nextTick(() => {
        this.currentTab = tab.name;
        tab.$children[0].initList();
      });
      // 切花tab页
    },
    // 获取首屏左边分组列表
    async getDictList() {
      await this.$store.dispatch('getCurrentDict', 'EXPRESSION_GROUOP'); // 获取表达式分组
      this.$store.dispatch('getCurrentDict', 'EXPRESSION_TYPE'); // 获取表达式类型
      this.asideLoading = false;
      this.getGropSide.selectList(this.sideBarList[0], 0);
    },
    // 切换分组时做的操作
    selectList(node) {
      // console.log(node);
      this.expressionGroup = node.id;
      this.$nextTick(() => {
        this.$refs[this.currentTab].initList();
      });
    }
  },

  mounted() {
    this.getDictList();
  }
};
</script>

<style lang='scss' scoped>
</style>
