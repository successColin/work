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
      <view
        v-if="!(disabled || readonly)"
        class="apiotSelectData__btn"
        @click.stop="showPopup"
        :style="{ color: themeColor }"
      >
        <i class="appIcon appIcon-tianjiagongneng"></i>
        <span>添加</span>
      </view>
    </view>
    <u-popup
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
export default {
  components: {},

  props: {
    value: Array,
    showFlag: {
      type: String,
      default: 'name'
    },
    placeholder: {
      type: String,
      default: '请选择'
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
    color: String
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
    themeColor() {
      return this.$store.state.base.themeColor;
    }
  },

  methods: {
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
  font-family: PingFangSC-Regular, PingFang SC;
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
    font-size: 16px;
    .appIcon-tianjiagongneng {
      font-size: 18px;
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
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
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
