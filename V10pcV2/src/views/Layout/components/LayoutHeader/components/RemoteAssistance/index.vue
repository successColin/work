/**
* @name: index
* @author: DELL
* @date: 2023/9/4 14:56
* @description：index
* @update: 2023/9/4 14:56
*/
<!-- 页面 -->
<template>
  <div class="answerBox">
    <transition name="el-zoom-in-top">
      <div class="box" v-if="visible">
        <div class="header">
          <UserAvatar :only-avatar="true" :userItem="inviter"/>
          <div class="userBox">
            <div :title="inviter.username">{{ inviter.username }}</div>
            <div>邀请您加入视频会议</div>
          </div>
          <div class="right m-l-26">
            <div>
              <div class="iconCommon b2" @click="doReject">

                <span class="icon-guaduan iconfont"></span>
              </div>
              <div class="text">挂断</div>
            </div>
            <div class="m-l-26" @click="doAnswer">
              <div class="iconCommon b3">
                <span class="icon-shipingjieting iconfont"></span>
              </div>
              <div class="text">接听</div>
            </div>
          </div>
        </div>
        <!-- <div class="main">
          <div class="m-l-6">
            <div>
              <div class="iconCommon b1">
                <span class="iconfont icon-yuyinjieting"></span>
              </div>
            </div>
            <div class="text">语音接听</div>
          </div>
          <div class="right">
            <div>
              <div class="iconCommon b2">
                <span class="icon-guaduan iconfont"></span>
              </div>
              <div class="text">挂断</div>
            </div>
            <div class="m-r-30">
              <div class="iconCommon b3">
                <span class="icon-shipingjieting iconfont"></span>
              </div>
              <div class="text">接听</div>
            </div>
          </div>
        </div> -->
      </div>
    </transition>
    <meeting-modal
        :roomID="roomID"
        :trtcCalling="trtcCalling"
        :visible.sync="meetingVisible"/>
  </div>
</template>

<script>
import bus from '@/utils/bus';
import UserAvatar from '@/globalComponents/ApiotDialog/ApiotUserDialog/components/UserAvatar';
import MeetingModal from '@/views/AudioManage/components/meetingDetails/index.vue';
import TRTC from 'trtc-js-sdk';
import TRTCCalling from 'trtc-calling-js';
import TIM from 'tim-js-sdk';
import COS from 'cos-js-sdk-v5';
// import { getUserSig, getUserInfoById, setConference, updateConference } from '@/api/expert';
import { getUserSig, getUserInfoById } from '@/api/expert';

