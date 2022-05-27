<!--
 * @Author: sss
 * @Date: 2021-12-20 16:44:51
 * @Last Modified by: sss
 * @Last Modified time: 2021-12-20 16:44:51
 * @Desc: 列表-字典项
-->
<template>
  <view class="typeColumn">
    <view
      class="type"
      v-for="(type, index) in showValue"
      :key="index"
      :style="[
        typeStyle,
        {
          backgroundColor: hornType !== 0 ? type.color : '',
          color: hornType !== 0 ? type.fontColor : '',
        },
      ]"
    >
      <span
        class="type__icon"
        v-if="enableDictIcon && type.icon && type.icon.icon"
      >
        <label-icon
          :name="type.icon.icon"
          :color="type.icon.color"
          customPrefix="iconfont"
          :size="size"
        ></label-icon>
      </span>
      {{ type.name }}
    </view>
  </view>
</template>

<script>
import LabelIcon from './LabelIcon';

export default {
  name: 'typeColumn',
  components: { LabelIcon },

  props: {
    value: [String, Number, Array],
    // 对应取值key，至于value为数组对象时才可以传
    prop: {
      type: String,
      default: ''
    },
    // 字段名对应的转换文案
    typesPropName: {
      type: String,
      default: ''
    },
    // 样式 0-没有样式，1-圆角，2-椭圆（50%）
    hornType: {
      type: [String, Number],
      default: 2
    },
    // 大小 以px为定位
    size: {
      type: Number,
      default: 14
    },
    // 是否显示字典图标
    enableDictIcon: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {};
  },

  computed: {
    // type样式
    typeStyle() {
      const { hornType } = this;
      const style = {};
      if (hornType === 1) {
        style.padding = '9rpx 20rpx';
        style.borderRadius = '8rpx';
      } else if (hornType === 2) {
        style.padding = '9rpx 20rpx';
        style.borderRadius = '100px';
      }
      return style;
    },
    typesPropArr() {
      return this.$store.getters.getCurDict(this.typesPropName);
    },
    // 值
    valueArry() {
      const { value, prop } = this;
      // 如果是数组
      if (Array.isArray(value)) {
        let arry = [];
        // 如果有prop需要在数组中取出对应的值
        if (prop) {
          value.forEach((item) => {
            arry.push(item[prop]);
          });
        } else {
          arry = [...value];
        }
        return arry;
      }
      // 如果是字符串并且其中有“,”隔开
      if (typeof value === 'string' && value.indexOf(',')) {
        return value.split(',');
      }
      return [value];
    },
    // 显示的值
    showValue() {
      const { typesPropName, valueArry, typesPropArr } = this;

      const types = [];
      valueArry.forEach((item) => {
        let dict = {};
        if (typesPropName && typesPropArr) {
          dict = typesPropArr.find((value) => value.value === item) || {};
        }
        types.push({ name: item, value: item, ...dict });
      });
      return types;
    }
  },

  methods: {},

  mounted() {}
};
</script>

<style lang='scss' scoped>
.type {
  display: flex;
  align-items: center;
  &__icon {
    margin-right: 14rpx;
    flex-shrink: 0;
  }
}
</style>
