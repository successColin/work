<!--
 * @Author: sss
 * @Date: 2022-01-11 19:05:14
 * @Last Modified by: sss
 * @Last Modified time: 2022-01-11 19:05:14
 * @Desc: 下拉选择框 可以支持多选、单选
-->
<template>
  <view class="apiotSelectDown" :class="[disabled ? 'disabled' : '']">
    <view class="apiotSelectDown__value" @click.stop="showPopup">
      <view class="apiotSelectDown__value--content">
        <!-- <span v-else-if="value && !multiple">{{ showValue }}</span> -->
        <scroll-view v-if="multiple" scroll-x="true" class="scroll-Y">
          <view class="apiotSelectDown__value--multiple">
            <span
              v-for="(valueItem, index) in showValueList"
              :key="valueItem[valueProp]"
              @click.stop="del(index)"
              >{{ valueItem[showProp] }}</span
            >
          </view>
        </scroll-view>
        <data-types
          v-else-if="checkList.length !== 0"
          :icon="showIcon.icon"
          :fontColor="showIcon.fontColor"
          :value="showValue"
          :mode="dropDownStyle"
        ></data-types>
        <view class="apiotSelectDown__placeholder" v-else>{{
          placeholder
        }}</view>
      </view>
      <i
        class="appIcon appIcon-a-shujuxuanzejinru rotate"
        :class="[show ? `${getThemeColorFont}` : '']"
      ></i>
    </view>
    <u-popup
      :show="show"
      mode="bottom"
      :round="multiple ? 15 : 0"
      @open="open"
      @close="closePopup"
      :closeOnClickOverlay="true"
    >
      <section class="apiotSelectDown__div">
        <view class="apiotSelectDown__div--content">
          <view
            v-for="(item, index) in showList"
            :key="index"
            @click.stop="select(item, index)"
            class="apiotSelectDown__item"
          >
            <view
              class="apiotSelectDown__item--name"
              :class="[multiple ? '' : 'center']"
            >
              <data-types
                :icon="item.icon"
                :fontColor="item.fontColor"
                :value="item[showProp]"
                :mode="dropDownStyle === 2 ? 1 : dropDownStyle"
              ></data-types>
            </view>
            <i
              v-if="
                checkList.findIndex(
                  (check) => check[valueProp] === item[valueProp]
                ) !== -1 && multiple
              "
              class="appIcon appIcon-xialagouxuan"
              :style="{ color: themeColor }"
            ></i>
          </view>
        </view>
        <footer
          class="apiotSelectDown__div--footer"
          :class="[multiple ? 'hasPadding' : 'hasNoPadding']"
        >
          <div class="btn">
            <apiot-button
              :custom-style="{
                width: '100%',
                background: multiple ? '#F1F3F6' : '',
                border: 'none',
                borderRadius: 'none',
              }"
              :hairline="false"
              @click="closePopup"
              >取消</apiot-button
            >
          </div>
          <div class="btn" v-if="multiple">
            <apiot-button
              :custom-style="{
                width: '100%',
              }"
              type="primary"
              @click="confirm"
              >确定</apiot-button
            >
          </div>
        </footer>
      </section>
    </u-popup>
  </view>
</template>

<script>
import dataTypes from './compenets/dataTypes.vue';

