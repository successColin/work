<template>
  <view class="user-info changePassword">
    <m-back-bar :backStyle="passwordValidity === '0' ? '' : 'backStyleNoBack'">
      <block slot="barTitle">{{ barTitle }}</block>
      <block slot="barRight">
        <m-button @elementClick="handleTopClick()">
          <block slot="buttonIcon" style="display: inline-block">
            <m-font-icon iconSize="40"></m-font-icon>
          </block>
        </m-button>
      </block>
    </m-back-bar>
    <view class="safe-view">
      <image :src="safeImage" mode="widthFix" class="safe-image"></image>
    </view>
    <view class="user-info-list">
      <!--密码强度-->
      <!-- <view class="user-info-item top">
        <label>{{ $t('lang-change-password-strength') }}</label>
        <view class="input-view">
          <view class="strength">
            <span :class="{ weak: Strength >= '1' }"></span>
            <span :class="{ intermediate: Strength >= '2' }"></span>
            <span :class="{ strong: Strength == '3' }"></span>
          </view>
          <p>{{ Strengthname }}</p>
        </view>
      </view> -->
      <view class="user-info-item top">
        <label>{{ $t('user-OldPassword') }}</label>
        <view class="input-view">
          <input
            autocomplete="off"
            :type="inputType_[0]"
            value="oldPassWord"
            v-model="oldPassWord"
            name="oldPassWord"
            class="changeInput"
            :placeholder="$t('lang-change-password-enter-old')"
            placeholder-class="placeholderClass"
          />
          <m-font-icon
            :icon="static_passwordIcon[0]"
            :iconSize="iconSize"
            @click="fontIconClick(0)"
            class="iconfontClass"
          ></m-font-icon>
        </view>
      </view>
      <view class="user-info-item top">
        <label>{{ $t('user-NewPassword') }}</label>
        <view class="input-view">
          <input
            autocomplete="off"
            :type="inputType_[1]"
            value="newPassWord"
            v-model="newPassWord"
            name="newPassWord"
            class="changeInput"
            :placeholder="PasswordLevelRule.placeholder"
            placeholder-class="placeholderClass"
          />
          <m-font-icon
            :icon="static_passwordIcon[1]"
            :iconSize="iconSize"
            class="iconfontClass"
            @click="fontIconClick(1)"
          ></m-font-icon>
        </view>
      </view>
      <view class="user-info-item top">
        <label>{{ $t('check-ConfirmNewPassword') }}</label>
        <view class="input-view">
          <input
            autocomplete="off"
            :type="inputType_[2]"
            value="checkPassWord"
            v-model="checkPassWord"
            name="checkPassWord"
            class="changeInput"
            :placeholder="PasswordLevelRule.placeholder"
            placeholder-class="placeholderClass"
          />
          <m-font-icon
            :icon="static_passwordIcon[2]"
            :iconSize="iconSize"
            @click="fontIconClick(2)"
            class="iconfontClass"
          ></m-font-icon>
        </view>
      </view>
    </view>
    <!-- 指纹识别功能 TODO -->
    <!-- <view class="fingercheck">
			<view class="user-info-item">
				<label>{{$t('lang-change-password-fingerprint')}}</label>
				<view class="input-view">
					
				</view>
				<view class="uni-list-cell uni-list-cell-pd">
					<switch checked />
				</view>
			</view>
		</view> -->
    <view class="save-item">
      <m-button
        :btnTilte="$t('basic-save')"
        @elementClick="changePassword()"
        btnClass="mainColor"
      ></m-button>
    </view>
    <!-- 图片上传-->
    <!-- <m-upload  
			
			@onUpImg="upBasicData" 
			@onImgDel="delImgInfo" 
			ref="uImage">
		</m-upload> -->
  </view>
</template>

