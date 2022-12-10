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
          <div class="propsSetting">
            <span class="setTitle">水平中心坐标(%)</span>
            <c-slider
                v-model="getComponentInfo.stylesObj.centerX"
                @change="(value) => changeStyles(value, 'centerX')"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">垂直中心坐标(%)</span>
            <c-slider
                v-model="getComponentInfo.stylesObj.centerY"
                @change="(value) => changeStyles(value, 'centerY')"
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
            <p class="setTitle">指示器轴的分割段数</p>
            <el-input-number
                controls-position="right"
                :min="1"
                :value="getComponentInfo.stylesObj.splitNumber"
                @change="(value) => changeStyles(value, 'splitNumber')"
            />
          </div>
          <div class="propsSetting">
            <p class="setTitle">绘制类型</p>
            <div>
              <c-select
                  :options="drawType"
                  :value="getComponentInfo.stylesObj.shape"
                  @change="(value) => changeStyles(value, 'shape')"
              ></c-select>
            </div>
          </div>
          <el-collapse>
            <el-collapse-item name="7">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">坐标轴轴线</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.enableGlobalAxisLine"
                        @change="(value) => changeTitle(value, 'enableGlobalAxisLine')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE9">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">坐标轴线颜色</p>
                  <div>
                    <c-color-picker
                        size="small"
                        v-model="getComponentInfo.stylesObj.axisColor"
                        show-alpha
                        @change="(value) => changeStyles(value, 'axisColor')"
                        :predefine="predefineColors">
                    </c-color-picker>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">坐标轴宽度</p>
                  <el-input-number
                      controls-position="right"
                      :min="0"
                      :value="getComponentInfo.stylesObj.axisWidth"
                      @change="(value) => changeStyles(value, 'axisWidth')"
                  />
                </div>
                <div class="propsSetting">
                  <p class="setTitle">坐标轴线类型</p>
                  <div>
                    <c-select
                        :options="LineTYPE"
                        :value="getComponentInfo.stylesObj.axisType"
                        @change="(value) => changeStyles(value, 'axisType')"
                    ></c-select>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="8">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">坐标轴刻度</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.enableGlobalAxisTick"
                        @change="(value) => changeTitle(value, 'enableGlobalAxisTick')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE9">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">轴刻度颜色</p>
                  <div>
                    <c-color-picker
                        size="small"
                        v-model="getComponentInfo.stylesObj.axisTickColor"
                        show-alpha
                        @change="(value) => changeStyles(value, 'axisTickColor')"
                        :predefine="predefineColors">
                    </c-color-picker>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">轴刻度宽度</p>
                  <el-input-number
                      controls-position="right"
                      :min="0"
                      :value="getComponentInfo.stylesObj.axisTickWidth"
                      @change="(value) => changeStyles(value, 'axisTickWidth')"
                  />
                </div>
                <div class="propsSetting">
                  <p class="setTitle">轴刻度长度</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisTickLength"
                      @change="(value) => changeStyles(value, 'axisTickLength')"
                  />
                </div>
                <div class="propsSetting">
                  <p class="setTitle">刻度线类型</p>
                  <div>
                    <c-select
                        :options="LineTYPE"
                        :value="getComponentInfo.stylesObj.axisTickType"
                        @change="(value) => changeStyles(value, 'axisTickType')"
                    ></c-select>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="9">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">坐标轴标签</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.enableGlobalAxisLabel"
                        @change="(value) => changeTitle(value, 'enableGlobalAxisLabel')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE9">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <TextStylesConfig
                    title="标签样式"
                    title1="标签颜色"
                    :fontFamilyValue="getComponentInfo.stylesObj.axisLabelFontFamily"
                    :fontWeightValue="getComponentInfo.stylesObj.axisLabelFontWeight"
                    :fontSizeValue="getComponentInfo.stylesObj.axisLabelFontSize"
                    :colorValue="getComponentInfo.stylesObj.axisLabelColor"
                    @change="({value,key}) => changeStyles(value, `axisLabel${key}`)"
                />
                <div class="propsSetting">
                  <p class="setTitle">标签旋转角度</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisLabelRotate"
                      @change="(value) => changeStyles(value, 'axisLabelRotate')"
                  />
                </div>
                <div class="propsSetting">
                  <p class="setTitle">标签偏移</p>
                  <el-input-number
                      controls-position="right"
                      :value="getComponentInfo.stylesObj.axisLabelMargin"
                      @change="(value) => changeStyles(value, 'axisLabelMargin')"
                  />
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="10">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">分隔线</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.enableGlobalSplitLine"
                        @change="(value) => changeTitle(value, 'enableGlobalSplitLine')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE9">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">分割线宽度</p>
                  <el-input-number
                      controls-position="right"
                      :min="0"
                      :value="getComponentInfo.stylesObj.splitLineWidth"
                      @change="(value) => changeStyles(value, 'splitLineWidth')"
                  />
                </div>
                <div class="propsSetting">
                  <p class="setTitle">分割线类型</p>
                  <div>
                    <c-select
                        :options="LineTYPE"
                        :value="getComponentInfo.stylesObj.splitLineType"
                        @change="(value) => changeStyles(value, 'splitLineType')"
                    ></c-select>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">分割线颜色</p>
                  <div>
                    <dataColor
                        :value="getComponentInfo.stylesObj.splitLineColor"
                        :single="true"
                        @change="(value) => changeStyles(value, 'splitLineColor')"
                    />
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="11">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">分隔区域</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.enableGlobalSplitArea"
                        @change="(value) => changeTitle(value, 'enableGlobalSplitArea')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE9">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="propsSetting">
                  <p class="setTitle">区域填充色</p>
                  <div>
                    <dataColor
                        :value="getComponentInfo.stylesObj.colorArr"
                        :single="true"
                        @change="(value) => changeStyles(value, 'colorArr')"
                    />
                  </div>
                </div>
              </div>
            </el-collapse-item>

          </el-collapse>
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
            <div class="title">维度配置</div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">维度字段
              <el-tooltip
                  class="item"
                  effect="dark"
                  content="维度字段需要和数据中的字段统一"
                  placement="top"
              >
                <span style="cursor: pointer;" class="icon-wentibangzhu iconfont"></span>
              </el-tooltip>
            </p>
            <div>
              <apiot-input
                  v-model="getComponentInfo.stylesObj.dataField"
                  @input="(value) => changeStyles(value, 'dataField')"
              />
            </div>
          </div>
          <el-tabs
              v-model="active"
              :editable="true"
              type="card"
              closable
              @tab-remove="removeTab"
              @tab-add="addTab"
          >
            <el-tab-pane
                v-for="(item, i) in getComponentInfo.indicator"
                :key="`a_${i}`"
                :label="`${item.name}`"
                :name="`a_${i}`"
                lazy
            >
              <div>
                <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
                  <span class="setTitle">是否启用</span>
                  <el-switch
                      v-model="item.enable"
                      @change="(value) => changeIndicator(value, 'enable', i, 'indicator')"
                      active-color="#4689F5"
                      inactive-color="#DCDFE9">
                  </el-switch>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">维度字段值</p>

                  <div>
                    <apiot-input
                        type="text"
                        v-model="item.fieldValue"
                        @input="(value) => changeIndicator(
                            value, 'fieldValue', i, 'indicator')"
                    ></apiot-input>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">维度名称</p>

                  <div>
                    <apiot-input
                        v-model="item.name"
                        @input="(value) => changeIndicator(value, 'name', i)"
                    ></apiot-input>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">维度最小值</p>
                  <div>
                    <el-input-number
                        controls-position="right"
                        :value="item.min"
                        @change="(value) => changeIndicator(value, 'min', i, 'indicator')"
                    />
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">维度最大值</p>

                  <div>
                    <el-input-number
                        controls-position="right"
                        :value="item.max"
                        @change="(value) => changeIndicator(value, 'max', i, 'indicator')"
                    />
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">维度特殊标识颜色</p>

                  <div>
                    <c-color-picker
                        size="small"
                        v-model="item.color"
                        show-alpha
                        @change="(value) => changeIndicator(value, 'color', i, 'indicator')"
                        :predefine="predefineColors">
                    </c-color-picker>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">维度名称</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableDimension"
                  @change="(value) => changeTitle(value, 'enableDimension')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE9">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">维度名称离轴的距离</p>
            <el-input-number
                controls-position="right"
                :value="getComponentInfo.stylesObj.nameGap"
                @change="(value) => changeStyles(value, 'nameGap')"
            />
          </div>
          <TextStylesConfig
              title="名称样式"
              title1="名称颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.axisNameFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.axisNameFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.axisNameFontSize"
              :colorValue="getComponentInfo.stylesObj.axisNameColor"
              @change="({value,key}) => changeStyles(value, `axisName${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item title="自定义" name="6">
        <div>
          <el-tabs
              v-model="active1"
              :editable="true"
              type="card"
              closable
              @tab-remove="removeTab1"
              @tab-add="addTab1"
          >
            <el-tab-pane
                v-for="(item, i) in getComponentInfo.customStyle"
                :key="`a_${i}`"
                :label="`${item.name}`"
                :name="`a_${i}`"
                lazy
            >
              <div>
                <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
                  <span class="setTitle">是否启用</span>
                  <el-switch
                      v-model="item.enable"
                      @change="(value) => changeIndicator(value, 'enable', i, 'customStyle')"
                      active-color="#4689F5"
                      inactive-color="#DCDFE9">
                  </el-switch>
                </div>
                <el-collapse>
                  <el-collapse-item name="14">
                    <template slot="title">
                      <div class="bgSettingWrap">
                        <div class="title">标签</div>
                        <div class="switchWrap">
                          <el-switch
                              @click.stop.native
                              :value="item.show"
                              @change="(value) => changeIndicator(value, 'show', i, 'customStyle')"
                              active-color="#4689F5"
                              inactive-color="#DCDFE9">
                          </el-switch>
                        </div>
                      </div>
                    </template>
                    <div>
                      <TextStylesConfig
                          title="标签样式"
                          title1="标签颜色"
                          :fontFamilyValue="item.axisLabelFontFamily"
                          :fontWeightValue="item.axisLabelFontWeight"
                          :fontSizeValue="item.axisLabelFontSize"
                          :colorValue="item.axisLabelColor"
                          @change="({value,key}) => changeIndicator(
                              value, `axisLabel${key}`, i, 'customStyle')"
                      />
                      <div class="propsSetting">
                        <p class="setTitle">标签旋转角度</p>
                        <el-input-number
                            controls-position="right"
                            :value="item.axisLabelRotate"
                            @change="(value) => changeIndicator(
                                value, 'axisLabelRotate', i, 'customStyle')"
                        />
                      </div>
                      <div class="propsSetting">
                        <p class="setTitle">标签偏移</p>
                        <el-input-number
                            controls-position="right"
                            :value="item.axisLabelMargin"
                            @change="(value) => changeIndicator(
                                value, 'axisLabelMargin', i, 'customStyle')"
                        />
                      </div>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="15">
                    <template slot="title">
                      <div class="bgSettingWrap">
                        <div class="title">线条样式</div>
                      </div>
                    </template>
                    <div>
                      <div class="propsSetting">
                        <p class="setTitle">线宽度</p>
                        <el-input-number
                            controls-position="right"
                            :min="0"
                            :value="item.splitLineWidth"
                            @change="(value) => changeIndicator(
                                value, 'splitLineWidth', i, 'customStyle')"
                        />
                      </div>
                      <div class="propsSetting">
                        <p class="setTitle">线类型</p>
                        <div>
                          <c-select
                              :options="LineTYPE"
                              :value="item.splitLineType"
                              @change="(value) => changeIndicator(
                                  value, 'splitLineType', i, 'customStyle')"
                          ></c-select>
                        </div>
                      </div>
                      <div class="propsSetting">
                        <p class="setTitle">线颜色</p>
                        <div>
                          <c-color-picker
                              size="small"
                              v-model="item.axisColor"
                              show-alpha
                              @change="(value) => changeIndicator(
                                  value, 'axisColor', i, 'customStyle')"
                              :predefine="predefineColors">
                          </c-color-picker>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="16">
                    <template slot="title">
                      <div class="bgSettingWrap">
                        <div class="title">区域填充样式</div>
                        <div class="switchWrap">
                          <el-switch
                              @click.stop.native
                              :value="item.enableSplitArea"
                              @change="(value) => changeIndicator(
                                  value, 'enableSplitArea', i, 'customStyle')"
                              active-color="#4689F5"
                              inactive-color="#DCDFE9">
                          </el-switch>
                        </div>
                      </div>
                    </template>
                    <div>
                      <div class="propsSetting">
                        <p class="setTitle">区域填充色</p>
                        <div>
                          <c-color-picker
                              size="small"
                              v-model="item.colorArr"
                              show-alpha
                              @change="(value) => changeIndicator(
                                  value, 'colorArr', i, 'customStyle')"
                              :predefine="predefineColors">
                          </c-color-picker>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item name="17">
                    <template slot="title">
                      <div class="bgSettingWrap">
                        <div class="title">悬浮样式</div>
                        <div class="switchWrap">
                          <el-switch
                              @click.stop.native
                              :value="item.enableHover"
                              @change="(value) => changeIndicator(
                                  value, 'enableHover', i, 'customStyle')"
                              active-color="#4689F5"
                              inactive-color="#DCDFE9">
                          </el-switch>
                        </div>
                      </div>
                    </template>
                    <div v-if="item.enableHover">
                      <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
                        <span class="setTitle">是否启用标签</span>
                        <el-switch
                            v-model="item.enableLabel"
                            @change="(value) => changeIndicator(
                                value, 'enableLabel', i, 'customStyle')"
                            active-color="#4689F5"
                            inactive-color="#DCDFE9">
                        </el-switch>
                      </div>
                      <div class="propsSetting">
                        <p class="setTitle">标签颜色</p>
                        <div>
                          <c-color-picker
                              size="small"
                              v-model="item.labelColor"
                              show-alpha
                              @change="(value) => changeIndicator(
                                  value, 'labelColor', i, 'customStyle')"
                              :predefine="predefineColors">
                          </c-color-picker>
                        </div>
                      </div>
                      <div class="propsSetting">
                        <p class="setTitle">线颜色</p>
                        <div>
                          <c-color-picker
                              size="small"
                              v-model="item.lineColor"
                              show-alpha
                              @change="(value) => changeIndicator(
                                  value, 'lineColor', i, 'customStyle')"
                              :predefine="predefineColors">
                          </c-color-picker>
                        </div>
                      </div>
                      <div class="propsSetting">
                        <p class="setTitle">填充颜色</p>
                        <div>
                          <c-color-picker
                              size="small"
                              v-model="item.areaStyle"
                              show-alpha
                              @change="(value) => changeIndicator(
                                  value, 'areaStyle', i, 'customStyle')"
                              :predefine="predefineColors">
                          </c-color-picker>
                        </div>
                      </div>
                    </div>
                  </el-collapse-item>

                </el-collapse>

              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-collapse-item>

    </el-collapse>

  </div>
