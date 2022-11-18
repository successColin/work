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
    <apiot-navbar :title="title" v-if="isNoShare"></apiot-navbar>
    <view
      :class="[
        isNoShare && isComment ? 'inforDetails__box' : 'inforDetails__box1',
      ]"
    >
      <view class="content">
        <view class="content__title">
          {{ detailsObj.title }}
        </view>
        <view class="content__case">
          <view>{{ detailsObj.createTime }}</view>
          <view v-if="isNoShare">浏览{{ detailsObj.views }}次</view>
        </view>
        <view class="content__val richText">
          <!-- <rich-text :nodes="detailsObj.html"></rich-text> -->
          <u-parse class="aaa" :content="detailsObj.html"></u-parse>
        </view>
        <view class="content__shareBtn" v-if="isNoShare">
          <view
            class="content__shareBtn--box"
            @click="handleShare('hy')"
            v-if="isShare"
          >
            <i class="appIcon appIcon-weixin"></i>
            微信
          </view>
          <view
            class="content__shareBtn--box"
            @click="handleShare('pyq')"
            v-if="isShare"
          >
            <i class="appIcon appIcon-pengyouquan"></i>
            朋友圈
          </view>
          <view
            :class="[
              'content__shareBtn--box',
              detailsObj.applaudForUser === 1 ? 'beenLiked' : '',
            ]"
            @click="handleApplaud"
          >
            <!-- 1===当前用户点赞，0===没有点赞 -->
            <i
              class="appIcon appIcon-yidianzan"
              v-if="detailsObj.applaudForUser === 1"
            ></i>
            <i class="appIcon appIcon-dianzan" v-else></i>
            {{ detailsObj.applauds }}
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
            <!-- <i class="appIcon appIcon-zhanghao comments__content--icon"></i> -->
            <image
              :src="$apiot.getComUrlByToken(val.icon.imageUrl)"
              class="comments__content--userImg comments__content--icon"
            ></image>
            <view class="comments__content--dec">
              <view class="dec__name">{{ val.userName }}</view>
              <view class="dec__val">{{ val.content }}</view>
              <view class="dec__time">{{ val.createTime }}</view>
            </view>
            <view class="comments__content--dele" @click="handleDelete(val.id)">
              删除
            </view>
          </view>
        </view>
        <view class="nodata-text" v-else>暂无评论</view>
      </view>
    </view>
    <!-- 固定输入评论 -->
    <view class="inforDetails__write write" v-if="isNoShare && isComment">
      <input
        class="write__input"
        placeholder="请输入内容"
        disabled
        @click="handleOpenInput"
      />
      <i
        class="appIcon appIcon-fenxiang2 write__icon"
        @click="handleOpenShare"
        v-if="isShare"
      ></i>
      <!-- <i class="appIcon appIcon-yidianzan write__icon"></i> -->
      <!-- 1===当前用户点赞，0===没有点赞 -->

      <view @click="handleApplaud" class="write__box">
        <i
          class="appIcon appIcon-yidianzan write__icon"
          v-if="detailsObj.applaudForUser === 1"
        ></i>
        <i v-else class="appIcon appIcon-dianzan write__icon"></i>
        <view class="write__box--val" v-if="detailsObj.applauds !== 0">
          {{ detailsObj.applauds }}
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
        <view class="shareClass__content" @click="handleShare('hy')">
          <view class="shareClass__border">
            <i class="appIcon appIcon-weixin"></i>
          </view>
          <view class="shareClass__font">微信好友</view>
        </view>
        <view class="shareClass__content" @click="handleShare('pyq')">
          <view class="shareClass__border">
            <i class="appIcon appIcon-pengyouquan"></i>
          </view>
          <view class="shareClass__font">微信朋友圈</view>
        </view>
        <view class="shareClass__content" @click="handleShare('qq')">
          <view class="shareClass__border">
            <i class="appIcon appIcon-QQ"></i>
          </view>
          <view class="shareClass__font">QQ好友</view>
        </view>
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
        ></textarea>
        <view class="inputClass__btn" @click="handleBlur">发表</view>
      </view>
    </u-popup>
  </div>
