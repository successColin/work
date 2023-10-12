/**
* @name: index
* @author: DELL
* @date: 2021/12/7 16:33
* @description：index
* @update: 2021/12/7 16:33
*/
<!-- 页面 -->
<template>
  <div class="wrap">
    <div class="layoutWrap">
      <div
          :class="{leftFlag:leftFlag,topFlag: topFlag,rightFlag: rightFlag,bottomFlag:bottomFlag}"
          class="contentBorder"
      >
        <div class="top">
          <span
              class="num"
              v-if="!topFlag"
              @click="clickTop('topFlag', 'topInput')"
          >{{ topValue }}</span>
          <apiot-input
              ref="topInput"
              v-if="topFlag"
              @blur="(e) => topBlur(e.target.value, 'topFlag', 'gridTop')"
              type="number"
              v-model="top"
              :min="1"
          />
        </div>
        <div class="left">
          <span
              class="num"
              v-if="!leftFlag"
              @click="clickTop('leftFlag', 'leftInput')"
          >{{ leftValue }}</span>
          <apiot-input
              ref="leftInput"
              v-if="leftFlag"
              @blur="(e) => topBlur(e.target.value, 'leftFlag', 'gridLeft')"
              type="number"
              v-model="left"
              :min="1"
          />
        </div>
        <div class="bottom">
          <span
              class="num"
              v-if="!bottomFlag"
              @click="clickTop('bottomFlag', 'bottomInput')"
          >{{ bottomValue }}</span>
          <apiot-input
              ref="bottomInput"
              v-if="bottomFlag"
              @blur="(e) => topBlur(e.target.value, 'bottomFlag', 'gridBottom')"
              type="number"
              v-model="bottom"
              :min="1"
          />
        </div>
        <div class="right">
          <span
              class="num"
              v-if="!rightFlag"
              @click="clickTop('rightFlag', 'rightInput')"
          >{{ rightValue }}</span>
          <apiot-input
              ref="rightInput"
              v-if="rightFlag"
              @blur="(e) => topBlur(e.target.value, 'rightFlag', 'gridRight')"
              type="number"
              v-model="right"
              :min="1"
          />
        </div>
        <div class="contentWrap"></div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    topValue: {
      type: Number
    },
    leftValue: {
      type: Number
    },
    rightValue: {
      type: Number
    },
    bottomValue: {
      type: Number
    }
  },
  data() {
    return {
      topFlag: false,
      leftFlag: false,
      rightFlag: false,
      bottomFlag: false,
      right: '',
      left: '',
      top: '',
      bottom: ''
    };
  },

  components: {},

  computed: {},

  watch: {
    topValue: {
      handler() {
        this.top = this.topValue;
      }
    },
    leftValue: {
      handler() {
        this.left = this.leftValue;
      }
    },
    rightValue: {
      handler() {
        this.right = this.rightValue;
      }
    },
    bottomValue: {
      handler() {
        this.bottom = this.bottomValue;
      }
    }
  },
  mounted() {
    this.right = this.rightValue;
    this.left = this.leftValue;
    this.top = this.topValue;
    this.bottom = this.bottomValue;
  },

  methods: {
    clickTop(flag, domKey) {
      this[flag] = true;
      this.$nextTick(() => {
        this.$refs[domKey].focus();
      });
    },
    topBlur(value, flag, type) {
      this[flag] = false;
      this.$emit('change', { value: value ? Number(value) : 0, type });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.wrap {
  position: relative;

  .top {
    position: absolute;
    width: 100%;
    height: 40px;
    top: -40px;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  .bottom {
    position: absolute;
    width: 100%;
    height: calc((130px - 50px) / 2);
    bottom: -40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .left {
    position: absolute;
    left: -55px;
    width: 55px;
    height: 130px;
    top: -40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .right {
    position: absolute;
    right: -55px;
    width: 55px;
    height: 130px;
    top: -40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .layoutWrap {
    width: 252px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #D9D9D9;
    box-sizing: border-box;

    .contentBorder {
      position: relative;
      border-top: 40px solid transparent;
      border-right: 55px solid transparent;
      border-bottom: 40px solid transparent;
      border-left: 55px solid transparent;

      &.leftFlag {
        border-left: 55px solid #e9e9e9;
      }

      &.rightFlag {
        border-right: 55px solid #e9e9e9;
      }

      &.topFlag {
        border-top: 40px solid #e9e9e9;
      }

      &.bottomFlag {
        border-bottom: 40px solid #e9e9e9;
      }

      .num {
        color: #333333;
        cursor: pointer;
      }

      ::v-deep {
        .apiotInput {
          text-align: center;
        }
        .el-input__inner {
          width: 40px;
          padding: 0;
          text-align: center;
          background-color: #fff;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      }
    }

    .contentWrap {
      width: 150px;
      height: 50px;
      position: relative;
      border: 1px solid #D9D9D9;
      box-sizing: border-box;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 23.5px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #D9D9D9;
        transform-origin: bottom center;
        transform: rotateZ(
                18deg
        ) scale(1.05);
      }

      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 21.5px;
        width: 100%;
        box-sizing: border-box;
        border-bottom: 1px solid #D9D9D9;
        transform-origin: bottom center;
        transform: rotateZ(
                162deg
        ) scale(1.05);
      }
    }
  }

}
</style>
