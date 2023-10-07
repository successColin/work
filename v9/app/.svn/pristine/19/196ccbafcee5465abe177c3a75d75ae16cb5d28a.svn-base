<template>
  <view class="home">
    <workbench
      v-show="pageType == 'workbench'"
      ref="workbench"
      :barTitle="barTitle"
      :isVertical="isVertical"
      :isShowAnnouncement="isShowAnnouncement"
      :consultArr="consultArr"
      :consultLoading="consultLoading"
      :isShowConsulting="isShowConsulting"
      :consultingName="consultingName"
    ></workbench>
    <myself
      v-if="pageType == 'myself'"
      ref="myself"
      :barTitle="barTitle"
    ></myself>
    <filelist
      v-if="pageType == 'filelist'"
      ref="filelist"
      :barTitle="barTitle"
    ></filelist>
    <calendar
      v-if="pageType == 'calendar'"
      ref="calendar"
      :barTitle="barTitle"
    ></calendar>
    <news v-if="pageType == 'news'" ref="news" :barTitle="barTitle"></news>
    <!-- <view v-show>{{ $t('page-nodata>') }}</view> -->
    <!--中文：暂无内容-->

    <m-tabbar
      v-if="bottomList.length > 0"
      position="bottom"
      :barList="bottomList"
      @activityBar="barActivity"
    ></m-tabbar>
    <!-- #ifdef APP-PLUS -->
    <upload v-if="isGetVersion && !changePasswordTime"></upload>
    <!-- #endif -->
  </view>
</template>

