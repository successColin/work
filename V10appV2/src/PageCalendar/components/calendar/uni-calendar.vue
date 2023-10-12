<template>
  <view class="calendar-main">
    <view
      v-if="maskShow && !insert"
      :class="{ 'ani-mask-show': aniMaskShow }"
      class="uni-calendar__mask"
    />
    <view
      v-if="maskShow || insert"
      :class="{
        'ani-calendar-show': aniMaskShow,
        'uni-calendar__static': insert,
      }"
      class="uni-calendar__box"
    >
      <view v-if="!insert" class="uni-calendar__nav">
        <view class="uni-calendar__nav-item" @click="close">{{
          $t('basic-cancel')
        }}</view>
        <view class="uni-calendar__nav-item" @click="confirm">{{
          $t('basic-confirm')
        }}</view>
      </view>
      <view class="uni-calendar__wrapper">
        <view class="uni-calenda__content">
          <view class="panel-header">
            <view class="panel-header-content">
              <view class="panel-header-befor" @tap="dataBefor('prev')">
                <view class="panel-header-befor-btn prev highlight"></view>
              </view>
              <view class="panel-header-title">{{
                canlender.year +
                ' / ' +
                canlender.month
              }}</view>
              <view class="panel-header-after" @tap="dataBefor('after')">
                <view class="panel-header-befor-btn after" :class="highlight"></view>
              </view>
            </view>
          </view>
          <!-- <view v-if="isLunar" class="uni-calendar__day-detail">
            <view>{{
              canlender.year +
              $t('calendar.lang-year') +
              canlender.month +
              $t('calendar.time-month') +
              canlender.date +
              $t('calendar.time-date') +
              '（' +
              canlender.lunar.astro +
              ')'
            }}</view>
            <view>
              {{
                canlender.lunar.gzYear +
                $t('calendar.lang-year') +
                canlender.lunar.gzMonth +
                $t('calendar.time-month') +
                canlender.lunar.gzDay +
                $t('calendar.time-date') +
                ' (' +
                canlender.lunar.Animal +
                $t('calendar.lang-year') +
                ')'
              }}
              {{ canlender.lunar.IMonthCn + canlender.lunar.IDayCn }}
              {{ canlender.lunar.isTerm ? canlender.lunar.Term : '' }}
            </view>
          </view> -->
          <view class="calendar-header">
            <view class="item">{{ $t('calendar.timeweeksun') }}</view>
            <!-- 中文：日 -->
            <view class="item">{{ $t('calendar.timeweekmon') }}</view>
            <!-- 中文：一 -->
            <view class="item">{{ $t('calendar.timeweektue') }}</view>
            <!-- 中文：二 -->
            <view class="item">{{ $t('calendar.timeweekwed') }}</view>
            <!-- 中文：三 -->
            <view class="item">{{ $t('calendar.timeweekthu') }}</view>
            <!-- 中文：四 -->
            <view class="item">{{ $t('calendar.timeweekfri') }}</view>
            <!-- 中文：五 -->
            <view class="item">{{ $t('calendar.timeweeksat') }}</view>
            <!-- 中文：六 -->
          </view>
          <view class="calendar-content">
            <apiotCalendarItem
              :calendarData="calendarData"
              :calendartype="calendartype"
              :canlender="canlender"
              :lunar="isLunar"
              :signStyle="signStyle"
              :businessData="businessData"
              @selectDays="selectDays"
            ></apiotCalendarItem>
          </view>
          <view class="calendar-foot">
            <view class="switch" @click="hangdleChangeType"></view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
/* eslint-disable */
import CALENDAR from './calendar.js';
import apiotCalendarItem from './uni-calendar-item';
// import { homeApi } from '@/common/request/api.js';

