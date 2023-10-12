<template>
  <view>
    <view v-if="isCanUse">
      <view>
        <view class="header">
          <image src="../../static/images/WX.png"></image>
        </view>
        <view class="content">
          <view>{{ $t('page-showPowerRequest') }}</view
          ><!--中文:申请获取以下权限-->
          <text>{{ $t('page-showPowerGet') }}</text
          ><!--中文:获得你的公开信息(昵称，头像、地区等)-->
        </view>
        <button
          class="bottom"
          type="primary"
          open-type="getUserInfo"
          withCredentials="true"
          lang="zh_CN"
          @getuserinfo="wxGetUserInfo"
        >
          {{ $t('page-authorized')
          }}<!--授权登录-->
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
      isCanUse: uni.getStorageSync('isCanUse') || true, //默认为true
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
    wxGetUserInfo() {
      let _t = this;
      uni.getUserInfo({
        provider: 'weixin',
        success: function (infoRes) {
          let nickName = infoRes.userInfo.nickName; //昵称
          let avatarUrl = infoRes.userInfo.avatarUrl; //头像
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
.header {
  margin: 90rpx 0 90rpx 50rpx;
  border-bottom: 1px solid #ccc;
  text-align: center;
  width: 650rpx;
  height: 300rpx;
  line-height: 450rpx;
}

.header image {
  width: 200rpx;
  height: 200rpx;
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

.bottom {
  border-radius: 80rpx;
  margin: 70rpx 50rpx;
  font-size: 35rpx;
}
</style>