<script>
import bus from '@/static/js/bus';
import { homeApi } from '@/common/request/api.js';
import { mapState, mapMutations } from 'vuex';
import news from '../basic/news.vue';
import workbench from '@/pages/basic/workbench.vue';
import myself from '@/pages/basic/myself.vue';
import filelist from '@/pages/basic/fileList.vue';
import calendar from '@/pages/basic/calendar.vue';
import mTabbar from '../../components/bar/m-tabbar.vue';
import { fileApi } from '@/common/request/api.js';
import messageMusic from '@/static/music/message.mp3';
// #ifdef APP-PLUS
import upload from '@/components/upload/upload.vue';
// #endif
export default {
  components: {
    mTabbar,
    workbench,
    myself,
    filelist,
    calendar,
    news,
    // #ifdef APP-PLUS
    upload,
    // #endif
  },
  data() {
    return {
      pageType: 'workbench',
      isGetVersion: false,
      barTitle: '',
      socketTask: null,
      isVertical: true,
      isShowAnnouncement: false,
      changePasswordTime: '', // 强制修改密码日期

      // 资讯分页
      pageSize: 10,
      pageNum: 1,
      // 资讯数据
      consultArr: [],
      // 资讯加载状态
			consultLoading:false,
			consultTotal:-1,// 资讯总条数

      isShowConsulting: false,
      consultingName: '',
    };
  },
  computed: {
    ...mapState([
      'userDesigner',
      'appVersion',
      'baseLatestVersion',
      'token',
      'appUploadUrl',
      'upgradeMode',
      'userId',
      'themeColor',
    ]),
    ...mapState('home', ['bottomList', 'enabledData']),
    ...mapState(['messageNum', 'baseUrl', 'defaultUrl']),
    isShowMessage() {
      return Boolean(this.enabledData.openMail);
    },
  },
  // 上拉加载
  onReachBottom() {
		const {consultTotal,consultArr} = this
		if(consultArr.length === consultTotal) return
    this.getMoreList();
  },
  methods: {
    ...mapMutations([
      'SHOW_UPLOAD',
      'SET_APPVERSION',
      'SET_VERSIONINFO',
      'STATE_INIT',
    ]),
    ...mapMutations('home', [
      'SET_NEW_BUNDLE',
      'SET_CALENDAR_BUNDLE',
      'CLEAR_STATE',
    ]),
    ...mapMutations('verificationRule', ['CLEAR_RULESTATE']), //清空验证规则
    ...mapMutations('common', ['CLEAR_PARAMETERS']), //清空面板变量
    ...mapMutations('Toast', [
      'TOAST_REQUESTURLS',
      'SET_TOAST_LOADING',
      'SET_TOAST_UPLOAD',
    ]),
    ...mapMutations(['UPDATE_MESSAGE_NUM']),
    barActivity(params) {
      const { activityBar = {}, oldActivityBar = {} } = params;

      let { bundleName: barTitle, url: pageType } = activityBar;
      //导航点击事件
      this.barTitle = barTitle;
      this.pageType = pageType;
    },
    // 获取更多数据
    getMoreList() {
      this.getConsultingList("loadNext");
    },
    // 获取资讯
    getConsultingList(type = "load") {
			let {pageNum,pageSize} = this
			if(type === 'reload'){
				pageSize = pageNum * pageSize
				pageNum = 1
			}else if(type === 'loadNext'){
				pageNum = pageNum + 1
				this.pageNum = pageNum
			}else{
				pageNum = 1
				this.pageNum = pageNum
			}
			console.log(pageNum)
			
			this.consultLoading = true
      this.$http
        .get(
          `information/listInformation?pageNum=${pageNum}&pageSize=${pageSize}`
        )
        .then((res) => {
					this.consultLoading = false
					uni.stopPullDownRefresh()//停止下拉刷新
          const data = res.data;
          if (data.success) {
						const {list,total} = data.data
            const dataList = list || [];
						if(type==="loadNext"){
							this.consultArr = this.consultArr.concat(dataList);
							
						}else{
							this.consultArr = [...dataList];
							this.consultTotal = total
						}
          }
        });
    },
    // 获取是否显示资讯
    isShowConsultingFun() {
      // 查询是否显示公告
      const appId = uni.getStorageSync('appId');
      this.$http.get(`bulletinconfig/get/${appId}/2`).then((res) => {
        const data = res.data;
        if (data.success) {
          console.log(data.data);
          this.isShowConsulting = data.data.enabled === 1 ? true : false; // 是否显示公告
          this.consultingName = data.data.name || '行业资讯'; // 公告轮播方向
        }
      });
    },
    //获取首页信息
    getHomeInfo() {
      homeApi.getHome(this).then((res) => {
        // 查询是否显示公告
        const appId = uni.getStorageSync('appId');
        this.isShowConsultingFun();
        this.$http.get(`bulletinconfig/get/${appId}/1`).then((res) => {
          const data = res.data;
          if (data.success) {
            console.log(data.data);
            this.isShowAnnouncement = data.data.enabled === 1 ? true : false; // 是否显示公告
            this.isVertical = data.data.basetype === 2 ? true : false; // 公告轮播方向
          }
        });
      });
      // homeApi.getCountBySql(this)
      homeApi.getSystemVersion(this).then((value) => {
        const versionInfo = value.list || [];
        this.isGetVersion = true;
        this.SET_VERSIONINFO(versionInfo);
      });
    },
    //app升级
    appUpdater() {
      const _this = this;
      plus.runtime.getProperty(plus.runtime.appid, function (widgetInfo) {
        _this.SET_APPVERSION({
          currentVersion: widgetInfo.version, //当前app版本号
          baseVersion: widgetInfo.versionCode, //当前基座版本号
        });
        if (widgetInfo.version !== _this.appVersion) {
          //pp版本号不一致
          _this.SHOW_UPLOAD(true);
        }
      });
    },
    //获取我的页面配置
    getMyselfInfo() {
      return new Promise((resolve) => {
        homeApi.getSelectInfo(this, resolve);
      });
    },
    getUserInfoImage() {
      fileApi
        .getRelationFile({
          relationId: this.userId,
          relationTableName: 'user',
          relationTypeId: 1,
        })
        .then((pics) => {
          let image;
          if (pics && pics.length > 0) {
            image = pics[0].url;
          } else {
            image = defalutImage;
          }
          this.SET_USER_IMAGE(image);
        });
    },

    // 消息推送
    running() {
      // 播放音乐
      const innerAudioContext = uni.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = messageMusic;
      innerAudioContext.onPlay();
    },
    // 获取推送条数
    getMessageNum() {
      let param = {
        userId: this.userId,
      };
      this.$http
        .post('messageHistory/getUnreadMessageNum', param)
        .then((res) => {
          if (res.data.success) {
            this.UPDATE_MESSAGE_NUM(res.data.data.num);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 进入这个页面的时候创建websocket连接【整个页面随时使用】
    websocketFun() {
      // 创建一个this.socketTask对象【发送、接收、关闭socket都由这个对象操作】
      // #ifdef H5
      var host = this.baseUrl || window.location.host + this.defaultUrl;
      // #endif
      // #ifndef H5
      var host = this.baseUrl || this.defaultUrl;
      // #endif
      var url = '';
      if (host.indexOf('http') > -1) {
        let arr = host.split('://');
        if (arr.includes('https')) {
          url += `wss://${arr[1]}socketServer/${this.userId}`;
        } else {
          url += `ws://${arr[1]}socketServer/${this.userId}`;
        }
      } else {
        // 少 wss 和 ws 判断
        url += `ws://${host}socketServer/${this.userId}`;
      }
      this.socketTask = uni.connectSocket({
        // 【非常重要】必须确保你的服务器是成功的,如果是手机测试千万别使用ws://127.0.0.1:9099【特别容易犯的错误】
        // url: `wss://${host}/socketServer/${userid}`,
        url: url,
        success(data) {
          console.log('连接成功');
        },
      });
    },
    connectSocketInit() {
      this.websocketFun();
      // 消息的发送和接收必须在正常连接打开中,才能发送或接收【否则会失败】
      this.socketTask.onOpen((res) => {
        console.log('WebSocket 打开中.....');
        // 注：只有连接正常打开中 ，才能正常收到消息
        this.socketTask.onMessage((res) => {
          // 获取数量
          this.getMessageNum();
        });
      });
      // 这里仅是事件监听【如果socket关闭了会执行】
      this.socketTask.onClose(() => {});
      // 错误信息
      this.socketTask.onError((err) => {
        setTimeout(() => {
          this.connectSocketInit();
        }, 5000);
      });
    },
    // 关闭websocket【离开这个页面的时候执行关闭】
    closeSocket() {
      this.socketTask.close({
        success(res) {
          console.log('关闭成功', res);
        },
      });
    },
  },
  mounted() {
    const { changePasswordTime } = this;
    if (changePasswordTime) {
      this.Static_GlobalFucs.showModal(this, {
        title: `密码将在${changePasswordTime}日到期，请及时修改密码`,
        complete: () => {
          this.changePasswordTime = '';
        },
      });
    }
  },
	beforeDestroy() {
	  bus.$off('ChangeInformation');
	},
  onReady(){
		this.getConsultingList();
	},
	onLoad(option) {
		
		bus.$on('ChangeInformation', (params) => {
			this.getConsultingList("reload");
		});
		
    if (option.changePasswordTime) {
      this.changePasswordTime = option.changePasswordTime;
    }

    // this.getConsultingList(); // 获取资讯
		this.CLEAR_STATE(); //清除stotre中state
    this.getHomeInfo(); //请求首页元素和版本
    this.CLEAR_RULESTATE(); //清空state中的校验规则
    this.CLEAR_PARAMETERS(); //清空面板变量
    this.TOAST_REQUESTURLS('clear'); //清空loading框中的url
    this.SET_TOAST_LOADING();
    this.SET_TOAST_UPLOAD();
    this.STATE_INIT(); //设置按钮栏显示
    this.getMyselfInfo().then(() => {
      //需要连接的服务器端的URL  注意： ws或者wss一定要有 两者就是http协议和https协议的区别
      this.isShowMessage && this.connectSocketInit();
    });
		
    // #ifdef APP-PLUS
    //如果是app时监测更新，upgradeMode为3是不跳提醒
    this.appUpdater();
    //如果是app，需要检测是否第一次登录
    //如果是第一次登录，需要记录下app的设备的标识，以便于后续消息推送时可以精确推送
    // plus.push.getClientInfoAsync(function(info){
    // 	console.log('Success');
    // 	console.log(JSON.stringify(info));
    // }, function(e){
    // 	console.log('Failed');
    // 	console.log(JSON.stringify(e));
    // })
    // #endif
  },
  onShow() {
    // 解决pc端与app之间的误差
    this.getMessageNum();
  },
  onBackPress() {
    if (this.pageType == 'filelist') {
      let filePath = uni.getStorageSync('filePath');
      if (filePath.length > 1) {
        let e = filePath[filePath.length - 2];
        this.$refs[this.pageType].goToStep(e, filePath.length - 2);
        return true;
      }
    }
  },
  onPageScroll(e) {
    if (this.pageType == 'workbench') {
      let scrollTop = (e.scrollTop / 50).toFixed(1);
      if (e.scrollTop > 0) {
        this.$refs[this.pageType].topshow = true;
      } else {
        this.$refs[this.pageType].topshow = false;
      }
      if (scrollTop > 1) {
        scrollTop = 1;
      } else if (scrollTop < 0.5 && scrollTop > 0) {
        scrollTop = 0.5;
      }
      this.$refs[this.pageType].topopacity = scrollTop;
    }
  },
  watch: {
    messageNum(now, old) {
      if (now !== 0 && old - now !== 1 && this.isShowMessage) {
        this.running();
      }
    },
  },
  destroyed() {
    this.isShowMessage && this.closeSocket();
  },
};
</script>

<style>
.home {
  width: 100%;
  height: 100%;
}
</style>
