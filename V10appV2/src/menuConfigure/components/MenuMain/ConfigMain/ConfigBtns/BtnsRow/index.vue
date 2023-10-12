<!--
 * @Author: sss
 * @Date: 2021-12-22 16:29:08
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-22 16:29:08
 * @Desc: 按钮-横排1
-->
<template>
  <view
    class="btnsRow"
    :class="[
      btnRadiusClass,
      type === 2 ? `themeColor__bg-${getThemeIndex}` : '',
      type === 3 ? 'hasPadding' : '',
    ]"
    ref="btnsRow"
  >
    <view
      class="btns"
      :class="[type !== 3 ? 'big' : '']"
      :style="{
        gridTemplateColumns: getGridTemplateColumns,
      }"
    >
      <template v-for="(item, index) in btnList.showBtns">
        <view class="btns__item" :key="item.compId">
          <apiot-button
            :type="type === 2 ? 'primary' : ''"
            :btnClass="type === 3 ? '' : 'sys_btnSize'"
            size="medium"
            :shape="btnRadius"
            :hair-line="false"
            :custom-style="{
              background: item.iconColor,
              color: item.fontColor,
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
                  item.isTheme ? `themeColor__font-${getThemeIndex}` : '',
                ]"
              ></i>
              <span class="btns__name">{{ item.name }}</span>
            </view>
          </apiot-button>
        </view>
        <template v-if="btnRadiusClass === 'oval'">
          <div
            v-if="index !== btnList.showBtns.length - 1"
            :key="index"
            class="btns__line"
          ></div>
        </template>
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
          :shape="btnRadius"
          :hair-line="false"
          :custom-style="{
            background: item.iconColor,
            color: item.fontColor,
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
                item.isTheme ? `themeColor__font-${getThemeIndex}` : '',
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
import rowMixin from './rowMixin';

export default {
  name: 'btnsRow',
  components: {},
  mixins: [rowMixin]
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'btnsRow';
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
</style>
