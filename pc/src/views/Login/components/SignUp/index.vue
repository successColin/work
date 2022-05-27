<!--
 * @Descripttion: 登录主页，下方注册和app下载
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:47:06
-->
<template>
  <div class="signUp">
    <!-- app 下载弹出框 -->
    <div class="signUp__download--app">
      <div></div>
      <el-popover
        placement="left"
        width="400"
        v-if="isScan"
        @show="handleIsShowFun"
      >
        <section class="signUp__content">
          <div class="signUp__content--title1">
            {{ $t('login.mobileAPPScanCodeDownload') }}
          </div>
          <div class="signUp__content--title2">
            {{ $t('login.intelligentOperationAndMaintenance') }}
          </div>
          <div class="signUp__content--title3">
            {{ $t('login.openV10BrandNewSmartFactory') }}
          </div>
          <div class="area">
            <div class="area__left">
              <apiot-button
                class="apiot__button apiot__primary"
                @click="handleButton('android')"
              >
                <i class="iconfont icon-anzhuo"></i>
                {{ $t('login.androidDownload') }}
              </apiot-button>
              <apiot-button
                class="apiot__button apiot__yellow ios"
                @click="handleButton('ios')"
              >
                <i class="iconfont icon-IOS"></i>
                {{ $t('login.downloadTheIPhone') }}
              </apiot-button>
            </div>
            <div class="area__right">
              <div v-if="!qrCodeUrl">
                <div>
                  <div class="area__right--title1">
                    <i
                      class="iconfont icon-shouzhizuobian"
                      style="color: #bbc3cd"
                    ></i>
                    {{ $t('login.clickTheLeftButton') }}
                  </div>
                  <div class="area__right--title2">
                    {{ $t('login.getTheQRCode') }}
                  </div>
                </div>
              </div>
              <div v-else>
                <img :src="qrCodeUrl" alt="" />
              </div>
            </div>
          </div>
        </section>
        <div slot="reference" class="signUp__downTitle fontHover">
          {{ $t('login.downloadAPP') }}
        </div>
      </el-popover>
    </div>
    <!-- 还没有账号？立即注册 -->
    <div class="signUp__jump">
      <span>{{ $t('login.noAccountYet') }}</span>
      <span class="signUp__jump--btn fontHover" @click="handleJump">
        {{ $t('login.signUpNow') }}
      </span>
    </div>
  </div>
</template>

<script>
import androidCode from '@/assets/img/androidCode.png';
import iosCode from '@/assets/img/iosCode.png';

export default {
  props: {
    isScan: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 二维码图片路径
      qrCodeUrl: ''
    };
  },
  methods: {
    handleIsShowFun() {
      this.qrCodeUrl = '';
    },
    handleJump() {
      this.$router.push('/register');
    },
    handleButton(type) {
      if (type === 'android') {
        // console.log('android');
        this.qrCodeUrl = androidCode;
      } else {
        // console.log('ios');
        this.qrCodeUrl = iosCode;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
.signUp {
  width: 100%;
  display: flex;
  justify-content: space-between;
  &__jump {
    margin-bottom: 30px;
  }
  &__jump--btn {
    // 立即注册按钮
    color: $--color-primary;
  }
  &__jump--btn:hover {
    color: $--hover-fontColor;
  }
  &__content {
    margin: 20px 30px 30px 20px;
    &--title1 {
      font-size: 32px;
      color: #333333;
    }
    &--title2 {
      margin-top: 6px;
      font-size: 13px;
      color: #808080;
    }
    &--title3 {
      margin-top: 8px;
      font-size: 18px;
      color: $--color-primary;
    }
    .area {
      display: flex;
      justify-content: space-between;
      &__left {
        flex: 1;
        i {
          font-size: 20px;
          margin-right: 5px;
        }
        ::v-deep {
          .el-button + .el-button {
            margin-left: 0px;
          }
          .el-button {
            border: 0;
          }
        }
        .apiot__button {
          width: 190px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 4px;
          font-size: 16px;
          color: #fcfcfc;
          margin-top: 46px;
        }
        .ios {
          margin-top: 27px;
        }
      }
      &__right {
        width: 115px;
        height: 115px;
        margin-top: 42px;
        background: #fafafa;
        border: 1px solid #e9e9e9;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        &--title1 {
          color: #333333;
        }
        &--title2 {
          color: #808080;
          text-align: center;
        }
        img {
          width: 110px;
          height: 110px;
        }
      }
    }
  }
  &__downTitle {
    font-size: 13px;
    text-decoration: none;
    color: $--color-primary;
  }
  &__downTitle:hover {
    cursor: pointer;
    color: $--hover-fontColor;
  }
  :focus {
    outline: 0;
  }
}
</style>
