<template>
  <view class="routeFilter">
    <m-back-bar>
      <block slot="barTitle">{{ $t('inspection-tallyRoute') }}</block>
      <block slot="barRight"></block>
    </m-back-bar>
    <view class="item">
      <view class="mLabel formElemets left">
        <label class="text" :class="name ? '' : 'drakcolor'"
          >{{ $t('inspection-routeName') }}:</label
        ><!--中文：路线名称-->
        <view class="content">
          <input type="text" v-model="name" class="routename" />
        </view>
      </view>
    </view>

    <m-datePicker
      class="item"
      :element="startdateElement"
      :value="startdate"
      @select="selectData('startdate')"
    >
    </m-datePicker>
    <m-datePicker
      class="item"
      :element="enddateElement"
      :value="enddate"
      @select="selectData('enddate')"
    >
    </m-datePicker>
    <!-- 底部按钮 -->
    <view class="formTemplate-btns foot">
      <m-button
        class="btn-item"
        btnClass="mainColor"
        :btnTilte="$t('basic-confirm')"
        @elementClick="handleBttomBtnClick()"
      ></m-button>
    </view>
    <!-- 下拉控件 -->
    <mpvue-picker
      ref="selectPicker"
      mode="datetimeSelector"
      @onConfirm="selectDataChoice"
    />
  </view>
</template>

<script>
import mDatePicker from '@/components/element/m-datePicker.vue';
import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';

export default {
  data() {
    return {
      type: '',
      name: '',
      startdate: '',
      enddate: '',
      startdateElement: {
        visiabled: 1,
        labletPositon: 'left',
        label: this.$t('page-startTime') + ':',
        name: 'startdate',
      }, //中文："开始时间
      enddateElement: {
        visiabled: 1,
        labletPositon: 'left',
        label: this.$t('page-endTime') + ':',
        name: 'enddate',
      }, //中文："结束时间
    };
  },
  components: {
    mDatePicker,
    mpvuePicker,
  },
  methods: {
    selectData(type) {
      const date = this[type].replace(/-/g, '/');
      // this.pickerValueDefault = new Date(date);
      this.type = type;
      this.$refs.selectPicker.show();
    },
    selectDataChoice(e) {
      if (this.type === 'startdate' || this.enddate) {
        const startdateTime = new Date(this.changeDate(e.label)).getTime();
        const enddateTime = new Date(this.changeDate(this.enddate)).getTime();
        if (startdateTime > enddateTime) {
          uni.showModal({
            title: this.$t('basic-modalTip'), //中文："提示",
            content: this.$t('check-startAndEnd'), // 中文:'开始日期不能大于结束日期'
            confirmText: this.$t('basic-confirm'),
            cancelText: this.$t('basic-cancel'),
          });
        } else {
          this[this.type] = e.label;
        }
      } else if (this.type === 'enddate' || this.startdate) {
        const startdateTime = new Date(
          this.changeDate(this.startdate)
        ).getTime();
        const enddateTime = new Date(this.changeDate(e.label)).getTime();
        if (startdateTime > enddateTime) {
          uni.showModal({
            title: this.$t('basic-modalTip'), //中文："提示",
            confirmText: this.$t('basic-confirm'),
            cancelText: this.$t('basic-cancel'), // 中文:'结束时间不能小于开始时间'
            content: this.$t('check-endAndStart'),
          });
        } else {
          this[this.type] = e.label;
        }
      }
    },
    handleBttomBtnClick() {
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1]; //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      prevPage.$vm.params = {
        startDate: this.startdate,
        endDate: this.enddate,
        name: this.name,
      };
      uni.navigateBack();
    },
    changeDate(date) {
      return date.replace(/-/g, '/');
    },
  },
};
</script>

<style>
</style>