export default {
  data() {
    return {
      roomID: null,
      trtcCalling: null,
      glassUserID: null,
      visible: false,
      meetingVisible: false,
      inviter: { username: '测试' }, // 邀请人信息
      inviterConfig: {}, // 邀请人房间号信息
      conferenceId: null, // 会议id
    };
  },

  components: {
    UserAvatar,
    MeetingModal
  },

  computed: {
    remoteConfig() {
      return this.$store.state.globalConfig.remoteConfig;
    },
  },

  mounted() {
    console.log(this.remoteConfig, 'remoteConfig');
      // v4.7.0 以下版本的 SDK
    TRTC.checkSystemRequirements().then((res) => {
      if (!res.result) {
        this.$message.warning('当前浏览器不支持使用远程协助，建议使用最新版本的 Chrome 浏览器，并且检测摄像头和麦克风是否可用。');
        return;
      }
      this.init();
      bus.$on('toggleCamera', this.toggleCamera);
      bus.$on('hangup', this.hangup);
      bus.$on('toggleMicMute', this.toggleMicMute);
      bus.$on('groupInvite', (message) => {
        this.groupInvite(message);
      });
      bus.$on('pcConference', (message) => {
        console.log(message, 'message');
       this.doPCConference(message);
      });
      bus.$on('pcJoinRoom', (message) => {
        this.doJoinRoom(message);
      });
      bus.$on('sendMessage', (value) => {
        this.sendMessage(value);
      });
    });
  },

  methods: {
    async sendMessage(value) {
      const { glasses, url } = value;
      function dataURLtoFile(dataurl, filename, type) { // 将base64转换为文件
        const arr = dataurl.split(',');
        // const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        // eslint-disable-next-line no-const-assign, no-plusplus
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type });
      }
      console.log(value, this.trtcCalling);
      const message = this.trtcCalling.tim.createImageMessage({
        to: `${glasses.id}`,
        conversationType: TIM.TYPES.CONV_C2C,
        // 消息优先级，用于群聊（v2.4.2起支持）。
        // 如果某个群的消息超过了频率限制，后台会优先下发高优先级的消息，详细请参考：https://cloud.tencent.com/document/product/269/3663#.E6.B6.88.E6.81.AF.E4.BC.98.E5.85.88.E7.BA.A7.E4.B8.8E.E9.A2.91.E7.8E.87.E6.8E.A7.E5.88.B6)
        // 支持的枚举值：TIM.TYPES.MSG_PRIORITY_HIGH, TIM.TYPES.MSG_PRIORITY_NORMAL（默认）
        // TIM.TYPES.MSG_PRIORITY_LOW, TIM.TYPES.MSG_PRIORITY_LOWEST
        // priority: TIM.TYPES.MSG_PRIORITY_NORMAL,
        payload: {
          file: dataURLtoFile(url, 'text.jpg', 'image/jpg'),
        },
        onProgress: (event) => {
          console.log('file uploading:', event);
        },
      });
      // 2. 发送消息
      const promise = this.trtcCalling.tim.sendMessage(message);
      promise.then((imResponse) => {
        // 发送成功
        console.log(imResponse);
        this.$message.success('发送成功');
        // this.clearCapture();
      }).catch((imError) => {
        // 发送失败
        this.$message.error('发送失败');
        // this.clearCapture();
        console.warn('sendMessage error:', imError);
      });
    },
    async doJoinRoom({ roomID }) {
      console.log(roomID, '加入房间');
      this.roomID = +roomID;
      this.meetingVisible = true;
      // eslint-disable-next-line no-unused-expressions
      this.trtcCalling?._trtcClient?._client?.join({ roomId: +roomID });
    },
    async doPCConference({ onLineUserId }) {
      const promise = this.trtcCalling.call({ userID: `${onLineUserId}`, type: 2, timeout: 30 });
      promise.then((e) => {
        const { roomID } = e;
        this.roomID = +roomID;
        this.meetingVisible = true;
        console.log(e, '发起成功!');
        const { userInfo } = this.$store.state.userCenter;
        setTimeout(() => {
          this.trtcCalling.startLocalView({ userID: `${userInfo.id}`, videoViewDomID: 'local_stream' });
        }, 500);
        // success
      }).catch((error) => {
        console.warn('call error:', error);
      });
    },
    async groupInvite(userIDList) { // 群邀请
      const promise = this.trtcCalling.groupCall({ userIDList, type: 2 });
      promise.then(() => {
        // success
      }).catch((error) => {
        console.warn('groupCall error:', error);
      });
    },
    async hangup() { //  挂断
      console.log(this.roomID, 'this.roomID');
      if (this.trtcCalling && this.roomID) {
        // eslint-disable-next-line no-unused-expressions
        this.trtcCalling.hangup();
        // console.log(this.trtcCalling?._trtcClient?.leave());
        // console.log(this.trtcCalling?._trtcClient?._client?.leave());
        // eslint-disable-next-line no-unused-expressions
        this.trtcCalling?._trtcClient?._client?.leave();
        // await updateConference({ roomId: this.roomID });
        // this.trtcCalling.logout();
        // this.offEvent();
        // this.init();
      }
        this.meetingVisible = false;
        this.initUserList();
        this.inviterConfig = {};
        this.inviter = {};
        this.meetingVisible = false;
        this.roomID = null;
        this.glassUserID = null;
        this.conferenceId = null; // 会议id
    },
    toggleCamera() {
      if (!this.getCameras) return;
      const { userInfo } = this.$store.state.userCenter;
      const { userList } = this.$store.state.remoteManage;
      const targetObj = userList.find((item) => item.id === userInfo.id);
      if (!targetObj) return;
      const { isVideoAvailable, id } = targetObj;
      if (isVideoAvailable && this.trtcCalling) {
        this.trtcCalling.closeCamera();
      } else if (!isVideoAvailable && this.trtcCalling) {
        this.trtcCalling.openCamera();
      }
      this.$store.commit('updateUserInfo', { id, isVideoAvailable: !isVideoAvailable });
    },
    toggleMicMute() {
      if (!this.getMicrophones) return;
      const { userInfo } = this.$store.state.userCenter;
      const { userList } = this.$store.state.remoteManage;
      const targetObj = userList.find((item) => item.id === userInfo.id);
      if (!targetObj) return;
      const { isAudioAvailable, id } = targetObj;
      this.trtcCalling.setMicMute(isAudioAvailable);
      this.$store.commit('updateUserInfo', { id, isAudioAvailable: !isAudioAvailable });
    },
    async init() {
      const { userInfo } = this.$store.state.userCenter;
      const { id } = userInfo;
      try {
          /* global Base64 */
          const res = await getUserSig({ userId: Base64.encode(`${id}`) });
          this.trtcCalling = new TRTCCalling({ SDKAppID: +res.sdkAppId });
          this.trtcCalling.tim.registerPlugin({ 'cos-js-sdk': COS });
          this.trtcCalling.login({ userID: `${id}`, userSig: res.userSig });
          this.addEvent();
          this.initUserList();
          this.internalNetworkConfig();
          // this.$store.commit('setRemoteClient', trtcCalling);
          // console.log(this.$store, this.$store.remoteManage.remoteClient, 'zzz');
      } catch (e) {
        console.log(e);
      }
    },
    internalNetworkConfig() {
      // eslint-disable-next-line max-len
      const { enableIntranet, websocketProxy, loggerProxy, turnServerUrl, turnUsername, turnCredential } = this.remoteConfig;
      if (enableIntranet === '1' && websocketProxy && turnServerUrl && turnUsername && turnCredential) {
        // eslint-disable-next-line no-unused-expressions
        this.trtcCalling?._trtcClient?._client.setProxyServer({
          websocketProxy,
          loggerProxy,

        });
        console.log(this.trtcCalling?._trtcClient?._client);
        // eslint-disable-next-line no-unused-expressions
        this.trtcCalling?._trtcClient?._client.setTurnServer([{
          url: turnServerUrl,
          username: turnUsername,
          credential: turnCredential,
          credentialType: 'password'
        }]);
      }
    },
    async initUserList() {
      const { userInfo } = this.$store.state.userCenter;
      const isVideoAvailable = await this.getCameras();
      const isAudioAvailable = await this.getMicrophones();
      this.$store.commit('setUserList', [{ ...userInfo, isVideoAvailable, isAudioAvailable }]);
    },
    async getCameras() {
      try {
        const list = await TRTC.getCameras();
        return !!list.length;
      } catch (e) {
        return false;
      }
    },
    async getMicrophones() {
      try {
        const list = await TRTC.getMicrophones();
        return !!list.length;
      } catch (e) {
        return false;
      }
    },
         // 视频中所有的事件监听
    offEvent() {
      this.trtcCalling.off( // 监听邀请
        TRTCCalling.EVENT.INVITED,
        this.handleNewInvitationReceived,
      );
      this.trtcCalling.off( // 监听人员进房间
        TRTCCalling.EVENT.USER_ENTER,
        this.handleUserEnter,
      );
      this.trtcCalling.off( // 监听人员离开房间
        TRTCCalling.EVENT.USER_LEAVE,
        this.handleUserLeave,
      );
      this.trtcCalling.off( // 结束通话
        TRTCCalling.EVENT.CALLING_END,
        this.handleCallEnd,
      );
      this.trtcCalling.off( // 拒绝邀请通话
        TRTCCalling.EVENT.REJECT,
        this.handleInviteeReject,
      );
      this.trtcCalling.off( // 邀请用户无应答
        TRTCCalling.EVENT.NO_RESP,
        this.handleNoResponse,
      );
      this.trtcCalling.off( // 被邀用户正在通话中，忙线
        TRTCCalling.EVENT.LINE_BUSY,
        this.handleInviteeLineBusy,
      );
      this.trtcCalling.off( // 取消通话
        TRTCCalling.EVENT.CALLING_CANCEL,
        this.handleInviterCancel,
      );
      this.trtcCalling.off( // 邀请超时
        TRTCCalling.EVENT.CALLING_TIMEOUT,
        this.handleCallTimeout,
      );
      this.trtcCalling.off( // 远端用户打开关闭摄像头。
        TRTCCalling.EVENT.USER_VIDEO_AVAILABLE,
        this.handleUserVideoChange,
      );
      this.trtcCalling.off( // 远端用户开启/关闭了麦克风。
        TRTCCalling.EVENT.USER_AUDIO_AVAILABLE,
        this.handleUserAudioChange,
      );
      this.trtcCalling.off( // 远端用户开启/关闭了麦克风。
        TRTCCalling.EVENT.KICKED_OUT,
         this.handleOnKickedOut
      );
    },
     // 视频中所有的事件监听
    addEvent() {
      this.trtcCalling.on( // 监听邀请
        TRTCCalling.EVENT.INVITED,
        this.handleNewInvitationReceived,
      );
      this.trtcCalling.on( // 监听人员进房间
        TRTCCalling.EVENT.USER_ENTER,
        this.handleUserEnter,
      );
      this.trtcCalling.on( // 监听人员离开房间
        TRTCCalling.EVENT.USER_LEAVE,
        this.handleUserLeave,
      );
      this.trtcCalling.on( // 结束通话
        TRTCCalling.EVENT.CALLING_END,
        this.handleCallEnd,
      );
      this.trtcCalling.on( // 拒绝邀请通话
        TRTCCalling.EVENT.REJECT,
        this.handleInviteeReject,
      );
      this.trtcCalling.on( // 邀请用户无应答
        TRTCCalling.EVENT.NO_RESP,
        this.handleNoResponse,
      );
      this.trtcCalling.on( // 被邀用户正在通话中，忙线
        TRTCCalling.EVENT.LINE_BUSY,
        this.handleInviteeLineBusy,
      );
      this.trtcCalling.on( // 取消通话
        TRTCCalling.EVENT.CALLING_CANCEL,
        this.handleInviterCancel,
      );
      this.trtcCalling.on( // 邀请超时
        TRTCCalling.EVENT.CALLING_TIMEOUT,
        this.handleCallTimeout,
      );
      this.trtcCalling.on( // 远端用户打开关闭摄像头。
        TRTCCalling.EVENT.USER_VIDEO_AVAILABLE,
        this.handleUserVideoChange,
      );
      this.trtcCalling.on( // 远端用户开启/关闭了麦克风。
        TRTCCalling.EVENT.USER_AUDIO_AVAILABLE,
        this.handleUserAudioChange,
      );
      this.trtcCalling.on( // 重复登陆，收到该回调说明被踢出房间
        TRTCCalling.EVENT.KICKED_OUT,
         this.handleOnKickedOut
      );
    },
    async handleOnKickedOut(event) { // 重复登陆，收到该回调说明被踢出房间
      console.log(event, '重复登陆，收到该回调说明被踢出房间');
    },
    async handleNewInvitationReceived(event) { // 被邀请
      const { sponsor, inviteData: { roomID } } = event;
      if (!roomID) return;
      console.log('被邀请', event);
      const info = await getUserInfoById({ id: sponsor });
      this.inviterConfig = event;
      this.inviter = info;
      this.visible = true;
    },
    async handleUserEnter(params) { // 用户进入房间号
      console.log('用户进入房间号', params);
      const { userID } = params;
      const { userInfo } = this.$store.state.userCenter;

      if (userID.indexOf('_show') > -1) {
        // const showUser = userID.split('_')[0];
        // const { userInfo } = this.$store.state.userCenter;
        // const { id } = userInfo;
        if (this.glassUserID) {
          this.trtcCalling.stopRemoteView({ userID: this.glassUserID, videoViewDomID: 'local_stream' });
        } else {
          this.trtcCalling.stopLocalView({ userID: `${userInfo.id}`, videoViewDomID: 'local_stream' });
        }
        this.trtcCalling.startRemoteView({ userID, videoViewDomID: 'local_stream' }); // 将远端用户的摄像头数据渲染到指定的 DOM ID 节点里。
        return;
      }
      const info = await getUserInfoById({ id: userID });
      const { isExpert } = info;
      this.$store.commit('updateUserInfo', info);
      if (!isExpert) {
        this.glassUserID = userID;
        this.trtcCalling.stopLocalView({ userID: `${userInfo.id}`, videoViewDomID: 'local_stream' });
        setTimeout(() => {
          this.trtcCalling.startRemoteView({ userID, videoViewDomID: 'local_stream' });
        }, 500);
      }
    },
    handleUserLeave(params) { // 人员离开房间
      console.log('人员离开房间', params);
      const { userID } = params;
      const { userInfo } = this.$store.state.userCenter;
      if (userID.indexOf('_show') > -1) {
        this.trtcCalling.stopRemoteView({ userID, videoViewDomID: 'local_stream' }); // 将远端用户的摄像头数据渲染到指定的 DOM ID 节点里。
        if (this.glassUserID) {
          this.trtcCalling.startRemoteView({ userID: this.glassUserID, videoViewDomID: 'local_stream' });
        } else {
          this.trtcCalling.startLocalView({ userID: `${userInfo.id}`, videoViewDomID: 'local_stream' });
        }
        return;
      }
      if (this.glassUserID === userID) {
        this.trtcCalling.stopRemoteView({ userID, videoViewDomID: 'local_stream' }); // 将远端用户的摄像头数据渲染到指定的 DOM ID 节点里。
        this.trtcCalling.startLocalView({ userID: `${userInfo.id}`, videoViewDomID: 'local_stream' });
      }
      this.$store.commit('delUserList', { id: +userID });
    },
    handleCallEnd() { // 通话结束
      console.log('通话结束');
      this.$message.warning('通话结束');
      this.hangup();
    },
    async handleInviteeReject(params) { // 拒绝邀请
      console.log('拒绝邀请', params);
      const info = await getUserInfoById({ id: params.userID });
      this.$message.warning(`${info.username}拒绝邀请`);
    },
    handleNoResponse(params) { // 用户无应答
      console.log('用户无应答', params);
      this.$message.warning('用户无应答');
    },
    handleInviteeLineBusy(params) { // 被邀用户正在通话中，忙线
      console.log('用户忙线', params);
      this.$message.warning('被邀用户正在通话中，忙线');
    },
    handleInviterCancel() { // 用户取消通话
      console.log('用户取消通话');
      this.$message.warning('用户取消通话');
      this.visible = false;
    },
    handleCallTimeout(params) { // 邀请超时
      console.log('邀请超时', params);
      this.$message.warning('邀请超时');
      this.visible = false;
    },
    handleUserVideoChange({ userID, isVideoAvailable }) { // 远端用户开启/关闭了摄像头
      console.log('远端用户开启/关闭了摄像头', { userID, isVideoAvailable });
      if (userID.indexOf('_show') > -1) return;
      this.$store.commit('updateUserInfo', { id: +userID, isVideoAvailable });
    },
    handleUserAudioChange({ userID, isAudioAvailable }) { // 远端用户开启/关闭了麦克风
      // console.log('远端用户开启/关闭了麦克风');
      console.log('远端用户开启/关闭了麦克风', { userID, isAudioAvailable });
      if (userID.indexOf('_show') > -1) return;
      this.$store.commit('updateUserInfo', { id: +userID, isAudioAvailable });
    },
    async doReject() { // 拒接
      if (this.trtcCalling) {
        const { inviteID } = this.inviterConfig;
        const promise = this.trtcCalling.reject({ inviteID, isBusy: true, callType: 2 });
        promise.then(() => {
          this.visible = false;
          this.inviterConfig = {};
        }).catch((err) => {
          console.log(err);
        });
      }
    },
    async doAnswer() { // 点击接听
      if (!this.trtcCalling) return;
      // const { inviteData: { roomID, callType }, sponsor, inviteID } = this.inviterConfig;
      const { inviteData: { roomID, callType }, inviteID } = this.inviterConfig;
      try {
        this.trtcCalling.accept({ inviteID, roomID, callType });
        this.meetingVisible = true;
        // const res = await setConference({ callType, roomID, inviteID: sponsor });
        // this.conferenceId = res;
        this.visible = false;
        this.roomID = roomID;
        const { userInfo } = this.$store.state.userCenter;
        setTimeout(() => {
          this.trtcCalling.startLocalView({ userID: `${userInfo.id}`, videoViewDomID: 'local_stream' });
        }, 500);
      } catch (e) {
        console.log(e);
        this.visible = false;
        this.inviterConfig = {};
      }
    }
  },
  beforeDestroy() {
    if (this.trtcCalling) {
      this.trtcCalling.logout();
      this.offEvent();
      this.trtcCalling = null;
      bus.$off();
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.answerBox {
  position: relative;

  .box {
    width: 400px;
    height: 120px;
    padding: 27px 24px;
    position: absolute;
    top: 20px;
    right: 10px;
    background: linear-gradient(135deg, #22373A 0%, #263B3E 38%, #332C2C 53%, #203B3C 100%);
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.3);
    border-radius: 20px;
    z-index: 1111111;
    box-sizing: border-box;

    .header {
      display: flex;
      align-items: center;

      ::v-deep {
        .imageName {
          width: 50px;
          height: 50px;
          font-size: 23px;
          line-height: 50px;
        }

        .userImage {
          width: 60px;
          height: 60px;
        }
      }

      .userBox {
        margin-left: 20px;
        width: 146px;
        :first-child {
          height: 25px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 25px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        :last-child {
          margin-top: 6px;
          height: 18px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #D9D9D9;
          line-height: 18px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }

    .main {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
       .right {
        display: flex;
      }

      .iconCommon {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        border-radius: 50%;
        cursor: pointer;

        .iconfont {
          font-size: 24px;
          color: #ffffff;
        }
        .icon-guaduan{
          color: #F8573A;
          font-size: 40px;
        }
      }

      .m-l-26 {
        margin-left: 26px;
      }

      .b1 {
        background: rgba(0, 0, 0, 0.3);
      }

      .b2 {
        background: #ffffff;
      }

      .b3 {
        background: #25B65A;
      }

      .text {
        margin-top: 9px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #D9D9D9;
        text-align: center;
      }
  }
}
</style>
