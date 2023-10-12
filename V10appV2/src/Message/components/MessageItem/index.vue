<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息liebiao
-->
<template>
  <div class="messageItem" @click="markRead(messageData)"
    :class="{isRead: messageData.hasRead === 1}">
    <div class="messageItem__right" v-if="message.innerMailCategory === 2">
      <div class="message-top">
        <span class="title">
          <img class="flow" v-if="messageData.hasRead === 2" src="../../img/flow.svg" />
          <i v-else class="appIcon appIcon-gongzuoliucheng"></i>
          工作流程<i v-if="(messageData.hasRead === 2)" class="spot"></i></span>
        <span v-if="messageData.variablesStr" @click.stop="handleNode(messageData)"
          class="messageLink">前往处理<i class="arrow"></i></span>
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
    <div class="messageItem__right" v-if="message.innerMailCategory === 3">
      <div class="message-top">
        <span class="title">
          <img class="flow" v-if="messageData.hasRead === 2" src="../../img/info.svg" />
          <i v-else class="appIcon appIcon-xitongxiaoxi"></i>
          系统消息<i v-if="(messageData.hasRead === 2)" class="spot"></i></span>
        <span v-if="messageData.jumpLink || messageData.skipMenuConfigApp"
          @click.stop="handleMessage(messageData)"
          class="messageLink">前往处理<i class="arrow"></i></span>
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
import flow from '../../img/flow.svg';
import info from '../../img/info.svg';

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
  watch: {
    message(v) {
      this.messageData = {
        ...v
      };
    },
  },

  methods: {
    changeOnlyUnread() {
      this.isOnlyUnread = !this.isOnlyUnread;
    },
    handleNode(item) {
      this.$emit('clickNode', item.variablesStr);
    },
    handleMessage(item) {
      const variablesStr = item.variablesStr ? JSON.parse(item.variablesStr) : {};
      if (+item.interactionType === 3 && item.skipMenuConfigApp) {
        const skipMenuConfigApp = JSON.parse(item.skipMenuConfigApp) || [];
        this.$emit('clickMessage', skipMenuConfigApp, variablesStr, item.interactionType);
      } else if (+item.interactionType === 2 && item.panelConfigApp) {
        const panelConfigApp = JSON.parse(item.panelConfigApp) || [];
        this.$emit('clickMessage', panelConfigApp, variablesStr, item.interactionType);
      } else if (+item.interactionType === 1 && item.jumpLink) {
        if (item.jumpLink) {
          const url = `/Message/components/webview/index?url=${item.jumpLink}`;
          uni.navigateTo({
            url,
          });
          // #ifdef H5
          // window.open(item.jumpLink);
          // #endif
          // #ifdef APP-PLUS
          // plus.runtime.openURL(item.jumpLink);
          // #endif
        }
      }
      if (item.hasRead === 2) {
        this.markRead(item);
      }
    },
    markRead(item) {
      this.$emit('update:focusIndex', this.index);
      if (item.hasRead === 1) {
        setTimeout(() => {
          this.$emit('update:focusIndex', null);
        }, 300);
        return;
      }
      const param = {
        ids: item.id
      };
      markMailRead(param).then((res) => {
        this.messageData = {
          ...this.messageData,
          hasRead: 1
        };
      });
      setTimeout(() => {
        this.$emit('update:focusIndex', null);
      }, 300);
    }
  },

  mounted() {
    if (this.message.innerMailCategory === 2) {
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
