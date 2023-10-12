<template>
  <div class="app-content">
    <!-- #ifdef APP-PLUS || MP -->
    <view class="app-statusBar">
      <view class="top_view"></view>
    </view>
    <!-- #endif -->
    <div class="content register animated fadeIn">
      <view class="register-header">
        <div class="registerheader-item">
          <span>{{ $t('lang-register') }}</span
          ><!--中文;快速注册-->
        </div>
        <div class="registerheader-text">
          {{ $t('lang-register-convenient-quick') }}
        </div>
        <!--中文：免验证，方便快捷-->
      </view>
      <div class="register-content">
        <view class="register-item">
          <!-- 中文：手机号 -->
          <m-input-lable
            class="register-item"
            :label="i18nMsg('user-PhoneNumber')"
            name="telephone"
            v-model="formData.telephone"
            labletPositon="top"
          >
          </m-input-lable>
        </view>
        <!-- 中文：姓名 -->
        <view class="register-item">
          <m-input-lable
            :label="$t('user-name')"
            name="name"
            v-model="formData.name"
            labletPositon="top"
            :iconSize="48"
          >
          </m-input-lable>
        </view>
      </div>
      <view class="register-foot">
        <!-- 中文：立即注册 -->
        <m-button
          ref="registerBtn"
          :btnTilte="$t('lang-register-now')"
          btnClass="mainColor"
          @elementClick="register"
        ></m-button>
      </view>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import mInputLable from '../../components/element/m-inputLable.vue';
import { homeApi } from '@/common/request/api.js';

export default {
  name: 'Login',
  components: { mInputLable },
  data() {
    return {
      formData: {},
      disabled: false,
      isLoading: false,
    };
  },
  methods: {
    ...mapMutations(['SET_LOGIN_STATE']),
    ...mapMutations('verificationRule', ['CLEAR_RULESTATE']), //清空验证规则
    //登录
    register() {
      const _t = this;

      //是否校验通过
      const checkRes = this.Static_GlobalFucs.checkForm({
        rule: [
          {
            name: 'telephone',
            checkType: 'notnull',
            checkRule: '',
            errorMsg: _t.$t('user-PhoneNumber') + _t.$t('check-notNull'),
          }, //中文："手机号不能为空"
          {
            name: 'name',
            checkType: 'notnull',
            checkRule: '',
            errorMsg: _t.$t('user-name') + _t.$t('check-notNull'),
          }, //中文："姓名不能为空"
        ],
        data: this.formData,
      });
      if (!checkRes.isCheck) {
        this.Static_GlobalFucs.showToast({ title: checkRes.errorMsg });
        return;
      }

      this.isLoading = true;
      this.disabled = true;
      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          let code = loginRes.code;
          uni.getUserInfo({
            provider: 'weixin',
            success: function (infoRes) {
              let submitdata = _t.formData;
              submitdata.code = code;
              homeApi.mPWeChatRegister(_t, submitdata).finally((value) => {
                _t.isLoading = false;
                _t.disabled = false;
              });
            },
            fail(res) {},
          });
        },
      });
    },
  },
};
</script>
<style>
@import url('../../static/css/register.css');
</style>