export default {
  components: { dataTypes },

  props: {
    value: {
      type: [Number, String, Array],
      default: ''
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    placeholder: {
      type: String,
      default: '请选择'
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
    dropDownStyle: {
      // 显示风格 1-正常；2-主题背景色；3-有图标
      type: Number,
      default: 1
    }
  },

  data() {
    return {
      show: false,
      checkValues: '',
      oldCheckList: [],
      selectArry: []
    };
  },

  watch: {
    show(value) {
      this.$store.commit('setmaskOverhiddenClass', value);
    },
    value(newValue) {
      this.checkValues = newValue;
    }
  },

  computed: {
    checkList() {
      const { checkValues, valueProp, showProp, showList } = this;
      let values = '';
      if (typeof checkValues === 'string') values = checkValues.split(',');
      else if (typeof checkValues === 'number') values = [checkValues];
      else values = checkValues;
      const list = [];
      if (values && values.length > 0) {
        values.forEach((el) => {
          const listItem = showList.find((item) => `${item[valueProp]}` === `${el}`) || '';
          if (listItem) list.push(listItem);
          else if (el) {
            const obj = {};
            obj[valueProp] = el;
            obj[showProp] = el;
            list.push(obj);
          }
        });
      }
      return list;
    },
    showIcon() {
      return this.checkList.length > 0 && this.dropDownStyle !== 1 ? this.checkList[0] : '';
    },
    showValue() {
      return this.checkList.length > 0 ? this.checkList[0][this.showProp] : this.value;
    },
    showValueList() {
      const { value = [], valueProp, showProp, showList } = this;
      if (!value) return [];
      let values = '';
      if (typeof value === 'string') values = value.split(',');
      else if (typeof value === 'number') values = [value];
      else values = value;
      const list = [];
      values.forEach((el) => {
        const listItem = showList.find((item) => `${item[valueProp]}` === `${el}`) || '';
        if (listItem) list.push(listItem);
        else {
          const obj = {};
          obj[valueProp] = el;
          obj[showProp] = el;
          list.push(obj);
        }
      });
      return list;
    },
    showList() {
      const { list, dicList, dictKey } = this;
      if (dictKey) return dicList;
      return list;
    },
    dicList() {
      const { dictKey } = this;
      return this.$store.getters.getCurDict(dictKey) || [];
    },
    themeColor() {
      return this.$store.state.base.themeColor;
    },
    getThemeColorFont() {
      return this.$store.getters.getThemeColorFont;
    }
  },

  methods: {
    open() {},
    closePopup() {
      this.show = false;
    },
    showPopup() {
      const { disabled, readonly } = this;
      if (disabled || readonly) return '';
      this.show = true;
    },
    select(val) {
      const { multiple, checkList, valueProp } = this;
      let list = [...checkList];
      if (multiple) {
        const index = list.findIndex((item) => val === item[valueProp]);
        if (index !== -1) list.splice(index);
        else list.push(val);
        const checkValues = [];
        list.forEach((element) => {
          checkValues.push(element[valueProp]);
        });
        this.checkValues = checkValues.join(',');
      } else {
        list = [val];
        this.checkValues = val[valueProp];
        this.$emit('input', this.checkValues);
        this.$emit('change', this.checkValues);
        this.$emit('select', list);
        this.show = false;
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.selectArry = [...list];
    },
    confirm() {
      const { checkValues } = this;
      this.$emit('input', checkValues);
      this.$emit('change', checkValues);
      this.$emit('select', this.selectArry);
      this.show = false;
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
.apiotSelectDown {
  width: 100%;
  font-size: $form-el-fontSize;
  font-family: PingFangSC-Regular, PingFang SC;
  color: $form-el-valueColor;
  text-align: left;
  &.disabled {
    .apiotSelectDown__value {
      background: $form-el-disabled;
      padding-left: $form-el-disabled-left;
      color: $form-el-disabled-valueColor;
    }
  }
  &__value {
    margin: 10rpx 0;
    height: $form-el-height;
    // line-height: $form-el-height;
    display: flex;
    align-items: center;
    &--content {
      flex: 1;
    }
    .appIcon-a-shujuxuanzejinru {
      color: $form-el-placeholderColor;
      font-size: 20px;
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
    &:before {
      content: '';
      display: block;
      height: 15px;
      border-top-left-radius: 15px;
      border-top-right-radius: 15px;
      background: #ffffff;
    }
    &--content {
      max-height: 680rpx;
      overflow: auto;
    }
    &--footer {
      &.hasNoPadding {
        background: #f6f6f8;
      }
      &.hasPadding {
        padding: 19rpx 33rpx;
        .btn {
          flex: 1;
          &:first-child {
            margin-right: 20rpx;
          }
        }
      }
      padding-top: 20rpx;

      display: flex;

      .btn {
        flex: 1;
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
      &.center {
        text-align: center;
      }
    }
  }
  .rotate {
    transform: rotate(90deg);
  }
}
</style>