<script>
import { mapState } from 'vuex';
import Vue from 'vue';
import mUpload from '@/components/plugin/uploadImgs/sunui-upimg-basic.vue';
import safeImage from '@/static/images/safe.png';
import mInputLable from '../../components/element/m-inputLable.vue';
import state from '@/store/state.js';
import EncryptionPSW from '@/static/js/encryptionPSW.js';
export default {
  components: {
    mUpload,
    mInputLable,
  },
  data() {
    return {
      barTitle: this.$t('lang-change-password-security-settings'), //中文：'安全设置'
      username: state.userName,
      userId: state.userId,
      oldPassWord: '',
      newPassWord: '',
      checkPassWord: '',
      iconSize: 48,
      Strength: 0, //密码强度
      Strengthname: this.$t('lang-change-password-low'), //密码强度  中文：'低'
      static_passwordIcon: [
        'iconmimaxianshi',
        'iconmimayincang',
        'iconmimayincang',
      ],
      inputType_: ['text', 'password', 'password'],
      safeImage: safeImage,
    };
  },
  computed: {
    ...mapState(['passwordStrength', 'passwordValidity', 'PasswordLevel']),
    ...mapState('home', {
      bottomList: 'bottomList',
    }),
    PasswordLevelRule() {
      const baseRules = {
        minLen: 8,
        rule: [
          '.*[0-9]{1,}.*',
          '.*[a-z]{1,}.*',
          '.*[A-Z]{1,}.*',
          '.*[~!@#%_*]{1,}.*',
        ],
      };
      const { PasswordLevel } = this;
      if (PasswordLevel === '3')
        baseRules.placeholder = `最小${baseRules.minLen}位:必须包含数字;大小字母;~!@#%_*`;
      else if (PasswordLevel === '2')
        baseRules.placeholder = `最小${baseRules.minLen}位:数字;大小字母;~!@#%_*任意2种`;
      else
        baseRules.placeholder = `最小${baseRules.minLen}位:数字;大小字母;~!@#%_*任意1种`;
      return baseRules;
    },
  },
  watch: {
    newPassWord(curVal, oldVal) {
      this.checkPassword(curVal);
    },
  },
  methods: {
    handleTopClick() {
      //处理顶部按钮的点击事件
      let url = '/pages/home/home?pageType=myself';
      uni.navigateTo({
        url: url,
      });
    },
    fontIconClick(n) {
      //点击icon
      if (this.static_passwordIcon[n] === 'iconmimayincang') {
        //password显示
        Vue.set(this.static_passwordIcon, n, 'iconmimaxianshi');
        Vue.set(this.inputType_, n, 'text');
      } else if (this.static_passwordIcon[n] === 'iconmimaxianshi') {
        //隐藏
        Vue.set(this.static_passwordIcon, n, 'iconmimayincang');
        Vue.set(this.inputType_, n, 'password');
      }
    },
    checkPassword(value) {
      const { PasswordLevelRule } = this;
      if (value.length < PasswordLevelRule.minLen) {
        this.Strength = 0;
        return false;
      }
      let modes = 0;
      PasswordLevelRule.rule.forEach((item) => {
        const patt = new RegExp(item, 'g');
        if (patt.test(value)) modes++;
      });
      if (modes < 2 && modes > 0) {
        this.Strength = 1;
        this.Strengthname = this.$t('lang-change-password-low'); //'低'
      } else if (modes > 3) {
        this.Strength = 3;
        this.Strengthname = this.$t('lang-change-password-high'); //'高'
      } else if (modes >= 2) {
        this.Strength = 2;
        this.Strengthname = this.$t('lang-change-password-medium'); //'中'
      }
    },
    changePassword() {
      console.log('changePassword');
      let _this = this;
      if (_this.oldPassWord == '') {
        uni.showToast({
          title: _this.$t('lang-change-password-old'), //中文：'原密码不能为空!',
          duration: 500,
          icon: 'none',
        });
        return false;
      }
      if (_this.newPassWord == '' || _this.checkPassWord == '') {
        uni.showToast({
          title: _this.$t('lang-change-password-new-none'), //中文：'新密码不能为空!',
          duration: 500,
          icon: 'none',
        });
        return false;
      }
      if (_this.newPassWord != _this.checkPassWord) {
        uni.showToast({
          title: _this.$t('lang-change-password-new'), //中文：'新密码不一致!',
          duration: 500,
          icon: 'none',
        });
        return false;
      }

      //密码强度判断，目前由后端进行强度验证，但客户体验不好，后续需要优化
      const { PasswordLevelRule, PasswordLevel, Strength } = this;
      if (PasswordLevel !== '0' && Strength < Number(PasswordLevel)) {
        this.Static_GlobalFucs.showToast({
          title: PasswordLevelRule.placeholder,
        });
        return false;
      }

      let param = {
        oldPassWord: this.oldPassWord,
        newPassWord: this.newPassWord,
        checkPassWord: this.checkPassWord,
      };
      param = EncryptionPSW(param);
      this.$http
        .post('user/updatePassWord', param)
        .then((res) => {
          if (res.data.success) {
            uni.showToast({
              title: _this.$t('pageTip-successfulPasswordModification'),
              duration: 1000,
              icon: 'none',
            });
            _this.$http
              .post('logout')
              .then((res) => {
                const result = res.data;
                if (result.success) {
                  let url = '/pages/login/login';
                  uni.redirectTo({
                    url: url,
                  });
                }
              })
              .catch((err) => {
                this.Static_GlobalFucs.showToast({ title: err });
              });
          }
        })
        .catch((err) => {
          this.Static_GlobalFucs.showToast({ title: err });
        });
    },
    checkfingerprint() {
      if (plus.fingerprint.isSupport()) {
        //判断是否支持指纹
        if (plus.fingerprint.isKeyguardSecure()) {
          //判断是否设置密码锁屏
          if (plus.fingerprint.isEnrolledFingerprints()) {
            //判断是否已经录入指纹
            this.fingerpring();
          } else {
            //没有录入指纹
            plus.nativeUI.toast(
              this.$t('lang-change-password-fingerprint-tip')
            ); // 中文：'此设备未录入指纹，请到设置中开启'
          }
        } else {
          //没有设置密码锁屏
          plus.nativeUI.toast(this.$t('lang-change-password-not-fingerprint')); // 中文：'此设备未设置密码锁屏，无法使用指纹识别'
        }
      } else {
        //不支持指纹
        plus.nativeUI.toast(
          this.$t('lang-change-password-device-not-fingerprint')
        ); // 中文：'此设备不支持指纹识别'
      }
    },
    fingerpring() {
      var waiting = null;
      plus.fingerprint.authenticate(
        function () {
          plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
          console.log('指纹识别成功');
        },
        function (e) {
          switch (e.code) {
            case e.AUTHENTICATE_MISMATCH:
              plus.nativeUI.toast(
                this.$t('lang-change-password-fingerprint-reset')
              ); // 中文：'指纹匹配失败，请重新输入'
              break;
            case e.AUTHENTICATE_OVERLIMIT:
              plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
              plus.nativeUI.alert(
                this.$t('lang-change-password-fingerprint-reset-num')
              ); // 中文：'指纹识别失败次数超出限制，请使用其它方式进行认证'
              break;
            default:
              plus.nativeUI.closeWaiting(); //兼容Android平台关闭等待框
              plus.nativeUI.alert(
                `${this.$t('lang-change-password-fingerprint-faile')}(${
                  e.code
                }),${this.$t('lang-change-password-fingerprint-again')}`
              ); // 中文：'指纹识别失败请重试');
              break;
          }
        }
      );
      // Android平台弹出等待提示框
      if ('Android' == plus.os.name) {
        plus.nativeUI.showWaiting(
          this.$t('lang-change-password-fingerprint-identify') + '...'
        ); // 中文：'指纹识别中.');
      }
    },
  },
  mounted() {
    // this.checkfingerprint();
  },
};
</script>
<style scoped lang='scss'>
.iconfontClass {
  color: #9f9f9f;
}
.placeholderClass {
  color: red;
}
.user-info-item:last-child {
  border-bottom: 1px solid #e6e6e6 !important;
}
</style>
