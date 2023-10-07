/**
* @name: scrollNumber
* @author: DELL
* @date: 2023/9/16 10:26
* @description：scrollNumber
* @update: 2023/9/16 10:26
*/
<!-- 页面 -->
<template>
  <div class="numberBox">
    <div
        v-for="(item, index) in numberList"
        :key="index"
        class="numberItem"
        :style="numberListStyles(item)"
    >
      <span v-if="isNaN(item)">{{ item }}</span>
      <div class="number" v-else :style="numberStyles">
        <div class="numberWrap" :style="numberWrapStyles">
          <span
              ref="numberItem"
              :style="numberItemStyles"
              :data-number="item"
              :data-index="index"
          >0123456879</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: 0
    },
    config: {}
  },
  watch: {
    value(newVal) {
      console.log(newVal, 'newVal');
      if (newVal) {
        this.$nextTick(() => {
          this.setNumberTransform();
        });
      }
    }
  },
  computed: {
    numberStyles() {
      const { enableBackgroundImage, FontSize,contentWidth,contentHeight } = this.config;
      if (!enableBackgroundImage) return {};
      return {
        width: `${contentWidth}px`,
        height: `${contentHeight}px`,
        padding: `${(contentHeight - FontSize) / 2}px 0`
      }
    },
    numberWrapStyles() {
      // eslint-disable-next-line no-unused-vars
      const { enableBackgroundImage, FontSize } = this.config;
      return { height: `${FontSize}px`};
      // if (!enableBackgroundImage) {
      //   return { height: `${FontSize}px`};
      // }
      // return {};
    },
    numberListStyles() {
      return function (item) {
        const { enableBackgroundImage, bgUrl, distance } = this.config;
        if (!enableBackgroundImage) {
          return {
            margin: `0 ${distance}px`
          };
        }
        if (isNaN(item)) {
          return {
            // margin: `0 ${distance}px`
          };
        }
        return {
          background: `url(${bgUrl}) no-repeat center`,
          backgroundSize: '100% 100%',
          margin: `0 ${distance}px`
        }
      }
    },
    numberItemStyles() {
      const { enableBackgroundImage, FontSize } = this.config;
      if (!enableBackgroundImage) {
        return {
          fontSize: `${FontSize}px`,
          margin: `auto ${FontSize >= 32 ? -7 : -4}px`
        };
      }
      return {
        fontSize: `${FontSize}px`,
        margin: `auto ${FontSize >= 32 ? -7 : -4}px`
      };
    },
    numberList() {
      return String(this.value).split('');
    }
  },
  data() {
    return {};
  },
  methods: {
    // 设置每一位数字的偏移
    setNumberTransform() {
      let numberItems = this.$refs.numberItem;
      let obj = {};
      Array.from(numberItems).forEach(c => {
        let key = c.dataset.index;
        let value = c.dataset.number;
        let init = 0;
        obj[key] = setInterval(() => {
          if (init < value * 10) {
            init += 1;
            c.style.transform = `translateY(-${init}%)`;
          } else {
            clearInterval(obj[key]);
            obj[key] = null;
            if (value === '0') {
              c.style.transform = `translateY(-${0}%)`;
            }
          }
        }, 10);
      });
    }
  },
  mounted() {
    this.setNumberTransform();
  }
};
</script>

<style lang='scss' scoped>
.numberBox {
  overflow: hidden;
  display: flex;
}

.numberItem {
  //float: left;
  display: flex;
  align-items: center;
  //margin: 0 5px;
}

.number {

  overflow: hidden;
  box-sizing: border-box;
  position: relative;

  .numberWrap {
    text-align: center;
    overflow: hidden;
  }

  span {
    writing-mode: vertical-rl;
    text-orientation: upright;
    transform: translateY(0%);
  }
}
</style>