export default {
  name: 'apiotCalendar',
  components: {
    apiotCalendarItem,
  },
  props: {
    signStyle: {
      type: Number,
      default: 1,
    },
    /**
     * 当前日期
     */
    date: {
      type: String,
      default: '',
    },
    /**
     * 打点日期
     */
    selected: {
      type: Array,
      default() {
        return [];
      },
    },
    /**
     * 是否开启阴历日期
     */
    lunar: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否禁用今天之前的日期
     */
    disableBefore: {
      type: Boolean,
      default: false,
    },
    /**
     * 开始时间
     */
    startDate: {
      type: String,
      default: '',
    },
    /**
     * 结束时间
     */
    endDate: {
      type: String,
      default: '',
    },
    /**
     * 范围
     */
    range: {
      type: Boolean,
      default: false,
    },
    /**
     * 插入
     */
    insert: {
      type: Boolean,
      default: false,
    },
    /**
     * 类型
     */
    showType: {
      type: String,
      default: 'month',
    },
    /**
     * 是否显示左右切换
     */
    isVisiabled: {
      type: Boolean,
      default: true,
    },
    otherParams: {
      type: Object,
      default() {
        return {};
      },
    },
    businessData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    /**
     * TODO 兼容新旧编译器
     * 新编译器（自定义组件模式）下必须使用固定数值，否则部分平台下会获取不到节点。
     * 随机数值是在旧编译器下使用的，旧编译器模式已经不推荐使用，后续直接废掉随机数值的写法。
     */
    return {
      changeTypeIcon: 'iconqiehuanzhou',
      calendartype: this.showType,
      maskShow: false, // 显示日历
      aniMaskShow: false,
      dateShow: false, // 日期是否选择
      canlender: {
        weeks: [],
      },
      multiple: 0,
      multipleDates: {
        begin: '',
        end: '',
        data: [],
      },
      isLunar: true,
      calendarData: [],
    };
  },
  watch: {
    calendartype() {
      this.init();
    },
    date() {
      this.init();
    },
    selected() {
      this.init();
    },
    lunar(newVal) {
      this.isLunar = newVal;
      this.init();
    },
    disableBefore() {
      this.init();
    },
    startDate() {
      this.init();
    },
    endDate() {
      this.init();
    },
  },
  created() {
    this.init();
  },
  computed: {
    highlight() {
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      if (year > this.canlender.year || (year === this.canlender.year && month > this.canlender.month - 1)) {
        return 'highlight'
      } else {
        return ''
      }
    }
  },
  methods: {
    init() {
      // 初始化日历
      this.getMonthAll(0, this.date, 'init');
    },
    formatDate: function (date, fmt) {
		if(date){
			date = typeof date === 'string' ? date.replace(/-/g, '/') : date;
			date = new Date(date)
		} 
		else date = new Date()
		
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        let o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
			'MS+': date.getMilliseconds(),
        }
        for (let k in o) {
            if (new RegExp(`(${k})`).test(fmt)) {
                let str = o[k] + ''
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : this.padLeftZero(str))
            }
        }
        return fmt
    },
    padLeftZero: function (str) {
        return ('00' + str).substr(str.length)
    },
    getCalendarData(param) {
      const canlender = this.canlender;
      let fulldate =
        canlender.year + '-' + canlender.month + '-' + canlender.date;
      let selectDate = this.formatDate(
        fulldate,
        'yyyy-MM-dd hh:mm:ss'
      );
      let basicParams = {
        dateType: 1,
        selectDate: selectDate,
      };
      if (this.calendartype === 'day') {
        basicParams.dateType = 2;
      }
      basicParams = { ...basicParams, ...this.otherParams, ...param };
      const _this = this;
      _this.calendarData = [];
      // homeApi.calendarGetData(this, basicParams).then((value) => {
      //   _this.calendarData = value;
      // });
    },
    hangdleChangeType() {
      if (this.calendartype === 'month') {
        this.calendartype = 'day';
        this.changeTypeIcon = 'iconqiehuanzhou';
      } else {
        this.calendartype = 'month';
        this.changeTypeIcon = 'iconqiehuanyue';
      }
      this.$emit('changeType', this.calendartype);
    },
    open() {
      this.maskShow = true;
      this.multiple = 0;
      this.multipleDates.data = [];
      this.multipleDates.begin = '';
      this.multipleDates.end = '';
      this.init();
      this.$nextTick(() => {
        setTimeout(() => (this.aniMaskShow = true), 30);
      });
    },
    close() {
      this.aniMaskShow = false;
      this.$nextTick(() => {
        setTimeout(() => (this.maskShow = false), 300);
      });
    },
    confirm() {
      this.setEmit('confirm');
      this.close();
    },
    /**
     * 获取当前月份全部日期
     */
    getMonthAll(index, date, type) {
      if (date === '') {
        date = new Date();
      }
      const canlender = this.getWeek(
        this.getDate(date, index, this.calendartype)
      );
      if (type !== 'init') {
        this.$emit('dateChange', canlender, type)
      }
      this.canlender = canlender;
      console.log(canlender, 'index');
      if (this.insert) {
        this.setEmit('change', type);
      }
    },
    /**
     * 设置事件
     * @param {Object} canlender
     */
    setEmit(name, type) {
      const canlender = this.canlender;
      this.$emit(name, {
        type: type,
        range: this.range ? this.multipleDates : {},
        year: canlender.year,
        month: canlender.month,
        date: canlender.date,
        lunar: canlender.lunar,
        clockinfo: canlender.clockinfo || {},
        fulldate:
          canlender.year +
          '-' +
          (canlender.month > 9 ? canlender.month : `0${canlender.month}`) +
          '-' +
          (canlender.date > 9 ? canlender.date : `0${canlender.date}`),
      });
      if (type !== 'selectDays') {
        //如果只是选择日期不用重新查找count
        this.getCalendarData();
      }
    },
    /**
     * 今天之前是否禁用
     * @param {Object} year 年
     * @param {Object} month 月
     * @param {Object} date 日
     */
    isDisableBefore(year, month, date) {
      const nowDate = this.date || new Date();
      const time = year + '-' + month + '-' + date;
      let startDate = false;
      let endDate = false;
      if (this.startDate) {
        startDate = this.dateCompare(this.startDate, time);
      }
      if (this.endDate) {
        endDate = this.dateCompare(this.getDate(this.endDate, 1), time);
      }

      if (this.disableBefore) {
        if (!this.startDate) {
          if (!this.endDate) {
            return !this.dateCompare(this.getDate(nowDate, 0), time);
          } else {
            return !this.dateCompare(this.getDate(nowDate, 0), time) || endDate;
          }
        } else {
          return (
            !this.dateCompare(this.getDate(nowDate, 0), time) ||
            !startDate ||
            endDate
          );
        }
      } else {
        if (!this.startDate) {
          if (!this.endDate) {
            return false;
          } else {
            return endDate;
          }
        } else {
          return !startDate || endDate;
        }
      }
    },
    /**
     * 返回今天
     */
    backtoday() {
      this.getMonthAll(0, this.date);
    },
    /**
     * 切换前一月 || 后一月
     * @param {Object} id
     * @param {Object} types
     */
    dataBefor(type) {
      const year =
        this.canlender.year +
        '-' +
        this.canlender.month +
        '-' +
        this.canlender.date;
      let index = 1;
      if (this.calendartype === 'day') index = 7;
      if (type === 'prev') index = -index;
      this.getMonthAll(index, year, 'change');
    },
    /**
     * 选择当前的日期
     * week 当前的周
     * index 点击的下标索引
     * ischeck 是否选中
     */
    selectDays(params) {
      const { week, index, ischeck, isDay } = params;
      if (!ischeck) return;
      if (isDay) return;
      // 多选判断

      const canlender = this.canlender;
      const month =
        canlender.weeks[week][index].month < 10
          ? '0' + canlender.weeks[week][index].month
          : canlender.weeks[week][index].month;
      const date =
        canlender.weeks[week][index].date < 10
          ? '0' + canlender.weeks[week][index].date
          : canlender.weeks[week][index].date;
      const time = canlender.weeks[week][index].year + '-' + month + '-' + date;
      this.isClick = true;
      // this.multiple = this.multiple === 0 ? 1 : 0;

      if (this.multiple === 0) {
        this.multipleDates.begin = time;
        this.multiple = 1;
      } else if (this.multiple === 1) {
        this.multiple = 2;
        if (this.multipleDates.data) {
          this.multipleDates.data = [];
        }
        const compare = this.dateCompare(this.multipleDates.begin, time);
        if (compare) {
          this.multipleDates.data = this.geDateAll(
            this.multipleDates.begin,
            time
          );
          this.multipleDates.end = time;
        } else {
          this.multipleDates.data = this.geDateAll(
            time,
            this.multipleDates.begin
          );
          this.multipleDates.end = this.multipleDates.begin;
          this.multipleDates.begin = time;
        }
      } else {
        this.multiple = 0;
        this.multipleDates.data = [];
        this.multipleDates.begin = '';
        this.multipleDates.end = '';
      }
      this.getMonthAll(0, time, 'selectDays');
    },
    // 获取日历内容
    getWeek(dateData) {
      // 判断当前是 安卓还是ios ，传入不容的日期格式
      if (typeof dateData !== 'object') {
        dateData = dateData.replace(/-/g, '/');
      }
      const selected = this.selected;
      const nowDate = this.getDate(this.date || new Date());
      const { year, month, date, day, week } = this.getNewDate(dateData);
      let canlender = [];
      let dates = {
        firstDay: new Date(year, month - 1, 1).getDay(),
        lastMonthDays: [], // 上个月末尾几天
        currentMonthDys: [], // 本月天数
        nextMonthDays: [], // 下个月开始几天
        endDay: new Date(year, month, 0).getDay(),
        weeks: [],
      };
      let weekdays = [0, 1, 2, 3, 4, 5, 6];
      // 循环上个月末尾几天添加到数组
      for (let i = dates.firstDay; i > 0; i--) {
        let pevyear = year,
          pevM = month - 1;
        if (month === 1) {
          pevM = 12;
          pevyear = pevyear - 1;
        }
        const beforeDate = new Date(pevyear, pevM, -i + 1).getDate();
        const date = new Date(pevyear, pevM - 1, beforeDate).getDay();
        dates.lastMonthDays.push({
          year: pevyear,
          date: beforeDate,
          weekday: weekdays[date],
          month: pevM,
          disable: this.isDisableBefore(pevyear, pevM, beforeDate),
          lunar: this.getlunar(pevyear, pevM, beforeDate),
          isDay: false,
        });
      }
      let clockinfo = {
        have: false,
      };
      // 循环本月天数添加到数组
      for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
        let have = false;
        let clockinfoTemp = {};
        // 处理打卡信息
        for (let j = 0; j < selected.length; j++) {
          const selDate = selected[j].date.split('-');

          if (
            Number(year) === Number(selDate[0]) &&
            Number(month) === Number(selDate[1]) &&
            Number(i) === Number(selDate[2])
          ) {
            have = true;
            clockinfoTemp.have = true;
            clockinfoTemp.date = selected[j].date;
            if (selected[j].info) {
              clockinfoTemp.info = selected[j].info;
            }
            if (
              JSON.stringify(selected[j].data) === '{}' ||
              selected[j].data !== undefined
            ) {
              clockinfoTemp.data = selected[j].data;
            }
            if (
              Number(year) === Number(selDate[0]) &&
              Number(month) === Number(selDate[1]) &&
              Number(date) === Number(selDate[2])
            ) {
              clockinfo = clockinfoTemp;
            }
          }
        }
        // 多选
        const { begin, end, data } = this.multipleDates;
        const [bYear, bMonth, bDate] = begin.split('-');
        const [eYear, eMonth, eDate] = end.split('-');
        let checked = false;
        let multipleBegin = false;
        let multipleEnd = false;
        data.forEach((item, index) => {
          const [mYear, mMonth, mDate] = item.split('-');
          if (
            year === Number(mYear) &&
            month === Number(mMonth) &&
            i === Number(mDate)
          ) {
            checked = true;
          }
        });
        // 开始日期
        if (
          year === Number(bYear) &&
          month === Number(bMonth) &&
          i === Number(bDate)
        ) {
          multipleBegin = true;
        }

        // 结束日期
        if (
          year === Number(eYear) &&
          month === Number(eMonth) &&
          i === Number(eDate)
        ) {
          multipleEnd = true;
        }

        const date = new Date(year, month - 1, i).getDay();

        dates.currentMonthDys.push({
          checked: this.range ? checked : false,
          multipleBegin: this.range ? multipleBegin : false,
          multipleEnd: this.range ? multipleEnd : false,
          year: year,
          date: i,
          month: month,
          weekday: weekdays[date],
          have,
          clockinfo: clockinfoTemp,
          disable: this.isDisableBefore(year, month, i + ''),
          lunar: this.getlunar(year, month, i + ''),
          isDay:
            nowDate ===
            year +
              '-' +
              (month < 10 ? '0' + month : month) +
              '-' +
              (i < 10 ? '0' + i : i),
        });
      }
      const surplus =
        42 - (dates.lastMonthDays.length + dates.currentMonthDys.length);
      // 循环下个月开始几天 添加到数组
      for (let i = 1; i < surplus + 1; i++) {
        let nextyear = year,
          nextM = month;
        if (month === 12) {
          nextM = 0;
          nextyear = nextyear + 1;
        }
        const date = new Date(nextyear, nextM, i).getDay(),
          isDay = false;
        dates.nextMonthDays.push({
          date: i,
          year: nextyear,
          weekday: weekdays[date],
          month: nextM + 1,
          disable: this.isDisableBefore(nextyear, nextM + 1, i + ''),
          lunar: this.getlunar(nextyear, nextM + 1, i + ''),
          isDay: isDay,
        });
      }

      canlender = canlender.concat(
        dates.lastMonthDays,
        dates.currentMonthDys,
        dates.nextMonthDays
      );
      // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
      let totalDay = 0;
      for (let i = 0; i < canlender.length; i++) {
        if (this.calendartype == 'day') {
          //周
          let date = canlender[i].date,
            month = canlender[i].month;

          const w = this.getMonthWeek(
            canlender[i].year,
            canlender[i].month,
            date
          );
          if (!dates.weeks[week]) {
            dates.weeks[week] = new Array({}, {}, {}, {}, {}, {}, {});
          }
          if (canlender[i].year === year && w !== week) continue;
          else if (canlender[i].year > year && w !== 1) continue;
          else if (canlender[i].year < year && week !== 1) continue;

          if (totalDay === 7) break;
          totalDay++;
          dates.weeks[week][canlender[i].weekday] = canlender[i];
        } else {
          //月
          if (i % 7 === 0) {
            dates.weeks[parseInt(i / 7)] = new Array(7);
          }
          dates.weeks[parseInt(i / 7)][i % 7] = canlender[i];
        }
      }
      return {
        week: week,
        weeks: dates.weeks,
        month: month,
        date: date,
        day: day,
        year: year,
        clockinfo,
        lunar: CALENDAR.solar2lunar(year, month, date),
        lastDate: dates.currentMonthDys[dates.currentMonthDys.length - 1].date,
      };
    },
    /**
     * 计算阴历日期显示
     */
    getlunar(year, month, date) {
      return CALENDAR.solar2lunar(year, month, date).IDayCn;
    },
    //判断当前日期为当月第几周
    isLeapYear(year) {
      return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
    },
    getMonthDays(year, month) {
      return (
        [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] ||
        (this.isLeapYear(year) ? 29 : 28)
      );
    },
    getMonthWeek(y, m, d) {
      var now = new Date(y, m - 1, d),
        year = now.getFullYear(),
        month = now.getMonth(),
        days = now.getDate();
      //那一天是那一年中的第多少天
      for (var i = 0; i < month; i++) {
        days += this.getMonthDays(year, i);
      }

      //那一年第一天是星期几
      var yearFirstDay = new Date(year, 0, 1).getDay() || 7;

      var week = null;
      if (yearFirstDay == 1) {
        week = Math.ceil(days / yearFirstDay);
      } else {
        days -= 7 - yearFirstDay;
        week = Math.ceil(days / 7) + 1;
      }

      return week;
    },
    /**
     * 获取日期
     * @param {Object} dateData
     */
    getNewDate(dateData) {
      const _date = new Date(dateData),
        year = _date.getFullYear(),
        month = _date.getMonth() + 1,
        date = _date.getDate();
      let week = this.getMonthWeek(year, month, date);
      return {
        year: _date.getFullYear(), // 年
        month: _date.getMonth() + 1, // 月
        date: _date.getDate(), // 日
        day: _date.getDay(), // 天
        week: week, //第几周
      };
    },
    /**
     * 获取任意时间
     */
    getDate(date, AddDayCount = 0, str = 'day') {
      if (typeof date !== 'object') {
        date = date.replace(/-/g, '/');
      }
      const dd = new Date(date);
      switch (str) {
        case 'day':
          dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
          break;
        case 'month':
          dd.setMonth(dd.getMonth() + AddDayCount); // 获取AddDayCount天后的日期
          break;
        case 'year':
          dd.setFullYear(dd.getFullYear() + AddDayCount); // 获取AddDayCount天后的日期
          break;
      }
      const y = dd.getFullYear();
      const m =
        dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
      const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
      return y + '-' + m + '-' + d;
    },
    /**
     * 比较时间大小
     */
    dateCompare(startDate, endDate) {
      // 计算截止时间
      startDate = new Date(startDate.replace('-', '/').replace('-', '/'));
      // 计算详细项的截止时间
      endDate = new Date(endDate.replace('-', '/').replace('-', '/'));
      if (startDate <= endDate) {
        return true;
      } else {
        return false;
      }
    },
    geDateAll(begin, end) {
      var arr = [];
      var ab = begin.split('-');
      var ae = end.split('-');
      var db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
      var de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      var unixDb = db.getTime() - 24 * 60 * 60 * 1000;
      var unixDe = de.getTime() - 24 * 60 * 60 * 1000;
      for (var k = unixDb; k <= unixDe; ) {
        k = k + 24 * 60 * 60 * 1000;
        arr.push(this.getDate(new Date(parseInt(k))));
      }
      return arr;
    },
  },
};
</script>

