<template>
  <view
    class="apiotRate"
    :id="elId"
    ref="apiotRate"
    :style="[$u.addStyle(customStyle)]"
  >
    <view
      class="apiotRate__content"
      :class="[showType === 'facial-exp' ? 'center' : '']"
      @touchmove.stop="touchMove"
      @touchend.stop="touchEnd"
    >
      <view
        class="apiotRate__content__item"
        v-for="(item, index) in Number(count)"
        :key="index"
        :class="[elClass]"
      >
        <view
          class="apiotRate__content__item__icon-wrap"
          ref="apiotRate__content__item__icon-wrap"
          @tap.stop="clickHandler($event, index + 1)"
        >
          <i
            class="appIcon"
            :class="[
              Math.floor(activeIndex) > index
                ? showType === 'star' || showType === 'flag'
                  ? showActiveIcon
                  : showActiveIcon[index]
                : showType === 'star' || showType === 'flag'
                ? showInActiveIcon
                : showInActiveIcon[index],
            ]"
            :style="{
              display: 'inline-black',
              color: disabled
                ? '#c8c9cc'
                : Math.floor(activeIndex) > index
                ? activeColor
                : inactiveColor,
              fontSize: `${size}rpx`,
              width: `${size}rpx`,
              height: `${size}rpx`,
              paddingRight: $apiot.addUnit(gutter / 2),
            }"
          ></i>
        </view>
        <view
          v-if="allowHalf"
          @tap.stop="clickHandler($event, index + 1)"
          :class="[
            'apiotRate__content__item__icon-wrap',
            'apiotRate__content__item__icon-wrap--half',
          ]"
          :style="{
            width: $apiot.addUnit(rateWidth / 2),
          }"
          ref="apiotRate__content__item__icon-wrap"
        >
          <u-icon
            :name="Math.ceil(activeIndex) > index ? activeIcon : inactiveIcon"
            :color="
              disabled
                ? '#c8c9cc'
                : Math.ceil(activeIndex) > index
                ? activeColor
                : inactiveColor
            "
            :custom-style="{
              padding: `0 ${$apiot.addUnit(gutter / 2)}`,
            }"
            :size="size"
          ></u-icon>
        </view>
      </view>
      <span v-if="showLevel">{{ levelName[activeIndex - 1] }}</span>
    </view>
  </view>
</template>

<script>
import props from './props.js';

