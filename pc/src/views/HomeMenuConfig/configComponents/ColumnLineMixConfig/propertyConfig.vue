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
      <el-collapse-item name="1" title="图形属性">
        <div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">图表边距</span>
            <el-switch
                :value="getComponentInfo.enableGrid"
                @change="(value) => changeTitle(value, 'enableGrid')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
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
          <el-collapse style="margin-top: 10px;">
            <el-collapse-item title="折线属性" name="11">
              <div class="propsSetting">
                <p class="setTitle">展示形式</p>
                <div>
                  <c-select
                      :options="showOptions"
                      :value="getComponentInfo.stylesObj.groupDisplay"
                      @change="(value) => changeStyles(value, 'groupDisplay')"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">折线类型</p>
                <div>
                  <c-select
                      :options="solidOptions"
                      :value="getComponentInfo.stylesObj.lineStyleType"
                      @change="(value) => changeStyles(value, 'lineStyleType')"
                  ></c-select>
                </div>
              </div>

              <div class="propsSetting">
                <p class="setTitle">折线粗细</p>
                <div>
                  <el-input-number
                      controls-position="right"
                      v-model="getComponentInfo.stylesObj.lineWidth"
                      @change="(value) => changeStyles(Number(value), 'lineWidth')"/>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">折线标记</p>
                <div>
                  <c-select
                      :options="symbolOptions"
                      :value="getComponentInfo.stylesObj.symbol"
                      @change="(value) => changeStyles(value, 'symbol')"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting" v-if="getComponentInfo.stylesObj.symbol!=='none'">
                <p class="setTitle">标记大小</p>
                <div>
                  <el-input-number
                      controls-position="right"
                      v-model="getComponentInfo.stylesObj.symbolSize"
                      @change="(value) => changeStyles(Number(value), 'symbolSize')"/>
                </div>
              </div>
              <div class="ellipsisWrap flex propsSetting">
                <span class="setTitle">启用区域填充</span>
                <el-switch
                    :value="getComponentInfo.enableFullArea"
                    @change="(value) => changeTitle(value, 'enableFullArea')"
                    active-color="#4689F5"
                    inactive-color="#DCDFE6">
                </el-switch>
              </div>
            </el-collapse-item>
            <el-collapse-item title="柱形属性" name="21">
              <div class="propsSetting">
                <p class="setTitle">展示形式</p>
                <div>
                  <c-select
                      :options="barShowOptions"
                      :value="getComponentInfo.stylesObj.barGroupDisplay"
                      @change="(value) => changeStyles(value, 'barGroupDisplay')"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting" v-if="getComponentInfo.stylesObj.barGroupDisplay==='group'">
                <p class="setTitle">组内间距</p>
                <div>
                  <el-input-number
                      controls-position="right"
                      v-model="getComponentInfo.stylesObj.innerGroupSpace"
                      @change="(value) => changeStyles(Number(value), 'innerGroupSpace')"/>
                </div>
              </div>
              <div class="propsSetting" v-if="getComponentInfo.stylesObj.barGroupDisplay==='group'">
                <p class="setTitle">组间间距</p>
                <div>
                  <el-input-number
                      controls-position="right"
                      v-model="getComponentInfo.stylesObj.interGroupSpace"
                      @change="(value) => changeStyles(value, 'interGroupSpace')"/>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">柱子宽度</p>
                <div>
                  <el-input-number
                      controls-position="right"
                      v-model="getComponentInfo.stylesObj.barWidth"
                      @change="(value) => changeStyles(value, 'barWidth')"/>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">柱子顶部倒角</p>
                <div>
                  <el-input-number
                      controls-position="right"
                      v-model="getComponentInfo.stylesObj.borderRadius"
                      @change="(value) => changeStyles(value, 'borderRadius')"/>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义颜色</span>
            <data-color
                :value="getComponentInfo.stylesObj.colorArr"
                @change="(value) => changeStyles(value, 'colorArr')"
            ></data-color>
          </div>
        </div>
      </el-collapse-item>
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
      <el-collapse-item name="4">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">X轴</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableXAxis"
                  @change="(value) => changeTitle(value, 'enableXAxis')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">轴数据类型</p>
            <div>
              <c-select
                  :options="XDataType"
                  :value="getComponentInfo.stylesObj.XDataType"
                  @change="(value) => changeStyles(value, 'XDataType')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" style="margin-bottom: 5px">
            <p class="setTitle">轴线颜色</p>
            <div>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.XLineColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'XLineColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">轴标题</p>
            <div>
              <apiot-input
                  v-model="getComponentInfo.stylesObj.XName"
                  @change="(value) => changeStyles(value, 'XName')"/>
            </div>
          </div>
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
          <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
            <span class="setTitle">刻度线</span>
            <el-switch
                :value="getComponentInfo.stylesObj.XTickEnable"
                @change="(value) => changeStyles(value, 'XTickEnable')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
          <div class="propsSetting">
            <p class="setTitle">刻度线颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.XTickColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'XTickColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <TextStylesConfig
              title="轴标注样式"
              title1="轴标注颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.XTickLabelFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.XTickLabelFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.XTickLabelFontSize"
              :colorValue="getComponentInfo.stylesObj.XTickLabelColor"
              @change="({value,key}) => changeStyles(value, `XTickLabel${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">Y轴</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableYAxis"
                  @change="(value) => changeTitle(value, 'enableYAxis')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <el-collapse>
            <el-collapse-item title="第一Y轴" name="13">
              <div class="propsSetting">
                <p class="setTitle">轴数据类型</p>
                <div>
                  <c-select
                      :options="YDataType"
                      :value="getComponentInfo.stylesObj.YDataType"
                      @change="(value) => changeStyles(value, 'YDataType')"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting" style="margin-bottom: 5px">
                <p class="setTitle">轴线颜色</p>
                <div>
                  <c-color-picker
                      style="margin-right: 10px;"
                      size="small"
                      v-model="getComponentInfo.stylesObj.YLineColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'YLineColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">轴标题</p>
                <div>
                  <apiot-input
                      v-model="getComponentInfo.stylesObj.YName"
                      @change="(value) => changeStyles(value, 'YName')"/>
                </div>
              </div>
              <TextStylesConfig
                  title="轴标题样式"
                  title1="轴标题颜色"
                  fontFamily="微软雅黑"
                  :fontFamilyValue="getComponentInfo.stylesObj.YFontFamily"
                  :fontWeightValue="getComponentInfo.stylesObj.YFontWeight"
                  :fontSizeValue="getComponentInfo.stylesObj.YFontSize"
                  :colorValue="getComponentInfo.stylesObj.YColor"
                  @change="({value,key}) => changeStyles(value, `Y${key}`)"
              />
              <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
                <span class="setTitle">刻度线</span>
                <el-switch
                    :value="getComponentInfo.stylesObj.YTickEnable"
                    @change="(value) => changeStyles(value, 'YTickEnable')"
                    active-color="#4689F5"
                    inactive-color="#DCDFE6">
                </el-switch>
              </div>
              <div class="propsSetting">
                <p class="setTitle">刻度线颜色</p>
                <div>
                  <c-color-picker
                      size="small"
                      v-model="getComponentInfo.stylesObj.YTickColor"
                      show-alpha
                      @change="(value) => changeStyles(value, 'YTickColor')"
                      :predefine="predefineColors">
                  </c-color-picker>
                </div>
              </div>
              <TextStylesConfig
                  title="轴标签样式"
                  title1="轴标签颜色"
                  :fontFamilyValue="getComponentInfo.stylesObj.YTickLabelFontFamily"
                  :fontWeightValue="getComponentInfo.stylesObj.YTickLabelFontWeight"
                  :fontSizeValue="getComponentInfo.stylesObj.YTickLabelFontSize"
                  :colorValue="getComponentInfo.stylesObj.YTickLabelColor"
                  @change="({value,key}) => changeStyles(value, `YTickLabel${key}`)"
              />
            </el-collapse-item>
            <el-collapse-item name="22">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">第二Y轴</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.enableY1Axis"
                        @change="(value) => changeTitle(value, 'enableY1Axis')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">轴数据类型</p>
                  <div>
                    <c-select
                        :options="YDataType"
                        :value="getComponentInfo.stylesObj.Y1DataType"
                        @change="(value) => changeStyles(value, 'Y1DataType')"
                    ></c-select>
                  </div>
                </div>
                <div class="propsSetting" style="margin-bottom: 5px">
                  <p class="setTitle">轴线颜色</p>
                  <div>
                    <c-color-picker
                        style="margin-right: 10px;"
                        size="small"
                        v-model="getComponentInfo.stylesObj.Y1LineColor"
                        show-alpha
                        @change="(value) => changeStyles(value, 'Y1LineColor')"
                        :predefine="predefineColors">
                    </c-color-picker>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">轴标题</p>
                  <div>
                    <apiot-input
                        v-model="getComponentInfo.stylesObj.Y1Name"
                        @change="(value) => changeStyles(value, 'Y1Name')"/>
                  </div>
                </div>
                <TextStylesConfig
                    title="轴标题样式"
                    title1="轴标题颜色"
                    fontFamily="微软雅黑"
                    :fontFamilyValue="getComponentInfo.stylesObj.Y1FontFamily"
                    :fontWeightValue="getComponentInfo.stylesObj.Y1FontWeight"
                    :fontSizeValue="getComponentInfo.stylesObj.Y1FontSize"
                    :colorValue="getComponentInfo.stylesObj.Y1Color"
                    @change="({value,key}) => changeStyles(value, `Y1${key}`)"
                />
                <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
                  <span class="setTitle">刻度线</span>
                  <el-switch
                      :value="getComponentInfo.stylesObj.Y1TickEnable"
                      @change="(value) => changeStyles(value, 'Y1TickEnable')"
                      active-color="#4689F5"
                      inactive-color="#DCDFE6">
                  </el-switch>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">刻度线颜色</p>
                  <div>
                    <c-color-picker
                        size="small"
                        v-model="getComponentInfo.stylesObj.Y1TickColor"
                        show-alpha
                        @change="(value) => changeStyles(value, 'Y1TickColor')"
                        :predefine="predefineColors">
                    </c-color-picker>
                  </div>
                </div>
                <TextStylesConfig
                    title="轴标签样式"
                    title1="轴标签颜色"
                    :fontFamilyValue="getComponentInfo.stylesObj.Y1TickLabelFontFamily"
                    :fontWeightValue="getComponentInfo.stylesObj.Y1TickLabelFontWeight"
                    :fontSizeValue="getComponentInfo.stylesObj.Y1TickLabelFontSize"
                    :colorValue="getComponentInfo.stylesObj.Y1TickLabelColor"
                    @change="({value,key}) => changeStyles(value, `Y1TickLabel${key}`)"
                />
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-collapse-item>
      <el-collapse-item title="标注" name="3">
        <el-collapse>
          <el-collapse-item title="折线标注" name="14">
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
                      v-model="getComponentInfo.stylesObj.labelPrefix"
                      @change="(value) => changeStyles(value, 'labelPrefix')"
                  ></apiot-input>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">标注后缀</p>
                <div>
                  <apiot-input
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
          <el-collapse-item name="24">
            <template slot="title">
              <div class="bgSettingWrap">
                <div class="title">柱形标注</div>
                <div class="switchWrap">
                  <el-switch
                      @click.stop.native
                      :value="getComponentInfo.enableLabel"
                      @change="(value) => changeTitle(value, 'enableLabel')"
                      active-color="#4689F5"
                      inactive-color="#DCDFE6">
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
                      :value="getComponentInfo.stylesObj.labelBarField"
                      @change="(value) => changeStyles(value, 'labelBarField')"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">标注前缀</p>
                <div>
                  <apiot-input
                      v-model="getComponentInfo.stylesObj.labelBarPrefix"
                      @change="(value) => changeStyles(value, 'labelBarPrefix')"
                  ></apiot-input>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">标注后缀</p>
                <div>
                  <apiot-input
                      v-model="getComponentInfo.stylesObj.labelBarSuffix"
                      @change="(value) => changeStyles(value, 'labelBarSuffix')"
                  ></apiot-input>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">标注位置</p>
                <div>
                  <c-select
                      :options="positionOptions"
                      :value="getComponentInfo.stylesObj.labelBarPosition"
                      @change="(value) => changeStyles(value, 'labelBarPosition')"
                  ></c-select>
                </div>
              </div>
              <TextStylesConfig
                  title="标注样式"
                  title1="标注颜色"
                  :fontFamilyValue="getComponentInfo.stylesObj.labelBarFontFamily"
                  :fontWeightValue="getComponentInfo.stylesObj.labelBarFontWeight"
                  :fontSizeValue="getComponentInfo.stylesObj.labelBarFontSize"
                  :colorValue="getComponentInfo.stylesObj.labelBarColor"
                  @change="({value,key}) => changeStyles(value, `labelBar${key}`)"
              />
            </div>
          </el-collapse-item>
        </el-collapse>

      </el-collapse-item>
      <el-collapse-item title="其他" name="6">
        <div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否启用海量数据优化</span>
            <el-switch
                :value="getComponentInfo.enableData"
                @change="(value) => changeTitle(value, 'enableData')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>

  </div>
</template>

<script>
import ChartLayOut from '../../Layout/ChartLayout/index';
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import DataColor from '../../basicWidgets/DataColor';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import { predefineColors, symbolOptions } from '../../constants/global';

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
          label: 'x',
          value: 'x'
        }, {
          label: 'y',
          value: 'y'
        }
      ],
      showOptions: [
        {
          label: '折线',
          value: 'normal'
        }, {
          label: '曲线',
          value: 'curve'
        }, {
          label: '梯形',
          value: 'trapezoid'
        }
      ],
      barShowOptions: [
        {
          label: '分组',
          value: 'group'
        }, {
          label: '堆叠',
          value: 'stack'
        }
      ],
      solidOptions: [
        {
          label: '实线',
          value: 'solid'
        }, {
          label: '虚线',
          value: 'dashed'
        }, {
          label: '点线',
          value: 'dotted'
        }
      ],
      symbolOptions,
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
          label: '中间',
          value: 'middle'
        }, {
          label: '底部',
          value: 'bottom'
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
    DataColor,
    LocationProperties,
    TextStylesConfig
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
