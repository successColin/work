<!--
 * @Author: sss
 * @Date: 2022-01-11 10:49:37
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-11 10:49:37
 * @Desc: 多选框-需要一个数组
-->
<template>
  <view class="apiotCheckbox" :class="[disabled ? 'disabled' : '']">
    <checkbox-group @change="checkboxChange">
      <div class="apiotCheckbox__group" :class="[position]">
        <label
          v-for="(item, index) in showList"
          class="apiotCheckbox__item"
          :key="index"
        >
          <view class="apiotCheckbox__content">
            <i
              class="apiotCheckbox__content--checkbox"
              :class="[
                checkedV.findIndex((v) => `${item[valueProp]}` === `${v}`) !==
                -1
                  ? `appIcon appIcon-a-fuxuankuangxuanzhong themeColor__font-${getThemeIndex}`
                  : 'nochecked',
              ]"
            ></i>
            <checkbox
              :value="`${item[valueProp]}`"
              :checked="
                checkedV.findIndex((v) => `${item[valueProp]}` === `${v}`) !==
                -1
              "
              :color="themeColor"
              :disabled="disabled || readonly"
              style="display: none; display: none"
            />
            <view class="apiotCheckbox__content--name">
              <i
                v-if="dropDownStyle === 3"
                class="icon iconfont"
                :class="item.icon.icon"
                :style="{ color: item.icon.color, fontSize: '20px' }"
              ></i>
              <p class="name" :style="[checkboxStyle]">{{ item[showProp] }}</p>
            </view>
          </view>
        </label>
      </div>
    </checkbox-group>
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
    return {
      checkboxV: null
    };
  },

  watch: {
    value(newV) {
      this.checkboxV = newV;
    }
  },

  computed: {
    getThemeIndex() {
      return this.$store.getters.getThemeIndex;
    },
    checkboxStyle() {
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
      let showList = [...list];
      if (list.length === 0) showList = [...dicList];
      return sort === 'desc' ? showList.reverse() : showList;
    },
    dicList() {
      const { dictKey } = this;
      if (dictKey) return this.$store.getters.getCurDict(dictKey) || [];
      return [];
    },
    checkedV() {
      const { checkboxV } = this;
      let valueArry = null;
      if (typeof checkboxV === 'number') valueArry = [checkboxV];
      else if (checkboxV && typeof checkboxV === 'string') valueArry = checkboxV.split(',');
      else valueArry = [];
      return valueArry;
    }
  },

  methods: {
    checkboxChange(evt) {
      const { value } = evt.detail;
      this.checkboxV = value.join(',');
      this.$emit('change', value.join(','));
    }
  },

  mounted() {},

  created() {
    this.checkboxV = this.value;
  }
};
</script>

<style lang='scss' scoped>
.apiotCheckbox {
  margin: 5px 0;
  width: 100%;
  &.disabled {
    .apiotCheckbox__content {
      padding: 0 10rpx;
      background: $form-el-disabled;
      color: $form-el-disabled-valueColor;
      border-radius: 12rpx;
    }
  }
  &__group {
    width: 100%;
    display: flex;
    flex-direction: column;
    &.row {
      flex-direction: row;
      .apiotCheckbox__item {
        flex: 1;
      }
    }
  }

  &__content {
    display: flex;
    align-items: center;
    height: 34px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    color: #333333;

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
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
