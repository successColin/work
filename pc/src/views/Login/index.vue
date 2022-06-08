<!--
 * @Descripttion: 平铺式轮播风格 和 卡片式轮播风格
 * @Author: ytx
 * @Date: 2022-06-06 14:20:30
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-06 14:20:30
-->
<template>
  <div>
    <tiled-login :configs="configs" v-if="configs.style === '1'"></tiled-login>
    <card-login
      :configs="configs"
      :styleWidthObj="styleWidthObj"
      v-else-if="configs.style === '2'"
    ></card-login>
  </div>
</template>

<script>
import { stylePercentageArr, selectColorArr } from '@/config';
import { getLoginConfig } from '@/api/login';
import TiledLogin from './TiledLogin';
import CardLogin from './CardLogin';

export default {
  data() {
    return {
      configs: {}
    };
  },
  components: {
    TiledLogin,
    CardLogin
  },
  beforeMount() {
    this.fetchConfig();
  },
  computed: {
    styleWidthObj() {
      const obj = stylePercentageArr.find(
        (item) => String(item.value) === this.configs.stylePercentage
      );
      return obj;
    }
  },
  methods: {
    async fetchConfig() {
      const res = (await getLoginConfig()) || [];
      // console.log(res);
      const obj = {};
      res.forEach((item) => {
        const { attributeKey, attributeValue } = item;
        obj[attributeKey] = attributeValue;
        this.configs = obj;
      });
      const themeColor = this.configs.themeColor
        ? selectColorArr[Number(this.configs.themeColor) - 1]
        : '#4689f5';
      console.log(themeColor);
      if (themeColor) {
        this.$store.commit('changeLoginThemeColor', themeColor);
      }
    }
  }
};
</script>
<style lang='scss' scoped>
::v-deep {
  .el-button--primary {
    background-color: $loginThemeColor;
  }
}
</style>
