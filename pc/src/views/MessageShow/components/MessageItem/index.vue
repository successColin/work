<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息liebiao
-->
<template>
  <div class="messageItem">
    <div class="messageItem__left" :class="{isRead: message.hasRead}">
      <i v-if="type === 'WORK_FLOW'" class="iconfont icon-gongzuoliucheng"></i>
      <i v-if="type === 'SYSTEM'" class="iconfont icon-xiaoxitongzhi1"></i>
    </div>
    <div class="messageItem__right" v-if="type === 'WORK_FLOW'">
      <div>
        <span class="sponsor" v-if="item.sponsorName">
          <user-avatar :userItem="item.info"></user-avatar>
        </span>
        <span>{{item.content}}</span>
        <span v-if="message.jumpLink" @click="handleMessage(message.jumpLink)"
          class="messageLink">前往处理>></span>
      </div>
      <div class="message-content">
        <span v-for="(flag, index) in flagData" :key="`flag_${index}`">{{flag}}</span>
      </div>
      <div class="sendtime">
        <span>{{message.sendTime}}</span>
      </div>
    </div>
    <div class="messageItem__right" v-if="type === 'SYSTEM'">
      <div>
        <span>{{message.subject}}</span>
        <span v-if="message.jumpLink" @click="handleMessage(message.jumpLink)"
          class="messageLink">前往处理>></span>
      </div>
      <div class="message-content">
        <span>{{message.content}}</span>
      </div>
      <div class="sendtime">
        <span>{{message.sendTime}}</span>
      </div>
    </div>
    <div v-if="!message.hasRead" class="markRead"
      @click="markRead(message)">{{$t('messageShow.MarkRead')}}</div>
  </div>
</template>

<script>
import { markMailRead } from '@/api/messageShow.js';
import userAvatar from '@/views/orgManage/components/userAvatar/index';

export default {
  name: 'messageItem',
  components: { userAvatar },

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
  },

  data() {
    return {
      dropdownArr: [
        {
          label: this.$t('messageShow.ThisWeek'),
          key: 'ThisWeek'
        },
        {
          label: this.$t('messageShow.ThisMonth'),
          key: 'ThisMonth'
        },
        {
          label: this.$t('messageShow.NearlyThreeMonths'),
          key: 'NearlyThreeMonths'
        },
        {
          label: this.$t('messageShow.NearlyHalfYear'),
          key: 'NearlyHalfYear'
        },
        {
          label: this.$t('messageShow.CurrentYear'),
          key: 'CurrentYear'
        },
      ],
      isOnlyUnread: false,
      item: {},
      flagData: []
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
      const param = {
        ids: item.id
      };
      markMailRead(param).then((res) => {
        console.log(res);
        this.message.hasRead = true;
      });
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
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
