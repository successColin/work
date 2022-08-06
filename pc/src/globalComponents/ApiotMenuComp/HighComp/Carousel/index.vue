<template>
  <div
    class="carousel"
    :id="configData.compId"
    :style="getStyle"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput"
  >
    <el-carousel
      v-if="!isConfig"
      :class="`carousel__box type__${configData.indicatorType}`"
      :initial-index="activeIndex"
      :height="`${configData.heightMul * 82}px`"
      :type="`${configData.showType === 2 ? 'card' : ''}`"
    >
      <el-carousel-item v-for="item in getImgArr" :key="item.parperId">
        <!-- <img :src="" alt="" /> -->
        <div
          class="imgBox"
          :class="[{ hasRadius: configData.borderType === 2 }]"
          :style="`backgroundImage:url(${$parseImgUrl(item.imgUrl)})`"
          @click="targetUrl(item)"
        ></div>
      </el-carousel-item>
    </el-carousel>
    <div class="carousel__config" v-if="isConfig">轮播图占位</div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      curCompType: 2,
      activeIndex: 0
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    getStyle() {
      let style = '';
      if (this.configData.width) {
        style += `width:${this.configData.width};`;
      }
      if (this.configData.heightMul) {
        style += `height:${this.configData.heightMul * 82}px;`;
      }
      return style;
    },
    getImgArr() {
      const arr = [];
      this.configData.imgArr.forEach((item) => {
        if (item.imgUrl) {
          arr.push(item);
        }
      });
      return arr;
    }
  },

  mounted() {
    // console.log(this.$parseLocation(this.getImgArr[0].imgUrl));
  },

  methods: {
    targetUrl(item) {
      if (item.targetUrl) {
        window.open(item.targetUrl);
      } else {
        this.$message({
          type: 'warning',
          message: '未配置跳转地址'
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.carousel {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  padding: 2px 15px 18px 15px;
  &.noHover {
    padding: 0px 15px 18px 35px;
  }
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  &__config {
    box-sizing: border-box;
    padding: 8px 12px;
    height: 82px;
    word-break: break-all;
  }
  &__box {
    .imgBox {
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
      &.hasRadius {
        border-radius: 4px;
      }
    }
    &.type__1 {
      ::v-deep {
        .el-carousel__indicators {
          .el-carousel__button {
            width: 18px;
            background-color: rgba(0, 0, 0, 0.3);
            &.is-active {
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
          li.is-active {
            .el-carousel__button {
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
    &.type__2 {
      ::v-deep {
        .el-carousel__indicators {
          .el-carousel__button {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
          }
          li.is-active {
            .el-carousel__button {
              width: 14px;
              border-radius: 12px;
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
    &.type__3 {
      ::v-deep {
        .el-carousel__indicators {
          counter-reset: num;
          li .el-carousel__button:before {
            counter-increment: num;
            content: counter(num);
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            display: flex;
            align-items: center;
            color: #fff;
            justify-content: center;
          }
          .el-carousel__button {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.3);
          }
          li.is-active {
            .el-carousel__button {
              background-color: rgba(0, 0, 0, 0.6);
            }
          }
        }
      }
    }
  }
}
</style>
