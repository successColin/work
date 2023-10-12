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
          :value="getComponentInfo.stylesObj.zIndex"
          @change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">标题</div>
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
          <div class="propsSetting">
            <p class="setTitle">标题</p>
            <div>
              <apiot-input
                  v-model="getComponentInfo.stylesObj.legendName"
                  @change="(value) => changeStyles(value, 'legendName')"
              ></apiot-input>
            </div>
          </div>
          <div class="propsSetting" style="margin-bottom: 5px;">
            <p class="setTitle">标题位置</p>
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
      <el-collapse-item title="内容" name="3">
        <div>
          <div class="propsSetting">
            <p class="setTitle">显示类型</p>
            <div>
              <c-select
                  :options="labelOptions"
                  :value="getComponentInfo.stylesObj.labelPosition"
                  @change="(value) => changeStyles(value, 'labelPosition')"
              ></c-select>
            </div>
          </div>
          <TextStylesConfig
              v-if="getComponentInfo.stylesObj.labelPosition===1"
              title="字体样式"
              title1="字体颜色"
              fontFamily="微软雅黑"
              :fontFamilyValue="getComponentInfo.stylesObj.labelFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.labelFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.labelFontSize"
              :colorValue="getComponentInfo.stylesObj.labelColor"
              @change="({value,key}) => changeStyles(value, `label${key}`)"
          />
          <div v-if="[2, 3].includes(getComponentInfo.stylesObj.labelPosition)">
            <div class="propsSetting">
              <p class="setTitle">内容1</p>
            </div>
            <div class="propsSetting">
              <p class="setTitle">前缀</p>
              <div>
                <apiot-input
                    v-model="getComponentInfo.stylesObj.label1Prefix"
                    @change="(value) => changeStyles(value, 'label1Prefix')"
                ></apiot-input>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">后缀</p>
              <div>
                <apiot-input
                    v-model="getComponentInfo.stylesObj.label1Suffix"
                    @change="(value) => changeStyles(value, 'label1Suffix')"
                ></apiot-input>
              </div>
            </div>
            <TextStylesConfig
                title="字体样式"
                title1="字体颜色"
                fontFamily="微软雅黑"
                :fontFamilyValue="getComponentInfo.stylesObj.label1FontFamily"
                :fontWeightValue="getComponentInfo.stylesObj.label1FontWeight"
                :fontSizeValue="getComponentInfo.stylesObj.label1FontSize"
                :colorValue="getComponentInfo.stylesObj.label1Color"
                @change="({value,key}) => changeStyles(value, `label1${key}`)"
            />
          </div>
          <div v-if="[3].includes(getComponentInfo.stylesObj.labelPosition)">
            <div class="propsSetting">
              <p class="setTitle">内容2</p>
            </div>
            <div class="propsSetting">
              <p class="setTitle">前缀</p>
              <div>
                <apiot-input
                    v-model="getComponentInfo.stylesObj.label2Prefix"
                    @change="(value) => changeStyles(value, 'label2Prefix')"
                ></apiot-input>
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">后缀</p>
              <div>
                <apiot-input
                    v-model="getComponentInfo.stylesObj.label2Suffix"
                    @change="(value) => changeStyles(value, 'label2Suffix')"
                ></apiot-input>
              </div>
            </div>
            <TextStylesConfig
                title="字体样式"
                title1="字体颜色"
                fontFamily="微软雅黑"
                :fontFamilyValue="getComponentInfo.stylesObj.label2FontFamily"
                :fontWeightValue="getComponentInfo.stylesObj.label2FontWeight"
                :fontSizeValue="getComponentInfo.stylesObj.label2FontSize"
                :colorValue="getComponentInfo.stylesObj.label2Color"
                @change="({value,key}) => changeStyles(value, `label2${key}`)"
            />
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="进度条属性" name="4">
        <div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">外圆半径</span>
            <el-slider
                @change="(value) => changeStyles(value, 'outerCircle')"
                v-model="getComponentInfo.stylesObj.outerCircle"
            ></el-slider>
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">内圆半径</span>
            <el-slider
                @change="(value) => changeStyles(value, 'InnerCircle')"
                v-model="getComponentInfo.stylesObj.InnerCircle"
            ></el-slider>
          </div>
          <div class="propsSetting">
            <p class="setTitle">进度条颜色</p>
            <div>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.barColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'barColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">进度条背景色</p>
            <div>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.barBgColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'barBgColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';

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
          label: '默认',
          value: 1
        }, {
          label: '自定义1',
          value: 2
        }, {
          label: '自定义2',
          value: 3
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
    LocationProperties
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) { return {}; }
      const Obj = this.getList.find((item) => item.componentId === componentId) || {};
      return Obj;
    },
    getList() {
      return this.list;
    }
  },

  mounted() {
  },
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
            border-radius: 0 !important;
            //border-color: $component-border-color;
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
