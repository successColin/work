/**
* @name: varConfig
* @author: DELL
* @date: 2023/2/23 18:56
* @description：varConfig
* @update: 2023/2/23 18:56
*/
<!-- 页面 -->
<template>
  <div class="varConfig__main">
    <div class="varConfig__header">
      <div class="varConfig__header--item"
           v-for="item in headerConfig"
           :key="item.name"
           :class="{active: activeObj.name===item.name}"
           @click="clickTabs(item)"
      ><img :src="item.img" alt=""> <span>{{ item.name }}</span></div>
    </div>
    <div class="varConfig__tabs">
      <component
          :is="activeObj.comName"
          v-bind="$attrs"
          v-on="$listeners"
          :info="info"/>
    </div>
  </div>
</template>

<script>
import a from '@/assets/img/proxy/attestation.svg';
import b from '@/assets/img/proxy/requestheader.svg';
import c from '@/assets/img/proxy/requestmessage.svg';
import d from '@/assets/img/proxy/rs.svg';
import e from '@/assets/img/proxy/callrecord.svg';

const authTab = () => import('./authTab');
const resHeadTab = () => import('./resHeadTab');
const resMsgTab = () => import('./resMsgTab');
const respondTab = () => import('./respondTab');
const recordTab = () => import('./recordTab');

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeObj: {
        name: '认证',
        img: a,
        comName: 'authTab'
      },
      headerConfig: [
        {
          name: '认证',
          img: a,
          comName: 'authTab'
        },
        {
          name: '请求头',
          img: b,
          comName: 'resHeadTab'
        },
        {
          name: '请求报文',
          img: c,
          comName: 'resMsgTab'
        },
        {
          name: '响应处理',
          img: d,
          comName: 'respondTab'
        },
        {
          name: '调用记录',
          img: e,
          comName: 'recordTab'
        }
      ]
    };
  },

  components: {
    recordTab,
    respondTab,
    resMsgTab,
    resHeadTab,
    authTab
  },

  computed: {},

  mounted() {},
  watch: {
    info: {
      deep: true,
      immediate: true,
      handler(v, o) {
        if (v && o && v.commonApiHeader.id !== o.commonApiHeader.id) {
          this.activeObj = {
            name: '认证',
            img: a,
            comName: 'authTab'
          };
        }
      }
    }
  },
  methods: {
    clickTabs(item) {
      this.activeObj = item;
    }
  },
  name: 'varConfig',
};
</script>

<style lang='scss' scoped>
.varConfig__main {
  width: 100%;
  height: 100%;

  .varConfig__header {
    display: flex;
    height: 39px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #E9E9E9;
    //box-sizing: border-box;

    .varConfig__header--item {
      width: 140px;
      height: 39px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid #E9E9E9;
      box-sizing: border-box;

      & > span {
        margin-left: 8px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      &:hover {
        background: #F1F7FF;
        cursor: pointer;
      }

      &.active {
        background: #F1F7FF;
        transition: all 0.2s;
      }
    }
  }

  .varConfig__tabs {
    position: relative;
    width: 100%;
    margin-top: 10px;
    height: calc(100% - 50px);
  }
}
</style>
