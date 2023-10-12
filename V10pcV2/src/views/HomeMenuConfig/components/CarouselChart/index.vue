/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div
      class="singleTextWrap"
      :id="`basicPie_${config.componentId}`"
      :style="getContentStyles"
  >
    <el-carousel
        :height="`${config.height - 40}px`"
        :indicator-position="config.stylesObj.indicatorPosition"
        :autoplay="config.stylesObj.autoplay"
        :interval="config.stylesObj.interval * 1000"
        :arrow="config.stylesObj.arrow"
        :loop="config.stylesObj.loop"
        :type="config.stylesObj.type"
        :direction="config.stylesObj.direction"
        :class="`carousel__box type__${config.stylesObj.indicatorType}`"
    >
      <el-carousel-item v-for="(item, i) in getLoopImages" :key="item.parperId || i">
        <div
            class="imgBox"
            :style="`backgroundImage:url(${$parseImgUrl(item.imgUrl)})`"
        ></div>
      </el-carousel-item>
    </el-carousel>
    <div class="pieHook"></div>
  </div>
</template>

<script>
import { menuProperties } from '../../constants/global';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return menuProperties;
      }
    },
    config: {
      type: Object,
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      instance: null,
      observer: null,
      recordOldValue: { // 记录下旧的宽高数据，避免重复触发回调函数
        width: '0',
        height: '0'
      },
      supplementaryColor: [] // 补充色
    };
  },

  components: {
  },

  computed: {
    getContentStyles() {
      const {
        width,
        height
      } = this.config;
      return `width:${width}px;height:${height}px;`;
    },
    getLoopImages() {
      const { imgArr = [], dataType = 1, SqlDataConfig = { } } = this.config;
      if (dataType === 1) return imgArr;
      if (dataType === 3) {
        const { SQLFilterResponse = '[]' } = SqlDataConfig;
        let lastArr = null;
        try {
          let arr = JSON.parse(SQLFilterResponse);
          if (!(Array.isArray(arr) && arr.length)) {
            arr = [];
          }
          lastArr = arr;
        } catch (e) {
          lastArr = [];
        }
        return lastArr;
      }
      return imgArr;
    }
  },
  beforeMount() {},
  mounted() {
    // const MutationObserver = window.MutationObserver ||
    //     window.WebKitMutationObserver || window.MozMutationObserver;
    // const element = document.querySelector(`#basicPie_${this.config.componentId}`);
    // this.observer = new MutationObserver(() => {
    //   const width = getComputedStyle(element).getPropertyValue('width');
    //   const height = getComputedStyle(element).getPropertyValue('height');
    //   if (width === this.recordOldValue.width && height === this.recordOldValue.height) {
    //     return;
    //   }
    //   this.recordOldValue = {
    //     width,
    //     height
    //   };
    // });
    // this.observer.observe(element, {
    //   attributes: true,
    //   attributeFilter: ['style'],
    //   attributeOldValue: true
    // });
    // console.log(this.config);
  },
  watch: {
    // config: {
    //   deep: true,
    //   handler(val) {
    //     console.log(val);
    //   }
    // }
  },
  methods: {},
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer.takeRecords();
      this.observer = null;
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: relative;
  overflow: hidden;
  display: flex;
  padding: 20px;
  align-items: center;
  box-sizing: border-box;

  .singleTextContent {
    width: calc(100% - 40px);
    height: calc(100% - 40px);
    position: relative;
    margin: 0 auto;
  }

  .pieHook {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
  }
  & .type__1 {
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
  & .type__2 {
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
  & .type__3 {
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
  .imgBox {
    width: 100%;
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  ::v-deep {
    .el-carousel{
      width: 100%;
    }
  }
}
</style>
