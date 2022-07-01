<!--
 * @Author: sss
 * @Date: 2021-07-14 09:22:18
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-14 09:22:18
 * @Desc: 消息展示
-->
<template>
  <div class="messageShow">
    <page-tabs
      v-on="$listeners"
      v-bind="$attrs"
      v-model="activeName"
      :tabsArr="tabsArr"
      :showTabs="true"
      :hasUnRead="hasUnRead"
      @tab-click="tabClick"
    >
      <template v-slot:Workflow>
        <message-list
            v-on="$listeners"
            v-bind="$attrs"
            type="WORK_FLOW"
            ref="Workflow"/>
      </template>
      <template v-slot:SystemMessage>
        <message-list
            v-bind="$attrs"
            v-on="$listeners"
            type="SYSTEM"
            ref="SystemMessage"/>
      </template>
      <template v-slot:Communication>
        <message-list
            v-on="$listeners"
            v-bind="$attrs"
            type="P2P"
            ref="Communication"/>
      </template>
    </page-tabs>
  </div>
</template>

<script>
import { getMailCount } from '@/api/messageShow.js';
import MessageList from './components/MessageList/index';
import PageTabs from './components/PageTabs';

export default {
  name: 'MessageShow',
  components: { MessageList, PageTabs },

  props: {
  },

  data() {
    return {
      activeName: 'WORK_FLOW',
      tabsArr: [{
        label: this.$t('messageShow.Workflow'),
        slotName: 'Workflow',
        key: 'WORK_FLOW'
      }, {
        label: this.$t('messageShow.SystemMessage'),
        slotName: 'SystemMessage',
        key: 'SYSTEM'
      }],
      // , {
      //   label: this.$t('messageShow.Communication'),
      //   slotName: 'Communication',
      //   key: 'PLATFORM'
      // }
      visible: true,
      hasUnRead: {
        WORK_FLOW: null,
        SYSTEM: null,
        PLATFORM: null,
      }
    };
  },

  computed: {
  },
  watch: {
  },

  methods: {
    tabClick(e) {
      console.log(e.name);
      if (this.hasUnRead[e.name]) {
        this.hasUnRead[e.name] = 0;
      }
    },
    queryMailCount(type) {
      try {
        const param = {
          innerMailCategorys: [type],
          hasRead: false
        };
        getMailCount(param).then((res) => {
          this.hasUnRead[type] = res;
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  activated() {
  },

  mounted() {
    this.queryMailCount('SYSTEM');
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
