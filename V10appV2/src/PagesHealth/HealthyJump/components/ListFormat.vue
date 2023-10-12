<template>
  <view>
    <view class="list" :class="[{pointHeight: isPoint, otherHeight: !isPoint}]"
    v-for="(item, index) in data" :key="index" @click="handleTip">
      <view class="firstLine">
        <i class="appIcon appIcon-zhihangguifan"></i>
        <view class="text1" v-if="!isPoint">
          <view v-show="isBehavior"
            :class="item.behavior === '手动创建' ? 'taskState1' : 'taskState2'">{{item.behavior}}</view>
          <view class="taskDetail">{{item.workname}}</view>
        </view>
        <view class="text2" v-else>
          {{item.name}}
        </view>
        <view class="state" v-if="!isDownTime" v-show="!isPoint">
          <view :class="[{yellowCircle: isEquHealth, redCircle: !isEquHealth}]"></view>
          {{item.state}}
        </view>
        <view v-else class="userName" v-show="!isPoint">
          {{item.userName}}
        </view>
      </view>
      <!-- 点巡检和其他差异 -->
      <view v-if="!isPoint">
        <view class="key">工单编码：{{item.workKey}}</view>
        <view v-if="!isDownTime">
          <view class="name">设备编码：{{item.devKey}}</view>
          <view class="nameAndTime">
            <view class="devName">设备名称：{{item.devName}}</view>
            <view class="time">{{item.createTime}}</view>
          </view>
        </view>
        <view v-else>
          <view class="name">位置名称：{{item.devKey}}</view>
          <view class="nameAndTime">
            <view class="devName">停机时长：{{item.devName}}</view>
            <view class="time">{{item.createTime}}</view>
          </view>
        </view>
      </view>
      <view v-else>
        <view class="timeAndVal">
          <view class="time">
            {{item.checkTime}}
          </view>
          <view :class="[businessClass(item)]">
            {{item.proportion}}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: { // 是否为文字按钮
      type: Array,
      default() {
        return [];
      }
    },
    isBehavior: {
      type: Boolean,
      default: true
    },
    isEquHealth: {
      type: Boolean,
      default: false
    },
    isDownTime: {
      type: Boolean,
      default: false
    },
    isPoint: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleTip() {
      uni.showToast({
        title: '请到具体菜单进行操作！',
        icon: 'none'
      });
    },
    businessClass(item) {
      let classname = '';
      if (item.proportion && item.proportion.split('/')[0] === '0') {
        classname = 'val1';
      } else if (item.proportion && item.proportion.split('/')[0] === item.proportion.split('/')[1]) {
        classname = 'val3';
      } else {
        classname = 'val2';
      }
      return classname;
    },
  },
  onLoad() {
    console.log();
  }
};
</script>

<style lang="scss" scoped>
@charset "utf-8";
// @import "@/static/scss/common/_function.scss";
// @import "@/static/scss/common/_variable.scss";
$devNameWidth: 150rpx;
.list {
  height: 240rpx;
  margin-top: 20rpx;
  padding: 0 20rpx;
  padding-top: 6rpx;
  background: #FFFFFF;
  box-shadow: 0px 2px 10px 0px rgba(46, 92, 167, 0.1);
  border-radius: 8px;
  .firstLine {
    height: 88rpx;
    width: 100%;
    display:flex;
    align-items:center;/*垂直居中*/
    position: relative;
    .appIcon-zhihangguifan {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 45rpx;
      width: 60rpx;
      height: 60rpx;
      font-size: 45rpx;
      border-radius: 12rpx;
      color: #4689F5;
    }
    .text1 {
      width: 63%;
      margin-left: 20rpx;
      height: 60rpx;
      display:flex;
      align-items:center;/*垂直居中*/
      .taskState1, .taskState2 {
        border-radius: 8rpx;
        height: 36rpx;
        line-height: 36rpx;
        padding: 0 13rpx;
        font-size: 22rpx;
        white-space: nowrap;
      }
      .taskState1 {
        background: #FFEAEB;
        color: #E02020;
      }
      .taskState2 {
        background: #FFECD3;
        color: #FAA431;
      }
      .taskDetail {
        font-size: 32rpx;
        color: #333333;
        margin-left: 6rpx;
      }
    }
    .text2 {
      margin-left: 20rpx;
      font-size: 34rpx;
      color: #333333;
      width: 75%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .state {
      position: absolute;
      right: 0;
      font-size: 28rpx;
      color: #111111;
      .redCircle, .yellowCircle {
        width: 16rpx;
        height: 16rpx;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8rpx;
      }
      .redCircle {
        background: #FAB71C;
      }
      .yellowCircle {
        background: #EF5F5E;
      }
    }
    .userName {
      position: absolute;
      right: 0;
      font-size: 24rpx;
      color: #111111;
    }
  }
  .key, .name, .nameAndTime {
    font-size: 24rpx;
    margin-left: 80rpx;
  }
  .key {
    color: #444444;
  }
  .name, .nameAndTime {
    color: #AAAAAA;
  }
  .name {
    margin-top: 9rpx;
  }
  .nameAndTime {
    margin-top: 8rpx;
    & > view {
      display: inline-block
    }
    .devName {
      width: calc(100% - #{$devNameWidth})
    }
    .time {
      float: right;
    }
  }
  .key, .name, .devName, .taskDetail {
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .timeAndVal {
    margin-left: 80rpx;
    &>view {
      display: inline-block;
      height: 48rpx;
      line-height: 248rpx;
    }
    .time {
      font-size: 24rpx;
      color: #444444;
    }
    .val1, .val2, .val3 {
      width: 114rpx;
      float: right;
      border-radius: 14rpx;
      // padding: 0 pxToREM(20);
      text-align: center;
      font-size: 28rpx;
    }
    .val1 {
      background: #F1F3F6;
      color: #BBC3CD;
    }
    .val2 {
      background: #FFEAEB;
      color: #E02020;
    }
    .val3 {
      background: #F1F7FF;
      color: #4689F5;
    }
  }
}
.list:last-child {
  margin-bottom: 20rpx;
}
.pointHeight {
  height: 167rpx;
}
.otherHeight {
  height: 240rpx;
}
</style>