</template>

<script>
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import DataColor from '../../basicWidgets/DataColor';
import { predefineColors, LineTYPE } from '../../constants/global';

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
      active: 'a_0',
      active1: 'a_0',
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
      drawType: [
        {
          label: '多边形',
          value: 'polygon'
        }, {
          label: '圆圈',
          value: 'circle'
        }
      ],
      activeName: '',
      color1: '#ffffff',
      color2: '#ffffff',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors,
      LineTYPE,
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
    LocationProperties,
    TextStylesConfig,
    DataColor
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

  mounted() {
  },
  watch: {
    active: {
      deep: true,
      handler(val, oldVal) { // 普通的watch监听
        console.log(`a: ${val}`, oldVal, this.getComponentInfo);
      }
    }
  },
  methods: {
    addTab1() {
      const info = this.getComponentInfo;
      const customStyle = info.customStyle || [];
      const len = customStyle.length;
      customStyle.push({
        name: `自定义${len + 1}`,
        show: false,
        axisLabelFontFamily: 'Arial,苹方,微软雅黑',
        axisLabelFontWeight: 'normal',
        axisLabelFontSize: 16,
        axisLabelColor: '#FFF',
        axisLabelRotate: 0,
        axisLabelMargin: 8,
        splitLineWidth: 1,
        axisColor: '#fff',
        splitLineType: 'solid',
        enableSplitArea: false,
        colorArr: '',
        enableHover: false,
        labelColor: '',
        lineColor: '',
        areaStyle: ''
      });
      this.active1 = `a_${len}`;
      this.changeTitle(customStyle, 'customStyle');
    },
    removeTab1(name) {
      const arr = name.split('_');
      const i = +arr[1];
      const info = this.getComponentInfo;
      const customStyle = info.customStyle || [];
      customStyle.splice(i, 1);
      if (i - 1 >= 0) {
        this.active1 = `a_${i - 1}`;
      } else {
        this.active1 = 'a_0';
      }
      this.changeTitle(customStyle, 'customStyle');
    },
    addTab() {
      const info = this.getComponentInfo;
      const indicator = info.indicator || [];
      indicator.push({
        name: '维度名称', max: 100, enable: false, fieldValue: ''
      });
      const len = indicator.length;
      this.active = `a_${len - 1}`;
      this.changeTitle(indicator, 'indicator');
    },
    removeTab(name) {
      const arr = name.split('_');
      const i = +arr[1];
      const info = this.getComponentInfo;
      const indicator = info.indicator || [];
      indicator.splice(i, 1);
      if (i - 1 >= 0) {
        this.active = `a_${i - 1}`;
      } else {
        this.active = 'a_0';
      }
      this.changeTitle(indicator, 'indicator');
    },
    changeIndicator(v, key, i, subKey) { // 修改维度信息
      const info = this.getComponentInfo;
      const indicator = info[subKey] || [];
      const obj = {
        ...indicator[i],
        [key]: v
      };
      indicator.splice(i, 1, obj);
      this.changeTitle(indicator, subKey);
    },
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

  ::v-deep {
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border: none;
    }

    .el-tabs--card > .el-tabs__header {
      border: none;
    }

    .el-tabs__item {
      padding: 0 10px;
      color: #333;
      opacity: .7;
    }

    .el-tabs__item.is-active {
      color: #4689F5;
      opacity: 1;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
      padding-left: 15px;
      padding-right: 15px;
    }

    .el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2),
    .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
      padding-left: 15px;
    }

    .el-tabs__nav-next, .el-tabs__nav-prev {
      line-height: 40px;
      color: #666666;

      &:hover {
        color: #4689F5;
      }
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
      color: #4689F5;
      opacity: 1;
    }

    .el-tabs__item .el-icon-close:hover {
      background: none;
      color: #4689F5;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
      top: -2px;
      right: 3px;
    }

    .el-tabs__new-tab {
      color: #666666;
      border: none;
      outline: none;
    }

    .el-tabs__header {
      margin: 0;
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
