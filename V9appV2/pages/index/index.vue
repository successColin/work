<template>
  <view class="content"></view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { homeApi } from '@/common/request/api.js';
import {
  THEME_COLOR_TYPE,
  THEME_COLOR_VALUE,
} from '@/common/constant/themeColor.js';
import {
  APP_singleLogin,
  APP_StandardSingleLogin,
  APP_StandardSingleLoginIT,
  APP_ZwdingtalkLogin,
  APP_EnterpriseWechatLogin,
} from '@/common/request/uniqueApi/index.js';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(['platform', 'appKeyCode', 'token']),
  },
  onLoad() {
    if (!!this.token) this.$http.post('logout'); //退出
    this.init();
    // // #ifdef MP-WEIXIN
    // 	this.loadWX()//如果为微信登录
    // // #endif
    // // #ifdef APP-PLUS || H5
    // 	if(this.singleLogin) this.singleLoginO()
    // 	else this.loadExecution()
    // // #endif

    // #ifdef H5
    //判断是否单点登录，只有H5才需要进行单点登录
    this.$http
      .get(
        'variable/getValue',
        {
          variableName: 'useSso',
        },
        { errorNoRefresh: true, noToken: true }
      )
      .then((res) => {
        //错误401时不重新启动
        const result = res.data || {};
        uni.setStorageSync('signOn', result);
        let isSingleLogin = result.data || '0';
        if (isSingleLogin === '0') this.singleLoginO();
        //如果是2是阿斯利康的单点登录
        else if (isSingleLogin === '1') this.standardSingleLogin();
        //如果是1那么是标准的单点登录
        else if (isSingleLogin === '3') this.standardSingleLoginIT();
        //如果是4那么是专有钉钉
        else if (isSingleLogin === '4') this.zwdingtalkLogin();
        //如果是4那么是专有钉钉
        else if (isSingleLogin === '5') this.enterpriseWechatLogin();
        //如果是3那么是上海电气IT资产的单点登录
        else this.loadExecution(); //否则走正常的登录界面进行登录
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        this.loadExecution();
      });
    // #endif
    // #ifdef APP-PLUS
    //app正常登录即可
    this.loadExecution();
    // #endif
  },
  methods: {
    ...mapMutations([
      'SET_LOGIN_STATE',
      'UPDATE_THEME_COLOR',
      'SET_LOGIN_CONFIG',
      'SET_WATERMARK',
      'SET_SCANTYPE',
      'setGlobelParams',
      'SET_HOURFILLINGAUTOMATIC',
      'SET_QRTYPE',
    ]),
    ...mapMutations('Inspection', [
      'set_inspection_photoSourceType',
      'set_inspection_unlock',
      'set_inspection_unlock_by_code',
      'set_limit_skip_to_today',
      'set_inspection_device_complete',
    ]),
    init() {
      this.getThemeStyle();
      this.getSysParamer('PasswordLevel').then((res) => {
        // 设置密码等级
        this.setGlobelParams({ key: 'PasswordLevel', value: res.data || '3' });
      });
      this.getSysParamer('unDoInspectionDo').then((res) => {
        // 设置是否处理未完成点检任务
        this.setGlobelParams({
          key: 'unDoInspectionDo',
          value: res.data || '0',
        });
      });

      const readCardTypeVal = uni.getStorageSync('readCardTypeVal');
      if (!readCardTypeVal) {
        this.getSysParamer('readCardType').then((res) => {
          // 设置读卡类型：nfc或者rfid
          const readCardType = res.data || 'NFC';
          uni.setStorageSync('readCardTypeVal', readCardType);
          this.setGlobelParams({
            key: 'readCardType',
            value: readCardType.toUpperCase(),
          });
        });
      } else {
        this.setGlobelParams({
          key: 'readCardType',
          value: readCardTypeVal,
        });
      }

      this.getSysParamer('useLocalPhotoGallery').then((res) => {
        this.set_inspection_photoSourceType(res.data); //设置点巡检图片选取
      });
      this.getSysParamer('unlock').then((res) => {
        this.set_inspection_unlock(res.data); //点巡检使用的是否需要手动解锁
      });
      this.getSysParamer('enableInspectionUnlockByCode').then((res) => {
        this.set_inspection_unlock_by_code(res.data); //点巡检使用的是否需要设备解锁
      });
      this.getSysParamer('limitSkipToToday').then((res) => {
        console.log('====================>', res);
        this.set_limit_skip_to_today(res.data); //点巡检使用的是否需要设备解锁
      });
      this.getSysParamer('ScanningType').then((res) => {
        this.SET_SCANTYPE(res.data); //点检扫描成功后，查询设备信息，区分海立项目
      });
      this.getSysParamer('hourFillingAutomatic').then((res) => {
        this.SET_HOURFILLINGAUTOMATIC(res.data); // 自动填写巡检工时，1=⼿动；2=⾃动
      });
      this.getSysParamer('WaterMarkConfig').then((res) => {
        this.SET_WATERMARK(res.data); //全局水印
      });
      this.getSysParamer('constraintDeviceCompleteInspection').then((res) => {
        console.log(res);
        this.set_inspection_device_complete(res.data); //点巡检使用约束装置完整检查
      });
      this.getSysParamer('QRType').then((res) => {
        this.SET_QRTYPE(res.data); // h5扫一扫
      });
    },
    getSysParamer(params) {
      return homeApi.sysParamer(this, params);
    },
    loadWX: function () {
      //微信登录
      const _t = this;
      wx.getSetting({
        //判断之前是否已经授权
        success(res) {
          const authSettings = res.authSetting;
          if (!authSettings['scope.userInfo']) {
            //如果没有授权进入授权页面
            uni.reLaunch({
              url: '/pages/login/login',
            });
          } else {
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
                    homeApi.mpWXRegisterLogin(_t, {
                      code: code,
                      name: nickName,
                    });
                  },
                  fail(res) {},
                });
              },
            });
            console.log('您已经授权成功');
          }
        },
      });
    },
    // 是否需要强制修改密码
    async forceChangPassWord() {
      // 0或者空或者null  永久;30天;90天;180天;365天
      let value = '0';
      await this.getSysParamer('passwordValidity').then((res) => {
        // 设置密码到期时间
        value = res.data;
      });
      this.setGlobelParams({ key: 'passwordValidity', value });
    },
    async loadExecution() {
      try {
        await this.forceChangPassWord();
      } catch (e) {}

      /**
       * 获取本地存储中launchFlag的值
       * 若存在，说明不是首次启动，直接进入首页；
       * 若不存在，说明是首次启动，进入引导页；
       */
      try {
        const launchFlag = uni.getStorageSync('launchFlag');
        if (launchFlag) {
          if (launchFlag == true) {
            //如果已经启动，判断是否是否记住密码
            const loginMsg = uni.getStorageSync('loginMsg');
            uni.reLaunch({
              url: '/pages/login/login',
            });
          } else {
            uni.reLaunch({
              url: '/pages/index/guide',
            });
          }
        } else {
          uni.setStorage({
            key: 'launchFlag',
            data: true,
          });
          uni.reLaunch({
            url: '/pages/index/guide',
          });
        }
      } catch (e) {
        // error
        uni.setStorage({
          key: 'launchFlag',
          data: true,
          success: function () {
            console.log('error时存储launchFlag');
          },
        });
        uni.reLaunch({ url: '/pages/index/guide' });
      }
    },
    getThemeStyle: function () {
      this.$http
        .post(
          'pcHomePageConfig/selectline',
          {},
          {
            noToken: true,
          }
        )
        .then((res) => {
          const themeColor = res.data.data.appThemeColor;
          if (!!themeColor) {
            let param = {
              color: THEME_COLOR_TYPE[themeColor],
              colorCode: THEME_COLOR_VALUE[themeColor],
            };
            this.UPDATE_THEME_COLOR(param); //设置地址
            this.SET_LOGIN_CONFIG(res.data.data); //设置地址
          }
        })
        .catch((err) => {
          console.log(JSON.stringify(err));
        });
    },
    setUserInfo(info) {
      //如果是单点登录是设置用户信息
      const oldUserDesignerId = uni.getStorageSync('userDesignerId') || ''; //用户设计组
      if (oldUserDesignerId != info.userDesignerId) {
        //如果用户设计组不一样时，清空版本信息
        uni.setStorageSync('bundleVersion', {});
        uni.setStorageSync('userDesignerId', info.userDesignerId); //设置新的用户设计组
        uni.setStorageSync('language', info.currentLanguage); //当前语言
      }
      this.SET_LOGIN_STATE(info);
      uni.reLaunch({
        url: '/pages/home/home',
      });
    },
    standardSingleLoginIT() {
      //上海电气IT资产单点登录，获取cookie中的token值如何后去用户的code，再进行登录
      APP_StandardSingleLoginIT(
        {
          tag: this.platform,
          appKeyCode: this.appKeyCode,
          language: this._i18n.locale,
        },
        this
      )
        .then((result) => {
          this.setUserInfo(result);
        })
        .catch((err) => {
          err = err.msg || err;
          uni.showModal({
            title: this.$t('basic-modalTipError'),
            content: err,
            showCancel: false,
            confirmText: this.$t('basic-confirm'),
          });
        });
    },
    standardSingleLogin() {
      //标准单点登录，默认取链接上的uid，根据uid获取用户信息
      APP_StandardSingleLogin(
        {
          tag: this.platform,
          appKeyCode: this.appKeyCode,
          language: this._i18n.locale,
        },
        this
      )
        .then((result) => {
          this.setUserInfo(result);
        })
        .catch((err) => {
          err = err.msg || err;
          uni.showModal({
            title: this.$t('basic-modalTipError'),
            content: err,
            showCancel: false,
            confirmText: this.$t('basic-confirm'),
          });
        });
    },
    singleLoginO() {
      //单点登录
      APP_singleLogin({}, this)
        .then((result) => {
          this.setUserInfo(result);
        })
        .catch((err) => {
          if (err.type === 'noTurnUp') {
            uni.showModal({
              title: this.$t('basic-modalTipError'),
              content: err.msg,
              showCancel: false,
              confirmText: this.$t('basic-confirm'),
            });
          } else {
            this.loadExecution();
          }
        });
    },
    // 浙政钉单点登录
    zwdingtalkLogin() {
      // //单点登录
      APP_ZwdingtalkLogin({}, this)
        .then((result) => {
          if (JSON.stringify(result) !== '{}') {
            this.setUserInfo(result);
          } else {
            uni.reLaunch({
              url: '/pages/login/login',
            });
          }
        })
        .catch(async (code) => {
          uni.reLaunch({
            url: '/pages/associatedUser/index?code=' + code,
          });
        });
    },
    enterpriseWechatLogin() {
      console.log('企业微信');
      APP_EnterpriseWechatLogin({}, this).then((result) => {
        if (JSON.stringify(result) !== '{}') {
          this.setUserInfo(result);
        } else {
          return new Promise((resolve, reject) => {
            uni.showModal({
              title: '错误提示',
              content: '没有获取到用户信息，请登录！',
              showCancel: false,
              confirmText: '确定',
              success: function (res) {
                if (res.confirm) {
                  uni.reLaunch({ url: '/pages/login/login' });
                }
              },
            });
          });
        }
      });
    },
  },
};
</script>
