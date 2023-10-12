<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息liebiao
-->
<template>
  <div class="messageItem" :class="{isRead: message.hasRead === 1}">
    <div class="messageItem__left">
      <i v-if="message.innerMailCategory === 2" class="iconfont icon-gongzuoliucheng"></i>
      <i v-if="message.innerMailCategory === 3" class="iconfont icon-xiaoxitongzhi1"></i>
    </div>
    <div class="messageItem__right" v-if="message.innerMailCategory === 2">
      <div>
        <span class="sponsor" v-if="item.sponsorName">
          <user-avatar :userItem="item.info"></user-avatar>
        </span>
        <span>{{item.content}}</span>
        <span v-if="message.variablesStr"
          @click="handleMessage(message)"
          class="messageLink">前往处理>></span>
      </div>
      <div class="message-content">
        <span v-for="(flag, index) in flagData" :key="`flag_${index}`">{{flag}}</span>
      </div>
      <div class="sendtime">
        <span>{{message.sendTime}}</span>
      </div>
    </div>
    <div class="messageItem__right" v-if="message.innerMailCategory === 3">
      <div>
        <span>{{message.subject}}</span>
        <span v-if="message.jumpLink || message.skipMenuConfig"
          @click="handleInnerMessage(message)"
          class="messageLink">前往处理>></span>
      </div>
      <div class="message-content">
        <span>{{message.content}}</span>
      </div>
      <div class="sendtime">
        <span>{{message.sendTime}}</span>
      </div>
    </div>
    <div v-if="(message.hasRead === 2)" class="markRead"
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
    handleMessage(item) {
      this.$emit('fetchNodeInfo', item.variablesStr);
      if (item.hasRead === 2) {
        this.markRead(item);
      }
    },
    handleInnerMessage(item) {
      const variablesStr = item.variablesStr ? JSON.parse(item.variablesStr) : {};
      if (+item.interactionType === 3 && item.skipMenuConfig) {
        const skipMenuConfig = JSON.parse(item.skipMenuConfig) || [];
        this.$emit('doMessageClick', skipMenuConfig, variablesStr, item.interactionType);
      } else if (+item.interactionType === 2 && item.panelConfig) {
        const panelConfig = JSON.parse(item.panelConfig) || [];
        this.$emit('doMessageClick', panelConfig, variablesStr, item.interactionType);
      } else if (+item.interactionType === 1 && item.jumpLink) {
        if (item.jumpLink) {
          window.open(item.jumpLink, '_blank');
        }
      }
      if (item.hasRead === 2) {
        this.markRead(item);
      }
    },
    markRead(item) {
      const param = {
        ids: item.id
      };
      markMailRead(param).then((res) => {
        console.log(res);
        this.$emit('singleRead');
        this.message.hasRead = 1;
      });
    },
    openNode(item) {
      this.$emit('fetchNodeInfo', item);
    }
  },

  mounted() {
    if (this.type === 'WORK_FLOW') {
      try {
        this.item = JSON.parse(this.message.content);
      } catch (e) {
        this.item = {};
      }
      const { flagData = '[]' } = this.item;
      // const arr = [];
      this.item = {
        ...this.item,
        info: {
          username: this.item.sponsorName,
          image: this.item.sponsorAvatar || '',
          id: 9999
        }
      };
      try {
        if (!flagData.length) return;
        const newArr = flagData.slice(0, 3);
        const arr = newArr.map((item) => (`${item.key}: ${item.value}`));
        this.flagData = arr;
      } catch (e) {
        const newFlagData = JSON.parse(flagData);
        const newArr = newFlagData.slice(0, 3);
        const arr = newArr.map((item) => (`${item.key}: ${item.value}`));
        this.flagData = arr;
      }
      // Object.keys(flagData).forEach((key) => {
      //   arr.push(`${key}: ${flagData[key]}`);
      // });
    }
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
