<!--
 * @Descripttion: 平铺式轮播风格 和 卡片式轮播风格
 * @Author: ytx
 * @Date: 2022-06-06 14:20:30
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-06 14:20:30
-->
<template>
  <div>
    <card-login
      :configs="configs"
      :styleWidthObj="styleWidthObj"
      v-if="configs.style === '2'"
    ></card-login>
    <tiled-login :configs="configs" v-if="configs.style === '1'"></tiled-login>
  </div>
</template>

<script>
import { stylePercentageArr } from '@/config';
import CardLogin from './CardLogin';
import TiledLogin from './TiledLogin';

export default {
  data() {
    return {};
  },
  components: {
    TiledLogin,
    CardLogin
  },
  computed: {
    styleWidthObj() {
      const obj = stylePercentageArr.find(
        (item) => String(item.value) === this.configs.stylePercentage
      );
      return obj;
    },
    configs() {
      const { loginConfig } = this.$store.state.base;
      return loginConfig;
    }
  },
  methods: {},
  mounted() {}
};
</script>
<style lang='scss' scoped>
::v-deep {
  .el-button--primary {
    background-color: $loginThemeColor;
  }
  .el-button--primary.is-disabled {
    background-color: $loginThemeLighten !important;
    border-color: $loginThemeLighten !important;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: $loginThemeColor;
    border-color: $loginThemeColor;
  }
  .el-input__inner:focus {
    border-color: $loginThemeColor;
  }
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: $loginThemeColor !important;
  }
  .icon-mimayincang:hover {
    color: $loginThemeColor !important;
  }
}
</style>
