<!--
 * @Author: sss
 * @Date: 2021-05-25 17:11:36
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-25 17:11:36
 * @Desc: None
-->
<template>
  <el-date-picker
    :popper-class="hasNoMoment ? 'hasNoMoment' : ''"
    v-on="$listeners"
    v-bind="$attrs"
    :picker-options="pickerOptions"
  >
  </el-date-picker>
</template>

<script>
export default {
  components: {},

  props: {
    hasNoMoment: {
      type: Boolean,
      defalut: false
    },
    // 限制类型:timeToDay-今天之前（包括今天）;dayToTime-今天之后（包括今天）
    limitType: {
      type: String,
      defalut: ''
    },
    pickerOption: {
      type: Object,
      defalut() {
        return {};
      }
    }
  },

  data() {
    return {};
  },

  computed: {
    pickerOptions() {
      const options = { ...this.pickerOption };
      if (this.limitType === 'timeToDay') {
        options.shortcuts = [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ];
        options.disabledDate = function(time) {
          return time.getTime() > Date.now() - 8.64e6;
        };
      } else if (this.limitType === 'dayToTime') {
        options.shortcuts = [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ];
        options.disabledDate = function(time) {
          return time.getTime() < Date.now() - 8.64e7;
        };
      }

      return options;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
</style>
