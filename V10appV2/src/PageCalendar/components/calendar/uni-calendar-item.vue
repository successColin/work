<template>
  <view class="calendar-items" :class="{pointStyle: signStyle === 2, colorStyle: signStyle === 1}">
    <block v-for="(weeks, week) in canlender.weeks" :key="week">
      <view class="uni-calender__body-date-week calendar-items-week" :class="[themeClass_]">
        <block v-for="(day, index) in weeks" :key="index">
          <view class="item" :class="{
            'disable': canlender.month !== day.month || day.disable,
            'active': !day.isDay,
            'current':
            ((day.date == canlender.date && !day.checked) || day.multipleBegin ||
              day.multipleEnd) && canlender.month == day.month && !day.disable,
            'uni-calender__lunar': lunar,
            'uni-calender__is-day': day.isDay,
            'uni-calender__multiple': day.multipleBegin || day.multipleEnd,
            'uni-calender__multiple-box': day.checked,
'unfinish': statusClass(day) === 'unfinish',
'finish': statusClass(day) === 'finish',
'unstart': statusClass(day) === 'unstart',
'nobusiness': statusClass(day) === 'nobusiness'
          }" @tap="selectDays(week, index, canlender.month ===
            day.month, day.disable, canlender.lunar)">
            <view class="hasData" v-if="isHasData(day)"
              style="bottom: 0px;width: 6px;height: 6px;margin-left: -2.5px;z-index: 0" />
            <view class="circle-box">
              {{ day.date || '' }}
              <view v-if="day.have && !lunar" class="uni-calender__lunar">
              {{ day.clockinfo.info }}</view>
            </view>
            <view v-if="lunar" class="uni-calender__lunar">{{ day.lunar }}</view>
          </view>
        </block>
      </view>
    </block>
  </view>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
export default {
  name: 'apiotCalendarItem',
  props: {
    /**
     * 当前日期
     */
    canlender: {
      type: null,
      default: () => ({})
    },
    lunar: {
      type: Boolean,
      default: false
    },
    calendarData:Array,
    calendartype:String,
    signStyle: {
      type: Number,
      default: 1,
    },
    businessData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {}
  },
  computed:{
    ...mapState(["themeColor"]),
    themeClass_(){//与主题she检修关联
      const mainColor = ["mainColor","whiteColor"]
      return this.themeColor !=='red' ? ("mainColor-" + this.themeColor) : 'mainColor'
    },
  },
  created() {
		console.log(this.canlender.weeks);
	},
  methods: {
    isHasData(canlender){
      const calendarData = this.calendarData
      let flag = false
      for(let i = 0,len=calendarData.length;i<len;i++){
        const item = calendarData[i]
        if(item.year === canlender.year && item.month === canlender.month && item.date === canlender.date){
          flag = true
          break
        }
      }
      return flag
    },
    selectDays(week, index, ischeck, isDay, lunar) {
      if(this.calendartype === 'day') ischeck = true 
      this.$emit('selectDays', {
        week,
        index,
        ischeck,
        isDay,
        lunar
      })
    },
		statusClass(day){
			let classname = '';
			let finishNum = 0;
			let unfinishNum = 0;
			let unstart = 0;
			const month = day.month < 10 ? `0${day.month}` : day.month;
			const daydate = day.date < 10 ? `0${day.date}` : day.date;
			const date = `${day.year}-${month}-${daydate}`;
			this.businessData.map((item) => {
				const arr = item.calendarInfoList.filter(obj => obj.date === date);
				if (arr.length > 0 && arr[0].unfinishedAccount == 0 && arr[0].finishedAccount > 0) {
					finishNum++;
				}
				if (arr.length > 0 && arr[0].unfinishedAccount > 0 && arr[0].finishedAccount > 0) {
					unfinishNum++;
				}
				if (arr.length > 0 && arr[0].unfinishedAccount > 0 && arr[0].finishedAccount === 0) {
					unstart++;
				}
			})
			if (unfinishNum > 0) {
				classname = 'unfinish';
			} else if (unstart > 0 && unfinishNum === 0 && finishNum === 0) {
				classname = 'unstart';
			} else if (finishNum > 0) {
				classname = 'finish';
			} else {
				classname = 'nobusiness';
			}
			return classname;
		}
  }
}
</script>

<style lang='scss' scoped>
	@charset "UTF-8";
	::v-deep{
		.uni-calender__body-date-week:last-child {
			border: none
		}

		.uni-calender__body-date-week .uni-calender__date {
			position: relative;
			width: 100%;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #000;
			background: #fff;
			box-sizing: border-box;
			padding: 10upx 0;
			line-height: 1.5;
			z-index: 2
		}

		.uni-calender__body-date-week .uni-calender__date .uni-calender__lunar {
			font-size: 20upx;
			color: #000;
			line-height: 1.2
		}

		.uni-calender__body-date-week .uni-calender__date .uni-calender__circle-box {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width: 80upx;
			height: 80upx;
			flex-shrink: 0;
			border-radius: 10upx;
			line-height: 1.2
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__disable {
			color: #f1f1f1
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__disable .uni-calender__lunar {
			color: #f1f1f1
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__is-day {
			color: #4689F5
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__is-day .uni-calender__lunar {
			color: #4689F5
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__date-current {
			color: #fff;
			box-sizing: border-box
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__date-current .uni-calender__circle-box {
			background: #fd2e32
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__date-current.uni-calender__active {
			color: #fff
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__date-current.uni-calender__active .uni-calender__circle-box {
			background: #000
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__date-current.uni-calender__multiple .uni-calender__circle-box {
			border-radius: 50%;
			background: #fd2e32
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__date-current .uni-calender__lunar {
			color: #fff
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__multiple-box {
			color: #fff
		}

		.uni-calender__body-date-week .uni-calender__date.uni-calender__multiple-box .uni-calender__lunar {
			color: #fff
		}

		.uni-calender_check-bg {
			position: absolute;
			top: 10upx;
			bottom: 10upx;
			left: 0;
			right: 0;
			z-index: -1
		}

		.uni-calender_check-bg.uni-calender_check {
			background: #ffd3d3
		}

		.uni-calender_check-bg.calender_check-begin {
			left: 20upx;
			border-top-left-radius: 100upx;
			border-bottom-left-radius: 100upx
		}

		.uni-calender_check-bg.calender_check-end {
			right: 20upx;
			border-top-right-radius: 100upx;
			border-bottom-right-radius: 100upx
		}
	}
	
</style>