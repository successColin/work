<template>
  <view>
    <view class="apiotCountdown" v-if="seconds > 0">
      <text
        v-if="showDay"
        :style="{
          borderColor: borderColor,
          color: color,
          backgroundColor: backgroundColor,
        }"
        class="apiotCountdown__number"
        >{{ d }}</text
      >
      <text
        v-if="showDay"
        :style="{ color: splitorColor }"
        class="apiotCountdown__splitor"
        >{{ dayText }}</text
      >
      <text
        v-if="showHour"
        :style="{
          borderColor: borderColor,
          color: color,
          backgroundColor: backgroundColor,
        }"
        class="apiotCountdown__number"
        >{{ h }}</text
      >
      <text
        v-if="showHour"
        :style="{ color: splitorColor }"
        class="apiotCountdown__splitor"
        >{{ showColon ? ':' : hourText }}</text
      >
      <text
        v-if="showMin"
        :style="{
          borderColor: borderColor,
          color: color,
          backgroundColor: backgroundColor,
        }"
        class="apiotCountdown__number"
        >{{ i }}</text
      >
      <text
        v-if="showMin"
        :style="{ color: splitorColor }"
        class="apiotCountdown__splitor"
        >{{ showColon ? ':' : minuteText }}</text
      >
      <text
        v-if="showSecond"
        :style="{
          borderColor: borderColor,
          color: color,
          backgroundColor: backgroundColor,
        }"
        class="apiotCountdown__number"
        >{{ s }}</text
      >
      <text
        v-if="!showColon"
        :style="{ color: splitorColor }"
        class="apiotCountdown__splitor"
        >{{ secondText }}</text
      >
    </view>
    <view v-else>
      <slot></slot>
    </view>
  </view>
</template>
<script>
/**
 * Countdown 倒计时
 * @description 倒计时组件
 * @tutorial https://ext.dcloud.net.cn/plugin?id=25
 * @property {String} backgroundColor 背景色
 * @property {String} color 文字颜色
 * @property {Number} day 天数
 * @property {Number} hour 小时
 * @property {Number} minute 分钟
 * @property {Number} second 秒
 * @property {Number} timestamp 时间戳
 * @property {Boolean} showDay = [true|false] 是否显示天数
 * @property {Boolean} showHour = [true|false] 是否显示小时
 * @property {Boolean} showColon = [true|false] 是否以冒号为分隔符
 * @property {String} splitorColor 分割符号颜色
 * @event {Function} timeup 倒计时时间到触发事件
 * @example <apiot-countdown :day="1" :hour="1" :minute="12" :second="40"></apiot-countdown>
 */
export default {
  name: 'UniCountdown',
  emits: ['timeup'],
  props: {
    mode: {
      // ['hour', 'minute', 'second']
      type: Array,
      default() {
        return ['hour', 'minute', 'second'];
      }
    },
    showDay: {
      type: Boolean,
      default: true
    },
    showColon: {
      type: Boolean,
      default: true
    },
    start: {
      type: Boolean,
      default: true
    },
    backgroundColor: {
      type: String,
      default: '#FFFFFF'
    },
    borderColor: {
      type: String,
      default: '#000000'
    },
    color: {
      type: String,
      default: '#000000'
    },
    splitorColor: {
      type: String,
      default: '#000000'
    },
    day: {
      type: Number,
      default: 0
    },
    hour: {
      type: Number,
      default: 0
    },
    minute: {
      type: Number,
      default: 0
    },
    second: {
      type: Number,
      default: 0
    },
    timestamp: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      timer: null,
      syncFlag: false,
      d: '00',
      h: '00',
      i: '00',
      s: '00',
      leftTime: 0,
      seconds: 0
    };
  },
  computed: {
    dayText() {
      return this.$t('common.day');
    },
    hourText() {
      return this.$t('common.h');
    },
    minuteText() {
      return this.$t('common.m');
    },
    secondText() {
      return this.$t('common.s');
    },
    showSecond() {
      return this.mode.indexOf('second') !== -1;
    },
    showMin() {
      return this.mode.indexOf('minute') !== -1;
    },
    showHour() {
      return this.mode.indexOf('hour') !== -1;
    }
  },
  watch: {
    day() {
      this.changeFlag();
    },
    hour() {
      this.changeFlag();
    },
    minute() {
      this.changeFlag();
    },
    second() {
      this.changeFlag();
    },
    start: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal) {
          this.startData();
        } else {
          if (!oldVal) return;
          clearInterval(this.timer);
        }
      }
    }
  },
  created() {
    this.seconds = this.toSeconds(this.timestamp, this.day, this.hour, this.minute, this.second);
    this.countDown();
  },
  // #ifndef VUE3
  destroyed() {
    clearInterval(this.timer);
  },
  // #endif
  // #ifdef VUE3
  unmounted() {
    clearInterval(this.timer);
  },
  // #endif
  methods: {
    toSeconds(timestamp, day, hours, minutes, seconds) {
      if (timestamp) {
        return timestamp - parseInt(new Date().getTime() / 1000, 10);
      }
      return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds;
    },
    timeUp() {
      clearInterval(this.timer);
      this.$emit('timeup');
    },
    countDown() {
      const { seconds, mode } = this;
      let [day, hour, minute, second] = [0, 0, 0, 0];
      if (seconds > 0) {
        day = Math.floor(seconds / (60 * 60 * 24));
        hour = Math.floor(seconds / (60 * 60)) - day * 24;
        minute = Math.floor(seconds / 60) - day * 24 * 60 - hour * 60;
        second = Math.floor(seconds) - day * 24 * 60 * 60 - hour * 60 * 60 - minute * 60;
      } else {
        this.timeUp();
      }
      if (mode.length === 1 && this.showHour) {
        hour += day * 24;
      } else if (mode.length === 1 && this.showMin) {
        minute = minute + day * 24 + hour * 60;
      } else if (mode.length === 1 && this.showSecond) {
        second = seconds;
      }

      if (day < 10) {
        day = `0${day}`;
      }
      if (hour < 10) {
        hour = `0${hour}`;
      }
      if (minute < 10) {
        minute = `0${minute}`;
      }
      if (second < 10) {
        second = `0${second}`;
      }
      this.d = day;
      this.h = hour;
      this.i = minute;
      this.s = second;
    },
    startData() {
      this.seconds = this.toSeconds(this.timestamp, this.day, this.hour, this.minute, this.second);
      if (this.seconds <= 0) {
        return;
      }
      clearInterval(this.timer);
      this.countDown();
      this.timer = setInterval(() => {
        this.seconds -= 1;
        if (this.seconds < 0) {
          this.timeUp();
          return;
        }
        this.countDown();
      }, 1000);
    },
    changeFlag() {
      if (!this.syncFlag) {
        this.seconds = this.toSeconds(
          this.timestamp,
          this.day,
          this.hour,
          this.minute,
          this.second
        );
        this.startData();
        this.syncFlag = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
$countdown-height: 48rpx;
$countdown-width: 52rpx;

.apiotCountdown {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
  justify-content: flex-start;
  padding: 2rpx 0;
  font-size: 26rpx;
  font-family: PingFangSC-Regular, PingFang SC;
}

.apiotCountdown__splitor {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  line-height: $countdown-height;
  padding: 5rpx;
}

.apiotCountdown__number {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  justify-content: center;
  align-items: center;
  height: $countdown-height;
  line-height: $countdown-height;
  margin: 5rpx 0;
  text-align: center;
}
</style>
