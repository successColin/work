<!--
 * @Descripttion: 轮播图
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:44:26
-->
<template>
  <div class="myCarousel">
    <!-- login -->
    <img
        class="myCarousel__login"
        :style="`height:${configs.loginLogoWidth}px`"
        :src="getLogoUrl" alt="" />
    <!-- 轮播内容 -->
    <el-carousel :height="height" arrow="always">
      <el-carousel-item v-for="(item,i) in getLoops" :key="i">
        <img :src="item.src" style="height: 100%; width: 100%" alt="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
// 引入 logo 图， 图片
import loginImg from '@/assets/img/pcLoginLog.png';
import img from '@/assets/img/1.png';

export default {
  props: {
    configs: {
      type: Object,
      default: () => {}
    },
    // 轮播图高度
    height: {
      type: String,
      default: '100vh'
    },
    // 轮播图图片
    picArr: {
      type: Array,
      default: () => [{ src: img }, { src: img }, { src: img }]
    },
    // 轮播图logo
    loginUrl: {
      type: String,
      default: loginImg
    }
  },
  computed: {
    getLogoUrl() {
      const url = this.configs.loginLogo;
      return url ? url.substr(0, url.length - 1) : this.loginUrl;
    },
    getLoops() {
      const urls = this.configs.loginLoopMaps;
      if (!urls) return this.picArr;
      const arr = urls.split(',');
      if (!arr.length) return this.picArr;
      const loops = [];
      arr.forEach((item) => {
        if (item) {
          loops.push({ src: item });
        }
      });
      return loops;
    }
  }
};
</script>
<style lang='scss' scoped>
.myCarousel {
  min-width: 420px;
  width: 25vw;
  &__login {
    width: 90px;
    height: 24px;
    position: fixed;
    z-index: 99;
    margin: 49px 0 0 71px;
  }
  ::v-deep {
    // 轮播图
    .el-carousel__arrow--right,
    .el-carousel__arrow--left {
      display: none;
    }
    .el-carousel__button {
      margin-bottom: 50px;
      width: 6px;
      height: 6px;
      background: #aeb6c2;
      border-radius: 3px;
    }
    .el-carousel__indicators {
      .is-active {
        .el-carousel__button {
          width: 12px;
          height: 6px;
          background: #4689f5 !important;
          border-radius: 3px;
        }
      }
    }
  }
}
</style>
