<!--
 * @Descripttion: 资讯详情
 * @Author: ytx
 * @Date: 2022-11-12 16:32:23
 * @Last Modified by: ytx
 * @Last Modified time: 2022-11-12 16:32:23
-->
<template>
  <div class="inforDetails">
    <!-- 顶部 -->
    <!-- #ifndef MP-ALIPAY -->
    <apiot-navbar :title="title" v-if="isNoShare"></apiot-navbar>
    <!-- #ifdef MP-WEIXIN -->
    <!-- <div v-else style="margin-top: 150rpx; background: #fff"></div> -->
    <!-- #endif -->
    <!-- #endif -->
    <view
      :class="[
        isNoShare && isComment ? 'inforDetails__box' : 'inforDetails__box1',
      ]"
      :style="{ height: boxHeight }"
      v-if="isShowInit"
    >
      <view class="content">
        <view class="content__title">
          {{ detailsObj.title || '' }}
        </view>
        <view class="content__case">
          <user-icon
            class="content__case--icon"
            :userInfo="detailsObj"
            :size="56"
            :colorId="String(detailsObj.id)"
            prop="userName"
          ></user-icon>
          <view class="content__case--userName">
            <view>{{ detailsObj.userName || '游客' }}</view>
            <view>{{ timeago(detailsObj.createTime) || '' }}</view>
          </view>
          <view>浏览{{ detailsObj.views || '' }}次</view>
        </view>
        <view class="content__val richText">
          <!-- <rich-text :nodes="detailsObj.html"></rich-text> -->
          <u-parse :content="detailsObj.html || ''" :lazyLoad="true"></u-parse>
        </view>
        <view class="content__shareBtn" v-if="isNoShare">
          <!-- 只有 h5, 支付宝小程序 -->
          <!-- #ifdef H5 || MP-ALIPAY -->
          <button
            class="content__shareBtn--box"
            @click="handleCopyLink"
            v-if="isShare"
            style="padding: 0 24rpx; margin-right: 20rpx"
          >
            <i class="appIcon appIcon-lianjie" style="color: #808080"></i>
            链接分享
          </button>
          <!-- #endif -->
          <!-- 排除 h5, 支付宝小程序 -->
          <!-- #ifndef H5 || MP-ALIPAY -->
          <button
            class="content__shareBtn--box"
            @click="handleShare('hy')"
            open-type="share"
            v-if="isShare"
          >
            <i class="appIcon appIcon-weixin"></i>
            微信
          </button>
          <!-- 微信小程序 没有分享朋友圈 -->
          <!-- #ifndef MP-WEIXIN -->
          <button
            class="content__shareBtn--box"
            @click="handleShare('pyq')"
            v-if="isShare"
            style="padding: 0 10rpx"
          >
            <i class="appIcon appIcon-pengyouquan"></i>
            朋友圈
          </button>
          <!-- #endif -->
          <!-- #endif -->
          <view
            class="content__shareBtn--box"
            :style="[detailsObj.applaudForUser === 1 ? beenLiked : '']"
            :class="[
              detailsObj.applaudForUser === 1
                ? `themeColor__boxBgn-${getThemeIndex}`
                : '',
            ]"
            @click="handleApplaud"
          >
            <!-- 1===当前用户点赞，0===没有点赞 -->
            <view class="content__shareBtn--icon">
              <view
                class="appIcon appIcon-yidianzan"
                :class="[`themeColor__icon-${getThemeIndex}`]"
                v-if="detailsObj.applaudForUser === 1"
              ></view>
              <view class="appIcon appIcon-dianzan"></view>
            </view>
            {{ detailsObj.applauds || '' }}
          </view>
        </view>
      </view>
      <!-- 评论 -->
      <view class="inforDetails__comments" v-if="isNoShare && isComment">
        <view class="comments__title">全部评论</view>
        <view v-if="comListArr.length">
          <view
            class="comments__content"
            v-for="(val, i) in comListArr"
            :key="i"
          >
            <view class="comments__content--icon">
              <user-icon
                :userInfo="val"
                :size="48"
                :colorId="String(detailsObj.id)"
                prop="userName"
              ></user-icon>
            </view>
            <view class="comments__content--dec">
              <view class="dec__name">{{ val.userName }}</view>
              <view class="dec__val">{{ val.content }}</view>
              <view class="dec__time">{{
                timeago(val.createTime) || '刚刚'
              }}</view>
            </view>
            <view
              class="comments__content--dele"
              @click="handleDelete(val.id)"
              v-if="getUserId === val.userId"
            >
              删除
            </view>
          </view>
        </view>
        <!-- <view v-else>暂无评论</view> -->
        <view v-else class="nodata-text">
          <apiot-list-nodata></apiot-list-nodata>
        </view>
      </view>
    </view>
    <!-- 固定输入评论 -->
    <view class="inforDetails__write write" v-if="isNoShare && isComment">
      <view @touchend.prevent="handleOpenInput" style="flex: 1; display: flex">
        <input class="write__input" placeholder="请输入内容" disabled />
      </view>
      <view
        class="appIcon appIcon-fenxiang2 write__icon"
        @click="handleOpenShare"
        v-if="isShare"
      ></view>
      <!-- 1===当前用户点赞，0===没有点赞 -->
      <view @click="handleApplaud" class="write__box">
        <view
          class="appIcon appIcon-yidianzan write__icon"
          :class="[`themeColor__icon-${getThemeIndex}`]"
          v-if="detailsObj.applaudForUser === 1"
        ></view>
        <view
          class="appIcon appIcon-dianzan write__icon"
          :style="detailsObj.applaudForUser === 1 ? basecolor : ''"
        ></view>
        <view
          class="write__box--val"
          :style="basebgn"
          v-if="detailsObj.applauds !== 0"
        >
          {{ detailsObj.applauds || '' }}
        </view>
      </view>
    </view>
    <!-- 复制弹出框 -->
    <apiot-modal ref="apiotModal" sureTitle="复制链接"></apiot-modal>
    <!-- 删除二次确认 -->
    <apiot-modal ref="apiotModalDel"></apiot-modal>
    <!-- 成功提示 -->
    <u-toast ref="uToast"></u-toast>
    <!-- 分享弹出层 -->
    <u-popup :show="shareShow" :round="20" mode="bottom" @close="handleClose">
      <view class="shareClass">
        <!-- 只有 h5, 支付宝小程序 -->
        <!-- #ifdef H5 || MP-ALIPAY -->
        <view class="shareClass__content" @click="handleCopyLink">
          <view class="shareClass__border">
            <i class="appIcon appIcon-lianjie" style="color: #808080"></i>
          </view>
          <view class="shareClass__font">链接分享</view>
        </view>
        <!-- #endif -->
        <!-- 排除 h5, 支付宝小程序 -->
        <!-- #ifndef H5 || MP-ALIPAY -->
        <button
          class="shareClass__content"
          @click="handleShare('hy')"
          open-type="share"
        >
          <view class="shareClass__border">
            <i class="appIcon appIcon-weixin"></i>
          </view>
          <view class="shareClass__font">微信好友</view>
        </button>
        <!-- 微信小程序 没有分享朋友圈 和 QQ -->
        <!-- #ifndef MP-WEIXIN -->
        <button class="shareClass__content" @click="handleShare('pyq')">
          <view class="shareClass__border">
            <i class="appIcon appIcon-pengyouquan"></i>
          </view>
          <view class="shareClass__font">微信朋友圈</view>
        </button>
        <button class="shareClass__content" @click="handleShare('qq')">
          <view class="shareClass__border">
            <i class="appIcon appIcon-QQ"></i>
          </view>
          <view class="shareClass__font">QQ好友</view>
        </button>
        <!-- #endif -->
        <!-- #endif -->
      </view>
    </u-popup>
    <!-- 弹出输入框 -->
    <u-popup :show="inputShow" :round="20" mode="bottom" @close="handleClose">
      <view class="inputClass">
        <view class="inputClass__title">回复</view>
        <textarea
          placeholder="主动我们才有故事哦~"
          v-model="value"
          auto-focus
          focus
          :show-confirm-bar="false"
          placeholder-style="color: #AAAAAA;font-size:32rpx"
        ></textarea>
        <view class="inputClass__btn" @click="handleBlur">发表</view>
      </view>
    </u-popup>
    <apiot-toast v-if="isloading" status="loading" :isFull="true"></apiot-toast>
  </div>
