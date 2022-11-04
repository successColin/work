<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 基本信息页面
-->
<template>
  <view class="basic">
    <apiot-navbar
      v-if="!hasDing"
      :title="$t('message.announceList')"
    ></apiot-navbar>
    <view class="header" v-if="announceGroupList.length">
      <view class="group" v-for="item in announceGroupList"
        :class="{'current': currentGroup.id === item.id}"
        :key="item.id"
        @click="handleCommand(item)">{{item.name}}</view>
    </view>
    <view class="basic__content">
      <view class="messageListTemp" v-show="computedHeight > 0"
        :style="{ height: `${computedHeight}px` }">
        <u-list
          class="content"
          v-if="announceList.length > 0"
          @scrolltolower="getAnnounceList"
          ref="card"
          :height="computedHeight"
          :preLoadScreen="3"
          :pagingEnabled="true"
        >
          <u-list-item
            v-for="(item, index) in announceList"
            :key="item.id"
            :anchor="item.id"
            :class="[
              { 'animateListClick': focusIndex === index },
            ]"
          >
            <view
            class="content__item">
              <message-item :focusIndex.sync="focusIndex"
                :index="index" :message="item"></message-item>
            </view>
          </u-list-item>
        </u-list>
      </view>
    </view>

  </view>
</template>

<script>
import { getAnnounceList, getAnnounceGroup } from '@/api/menuConfig';
import MessageItem from '../components/MessageItem/index.vue';

export default {
  components: { MessageItem },

  props: {},

  data() {
    return {
      // currentTitle: '修改密码'
      // userInfo: {}
      fileList: [],
      uploading: false,
      announceList: [],
      focusIndex: null,
      announceGroupList: [],
      commandIndex: 0,
      command: 0,
      currentGroup: null,
      page: 1,
      size: 20,
      hasDing: false
    };
  },

  computed: {
    computedHeight() {
      const { windowHeight, navbarHeight } =
        this.$store.state.base.systemInfo;
      const height = windowHeight - navbarHeight - 50 - 44;
      return height;
    },
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    },
  },

  methods: {
    // 获取公告列表
    async getAnnounceGroupList() {
      try {
        const params = {
          userId: this.userInfo.id
        };
        const res = await getAnnounceGroup(params);
        this.announceGroupList = res;
        if (res.length) {
          if (!this.currentGroup) {
          // eslint-disable-next-line prefer-destructuring
            this.currentGroup = res[0];
          }
          this.getAnnounceList();
        }
      } catch (e) {
        console.error(e);
      }
    },
    // 获取公告列表
    async getAnnounceList() {
      try {
        const params = {
          status: 1,
          userId: this.userInfo.id,
          groupId: this.currentGroup.id
        };
        const res = await getAnnounceList(params);
        this.announceList = res;
      } catch (e) {
        console.error(e);
      }
    },
    goToPages(url) {
      uni.navigateTo({
        url
      });
    },
    handleCommand(item) {
      this.currentGroup = item;
      this.announceList = [];
      this.page = 1;
      this.getAnnounceList();
    },
  },

  onLoad() {
    // #ifdef MP-ALIPAY
    this.hasDing = true;
    // #endif
  },

  onShow() {
    this.getAnnounceGroupList();
  },

  onReady() {
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.$t('message.announceList')
    });
    // #endif
    // #ifdef MP
    // uni.setNavigationBarTitle({
    //   title: this.currentTitle
    // });
    // #endif
  }
};
</script>

<style lang='scss' scoped>
.basic {
  height: 100vh;
  background: #f6f6f8;
  .header{
    height: 88rpx;
    box-shadow: inset 0px -1px 0px 0px #E9E9E9;
    padding: 0 30rpx;
    background: #ffffff;
    overflow-x: auto;
    white-space: nowrap;
    .group{
      display: inline-block;
      height: 88rpx;
      padding: 0 15rpx;
      line-height: 88rpx;
      color: #333333;
      font-size: 28rpx;
    }
    .current{
      color: #F6483E;
      position: relative;
      &::before{
        content: '';
        width: 50%;
        height: 4rpx;
        background: #F6483E;
        position: absolute;
        left: 25%;
        bottom: 0;
      }
    }
    .command{
      height: 88rpx;
      line-height: 88rpx;
      color: #333333;
      font-size: 28rpx;
      .appIcon-xialasanjiao{
        color: #D9D9D9;
        font-size: 24rpx;
        margin-left: 14rpx;
        display: inline-block;
      }
    }
  }
  &__content{
    width: 100%;
    padding: 30rpx;
    box-sizing: border-box;
    &__image{
      height: 240rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff;
      position: relative;
      .xiugaitouxiang{
        width: 48rpx;
        height: 48rpx;
        background: #333333;
        border-radius: 50%;
        position: absolute;
        left: calc(50% + 10rpx);
        top: calc(50% + 10rpx);
        display: flex;
        align-items: center;
        justify-content: center;
        .appIcon-xiugaitouxiang{
          color: #ffffff;
          font-size: 28rpx;
        }
      }
      .upload{
        position: absolute;
        width: 100rpx;
        height: 100rpx;
        left: calc(50% - 50rpx);
        top: calc(50% - 50rpx);
        opacity: 0;
      }
    }
    &__list{
      &__item{
        padding: 0 30rpx;
        height: 108rpx;
        box-shadow: inset 0px -1px 0px 0px #E9E9E9;
        background: #FFFFFF;
        color: #666666;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 30rpx;
        .value{
          color: #333333;
          .appIcon{
            margin-left: 10rpx;
            color: #666666;
            display: inline-block;
          }
          .appIcon-bangdingdingding, .appIcon-bangdingweixin{
            margin-right: 10rpx;
            color: #BBC3CD;
          }
        }
      }
      &__item:nth-child(4){
        margin-bottom: 18rpx;
      }
    }
  }
}
</style>
