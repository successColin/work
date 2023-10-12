/**
* @name: longTime
* @author: DELL
* @date: 2023/8/31 9:53
* @description：longTime
* @update: 2023/8/31 9:53
*/
<!-- 页面 -->
<template>
  <div class="time headCommon">{{ longTime }}</div>
</template>

<script>
import { getSeconds } from '_u/utils';

export default {
  data() {
    return {
      dateNow: 0,
      longTime: 0,
      timer: null
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.dateNow = Date.parse(new Date());
    this.startTime();
  },

  methods: {
    startTime() {
      const that = this;
      this.timer = requestAnimationFrame(function fn() {
        const diff = (Date.parse(new Date()) - that.dateNow) / 1000;
        that.timer = requestAnimationFrame(fn);
        that.longTime = getSeconds(diff);
      });
    },
  },
  beforeDestroy() {
    cancelAnimationFrame(this.timer);
    this.timer = null;
    this.dateNow = 0;
    this.longTime = 0;
  },
  name: 'longTime',
};
</script>

<style lang='scss' scoped>
.headCommon {
  height: 30px;
  padding: 0 13px;
  background: #FFFFFF;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  border: 1px solid #E9E9E9;
  box-sizing: border-box;
}

.time {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}
</style>
