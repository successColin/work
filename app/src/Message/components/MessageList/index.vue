<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息liebiao
-->
<template>
  <div class="messageList">
    <div class="header">
      <picker class="commandSelect" @change="handleCommand"
        :value="command" range-key="label" :range="dropdownArr">
        <view class="command">
          {{dropdownArr[commandIndex].label}}
          <i class="appIcon appIcon-xialasanjiao"></i>
        </view>
      </picker>
      <div class="header__right">
        <label class="checkbox">
          <checkbox-group @change="changeOnlyUnread">
            <div class="checkbox-box">
              <i v-show="isOnlyUnread"
                class="appIcon appIcon-a-fuxuankuangxuanzhong showSelect"></i>
              <checkbox
                value="isOnlyUnread"
                :checked="isOnlyUnread"
                class="checkbox-style"
                :class="[
                  { showSelect: !isOnlyUnread },
                ]"
              />
            </div>
          </checkbox-group>
          <span>{{ $t('message.OnlyUnread') }}</span>
        </label>
        <span class="line m-r-10"></span>
        <i @click="markAllRead" class="appIcon appIcon-quanbusheweiyidu"></i>
      </div>
    </div>
    <view v-show="computedHeight > 0"
      :style="{ height: `${computedHeight}px` }">
      <u-list
        class="content"
        v-if="messageArr.length > 0"
        @scrolltolower="getPageInnerMailList"
        ref="card"
        :height="computedHeight"
        :preLoadScreen="3"
        :pagingEnabled="true"
      >
        <u-list-item
          class="content__item"
          v-for="(item, index) in messageArr"
          :key="item.id"
          :anchor="item.id"
          :class="[
            { 'animateListClick': focusIndex === index },
          ]"
        >
          <message-item :type="type" :focusIndex.sync="focusIndex"
            :index="index" :message="item"></message-item>
        </u-list-item>
      </u-list>
      <apiot-list-nodata
        v-else-if="!isLoading && messageArr.length === 0"
      ></apiot-list-nodata>
    </view>
  </div>
</template>

<script>
import { getPageInnerMail, markMailAllRead } from '@/api/message.js';
import MessageItem from '../MessageItem/index.vue';

export default {
  name: 'MessageList',
  components: { MessageItem },

  props: {
    type: {
      type: String,
      default: 'WORK_FLOW'
    }
  },

  data() {
    return {
      dropdownArr: [
        {
          label: '全部消息',
          key: 'all'
        },
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
      commandIndex: 0,
      isOnlyUnread: false,
      messageArr: [],
      command: 'all',
      page: 1,
      size: 20,
      focusIndex: null,
      isLoading: false
    };
  },

  computed: {
    computedHeight() {
      const { windowHeight, navbarHeight } =
        this.$store.state.base.systemInfo;
      const height = windowHeight - navbarHeight - 50 - 44;
      return height;
    }
  },

  methods: {
    changeOnlyUnread(e) {
      this.messageArr = [];
      this.page = 1;
      if (e.detail.value.length) {
        this.isOnlyUnread = true;
      } else {
        this.isOnlyUnread = false;
      }
      this.getPageInnerMailList();
    },
    // 获取组织树
    getPageInnerMailList() {
      try {
        const param = {
          innerMailCategory: this.type,
          current: this.page,
          size: this.size,
          orders: [
            {
              asc: false,
              column: 'sendTime'
            }
          ]
        };
        uni.showLoading({
          title: '加载中'
        });
        this.isLoading = true;
        if (this.isOnlyUnread) {
          param.hasRead = false;
        }
        if (this.command && this.command !== 'all') {
          param.sendTime = this.getSendTime(this.command);
        }
        getPageInnerMail(param).then((res) => {
          if (res.records.length) {
            this.messageArr = this.messageArr.concat(res.records);
            console.log(this.messageArr);
            this.page += 1;
          }
          uni.hideLoading();
          this.isLoading = false;
        });
      } catch (err) {
        uni.hideLoading();
        this.isLoading = false;
      }
    },
    handleCommand(e) {
      const { value } = e.detail;
      this.commandIndex = value;
      this.command = this.dropdownArr[value].key;
      this.messageArr = [];
      this.page = 1;
      this.getPageInnerMailList();
    },
    getSendTime(type) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDay();
      const number = date.getDate();
      const t = date.getTime();
      let result = '';
      if (type === 'ThisWeek') {
        console.log(type);
        const minDay = day === 0 ? 6 : day - 1;
        console.log(t - minDay * 24 * 60 * 60 * 1000);
        const newDate = new Date(t - minDay * 24 * 60 * 60 * 1000);
        result = `${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()} 00:00:00`;
      } else if (type === 'ThisMonth') {
        const m = month + 1 >= 10 ? month + 1 : `0${month + 1}`;
        result = `${year}-${m}-01 00:00:00`;
      } else if (type === 'NearlyThreeMonths') {
        const newMonth = month >= 3 ? month - 2 : month + 10;
        const newYear = month >= 3 ? year : year - 1;
        // eslint-disable-next-line no-nested-ternary
        const newNumber = newMonth === 2 && number > 28 ? 28 : number > 30 ? 30 : number;
        result = `${newYear}-${newMonth}-${newNumber} 00:00:00`;
      } else if (type === 'NearlyHalfYear') {
        const newMonth = month >= 6 ? month - 5 : month + 7;
        const newYear = month >= 6 ? year : year - 1;
        // eslint-disable-next-line no-nested-ternary
        const newNumber = newMonth === 2 && number > 28 ? 28 : number > 30 ? 30 : number;
        result = `${newYear}-${newMonth}-${newNumber} 00:00:00`;
      } else if (type === 'CurrentYear') {
        result = `${year}-01-01 00:00:00`;
      } else if (type === 'all') {
        result = '';
      }
      return result;
    },
    markAllRead() {
      markMailAllRead().then(() => {
        const arr = this.messageArr.map((item) => {
          const obj = {
            ...item,
            hasRead: true
          };
          return obj;
        });
        this.messageArr = arr;
      });
    },
  },

  mounted() {
    this.getPageInnerMailList();
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>
