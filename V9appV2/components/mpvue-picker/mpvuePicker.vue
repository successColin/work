<template>
  <view class="mpvue-picker">
    <view
      :class="{ pickerMask: showPicker }"
      @click="maskClick"
      catchtouchmove="true"
    ></view>
    <view
      class="mpvue-picker-content"
      :class="{ 'mpvue-picker-view-show': showPicker }"
    >
      <view class="mpvue-picker__hd" catchtouchmove="true">
        <view class="mpvue-picker__action" @click="pickerCancel">{{
          $t('basic-cancel')
        }}</view>
        <view
          class="mpvue-picker__action"
          :style="{ color: themeColor }"
          @click="pickerConfirm"
          >{{ $t('basic-confirm') }}</view
        >
      </view>
      <!-- 单列 -->
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerChange"
        v-if="
          mode === 'selector' && pickerValueSingleArray.length > 0 && showPicker
        "
      >
        <block>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueSingleArray"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
        </block>
      </picker-view>
      <!-- 日期选择器 -->
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerDateChange"
        v-if="mode === 'dateSelector'"
      >
        <block>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueYear"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMonth"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueDay"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
        </block>
      </picker-view>
      <!-- 日期时间选择器 -->
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerChange"
        v-if="mode === 'datetimeSelector'"
      >
        <block>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueYear"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMonth"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueDay"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueHour"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMinute"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueSecond"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
        </block>
      </picker-view>
      <!-- 时间选择器 -->
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerChange"
        v-if="mode === 'timeSelector'"
      >
        <block>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueHour"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMinute"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
        </block>
      </picker-view>
      <!-- 多列选择 -->
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerChange"
        v-if="mode === 'multiSelector'"
      >
        <block v-for="(n, index) in pickerValueMulArray.length" :key="index">
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index1) in pickerValueMulArray[index]"
              :key="index1"
              >{{ item.label }}</view
            >
          </picker-view-column>
        </block>
      </picker-view>
      <!-- 二级联动 -->
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerChangeMul"
        v-if="mode === 'multiLinkageSelector' && deepLength === 2"
      >
        <block>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMulTwoOne"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMulTwoTwo"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
        </block>
      </picker-view>
      <!-- 三级联动 -->
      <picker-view
        indicator-style="height: 40px;"
        class="mpvue-picker-view"
        :value="pickerValue"
        @change="pickerChangeMul"
        v-if="mode === 'multiLinkageSelector' && deepLength === 3"
      >
        <block>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMulThreeOne"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMulThreeTwo"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
          <picker-view-column>
            <view
              class="picker-item"
              v-for="(item, index) in pickerValueMulThreeThree"
              :key="index"
              >{{ item.label }}</view
            >
          </picker-view-column>
        </block>
      </picker-view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import {
  transformDateToIndex,
  getDatePickerIndex,
  getDays,
  fixPickerValueDefault,
} from './utils/index.js';
/* 由于 getMonth 返回 0-11（1月-12月），因此在设置的时候 month-1 */
let MIN_DATE = new Date(1900, 0, 1); // 最小支持日期 1990-01-01
let MAX_DATE = ''; // 最大支持日期 2099-12-31
/* eslint-disable-next-line */
const NOW_DATE = new Date(); // 当前日期
export default {
  data() {
    return {
      pickerChangeValue: [],
      pickerValue: [],
      pickerValueArrayChange: true,
      modeChange: false,
      pickerValueSingleArray: [],
      pickerValueYear: [],
      pickerValueMonth: [],
      pickerValueDay: [],
      pickerValueHour: [],
      pickerValueMinute: [],
      pickerValueSecond: [],
      pickerValueMulArray: [],
      pickerValueMulTwoOne: [],
      pickerValueMulTwoTwo: [],
      pickerValueMulThreeOne: [],
      pickerValueMulThreeTwo: [],
      pickerValueMulThreeThree: [],
      /* 是否显示控件 */
      showPicker: false,
      showPickerT: false,
      nowMonth: '', // 用来监听是否需要重置月份
      nowYear: '',
    };
  },
  props: {
    /* mode */
    mode: {
      type: String,
      default: 'selector',
    },
    /* picker 数值 */
    pickerValueArray: {
      type: Array,
      default() {
        return [];
      },
    },
    /* 默认值 */
    pickerValueDefault: {
      type: [Array, Date],
      default() {
        return [];
      },
    },
    /* 几级联动 */
    deepLength: {
      type: Number,
      default: 2,
    },
    /* 主题色 */
    themeColor: String,
    range: {
      type: Array,
      default() {
        return ['1900/1/1'];
      },
    },
		selectPicker:{
			type:Boolean,
			default: false,
		}
  },
  computed: {
    ...mapState('form', ['mpvuePickerShow']),
  },
  watch: {
    pickerValueArray(oldVal, newVal) {
      this.pickerValueArrayChange = true;
    },
    nowMonth(oldVal, newVal) {
      this.resetMonth();
    },
    nowYear(oldVal, newVla) {
      // 在二月份的时候才重置月份
      if (this.nowMonth == 1) this.resetMonth();
    },
    mode(oldVal, newVal) {
      this.modeChange = true;
    },
    showPicker(newVal, oldVal) {
      if (this.mode === 'selector' && !newVal) this.pickerValue = [0];
      this.SET_FORM_PickerShow(newVal);
      this.SET_ORIGIN(!newVal);
    },
  },
  methods: {
    ...mapMutations(['SET_ORIGIN', 'SET_FORM_PickerShow']),
    initPicker(valueArray) {
      if (this.range.length > 0) MIN_DATE = new Date(this.range[0]);
      if (this.range.length > 1) MAX_DATE = new Date(this.range[1]);
      if (!MAX_DATE) {
        let minYear = MIN_DATE.getFullYear(),
          currentYear = new Date().getFullYear();
        let maxYear = currentYear > minYear ? currentYear + 20 : minYear + 20;

        MAX_DATE = new Date(maxYear, 11, 31);
      }
      try {
        let pickerValueArray = valueArray;
        let initPickerValue = this._initPickerValue();
        setTimeout(() => {
          this.pickerValue = initPickerValue;
        });
        // 初始化选择器
        if (this.mode === 'selector') {
          // 单列选择器
          this.pickerValueSingleArray = valueArray;
        } else if (
          this.mode === 'dateSelector' ||
          this.mode === 'datetimeSelector'
        ) {
          // 日期选择器
          let yearList = [];
          let monthList = [];
          let dayList = [];
          for (
            let i = MIN_DATE.getFullYear();
            i <= MAX_DATE.getFullYear();
            i++
          ) {
            yearList.push({
              label: i,
              value: i,
            });
          }
          for (let i = 0; i < 12; i++) {
            monthList.push({
              label: i > 8 ? `${i + 1}` : `0${i + 1}`,
              value: i + 1,
            });
          }
          let dayLength = getDays(
            MIN_DATE.getFullYear() + initPickerValue[0],
            initPickerValue[1] + 1
          );
          for (let i = 0; i < dayLength; i++) {
            dayList.push({
              label: i > 8 ? `${i + 1}` : `0${i + 1}`,
              value: i + 1,
            });
          }
          this.pickerValueYear = yearList;
          this.pickerValueMonth = monthList;
          this.pickerValueDay = dayList;
          if (this.mode === 'datetimeSelector') {
            // 日期时间选择器
            let hourArray = [];
            let minuteArray = [];
            let secondArray = [];
            for (let i = 0; i < 24; i++) {
              hourArray.push({
                value: i,
                label: i > 9 ? `${i}` : `0${i}`,
              });
            }
            for (let i = 0; i < 60; i++) {
              minuteArray.push({
                value: i,
                label: i > 9 ? `${i}` : `0${i}`,
              });
            }
            for (let i = 0; i < 60; i++) {
              secondArray.push({
                value: i,
                label: i > 9 ? `${i}` : `0${i}`,
              });
            }
            this.pickerValueHour = hourArray;
            this.pickerValueMinute = minuteArray;
            this.pickerValueSecond = secondArray;
          }
        } else if (this.mode === 'timeSelector') {
          // 时间选择器
          this.modeChange = false;
          let hourArray = [];
          let minuteArray = [];
          for (let i = 0; i < 24; i++) {
            hourArray.push({
              value: i,
              label: i > 9 ? `${i}` : `0${i}`,
            });
          }
          for (let i = 0; i < 60; i++) {
            minuteArray.push({
              value: i,
              label: i > 9 ? `${i}` : `0${i}`,
            });
          }
          this.pickerValueHour = hourArray;
          this.pickerValueMinute = minuteArray;
        } else if (this.mode === 'multiSelector') {
          // 多级联动
          this.pickerValueMulArray = valueArray;
        } else if (
          this.mode === 'multiLinkageSelector' &&
          this.deepLength === 2
        ) {
          // 二级联动
          // 两级联动
          let pickerValueMulTwoOne = [];
          let pickerValueMulTwoTwo = [];
          // 第一列
          for (let i = 0, length = pickerValueArray.length; i < length; i++) {
            pickerValueMulTwoOne.push(pickerValueArray[i]);
          }
          // 渲染第二列
          let num = initPickerValue[0];
          for (
            let i = 0, length = pickerValueArray[num].children.length;
            i < length;
            i++
          ) {
            pickerValueMulTwoTwo.push(pickerValueArray[num].children[i]);
          }
          this.pickerValueMulTwoOne = pickerValueMulTwoOne;
          this.pickerValueMulTwoTwo = pickerValueMulTwoTwo;
        } else if (
          this.mode === 'multiLinkageSelector' &&
          this.deepLength === 3
        ) {
          // 三级联动
          let pickerValueMulThreeOne = [];
          let pickerValueMulThreeTwo = [];
          let pickerValueMulThreeThree = [];
          // 第一列
          for (let i = 0, length = pickerValueArray.length; i < length; i++) {
            pickerValueMulThreeOne.push(pickerValueArray[i]);
          }
          // 渲染第二列
          let num = initPickerValue[0];
          for (
            let i = 0, length = pickerValueArray[num].children.length;
            i < length;
            i++
          ) {
            pickerValueMulThreeTwo.push(pickerValueArray[num].children[i]);
          }
          // 第三列
          let numSecond = initPickerValue[1];
          for (
            let i = 0,
              length =
                pickerValueArray[num].children[numSecond].children.length;
            i < length;
            i++
          ) {
            pickerValueMulThreeThree.push(
              pickerValueArray[num].children[numSecond].children[i]
            );
          }
          this.pickerValueMulThreeOne = pickerValueMulThreeOne;
          this.pickerValueMulThreeTwo = pickerValueMulThreeTwo;
          this.pickerValueMulThreeThree = pickerValueMulThreeThree;
        }
      } catch (error) {
        console.error(error);
      }
    },
    show() {
      setTimeout(() => {
        if (this.pickerValueArrayChange || this.modeChange) {
          this.initPicker(this.pickerValueArray);
          this.showPicker = true;
          this.pickerValueArrayChange = false;
          this.modeChange = false;
        } else {
          this.showPicker = true;
        }
      }, 0);
    },
    maskClick() {
      this.pickerCancel();
    },
    pickerCancel() {
      this.showPicker = false;
      this.pickerValueArrayChange = true;
      this.modeChange = true;
      const valueObj = this._getPickerLabelAndValue(
        this.pickerValue,
        this.mode
      );
      let pickObj = {
        index: this.pickerValue,
        value: valueObj.value,
        label: valueObj.label,
      };
      this.$emit('onCancel', pickObj);
    },
    pickerConfirm(e) {
      this.showPicker = false;
      this.pickerValueArrayChange = true;
      this.modeChange = true;
      const valueObj = this._getPickerLabelAndValue(
        this.pickerValue,
        this.mode
      );
      let pickObj = {
        index: this.pickerValue,
        value: valueObj.value,
        label: valueObj.label,
      };
      this.$emit('onConfirm', pickObj);
    },
    showPickerView() {
      this.showPicker = true;
    },
    pickerChange(e) {
      this.pickerValue = e.mp.detail.value;
      this.nowYear = this.pickerValue[0];
      this.nowMonth = this.pickerValue[1];
      const valueObj = this._getPickerLabelAndValue(
        this.pickerValue,
        this.mode
      );
      let pickObj = {
        index: this.pickerValue,
        value: valueObj.value,
        label: valueObj.label,
      };
      this.$emit('onChange', pickObj);
    },
    pickerDateChange(e) {
      let value = e.mp.detail.value;
      if (this.pickerValue[0] !== value[0]) {
        if (value[1] === 1) {
          // only for February
          this.getDaysList(
            this.pickerValueYear[value[0]].value,
            this.pickerValueMonth[value[1]].value,
            value
          );
        } else {
          this.pickerValue = value;
        }
      } else if (this.pickerValue[1] !== value[1]) {
        this.getDaysList(
          this.pickerValueYear[value[0]].value,
          this.pickerValueMonth[value[1]].value,
          value
        );
      } else {
        this.pickerValue = value;
      }
      const valueObj = this._getPickerLabelAndValue(
        this.pickerValue,
        this.mode
      );
      let pickObj = {
        index: this.pickerValue,
        value: valueObj.value,
        label: valueObj.label,
      };
      this.$emit('onChange', pickObj);
    },
    pickerChangeMul(e) {
      if (this.deepLength === 2) {
        let pickerValueArray = this.pickerValueArray;
        let changeValue = e.mp.detail.value;
        // 处理第一列滚动
        if (changeValue[0] !== this.pickerValue[0]) {
          let pickerValueMulTwoTwo = [];
          // 第一列滚动第二列数据更新
          for (
            let i = 0,
              length = pickerValueArray[changeValue[0]].children.length;
            i < length;
            i++
          ) {
            pickerValueMulTwoTwo.push(
              pickerValueArray[changeValue[0]].children[i]
            );
          }
          this.pickerValueMulTwoTwo = pickerValueMulTwoTwo;
          // 第二列初始化为 0
          changeValue[1] = 0;
        }
        this.pickerValue = changeValue;
      } else if (this.deepLength === 3) {
        let pickerValueArray = this.pickerValueArray;
        let changeValue = e.mp.detail.value;
        let pickerValueMulThreeTwo = [];
        let pickerValueMulThreeThree = [];
        // 重新渲染第二列
        // 如果是第一列滚动
        if (changeValue[0] !== this.pickerValue[0]) {
          this.pickerValueMulThreeTwo = [];
          for (
            let i = 0,
              length = pickerValueArray[changeValue[0]].children.length;
            i < length;
            i++
          ) {
            pickerValueMulThreeTwo.push(
              pickerValueArray[changeValue[0]].children[i]
            );
          }
          // 重新渲染第三列
          for (
            let i = 0,
              length =
                pickerValueArray[changeValue[0]].children[0].children.length;
            i < length;
            i++
          ) {
            pickerValueMulThreeThree.push(
              pickerValueArray[changeValue[0]].children[0].children[i]
            );
          }
          changeValue[1] = 0;
          changeValue[2] = 0;
          this.pickerValueMulThreeTwo = pickerValueMulThreeTwo;
          this.pickerValueMulThreeThree = pickerValueMulThreeThree;
        } else if (changeValue[1] !== this.pickerValue[1]) {
          // 第二列滚动
          // 重新渲染第三列
          this.pickerValueMulThreeThree = [];
          pickerValueMulThreeTwo = this.pickerValueMulThreeTwo;
          for (
            let i = 0,
              length =
                pickerValueArray[changeValue[0]].children[changeValue[1]]
                  .children.length;
            i < length;
            i++
          ) {
            pickerValueMulThreeThree.push(
              pickerValueArray[changeValue[0]].children[changeValue[1]]
                .children[i]
            );
          }
          changeValue[2] = 0;
          this.pickerValueMulThreeThree = pickerValueMulThreeThree;
        }
        this.pickerValue = changeValue;
      }
      const valueObj = this._getPickerLabelAndValue(
        this.pickerValue,
        this.mode
      );
      let pickObj = {
        index: this.pickerValue,
        value: valueObj.value,
        label: valueObj.label,
      };
      this.$emit('onChange', pickObj);
    },

    // 获取 pickerLabel
    _getPickerLabelAndValue(value, mode) {
      let pickerLable;
      let pickerGetValue = [];
      // selector
      if (mode === 'selector') {
        pickerLable = this.pickerValueSingleArray[value].label;
        pickerGetValue.push(this.pickerValueSingleArray[value].value);
      } else if (mode === 'dateSelector' || mode === 'datetimeSelector') {
        pickerLable = `${this.pickerValueYear[value[0]].label}-${
          this.pickerValueMonth[value[1]].label
        }-${
          this.pickerValueDay[value[2]]
            ? this.pickerValueDay[value[2]].label
            : this.pickerValueDay[this.pickerValueDay.length - 1].label
        }`;
        pickerGetValue.push(this.pickerValueYear[value[0]].value);
        pickerGetValue.push(this.pickerValueMonth[value[1]].value);
        pickerGetValue.push(
          this.pickerValueDay[value[2]]
            ? this.pickerValueDay[value[2]].value
            : this.pickerValueDay[this.pickerValueDay.length - 1].value
        );
        if (mode === 'datetimeSelector') {
          pickerLable += ` ${this.pickerValueHour[value[3]].label}:${
            this.pickerValueMinute[value[4]].label
          }:${this.pickerValueSecond[value[5]].label}`;
          pickerGetValue.push(this.pickerValueHour[value[3]].value);
          pickerGetValue.push(this.pickerValueMinute[value[4]].value);
          pickerGetValue.push(this.pickerValueSecond[value[5]].value);
        }
      } else if (mode === 'timeSelector') {
        pickerLable = `${this.pickerValueHour[value[0]].label}-${
          this.pickerValueMinute[value[1]].label
        }`;
        pickerGetValue.push(this.pickerValueHour[value[0]].value);
        pickerGetValue.push(this.pickerValueMinute[value[1]].value);
      } else if (mode === 'multiSelector') {
        for (let i = 0; i < value.length; i++) {
          if (i > 0) {
            pickerLable +=
              this.pickerValueMulArray[i][value[i]].label +
              (i === value.length - 1 ? '' : '-');
          } else {
            pickerLable = this.pickerValueMulArray[i][value[i]].label + '-';
          }
          pickerGetValue.push(this.pickerValueMulArray[i][value[i]].value);
        }
      } else if (mode === 'multiLinkageSelector') {
        /* eslint-disable indent */
        pickerLable =
          this.deepLength === 2
            ? `${this.pickerValueMulTwoOne[value[0]].label}-${
                this.pickerValueMulTwoTwo[value[1]].label
              }`
            : `${this.pickerValueMulThreeOne[value[0]].label}-${
                this.pickerValueMulThreeTwo[value[1]].label
              }-${this.pickerValueMulThreeThree[value[2]].label}`;
        if (this.deepLength === 2) {
          pickerGetValue.push(this.pickerValueMulTwoOne[value[0]].value);
          pickerGetValue.push(this.pickerValueMulTwoTwo[value[1]].value);
        } else {
          pickerGetValue.push(this.pickerValueMulThreeOne[value[0]].value);
          pickerGetValue.push(this.pickerValueMulThreeTwo[value[1]].value);
          pickerGetValue.push(this.pickerValueMulThreeThree[value[2]].value);
        }
        /* eslint-enable indent */
      }
      return {
        label: pickerLable,
        value: pickerGetValue,
      };
    },

    // 初始化 pickerValue 默认值
    _initPickerValue() {
      let tempPickerValue;
      if (this.pickerValueDefault.length === 0) {
        if (this.mode === 'selector') {
          tempPickerValue = [0];
        } else if (
          this.mode === 'dateSelector' ||
          this.mode === 'datetimeSelector'
        ) {
          tempPickerValue = transformDateToIndex(new Date(), this.range[0]);
        } else if (this.mode === 'multiSelector') {
          tempPickerValue = new Int8Array(this.pickerValueArray.length);
        } else if (
          (this.mode === 'multiLinkageSelector' && this.deepLength === 2) ||
          this.mode === 'timeSelector'
        ) {
          tempPickerValue = [0, 0];
        } else if (
          this.mode === 'multiLinkageSelector' &&
          this.deepLength === 3
        ) {
          tempPickerValue = [0, 0, 0];
        }
      } else {
        // 单独处理 dateSelector 的初始值
        if (this.mode === 'dateSelector' || this.mode === 'datetimeSelector') {
          tempPickerValue = getDatePickerIndex(
            this.pickerValueDefault,
            this.range[0]
          );
        } else {
          tempPickerValue = this.pickerValueDefault;
        }
      }
      // tempPickerValue 作兼容处理，防止因默认值设置不正确而出现 bug
      tempPickerValue = fixPickerValueDefault(
        tempPickerValue,
        this.mode,
        this.pickerValueArray
      );
      return tempPickerValue;
    },
    getDaysList(year, month, value) {
      let dayLength = getDays(year, month);
      value[2] =
        dayLength < this.pickerValueDay.length &&
        this.pickerValue[2] > dayLength - 1
          ? dayLength - 1
          : this.pickerValue[2];
      if (dayLength !== this.pickerValueDay.length) {
        let dayList = [];
        for (let i = 0; i < dayLength; i++) {
          dayList.push({
            label: i + 1,
            value: i + 1,
          });
        }
        this.pickerValueDay = dayList;
      }
      this.pickerValue = value;
    },
    resetMonth() {
      if (this.mode === 'datetimeSelector' || this.mode === 'dateSelector') {
        const year = this.pickerValue[0] + 1900;
        const month = this.pickerValue[1] + 1;
        const dayLength = getDays(year, month);
        const dayList = [];
        for (let i = 0; i < dayLength; i++) {
          dayList.push({
            label: i > 8 ? `${i + 1}` : `0${i + 1}`,
            value: i + 1,
          });
        }
        this.pickerValueDay = dayList;
      }
    },
  },
};
</script>

<style>
.pickerMask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
  opacity: 0;
}

.mpvue-picker-view-show {
  transform: translateY(0);
  opacity: 1;
}

.mpvue-picker__hd {
  display: flex;
  padding: 9px 15px;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 17px;
}

.mpvue-picker__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}

.mpvue-picker__action {
  display: block;
  flex: 1;
  color: #c62127;
}

.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}

.mpvue-picker__action:last-child {
  text-align: right;
}

.picker-item {
  text-align: center;
  line-height: 40px;
  font-size: 16px;
}

.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 238px;
  background-color: rgba(255, 255, 255, 1);
}
</style>
