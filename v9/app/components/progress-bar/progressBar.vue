<template name="progressBar">
  <view class="progress" v-if="isShow && !!progressData[0]">
    <ul class="list">
      <li
        class="list-item animated fadeIn"
        v-for="(item, listindex) in progressData[0]"
        :key="listindex"
      >
        <view class="list-item-icon" :class="[themeClass]">
          <m-font-icon
            :iconSize="48"
            v-if="listindex < progressData[0].length - 1"
            icon="APP_57"
            :color="themeColorCode"
          ></m-font-icon>
          <view class="circle" v-else>{{ listindex + 1 }}</view>
          <view
            class="line"
            v-if="listindex < progressData[0].length - 1"
          ></view>
        </view>
        <view class="list-item-content" v-if="stateList.length > 0">
          <view class="progress-state">{{
            listValue(item, stateList[0])
          }}</view>
          <view class="progress-fixed"
            ><span v-if="listValue(item, userList[0])">{{
              listValue(item, userList[0])
            }}</span
            ><span v-if="listValue(item, dateList[0])">{{
              listValue(item, dateList[0])
            }}</span></view
          >
          <view
            class="others"
            v-for="(element, otherIndex) in otherList"
            :key="otherIndex"
            >{{ listValue(item, element) }}</view
          >
        </view>
      </li>
    </ul>
  </view>
</template>

<script>
import { mapState } from 'vuex';
export default {
  props: {
    otherParams: {
      type: Object,
      default() {
        return {};
      },
    },
    progressData: {
      //进度条数据
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      stateList: [], //进度条状态
      userList: [], //进度条操作人
      dateList: [], //进度条操作时间
      otherList: [], //进度条其他属性
      isShow: true, //是否显示当前进度条
    };
  },
  computed: {
    ...mapState(['themeColorCode', 'themeColor']),
    themeClass() {
      //与主题she检修关联
      const mainColor = ['mainColor', 'whiteColor'];
      return this.themeColor !== 'red'
        ? 'mainColor-' + this.themeColor
        : 'mainColor';
    },
  },
  methods: {
    handleElement() {
      const elementList = this.otherParams.elementList;
      this.stateList =
        elementList.filter((item) => item.canDisplayName === 1) || [];
      //如果没有配置列表是否显示名称则不显示进度条组件
      if (!!!this.stateList) {
        this.Static_GlobalFucs.showModal(this, {
          title: this.$t('lang-progress-showname'),
          showCancel: false,
        });
        this.isShow = false;
        return;
      }
      this.userList =
        elementList.filter((item) => item.relationColumnName === 'userid') ||
        [];
      this.dateList =
        elementList.filter(
          (item) => item.relationColumnName === 'operationdate'
        ) || [];
      this.otherList =
        elementList.filter(
          (item) =>
            item.canDisplayName !== 1 &&
            item.relationColumnName !== 'operationdate' &&
            item.relationColumnName !== 'userid'
        ) || [];
    },
    listValue(listData, element) {
      if (!element) return;
      const elementId = element.elementId;
      let value = listData[elementId] || '';
      value = typeof value !== 'object' ? value : value.name || '';
      return value;
    },
  },
  created() {
    this.handleElement();
  },
};
</script>
