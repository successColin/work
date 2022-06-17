<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息liebiao
-->
<template>
  <div class="messageItem" @click="markRead(messageData)">
    <div class="messageItem__right" v-if="type === 'WORK_FLOW'">
      <div class="message-top">
        <span class="title">
          <i class="appIcon appIcon-gongzuoliucheng" :class="{isRead: messageData.hasRead}"></i>
          工作流程<i v-if="!messageData.hasRead" class="spot"></i></span>
        <span v-if="messageData.jumpLink" @click="handleMessage(messageData.jumpLink)"
          class="messageLink">前往处理>></span>
      </div>
      <div class="message-header">
        <span class="sponsor" v-if="item.sponsorName">
          <user-icon :userInfo="item.info" :font-size="24" :size="50"></user-icon>
          <span class="sponsor__name">{{item.sponsorName}}</span>
        </span>
        {{item.content}}
      </div>
      <div class="message-content">
        <view v-for="(flag, index) in flagData" :key="`flag${index}`">{{flag}}</view>
      </div>
      <div class="sendtime">
        <span>{{messageData.sendTime}}</span>
      </div>
    </div>
    <div class="messageItem__right" v-if="type === 'SYSTEM'">
      <div class="message-top">
        <span class="title">
          <i class="appIcon appIcon-xitongxiaoxi" :class="{isRead: messageData.hasRead}"></i>
          系统消息<i v-if="!messageData.hasRead" class="spot"></i></span>
        <span v-if="!messageData.jumpLink" @click="handleMessage(messageData.jumpLink)"
          class="messageLink">前往处理>></span>
      </div>
      <div class="message-header">
        <span>{{messageData.subject}}</span>
      </div>
      <div class="message-content">
        <span>{{messageData.content}}</span>
      </div>
      <div class="sendtime">
        <span>{{messageData.sendTime}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { markMailRead } from '@/api/message.js';
// import userAvatar from '@/views/orgManage/components/userAvatar/index';
import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';

export default {
  name: 'messageItem',
  components: { UserIcon },

  props: {
    type: {
      type: String,
      default: 'WORK_FLOW'
    },
    message: {
      type: Object,
      default() {
        return {};
      }
    },
    index: {
      type: Number,
      default: null
    }
  },

  data() {
    return {
      dropdownArr: [
        {
          label: this.$t('message.ThisWeek'),
          key: 'ThisWeek'
        },
        {
          label: this.$t('message.ThisMonth'),
          key: 'ThisMonth'
        },
        {
          label: this.$t('message.NearlyThreeMonths'),
          key: 'NearlyThreeMonths'
        },
        {
          label: this.$t('message.NearlyHalfYear'),
          key: 'NearlyHalfYear'
        },
        {
          label: this.$t('message.CurrentYear'),
          key: 'CurrentYear'
        },
      ],
      isOnlyUnread: false,
      item: {},
      flagData: [],
      messageData: {}
    };
  },

  computed: {
  },

  methods: {
    changeOnlyUnread() {
      this.isOnlyUnread = !this.isOnlyUnread;
    },
    handleMessage(url) {
      window.open(url, '_blank');
    },
    markRead(item) {
      this.$emit('update:focusIndex', this.index);
      const param = {
        ids: item.id
      };
      markMailRead(param).then((res) => {
        console.log(res);
        this.messageData = {
          ...this.messageData,
          hasRead: true
        };
      });
      setTimeout(() => {
        this.$emit('update:focusIndex', null);
      }, 300);
    }
  },

  mounted() {
    if (this.type === 'WORK_FLOW') {
      this.item = JSON.parse(this.message.content);
      const { flagData } = this.item;
      const arr = [];
      this.item = {
        ...this.item,
        info: {
          username: this.item.sponsorName,
          image: this.item.sponsorAvatar || '',
          id: 9999
        }
      };
      Object.keys(flagData).forEach((key) => {
        arr.push(`${key}: ${flagData[key]}`);
      });
      this.flagData = arr;
    }
    this.messageData = {
      ...this.message
    };
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
