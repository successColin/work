<!--
 * @Descripttion: 全局参数
 * @Author: ytx
 * @Date: 2021-04-22 15:22:28
 * @LastEditors: ytx
 * @LastEditTime: 2021-04-29 19:55:39
-->
<template>
  <apiot-content class="globalConfig">
    <template v-slot:sidebar>
      <!-- 侧边栏 -->
      <aside
        v-for="(item, i) in showSidebarArr()"
        :key="i"
        :class="[{ linkActiveClass: $route.path.indexOf(item.url) !== -1 }]"
        @click="handleJumpPage(item.url)"
      >
        <div class="aside__left"></div>
        <div
          :class="['iconfont', item.icon]"
          :style="{ color: item.color }"
        ></div>
        <span class="font__ellipsis" :title="$t(item.name)">
          {{ $t(item.name) }}
        </span>
      </aside>
    </template>
    <template>
      <!-- 内容 -->
      <keep-alive>
        <router-view selectWidth="width: 200px" />
      </keep-alive>
    </template>
  </apiot-content>
</template>

<script>
export default {
  data() {
    return {
      sidebarArr: [
        {
          name: 'globalConfig.accountPasswordOptions',
          icon: 'icon-zhanghaomimaxiangguanxuanxiang',
          color: '#5A80ED',
          url: 'passwordConfig',
          type: 'platform'
        },
        {
          name: 'globalConfig.loginConfig',
          icon: 'icon-xitongdengluxiangguanxuanxiang',
          color: '#EE5E5E',
          url: 'loginConfig',
          type: 'platform'
        },
        {
          name: 'globalConfig.APPLoginConfig',
          icon: 'icon-yidongduandengluxiangguan',
          color: '#FC8256',
          url: 'appLoginConfig',
          type: 'platform'
        },
        {
          name: 'globalConfig.themeAndLogoOptions',
          icon: 'icon-zhutijiLOGOxiangguanxuanxiang',
          color: '#FAB71C',
          url: 'themeConfig',
          type: ''
        },
        {
          name: 'globalConfig.thirdLinks',
          icon: 'icon-dingbusanfanglianjie',
          color: '#34C7BE',
          url: 'thirdLinks',
          type: ''
        },
        {
          name: 'globalConfig.homeConfig',
          icon: 'icon-zhuyexiaoxixiangguanxiang',
          color: '#EE5E5E',
          url: 'homeConfig',
          type: ''
        },
        {
          name: 'globalConfig.reportConfig',
          icon: 'icon-baobiaoxiangguanxiang',
          color: '#FC8256',
          url: 'reportConfig',
          type: ''
        },
        {
          name: 'globalConfig.fileServerOptions',
          icon: 'icon-wenjianfuwuqixuanxiang',
          color: '#FC8256',
          url: 'fileserverConfig',
          type: ''
        }
        // {
        //   name: 'globalConfig.watermarkOptions',
        //   icon: 'icon-shuiyinxiangguanxuanxiang',
        //   color: '#34C7BE',
        //   url: 'watermarkConfig',
        //   type: ''
        // }
      ]
    };
  },
  computed: {
    showSidebarArr() {
      return function () {
        const { userInfo = {} } = this.$store.state.userCenter;
        const {
          tenantVO: { tenantCode }
        } = userInfo;
        const showType = tenantCode === 'platform' ? tenantCode : '';
        if (tenantCode === 'platform') {
          return this.sidebarArr;
        }
        const arr = this.sidebarArr.filter((item) => item.type === showType);
        return arr;
      };
    }
  },
  mounted() {
    // console.log(this.$route);
  },
  methods: {
    handleJumpPage(url) {
      this.$router.replace({ path: `/globalConfig/${url}` });
    }
  }
};
</script>
<style lang='scss' scoped>
$borderColor: 1px solid #e9e9e9;
.globalConfig {
  aside:first-child {
    margin-top: 10px;
  }
  aside {
    display: flex;
    justify-items: center;
    height: 42px;
    line-height: 42px;
    border-radius: 2px;
    padding: 0px 40px;
    font-size: 14px;
    color: #333333;
    position: relative;
    .iconfont {
      margin-right: 6px;
      font-size: 20px;
    }
  }
  aside:hover {
    background: $--hover-color;
    cursor: pointer;
  }
  .aside__left {
    position: absolute;
    left: 0;
    top: 0;
    width: 3px;
    height: 42px;
    border-radius: 2px 0px 0px 2px;
  }
  .linkActiveClass {
    background: $--hover-color;
    cursor: pointer;
    & > .aside__left {
      background: #4689f5;
    }
  }
}
</style>