<style lang='scss' scoped>
$main-radius: 12rpx !default;
$calendar-Item-Height: 80rpx !default;
$main-color: #4689F5 !default;
$index-Header-Height: 220 !default;
$has-big-btn: 158rpx !default; //98+60
.calendar-main{
	width:100%;
	.calendar-header{
		display: flex;
		font-size:24rpx;
		background:#fff;
		border-top-left-radius:$main-radius;
		border-top-right-radius:$main-radius;
		.item{
			flex: 1;
			height:$calendar-Item-Height;
			text-align: center;
			color:rgba(128,128,128,1);
			line-height:$calendar-Item-Height;
		}
	}
  .calendar-foot{
    height: 20rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-content: center;
    .switch{
      width: 80rpx;
      height: 8rpx;
      background: #E9E9E9;
      border-radius: 5rpx;
    }
  }
	.panel-header{
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		color: rgba(128,128,128,1);
		&-content{
      width: 100%;
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size:36rpx;
		}
    .panel-header-befor-btn{
      width: 0px;
      height: 0px;
      border-top: 16rpx solid #E0E0E0;
      border-right: 10rpx solid transparent;
      border-left: 10rpx solid transparent;
    }
    .prev {
      transform: rotate(90deg);
    }

    .after {
      transform: rotate(-90deg);
    }
    .highlight{
      border-top-color: #4689F5;
    }
    .panel-header-title{
      width: 200rpx;
      text-align: center;
      font-size: 34rpx;
      font-weight: 600;
      color: #333333;
    }
	}
}
.calendar-content{
  ::v-deep{
    .calendar-items{
      background: #fff;
      padding-bottom: 19rpx;
      border-bottom-left-radius:$main-radius;
      border-bottom-right-radius:$main-radius;
      .mainColor-blue{
        .item{
          &.current{
            &::after{
              content: "";
              background:rgba(48,162,255,1);
            }
          }
        }
      }
      .mainColor-navyBlue{//navyBlue
        .item{
          &.current{
            &::after{
              content: "";
              background:rgba(47, 88, 153,1);
            }
          }
        }
      }
      .mainColor-violet{//violet
        .item{
          &.current{
            &::after{
              content: "";
              background:rgba(216, 0, 109,1);
            }
          }
        }
      }
      .mainColor-orange{//orange
        .item{
          &.current{
            &::after{
              content: "";
              background:rgba(248, 156, 51,1);
            }
          }
        }
      }
      
    }
    .calendar-items-week{
      display: flex;
      font-size: 26rpx;
      font-weight: 650;
      background:#fff;
      justify-content: space-around;
      .item{
        position: relative;
        flex: 1;
        height:$calendar-Item-Height;
        text-align: center;
        color:rgba(128,128,128,1);
        line-height:$calendar-Item-Height;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0;
        padding-bottom: 28rpx;
        .circle-box{
          width: 54rpx;
          height: 54rpx;
          line-height: 54rpx;
          border-radius: 50%;
          box-sizing: border-box;
          font-size: 30rpx;
          font-weight: normal;
          color: #333333;
        }
        .uni-calender__lunar{
          font-size: 18rpx;
          font-weight: 400;
          color: #AAAAAA;
          line-height: 30rpx;
        }
        &.disable{
          color:rgba(217,217,217,1);
        }
        &.uni-calender__is-day{
          .circle-box{
            color: #4689F5;
            background:#E5F0FF;
          }
        }
        &.current{
          .circle-box{
            color: #fff;
            background:$main-color;
          }
          
        }
        .hasData {
          position: absolute;
          bottom: 0;
          left: 50%;
          margin-left: -3rpx;
          width: 6rpx;
          height: 6rpx;
          border-radius: 50%;
          background: $main-color;
          z-index: 2
        }
        .active{
          .circle-box{
            color: #333333;
          }
        }
      }
    }
    .pointStyle{
      .calendar-items-week{
        .item{
          .circle-box{
            position: relative;
            box-sizing: border-box;
            // &::before{
            //   content: '';
            //   width: 8rpx;
            //   height: 8rpx;
            //   position: absolute;
            //   left: calc(50% - 4rpx);
            //   top: 4rpx;
            //   background: #EE5E5E;
            //   border-radius: 50%;
            // }
          }
        }
        .unfinish{
          .circle-box{
            &::before{
              content: '';
              width: 8rpx;
              height: 8rpx;
              position: absolute;
              left: calc(50% - 4rpx);
              top: 4rpx;
              background:#EE5E5E;
              border-radius: 50%;
            }
          }
        }
        .finish{
          .circle-box{
            &::before{
              content: '';
              width: 8rpx;
              height: 8rpx;
              position: absolute;
              left: calc(50% - 4rpx);
              top: 4rpx;
              background:#4689F5;
              border-radius: 50%;
            }
          }
        }
        .unstart{
          .circle-box{
            &::before{
              content: '';
              width: 8rpx;
              height: 8rpx;
              position: absolute;
              left: calc(50% - 4rpx);
              top: 4rpx;
              border-radius: 50%;
              background: #BBC3CD;
            }
          }
        }
        .current{
          .circle-box{
            color: #fff;
            background:$main-color;
          }
          
        }
      }
    }
    .colorStyle{
      .calendar-items-week{
        .unfinish{
          .circle-box{
            background:#EE5E5E;
            color: #FFFFFF;
          }
        }
        .unstart{
          .circle-box{
            background: #BBC3CD;
            color: #FFFFFF;
          }
        }
        .finish{
          .circle-box{
            background:#4689F5;
            color: #FFFFFF;
          }
        }
        .current{
          .circle-box{
            color: $main-color;
            background:none;
            border: 1rpx solid $main-color;
          }
          
        }
      }
    }
  }
}

