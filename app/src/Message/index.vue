<!--
 * @Author: sss
 * @Date: 2021-07-14 09:22:18
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-14 09:22:18
 * @Desc: 消息展示
-->
<template>
  <div class="message">
    <apiot-navbar :title="title">
    </apiot-navbar>
    <view class="message__tab">
      <view class="tab" :class="{active: activeName === item.key}" v-for="item in tabsArr"
        :key="item.key" @click="tabClick(item)">{{item.label}}</view>
    </view>
    <view class="message__content">
      <message-list v-show="activeName === 'WORK_FLOW'"
        type="WORK_FLOW" ref="Workflow"></message-list>
      <message-list v-show="activeName === 'SYSTEM'"
        type="SYSTEM" ref="SystemMessage"></message-list>
    </view>
  </div>
</template>

<script>
import { getMailCount } from '@/api/message.js';
import MessageList from './components/MessageList/index';

export default {
  name: 'MessageShow',
  components: { MessageList },

  props: {
  },

  data() {
    return {
      activeName: 'WORK_FLOW',
      tabsArr: [{
        label: this.$t('message.Workflow'),
        slotName: 'Workflow',
        key: 'WORK_FLOW'
      }, {
        label: this.$t('message.SystemMessage'),
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
      },
      title: '消息',
      sysMenuId: '',
    };
  },

  computed: {
  },
  watch: {
  },

  methods: {
    tabClick(e) {
      if (this.hasUnRead[e.key]) {
        this.hasUnRead[e.key] = 0;
      }
      this.activeName = e.key;
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
  },
  onLoad(option) {
    console.log(option);
    this.title = option.title;
    this.sysMenuId = option.id;
  },
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
