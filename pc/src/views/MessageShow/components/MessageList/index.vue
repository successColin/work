<!--
 * @Author: tjf
 * @Date: 2021-07-15 19:52:41
 * @Last Modified by: tjf
 * @Last Modified time: 2021-07-15 19:52:41
 * @Desc: 消息liebiao
-->
<template>
  <div class="messageList" v-loading="loading">
    <div class="header">
      <el-select
        v-model="command"
        placeholder="全部消息"
        @change="handleCommand"
      >
        <el-option
          v-for="item in dropdownArr"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        >
        </el-option>
      </el-select>
      <div class="header__right">
        <apiot-checkbox
          v-model="isOnlyUnread"
          @change="changeOnlyUnread"
          class="checkbox"
        >
          {{ $t('messageShow.OnlyUnread') }}
        </apiot-checkbox>
        <span class="line m-r-10 m-l-10"></span>
        <el-tooltip
          effect="dark"
          content="全部标记已读"
          placement="bottom"
          transition="topEnterBottomLeave"
        >
          <i @click="markAllRead" class="iconfont icon-biaojiweiyidu"></i>
        </el-tooltip>
      </div>
    </div>
    <ul
      v-if="messageArr.length"
      class="content"
      v-infinite-scroll="getPageInnerMailList"
      infinite-scroll-immediate="true"
    >
      <li class="content__item" v-for="item in messageArr" :key="item.id">
        <message-item
          :type="type"
          :message="item"
          v-on="$listeners"
          v-bind="$attrs"
            @singleRead="messageChanged"/>
      </li>
    </ul>
    <div v-else class="apiotNoData" placeholder="暂无数据"></div>
  </div>
</template>

<script>
import { getPageInnerMail, markMailAllRead } from '@/api/messageShow.js';
import MessageItem from '../MessageItem/index.vue';

export default {
  name: 'MessageList',
  components: {
    MessageItem,
  },

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
        }
      ],
      isOnlyUnread: false,
      messageArr: [],
      command: '',
      page: 1,
      size: 20,
      loading: false,
    };
  },

  computed: {},

  methods: {
    messageChanged() {
      this.$emit('readCountChanged');
    },
    changeOnlyUnread() {
      this.messageArr = [];
      this.page = 1;
      this.getPageInnerMailList();
    },
    // 获取消息
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
        this.loading = true;
        if (this.isOnlyUnread) {
          param.hasRead = false;
        }
        if (this.command) {
          param.sendTime = this.getSendTime(this.command);
        }
        getPageInnerMail(param).then((res) => {
          console.log(res);
          if (res.records.length) {
            this.messageArr = this.messageArr.concat(res.records);
            console.log(this.messageArr);
            this.page += 1;
          }
          this.loading = false;
        });
      } catch (err) {
        this.loading = false;
      }
    },
    handleCommand(value) {
      this.command = value;
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
        const newNumber = newMonth === 2 && number > 28 ? 28 : number > 30 ? 30 : number;
        result = `${newYear}-${newMonth}-${newNumber} 00:00:00`;
      } else if (type === 'NearlyHalfYear') {
        const newMonth = month >= 6 ? month - 5 : month + 7;
        const newYear = month >= 6 ? year : year - 1;
        const newNumber = newMonth === 2 && number > 28 ? 28 : number > 30 ? 30 : number;
        result = `${newYear}-${newMonth}-${newNumber} 00:00:00`;
      } else if (type === 'CurrentYear') {
        result = `${year}-01-01 00:00:00`;
      }
      return result;
    },
    markAllRead() {
      markMailAllRead({ innerMailCategory: this.type }).then(() => {
        const arr = this.messageArr.map((item) => {
          const obj = {
            ...item,
            hasRead: true
          };
          return obj;
        });
        this.messageArr = arr;
        this.messageChanged();
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
