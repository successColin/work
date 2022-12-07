/**
* @name: index
* @author: DELL
* @date: 2021/11/13 11:31
* @description：index
* @update: 2021/11/13 11:31
*/
<!-- 页面 -->
<template>
  <div class="colorPickerWrap" :class="{singleColorPicker: !colorValue}">
    <el-color-picker
        v-bind="$attrs"
        v-on="$listeners"
    >
    </el-color-picker>
    <div class="name" v-if="colorValue">{{renderColor}}</div>
  </div>
</template>

<script>
import { hexify, setRgbTo16 } from '@/utils/common';

export default {
  inheritAttrs: false,
  props: {
    colorValue: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    renderColor() {
      if (!this.colorValue) return '';
      if (/^rgb\(/.test(this.colorValue)) { // rgb格式
        return setRgbTo16(this.colorValue)
      }
      if (/^rgba\(/.test(this.colorValue)) { // rgba格式
        return hexify(this.colorValue);
      }
      if (/^#/.test(this.colorValue)) { // rgba格式
        return this.colorValue;
      }
      return '';
    }
  },

  mounted() {
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.colorPickerWrap {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid $component-border-color;
  box-sizing: border-box;
  &:hover{
    border: 1px solid $component-borderFocus-color;
  }
  ::v-deep{
    .el-color-picker__trigger{
      border: none;
    }
    .el-color-picker__color{
      border: none;
    }
  }
  .name {
    margin-left: 10px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }
}
.singleColorPicker{
  display: inline-block;
  height: 32px;
  width: 32px;
  border: 1px solid $component-border-color;
  box-sizing: unset;
}
</style>
