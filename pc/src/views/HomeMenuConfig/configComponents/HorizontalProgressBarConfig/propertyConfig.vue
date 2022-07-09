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
      <el-collapse-item name="1" title="图形属性">
        <div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">图表边距</span>
            <el-switch
                :value="getComponentInfo.enableGrid"
                @change="(value) => changeTitle(value, 'enableGrid')"
                active-color="#4689F5"
                inactive-color="#DCDFE9">
            </el-switch>
          </div>
          <ChartLayOut
              :class="{chartLayoutDisabled: !getComponentInfo.enableGrid}"
              :topValue="getComponentInfo.stylesObj.gridTop"
              :leftValue="getComponentInfo.stylesObj.gridLeft"
              :rightValue="getComponentInfo.stylesObj.gridRight"
              :bottomValue="getComponentInfo.stylesObj.gridBottom"
              @change="({value, type}) => changeStyles(value, type)"
          />
          <div class="propsSetting">
            <p class="setTitle">进度条宽度</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :value="getComponentInfo.stylesObj.barWidth"
                  @change="(value) => changeStyles(value, 'barWidth')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">进度条倒角</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  :value="getComponentInfo.stylesObj.borderRadius"
                  @change="(value) => changeStyles(value, 'borderRadius')"/>
            </div>
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义进度条颜色</span>
            <data-color
                :value="getComponentInfo.stylesObj.colorArr"
                @change="(value) => changeStyles(value, 'colorArr')"
            ></data-color>
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">进度条背景色</span>
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
<!--      <el-collapse-item name="2">-->
<!--        <template slot="title">-->
<!--          <div class="bgSettingWrap">-->
<!--            <div class="title">图例</div>-->
<!--            <div class="switchWrap">-->
<!--              <el-switch-->
<!--                  @click.stop.native-->
<!--                  :value="getComponentInfo.enableLegend"-->
<!--                  @change="(value) => changeTitle(value, 'enableLegend')"-->
<!--                  active-color="#4689F5"-->
<!--                  inactive-color="#DCDFE9">-->
<!--              </el-switch>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--        <div>-->
<!--          <div class="propsSetting" style="margin-bottom: 5px;">-->
<!--            <p class="setTitle">图例位置</p>-->
<!--            <chart-legend-position-->
<!--                v-model="getComponentInfo.stylesObj.legendPosition"-->
<!--                @change="(value) => changeStyles(value, 'legendPosition')"-->
<!--            ></chart-legend-position>-->
<!--          </div>-->
<!--          <TextStylesConfig-->
<!--              title="字体样式"-->
<!--              title1="字体颜色"-->
<!--              fontFamily="微软雅黑"-->
<!--              :fontSize="11"-->
<!--              fontWeight="normal"-->
<!--              color="#FFF"-->
<!--              :fontFamilyValue="getComponentInfo.stylesObj.legendFontFamily"-->
<!--              :fontWeightValue="getComponentInfo.stylesObj.legendFontWeight"-->
<!--              :fontSizeValue="getComponentInfo.stylesObj.legendFontSize"-->
<!--              :colorValue="getComponentInfo.stylesObj.legendColor"-->
<!--              @change="({value,key}) => changeStyles(value, `legend${key}`)"-->
<!--          />-->
<!--        </div>-->
<!--      </el-collapse-item>-->
      <el-collapse-item name="3">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">标注</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableLabel"
                  @change="(value) => changeTitle(value, 'enableLabel')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE9">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">标注字段</p>
            <div>
              <c-select
                  :options="labelOptions"
                  :value="getComponentInfo.stylesObj.labelField"
                  @change="(value) => changeStyles(value, 'labelField')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">标注前缀</p>
            <div>
              <apiot-input
                  :isForbid="false"
                  v-model="getComponentInfo.stylesObj.labelPrefix"
                  @change="(value) => changeStyles(value, 'labelPrefix')"
              ></apiot-input>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">标注后缀</p>
            <div>
              <apiot-input
                  :isForbid="false"
                  v-model="getComponentInfo.stylesObj.labelSuffix"
                  @change="(value) => changeStyles(value, 'labelSuffix')"
              ></apiot-input>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">标注位置</p>
            <div>
              <c-select
                  :options="positionOptions"
                  :value="getComponentInfo.stylesObj.labelPosition"
                  @change="(value) => changeStyles(value, 'labelPosition')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">标注偏移量</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  :value="getComponentInfo.stylesObj.labelOffset"
                  @change="(value) => changeStyles(value, 'labelOffset')"/>
            </div>
          </div>

          <TextStylesConfig
              title="标注样式"
              title1="标注颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.labelFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.labelFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.labelFontSize"
              :colorValue="getComponentInfo.stylesObj.labelColor"
              @change="({value,key}) => changeStyles(value, `label${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">标题</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableTitle"
                  @change="(value) => changeTitle(value, 'enableTitle')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE9">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <TextStylesConfig
              title="轴标题样式"
              title1="轴标题颜色"
              fontFamily="微软雅黑"
              :fontFamilyValue="getComponentInfo.stylesObj.XFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.XFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.XFontSize"
              :colorValue="getComponentInfo.stylesObj.XColor"
              @change="({value,key}) => changeStyles(value, `X${key}`)"
          />
        </div>
      </el-collapse-item>
