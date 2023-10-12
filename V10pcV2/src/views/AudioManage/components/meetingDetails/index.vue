/**
* @name: index
* @author: DELL
* @date: 2023/8/31 8:55
* @description：index
* @update: 2023/8/31 8:55
*/
<!-- 页面 -->
<template>
  <transition name="slide-bottom">
    <div class="tabs" v-if="visible">
      <div class="meetingBox" id="contentWrap">
        <div class="meeting">
          <div class="meetingHead">
            <LongTime/>
            <div class="speaker headCommon">正在讲话：{{ currentSpeaker }}</div>
            <apiot-button class="hideColumn headCommon" @click="isBarShow=!isBarShow">
              <i class="icon-baibanlan iconfont"></i>
              <span>隐藏白板栏</span>
            </apiot-button>
          </div>
          <div class="meetingContent" id="meetingContent">
            <div class="videoMain" id="local_stream"></div>
            <div :class="{whiteBar: true, hide: !isBarShow}">
              <div class="whiteBarMain">
                <div>
                  <el-tooltip class="item" effect="dark" content="截图" placement="left-end">
                    <span class="iconfont icon-jietu" @click="screenshot"></span>
                  </el-tooltip>
                </div>
                <div>
                  <el-popover
                      placement="left-end"
                      width="188"
                      popper-class="videoDrawPopper"
                      trigger="hover"
                  >
                    <div>
                      <i
                          class="iconfont"
                          :class="getColorClass(item)"
                          v-for="item in colorArr"
                          :key="item"
                          :style="drawColorStyle(item)"
                          @click="drawColor = item"></i>
                    </div>
                    <span class="iconfont icon-wenzi" slot="reference"
                     @click="setDrawType(1)"></span>
                  </el-popover>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="箭头" placement="left-end">
                    <span class="iconfont icon-jiantou" @click="setDrawType(4)"></span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="圆圈" placement="left-end">
                    <span class="iconfont icon-yuanxing" @click="setDrawType(2)"></span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="矩形" placement="left-end">
                    <span class="iconfont icon-juxing" @click="setDrawType(3)"></span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="清除画布" placement="left-end">
                    <span class="iconfont icon-shanchu1" @click="reset"></span>
                  </el-tooltip>
                </div>
                <div class="split">
                  <div></div>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="取消截屏" placement="left-end">
                    <span class="iconfont icon-quxiao" @click="clearCapture"></span>
                  </el-tooltip>
                </div>
                <div>
                  <el-tooltip class="item" effect="dark" content="发送截屏" placement="left-end">
                    <span class="iconfont icon-queding" @click="sendImageMessage"></span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <div class="footer">
            <div>
              <li class="controlIcon" @click="toggleCamera">
                <span class="iconfont" :class="getStatusClass.video"></span>
                <div>摄像头</div>
              </li>
              <li class="controlIcon" @click="toggleMicMute">
                <span class="iconfont icon-yuyin" :class="getStatusClass.audio"></span>
                <div>麦克风</div>
              </li>
              <li class="controlIcon" @click="doVolume">
                <span class="iconfont icon-yangshengqi"></span>
                <div>扬声器</div>
              </li>
              <li class="handleUp" @click="hangUp">
                <span class="iconfont icon-guaduan"></span></li>
              <li class="controlIcon " @click="share">
                <span class="iconfont icon-fenxiang1"></span>
                <div>分享</div>
              </li>
              <li class="controlIcon" @click="invite">
                <span class="iconfont icon-yaoqing"></span>
                <div>邀请</div>
              </li>
              <li class="controlIcon" @click="isShow = !isShow">
                <span class="iconfont icon-chengyuan"></span>
                <div>成员</div>
              </li>
            </div>
            <ExpertList :visible.sync ="isShowVisible"/>
          </div>
        </div>
        <div :class="{ userListBox: true, hide: !isShow  }">
          <div class="userHead">成员({{ userList.length }}人)</div>
          <div class="userListWrap">
            <div class="userListItem" v-for="item in userList" :key="item.id">
              <div class="userItemInfo">
                <UserAvatar
                    :value="[item]"
                    nameKey="username"
                    :isNeedMore="false"
                    :splitLen="1"/>
                <div>
                  <div class="name">{{ item.username }}</div>
                  <div class="des">{{ item.isExpert ? 'PC端': '眼镜端' }}</div>
                </div>
              </div>
              <div class="statusWrap">
                <span class="spanWrap" v-show="!item.isVideoAvailable">
                  <span class="iconfont icon-guanbishipin"></span>
                </span>
                <span class="spanWrap m-l-10" v-show="!item.isAudioAvailable">
                  <span class="iconfont icon-guanbiyuyin"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import TRTC from 'trtc-js-sdk';
