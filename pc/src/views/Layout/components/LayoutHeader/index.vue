<!--
 * @Author: cmk
 * @Date: 2021-04-15 18:30:38
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-28 09:21:11
 * @Des: 主页面 头部组件
-->
<template>
  <div class="header">
    <dropdown-menu
      :isHover.sync="isHover"
      :menuArr="moreOpeArr"
    ></dropdown-menu>
    <section class="header__bg" :style="getbg"></section>
    <section class="header__bgOpi"></section>
    <section class="header__animate">
      <i class="iconfont icon-dingbudonghuatuansan animate"></i>
      <i class="iconfont icon-dingbudonghuatuaner animate"></i>
      <i class="iconfont icon-dingbudonghuatuansan animate"></i>
      <i class="iconfont icon-dingbudonghuatuanyi animate"></i>
      <i class="iconfont icon-dingbudonghuatuaner animate"></i>
    </section>
    <section class="header__content">
      <header-menu
        v-show="[1, 3].includes($store.getters.getMenuType)"
      ></header-menu>
      <img
        :src="getUrl"
        alt="logo"
        class="m-l-20"
        :style="`height:${getWidth}px;cursor:pointer`"
        @click="$emit('refresh')"
      />
      <section class="header__content--tab">
        <nav class="nav header__content--self">
          <i class="iconfont icon-shujiantouzhankai m-l-10"></i>
          <div class="header__content--selfAvatar">
            <user-avatar
              :userItem="$store.state.userCenter.userInfo"
              :onlyAvatar="true"
            ></user-avatar>
          </div>
          <div
            class="header__content--selfName font__ellipsis"
            :title="
              $store.state.userCenter.userInfo
                ? $store.state.userCenter.userInfo.username
                : ''
            "
          >
            {{
              $store.state.userCenter.userInfo
                ? $store.state.userCenter.userInfo.username
                : ''
            }}
          </div>
          <img src="./images/profession.svg" alt="" />
          <user-info
            :userCenter.sync="userCenter"
            :userInfo="$store.state.userCenter.userInfo"
            :isShowUserInfo.sync="isShowUserInfo"
            v-show="isShowUserInfo"
            class="userInfo"
          ></user-info>
        </nav>
        <nav
          class="nav header__content--language"
          v-if="
            $store.state.globalConfig.themeConfig.enableMultilingualism === '1'
          "
        >
          <el-dropdown placement="bottom" @command="changeLang">
            <div class="header__content--langShow">
              <img :src="langData[curLangIndex].url" />
            </div>
            <el-dropdown-menu slot="dropdown" class="myLang">
              <el-dropdown-item
                v-for="(item, index) in langData"
                :key="item.val"
                :command="{ item, index }"
                ><img :src="item.url" alt="" class="myLang__img" />{{
                  item.name
                }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </nav>
        <el-tooltip
          :tabindex="-1"
          effect="dark"
          transition="topEnterBottomLeave"
          :content="isFullScreen ? '退出全屏' : '全屏'"
          placement="bottom"
          v-if="$store.state.globalConfig.themeConfig.enableFullScreen === '1'"
        >
          <nav class="nav iconNav" @click="zoomFun">
            <img
              class="iconNav__img"
              :src="getImg('enableFullScreenIcon')"
              alt=""
              v-if="getImg('enableFullScreenIcon')"
            />
            <i
              v-else
              class="iconfont"
              :class="`${
                isFullScreen ? 'icon-quxiaoquanping' : 'icon-quanping'
              }`"
            ></i>
          </nav>
        </el-tooltip>
        <nav
          class="nav iconNav"
          v-if="$store.state.globalConfig.themeConfig.enableHelpCenter === '1'"
        >
          <el-dropdown placement="bottom" @command="changeHelp" :tabindex="-1">
            <img
              class="iconNav__img"
              :src="getImg('enableHelpCenterIcon')"
              alt=""
              v-if="getImg('enableHelpCenterIcon')"
            />
            <i
              v-else
              class="iconfont icon-wentibangzhu header__content--help"
            ></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in filterHelp(helpCenter)"
                :key="item.command"
                :icon="`iconfont ${item.icon}`"
                :command="item.command"
              >
                {{ item.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </nav>
        <el-tooltip
          :tabindex="-1"
          effect="dark"
          content="审批"
          placement="bottom"
          transition="topEnterBottomLeave"
          v-if="
            $store.state.globalConfig.themeConfig.enableApprovalProcess === '1'
          "
        >
          <nav class="nav iconNav">
            <div
              v-if="getImg('enableApprovalProcessIcon')"
              :class="[{ showNum: taskNum > 0 }]"
              :num="taskNum > 99 ? '99+' : taskNum"
            >
              <img
                class="iconNav__img"
                :src="getImg('enableApprovalProcessIcon')"
                alt=""
              />
            </div>
            <i
              v-else
              class="iconfont icon-liuchengshenpi"
              @click="showTask = true"
              :class="[{ showNum: taskNum > 0 }]"
              :num="taskNum > 99 ? '99+' : taskNum"
            ></i>
          </nav>
        </el-tooltip>
        <el-tooltip
          :tabindex="-1"
          effect="dark"
          content="消息"
          placement="bottom"
          transition="topEnterBottomLeave"
          v-if="$store.state.globalConfig.themeConfig.enableMessage === '1'"
        >
          <nav class="nav iconNav">
            <div
              v-if="getImg('enableMessageIcon')"
              :class="[{ showNum: messageNum > 0 }]"
              :num="messageNum > 99 ? '99+' : messageNum"
            >
              <img
                class="iconNav__img"
                :src="getImg('enableMessageIcon')"
                alt=""
              />
            </div>
            <i
              v-else
              class="iconfont icon-xiaoxitongzhi"
              :class="[{ showNum: messageNum > 0 }]"
              @click="showMessageFun"
              :num="messageNum > 99 ? '99+' : messageNum"
            ></i>
          </nav>
        </el-tooltip>
        <nav class="line"></nav>
        <nav
          class="nav menuBtn"
          v-for="(item, index) in getTopMenu"
          :key="index"
          @click="navClick(item)"
        >
          {{ item.menuName }}
        </nav>
        <!--        v-if="moreOpeArr.length"-->
        <nav
          class="nav menuBtn"
          v-if="moreOpeArr.length"
          @mouseenter="mouseenter"
          @mouseleave="mouseLeave"
        >
          <i class="iconfont m-r-4 icon-gengduocaozuo"></i>
        </nav>
      </section>
    </section>
    <user-center
      v-if="$store.state.userCenter.userInfo"
      :userCenter.sync="userCenter"
      :centerVisible.sync="userCenter.visible"
      @getUserCenterInfo="getUserCenterInfo"
      :userInfo="$store.state.userCenter.userInfo"
    >
    </user-center>
    <switch-tenant
      v-if="$store.state.userCenter.userInfo"
      v-show="userCenter.visible && userCenter.showType === 'tenant'"
      :visible.sync="userCenter.visible"
      :userCenter.sync="userCenter"
      :userInfo="$store.state.userCenter.userInfo"
    ></switch-tenant>
    <task-to-do
      :showTabs.sync="showTask"
      v-model="activeName"
      :activeName="activeName"
      @tab-click="handleTabsClick"
    />
    <apiot-drawer
      :visible.sync="showMessage"
      destroy-on-close
      ref="apiotDrawer"
      :title="$t('messageShow.MessageNotification')"
      :hasFooter="false"
    >
      <message-show />
    </apiot-drawer>
  </div>
</template>

<script>
import cnImg from '@/assets/img/cn.png';
import enImg from '@/assets/img/en.png';
import { fontChange, debounce } from '@/utils/utils';
import UserCenter from '@/views/UserCenter/index';
import SwitchTenant from '@/views/UserCenter/components/SwitchTenant/index';
import UserInfo from '@/views/UserCenter/UserInfo/index';
import userAvatar from '@/views/orgManage/components/userAvatar/index';
import { getPersonalCenterUser } from '@/api/userCenter';
import { getMyTodoList } from '@/api/flow';
import { getMailCount } from '@/api/messageShow.js';
import TaskToDo from '@/views/TaskToDo/index';
import MessageShow from '@/views/MessageShow/index';
import HeaderMenu from '../HeaderMenu';
import DropdownMenu from './components/DropdownMenu';

export default {
  data() {
    return {
      activeName: 'LeaveItToMe',
      showTask: false,
      taskNum: 0, // 任务数量
      messageNum: 0, // 消息数量
      color: '#FA9D0B',
      logoHeight: 18,
      name: 'admin',
      timer: null,
      langData: [
        {
          name: '中文',
          val: 'zhCN',
          url: cnImg
        },
        {
          name: 'EN',
          val: 'enUS',
          url: enImg
        }
      ],
      helpCenter: [
        {
          title: '帮助文档',
          icon: 'icon-wenjian',
          command: 'HelpDoc'
        },
        {
          title: '视频教程',
          icon: 'icon-shipin',
          command: 'VideoTutorial'
        },
        {
          title: '常见问题',
          icon: 'icon-bangzhu',
          command: 'CommonProblem'
        },
        {
          title: '更新日志',
          icon: 'icon-gengxin',
          command: 'UpdateLog'
        }
      ],
      curLangIndex: 0, // 当前语言下标
      isFullScreen: false, // 是否全屏
      num: 5, // 消息条数
      btnMenuArr: [
        {
          menuName: '反馈中心'
        },
        {
          menuName: '机至数科'
        },
        {
          menuName: '数据看板'
        },
        {
          menuName: '菜单1',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单231232132',
          icon: {
            icon: 'icon_shuju',
            color: '#34C7BE'
          }
        },
        {
          menuName: '菜单2',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单3',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单4',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单5',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单6',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单7',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单8',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单9',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        },
        {
          menuName: '菜单10',
          icon: {
            icon: 'icon_gongdan',
            color: '#EE5E5E'
          }
        }
      ], // 按钮菜单数组
      userInfo: null,
      userCenter: {
        visible: false,
        showType: ''
      },
      isShowUserInfo: true,
      isHover: false,
      showMessage: false,
      timer2: null,
      timer1: null
    };
  },

  components: {
    HeaderMenu,
    UserInfo,
    UserCenter,
    DropdownMenu,
    SwitchTenant,
    userAvatar,
    TaskToDo,
    MessageShow
  },
  computed: {
    getbg() {
      const { themeStyle, themeColor } = this.$store.state.globalConfig.themeConfig;
      return `background: ${themeStyle === '1' ? '#29354D' : themeColor}`;
    },
    getWidth() {
      return this.$store.state.globalConfig.themeConfig.homePageLogoWidth || 18;
    },
    getUrl() {
      const url = this.$store.state.globalConfig.themeConfig.homePageLogo;
      const newUrl = url === '0' ? '' : url;
      return newUrl ? newUrl.substr(0, newUrl.length - 1) : this.$store.state.globalConfig.logoUrl;
    },
    getAbridegName() {
      return fontChange(this.name);
    },
    getTopMenu() {
      if (this.$store.state.globalConfig.themeConfig.enableLink === '1') {
        return this.$store.state.globalConfig.thirdLinks.slice(0, 3);
      }
      return [];
    },
    moreOpeArr() {
      if (this.$store.state.globalConfig.themeConfig.enableLink === '1') {
        if (this.$store.state.globalConfig.thirdLinks.length > 3) {
          return this.$store.state.globalConfig.thirdLinks.slice(3);
        }
      }
      return [];
    },
    getImg() {
      return (key) =>
        this.$store.state.globalConfig.themeConfig[key] &&
        this.$store.state.globalConfig.themeConfig[key].substr(
          0,
          this.$store.state.globalConfig.themeConfig[key].length - 1
        );
    }
  },
  watch: {
    '$store.state.globalConfig.themeConfig.enableApprovalProcess': {
      handler(v) {
        if (v === '1') {
          this.initTask();
          if (this.timer2) {
            clearInterval(this.timer2);
          }
          this.timer2 = setInterval(() => {
            this.initTask();
          }, 60 * 1000);
        }
      }
    },
    '$store.state.globalConfig.themeConfig.enableMessage': {
      handler(v) {
        if (v === '1') {
          this.initMessage();
          if (this.timer1) {
            clearInterval(this.timer);
          }
          this.timer1 = setInterval(() => {
            this.initMessage();
          }, 60 * 1000);
        }
      }
    }
  },
  mounted() {
    this.setCurLangIndex();
    // this.getUserCenterInfo();
    window.addEventListener('resize', debounce(this.pageResize));
    if (this.$store.state.globalConfig.themeConfig.enableMessage === '1') {
      this.initMessage();
    }
    this.initTask();
    if (this.timer2) {
      clearInterval(this.timer2);
    }
    this.timer2 = setInterval(() => {
      this.initTask();
    }, 60 * 1000);
  },

  methods: {
    filterHelp(arr) {
      const { helpCenterMenu } = this.$store.state.globalConfig.themeConfig;
      const a = helpCenterMenu ? helpCenterMenu.split(',') : [];
      return arr.filter((item, index) => {
        if (a.includes(`${index + 1}`)) {
          return true;
        }
        return false;
      });
    },
    async initTask() {
      const data = (await getMyTodoList({ current: 1, size: 1 })) || {};
      const { total = 0 } = data;
      this.taskNum = total;
    },
    async initMessage() {
      const param = {
        innerMailCategorys: ['WORK_FLOW', 'SYSTEM'],
        hasRead: false
      };
      const data = (await getMailCount(param)) || 0;
      this.messageNum = data;
    },
    handleTabsClick({ name }) {
      // 切换tab
      this.activeName = name;
    },
    async getUserCenterInfo() {
      const res = await getPersonalCenterUser();
      this.userInfo = res;
      this.$store.commit('setUserInfo', res);
    },
    // 设置当前语言
    setCurLangIndex() {
      this.curLangIndex = 0;
      if (localStorage.apiotLanguage) {
        const index = this.langData.findIndex((item) => item.val === localStorage.apiotLanguage);
        if (index !== -1) {
          this.curLangIndex = index;
        }
      }
    },
    // 更改语言
    changeLang({ item, index }) {
      this.curLangIndex = index;
      this.$i18n.locale = item.val;
      localStorage.apiotLanguage = item.val;
      this.$store.commit('changeLanguage');
    },
    // 点击帮助
    changeHelp(command) {
      // console.log(command);
      const routeUrl = this.$router.resolve({
        name: 'helpCenterShow',
        query: {
          id: command
        }
      });
      window.open(routeUrl.href, '_blank');
    },
    // 最大化、最小化
    zoomFun() {
      if (this.isFullScreen) {
        this.handleExitFullscreen();
      } else {
        this.handleFullScreen();
      }
    },
    // 全屏
    handleFullScreen() {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      }
      this.isFullScreen = true;
    },
    // 退出全屏
    handleExitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      this.isFullScreen = false;
    },
    // 退出全屏
    pageResize() {
      const isFull =
        window.fullScreen || document.webkitIsFullScreen || document.msFullscreenEnabled;
      if (isFull === undefined) {
        this.isFullScreen = false;
      }
    },

    mouseenter() {
      this.timer = setTimeout(() => {
        this.isHover = true;
      }, 200);
    },
    // 鼠标移出
    mouseLeave(e) {
      clearTimeout(this.timer);
      if (e.y < 50) {
        this.isHover = false;
      }
    },
    showMessageFun() {
      this.showMessage = true;
      console.log(this.showMessage);
    },
    navClick(item) {
      window.open(item.linkAdress);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', debounce(this.pageResize));
    if (this.timer1) clearInterval(this.timer1);
    if (this.timer2) clearInterval(this.timer2);
    if (this.timer) clearInterval(this.timer);
    this.timer1 = null;
    this.timer = null;
    this.timer2 = null;
  }
};
</script>

<style lang='scss' scoped>
$iconNavWidth: 44px;
.header {
  position: relative;
  z-index: 101;
  height: $layoutHeader;

  &__bg {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: #29354d;
    overflow: hidden;
  }

  .animate {
    overflow: hidden;
  }

  &__bgOpi {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0.2;
    background: #000;
    overflow: hidden;
  }

  &__animate {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: hidden;

    & > .iconfont {
      position: absolute;
      color: #fff;

      &:nth-child(1) {
        font-size: 68px;
        left: 56px;
        top: 7px;
        opacity: 0.1;
        animation: clockwise 10s linear infinite;
      }

      &:nth-child(2) {
        font-size: 118px;
        left: 122px;
        top: 10px;
        opacity: 0.05;
        animation: counterclockwise 10s linear infinite;
      }

      &:nth-child(3) {
        font-size: 88px;
        left: 306px;
        top: 0px;
        opacity: 0.1;
        animation: clockwise 10s linear infinite;
      }

      &:nth-child(4) {
        font-size: 66px;
        left: 397px;
        top: 4px;
        opacity: 0.4;
        animation: counterclockwise 10s linear infinite;
      }

      &:nth-child(5) {
        font-size: 40px;
        left: 456px;
        top: -10px;
        opacity: 0.25;
        animation: clockwise 10s linear infinite;
      }
    }
  }

  &__content {
    position: relative;
    z-index: 101;
    display: flex;
    align-items: center;
    color: #fff;

    &--tab {
      flex: 1;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      color: #fff;
      font-size: 13px;
      text-align: center;
      height: $layoutHeader;
      line-height: $layoutHeader;

      .nav {
        cursor: pointer;
        height: 100%;

        &:hover {
          background: rgba(255, 255, 255, 0.14);
        }
      }
    }

    &--self {
      width: 206px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-right: 14px;

      &:hover {
        .icon-shujiantouzhankai {
          transform: rotate(-180deg);
        }
      }

      .icon-shujiantouzhankai {
        transition: all 0.2s linear;
      }

      .userInfo {
        height: 0;
        transform: translateY(-10px);
        opacity: 0;
        transition: transform 0.3s, height 0.3s, opacity 0.3s;
        z-index: -11;
      }

      &:hover {
        background: $--color-primary;

        .userInfo {
          opacity: 1;
          transform: translateY(0px);
          height: 380px;
          z-index: 1001;
        }
      }
    }

    &--selfAvatar {
      width: $userImageHeader;
      height: $userImageHeader;
      line-height: $userImageHeader;
      background: #5a80ed;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 400;
      margin-left: 10px;

      ::v-deep {
        .avatar .userImage {
          width: $userImageHeader;
          height: $userImageHeader;
        }

        .avatar .imageName {
          width: $userImageHeader;
          height: $userImageHeader;
          line-height: $userImageHeader;
        }
      }
    }

    &--selfName {
      margin: 0 12px 0 10px;
      font-size: 13px;
      font-weight: 400;
      text-align: left;
      width: 42px;
    }

    &--language {
      width: 56px;
      text-align: center;
    }

    &--langShow {
      display: flex;
      align-items: center;
      justify-content: center;
      height: $layoutHeader;
      width: 56px;
      color: #fff;
      cursor: pointer;

      img {
        width: 20px;
      }
    }

    &--help {
      display: inline-block;
      width: $iconNavWidth;
      color: #fff;
    }

    .iconNav {
      width: $iconNavWidth;
      &__img {
        width: 22px;
        height: 22px;
        vertical-align: middle;
      }

      .iconfont {
        font-size: $iconFontSizeHeadr;
      }

      .icon-xiaoxitongzhi {
        position: relative;
      }
      .showNum {
        &:after {
          content: attr(num);
          position: absolute;
          // width: 24px;
          min-width: 10px;
          padding: 0 4px;
          height: 18px;
          line-height: 18px;
          border-radius: 10px;
          background-color: $--color-primary;
          font-weight: 600;
          color: #ffffff;
          font-size: 12px;
          margin-left: -6px;
          margin-top: 6px;
        }
      }
      .icon-liuchengshenpi {
        position: relative;
      }
    }

    .line {
      margin: 0 12px;
      width: 1px;
      height: 12px;
      background: rgba(255, 255, 255, 0.3);
    }

    .menuBtn {
      padding: 0 20px;
    }
  }
  ::v-deep {
    .el-drawer__body,
    .drawer__content {
      overflow: initial;
    }
    .el-drawer__close-btn {
      position: relative;
      z-index: 1;
    }
  }
}

.myLang {
  &__img {
    width: 24px;
    height: 24px;
    vertical-align: middle;
    position: relative;
    margin-right: 4px;
    top: -2px;
  }
}
</style>