<!--      <el-collapse-item name="5">-->
<!--        <template slot="title">-->
<!--          <div class="bgSettingWrap">-->
<!--            <div class="title">Y轴</div>-->
<!--            <div class="switchWrap">-->
<!--              <el-switch-->
<!--                  @click.stop.native-->
<!--                  :value="getComponentInfo.enableYAxis"-->
<!--                  @change="(value) => changeTitle(value, 'enableYAxis')"-->
<!--                  active-color="#4689F5"-->
<!--                  inactive-color="#DCDFE9">-->
<!--              </el-switch>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--        <div>-->
<!--          <div class="propsSetting">-->
<!--            <p class="setTitle">轴数据类型</p>-->
<!--            <div>-->
<!--              <c-select-->
<!--                  :options="XDataType"-->
<!--                  :value="getComponentInfo.stylesObj.YDataType"-->
<!--                  @change="(value) => changeStyles(value, 'YDataType')"-->
<!--              ></c-select>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="propsSetting" style="margin-bottom: 5px">-->
<!--            <p class="setTitle">轴线颜色</p>-->
<!--            <div>-->
<!--              <c-color-picker-->
<!--                  style="margin-right: 10px;"-->
<!--                  size="small"-->
<!--                  v-model="getComponentInfo.stylesObj.YLineColor"-->
<!--                  show-alpha-->
<!--                  @change="(value) => changeStyles(value, 'YLineColor')"-->
<!--                  :predefine="predefineColors">-->
<!--              </c-color-picker>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="propsSetting">-->
<!--            <p class="setTitle">轴标题</p>-->
<!--            <div>-->
<!--              <apiot-input-->
<!--                  v-model="getComponentInfo.stylesObj.YName"-->
<!--                  @change="(value) => changeStyles(value, 'YName')"/>-->
<!--            </div>-->
<!--          </div>-->
<!--          <TextStylesConfig-->
<!--              title="轴标题样式"-->
<!--              title1="轴标题颜色"-->
<!--              fontFamily="微软雅黑"-->
<!--              :fontFamilyValue="getComponentInfo.stylesObj.YFontFamily"-->
<!--              :fontWeightValue="getComponentInfo.stylesObj.YFontWeight"-->
<!--              :fontSizeValue="getComponentInfo.stylesObj.YFontSize"-->
<!--              :colorValue="getComponentInfo.stylesObj.YColor"-->
<!--              @change="({value,key}) => changeStyles(value, `Y${key}`)"-->
<!--          />-->
<!--          <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">-->
<!--            <span class="setTitle">刻度线</span>-->
<!--            <el-switch-->
<!--                :value="getComponentInfo.stylesObj.YTickEnable"-->
<!--                @change="(value) => changeStyles(value, 'YTickEnable')"-->
<!--                active-color="#4689F5"-->
<!--                inactive-color="#DCDFE9">-->
<!--            </el-switch>-->
<!--          </div>-->
<!--          <div class="propsSetting">-->
<!--            <p class="setTitle">刻度线颜色</p>-->
<!--            <div>-->
<!--              <c-color-picker-->
<!--                  size="small"-->
<!--                  v-model="getComponentInfo.stylesObj.YTickColor"-->
<!--                  show-alpha-->
<!--                  @change="(value) => changeStyles(value, 'YTickColor')"-->
<!--                  :predefine="predefineColors">-->
<!--              </c-color-picker>-->
<!--            </div>-->
<!--          </div>-->
<!--          <TextStylesConfig-->
<!--              title="轴标签样式"-->
<!--              title1="轴标颜色"-->
<!--              :fontFamilyValue="getComponentInfo.stylesObj.YTickLabelFontFamily"-->
<!--              :fontWeightValue="getComponentInfo.stylesObj.YTickLabelFontWeight"-->
<!--              :fontSizeValue="getComponentInfo.stylesObj.YTickLabelFontSize"-->
<!--              :colorValue="getComponentInfo.stylesObj.YTickLabelColor"-->
<!--              @change="({value,key}) => changeStyles(value, `YTickLabel${key}`)"-->
<!--          />-->
<!--        </div>-->
<!--      </el-collapse-item>-->
<!--      <el-collapse-item title="其他" name="6">-->
<!--        <div>-->
<!--          <div class="ellipsisWrap flex propsSetting">-->
<!--            <span class="setTitle">是否启用海量数据优化</span>-->
<!--            <el-switch-->
<!--                :value="getComponentInfo.enableData"-->
<!--                @change="(value) => changeTitle(value, 'enableData')"-->
<!--                active-color="#4689F5"-->
<!--                inactive-color="#DCDFE9">-->
<!--            </el-switch>-->
<!--          </div>-->
<!--          <div class="propsSetting">-->
<!--            <p class="setTitle">维度</p>-->
<!--            <div>-->
<!--              <c-select-->
<!--                  :options="dimensionOptions"-->
<!--                  v-model="getComponentInfo.dimension"-->
<!--                  @change="(value) => changeTitle(value, 'dimension')"-->
<!--              ></c-select>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-collapse-item>-->

    </el-collapse>

  </div>
