/**
* @name: index
* @author: DELL
* @date: 2022/11/4 14:51
* @description：index
* @update: 2022/11/4 14:51
*/
<!-- 页面 -->
<template>
  <div class="page flex-col justify-center align-center">
    <div class="group1 flex-col"></div>
    <div class="main5 flex-col">
      <div class="bd1 flex-row justify-between">
        <div class="bd2 flex-col justify-start align-start">
          <div class="section1 flex-col"></div>
        </div>
        <div class="bd3 flex-col"></div>
        <div class="bd4 flex-col"></div>
        <div class="bd5 flex-col"></div>
        <div class="bd6 flex-col"></div>
        <div class="bd7 flex-col"></div>
        <div class="bd8 flex-col"></div>
      </div>
      <div class="bd9 flex-row">
        <div class="main6 flex-col align-start" :class="{'focus': focus1}">
          <div class="section2 flex-row justify-between">
            <div class="layer1 flex-col justify-center align-center">
              <img
                  class="icon1"
                  referrerpolicy="no-referrer"
                  :src="require('@/assets/account.svg')"
              />
            </div>
            <!--              <span class="word1">请输入账号</span>-->
            <global-input
                @focus="focus1=true"
                @blur="focus1=false"
                v-model="username"
                class="word1"
                placeholder="请输入账号"
            ></global-input>
          </div>
        </div>
      </div>
      <div class="bd10 flex-row justify-between">
        <!--          <img-->
        <!--              class="label1"-->
        <!--              referrerpolicy="no-referrer"-->
        <!--              src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngdf3cb7220b4f06814b5f8e00172d610e88d4ebd70daf034705c4f5d83561efa1"-->
        <!--          />-->
        <!--                    <span class="word2">记住密码</span>-->
        <el-checkbox v-model="rememberMe" class="label1">记住密码</el-checkbox>
      </div>
      <div class="bd11 flex-row">
        <div class="mod2 flex-col align-start" :class="{'focus': focus2}">
          <div class="section3 flex-row justify-between">
            <div class="outer1 flex-col justify-center align-center">
              <img
                  class="label2"
                  referrerpolicy="no-referrer"
                  :src="require('@/assets/pas.svg')"
              />
            </div>
            <global-input
                v-model="password"
                class="info1"
                placeholder="请输入密码"
                show-password
                @focus="focus2=true"
                @blur="focus2=false"
            ></global-input>
          </div>
        </div>
      </div>
      <div class="bd12 flex-row">
        <!--          <div-->
        <!--              class="outer2 flex-col justify-center align-center"-->
        <!--              @click="doLogin"-->
        <!--              :class="{'pn' : !(username&&password)}"-->
        <!--          >-->
        <!--            <span class="info2">登录</span>-->
        <!--          </div>-->
        <el-button :loading="loading" :disabled="!(username&&password)" @click="doLogin" class="outer2"
                   type="primary">登录
        </el-button>
      </div>
      <!--      <div class="bd13 flex-row">-->
      <!--        <div class="block1 flex-col"></div>-->
      <!--      </div>-->
      <span class="word3">登录</span>
      <span class="word4">Hi,欢迎登录数据分析可视化平台!</span>
    </div>

  </div>
</template>

<script>
import {userLogin} from '@/services/login';

export default {
  data() {
    return {
      username: '',
      rememberMe: false,
      password: '',
      loading: false,
      focus1: false,
      focus2: false
    };
  },

  components: {},

  computed: {},

  mounted() {
    localStorage.removeItem('token');
    const rememberMe = localStorage.getItem('cmVtZW1iZXJNZQ==');
    if (rememberMe && Boolean(window.atob(rememberMe))) {
      this.rememberMe = Boolean(window.atob(rememberMe));
      if (this.rememberMe) {
        this.doSet();
      } else {
        this.unset();
      }
    } else {
      this.unset();
    }
  },

  methods: {
    doSet() {
      const acount = localStorage.getItem('YQ==');
      this.username = window.atob(acount);
      const password = localStorage.getItem('cA==');
      this.password = window.atob(password);
    },
    unset() {
      localStorage.removeItem('cmVtZW1iZXJNZQ==');
      localStorage.removeItem('YQ==');
      localStorage.removeItem('cA==');
      this.username = '';
      this.rememberMe = false;
      this.password = '';
    },
    async doLogin() {
      const params = {
        username: this.username,
        rememberMe: this.rememberMe,
        password: this.password
      }
      this.loading = true;
      try {
        const res = await userLogin(params);
        localStorage.setItem('info', JSON.stringify(res));
        this.loading = false;
        if (this.rememberMe) {
          const toM = (str) => {
            return window.btoa(str);
          }
          localStorage.setItem('cmVtZW1iZXJNZQ==', toM(this.rememberMe));
          localStorage.setItem('YQ==', toM(this.username));
          localStorage.setItem('cA==', toM(this.password));
        } else {
          this.unset();
        }
        sessionStorage.removeItem('groupDataSelect');
        await window.vue.$router.push('/');
      } catch (e) {
        this.loading = false;
      }
    }
  },
  name: 'login'
};
</script>

