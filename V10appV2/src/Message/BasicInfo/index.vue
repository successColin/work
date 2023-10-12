<!--
 * @Author: tjf
 * @Date: 2022-04-01 15:38:42
 * @Last Modified by: sss
 * @Last Modified time: 2022-04-01 15:38:42
 * @Desc: 基本信息页面
-->
<template>
  <view class="basic" v-loading="uploading">
    <apiot-navbar
      :title="$t('mine.basicInfo')"
    ></apiot-navbar>
    <view class="basic__content">
      <view class="basic__content__image">
        <user-icon :userInfo="userInfo"></user-icon>
        <span class="xiugaitouxiang">
          <i class="appIcon appIcon-xiugaitouxiang"></i>
        </span>
        <view class="upload">
          <apiot-upload
            :fileList="fileList"
            :limit="1"
            @select="select"
          ></apiot-upload>
        </view>
      </view>
      <view class="basic__content__list">
        <view class="basic__content__list__item"
          @click="goToPages('/MinePages/ChangeUsername/index')">
          <view>{{$t('mine.name')}}</view>
          <view class="value">
            {{userInfo.username}}<i class="appIcon appIcon-a-shujuxuanzejinru"></i>
          </view>
        </view>
        <view class="basic__content__list__item"
          @click="goToPages('/MinePages/ChangeTelephone/index')">
          <view>{{$t('loginForgot.PHONE')}}</view>
          <view class="value">
            {{userInfo.telephone}}<i class="appIcon appIcon-a-shujuxuanzejinru"></i>
          </view>
        </view>
        <view class="basic__content__list__item"
          @click="goToPages('/MinePages/ChangeEmail/index')">
          <view>{{$t('loginForgot.EMAIL')}}</view>
          <view class="value">
            {{userInfo.email}}<i class="appIcon appIcon-a-shujuxuanzejinru"></i>
          </view>
        </view>
        <view class="basic__content__list__item"
          @click="goToPages('/MinePages/ChangeSign/index')">
          <view>{{$t('mine.autograph')}}</view>
          <view class="value">
            {{userInfo.signature}}<i class="appIcon appIcon-a-shujuxuanzejinru"></i>
          </view>
        </view>
        <view class="basic__content__list__item">
          <view>{{$t('mine.bindWeixin')}}</view>
          <view class="value">
            <i class="appIcon appIcon-bangdingweixin"></i>未绑定
            <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
          </view>
        </view>
        <view class="basic__content__list__item">
          <view>{{$t('mine.bindDingding')}}</view>
          <view class="value">
            <i class="appIcon appIcon-bangdingdingding"></i>未绑定
            <i class="appIcon appIcon-a-shujuxuanzejinru"></i>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';
import { getPersonalCenterUser } from '@/api/userCenter';
import { modifyAvatar } from '@/api/mine';

export default {
  components: { UserIcon },

  props: {},

  data() {
    return {
      // currentTitle: '修改密码'
      // userInfo: {}
      fileList: [],
      uploading: false
    };
  },

  computed: {
    userInfo() {
      return this.$store.state.userCenter.userInfo;
    }
  },

  methods: {
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
    },
    goToPages(url) {
      uni.navigateTo({
        url
      });
    },
    async select(pic) {
      // this.cutDown(pic.tempFiles[0]);
      const { tempFilePaths } = pic;
      console.log(pic);
      await this.upload(tempFilePaths[0]);
    },
    async upload(filePath) {
      try {
        uni.showLoading({
          title: '上传中'
        });
        await modifyAvatar(filePath);
        uni.hideLoading();
        this.getUserCenterInfo();
      } catch (error) {
        uni.hideLoading();
        console.log(error);
      }
    },
  },

  onLoad() {
    console.log(this.userInfo, '111111111111');
  },

  onShow() {
  },

  onReady() {
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
  &__content{
    width: 100%;
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
