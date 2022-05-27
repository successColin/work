<!--
 * @Descripttion: 成员 和 数据源
 * @Author: ytx
 * @Date: 2021-04-25 08:42:55
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-25 09:38:42
-->
<template>
  <apiot-tabs
    v-on="$listeners"
    v-bind="$attrs"
    v-model="activeName"
    :tabsArr="tabsArr"
    @tab-click="tabClick"
  >
    <template v-slot:UserManage>
      <user-manage v-bind="$attrs" v-if="isUser" ref="UserManage"></user-manage>
    </template>
    <template v-slot:DataSource>
      <data-source
        v-bind="$attrs"
        v-if="isSource"
        ref="DataSource"
      ></data-source>
    </template>
  </apiot-tabs>
</template>

<script>
import UserManage from './components/UserManage';
import DataSource from './components/DataSource';

export default {
  data() {
    return {
      // 判断条件
      isUser: true,
      isSource: true,
      activeName: 'UserManage'
    };
  },
  computed: {
    tabsArr() {
      return [
        {
          label: this.$t('tenant.memberList'),
          compName: 'UserManage',
          key: 'UserManage'
        },
        {
          label: this.$t('tenant.dataSource'),
          compName: 'DataSource',
          key: 'DataSource'
        }
      ];
    }
  },
  components: {
    UserManage,
    DataSource
  },
  methods: {
    tabClick() {
      this.$nextTick(() => {
        if (this.$refs[this.activeName]) {
          this.$refs[this.activeName].init();
        }
      });
    },
    setActiveName(name) {
      this.activeName = name;
      this.tabClick();
    }
  }
};
</script>