</template>

<script>
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
  data() {
    return {
      articleId: 0, // 文章的id
      detailsObj: {}, // 这条数据的详情
      comListArr: [], // 评论数组
      title: '资讯详情',
      content: '<div>asd阿斯顿发斯蒂芬</div>',
      value: '',
      shareShow: false, // 分享弹框
      inputShow: false, // 输入框弹框
      code: '' // 数据源编码
    };
  },
  components: {},
  computed: {
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
    this.getArticle();
  },
  methods: {
    // 获取文章内容
    async getArticle() {
      let res = {};
      if (this.isNoShare) {
        res = await getArticle({
          id: this.articleId,
          flag: 1 // 订阅次数
        });
      } else {
        res = await getArticleByShare({
          code: `${this.code}&&${this.articleId}`
        });
      }
      console.log(res);
      this.detailsObj = res;
      this.comListArr = res.comList;
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
      this.$refs.uToast.show({
        type: 'success',
        message: '评论成功'
      });
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
      let fixedUrl = '';
      // #ifdef APP-PLUS
      fixedUrl = '/onlineApp/MoreInfor/components/InforDetails/index';
      // #endif

      // #ifdef H5
      fixedUrl = '/onlineApp/MoreInfor/components/InforDetails/index';
      // #endif

      const url = this.$apiot.getComUrlByToken(
        fixedUrl,
        {
          id: Encrypt(String(this.articleId)),
          isVal: Encrypt('1'),
          code: Encrypt(this.detailsObj.code)
        },
        false
      );

      const _this = this;
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
      console.log(url);
      uni.share({
        provider,
        scene,
        type: 0,
        href: url, // 分享跳转的链接
        title: this.detailsObj.title, // 分享标题
        summary: this.detailsObj.txt, // 分享内容文字
        imageUrl: this.detailsObj.articleCover
      });
      // #endif

      // #ifdef H5
      await this.$refs.apiotModal
        .showAsyncModal({
          content: `链接: ${url}`
        })
        .then((v) => {
          uni.setClipboardData({
            showToast: false,
            data: url,
            success() {
              _this.$refs.uToast.show({
                type: 'success',
                message: '复制成功'
              });
            }
          });
        });
      // #endif
    }
  },
  onLoad(option) {
    this.articleId = Decrypt(option.id);
    this.isShowComments = Decrypt(option.isVal); // 是分享过的
    this.code = Decrypt(option.code);
  }
};
</script>
<style lang='scss' scoped>
@import './index.scss';
@import url('@/components/u-parse/u-parse.css');

.inforDetails {
  width: 100%;
  height: 100vh;
  &__box {
    height: calc(100vh - 90rpx - 98rpx);
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  &__box1 {
    height: calc(100vh - 90rpx);
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
    box-shadow: 0px -1px 0px 0px #e0e0e0;
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
    justify-content: space-between;
    margin-top: 20rpx;
    font-size: 24rpx;
    color: #aaaaaa;
    line-height: 33rpx;
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
      width: 154rpx;
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
    .beenLiked {
      background: #e5f0ff;
      border: 2rpx solid #4689f5;
      color: #4689f5;
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
    box-shadow: 0px 1rpx 0px 0px #e0e0e0;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
  }
  &__content {
    margin: 0 30rpx 30rpx;
    box-shadow: 0px 1rpx 0px 0px #e0e0e0;
    display: flex;
    &--icon {
      margin-top: 33rpx;
      font-size: 48rpx;
      margin-right: 13rpx;
    }
    &--userImg {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
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
  }
  &__box {
    position: relative;
    .appIcon-yidianzan {
      color: #4689f5;
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
    border: 2rpx solid #e0e0e0;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      width: 50rpx;
      height: 50rpx;
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
  display: block;
  text-align: center;
  color: #9b9b9b;
  font-size: 28rpx;
  margin: 80rpx 0;
}
// .appIcon {
//   height: 37px;
// }
</style>