import bus from '@/utils/bus';
import UserAvatar from '@/views/TaskToDo/Components/UserAvatar';
import { getUserSig } from '@/api/expert';
import LongTime from './components/longTime';
import ExpertList from './components/expertList.vue';
import Draw from './components/draw';

export default {
  props: {
    roomID: {
      type: Number,
    },
    visible: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      isShowVisible: false,
      localStream_: null,
      client: null,
      drawColor: 'rgb(224, 50, 50)',
      currentSpeaker: 'Admin',
      isShow: true,
      isBarShow: true,
      colorArr: ['rgb(224, 50, 50)', 'rgb(250, 100, 0)', 'rgb(250, 184, 2)', 'rgb(68, 215, 182)', 'rgb(0, 145, 255)', 'rgb(187, 57, 224)']
    };
  },

  components: {
    LongTime,
    UserAvatar,
    ExpertList
  },

  computed: {
    getStatusClass() {
      const list = this.userList;
      const { userInfo } = this.$store.state.userCenter;
      const targetObj = list.find((item) => item.id === userInfo.id) || {};
      const { isVideoAvailable, isAudioAvailable } = targetObj;
      return {
        video: isVideoAvailable ? 'icon-shiping' : 'icon-guanbishipin',
        audio: isAudioAvailable ? 'icon-yuyin' : 'icon-guanbiyuyin'
      };
    },
    userList() {
      return this.$store.state.remoteManage.userList;
    },
    drawColorStyle() {
      return function (item) {
        return {
          color: item,
          fontSize: '16px',
          marginLeft: '13px',
          cursor: 'pointer'
        };
      };
    },
    getColorClass() {
      return function (item) {
        if (item === this.drawColor) return 'icon-a-yanseyixuanzhong';
        return 'icon-a-yanseweixuanzhong';
      };
    }
  },

  mounted() {
  },

  watch: {
    drawColor: {
      handler(v) {
        Draw.setColor(v);
      }
    },
    visible: {
      handler(v) {
        if (!v) {
          this.isShowVisible = false;
          this.localStream_ = null;
          this.client = null;
          this.drawColor = 'rgb(224, 50, 50)';
          this.isShow = true;
          this.isBarShow = true;
        }
      }
    }
  },

  methods: {
      sendImageMessage () {
      const canvas = document.querySelector('#local_stream canvas');
      if (!canvas) return;
      const base64Url = canvas.toDataURL('image/jpg');

      const others = this.userList.find((item) => !item.isExpert);
      if (!others) return;
      bus.$emit('sendMessage', { glasses: others, url: base64Url });
      setTimeout(() => {
        this.clearCapture();
      }, 300);
    },
    setDrawType(type) {
      Draw.setDrawType(type);
    },
    screenshot() { // 截图
      const vedioDom = document.querySelector('#local_stream video');
      if (!vedioDom) return;
      const canvas = document.createElement('canvas');
      canvas.setAttribute('id', 'vedioCanvas');
      canvas.setAttribute('class', 'vedioCanvas');

      const ctx = canvas.getContext('2d');
      const w = vedioDom.clientWidth;
      const h = vedioDom.clientHeight;
      console.log(w, h);
      canvas.height = h;
      canvas.width = w;
      ctx.drawImage(vedioDom, 0, 0, w, h);
      if (document.getElementById('vedioCanvas') || document.getElementById('vedioCanvasDraw')) {
        this.clearCapture();
      }
      console.log(canvas);
      document.getElementById('local_stream').appendChild(canvas);
      this.setDrawType(1);
      Draw.setColor(this.drawColor);
      this.reset();
      this.draw();
    },
     // 画图
    draw () {
      if (document.getElementById('vedioCanvasDraw')) {
        return;
      }
      if (!document.getElementById('vedioCanvas')) {
        return;
      }
      console.log(document.getElementById('local_stream'));
      Draw.init(document.getElementById('local_stream'));
      Draw.setColor(this.drawColor);
      const canvas = document.getElementById('vedioCanvas');
      setTimeout(() => {
        // eslint-disable-next-line no-unused-expressions
        !!canvas && document.getElementById('local_stream').removeChild(canvas);
      }, 0);
    },
    // 取消截屏
    clearCapture () {
      const canvas = document.getElementById('vedioCanvas');
      const canvasDraw = document.getElementById('vedioCanvasDraw');
      // eslint-disable-next-line no-unused-expressions
      !!canvas && document.getElementById('local_stream').removeChild(canvas);
      // eslint-disable-next-line no-unused-expressions
      !!canvasDraw && document.getElementById('local_stream').removeChild(canvasDraw);
    },
      /* 重置功能 */
    reset() {
      Draw.clear();
    },
    invite() {
      if (!this.roomID) return;
      this.isShowVisible = true;
    },
    // 分享结束
    async showClose() {
      // 屏幕分享客户端停止推流
      try {
        await this.client.unpublish(this.localStream_);
        console.log('unpublish成功');
      } catch (e) {
        console.log(e);
      }
      try {
        await this.client.leave();
        console.log('leave');
      } catch (e) {
        console.log(e);
      }
      try {
        // eslint-disable-next-line no-unused-expressions
        this.localStream_ && this.localStream_.close();
        this.localStream_ = null;
        console.log('close');
      } catch (e) {
        console.log(e);
      }
      this.client = null;
    },
    async share() {
      if (!this.roomID) return;
      const isFlag = TRTC.isScreenShareSupported();
      if (!isFlag) { // 判断当前浏览器是否能支持分享
        this.$message.warning('当前浏览器不支持屏幕分享');
        return;
      }
      const { userInfo } = this.$store.state.userCenter;
      const showUserId = `${userInfo.id}_show`;
       /* global Base64 */
      getUserSig({ userId: Base64.encode(showUserId) }).then((res) => {
        this.client = TRTC.createClient({
          mode: 'rtc',
          sdkAppId: +res.sdkAppId,
          userId: showUserId,
          userSig: res.userSig,
          /**
           * disable receivers to avoid receiving remote streams as we only want to
           * publish the screen stream
           */
          disableReceiver: true,
        });
      });
      // create a local stream for screen share
      this.localStream_ = TRTC.createStream({
        // disable audio as RtcClient already enable audio
        audio: true,
        // enable screen share
        screen: true,
        userId: showUserId,
      });
      this.localStream_.setScreenProfile('1080p');
      try {
        // initialize the local stream to populate the screen stream
        await this.localStream_.initialize();
        console.log('ShareClient initialize local stream for screen share success');

        this.localStream_.on('player-state-changed', (event) => {
          console.log(`local stream ${event.type} player is ${event.state}`);
        });

        // 屏幕分享流监听屏幕分享停止事件
        this.localStream_.on('screen-sharing-stopped', () => {
          this.showClose();
          console.log('屏幕分享客户端停止推流');
        });
      } catch (e) {
        // 用户拒绝授予屏幕分享的权限, 导致屏幕分享失败
        if (e.name === 'NotAllowedError') {
          console.log('User refused to share the screen');
        } else {
          console.error(`ShareClient failed to initialize local stream - ${e}`);
        }
        // 屏幕分享流初始化失败，停止后续进房发布流程
        return;
      }
      console.log(this.roomID, 'this.inviterConfig');
      try {
        await this.client.join({
          roomId: +this.roomID,
        });
        console.log('ShareClient join room success');
      } catch (e) {
        console.error(`ShareClient join room failed! ' + ${e}`);
      }

      try {
        // publish the screen share stream
        await this.client.publish(this.localStream_);
        console.log('publish the screen share stream ');
      } catch (e) {
        console.error(`ShareClient failed to publish local stream ' ${e}`);
      }
    },
    doVolume() {
      // const AudioContext = window.AudioContext || window.webkitAudioContext;
      // const audioCtx = new AudioContext();

      // // load some sound
      // const audioElementArr = document.querySelectorAll('audio');
      // const audioElement = audioElementArr[1] || audioElementArr[0];
      // console.log(audioElement, 'audioElement');
      // const track = audioCtx.createMediaElementSource(audioElement);
      // console.log(track, 'track');
      // const gainNode = audioCtx.createGain();
      // gainNode.gain.value = 0;
      // // connect our graph
      // track.connect(gainNode).connect(audioCtx.destination);
    },
    hangUp() { // 挂断
      if (this.client) {
        this.showClose();
      }
      this.$emit('update:visible', false);
      bus.$emit('hangup');
    },
    toggleCamera() {
      bus.$emit('toggleCamera');
    },
    toggleMicMute() {
      bus.$emit('toggleMicMute');
    }
  },
  beforeDestroy() {
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.tabs {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 102;
  background: rgba(0, 0, 0, 0.3);

  .meetingBox {
    width: 100%;
    height: 100%;
    display: flex;
    overflow: hidden;
    position: relative;
    .meeting {
      flex: 1;
      height: 100%;
      background: #FFFFFF;

      .meetingHead {
        width: 100%;
        height: 42px;
        display: flex;
        padding: 0 14px;
        align-items: center;
        justify-content: space-between;
        background: #F6F6F8;
        box-shadow: 0px 1px 0px 0px #E9E9E9, inset -1px 0px 0px 0px #E9E9E9;
        box-sizing: border-box;

        .headCommon {
          height: 30px;
          padding: 0 13px;
          border-radius: 4px;
          text-align: center;
          line-height: 30px;
          border: 1px solid #E9E9E9;
          box-sizing: border-box;
        }

        .speaker {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;
          background: #FFFFFF;
        }

        .hideColumn {
          display: flex;
          align-items: center;
          cursor: pointer;

          i {
            color: #BBC3CD;
          }

          span {
            margin-left: 5px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }
        }
      }

      .meetingContent {
        height: calc(100% - 80px - 42px);
        display: flex;
        background: #FFFFFF;
        box-shadow: inset -1px 1px 0px 0px #E9E9E9;

        .videoMain {
          flex: 1;
          height: 100%;
          position: relative;
        }

        .whiteBar {
          width: 42px;
          height: 100%;
          display: flex;
          align-items: center;
          background: #FFFFFF;
          box-shadow: inset 1px 0px 0px 0px #E9E9E9,
          inset 0 1px 0px 0px #E9E9E9,
          inset -1px 0px 0px 0px #E9E9E9,
          inset -1px 0px 0px 0px #E9E9E9;
          transition: all .5s ease-out;
          opacity: 1;

          &.hide {
            width: 0;
            opacity: 0;
          }

          .whiteBarMain {
            width: 100%;
            text-align: center;

            .split > div {
              width: 15px;
              margin-left: 13.5px;
              border-top: 1px solid #EBEBEB;
            }

            & > div {
              margin-bottom: 14px;
            }

            span {
              font-size: 24px;
              color: #BBC3CD;

              &:hover {
                color: #4689F5;
                cursor: pointer;
              }
            }

            ::v-deep {
              .el-popover {
                padding: 6px;
              }
            }
          }
        }
      }

      .footer {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #FFFFFF;
        box-shadow: inset -1px 1px 0px 0px #E9E9E9;

        .controlIcon {
          width: 66px;
          display: inline-block;
          text-align: center;
          cursor: pointer;

          & > div {
            margin-top: 5px;
            font-size: 12px;
            font-weight: 400;
            color: #666666;
            line-height: 17px;
          }

          & > span {
            font-size: 24px;
            color: #BBC3CD;
          }

          &:hover div {
            color: #4689F5;
          }

          &:hover span {
            color: #4689F5;
          }
        }

        .handleUp {
          margin: 0 18px;
          display: inline-block;
          cursor: pointer;
          color: #f6483e;

          & > span {
            font-size: 48px;
          }
        }
      }
    }

    .userListBox {
      width: 256px;
      height: 100%;
      background: #F6F6F8;
      transition: all .5s ease-out;

      &.hide {
        width: 0;
      }

      .userHead {
        width: 256px;
        height: 42px;
        background: #F6F6F8;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        text-align: center;
        line-height: 42px;
        color: #333333;
        box-shadow: 0px 1px 0px 0px #E9E9E9;
      }

      .userListWrap {
        width: 100%;
        height: calc(100% - 42px);
        overflow: auto;
        box-sizing: border-box;

        .userListItem {
          width: 256px;
          height: 60px;
          display: flex;
          padding: 0 10px 0 14px;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          box-sizing: border-box;

          .statusWrap {
            .spanWrap{
              display: inline-block;
              width: 24px;
              height: 24px;
              color: #FFFFFF;
              text-align: center;
              line-height: 24px;
              border-radius: 50%;
              background: rgba(0,0,0,0.3);
              cursor: pointer;
            }
          }

          .userItemInfo {
            display: flex;
            align-items: center;

            .name {
              margin-left: 14px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
            }

            .des {
              margin-left: 14px;
              margin-top: 2px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #808080;
            }
          }

          &:hover {
            background: #F1F7FF;
          }
        }
      }
    }
  }
}
</style>