.calendar-page{
	&-header{
		position: absolute;
		left: 0;
		right: 0;
		background-size: cover;
		.header{
			height: $index-Header-Height;
		}
	}
	&-content{
		width: 100%;
		height:100vh;
		padding: 30rpx 30rpx 0 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	&-data{
		flex: 1;
		padding-bottom: $has-big-btn;
		width:100%;
		overflow: hidden;
		&-scroll{
			width: 100%;
			height: 100%;
			margin-top: 20rpx;
		}
		.calendar-page-group{
			margin-bottom: 20rpx;
			background: #fff;
			border-radius:$main-radius;
			.title{
				padding-left: 8rpx;
				height: 75rpx;
				line-height: 75rpx;
				border-bottom: solid 1px #F5F5F5;
				font-size:20rpx;
			}
		}
	}
}
.uni-calendar__mask {
  position: fixed;
  bottom: 0;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  transition: all 0.3s;
  opacity: 0;
  z-index: 9998;
}

.uni-calendar__mask.ani-mask-show {
  opacity: 1;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100rpx;
  background: #fff;
  z-index: 10000;
  font-size: 32rpx;
}

.uni-calendar__box {
  position: fixed;
  bottom: 0;
  z-index: 9999;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s;
  transform: translateY(100%);
}

.uni-calendar__box.ani-calendar-show {
  transform: translateY(0);
}

.uni-calendar__box.uni-calendar__static {
  position: static;
  transform: translateY(0);
}

.uni-calendar__box .uni-calendar__nav {
  display: flex;
  justify-content: space-between;
  height: 100rpx;
  border-bottom: 1px #f5f5f5 solid;
  background: #f5f5f5;
  padding: 0 10rpx;
}

.uni-calendar__box .uni-calendar__nav .uni-calendar__nav-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100rpx;
  height: 100rpx;
  color: #333;
}

.uni-calendar__wrapper {
  width: 100%;
  box-sizing: border-box;
  font-size: 26rpx;
  transition: all 0.3s;
}
.uni-calendar__wrapper
  .uni-calenda__content
  .uni-calendar__panel
  .uni-calendar__backtoday {
  position: absolute;
  right: 0;
  top: 25rpx;
  padding: 0 10rpx;
  padding-left: 20rpx;
  height: 50rpx;
  line-height: 50rpx;
  border: 1px rgba(253, 46, 50, 0.5) solid;
  border-right: none;
  font-size: 24rpx;
  border-top-left-radius: 50rpx;
  border-bottom-left-radius: 50rpx;
  color: rgba(253, 46, 50, 0.7);
  background: rgba(241, 233, 233, 0.4);
}

.uni-calendar__wrapper .uni-calenda__content .uni-calendar__day-detail {
  padding: 20rpx;
  padding-left: 30rpx;
  border-top: 1px #f5f5f5 solid;
}
.uni-calendar__wrapper .uni-calenda__content .uni-calendar__body {
  display: flex;
  flex-wrap: wrap;
  font-size: 28rpx;
}
.panel-header-content :nth-child(2) {
  color: #333333;
}
</style>