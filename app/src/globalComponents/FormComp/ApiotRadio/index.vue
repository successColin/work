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
        v-for="(item, index) in optionList"
        class="apiotRadio__item"
        :key="index"
      >
        <view class="apiotRadio__content">
          <i
            class="apiotRadio__content--checkbox"
            :class="[
              `${item[valueProp]}` === `${checked[valueProp]}`
                ? `appIcon appIcon-xuanzhong themeColor__font-${getThemeIndex}`
                : 'nochecked',
            ]"
          ></i>
          <radio
            :value="`${item[valueProp]}`"
            :checked="`${item[valueProp]}` === `${checked[valueProp]}`"
            :color="themeColor"
            :disabled="disabled || readonly"
            style="display: none"
          />
          <view class="apiotRadio__content--name">
            <i
              v-if="dropDownStyle === 3 && item.icon && item.icon.icon"
              class="icon iconfont"
              :class="item.icon.icon"
              :style="{ color: item.icon.color, fontSize: '20px' }"
            ></i>
            <span
              class="name"
              :style="[
                radioStyle,
                {
                  backgroundColor:
                    dropDownStyle === 2 && item.color ? item.color : '',
                },
              ]"
              >{{ item[showProp] }}</span
            >
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
    // option显示的值
    showArry: {
      type: Array,
      default() {
        return [];
      }
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
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    radioStyle() {
      const { dropDownStyle } = this;
      const style = {};
      if (dropDownStyle === 2) {
        // style.backgroundColor = themeColor;
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
      console.log(dicList);
      let showList = list;
      if (list.length === 0) showList = dicList;
      return sort === 'desc' ? showList.reverse() : showList;
    },
    optionList() {
      const { showArry, showList, valueProp } = this;
      if (showArry.length === 0) return showList;

      const list = showList.filter((item) => showArry.includes(item[valueProp]));
      return list;
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
    box-sizing: border-box;
    padding: $form-el-disabled-padding;
    background: $form-el-disabled;
    border-radius: 12rpx;
    .apiotRadio__content {
      color: $form-el-disabled-valueColor;
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
    font-size: $form-el-fontSize;
    font-family: $--font-family;
    color: $form-el-valueColor;
    &--name {
      display: flex;
      align-items: center;
      .icon {
        margin-right: 8rpx;
      }
    }

    &--checkbox {
      flex-shrink: 0;
      padding-right: 20rpx;
    }

    &--checkbox {
      font-size: 16px;
      &.nochecked {
        box-sizing: border-box;
        height: 16px;
        &::after {
          content: '';
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 1px solid #d9d9d9;
          border-radius: 50%;
        }
      }
    }
  }
}
</style>
