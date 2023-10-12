<template>
  <view class="iconButton" @click="handleBtn" v-show="isShow">
    <view>
      <m-font-icon
        icon="zhanneitongzhi"
        :iconSize="48"
        class="myIcon"
      ></m-font-icon>
    </view>
    <view class="num" :style="{ color: themeColorCode }" v-show="messageNum">
      {{ numLength >= 3 ? '…' : messageNum }}
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(['themeColorCode', 'messageNum', 'userId', 'defaultUrl']),
    ...mapState('home', ['enabledData']),
    numLength() {
      return String(this.messageNum).length;
    },
    isShow() {
      return Boolean(this.enabledData.openMail);
    },
  },
  mounted() {
    // 第一获取数量
    this.isShow && this.getMessageNum();
  },
  methods: {
    ...mapMutations(['UPDATE_MESSAGE_NUM']),
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
    // 点击按钮跳转
    handleBtn() {
      uni.navigateTo({
        url: '/pages/pushMessage/NoRead',
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@charset "utf-8";
@import '@/static/scss/common/_variable.scss';
$circle: 30rpx;
.iconButton {
  margin-right: 18rpx;
  position: relative;
  line-height: normal;
  margin-top: 20rpx;
  .myIcon {
    color: #ffffff;
  }
  .num {
    position: absolute;
    top: -6rpx;
    right: -12rpx;
    min-width: $circle;
    height: $circle;
    line-height: $circle;
    background: #ffffff;
    border-radius: 18px;
    color: #cc3534;
    font-size: 22rpx;
    text-align: center;
  }
}
</style>
