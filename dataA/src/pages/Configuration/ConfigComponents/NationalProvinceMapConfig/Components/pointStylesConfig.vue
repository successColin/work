/**
* @name: pointStylesConfig
* @author: DELL
* @date: 2022/8/4 15:54
* @description：pointStylesConfig
* @update: 2022/8/4 15:54
*/
<!-- 页面 -->
<template>
  <div>
    <div  v-for="(configItem, i) in scatterConfig"
          :key="i"
    >
      <div class="titleWrap">
        <span class="titleLeft">
          类型{{i + 1}}
        </span>
        <span @click="del(i)" class="icon-shanchu1 iconfont"></span>
      </div>
      <div class="propsSetting">
        <p class="setTitle">字段映射值</p>
        <c-input
            type="text"
            :value="configItem.fieldValue"
            @Input-Change="(value) => change(value, 'fieldValue', i, configItem)"/>
      </div>
      <div class="numberWrap">
        <div class="propsSetting flexItem">
          <p class="setTitle">散点大小</p>
          <c-input
              type="number"
              @change="(value) => change(Number(value), 'scatterSize', i, configItem)"
              :numberValue="configItem.scatterSize"
          />
        </div>
        <div class="propsSetting flexItem">
          <p class="setTitle">散点高亮大小</p>
          <c-input
              type="number"
              @change="(value) => change(Number(value), 'scatterHighlightSize', i, configItem)"
              :numberValue="configItem.scatterHighlightSize"
          />
        </div>
      </div>
      <div class="numberWrap">
        <div class="propsSetting flexItem">
          <p class="setTitle">散点颜色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="configItem.scatterColor"
              :colorValue="configItem.scatterColor"
              @change="(value) => change(value, 'scatterColor',  i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting flexItem">
          <p class="setTitle">散点高亮颜色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :colorValue="configItem.scatterHighlightColor"
              :value="configItem.scatterHighlightColor"
              @change="(value) => change(value, 'scatterHighlightColor',  i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
      <div class="numberWrap">
        <div class="propsSetting flexItem">
          <p class="setTitle">散点边框色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="configItem.scatterBorderColor"
              :colorValue="configItem.scatterBorderColor"
              @change="(value) => change(value, 'scatterBorderColor', i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting flexItem">
          <p class="setTitle">散点边框高亮色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :colorValue="configItem.scatterBorderHighlight"
              :value="configItem.scatterBorderHighlight"
              @change="(value) => change(value, 'scatterBorderHighlight', i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {predefineColors} from '@/constants/global'

export default {
  props: {
    scatterConfig: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      predefineColors,
      config: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    // this.config = JSON.parse(JSON.stringify(this.scatterConfig));
  },

  methods: {
    del(i) {
      const list = [...this.scatterConfig];
      list.splice(i, 1);
      this.$emit('change', list);
    },
    change(v, key, i, configItem) {
      const list = [...this.scatterConfig];
      const newObj = {
        ...configItem,
        [key]: v
      };
      list.splice(i, 1, newObj);
      this.$emit('change', list);
    }
  },
  name: 'pointStylesConfig'
};
</script>

<style lang='scss' scoped>
.ellipsisWrap {
  justify-content: space-between;
  align-items: center;
}
.titleWrap {
  display: flex;
  justify-content: space-between;
  .titleLeft{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }
  .iconfont{
    color: #BBC3CD;
    cursor: pointer;
  }
  .iconfont:hover{
    color: #4689F5;
  }
}
.propsSetting {
  margin-bottom: 10px;

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
.numberWrap {
  display: flex;
  justify-content: space-between;

  .flexItem {
    width: 123px;
  }
}

</style>
