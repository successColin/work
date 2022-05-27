/**
* @name: index
* @author: DELL
* @date: 2021/11/13 11:31
* @description：index
* @update: 2021/11/13 11:31
*/
<!-- 页面 -->
<template>
  <div class="colorPickerWrap" :class="{ singleColorPicker: !colorValue }">
    <el-color-picker
      v-bind="$attrs"
      v-on="$listeners"
      :predefine="predefineColors"
      :show-alpha="true"
    >
    </el-color-picker>
    <div class="name" v-if="colorValue">{{ colorValue }}</div>
  </div>
</template>

<script>
import { predefineColors } from '@/views/HomeMenuConfig/constants/global';

export default {
  inheritAttrs: false,
  props: {
    colorValue: {
      type: String,
      default: ''
    },
    predefineColors: {
      type: Array,
      default: () => predefineColors
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.colorPickerWrap {
  display: flex;
  align-items: center;
  width: 100%;
  border: 1px solid #e9e9e9;
  box-sizing: border-box;

  &:hover {
    border: 1px solid #e9e9e9;
  }

  ::v-deep {
    .el-color-picker {
      height: 32px;
      width: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .el-color-picker__trigger {
      width: 30px;
      height: 30px;
      border: none;
    }

    .el-color-picker__color {
      border: none;
    }
  }

  .name {
    margin-left: 10px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
  }
}

.singleColorPicker {
  display: inline-block;
  height: 32px;
  width: 32px;
  border: 1px solid #e9e9e9;
  box-sizing: unset;
}
</style>
