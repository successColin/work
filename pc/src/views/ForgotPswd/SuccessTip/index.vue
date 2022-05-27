<!--
 * @Descripttion: 第四步：密码修改成功
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-22 17:21:50
-->
<template>
  <my-model :title="title" :timeLineList="timeLineList">
    <section class="verifyWay">
      <div class="verifyWay__info">
        {{ $t('login.congratulationsResetYourPasswordSuccessfully') }}
      </div>
      <div class="verifyWay__dec">
        {{ $t('login.informationProtectionInYourAubmissionIsAssured') }}
      </div>
      <div style="width: 400px; margin: 0 auto; padding-bottom: 30px">
        <!-- 图片 -->
        <img
          src="../../../assets/img/successTips.png"
          alt=""
          class="verifyWay__img"
        />
        <!--  -->
        <apiot-button class="verifyWay__btn" @click="handleJump" type="primary">
          {{ $t('login.backToLogin') }}
        </apiot-button>
      </div>
    </section>
  </my-model>
</template>

<script>
// 流程步骤模板
import MyModel from '@/views/Login/components/RegisterForgot/MyModel';

export default {
  data() {
    return {
      title: this.$t('login.resetPasswordResultPrompt'),
      timeLineList: [
        {
          steps: 1, // 步骤
          content: this.$t('login.waysOfIdentifying'),
          icon: 'icon-zuo',
          checked: true
        },
        {
          steps: 2, // 步骤
          content: this.$t('login.getVerification'),
          icon: 'el-icon-remove',
          checked: true
        },
        {
          steps: 3, // 步骤
          content: this.$t('login.resetPasswords'),
          icon: 'el-icon-remove',
          checked: true
        },
        {
          steps: 4, // 步骤
          content: this.$t('login.resetSuccess'),
          icon: 'el-icon-remove',
          checked: true
        }
      ]
    };
  },
  components: {
    MyModel
  },
  methods: {
    // 跳转到登录页面
    handleJump() {
      this.$router.push('/login');
    }
  }
};
</script>
<style lang='scss' scoped>
.verifyWay {
  text-align: center;
  &__info {
    font-size: 16px;
    color: #333333;
  }
  &__dec {
    margin-top: 8px;
    font-size: 12px;
    color: #808080;
  }
  &__img {
    display: block;
    width: 119px;
    height: 119px;
    margin: 65px auto;
  }
  &__btn {
    width: 140px;
    margin: 0 auto;
    height: $--button-height;
  }
}
</style>
