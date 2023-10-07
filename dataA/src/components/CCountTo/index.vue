<template>
  <div>
    <span
        class="numberItem"
        v-for="(item, i) in displayValue"
        :key="i"
        :style="setNumberItemStyles(item)"
    >{{ item }}</span>
  </div>
</template>
<script>
import {requestAnimationFrame, cancelAnimationFrame} from '@/utils/requestAnimationFrame.js'

export default {
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    startVal: {
      type: Number,
      required: false,
      default: 0
    },
    endVal: {
      type: Number,
      required: false,
      default: 0
    },
    duration: {
      type: Number,
      required: false,
      default: 1000
    },
    autoplay: {
      type: Boolean,
      required: false,
      default: true
    },
    decimals: {
      type: Number,
      required: false,
      default: 0,
      validator(value) {
        return value >= 0
      }
    },
    decimal: {
      type: String,
      required: false,
      default: '.'
    },
    separator: {
      type: String,
      required: false,
      default: ''
    },
    useEasing: {
      type: Boolean,
      required: false,
      default: true
    },
    easingFn: {
      type: Function,
      default(t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b;
      }
    }
  },
  data() {
    return {
      localStartVal: this.startVal,
      displayValue: this.formatNumber(this.startVal),
      printVal: null,
      paused: false,
      localDuration: this.duration,
      startTime: null,
      timestamp: null,
      remaining: null,
      rAF: null
    };
  },
  computed: {
    setNumberItemStyles() {
      return function (item) {
        const {
          distance = 0,
          enableBackgroundImage = false,
          bgUrl = '',
          contentWidth = 40,
          contentHeight = 48
        } = this.config;
        if (isNaN(item)) {
          return {};
        }
        if (!enableBackgroundImage) {
          return {
            margin: `0 ${distance}px`
          }
        }

        return {
          background: `url(${bgUrl}) no-repeat center`,
          backgroundSize: '100% 100%',
          margin: `0 ${distance}px`,
          width: `${contentWidth}px`,
          height: `${contentHeight}px`,
          lineHeight: `${contentHeight}px`
        }
      }
    },
    countDown() {
      return this.startVal > this.endVal
    }
  },
  watch: {
    separator() {
      this.start();
    },
    startVal() {
      if (this.autoplay) {
        this.start();
      }
    },
    endVal() {
      if (this.autoplay) {
        this.start();
      }
    }
  },
  mounted() {
    if (this.autoplay) {
      this.start();
    }
    this.$emit('mountedCallback')
  },
  methods: {
    start() {
      this.localStartVal = this.startVal;
      this.startTime = null;
      this.localDuration = this.duration;
      this.paused = false;
      this.rAF = requestAnimationFrame(this.count);
    },
    count(timestamp) {
      if (!this.startTime) this.startTime = timestamp;
      this.timestamp = timestamp;
      const progress = timestamp - this.startTime;
      this.remaining = this.localDuration - progress;

      if (this.useEasing) {
        if (this.countDown) {
          this.printVal = this.localStartVal - this.easingFn(progress, 0, this.localStartVal - this.endVal, this.localDuration)
        } else {
          this.printVal = this.easingFn(progress, this.localStartVal, this.endVal - this.localStartVal, this.localDuration);
        }
      } else {
        if (this.countDown) {
          this.printVal = this.localStartVal - ((this.localStartVal - this.endVal) * (progress / this.localDuration));
        } else {
          this.printVal = this.localStartVal + (this.endVal - this.localStartVal) * (progress / this.localDuration);
        }
      }
      if (this.countDown) {
        this.printVal = this.printVal < this.endVal ? this.endVal : this.printVal;
      } else {
        this.printVal = this.printVal > this.endVal ? this.endVal : this.printVal;
      }

      this.displayValue = this.formatNumber(this.printVal)
      if (progress < this.localDuration) {
        this.rAF = requestAnimationFrame(this.count);
      } else {
        this.$emit('callback');
      }
    },
    isNumber(val) {
      return !isNaN(parseFloat(val))
    },
    formatNumber(num) {
      num = num.toFixed(this.decimals);
      num += '';
      const x = num.split('.');
      let x1 = x[0];
      const x2 = x.length > 1 ? this.decimal + x[1] : '';
      const rgx = /(\d+)(\d{3})/;
      if (this.separator && !this.isNumber(this.separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + this.separator + '$2');
        }
      }
      return x1 + x2;
    }
  },
  destroyed() {
    cancelAnimationFrame(this.rAF)
  }
};
</script>
<style lang='scss' scoped>
.numberItem {
  display: inline-block;
  text-align: center;
}
</style>
