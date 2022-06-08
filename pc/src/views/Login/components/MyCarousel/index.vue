<!--
 * @Descripttion: 轮播图
 * @Author: ytx
 * @Date: 2021-04-12 12:53:46
 * @LastEditors: tjf
 * @LastEditTime: 2021-04-22 16:44:26
-->
<template>
  <!-- min-width: 420px;
  width: 25vw; -->
  <div class="myCarousel" :style="{ width, minWidth }">
    <!-- login -->
    <img
      class="myCarousel__login"
      :style="`height: calc(${configs.loginLogoWidth / 12}rem)`"
      :src="getLogoUrl"
      alt=""
    />
    <!-- 轮播内容 -->
    <el-carousel
      :height="height"
      arrow="always"
      :indicator-position="positionVal"
    >
      <el-carousel-item v-for="(item, i) in getLoops" :key="i">
        <div
          :style="{ backgroundImage: `url(${item.src})` }"
          class="myCarousel__img"
        ></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
// 引入 logo 图， 图片
import loginImg from '@/assets/img/pcLoginLog.png';
import img1 from '@/assets/img/carousel1.png';
import img2 from '@/assets/img/carousel2.png';
import img3 from '@/assets/img/carousel3.png';

export default {
  props: {
    type: {
      type: Number,
      default: 1
    },
    configs: {
      type: Object,
      default: () => {}
    },
    // 轮播图高度
    height: {
      type: String,
      default: '100vh'
    },
    width: {
      type: String,
      default: '25vw'
    },
    minWidth: {
      type: String
    },
    // 轮播图图片
    picArr: {
      type: Array,
      default: () => {}
    },
    // 轮播图logo
    loginUrl: {
      type: String,
      default: loginImg
    }
  },
  computed: {
    positionVal() {
      return this.getLoops.length === 1 ? 'none' : '';
    },
    getLogoUrl() {
      const url = this.configs.loginLogo;
      return url ? url.substr(0, url.length - 1) : this.loginUrl;
    },
    getLoops() {
      const urls = this.configs.loginLoopMaps;
      if (!urls) {
        if (this.type === 1) {
          return [{ src: img1 }];
        }
        if (this.type === 2) {
          return [{ src: img2 }];
        }
        if (this.type === 3) {
          return [{ src: img3 }];
        }
      }
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
  &__login {
    // width: 90px;
    height: $remto24px;
    position: fixed;
    z-index: 99;
    margin: $remto60px 0 0 $remto50px;
  }
  &__img {
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
  }
  ::v-deep {
    // 轮播图
    .el-carousel__arrow--right,
    .el-carousel__arrow--left {
      display: none;
    }
    .el-carousel__button {
      margin-bottom: $remto50px;
      width: $remto6px;
      height: $remto6px;
      background: #aeb6c2;
      border-radius: $remto3px;
    }
    .el-carousel__indicators {
      .is-active {
        .el-carousel__button {
          width: $remto12px;
          height: $remto6px;
          // background: #4689f5 !important;
          background: $loginThemeColor !important;
          border-radius: $remto3px;
        }
      }
    }
  }
}
</style>
