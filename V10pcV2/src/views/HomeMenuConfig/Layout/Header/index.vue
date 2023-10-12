/**
* @name: index
* @author: DELL
* @date: 2022/3/28 15:08
* @description：index
* @update: 2022/3/28 15:08
*/
<!-- 页面 -->
<template>
  <div class="header">
    <div class="header__return">
      <apiot-button type="text" @click="handleBack">
        <i class="iconfont icon-fanhui"></i>{{ $t('common.return') }}
      </apiot-button>
    </div>
    <div class="header__pageName">{{ $route.query.name || '自定义页面配置'}}</div>
    <div class="header__scale">
      <div class="header__scale--autoZoom">
        <apiot-select
          :options="getOptions"
          v-model="selectScale"
          @change="changeSelectSacle"
        ></apiot-select>
      </div>
      <div class="header__scale--slider">
        <div @click="doReduce"><span class="icon-suoxiao iconfont"></span></div>
        <div class="slider">
          <el-slider
            :value="reduceScale"
            :step="4"
            :min="1"
            :max="getMax"
            @input="changeScale"
            @change="change"
          ></el-slider>
        </div>
        <div @click="doAdd"><span class="icon-fangda iconfont"></span></div>
      </div>
    </div>
    <div class="header__btn">
      <apiot-button @click="handlePreview"> 预览 </apiot-button>
      <apiot-button type="primary" @click="handleSave"> 保存 </apiot-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    scale: {
      // 缩放比列
      type: Number,
      default: 1
    },
    autoScale: { // 是否是自适应
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      timer: null,
      selectScale: 0, // 默认自适应
    };
  },

  components: {},

  computed: {
    getOptions() {
      const { clientType } = sessionStorage;
      const arr = [
        {
          name: '自适应',
          value: 0
        },
        {
          name: '20%',
          value: 0.2
        },
        {
          name: '40%',
          value: 0.4
        },
        {
          name: '60%',
          value: 0.6
        },
        {
          name: '80%',
          value: 0.8
        },
        {
          name: '100%',
          value: 1
        }
      ];
      const arr1 = [{
        name: '120%',
        value: 1.2
      }, {
        name: '140%',
        value: 1.4
      }, {
        name: '160%',
        value: 1.6
      }, {
        name: '180%',
        value: 1.8
      }, {
        name: '200%',
        value: 2
      }];
      if (+clientType === 2) return [...arr, ...arr1];
      return arr;
    },
    getMax() {
      const { clientType } = sessionStorage;
      if (+clientType === 2) return 200;
      return 100;
    },
    reduceScale() {
      const value = this.scale * 100;
      return Math.floor(value);
    },
    resetScale() {
      return function(v) {
        return Number((v / 100).toFixed(2));
      };
    }
  },

  mounted() {
    const { clientType } = sessionStorage;
    if (+clientType !== 1) {
      this.selectScale = 1;
    }
  },

  methods: {
    handleSave() {
      // 保存
      this.$emit('doSave');
    },
    handlePreview() {
      // 预览
      this.$emit('doPreview');
    },
    handleBack() {
      // 返回
      this.$emit('doBack');
    },
    change(v) { // 鼠标松开的值
      this.isAuto = false;
      this.selectScale = 1;
      this.commonScale(v);
      const newValue = this.resetScale(v);
      this.$emit('changeScaleObj', { value: newValue, isAuto: false });
    },
    changeScale(v) { // 鼠标拖动的值
      // 改变缩放比列
      const newValue = this.resetScale(v);
      this.$emit('changeSliderScale', newValue);
    },
    doReduce() {
      // 减
      let value = this.reduceScale - 4;
      if (value < 0) {
        value = 0;
      }
      this.isAuto = false;
      this.selectScale = 1;
      this.commonScale(value);
      const newValue = this.resetScale(value);
      this.$emit('changeScale', newValue);
    },
    doAdd() {
      // 加
      let value = this.reduceScale + 4;
      const max = this.getMax;
      if (value > max) {
        value = max;
      }
      this.isAuto = false;
      this.selectScale = 1;
      console.log(value);
      this.commonScale(value);
      const newValue = this.resetScale(value);
      this.$emit('changeScale', newValue);
    },
    commonScale(value) {
      if (!this.isAuto && this.selectScale !== 0) {
        const { clientType } = sessionStorage;
        const a1 = [20, 40, 60, 80, 100];
        const a2 = [120, 140, 160, 180, 200];
        const limitArr = +clientType === 2 ? [...a1, ...a2] : a1;
        if (limitArr.includes(value)) {
          this.selectScale = value / 100;
        } else {
          this.selectScale = `${value}%`;
        }
      } else {
        this.selectScale = 0;
      }
    },
    changeSelectSacle(v) {
      // 下拉选择缩放比列
      if (v === 0) {
        this.isAuto = true;
        this.$emit('resetScale');
      } else {
        this.isAuto = false;
        this.$emit('changeScale', v);
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.header {
  width: 100%;
  height: 46px;
  display: flex;
  position: absolute;
  top: 0;
  align-items: center;
  background: #ffffff;
  z-index: 2;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);

  &__return {
    width: 100px;
    height: 46px;
    text-align: center;
    line-height: 46px;
    box-shadow: inset -1px 0px 0px 0px #ebebeb;

    ::v-deep {
      .el-button--text {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }

      .icon-fanhui {
        margin-right: 9px;
        color: #bbc3cd;
      }
    }

    &:hover {
      ::v-deep {
        .icon-fanhui {
          color: #4689f5;
        }

        .el-button--text {
          color: #4689f5;
        }
      }
    }
  }

  &__pageName {
    margin-left: 20px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }

  &__scale {
    position: absolute;
    display: flex;
    height: 46px;
    left: 50%;
    align-items: center;
    transform: translateX(-50%);

    &--slider {
      align-items: center;
      width: 236px;
      height: 28px;
      margin-left: 10px;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      border-radius: 4px;
      border: 1px solid #e9e9e9;

      .iconfont {
        font-size: 18px;
        //color: #FFFFFF;
        cursor: pointer;
        color: #bbc3cd;

        &:hover {
          color: #4689f5;
        }
      }

      .slider {
        width: 140px;

        ::v-deep {
          .el-slider__button {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #4689f5;
            box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.3);
            border: 2px solid #ffffff;
          }

          .el-slider__bar {
            background: linear-gradient(90deg, #4689f5 0%, #4689f5 100%);
          }
        }
      }
    }

    &--autoZoom {
      width: 92px;

      ::v-deep {
        .el-checkbox__label {
          font-size: 13px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }
      }
    }

    ::v-deep {
      .el-slider__runway {
        margin: 22px 0;
        border-radius: 4px;

        .el-slider__bar {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          background-color: #e9e9e9;
        }

        .el-slider__button-wrapper {
          top: -16px;
        }
      }
    }
  }

  &__btn {
    position: absolute;
    right: 14px;
    top: 0;
    height: 50px;
    display: flex;
    align-items: center;
    color: #fff;
  }
}
</style>
