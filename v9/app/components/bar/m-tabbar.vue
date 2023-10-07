<!-- 底部导航栏 -->
<template>
  <view
    class="m-bar"
    :class="[`${position}_Bar`, themeClass_]"
    :style="styleObject_"
  >
    <view
      v-for="(item, index) in barList"
      class="m-bar-item"
      :class="{ active: index + 1 === activityIndex, 'm-bar-big': item.isbig }"
      :key="index"
      :ref="item.barKey"
      @click="handleClick(index + 1)"
    >
      <view
        :class="{
          animated: index + 1 === activityIndex,
          tada: index + 1 === activityIndex,
        }"
        v-if="!item.isbig"
      >
        <m-font-icon
          :icon="item.bundleIconName || item.icon"
          :iconSize="item.isbig ? bigSize : iconSize"
        ></m-font-icon>
      </view>
      <m-font-icon
        v-else
        :icon="item.bundleIconName || item.icon"
        :iconSize="item.isbig ? bigSize : iconSize"
      ></m-font-icon>
      {{ item.bundleName || item.name }}
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { CHART_PATH } from '@/common/constant/chart.js';
export default {
  data() {
    return {
      barBasic: 'm-bar',
      iconSize: 50,
      bigSize: 74,
      activityIndex: -1,
    };
  },
  props: {
    position: {
      //是否为文字按钮
      type: String,
      default: 'top',
    },
    barList: Array,
    defalutActivityIndex: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState(['themeColor']),
    styleObject_() {
      const obj = {};
      if (this.position == 'bottom') obj['bottom'] = 0;
      return obj;
    },
    themeClass_() {
      //与主题she检修关联
      const mainColor = ['mainColor', 'whiteColor'];
      return this.themeColor !== 'red'
        ? 'mainColor-' + this.themeColor
        : 'mainColor';
    },
    activityBar() {
      if (this.activityIndex !== 0 && this.barList.length)
        return this.barList[this.activityIndex - 1];
      else return {};
    },
  },
  watch: {
    activityBar(newValue, oldValue) {
      if (newValue && oldValue && newValue.barKey === oldValue.barKey) return;
      let { url, barKey } = newValue;
      this.$emit('activityBar', {
        activityBar: newValue,
        oldActivityBar: oldValue,
      });
      this.tabActivityBar(url, barKey);
    },
  },
  methods: {
    ...mapMutations('common', ['SET_COMMON_WEBVIEW']),
    tabActivityBar(showpage, barId) {
      //选中tab时做的操作
      if (!showpage) {
        const _this = this;
        uni.showModal({
          title: _this.$t('basic-inquiry'),
          content: _this.$t('pageTip-configuration'),
          showCancel: false,
          cancelText: _this.$t('basic-cancel'),
          confirmText: _this.$t('basic-confirm'),
        });
      } else {
        if (showpage in CHART_PATH) {
          //特制化图表
          uni.navigateTo({
            url: CHART_PATH[showpage],
          });
        } else if (
          /^https:\/\/.*/i.test(showpage) ||
          /^http:\/\/.*/i.test(showpage)
        ) {
          //如果是http接口
          let key = `bar_${barId}`;
          this.SET_COMMON_WEBVIEW({
            key: key,
            url: showpage,
          });
          uni.navigateTo({
            //调整webview界面
            url: '/pages/common/webViewFrames?webview=' + key,
          });
        }
      }
    },
    handleClick(index) {
      const acBar = this.barList[index - 1];
      let { url, barKey } = acBar;
      if (/^https:\/\/.*/i.test(url) || /^http:\/\/.*/i.test(url)) {
        this.tabActivityBar(url, barKey);
        return;
      }

      this.activityIndex = index;
    },
  },
  created() {
    this.activityIndex = this.defalutActivityIndex;
  },
};
</script>