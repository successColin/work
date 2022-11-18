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
      <p class="setTitle">图层 q</p>
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
                  inactive-color="#DCDFE9">
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
              :fontFamilyValue="getComponentInfo.stylesObj.legendFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.legendFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.legendFontSize"
              :colorValue="getComponentInfo.stylesObj.legendColor"
              @change="({value,key}) => changeStyles(value, `legend${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item title="标注" name="3">
        <div>
          <div class="propsSetting">
            <p class="setTitle">标注位置</p>
            <div>
              <c-select
                  :options="labelOptions"
                  :value="getComponentInfo.stylesObj.labelPosition"
                  @change="(value) => changeStyles(value, 'labelPosition')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">标注显示字段</p>
            <div>
              <c-select
                  :options="showOptions"
                  :value="getComponentInfo.stylesObj.labelShowType"
                  @change="(value) => changeStyles(value, 'labelShowType')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">标注值类型</p>
            <div>
              <c-select
                  :options="valueTypeOptions"
                  :value="getComponentInfo.stylesObj.labelValueType"
                  @change="(value) => changeStyles(value, 'labelValueType')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">字体</p>
            <c-select
                :options="fontFamilyOptions"
                :value="getComponentInfo.stylesObj.labelFontFamily"
                @change="(value) => changeStyles(value, 'labelFontFamily')">
            </c-select>
            <div class="fontSizeWrap">
              <c-select
                  :options="boldTypeOptions"
                  :value="getComponentInfo.stylesObj.labelFontWeight"
                  @change="(value) => changeStyles(value, 'labelFontWeight')"
              ></c-select>
              <el-input-number
                  controls-position="right"
                  :value="getComponentInfo.stylesObj.labelFontSize"
                  @change="(value) => changeStyles(value, 'labelFontSize')"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="扇形属性" name="4">
        <div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">外圆半径</span>
            <el-slider
                :min="0"
                :max="500"
                @change="(value) => changeStyles(value, 'outerCircle')"
                v-model="getComponentInfo.stylesObj.outerCircle"
            ></el-slider>
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">内圆半径</span>
            <el-slider
                :min="0"
                :max="500"
                @change="(value) => changeStyles(value, 'InnerCircle')"
                v-model="getComponentInfo.stylesObj.InnerCircle"
            ></el-slider>
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">扇形中心横坐标</span>
            <el-slider
                @change="(value) => changeStyles(value, 'pieHorizontal')"
                v-model="getComponentInfo.stylesObj.pieHorizontal"
            ></el-slider>
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">扇形中心纵坐标</span>
            <el-slider
                @change="(value) => changeStyles(value, 'pieVertical')"
                v-model="getComponentInfo.stylesObj.pieVertical"
            ></el-slider>
          </div>
          <div class="propsSetting">
            <p class="setTitle">扇形倒角</p>
            <el-input-number
                controls-position="right"
                :min="0"
                :value="getComponentInfo.stylesObj.borderRadius"
                @change="(value) => changeStyles(value, 'borderRadius')"
            />
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义颜色</span>
            <data-color
                :value="getComponentInfo.stylesObj.colorArr"
                @change="(value) => changeStyles(value, 'colorArr')"
            ></data-color>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import DataColor from '../../basicWidgets/DataColor';

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
    }
  },
  data() {
    return {
      enable: true,
      fontFamilyOptions: [
        {
          label: '微软雅黑',
          value: '微软雅黑'
        }, {
          label: '苹方',
          value: 'PingFangSC-Regular,PingFang SC'
        }, {
          label: '思源黑体',
          value: 'Source Han Sans CN'
        }
      ],
      boldTypeOptions: [
        {
          label: '常规体',
          value: 'normal'
        }, {
          label: '加粗',
          value: 'bold'
        }
      ],
      labelOptions: [
        {
          label: '外部',
          value: 'outer'
        }, {
          label: '内部',
          value: 'inside'
        }, {
          label: '不显示',
          value: 'none'
        }
      ],
      showOptions: [
        {
          label: '值',
          value: 'value'
        }, {
          label: '名称(类型)',
          value: 'type'
        }
      ],
      positionOptions: [
        {
          label: '左上',
          value: 'leftTop'
        }, {
          label: '上中',
          value: 'topCenter'
        }, {
          label: '右上',
          value: 'rightTop'
        }, {
          label: '左中',
          value: 'leftCenter'
        }, {
          label: '中间',
          value: 'centerCenter'
        }, {
          label: '右中',
          value: 'rightCenter'
        }, {
          label: '左下',
          value: 'leftBottom'
        }, {
          label: '下中',
          value: 'bottomCenter'
        }, {
          label: '右下',
          value: 'rightBottom'
        }
      ],
      layOutOptions: [
        {
          label: '水平',
          value: 'horizontal'
        }, {
          label: '垂直',
          value: 'vertical'
        }
      ],
      valueTypeOptions: [
        {
          label: '默认值',
          value: 1
        }, {
          label: '百分比',
          value: 2
        }
      ],
      activeName: '',
      color1: '#ffffff',
      color2: '#ffffff',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors: [
        '#4689F5',
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
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
    TextStylesConfig,
    DataColor,
    LocationProperties
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.list.find((item) => item.componentId === componentId) || {};
      return Obj;
    },
    getList() {
      return this.list;
    }
  },

  mounted() {},
  watch: {},
  methods: {
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj || {};
      if (key === 'shadowColor' && !value) { value = ''; }
      if (['color1', 'color2'].includes(key) && !value) { value = '#fff'; }
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
      if (!componentId) { return -1; }
      const index = this.getList.findIndex((item) => item.componentId === componentId);
      return index;
    },
    changeScreenBgUrl(url) { // 修改背景图片
      const { getBgConfig } = this;
      this.$store.dispatch('config/setBgConfig', {
        ...getBgConfig,
        bgImage: url
      });
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
        .el-input-number.is-controls-right .el-input__inner {
          padding-left: 10px;
          padding-right: 0;
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

    .InputWrap {
      display: flex;
      margin-top: 5px;
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

  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;

    ::v-deep {
      .el-slider {
        width: 200px;
        margin: 0 auto;
      }
    }
  }

}
</style>
