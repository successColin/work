<!--
 * @Author: sss
 * @Date: 2021-12-22 16:29:08
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-22 16:29:08
 * @Desc: 按钮-横排
-->
<template>
  <view class="tabBtns">
    <section
      v-if="!isCcTom"
      class="tabBtnsRow"
      :class="[type === 2 ? `themeColor__bg-${getThemeIndex}` : '']"
      ref="tabBtnsRow"
    >
      <view
        class="btns"
        :class="[type !== 3 ? 'big' : '']"
        :style="{
          gridTemplateColumns: getGridTemplateColumns,
        }"
      >
        <template v-for="(item, index) in btnList.showBtns">
          <view :key="item.compId" class="btns__item">
            <apiot-button
              :type="type === 2 ? 'primary' : ''"
              :btnClass="type === 3 ? '' : 'sys_btnSize'"
              size="medium"
              shape="circle"
              :hair-line="false"
              :custom-style="{
                background:
                  type === 1 ? '#fff' : type === 2 ? '' : item.iconColor,
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
                    item.iconType === 1 ? 'appIcon' : 'iconfont',
                    item.iconFont,
                    type === 1 ? `themeColor__font-${getThemeIndex}` : '',
                  ]"
                ></i>
                <span class="btns__name">{{ item.name }}</span>
              </view>
            </apiot-button>
          </view>
          <div
            v-if="index !== btnList.showBtns.length - 1"
            :key="index"
            class="btns__line"
          ></div>
        </template>
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
              background:
                type === 1 ? '#fff' : type === 2 ? '' : item.iconColor,
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
                  item.iconType === 1 ? 'appIcon' : 'iconfont',
                  item.iconFont,
                ]"
              ></i>
              <span class="btns__name">{{ item.name }}</span>
            </view>
          </apiot-button>
        </div>
      </section>
    </section>
    <div class="processBtns" v-if="processBtns.length > 0">
      <section
        class="processBtns__content scale-animate scale-animate-right"
        :class="{ 'scale-animate-show': showProcess }"
      >
        <p
          class="processBtns__content--item"
          v-for="(item, index) in processBtns"
          :key="index"
          :style="{ background: item.iconColor }"
          @click="clickBtn(item, 'showBtn')"
        >
          <i class="appIcon" :class="[item.iconFont]"></i>
        </p>
      </section>
      <div
        class="processBtns__icon"
        :class="[`themeColor__bg-${getThemeIndex}`]"
        @click="handleShow"
      >
        <i class="appIcon appIcon-shenpi"></i>
      </div>
    </div>
  </view>
</template>

<script>
import rowMixin from './rowMixin';

export default {
  name: 'tabBtnsRow',
  components: {},
  mixins: [rowMixin],

  props: {
    // 是否有流程按钮
    isProcess: {
      type: Boolean,
      default: false
    },
    // 流程按钮
    processBtns: {
      type: Array,
      default() {
        return [];
      }
    },
    // 是否是流程中的抄送给我
    isCcTom: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showProcess: false
    };
  },

  methods: {
    handleShow() {
      this.showProcess = !this.showProcess;
    },

    clickBtn(e, type) {
      console.log('clickBtn');
      // 如果是更多按钮
      if (e.compId === 'more') {
        this.show = !this.show;
        return;
      }
      // 如果是流程按钮
      if (e.isProcess) {
        this.showProcess = !this.showProcess;
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

$--name: 'tabBtnsRow';
$--gridColumns: 4;
$--gridSize: 1fr;
$--gridRowGap: 12rpx;
$--gridColumnGap: 6rpx;
@include setRowBtnStyle(
  $--name,
  $--gridColumns,
  $--gridSize,
  $--gridRowGap,
  $--gridColumnGap
);

.tabBtns {
  width: 100%;
  display: flex;
  align-items: center;
  text-align: left;
  .tabBtnsRow {
    flex: 1;
  }
  .processBtns {
    position: relative;
    margin-left: 18rpx;
    flex-shrink: 0;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.1);
    &__icon {
      margin: 13rpx;
      width: 70rpx;
      height: 70rpx;
      line-height: 70rpx;
      border-radius: 50%;
      text-align: center;
      .appIcon-shenpi {
        font-size: 38rpx;
        color: #ffffff;
      }
    }

    &__content {
      position: absolute;
      width: 100%;
      bottom: 96rpx;
      &--item {
        margin: 0 auto 16rpx auto;
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        box-shadow: 0 4rpx 11rpx 0 rgba(0, 0, 0, 0.2);
        border-radius: 50%;

        .appIcon {
          font-size: 38rpx;
          color: #fff;
        }
      }
    }
  }
}
</style>