</template>

<script>
import ChartLayOut from '../../Layout/ChartLayout/index';
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import DataColor from '../../basicWidgets/DataColor';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import { predefineColors } from '../../constants/global';

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
      dimensionOptions: [
        {
          label: 'x',
          value: 'x'
        }, {
          label: 's',
          value: 's'
        }
      ],
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
          label: '百分比',
          value: 'x'
        }, {
          label: '值',
          value: 'y'
        }
      ],
      showOptions: [
        {
          label: '分组',
          value: 'group'
        }, {
          label: '堆叠',
          value: 'stack'
        }
      ],
      XDataType: [
        {
          label: '数值型',
          value: 'value'
        }, {
          label: '类目型',
          value: 'category'
        }, {
          label: '时间型',
          value: 'time'
        }
      ],
      YDataType: [
        {
          label: '数值型',
          value: 'value'
        }, {
          label: '类目型',
          value: 'category'
        }
      ],
      positionOptions: [
        {
          label: '顶部',
          value: 'top'
        }, {
          label: '左边',
          value: 'left'
        }, {
          label: '右边',
          value: 'right'
        }, {
          label: '底部',
          value: 'bottom'
        }, {
          label: '内部',
          value: 'inside'
        }, {
          label: '内左侧',
          value: 'insideLeft'
        }, {
          label: '内右侧',
          value: 'insideRight'
        }, {
          label: '内顶部',
          value: 'insideTop'
        }, {
          label: '内底部',
          value: 'insideBottom'
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
      predefineColors,
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
    ChartLayOut,
    TextStylesConfig,
    DataColor,
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
  watch: {
  },
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
