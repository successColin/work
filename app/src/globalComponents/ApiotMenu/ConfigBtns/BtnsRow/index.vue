<!--
 * @Author: sss
 * @Date: 2021-12-22 16:29:08
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-22 16:29:08
 * @Desc: 按钮-横排
-->
<template>
  <view
    class="btnsRow"
    :class="[type === 2 ? `themeColor__bg-${getThemeIndex}` : '']"
    ref="btnsRow"
  >
    <view
      class="btns"
      :class="[type !== 3 ? 'big' : '']"
      :style="{
        gridTemplateColumns: `repeat(${btnList.showBtns.length}, 1fr) `,
      }"
    >
      <view
        v-for="item in btnList.showBtns"
        :key="item.compId"
        class="btns__item"
      >
        <apiot-button
          :type="type === 2 ? 'primary' : ''"
          :btnClass="type === 3 ? '' : 'sys_btnSize'"
          size="medium"
          shape="circle"
          :hair-line="false"
          :custom-style="{
            background: type === 1 ? '#fff' : type === 2 ? '' : item.iconColor,
            color: type === 1 ? '' : '#fff',
          }"
          :loading="loadingList[item.compId]"
          :disabled="item.canReadonly"
          @click="clickBtn(item, 'showBtn')"
        >
          <view class="btns__title">
            <i
              v-if="item.buttonForm !== 1 && item.iconFont"
              :class="[
                item.compId === 'more' ? 'appIcon' : 'iconfont',
                item.iconFont,
                type === 1 ? `themeColor__font-${getThemeIndex}` : '',
              ]"
            ></i>
            <span class="btns__name">{{ item.name }}</span>
          </view>
        </apiot-button>
      </view>
      <!-- -->
    </view>
    <section class="hiddenBtns" v-if="btnList.hideBtns.length > 0">
      <div
        class="animate__animated hiddenBtns__btn animate__fadeInRight"
        v-show="show"
        v-for="(item, index) in btnList.hideBtns"
        :key="index"
      >
        <apiot-button
          :type="type === 2 ? 'primary' : ''"
          btnClass="noSize"
          size="medium"
          shape="circle"
          :hair-line="false"
          :custom-style="{
            background: type === 1 ? '#fff' : type === 2 ? '' : item.iconColor,
            color: type === 1 ? '' : '#fff',
          }"
          :loading="loadingList[item.compId]"
          :disabled="item.canReadonly"
          @click="clickBtn(item, 'hideBtn')"
        >
          <view class="btns__title">
            <i
              v-if="item.buttonForm !== 1 && item.iconFont"
              :class="[
                item.compId === 'more' ? 'appIcon' : 'iconfont',
                item.iconFont,
              ]"
            ></i>
            <span class="btns__name">{{ item.name }}</span>
          </view>
        </apiot-button>
      </div>
    </section>
  </view>
</template>

<script>
export default {
  name: 'btnsRow',
  components: {},

  props: {
    // 按钮列表样式 1-无背景；2-主题色背景；3-自定义颜色
    type: {
      type: [Number, String],
      default: 1
    },
    // 按钮一排显示几个
    btnNum: {
      type: Number,
      default: 3
    },
    // 按钮列表
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },

  data() {
    return {
      loadingList: {},
      show: false
    };
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    // 显示的按钮数
    btnList() {
      const { btnNum, list, type } = this;
      let showBtns = [];
      const hideBtns = [];
      if (list.length > btnNum) {
        list.forEach((item, index) => {
          if (index < btnNum) showBtns.push(item);
          else hideBtns.push(item);
        });
      } else {
        showBtns = [...list];
      }
      if (hideBtns.length > 0) {
        let iconColor = '';
        if (type === 1 || type === 3) iconColor = this.$store.state.base.themeColor;
        showBtns.push({
          name: '更多',
          compId: 'more',
          iconColor,
          iconFont: 'appIcon-gengduoanniu'
        });
      }
      return { showBtns, hideBtns };
    }
  },

  methods: {
    // 设置按钮的loading状态
    setLoading(compId, status) {
      this.loadingList[compId] = status;
    },
    clickBtn(e, type) {
      console.log('clickBtn');
      // 如果是更多按钮
      if (e.compId === 'more') {
        this.show = !this.show;
        return;
      }
      if (type === 'hideBtn') this.show = false;
      const obj = {};
      obj[e.compId] = true;
      this.loadingList = { ...this.loadingList, ...obj };
      this.$emit('click', e);
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'btnsRow';
$--gridColumns: 4;
$--gridSize: 1fr;
$--gridRowGap: 12rpx;
$--gridColumnGap: 12rpx;
@include setRowBtnStyle(
  $--name,
  $--gridColumns,
  $--gridSize,
  $--gridRowGap,
  $--gridColumnGap
);
</style>
