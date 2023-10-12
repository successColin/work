<template>
  <view>
    <view class="mask" catchtouchmove="true"></view>
    <view class="container-power">
      <view class="header"
        ><image src="../../static/images/WX.png"></image
      ></view>
      <view class="content">
        <view>{{ $t('page-showPowerRequest') }}</view
        ><!--中文:申请获取以下权限-->
        <text>{{ $t('page-showPowerGet') }}</text
        ><!--中文:获得你的公开信息(昵称，头像、地区等)-->
      </view>
      <view class="btns">
        <button class="bottom" @click="cancel">{{ $t('basic-cancel') }}</button
        ><!--中文:取消-->
        <button
          class="bottom right"
          type="primary"
          open-type="getUserInfo"
          withCredentials="true"
          lang="zh_CN"
          @getuserinfo="wxGetUserInfo"
        >
          {{ $t('basic-confirm')
          }}<!--中文:允许-->
        </button>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { homeApi } from '@/common/request/api.js';
export default {
  data() {
    return {
      SessionKey: '',
      OpenId: '',
      nickName: null,
      avatarUrl: null,
    };
  },
  methods: {
    ...mapMutations(['SET_LOGIN_STATE']),
    ...mapMutations('verificationRule', [
      'CLEAR_RULESTATE', //清空验证规则
    ]),
    ...mapMutations('common', [
      'CLEAR_PARAMETERS', //清空面板变量
    ]),
    cancel() {
      this.$emit('show');
    },
    wxGetUserInfo() {
      let _t = this;
      this.$emit('show');
      uni.getUserInfo({
        provider: 'weixin',
        success: function (infoRes) {
          let nickName = infoRes.userInfo.nickName; //昵称
          _t.avatarUrl = infoRes.userInfo.avatarUrl; //头像
          //已经授权直接获取用户信息
          uni.login({
            provider: 'weixin',
            success: function (loginRes) {
              let code = loginRes.code;
              uni.getUserInfo({
                provider: 'weixin',
                success: function (infoRes) {
                  let nickName = infoRes.userInfo.nickName; //昵称
                  let avatarUrl = infoRes.userInfo.avatarUrl; //头像
                  homeApi
                    .mpWXRegisterLogin(_t, {
                      code: code,
                      name: nickName,
                    })
                    .finally(() => {
                      _t.CLEAR_RULESTATE(); //清空state中的校验规则
                      _t.CLEAR_PARAMETERS(); //清空面板变量
                    });
                },
                fail(res) {},
              });
            },
          });
        },
        fail(res) {},
      });
    },
  },
  onLoad() {
    //默认加载
  },
};
</script>

<style>
.mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.container-power {
  padding: 5px;
  z-index: 1000;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
}
.header {
  border-bottom: 1px solid #ccc;
  text-align: center;
  width: 100%;
}
.header image {
  width: 100rpx;
  height: 100rpx;
}

.content {
  margin-left: 50rpx;
  margin-bottom: 90rpx;
}

.content text {
  display: block;
  color: #9d9d9d;
  margin-top: 40rpx;
}
.btns {
  display: flex;
}
.bottom {
  font-size: 35rpx;
  flex: 1;
}
.right {
  margin-left: 20rpx;
}
</style>
