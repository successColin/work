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
$--gridColumns: 4;
$--gridSize: 1fr;
$--gridRowGap: 12rpx;
$--gridColumnGap: 12rpx;
.hiddenBtns {
  position: absolute;
  right: 0;
  bottom: 45px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &__btn {
    margin-bottom: 20rpx;
    flex-shrink: 0;
    height: 80rpx;
    animation-duration: 1s;
  }
}
.btnsRow {
  position: relative;
  display: flex;
  align-items: center;
  height: $form-row-btns-height;
  line-height: 100%;
  background: #fff;
  border-radius: 100px;
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.1);
  .btns {
    width: 100%;
    margin-left: $--gridColumnGap;
    display: grid;
    &.big {
      margin-left: 0;
      height: 100%;
      .btns__item {
        padding: 0;
        height: 100%;
        &:not(:last-child)::after {
          top: 16px;
        }
      }
    }
    &__item {
      padding: 0 13rpx;
      position: relative;
      height: 62rpx;
      overflow: hidden;
      &:not(:last-child)::after {
        position: absolute;
        top: 9px;
        right: 0;
        content: '';
        display: block;
        width: 1px;
        height: 24rpx;
        background: rgba(217, 217, 217, 0.8);
        z-index: 10;
      }
      &:first-child {
        padding-left: 0;
      }
    }
    &__title {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      i {
        font-size: 38rpx;
      }
    }
    &__name {
      margin-left: 10rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
.appIcon {
  margin-right: 4rpx;
  font-size: 38rpx;
}
</style>