</template>

<script>
import mixin from '../mixin';
import UserIcon from '@/globalComponents/ApiotUserhead/components/UserIcon';
import { Decrypt, Encrypt } from '@/utils';
import {
  getArticle,
  insertComment,
  deleteComment,
  getArticleByShare,
  applaud,
  cancelApplaud
} from '@/api/moreInfor';

export default {
  mixins: [mixin],
  data() {
    return {
      isShowInit: false,
      isloading: false,
      articleId: 0, // 文章的id
      detailsObj: {}, // 这条数据的详情
      comListArr: [], // 评论数组
      title: '资讯详情',
      content: '<div></div>',
      value: '',
      shareShow: false, // 分享弹框
      inputShow: false, // 输入框弹框
      code: '', // 数据源编码
      isShowComments: '',
      isPort: false // 是否在请求接口
    };
  },
  components: {
    UserIcon
  },
  computed: {
    // 主题色
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    beenLiked() {
      return {
        border: `2rpx solid ${this.themeColor}`,
        color: this.themeColor
      };
    },
    basecolor() {
      return `color: ${this.themeColor}`;
    },
    basebgn() {
      return `background: ${this.themeColor}`;
    },
    boxHeight() {
      const { navbarHeight, statusBar } = this.$store.state.base.systemInfo;
      let height = `calc(100vh - ${navbarHeight}px - ${statusBar}px - 50px)`;
      if (!this.isNoShare && this.isComment) {
        height = '100vh';
      }
      console.log(height);
      // #ifdef MP-ALIPAY
      height = 'calc(100vh - 50px)';
      // #endif
      return height;
    },
    getUserId() {
      return this.$store.state.userCenter.userInfo.id;
    },
    isNoShare() {
      // true 是不分享，false 是分享
      return this.isShowComments !== '1';
    },
    isShare() {
      return this.detailsObj.isShare === 1;
    },
    isComment() {
      return this.detailsObj.isComment === 1;
    }
  },
  watch: {},
  mounted() {
    this.getArticle(1);
    // #ifdef MP-ALIPAY
    uni.setNavigationBarTitle({
      title: this.title
    });
    // #endif
  },
  // 微信小程序
  // #ifdef MP
  onShareAppMessage() {
    const shareUrl = `/MoreInfor/components/InforDetails/index?id=${Encrypt(
      String(this.articleId)
    )}&isVal=${Encrypt('1')}&code=${Encrypt(this.detailsObj.code || this.code)}`;
    return {
      title: this.detailsObj.title || '', // 分享的名称
      path: shareUrl,
      mpId: 'wx41888c928ebfd1e5' // 此处配置微信小程序的AppId
    };
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.detailsObj.title || '',
      query: `id=${Encrypt(String(this.articleId))}&isVal=${Encrypt('1')}&code=${Encrypt(
        this.detailsObj.code || this.code
      )}`
    };
  },
  // #endif
  methods: {
    // 复制链接
    handleCopyLink() {
      const fixedUrl = '/onlineApp/MoreInfor/components/InforDetails/index';
      const url = this.$apiot.getComUrlByToken(
        fixedUrl,
        {
          id: Encrypt(String(this.articleId)),
          isVal: Encrypt('1'),
          code: Encrypt(this.detailsObj.code || this.code)
        },
        false
      );
      const _this = this;
      uni.setClipboardData({
        showToast: false,
        data: url,
        success() {
          // #ifndef MP-WEIXIN
          _this.$refs.uToast.show({
            type: 'success',
            message: '复制成功'
          });
          // #endif
        }
      });
    },
    // 获取文章内容  flag：点击浏览+1
    async getArticle(flag = 2) {
      this.isloading = true;
      let res = {};
      if (this.isNoShare) {
        res = await getArticle({
          id: this.articleId,
          flag // 订阅次数
        });
      } else {
        res = await getArticleByShare({
          code: `${this.code}&&${this.articleId}`
        });
      }
      console.log(res);
      this.detailsObj = res || {};
      this.comListArr = res.comList || [];
      this.isloading = false;
      this.isShowInit = true;
    },
    // 新增评论
    async handleBlur(e) {
      if (!this.value) {
        return;
      }
      await insertComment({
        articleId: this.articleId,
        content: this.value,
        userId: this.getUserId
      });
      this.value = '';
      this.inputShow = false;
      this.getArticle();
      if (this.detailsObj.audit === 1) {
        this.$refs.uToast.show({
          type: 'warning',
          message: '评论显示待通过'
        });
      } else {
        this.$refs.uToast.show({
          type: 'success',
          message: '评论成功'
        });
      }
    },
    // 删除评论
    async handleDelete(id) {
      await this.$refs.apiotModalDel
        .showAsyncModal({
          content: '是否确定删除！'
        })
        .then(async () => {
          await deleteComment({ id });
          this.getArticle();
        });
    },
    // 点赞
    async handleApplaud() {
      if (this.isPort) return;
      this.isPort = true;
      if (this.detailsObj.applaudForUser === 1) {
        await cancelApplaud({
          id: this.articleId
        });
      } else {
        const res = await applaud({
          articleId: this.articleId,
          userId: this.getUserId
        });
      }
      setTimeout(() => {
        this.isPort = false;
      }, 100);
      this.getArticle();
    },
    // 填写评论框
    handleOpenInput() {
      this.inputShow = true;
    },
    // 分享弹窗
    handleOpenShare() {
      this.shareShow = true;
    },
    handleClose() {
      this.shareShow = false;
      this.inputShow = false;
    },
    // 分享
    async handleShare(type) {
      this.shareShow = false;
      const fixedUrl = '/onlineApp/MoreInfor/components/InforDetails/index';

      const url = this.$apiot.getComUrlByToken(
        fixedUrl,
        {
          id: Encrypt(String(this.articleId)),
          isVal: Encrypt('1'),
          code: Encrypt(this.detailsObj.code || this.code)
        },
        false
      );
      const _this = this;
      // app分享
      // #ifdef APP-PLUS
      let scene = 'WXSceneSession';
      if (type === 'hy') {
        scene = 'WXSceneSession';
      } else if (type === 'pyq') {
        scene = 'WXSceneTimeline';
      } else if (type === 'sc') {
        scene = 'WXSceneFavorite';
      }
      let provider = '';
      if (type === 'qq') {
        provider = 'qq';
      } else {
        provider = 'weixin';
      }
      const summary = (this.detailsObj.txt && this.detailsObj.txt.slice(0, 30)) || '';
      uni.share({
        provider,
        scene,
        type: 0,
        href: url, // 分享跳转的链接
        title: this.detailsObj.title, // 分享标题
        summary, // 分享内容文字
        imageUrl: this.detailsObj.articleCover
      });
      // #endif
      // // 不是 app分享，不是微信小程序
      // // #ifndef APP-PLUS || MP-WEIXIN
      // await this.$refs.apiotModal
      //   .showAsyncModal({
      //     content: `链接: ${
      //       this.detailsObj.title.length < 14
      //         ? this.detailsObj.title.slice(0, 14)
      //         : `${this.detailsObj.title.slice(0, 14)}...`
      //     }`
      //   })
      //   .then((v) => {
      //     uni.setClipboardData({
      //       showToast: false,
      //       data: url,
      //       success() {
      //         // #ifndef MP-WEIXIN
      //         _this.$refs.uToast.show({
      //           type: 'success',
      //           message: '复制成功'
      //         });
      //         // #endif
      //       }
      //     });
      //   });
      // // #endif
    }
  },
  onLoad(option) {
    this.articleId = Decrypt(option.id);
    this.isShowComments = Decrypt(option.isVal); // 是分享过的
    this.code = Decrypt(option.code);

    // #ifdef MP
    wx.showShareMenu({
      withShareTicket: true,
      // 设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
      menus: ['shareAppMessage', 'shareTimeline']
    });
    // #endif
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';
@import '../u-parse/u-parse.css';

.inforDetails {
  width: 100%;
  height: 100vh;
  &__box {
    // height: calc(100vh - 90rpx - 98rpx);
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  &__box1 {
    // height: 100vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }
  &__comments {
    margin-top: 18rpx;
    background: #ffffff;
    flex: 1;
  }
  &__write {
    position: fixed;
    bottom: 0;
    width: calc(100% - 80rpx);
    height: 98rpx;
    background: #ffffff;
    box-shadow: 0px -1px 0px 0px #e9e9e9;
    padding: 0 40rpx;
    display: flex;
    align-items: center;
  }
}
.content {
  padding: 0 30rpx 20rpx;
  background: #ffffff;
  &__title {
    font-size: 36rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #222222;
    line-height: 50rpx;
    padding-top: 25rpx;
  }
  &__case {
    display: flex;
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #aaaaaa;
    line-height: 33rpx;
    align-items: flex-end;
    &--icon {
      height: 68rpx;
      display: flex;
      align-items: center;
      ::v-deep {
        .userIcon__circle {
          font-size: 30rpx !important;
        }
      }
    }
    &--userName {
      flex: 1;
      margin-left: 16rpx;
      view:first-child {
        font-size: 26rpx;
        color: #333333;
      }
    }
  }
  &__val {
    margin-top: 40rpx;
  }
  &__shareBtn {
    display: flex;
    margin-top: 41rpx;
    justify-content: flex-end;
    .appIcon {
      margin-right: 10rpx;
      font-size: 40rpx;
      width: 40rpx;
      height: 40rpx;
    }
    .appIcon-weixin {
      font-size: 37rpx;
    }
    &--box {
      min-width: 154rpx;
      height: 70rpx;
      background: #ffffff;
      border-radius: 35rpx;
      border: 2rpx solid #ebebeb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24rpx;
      color: #444444;
      margin-right: 20rpx;
    }
    &--icon {
      position: relative;
      .appIcon-yidianzan {
        position: absolute;
        opacity: 0.3;
      }
    }
    &--box:last-child {
      margin-right: 10rpx;
    }
  }
}
.comments {
  &__title {
    height: 88rpx;
    line-height: 88rpx;
    font-size: 28rpx;
    padding-left: 30rpx;
    box-shadow: 0px 1px 0px 0px #e9e9e9;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  &__content {
    margin: 0 30rpx 30rpx;
    box-shadow: 0px 1px 0px 0px #e9e9e9;
    display: flex;
    &--icon {
      margin-top: 33rpx;
      margin-right: 13rpx;
      ::v-deep {
        .userIcon__circle {
          font-size: 24rpx !important;
        }
      }
    }
    &--dec {
      flex: 1;
      margin-top: 40rpx;
      .dec__name {
        font-size: 26rpx;
        color: #9b9b9b;
        line-height: 33rpx;
      }
      .dec__val {
        margin-top: 15rpx;
        font-size: 30rpx;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 42rpx;
      }
      .dec__time {
        margin: 30rpx 0;
        font-size: 24rpx;
        color: #aaaaaa;
        line-height: 32rpx;
      }
    }
    &--dele {
      font-size: 24rpx;
      color: #9b9b9b;
      line-height: 33rpx;
      margin-top: 40rpx;
    }
  }
}
.write {
  &__input {
    flex: 1;
    height: 64rpx;
    background: #ebebeb;
    border-radius: 32rpx;
    margin-right: 38rpx;
    padding-left: 30rpx;
  }
  &__input::placeholder {
    color: #9b9b9b;
  }
  &__box {
    position: relative;
    .appIcon-yidianzan {
      position: absolute;
      opacity: 0.3;
    }
    &--val {
      position: absolute;
      top: -10rpx;
      right: 0rpx;
      background: #4689f5;
      border-radius: 14rpx;
      border: 2rpx solid #ffffff;
      font-size: 20rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffffff;
      padding: 0 10rpx;
    }
  }
  .write__icon {
    font-size: 60rpx;
    color: #444444;
  }
  .appIcon-yidianzan,
  .appIcon-dianzan {
    margin-right: 10rpx;
  }
  .appIcon-fenxiang2 {
    margin-right: 38rpx;
  }
  ::v-deep {
    .uni-input-input,
    .uni-input-placeholder {
      padding-left: 20rpx;
    }
  }
}
.shareClass {
  display: flex;
  margin: 65rpx 110rpx 50rpx;
  justify-content: space-between;
  &__border {
    width: 98rpx;
    height: 98rpx;
    border: 2rpx solid #e9e9e9;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      width: 50rpx;
      height: 50rpx;
      font-size: 50rpx;
    }
  }
  &__font {
    font-size: 26rpx;
    color: #888888;
    margin-top: 30rpx;
  }
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
.inputClass {
  margin: 0 30rpx;
  &__title {
    margin: 22rpx 0;
    font-size: 32rpx;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  &__btn {
    float: right;
    font-size: 32rpx;
    color: #333333;
    margin: 30rpx 0;
  }
}
.nodata-text {
  // display: flex;
  text-align: center;
  color: #9b9b9b;
  font-size: 28rpx;
  background: #ffffff;
  margin: 10rpx 0;
  height: 30vh;
}
::v-deep {
  uni-video {
    width: 100%;
  }
  a-button:after,
  uni-button:after,
  button:after {
    border: 0;
  }
  a-button,
  uni-button,
  button {
    box-sizing: content-box;
    line-height: inherit;
    padding: 0;
    margin: 0;
    width: auto;
    background-color: transparent;
  }
  /* #ifdef APP-PLUS */
  uni-textarea {
    height: 116rpx;
  }
  /* #endif */
  /* #ifdef MP-ALIPAY */
  .a-textarea {
    height: 140rpx;
  }
  /* #endif */
  /* #ifdef MP-WEIXIN */
  textarea {
    height: 120rpx;
  }
  /* #endif */
}
</style>