<style lang='scss' scoped>
.pn {
  pointer-events: none;
}

.page {
  z-index: 1;
  position: relative;
  width: 100%;
  height: 100%;
  //background-color: rgba(1, 10, 43, 1);
  background: url("~@/assets/gig.png") no-repeat center;
  background-size: 100% 100%;
  overflow: hidden;
}

.group1 {
  z-index: 3;
  width: 1314px;
  height: 558px;
}

.group2 {
  z-index: 4;
  height: 800px;
  width: 1440px;
  padding-bottom: 107px;
  position: absolute;
  //left: 0;
  //top: 0;
}

.main1 {
  z-index: auto;
  width: 1440px;
  height: 405px;
}

.mod1 {
  z-index: 52;
  width: 8px;
  height: 8px;
  border: 1px solid rgba(97, 216, 255, 1);
  border-radius: 50%;
  align-self: flex-start;
  margin-left: 557px;
}

.pic1 {
  z-index: 5;
  width: 1440px;
  height: 148px;
  margin-top: 249px;
}

.main2 {
  z-index: 50;
  position: absolute;
  left: 561px;
  top: 296px;
  width: 9px;
  height: 68px;
  background-size: 10px 69px;
}

.main3 {
  z-index: 49;
  position: absolute;
  left: 870px;
  top: 311px;
  width: 9px;
  height: 68px;
  background-size: 10px 69px;
}

.main4 {
  z-index: 51;
  position: absolute;
  left: 874px;
  top: 378px;
  width: 8px;
  height: 8px;
  border: 1px solid rgba(97, 216, 255, 1);
  border-radius: 50%;
}

.main5 {
  z-index: 7;
  height: 300px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngd6d40a12ea11839823e41a590a1044b3e8e779a0983078d2df3c25210646f5cd) 100% no-repeat;
  background: url("~@/assets/loginbg.png") no-repeat center;
  width: 309px;
  position: absolute;
  //left: 565px;
  //top: 253px;
  background-size: 100% 100%;
  transform: scale(1.2);
}

.bd1 {
  z-index: auto;
  width: 150px;
  height: 69px;
  margin-left: 13px;
}

.bd2 {
  z-index: 40;
  height: 69px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng50def659b9fdca162458dc78b8a1d76b7024ee74cd03cbcaee8548eb902e3b4e) 100% no-repeat;
  width: 78px;
  padding: 7px 0 0 6px;
}

.section1 {
  z-index: 47;
  width: 10px;
  height: 10px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPngca1ed4b38a83a4c2b2f0db0e3c86f3146ca3624ccf40ee826d92a31fa29ddfdc) 100% no-repeat;
}

.bd3 {
  z-index: 41;
  width: 8px;
  height: 4px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng200fc0a341817c217529d476c6637f652a13f74c8b7f36cc556800f58fdbcce6) 100% no-repeat;
}

.bd4 {
  z-index: 42;
  width: 8px;
  height: 4px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng200fc0a341817c217529d476c6637f652a13f74c8b7f36cc556800f58fdbcce6) 100% no-repeat;
}

.bd5 {
  z-index: 43;
  width: 8px;
  height: 4px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng200fc0a341817c217529d476c6637f652a13f74c8b7f36cc556800f58fdbcce6) 100% no-repeat;
}

.bd6 {
  z-index: 44;
  width: 8px;
  height: 4px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng200fc0a341817c217529d476c6637f652a13f74c8b7f36cc556800f58fdbcce6) 100% no-repeat;
}

.bd7 {
  z-index: 45;
  width: 8px;
  height: 4px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng200fc0a341817c217529d476c6637f652a13f74c8b7f36cc556800f58fdbcce6) 100% no-repeat;
}

.bd8 {
  z-index: 46;
  width: 14px;
  height: 4px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng2a0344c3205e67a7dbb2b2038d560f23444cac16916c83d29fc71d89012bbb25) 100% no-repeat;
}

.bd9 {
  z-index: auto;
  width: 222px;
  height: 36px;
  margin: 31px 0 0 43px;
}

.main6 {
  z-index: 10;
  height: 36px;
  border-radius: 2px;
  border: 1px solid #61D8FF;
  width: 222px;
}

.section2 {
  z-index: auto;
  width: 100%;
  height: 36px;
  box-sizing: border-box;
}

.layer1 {
  z-index: 11;
  height: 36px;
  border-radius: 2px 0 0 2px;
  border-right: 1px solid #61D8FF;
  width: 38px;
}

.icon1 {
  z-index: 13;
  width: 18px;
  height: 20px;
}

.word1 {
  z-index: 12;
  width: 180px;
  height: 38px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 0.51);
  font-size: 13px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  //line-height: 20px;
  text-align: left;
  //margin-top: 8px;
  ::v-deep {
    .el-input__inner {
      height: 36px;
      line-height: 36px;
      border: none;
      background: none;
    }
  }
}