// #ifdef APP-NVUE
// eslint-disable-next-line no-undef
const dom = weex.requireModule('dom');
// #endif
export default {
  name: 'apiotRate',
  mixins: [uni.$u.mixin, props],
  // #ifdef MP-WEIXIN
  // 将自定义节点设置成虚拟的，更加接近Vue组件的表现，能更好的使用flex属性
  options: {
    virtualHost: true
  },
  // #endif
  data() {
    return {
      // 生成一个唯一id，否则一个页面多个评分组件，会造成冲突
      elId: uni.$apiot.guid(),
      elClass: uni.$apiot.guid(),
      rateBoxLeft: 0, // 评分盒子左边到屏幕左边的距离，用于滑动选择时计算距离
      activeIndex: this.value,
      rateWidth: 0, // 每个星星的宽度
      // 标识是否正在滑动，由于iOS事件上touch比click先触发，导致快速滑动结束后，接着触发click，导致事件混乱而出错
      moving: false,
      levelName: ['极差', '差', '一般', '满意', '超赞']
    };
  },
  watch: {
    value(val) {
      this.activeIndex = val;
    },
    activeIndex: 'emitEvent'
  },
  computed: {
    showActiveIcon() {
      const { showType } = this;
      if (showType === 'flag') return 'appIcon-qizhi';
      if (showType === 'line-exp') {
        return [
          'appIcon-jicha',
          'appIcon-cha',
          'appIcon-yiban',
          'appIcon-manyi',
          'appIcon-chaozan'
        ];
      }
      if (showType === 'facial-exp') {
        return [
          'appIcon-a-jichaxuanzhong',
          'appIcon-a-chaxuanzhong',
          'appIcon-a-yibanxuanzhong',
          'appIcon-a-manyixuanzhong',
          'appIcon-a-chaozanxuanzhong'
        ];
      }
      return 'appIcon-yishoucang';
    },
    showInActiveIcon() {
      const { showType } = this;
      if (showType === 'flag') return 'appIcon-qizhi';
      if (showType === 'line-exp') {
        return [
          'appIcon-jicha',
          'appIcon-cha',
          'appIcon-yiban',
          'appIcon-manyi',
          'appIcon-chaozan'
        ];
      }
      if (showType === 'facial-exp') {
        return [
          'appIcon-jicha1',
          'appIcon-cha1',
          'appIcon-yiban1',
          'appIcon-manyi1',
          'appIcon-chaozan1'
        ];
      }
      return 'appIcon-shoucang';
    }
  },
  methods: {
    init() {
      uni.$apiot.sleep().then(() => {
        this.getRateItemRect();
        this.getRateIconWrapRect();
      });
    },
    // 获取评分组件盒子的布局信息
    async getRateItemRect() {
      await uni.$apiot.sleep();
      // uView封装的获取节点的方法，详见文档
      // #ifndef APP-NVUE
      this.$uGetRect(`#${this.elId}`).then((res) => {
        this.rateBoxLeft = res.left;
      });
      // #endif
      // #ifdef APP-NVUE
      dom.getComponentRect(this.$refs.apiotRate, (res) => {
        this.rateBoxLeft = res.size.left;
      });
      // #endif
    },
    // 获取单个星星的尺寸
    getRateIconWrapRect() {
      // uView封装的获取节点的方法，详见文档
      // #ifndef APP-NVUE
      this.$uGetRect(`.${this.elClass}`).then((res) => {
        this.rateWidth = res.width;
      });
      // #endif
      // #ifdef APP-NVUE
      dom.getComponentRect(this.$refs['apiotRate__content__item__icon-wrap'][0], (res) => {
        this.rateWidth = res.size.width;
      });
      // #endif
    },
    // 手指滑动
    touchMove(e) {
      // 如果禁止通过手动滑动选择，返回
      if (!this.touchable) {
        return;
      }
      this.preventEvent(e);
      const x = e.changedTouches[0].pageX;
      this.getActiveIndex(x);
    },
    // 停止滑动
    touchEnd(e) {
      // 如果禁止通过手动滑动选择，返回
      if (!this.touchable) {
        return;
      }
      this.preventEvent(e);
      const x = e.changedTouches[0].pageX;
      this.getActiveIndex(x);
    },
    // 通过点击，直接选中
    clickHandler(e, index) {
      // ios上，moving状态取消事件触发
      if (uni.$u.os() === 'ios' && this.moving) {
        return;
      }
      this.preventEvent(e);
      let x = 0;
      // 点击时，在nvue上，无法获得点击的坐标，所以无法实现点击半星选择
      // #ifndef APP-NVUE
      x = e.changedTouches[0].pageX;
      // #endif
      // #ifdef APP-NVUE
      // nvue下，无法通过点击获得坐标信息，这里通过元素的位置尺寸值模拟坐标
      x = index * this.rateWidth + this.rateBoxLeft;
      // #endif
      this.getActiveIndex(x, true);
    },
    // 发出事件
    emitEvent() {
      // 发出change事件
      this.$emit('change', this.activeIndex);
      // 同时修改双向绑定的value的值
      this.$emit('input', this.activeIndex);
    },
    // 获取当前激活的评分图标
    getActiveIndex(x, isClick = false) {
      if (this.disabled) {
        return;
      }
      // 判断当前操作的点的x坐标值，是否在允许的边界范围内
      const allRateWidth = this.rateWidth * this.count + this.rateBoxLeft;
      // 如果小于第一个图标的左边界，设置为最小值，如果大于所有图标的宽度，则设置为最大值
      x = uni.$u.range(this.rateBoxLeft, allRateWidth, x) - this.rateBoxLeft;
      // 滑动点相对于评分盒子左边的距离
      const distance = x;
      // 滑动的距离，相当于多少颗星星
      let index;
      // 判断是否允许半星
      if (this.allowHalf) {
        index = Math.floor(distance / this.rateWidth);
        // 取余，判断小数的区间范围
        const decimal = distance % this.rateWidth;
        if (decimal <= this.rateWidth / 2 && decimal > 0) {
          index += 0.5;
        } else if (decimal > this.rateWidth / 2) {
          index += 1;
        }
      } else {
        index = Math.floor(distance / this.rateWidth);
        // 取余，判断小数的区间范围
        const decimal = distance % this.rateWidth;
        // 非半星时，只有超过了图标的一半距离，才认为是选择了这颗星
        if (isClick) {
          if (decimal > 0) index += 1;
        } else if (decimal > this.rateWidth / 2) index += 1;
      }
      this.activeIndex = Math.min(index, this.count);
      // 对最少颗星星的限制
      if (this.activeIndex < this.minCount) {
        this.activeIndex = this.minCount;
      }

      // 设置延时为了让click事件在touchmove之前触发
      setTimeout(() => {
        this.moving = true;
      }, 10);
      // 一定时间后，取消标识为移动中状态，是为了让click事件无效
      setTimeout(() => {
        this.moving = false;
      }, 10);
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang="scss" scoped>
view,
scroll-view,
swiper-item {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex-grow: 0;
  flex-basis: auto;
  align-items: stretch;
  align-content: flex-start;
}

$apiotRate-margin: 0 !default;
$apiotRate-padding: 0 !default;
$apiotRate-item-icon-wrap-half-top: 0 !default;
$apiotRate-item-icon-wrap-half-left: 0 !default;

.apiotRate {
  @include flex;
  align-items: center;
  margin: $apiotRate-margin;
  padding: $apiotRate-padding;
  /* #ifndef APP-NVUE */
  touch-action: none;
  /* #endif */

  .appIcon {
    width: 100%;
    height: 100%;
  }

  &__content {
    @include flex;
    &.center {
      align-items: center;
    }

    &__item {
      position: relative;

      &__icon-wrap {
        &--half {
          position: absolute;
          overflow: hidden;
          top: $apiotRate-item-icon-wrap-half-top;
          left: $apiotRate-item-icon-wrap-half-left;
        }
      }
    }
  }
}

.u-icon {
  /* #ifndef APP-NVUE */
  box-sizing: border-box;
  /* #endif */
}
</style>
