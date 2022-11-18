/**
* @name: SingleLineTextConfig
* @author: DELL
* @date: 2021/8/21 15:20
* @description：SingleLineTextConfig
* @update: 2021/8/21 15:20
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="propsSetting">
      <p class="setTitle">组件名称</p>
      <apiot-input
          :maxlength="16"
          :value="getComponentInfo.name"
          @input="(value) => changeTitle(value, 'name')"/>
    </div>
    <location-properties
        :widthValue="getComponentInfo.width"
        :heightValue="getComponentInfo.height"
        :leftValue="getComponentInfo.left"
        :topValue="getComponentInfo.top"
        @changeTitle="({value, key}) => changeTitle(value, key)"
    ></location-properties>
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <el-input-number
          controls-position="right"
          v-model="getComponentInfo.stylesObj.zIndex"
          @change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">图例</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableLegend"
                  @change="(value) => changeTitle(value, 'enableLegend')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting" style="margin-bottom: 5px;">
            <p class="setTitle">图例位置</p>
            <chart-legend-position
                v-model="getComponentInfo.stylesObj.legendPosition"
                @change="(value) => changeStyles(value, 'legendPosition')"
            ></chart-legend-position>
          </div>
          <TextStylesConfig
              title="字体样式"
              title1="字体颜色"
              fontFamily="微软雅黑"
              :fontSize="11"
              fontWeight="normal"
              color="#FFF"
              :fontFamilyValue="getComponentInfo.stylesObj.legendFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.legendFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.legendFontSize"
              :colorValue="getComponentInfo.stylesObj.legendColor"
              @change="({value,key}) => changeStyles(value, `legend${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="1" title="自定义颜色">
        <div class="ellipsisWrap propsSetting">
          <data-color
              :single="true"
              :value="getComponentInfo.stylesObj.colorArr"
              @change="(value) => changeStyles(value, 'colorArr')"
          ></data-color>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3" title="漏斗图设置">
        <FunnelSetting
            :value="getComponentInfo.funnelsConfig"
            @change="(value) => changeTitle(value, 'funnelsConfig')"/>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import FunnelSetting from './funnelSetting';
import DataColor from '../../basicWidgets/DataColor';
import TextStylesConfig from '../../Layout/TextStylesConfig/index';

export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  data() {
    return {
      activeName: '',
      color1: '#ffffff',
      color2: '#ffffff',
      color: 'rgba(255, 69, 0, 0.68)',
      options: [{
        label: '左对齐',
        value: 'left',
        icon: 'icon-zuoduiqi'
      }, {
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'right',
        icon: 'icon-youduiqi'
      }]
    };
  },

  components: {
    DataColor,
    FunnelSetting,
    TextStylesConfig
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      return this.getList.find((item) => item.componentId === componentId) || {};
    },
    getList() {
      return this.list;
    }
  },

  mounted() {
  },
  watch: {
    // getComponentInfo: {
    //   deep: true,
    //   handler(val, oldVal) { // 普通的watch监听
    //     console.log("a: " + val, oldVal);
    //   },
    // }
  },
  methods: {
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj || {};
      if (key === 'shadowColor' && !value) {
        value = '';
      }
      if (['color1', 'color2'].includes(key) && !value) {
        value = '#fff';
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...styleObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    reduceIndex() {
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return -1;
      }
      return this.getList.findIndex((item) => item.componentId === componentId);
    },
    changeTitle(value, key) { // 设置组件名称
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    }
  },
  name: 'SingleLineTextConfig'
};
</script>

<style lang='scss' scoped>
@import '../commonProperty';

.bgContentWrap {
  width: 100%;
  height: calc(100% - 46px);
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-y: auto;

  .bgSettingWrap {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .switchWrap {
      margin-right: 10px;

      ::v-deep {
        .el-switch__core {
          width: 28px !important;
          height: 14px;
        }

        .el-switch__core:after {
          content: "";
          position: absolute;
          top: 2px;
          left: 4px;
          border-radius: 100%;
          transition: all .3s;
          width: 8px;
          height: 8px;
          background-color: #FFF;
        }

        .el-switch.is-checked .el-switch__core::after {
          left: 100%;
          margin-left: -11px;
        }
      }
    }
  }
  //.propsSetting {
  //  margin-bottom: 10px;
  //
  //  .businessWrap {
  //    .inputBox {
  //      width: 100%;
  //    }
  //  }
  //
  //  .fontSizeWrap {
  //    display: flex;
  //    align-items: center;
  //    margin-top: 6px;
  //
  //    ::v-deep {
  //      .selectWrap {
  //        flex: 0 0 170px;
  //        margin-right: 10px;
  //
  //        .el-input__inner {
  //          height: 32px;
  //          line-height: 32px;
  //        }
  //      }
  //
  //      .CInputWrap {
  //        .el-input-number.is-controls-right .el-input__inner {
  //          padding-right: 23px;
  //        }
  //      }
  //    }
  //  }
  //
  //  .borderWrap {
  //    display: flex;
  //    align-items: center;
  //    margin-top: 6px;
  //
  //    ::v-deep {
  //      .selectWrap {
  //        flex: 0 0 calc(50% - 5px);
  //
  //        .el-input__inner {
  //          height: 32px;
  //          line-height: 32px;
  //        }
  //      }
  //
  //      .CInputWrap {
  //        flex: 0 0 calc(50% - 5px);
  //        margin-right: 10px;
  //
  //        .el-input-number.is-controls-right .el-input__inner {
  //          padding-right: 23px;
  //        }
  //      }
  //    }
  //  }
  //
  //  .alignWrap {
  //    width: 100%;
  //    display: flex;
  //
  //    ::v-deep {
  //      .el-radio-button {
  //        width: calc(100% / 3);
  //
  //        &.is-active {
  //          .el-radio-button__inner {
  //            background: $component-borderFocus-color !important;
  //            border-color: $component-borderFocus-color !important;
  //          }
  //        }
  //
  //        .el-radio-button__inner {
  //          width: 100%;
  //          padding: 5px 15px;
  //          border-radius: 0;
  //          border-color: $component-border-color;
  //          background: $component-background-color;
  //
  //          .iconfont {
  //            color: #FFFFFF;
  //            font-size: 18px;
  //          }
  //        }
  //
  //        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  //          background: $component-background-color;
  //        }
  //      }
  //    }
  //  }
  //
  //  .setTitle {
  //    font-size: 14px;
  //    font-family: PingFangSC-Regular, PingFang SC;
  //    font-weight: 400;
  //    color: #FFFFFF;
  //    line-height: 30px;
  //    text-align: left;
  //    opacity: .7;
  //  }
  //
  //  .InputWrap {
  //    display: flex;
  //    margin-top: 5px;
  //    align-items: center;
  //    justify-content: space-between;
  //
  //    ::v-deep {
  //      .CInputWrap {
  //        width: 100%;
  //        display: flex;
  //        flex: 0 0 calc(50% - 8px);
  //        align-items: center;
  //
  //        .inputBox {
  //          width: 100px;
  //
  //          .el-input-number {
  //            width: 100px;
  //
  //            .el-input__inner {
  //              padding-left: 15px;
  //              padding-right: 20px;
  //            }
  //
  //            .el-input-number__decrease, .el-input-number__increase {
  //              width: 20px;
  //            }
  //          }
  //        }
  //      }
  //    }
  //  }
  //
  //  .wrap {
  //    display: flex;
  //    text-align: left;
  //    align-items: center;
  //    line-height: 35px;
  //
  //    & > span {
  //      margin-right: 10px;
  //      color: #ffffff;
  //      font-size: 14px;
  //    }
  //  }
  //}
  //
  //.ellipsisWrap {
  //  justify-content: space-between;
  //  align-items: center;
  //
  //  ::v-deep {
  //    .el-slider {
  //      width: 200px;
  //      margin: 0 auto;
  //    }
  //  }
  //}

}
</style>