.bd10 {
  z-index: auto;
  width: 69px;
  height: 17px;
  margin: 56px 0 0 43px;
}

.label1 {
  z-index: 33;
  //width: 14px;
  //height: 14px;
  margin-top: 2px;

  ::v-deep {
    .el-checkbox__inner {
      border: 1px solid #61D8FF;
      background: none;
    }

    &.is-checked .el-checkbox__inner {
      border-color: #61D8FF;

      &::after {
        border-color: #61D8FF;
      }
    }

    .el-checkbox__label {
      padding-left: 5px;
      color: #FFFFFF;
    }

    &.is-checked > .el-checkbox__label {
      color: #61D8FF;
    }
  }
}

.word2 {
  z-index: 37;
  width: 48px;
  height: 17px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 17px;
  text-align: left;
}

.bd11 {
  z-index: auto;
  width: 222px;
  height: 36px;
  margin: -63px 0 0 44px;
}

.mod2 {
  z-index: 19;
  height: 36px;
  border-radius: 2px;
  border: 1px solid #61D8FF;
  width: 222px;
}

.section3 {
  z-index: auto;
  width: 100%;
  height: 36px;
}

.outer1 {
  z-index: 20;
  height: 36px;
  border-radius: 2px 0 0 2px;
  border-right: 1px solid #61D8FF;
  width: 38px;
}

.label2 {
  z-index: 22;
  width: 18px;
  height: 20px;
}

.info1 {
  z-index: 21;
  width: 180px;
  height: 36px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 0.51);
  font-size: 13px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 20px;
  text-align: left;

  ::v-deep {
    .el-input__inner {
      height: 36px;
      line-height: 36px;
      border: none;
      background: none;
    }

    .el-input__clear {
      color: #61D8FF;
    }

    .el-input__clear:hover {
      color: #61D8FF;
      opacity: 0.7;
    }
  }
}

.bd12 {
  z-index: auto;
  width: 222px;
  height: 36px;
  margin: 47px 0 0 44px;
}

.outer2 {
  z-index: 29;
  height: 36px;
  border-radius: 2px;
  background-size: 223px 36px;
  background: linear-gradient(360deg, rgba(70, 137, 245, 1) 0%, rgba(67, 219, 255, 1) 100%);
  cursor: pointer;
  width: 222px;
  outline: none;
  border: none;
}

.outer2:hover {
  background: linear-gradient(360deg, rgba(70, 137, 245, 0.7) 0%, rgba(67, 219, 255, 0.7) 100%);
}

.info2 {
  z-index: 30;
  width: 28px;
  height: 20px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 13px;
  font-family: PingFangSC-Medium;
  white-space: nowrap;
  line-height: 20px;
  text-align: center;
}

.bd13 {
  z-index: auto;
  width: 10px;
  height: 10px;
  margin: 20px 0 0 282px;
}

.block1 {
  z-index: 48;
  width: 10px;
  height: 10px;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng9635a9a203c0aee9634555fbb63b7efd8e7712407268f28fdfb32d8c50c1883e) 100% no-repeat;
}

.word3 {
  z-index: 38;
  position: absolute;
  left: 43px;
  top: 37px;
  width: 36px;
  height: 25px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(97, 216, 255, 1);
  font-size: 16px;
  font-family: PingFangSC-Medium;
  white-space: nowrap;
  line-height: 25px;
  text-align: left;
}

.word4 {
  z-index: 39;
  position: absolute;
  left: 43px;
  top: 68px;
  width: 189px;
  height: 12px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 14px;
  text-align: left;
}

.main7 {
  z-index: 53;
  position: absolute;
  left: 570px;
  top: 244px;
  width: 300px;
  height: 318px;
  background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng3c31f778d5d8887ba61fdd7152ac35058f07d657ece54c24187a40d10cf962e7) -1px -1px no-repeat;
  background-size: 301px 320px;
}

.focus {
  border-color: #00C0FF;

  .layer1, .outer1 {
    border-color: #00C0FF;
  }
}

.mod2:hover, .main6:hover {
  border-color: #00C0FF;
}
.mod2:hover .outer1, .main6:hover .layer1 {
  border-color: #00C0FF;
}

button {
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
  background-color: transparent;
}

button:active {
  opacity: 0.6;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.justify-start {
  display: flex;
  justify-content: flex-start;
}

.justify-center {
  display: flex;
  justify-content: center;
}

.justify-end {
  display: flex;
  justify-content: flex-end;
}

.justify-evenly {
  display: flex;
  justify-content: space-evenly;
}

.justify-around {
  display: flex;
  justify-content: space-around;
}

.justify-between {
  display: flex;
  justify-content: space-between;
}

.align-start {
  display: flex;
  align-items: flex-start;
}

.align-center {
  display: flex;
  align-items: center;
}

.align-end {
  display: flex;
  align-items: flex-end;
}

</style>
