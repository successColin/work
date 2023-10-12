<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息列表
-->
<template>
  <div class="messageItem" @click="markRead(messageData)">
    <div class="message-top">
      <span class="title">
        <i
          class="appIcon appIcon-gongzuoliucheng isRead"
          v-if="messageData.hasRead"
          :class="[`themeColor__font-${getThemeIndex}`]"
        ></i>
        <i
          class="appIcon appIcon-gongzuoliucheng"
          v-else
          :class="[`themeColor__font-${getThemeIndex}`]"
        ></i>
        {{ messageData.title
        }}<i v-if="messageData.isHaveRead === 2" class="spot"></i
      ></span>
    </div>
    <div class="message-content">
      <view>{{ messageData.txt }}</view>
    </div>
    <div class="sendtime">
      <span>{{ messageData.createTime }}</span>
    </div>
  </div>
</template>

<script>
// import userAvatar from '@/views/orgManage/components/userAvatar/index';

export default {
  name: 'messageItem',
  components: {},

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
        }
      ],
      isOnlyUnread: false,
      item: {},
      flagData: [],
      messageData: {}
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    changeOnlyUnread() {
      this.isOnlyUnread = !this.isOnlyUnread;
    },
    handleMessage(url) {
      window.open(url, '_blank');
    },
    markRead(item) {
      uni.navigateTo({
        url: `/Notice/NoticeDetail/index?id=${item.id}`
      });
      this.$emit('update:focusIndex', this.index);
      // const param = {
      //   ids: item.id
      // };
      // markMailRead(param).then((res) => {
      //   console.log(res);
      //   this.messageData = {
      //     ...this.messageData,
      //     hasRead: true
      //   };
      // });
      setTimeout(() => {
        this.$emit('update:focusIndex', null);
      }, 300);
    }
  },

  mounted() {
    this.messageData = {
      ...this.message
    };
    console.log(this.messageData);
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
