/**
* @name: index
* @author: DELL
* @date: 2022/8/4 10:48
* @description：index
* @update: 2022/8/4 10:48
*/
<!-- 页面 -->
<template>
  <div>
    <div class="ellipsisWrap flex propsSetting" >
      <span class="setTitle">{{title}}</span>
      <el-switch
          active-value="on"
          inactive-value="off"
          :value="enableValue"
          @change="changeEnable($event)"
          active-color="#4689F5"
          inactive-color="#183472">
      </el-switch>
    </div>
    <div v-if="isNeedRoadColor">
      <div class="setTitle">道路颜色</div>
      <c-color-picker
          size="small"
          show-alpha
          :value="roadColor"
          :colorValue="roadColor"
          @change="(value) => changeStyles(value, 'Color')"
          :predefine="predefineColors">
      </c-color-picker>
    </div>
    <div v-if="isNeedColor">
      <div class="setTitle">{{subtitle}}</div>
      <c-color-picker
          size="small"
          show-alpha
          :value="nameColor"
          :colorValue="nameColor"
          @change="(value) => changeStyles(value, 'NameColor')"
          :predefine="predefineColors">
      </c-color-picker>
    </div>
    <div style="margin-top: 4px;" v-if="isNeedFontSize">
      <c-input
          type="number"
          :numberValue="fontSize"
          @Input-Change="(value) => changeStyles(Number(value), 'NameFontSize')"/>
    </div>
  </div>
</template>

<script>
import {predefineColors} from '@/constants/global'

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    enableValue: { // 是否启用标识
      type: String,
      default: 'on'
    },
    fontSize: { // 字体大小
      type: Number,
      default: 16
    },
    nameColor: { // 字体颜色
      type: String,
      default: ''
    },
    roadColor: { // 道路颜色
      type: String,
      default: ''
    },
    isNeedFontSize: { // 是否需要字体大小
      type: Boolean,
      default: true
    },
    isNeedRoadColor: { // 是否需要字体大小
      type: Boolean,
      default: false
    },
    isNeedColor: { // 是否需要颜色
      type: Boolean,
      default: true
    },
    isNeedRailway: { // 是否需要字体大小
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      predefineColors
    };
  },

  components: {},

  computed: {
  },

  mounted() {},

  methods: {
    changeEnable(v) {
      this.$emit('changeEnable', v);
    },
    changeStyles(v, key) {
      this.$emit('changeStyles', { value: v, key });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.ellipsisWrap {
  justify-content: space-between;
  align-items: center;
}
.propsSetting {
  //margin-bottom: 10px;

  .businessWrap {
    .inputBox {
      width: 100%;
    }
  }

  .fontSizeWrap {
    display: flex;
    align-items: center;
    margin-top: 6px;

    ::v-deep {
      .selectWrap {
        flex: 0 0 170px;
        margin-right: 10px;

        .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
      }

      .CInputWrap {
        .el-input-number.is-controls-right .el-input__inner {
          padding-right: 23px;
        }
      }
    }
  }

  .borderWrap {
    display: flex;
    align-items: center;
    margin-top: 6px;

    ::v-deep {
      .selectWrap {
        flex: 0 0 calc(50% - 5px);

        .el-input__inner {
          height: 32px;
          line-height: 32px;
        }
      }

      .CInputWrap {
        flex: 0 0 calc(50% - 5px);
        margin-right: 10px;

        .el-input-number.is-controls-right .el-input__inner {
          padding-right: 23px;
        }
      }
    }
  }

  .alignWrap {
    width: 100%;
    display: flex;

    ::v-deep {
      .el-radio-button {
        width: calc(100% / 3);

        &.is-active {
          .el-radio-button__inner {
            background: $component-borderFocus-color !important;
            border-color: $component-borderFocus-color !important;
          }
        }

        .el-radio-button__inner {
          width: 100%;
          padding: 5px 15px;
          border-radius: 0;
          border-color: $component-border-color;
          background: $component-background-color;

          .iconfont {
            color: #FFFFFF;
            font-size: 18px;
          }
        }

        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: $component-background-color;
        }
      }
    }
  }

  .setTitle {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 30px;
    text-align: left;
    opacity: .7;
  }

  .InputWrap {
    display: flex;
    margin-top: 5px;
    width: 100%;
    align-items: center;
    justify-content: space-between;

    ::v-deep {
      .CInputWrap {
        width: 100%;
        display: flex;
        flex: 0 0 calc(50% - 8px);
        align-items: center;

        .inputBox {
          width: 100px;

          .el-input-number {
            width: 100px;

            .el-input__inner {
              padding-left: 15px;
              padding-right: 20px;
            }

            .el-input-number__decrease, .el-input-number__increase {
              width: 20px;
            }
          }
        }
      }
    }
  }

  .wrap {
    display: flex;
    text-align: left;
    align-items: center;
    line-height: 35px;

    & > span {
      margin-right: 10px;
      color: #ffffff;
      font-size: 14px;
    }
  }
}
.setTitle {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #FFFFFF;
  line-height: 30px;
  text-align: left;
  opacity: .7;
}

</style>
