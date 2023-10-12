<!--
 * @Descripttion: 关联用户
 * @Author: ytx
 * @Date: 2022-06-25 10:12:28
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-25 10:12:28
-->
<template>
  <div class="associatedUser">
    <div class="associatedUser__box">
      <section>
        <div>
          <i class="iconfont icon-dingbusanfanglianjie" />
          请关联您的账号密码
        </div>
        <div>为了数据同步，扫码需关联工作账号和密码，下次登录无需再绑定！</div>
        <login-form
          class="associatedUser__form"
          :isAssociated="true"
          :configs="configs"
        ></login-form>
      </section>
      <footer>
        <apiot-button type="primary" class="button" @click="handleButton">
          确定关联
        </apiot-button>
      </footer>
    </div>
  </div>
</template>

<script>
import LoginForm from './components/LoginForm';

export default {
  data() {
    return {};
  },
  components: {
    LoginForm
  },
  computed: {
    configs() {
      const { loginConfig } = this.$store.state.base;
      return loginConfig;
    }
  },
  watch: {},
  mounted() {
    this.$store.dispatch('getLoginConfigFun');
  },
  methods: {
    handleButton() {
      this.$bus.$emit('handleAssociatedUser');
    }
  }
};
</script>
<style lang='scss' scoped>
.associatedUser {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  &__box {
    width: 500px;
    // height: 360px;
    background: #ffffff;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  &__form {
    width: 280px;
  }
  ::v-deep {
    .loginForm__empty {
      margin-top: 30px;
    }
  }
}
section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  div {
    display: flex;
    align-items: center;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  div:nth-child(1) {
    font-size: 18px;
    color: #333333;
  }
  div:nth-child(2) {
    font-size: 12px;
    margin-top: 9px;
    color: #808080;
  }
}
footer {
  width: 100%;
  height: 64px;
  border-top: 1px solid #ebebeb;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}
.button {
  margin-right: 30px;
}

.iconfont {
  font-size: 24px !important;
  color: #3889ff;
  margin-right: 6px;
}
</style>
