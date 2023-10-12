/**
* @name: index
* @author: DELL
* @date: 2023/8/30 14:23
* @description：index
* @update: 2023/8/30 14:23
*/
<!-- 页面 -->
<template>
  <div class="glassBox" v-loading="loading">
    <div class="glassListBox">
      <el-row :gutter="16" class="glassRow">
        <div
        v-if="!list.length"
        class="apiotNoData"
        :placeholder="$t('common.noData')"
      ></div>
        <el-col :span="8" v-for="item in list" :key="item.id">
          <div class="glassCard">
            <div :class="`cardMain ${getState(item).classTitle}`">
              <div class="cardInfo">
                <img :src="getState(item).url" alt="">
                <div class="cardDetails">
                  <div class="glassName">{{ item.glassName }}</div>
                  <div class="glassDes">{{ item.glassCode }}</div>
                  <div class="glassDes">
                    <span>{{ item.onLineUserAccount }}</span> &nbsp;
                    <span>{{ item.onLineUserName }}</span>
                  </div>
                </div>
              </div>
              <div class="cardStatus">
                <span :class="`stateColor ${getState(item).classTitle}`"></span>
                {{ getState(item).name }}
              </div>
            </div>
            <div class="cardFooter">
              <div>
                <div class="userListBox" v-if="getUserList(item).length">
                  <div class="listBox">
                    <UserAvatar
                        :value="getUserList(item)"
                        nameKey="username"
                        :isNeedMore="false"
                        :splitLen="6"/>
                  </div>
                  <div class="memo">等{{getUserList(item).length}}人正在会议</div>
                </div>
              </div>
              <apiot-button
                  :type="getState(item).type"
                  @click="initiate(item)"
                  :disabled="getState(item).disabled">
                <i class="icon-faqihuiyi iconfont m-r-4"></i>
                {{ getState(item).btnName }}
              </apiot-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="paginationBox" v-show="total">
      <apiot-pagination
          :total="total"
          :current-page="current"
          :size="size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      ></apiot-pagination>
    </div>
  </div>
</template>

<script>
import { getMeetingList } from '@/api/expert';
import UserAvatar from '@/views/TaskToDo/Components/UserAvatar';
import bus from '@/utils/bus';

const onLine = require('../../../../assets/img/proxy/online.svg');
const offLine = require('../../../../assets/img/proxy/outline.svg');

export default {
  data() {
    return {
      loading: false,
      visible: false,
      total: 10,
      current: 1,
      size: 20,
      list: [],
    };
  },

  components: {
    UserAvatar
  },

  computed: {
    getUserList() {
      return function (item) {
        return item.conferenceInfo?.userList || [];
      };
    },
    getState() {
      return function (item) {
        const { stateid } = item;
        const obj = {
          1: '在线',
          3: '离线',
          2: '占用'
        };
        const btn = {
          1: '发起会议',
          3: '发起会议',
          2: '进入会议'
        };
        const flag = [1, 2].includes(stateid);
        return {
          name: obj[stateid],
          classTitle: flag ? 'on' : 'off',
          url: flag ? onLine : offLine,
          flag,
          disabled: [2, 3].includes(stateid),
          type: flag ? 'primary' : '',
          btnName: btn[stateid]
        };
      };
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    async initiate(item) { // 发起或者参加会议
      console.log(item);
      const { roomid, stateid, onLineUserId } = item;
      if (stateid === 1) { // 发起会议
        bus.$emit('pcConference', { onLineUserId });
      }
      if (stateid === 2) { // 加入会议
        bus.$emit('pcJoinRoom', { roomID: +roomid });
      }
    },
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.init();
    },
    handleCurrentChange(page) {
      this.current = page;
      this.init();
    },
    async init() {
      this.loading = true;
      try {
        const res = await getMeetingList({
          current: this.current,
          size: this.size,
          orders: [{
            asc: true,
            column: 'stateid'
          }]
        });
        const {
          total = 0,
          records = []
        } = res;
        this.list = records;
        this.total = total;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.glassBox {
  width: 100%;
  height: 100%;
  padding-top: 16px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;

  .glassListBox {
    height: calc(100% - 42px);
    width: 100%;
    overflow: auto;

    .glassRow {
      margin: 0 !important;
      padding: 0 6px;
      height: 100%;
    }

    .glassCard {
      height: 165px;
      margin-bottom: 16px;
      background: #FFFFFF;
      border-radius: 8px;
      border: 1px solid #E9E9E9;
      overflow: hidden;
      box-sizing: border-box;

      .cardMain {
        height: calc(100% - 58px);
        display: flex;
        justify-content: space-between;
        padding: 0 20px;

        &.on {
          background: linear-gradient(135deg, #C4F2FE 0%, #ECF8FF 56%, #EAEEFF 100%);
        }

        &.off {
          background: linear-gradient(135deg, #EAECF0 0%, #F6F8FB 56%, #EFF1F6 100%);
        }

        .cardInfo {
          display: flex;
          align-items: center;

          img {
            width: 68px;
            height: 64px;
          }

          .cardDetails {
            margin-left: 20px;

            .glassName {
              height: 22px;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #333333;
              line-height: 22px;
            }

            .glassDes {
              margin: 2px 0;
              height: 17px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #666666;
              line-height: 17px;
            }
          }
        }

        .cardStatus {
          height: 62px;
          padding-top: 24px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          box-sizing: border-box;

          .stateColor {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #c62127;

            &.on {
              background: #4689F5;
            }

            &.off {
              background: #AAAAAA;
            }
          }

        }

      }

      .cardFooter {
        display: flex;
        height: 58px;
        padding: 0 20px;
        align-items: center;
        justify-content: space-between;
        //border-top: 1px solid #EBEBEB;
        box-sizing: border-box;

        .userListBox {
          display: flex;
          align-items: center;

          .memo {
            margin-left: 6px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #444444;
          }
        }
      }

      &:hover {
        box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.08);
      }
    }
  }

  .paginationBox {
    height: 42px;
    width: 100%;
  }
}
</style>
