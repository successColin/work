/**
* @name: userName
* @author: DELL
* @date: 2022/11/9 9:19
* @description：userName
* @update: 2022/11/9 9:19
*/
<!-- 页面 -->
<template>
  <el-popover
      placement="bottom"
      width="230"
      trigger="click"
      popper-class="userPopper"
  >
    <div class="boxWrap">
      <div class="mainInfo">
        <p class="name">{{ userInfo.nickname }}</p>
        <p class="tel"> {{ userInfo.telephone }}</p>
      </div>
      <div class="logout" @click="doLogout">退出登录</div>
    </div>
    <div class="box1 flex-row" slot="reference">
      <div class="section1 flex-col" :style="getBgColor"><span class="info1">{{ getPrefix }}</span></div>
      <span class="txt1">{{ userInfo.nickname }}</span>
    </div>
  </el-popover>

</template>

<script>
import cnchar from 'cnchar';
import 'cnchar-poly';
import { userLogout } from '@/services/login';

export default {
  data() {
    return {
      userInfo: {}
    };
  },

  components: {},

  computed: {
    getBgColor() {
      const colors = ['#FAB71C', '#FC8256', '#EE5E5E', '#5A80ED', '#34C7BE'];
      const {nickname = ''} = this.userInfo;
      const len = nickname ? nickname.length : 0;
      const i = len ? len % 5 : 0;
      return {
        backgroundColor: colors[i]
      };
    },
    getPrefix() {
      if (!this.userInfo.nickname) return '';
      const len = this.userInfo.nickname.length;
      return cnchar.spell(this.userInfo.nickname.substring(len - 2), 'first', 'up');
    }
  },

  mounted() {
    const info = localStorage.getItem('info');
    if (info) {
      this.userInfo = JSON.parse(info);
    }
  },

  methods: {
    async doLogout() {
      await userLogout({});
      localStorage.removeItem('token');
      await this.$router.push('/login');

    }
  },
  name: 'userName'
};
</script>

<style lang='scss' scoped>
.box1 {
  z-index: auto;
  width: 81px;
  height: 28px;
  margin-right: 20px;
  justify-content: space-between;
  cursor: pointer;
}

.section1 {
  z-index: 40;
  height: 28px;
  border-radius: 50%;
  //background: url(https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng9422a7774fcb927ae53342dc27b2ad5228e08cd526bbcd769edba1416c8ef667) 100% no-repeat;
  width: 28px;
  justify-content: center;
  align-items: center;
}

.info1 {
  z-index: 41;
  width: 13px;
  height: 13px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 12px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 13px;
  text-align: center;
}

.flex-col {
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.txt1 {
  z-index: 42;
  width: 42px;
  height: 18px;
  display: block;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  font-family: PingFangSC-Regular;
  white-space: nowrap;
  line-height: 18px;
  text-align: left;
  margin-top: 5px;
}

.boxWrap {
  width: 100%;

  .mainInfo {
    width: 100%;
    padding: 10px;

    .name {
      color: #FFFFFF;
      font-size: 16px;
      line-height: 28px;
    }

    .tel {
      color: #999999;
      font-size: 12px;
      line-height: 20px;
    }

  }
  .logout {
    height: 46px;
    text-align: center;
    color: #FFFFFF;
    line-height: 46px;
    border-top: 1px solid rgb(47, 67, 127);
    box-sizing: border-box;
    cursor: pointer;
    &:hover{
      opacity: 0.8;
    }
  }
}

</style>
