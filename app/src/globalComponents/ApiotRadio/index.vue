<!--
 * @Author: sss
 * @Date: 2022-01-11 10:49:37
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-11 10:49:37
 * @Desc: 单选框
-->
<template>
  <view class="apiotRadio" :class="[disabled ? 'disabled' : '']">
    <radio-group @change="radioChange" :class="[position]">
      <label
        v-for="(item, index) in showList"
        class="apiotRadio__item"
        :key="index"
      >
        <view class="apiotRadio__content">
          <radio
            :value="`${item[valueProp]}`"
            :checked="`${item[valueProp]}` === `${checked[valueProp]}`"
            :color="themeColor"
            :disabled="disabled || readonly"
            style="transform: scale(0.6)"
          />
          <view class="apiotRadio__content--name">
            <i
              v-if="dropDownStyle === 3"
              class="icon iconfont"
              :class="item.icon.icon"
              :style="{ color: item.icon.color, fontSize: '20px' }"
            ></i>
            <span class="name" :style="[radioStyle]">{{ item[showProp] }}</span>
          </view>
        </view>
      </label>
    </radio-group>
  </view>
</template>

<script>
export default {
  components: {},

  props: {
    value: [Number, String],
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    dictKey: {
      type: String,
      default: ''
    },
    valueProp: {
      type: String,
      default: 'value'
    },
    showProp: {
      type: String,
      default: 'name'
    },
    // 排序
    sort: {
      type: String,
      default: 'asc'
    },
    position: {
      // 排布方向 row，column
      type: String,
      default: 'row'
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dropDownStyle: {
      // 显示风格 1-正常；2-主题背景色；3-有图标
      type: Number,
      default: 1
    }
  },

  data() {
    return {};
  },

  computed: {
    radioStyle() {
      const { dropDownStyle, themeColor } = this;
      const style = {};
      if (dropDownStyle === 2) {
        style.backgroundColor = themeColor;
        style.color = '#fff';
        style.padding = ' 4px 10px';
        style.borderRadius = '8rpx';
      }
      return style;
    },
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    showList() {
      const { list, dicList, sort } = this;
      let showList = list;
      if (list.length === 0) showList = dicList;
      return sort === 'desc' ? showList.reverse() : showList;
    },
    dicList() {
      const { dictKey } = this;
      if (dictKey) return this.$store.getters.getCurDict(dictKey) || [];
      return [];
    },
    checked() {
      const { value, valueProp, showList } = this;
      return showList.find((item) => `${item[valueProp]}` === `${value}`) || {};
    }
  },

  methods: {
    radioChange(evt) {
      const { showList, valueProp } = this;
      console.log('radioChange');
      console.log(showList);
      for (let i = 0; i < showList.length; i += 1) {
        const radioValue = showList[i];
        if (`${radioValue[valueProp]}` === evt.detail.value) {
          this.$emit('input', radioValue[valueProp]);
          this.$emit('change', radioValue[valueProp]);
          break;
        }
      }
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.apiotRadio {
  margin: 5px 0;
  width: 100%;
  &.disabled {
    .apiotRadio__content {
      padding: 0 10rpx;
      background: $form-el-disabled;
      color: $form-el-disabled-valueColor;
      border-radius: 12rpx;
    }
  }
  .row {
    display: flex;
    .apiotRadio__item {
      flex: 1;
    }
  }
  &__content {
    display: flex;
    align-items: center;
    height: 34px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #333333;
    // #ifdef MP-ALIPAY
    // radio {
    //   width: 25px;
    //   height: 25px;
    //   position: static;
    //   display: inline-flex !important;
    // }

    // radio-checked {
    //   background: #3cbcee;
    // }

    // radio-checked::after {
    //   width: 12px;
    //   height: 12px;
    //   background: #fff;
    //   border-radius: 100%;
    //   content: '';
    //   margin: auto;
    // }
    // #endif

    // ::v-deep {
    //   .uni-radio-input-checked {
    //     &::before {
    //       content: '' !important;
    //       background: #fff;
    //       width: 14px;
    //       height: 14px;
    //       border-radius: 100%;
    //     }
    //   }
    // }
    &--name {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 8rpx;
      }
    }
  }
}
</style>
