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
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">标题</p>
            <div>
              <apiot-input
                  type="text"
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
      <el-collapse-item title="主仪表盘属性" name="4">
        <div>
          <div class="propsSetting">
            <span class="setTitle">起始角度</span>
            <c-slider
                @change="(value) => changeStyles(value, 'startAngle')"
                v-model="getComponentInfo.stylesObj.startAngle"
                :min="-180"
                :max="360"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">结束角度</span>
            <c-slider
                @change="(value) => changeStyles(value, 'endAngle')"
                v-model="getComponentInfo.stylesObj.endAngle"
                :min="-180"
                :max="360"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">半径</span>
            <c-slider
                @change="(value) => changeStyles(value, 'radius')"
                v-model="getComponentInfo.stylesObj.radius"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <p class="setTitle">刻度最小值</p>
            <el-input-number
                controls-position="right"
                :value="getComponentInfo.stylesObj.min"
                @change="(value) => changeStyles(Number(value), 'min')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">刻度最大值</p>
            <el-input-number
                controls-position="right"
                :value="getComponentInfo.stylesObj.max"
                @change="(value) => changeStyles(Number(value), 'max')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">刻度分割段数</p>
            <el-input-number
                :min="0"
                controls-position="right"
                :value="getComponentInfo.stylesObj.splitNumber"
                @change="(value) => changeStyles(Number(value), 'splitNumber')"/>
          </div>
          <el-collapse>
            <el-collapse-item name="5">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">仪表盘轴线</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.axisLine"
                        @change="(value) => changeTitle(value, 'axisLine')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="ellipsisWrap flex propsSetting">
                  <span class="setTitle">两端倒角</span>
                  <el-switch
                      :value="getComponentInfo.stylesObj.roundCap"
                      @change="(value) => changeStyles(value, 'roundCap')"
                      active-color="#4689F5"
                      inactive-color="#DCDFE6">
                  </el-switch>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">轴线宽度</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisLineWidth"
                      @change="(value) => changeStyles(Number(value), 'axisLineWidth')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">轴线颜色</p>
                  <color-manage
                      :value="getComponentInfo.stylesObj.axisLineColorConfig"
                      @change="(value) => changeStyles(value, 'axisLineColorConfig')">
                  </color-manage>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="6">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">展示当前进度</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.progress"
                        @change="(value) => changeTitle(value, 'progress')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="ellipsisWrap flex propsSetting">
                  <span class="setTitle">两端倒角</span>
                  <el-switch
                      :value="getComponentInfo.stylesObj.progressRoundCap"
                      @change="(value) => changeStyles(value, 'progressRoundCap')"
                      active-color="#4689F5"
                      inactive-color="#DCDFE6">
                  </el-switch>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">宽度</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.progressWidth"
                      @change="(value) => changeStyles(Number(value), 'progressWidth')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">进度条颜色</p>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.progressColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'progressColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="7">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">分隔线样式</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.splitLine"
                        @change="(value) => changeTitle(value, 'splitLine')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">分隔线线长</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.splitLineLength"
                      @change="(value) => changeStyles(Number(value), 'splitLineLength')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">离轴线的距离</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.splitLineDistance"
                      @change="(value) => changeStyles(Number(value), 'splitLineDistance')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">分割线颜色</p>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.splitLineColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'splitLineColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">分割线宽度</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.splitLineWidth"
                      @change="(value) => changeStyles(Number(value), 'splitLineWidth')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">分割线类型</p>
                  <div>
                    <c-select
                        :options="typeOptions"
                        v-model="getComponentInfo.stylesObj.splitLineType"
                        @change="(value) => changeTitle(value, 'splitLineType')"
                    ></c-select>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="8">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">刻度样式</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.axisTick"
                        @change="(value) => changeTitle(value, 'axisTick')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">分隔线之间分割的刻度数</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisTickSplitNumber"
                      @change="(value) => changeStyles(Number(value), 'axisTickSplitNumber')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">刻度线长</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisTickLength"
                      @change="(value) => changeStyles(Number(value), 'axisTickLength')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">刻度线与轴线的距离</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisTickDistance"
                      @change="(value) => changeStyles(Number(value), 'axisTickDistance')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">刻度线颜色</p>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.axisTickColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'axisTickColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">刻度线宽度</p>
                  <el-input-number
                      :min="0"
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisTickWidth"
                      @change="(value) => changeStyles(Number(value), 'axisTickWidth')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">刻度线类型</p>
                  <div>
                    <c-select
                        :options="typeOptions"
                        v-model="getComponentInfo.stylesObj.axisTickType"
                        @change="(value) => changeTitle(value, 'axisTickType')"
                    ></c-select>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="9">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">刻度标签</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.axisLabel "
                        @change="(value) => changeTitle(value, 'axisLabel')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">标签与刻度线的距离</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisLabelDistance"
                      @change="(value) => changeStyles(Number(value), 'axisLabelDistance')"/>
                </div>
                <TextStylesConfig
                    title="标签字体样式"
                    title1="标签字体颜色"
                    :fontFamilyValue="getComponentInfo.stylesObj.axisLabelFontFamily"
                    :fontWeightValue="getComponentInfo.stylesObj.axisLabelFontWeight"
                    :fontSizeValue="getComponentInfo.stylesObj.axisLabelFontSize"
                    :colorValue="getComponentInfo.stylesObj.axisLabelColor"
                    @change="({value,key}) => changeStyles(value, `axisLabel${key}`)"
                />
              </div>
            </el-collapse-item>
            <el-collapse-item name="10">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">仪表盘指针</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.pointer"
                        @change="(value) => changeTitle(value, 'pointer')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">指针图标</p>
                  <c-select
                      :options="IconOptions"
                      v-model="getComponentInfo.stylesObj.icon"
                      @change="(value) => changeStyles(value, 'icon')"
                  ></c-select>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">指针长度(%)</p>
                  <el-input-number
                      controls-position="right"
                      :min="0"
                      :max="100"
                      :value="getComponentInfo.stylesObj.pointerLength"
                      @change="(value) => changeStyles(Number(value), 'pointerLength')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">指针宽度</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.pointerWidth"
                      @change="(value) => changeStyles(Number(value), 'pointerWidth')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">指针颜色</p>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.pointerColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'pointerColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="11">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">仪表盘指针圆心</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.anchor"
                        @change="(value) => changeTitle(value, 'anchor')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">圆心图标</p>
                  <c-select
                      :options="IconOptions"
                      v-model="getComponentInfo.stylesObj.anchorIcon"
                      @change="(value) => changeTitle(value, 'anchorIcon')"
                  ></c-select>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">圆心大小</p>
                  <el-input-number
                      controls-position="right"
                      :min="0"
                      :max="100"
                      :value="getComponentInfo.stylesObj.anchorSize"
                      @change="(value) => changeStyles(Number(value), 'anchorSize')"/>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">圆心颜色</p>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.anchorColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'anchorColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="12">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">仪表盘值</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.detail"
                        @change="(value) => changeTitle(value, 'detail')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <TextStylesConfig
                    title="值字体样式"
                    title1="值字体颜色"
                    fontFamily="微软雅黑"
                    :fontFamilyValue="getComponentInfo.stylesObj.detailFontFamily"
                    :fontWeightValue="getComponentInfo.stylesObj.detailFontWeight"
                    :fontSizeValue="getComponentInfo.stylesObj.detailFontSize"
                    :colorValue="getComponentInfo.stylesObj.detailColor"
                    @change="({value,key}) => changeStyles(value, `detail${key}`)"
                />
                <div class="propsSetting">
                  <span class="setTitle">水平方向偏移(%)</span>
                  <c-slider
                      @change="(value) => changeStyles(value, 'horizontalOffset')"
                      v-model="getComponentInfo.stylesObj.horizontalOffset"
                      :min="-100"
                      :max="100"
                  ></c-slider>
                </div>
                <div class="propsSetting">
                  <span class="setTitle">垂直方向偏移(%)</span>
                  <c-slider
                      @change="(value) => changeStyles(value, 'verticalOffset')"
                      v-model="getComponentInfo.stylesObj.verticalOffset"
                      :min="-100"
                      :max="100"
                  ></c-slider>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">标注前缀</p>
                  <div>
                    <apiot-input
                        v-model="getComponentInfo.stylesObj.detailPrefix"
                        @change="(value) => changeStyles(value, 'labelPrefix')"
                    ></apiot-input>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">标注后缀</p>
                  <div>
                    <apiot-input
                        v-model="getComponentInfo.stylesObj.detailSuffix"
                        @change="(value) => changeStyles(value, 'labelSuffix')"
                    ></apiot-input>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-collapse-item>
      <el-collapse-item title="辅助仪表盘属性" name="1">
        <div>
          <OthersDashboard
              v-model="getComponentInfo.boardConfig"
              @change="(value) => changeTitle(value, 'boardConfig')"
          ></OthersDashboard>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import { predefineColors } from '../../constants/global';

const OthersDashboard = () => import('./OthersDashboard/index');

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
      predefineColors,
      color: 'rgba(255, 69, 0, 0.68)',
      typeOptions: [
        {
          label: '实线',
          value: 'solid'
        },
        {
          label: '虚线',
          value: 'dashed'
        },
        {
          label: '点线',
          value: 'dotted'
        }
      ],
      IconOptions: [
        {
          label: '默认',
          value: ''
        },
        {
          label: '圆圈',
          value: 'circle'
        },
        {
          label: '长条',
          value: 'roundRect'
        },
        {
          label: '三角形',
          value: 'triangle'
        },
        {
          label: '金刚石',
          value: 'diamond'
        },
        {
          label: '大头针',
          value: 'pin'
        },
        {
          label: '箭头',
          value: 'arrow'
        },
        {
          label: '不显示',
          value: 'none'
        }
      ]
    };
  },

  components: {
    TextStylesConfig,
    OthersDashboard,
    LocationProperties
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => item.componentId === componentId) || {};
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
