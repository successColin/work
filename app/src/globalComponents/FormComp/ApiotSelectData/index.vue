<!--
 * @Author: sss
 * @Date: 2022-01-11 19:05:14
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-11 19:05:14
 * @Desc: 数据选择框 可以支持多选、单选
-->
<template>
  <view class="apiotSelectData" :class="[disabled ? 'disabled' : '']">
    <view class="apiotSelectData__value">
      <view class="apiotSelectData__value--content" @click.stop="clickContent">
        <view
          class="apiotSelectData__placeholder ellipsis"
          v-if="value.length === 0"
          >{{ placeholder }}</view
        >
        <div
          v-else-if="value.length !== 0 && !multiple"
          class="ellipsis"
          :style="{ color: color }"
        >
          {{ value[0][showFlag] }}
        </div>
        <scroll-view v-else scroll-x="true" class="scroll-Y">
          <view class="apiotSelectData__value--multiple">
            <span
              v-for="(valueItem, index) in value"
              :key="index"
              @click.stop="del(index)"
              >{{ valueItem[showFlag] }}</span
            >
          </view>
        </scroll-view>
      </view>
      <view v-if="!(disabled || readonly)" class="apiotSelectData__btn">
        <!-- #ifndef H5 -->
        <i
          v-if="isScan"
          class="appIcon appIcon-saoma"
          :class="[
            `themeColor__font-${getThemeIndex}`,
            canSelect ? 'hadpadding' : '',
          ]"
          @click.stop="gotoScan"
        ></i>
        <div
          v-if="isScan && canSelect"
          class="apiotSelectData__btn--line"
        ></div>
        <!-- #endif -->
        <i
          v-if="canSelect"
          class="appIcon appIcon-a-shujuxuanzejinru"
          @click.stop="showPopup"
        ></i>
      </view>
    </view>
    <u-popup
      v-if="!readonly && !disabled"
      :show="show"
      mode="bottom"
      :round="15"
      :safeAreaInsetBottom="false"
      @open="open"
      @close="closePopup"
      :closeOnClickOverlay="true"
      bgColor="#F6F6F8"
      :customStyle="{ height: `${popHeight}px`, color: 'red' }"
    >
      <section class="apiotSelectData__div" :style="popStyle" v-if="show">
        <view class="apiotSelectData__div--content">
          <slot></slot>
        </view>
      </section>
    </u-popup>
  </view>
</template>

<script>
import mpMixin from '@/mixin/mpMixin';

export default {
  components: {},

  mixins: [mpMixin],

  props: {
    value: Array,
    showFlag: {
      type: String,
      default: 'name'
    },
    placeholder: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    popTitle: {
      type: String,
      default: '添加'
    },
    // 字体颜色
    color: String,
    // 是否启用扫描
    isScan: {
      type: Boolean,
      default: false
    },
    // 能否手动选择
    canSelect: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      show: false,
      checkValues: '',
      oldCheckList: []
    };
  },

  watch: {
    show(value) {
      this.$emit('show', value);
      this.$store.commit('setmaskOverhiddenClass', value);
    },
    value(newValue) {
      this.checkValues = newValue;
    }
  },

  computed: {
    popHeight() {
      const { windowHeight, customBar } = this.$store.state.base.systemInfo;
      return windowHeight - customBar - 15;
    },
    showValue() {
      const { value } = this;
      if (value && typeof value === 'string') return value.split(',');
      return value;
    },
    popStyle() {
      const { windowHeight, customBar } = this.$store.state.base.systemInfo;
      return { height: `${windowHeight - customBar}px` };
    },
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    }
  },

  methods: {
    async gotoScan() {
      try {
        const qrResult = await this.$apiot.scanCode();
        const { result } = qrResult;

        this.$emit('scanSuccess', result);
      } catch (error) {
        console.error(error);
      }
    },
    // 点击内容
    clickContent() {
      this.$emit('clickContent');
    },
    open() {},
    closePopup() {
      this.show = false;
    },
    showPopup() {
      const { disabled, readonly } = this;
      if (disabled || readonly) return '';
      this.show = true;
    },
    del(index) {
      console.info(index);
    }
  },

  mounted() {},

  created() {
    this.checkValues = this.value;
  }
};
</script>

<style lang='scss' scoped>
.apiotSelectData {
  width: 100%;
  font-size: $form-el-fontSize;
  font-family: $--font-family;
  color: $form-el-valueColor;
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &.disabled {
    .apiotSelectData__value--content {
      padding: 0 10rpx;
      background: $form-el-disabled;
      color: $form-el-disabled-valueColor;
      border-radius: 12rpx;
    }
  }
  &__btn {
    display: flex;
    align-items: center;

    .appIcon {
      font-size: 48rpx;
      color: #bbc3cd;
    }
    .hadpadding {
      padding-right: 20rpx;
    }
    .appIcon-a-shujuxuanzejinru {
      padding-left: 20rpx;
    }
    &--line {
      width: 1rpx;
      height: 38rpx;
      background: #d9d9d9;
    }
  }
  &__value {
    padding: 10rpx 0;
    height: $form-el-height;
    line-height: $form-el-height;
    display: flex;
    align-items: center;
    &--content {
      width: 0;
      flex: 1;
    }

    &--multiple {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      span {
        flex-shrink: 0;
        margin-right: 16rpx;
        padding: 0 20rpx;
        height: 25px;
        line-height: 25px;
        background: #ffede1;
        color: #fa6400;
        font-size: 13px;
        border-radius: 100px;
        &:last-child {
          margin: 0;
        }
      }
    }
  }
  &__placeholder {
    color: $form-el-placeholderColor;
  }
  &__div {
    display: flex;
    flex-direction: column;
    &:before {
      content: '';
      display: block;
      height: 15px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      background: #ffffff;
    }

    &--content {
      flex: 1;
      overflow: auto;
    }
    &--footer {
      margin-top: 20rpx;
      padding: 19rpx 33rpx;
      display: flex;
      height: 72rpx;
      .btn {
        flex: 1;
        &:first-child {
          margin-right: 20rpx;
        }
      }
    }
  }
  &__item {
    display: flex;
    align-items: center;
    padding: 0 33rpx;
    font-size: $form-el-fontSize;
    font-family: $--font-family;
    color: #333333;
    border-bottom: 1px solid #e9e9e9;
    &--name {
      flex: 1;
      height: 98rpx;
      line-height: 98rpx;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 8px;
      }
    }
  }
}
</style>
