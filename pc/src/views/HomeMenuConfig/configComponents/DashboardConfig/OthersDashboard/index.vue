/**
* @name: index
* @author: DELL
* @date: 2021/12/23 9:30
* @description：index
* @update: 2021/12/23 9:30
*/
<!-- 页面 -->
<template>
  <div>
    <div class="columnConfigWrap">
      <el-tabs
          v-model="active"
          :editable="true"
          type="card"
          closable
          @tab-remove="removeTab"
          @tab-add="addTab"
      >
        <el-tab-pane
            v-for="(item, i) in config"
            :key="`a_${i}`"
            :label="`仪表盘${(item.index || 0) + 1}`"
            :name="`a_${i}`"
        >
          <div>
            <div class="propsSetting">
              <span class="setTitle">起始角度</span>
              <c-slider
                  @change="(value) => changeStyles(value, 'startAngle', i, item)"
                  :value="item.stylesObj.startAngle"
                  :min="-180"
                  :max="360"
              ></c-slider>
            </div>
            <div class="propsSetting">
              <span class="setTitle">结束角度</span>
              <c-slider
                  @change="(value) => changeStyles(value, 'endAngle', i, item )"
                  v-model="item.stylesObj.endAngle"
                  :min="-180"
                  :max="360"
              ></c-slider>
            </div>
            <div class="propsSetting">
              <span class="setTitle">半径</span>
              <c-slider
                  @change="(value) => changeStyles(value, 'radius', i, item)"
                  v-model="item.stylesObj.radius"
              ></c-slider>
            </div>
            <div class="propsSetting">
              <span class="setTitle">水平中心坐标(%)</span>
              <c-slider
                  @change="(value) => changeStyles(value, 'horizontalCenter', i, item)"
                  v-model="item.stylesObj.horizontalCenter"
              ></c-slider>
            </div>
            <div class="propsSetting">
              <span class="setTitle">垂直中心坐标(%)</span>
              <c-slider
                  @change="(value) => changeStyles(value, 'verticalCenter', i, item)"
                  v-model="item.stylesObj.verticalCenter"
              ></c-slider>
            </div>
            <div class="propsSetting">
              <p class="setTitle">刻度最小值</p>
              <el-input-number
                  :min="0"
                  controls-position="right"
                  :value="item.stylesObj.min"
                  @change="(value) => changeStyles(Number(value), 'min', i, item)"/>
            </div>
            <div class="propsSetting">
              <p class="setTitle">刻度最大值</p>
              <el-input-number
                  controls-position="right"
                  :value="item.stylesObj.max"
                  @change="(value) => changeStyles(value, 'max', i, item)"/>
            </div>
            <div class="propsSetting">
              <p class="setTitle">刻度分割段数</p>
              <el-input-number
                  :min="0"
                  controls-position="right"
                  :value="item.stylesObj.splitNumber"
                  @change="(value) => changeStyles(value, 'splitNumber', i, item)"/>
            </div>
            <el-collapse>
              <el-collapse-item name="5">
                <template slot="title">
                  <div class="bgSettingWrap">
                    <div class="title">仪表盘轴线</div>
                    <div class="switchWrap">
                      <el-switch
                          @click.stop.native
                          :value="item.axisLine"
                          @change="(value) => changeTitle(value, 'axisLine', i, item)"
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
                        :value="item.stylesObj.roundCap"
                        @change="(value) => changeStyles(value, 'roundCap', i, item)"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">轴线宽度</p>
                    <el-input-number
                        :min="0"
                        controls-position="right"
                        :value="item.stylesObj.axisLineWidth"
                        @change="(value) => changeStyles(value, 'axisLineWidth', i, item)"/>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">轴线颜色</p>
                    <color-manage
                        :value="item.stylesObj.axisLineColorConfig"
                        @change="(value) => changeStyles(value, 'axisLineColorConfig', i, item)">
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
                          :value="item.progress"
                          @change="(value) => changeTitle(value, 'progress', i, item)"
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
                        :value="item.stylesObj.progressRoundCap"
                        @change="(value) => changeStyles(value, 'progressRoundCap', i, item)"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">宽度</p>
                    <el-input-number
                        :min="0"
                        controls-position="right"
                        :value="item.stylesObj.progressWidth"
                        @change="(value) => changeStyles(value, 'progressWidth', i, item)"/>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">进度条颜色</p>
                    <div>
                      <c-color-picker
                          style="margin-right: 10px;"
                          size="small"
                          v-model="item.stylesObj.progressColor"
                          show-alpha
                          @change="(value) => changeStyles(value, 'progressColor', i, item)"
                          :predefine="predefineColors">
                      </c-color-picker>
                    </div>
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
                          :value="item.splitLine"
                          @change="(value) => changeTitle(value, 'splitLine', i, item)"
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
                        :value="item.stylesObj.splitLineLength"
                        @change="(value) => changeStyles(value, 'splitLineLength', i, item)"/>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">离轴线的距离</p>
                    <el-input-number
                        controls-position="right"
                        :value="item.stylesObj.splitLineDistance"
                        @change="(value) => changeStyles(value, 'splitLineDistance', i, item)"/>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">分割线颜色</p>
                    <div>
                      <c-color-picker
                          style="margin-right: 10px;"
                          size="small"
                          v-model="item.stylesObj.splitLineColor"
                          show-alpha
                          @change="(value) => changeStyles(value, 'splitLineColor', i, item)"
                          :predefine="predefineColors">
                      </c-color-picker>
                    </div>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">分割线宽度</p>
                    <el-input-number
                        controls-position="right"
                        :value="item.stylesObj.splitLineWidth"
                        @change="(value) => changeStyles(value, 'splitLineWidth', i, item)"/>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">分割线类型</p>
                    <div>
                      <c-select
                          :options="typeOptions"
                          v-model="item.stylesObj.splitLineType"
                          @change="(value) => changeTitle(value, 'splitLineType', i, item)"
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
                          :value="item.axisTick"
                          @change="(value) => changeTitle(value, 'axisTick', i, item)"
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
                        :value="item.stylesObj.axisTickSplitNumber"
                        @change="(value) => changeStyles(value, 'axisTickSplitNumber', i, item)"
                    />
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">刻度线长</p>
                    <el-input-number
                        controls-position="right"
                        :value="item.stylesObj.axisTickLength"
                        @change="(value) => changeStyles(value, 'axisTickLength', i, item)"/>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">刻度线与轴线的距离</p>
                    <el-input-number
                        controls-position="right"
                        :value="item.stylesObj.axisTickDistance"
                        @change="(value) => changeStyles(value, 'axisTickDistance', i, item)"
                    />
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">刻度线颜色</p>
                    <div>
                      <c-color-picker
                          style="margin-right: 10px;"
                          size="small"
                          v-model="item.stylesObj.axisTickColor"
                          show-alpha
                          @change="(value) => changeStyles(value, 'axisTickColor', i, item)"
                          :predefine="predefineColors">
                      </c-color-picker>
                    </div>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">刻度线宽度</p>
                    <el-input-number
                        controls-position="right"
                        :value="item.stylesObj.axisTickWidth"
                        @change="(value) => changeStyles(value, 'axisTickWidth', i, item)"
                    />
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">刻度线类型</p>
                    <div>
                      <c-select
                          :options="typeOptions"
                          v-model="item.stylesObj.axisTickType"
                          @change="(value) => changeTitle(value, 'axisTickType', i, item)"
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
                          :value="item.axisLabel "
                          @change="(value) => changeTitle(value, 'axisLabel', i, item)"
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
                        :value="item.stylesObj.axisLabelDistance"
                        @change="(value) => changeStyles(value, 'axisLabelDistance', i, item)"
                    />
                  </div>
                  <TextStylesConfig
                      title="标签字体样式"
                      title1="标签字体颜色"
                      :fontFamilyValue="item.stylesObj.axisLabelFontFamily"
                      :fontWeightValue="item.stylesObj.axisLabelFontWeight"
                      :fontSizeValue="item.stylesObj.axisLabelFontSize"
                      :colorValue="item.stylesObj.axisLabelColor"
                      @change="({value,key}) => changeStyles(value, `axisLabel${key}`, i, item)"
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
                          :value="item.pointer"
                          @change="(value) => changeTitle(value, 'pointer', i, item)"
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
                        v-model="item.stylesObj.icon"
                        @change="(value) => changeStyles(value, 'icon', i, item)"
                    ></c-select>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">指针长度(%)</p>
                    <el-input-number
                        controls-position="right"
                        :min="0"
                        :max="100"
                        :value="item.stylesObj.pointerLength"
                        @change="(value) => changeStyles(value, 'pointerLength', i, item)"
                    />
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">指针宽度</p>
                    <el-input-number
                        controls-position="right"
                        :min="0"
                        :max="100"
                        :value="item.stylesObj.pointerWidth"
                        @change="(value) => changeStyles(value, 'pointerWidth', i, item)"
                    />
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">指针颜色</p>
                    <div>
                      <c-color-picker
                          style="margin-right: 10px;"
                          size="small"
                          v-model="item.stylesObj.pointerColor"
                          show-alpha
                          @change="(value) => changeStyles(value, 'pointerColor', i, item)"
                          :predefine="predefineColors">
                      </c-color-picker>
                    </div>
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
                          :value="item.anchor"
                          @change="(value) => changeTitle(value, 'anchor',i, item)"
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
                        v-model="item.stylesObj.anchorIcon"
                        @change="(value) => changeTitle(value, 'anchorIcon',i, item)"
                    ></c-select>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">圆心大小</p>
                    <el-input-number
                        controls-position="right"
                        :min="0"
                        :max="100"
                        :value="item.stylesObj.anchorSize"
                        @change="(value) => changeStyles(value, 'anchorSize', i, item)"
                    />
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">圆心颜色</p>
                    <div>
                      <c-color-picker
                          style="margin-right: 10px;"
                          size="small"
                          v-model="item.stylesObj.anchorColor"
                          show-alpha
                          @change="(value) => changeStyles(value, 'anchorColor',i, item)"
                          :predefine="predefineColors">
                      </c-color-picker>
                    </div>
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
                          :value="item.detail"
                          @change="(value) => changeTitle(value, 'detail',i, item)"
                          active-color="#4689F5"
                          inactive-color="#DCDFE6">
                      </el-switch>
                    </div>
                  </div>
                </template>
                <div>
                  <div class="propsSetting">
                    <p class="setTitle">值映射字段</p>
                    <el-input-number
                        controls-position="right"
                        :min="0"
                        :max="100"
                        :value="item.stylesObj.labelPrefix"
                        @change="(value) => changeStyles(value, 'labelPrefix', i, item)"
                    />
                  </div>
                  <TextStylesConfig
                      title="值字体样式"
                      title1="值字体颜色"
                      fontFamily="微软雅黑"
                      :fontFamilyValue="item.stylesObj.detailFontFamily"
                      :fontWeightValue="item.stylesObj.detailFontWeight"
                      :fontSizeValue="item.stylesObj.detailFontSize"
                      :colorValue="item.stylesObj.detailColor"
                      @change="({value,key}) => changeStyles(value, `detail${key}`,i, item)"
                  />
                  <div class="propsSetting">
                    <span class="setTitle">水平方向偏移(%)</span>
                    <c-slider
                        @change="(value) => changeStyles(value, 'horizontalOffset',i, item)"
                        v-model="item.stylesObj.horizontalOffset"
                        :min="-100"
                        :max="100"
                    ></c-slider>
                  </div>
                  <div class="propsSetting">
                    <span class="setTitle">垂直方向偏移(%)</span>
                    <c-slider
                        @change="(value) => changeStyles(value, 'verticalOffset',i, item)"
                        v-model="item.stylesObj.verticalOffset"
                        :min="-100"
                        :max="100"
                    ></c-slider>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">标注前缀</p>
                    <div>
                      <apiot-input
                          v-model="item.stylesObj.detailPrefix"
                          @change="(value) => changeStyles(value, 'labelPrefix',i, item)"
                      ></apiot-input>
                    </div>
                  </div>
                  <div class="propsSetting">
                    <p class="setTitle">标注后缀</p>
                    <div>
                      <apiot-input
                          v-model="item.stylesObj.detailSuffix"
                          @change="(value) => changeStyles(value, 'labelSuffix',i, item)"
                      ></apiot-input>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import { predefineColors } from '../../../constants/global';
import TextStylesConfig from '../../../Layout/TextStylesConfig/index';

export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      config: null,
      active: null,
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
    TextStylesConfig
  },

  computed: {},
  watch: {},
  mounted() {
    this.config = JSON.parse(JSON.stringify(this.value));
    if (this.config.length) {
      this.active = 'a_0';
    }
    this.$nextTick(() => {
      this.rowDrop(); // 行拖拽效果
    });
  },

  methods: {
    rowDrop() {
      const el = document.querySelector('.columnConfigWrap .el-tabs__nav');
      const _this = this;
      Sortable.create(el, {
        animation: 700,
        onEnd({ newIndex, oldIndex }) { // oldIIndex拖放前的位置， newIndex拖放后的位置
          const currRow = _this.config.splice(oldIndex, 1)[0]; // 鼠标拖拽当前的el-tabs-pane
          _this.config.splice(newIndex, 0, currRow); // tableData 是存放所以el-tabs-pane的数组
        }
      });
    },
    removeTab(name) {
      const i = +name.split('_')[1];
      this.config.splice(i, 1);
      this.$emit('change', this.config);
      this.active = `a_${this.config.length - 1}`;
    },
    addTab() {
      const n = this.config.length;
      const obj = {
        index: n,
        axisLine: true, // 是否启用仪表盘轴线
        progress: true, // 是否启用展示当前进度
        splitLine: true, // 是否启用分割线
        axisTick: true, // 是否启用刻度样式
        axisLabel: true, // 是否启用刻度标签
        pointer: true, // 是否启用指针
        anchor: true, // 指针圆心
        detail: true,
        stylesObj: {
          startAngle: 180, // 起始角度
          endAngle: 0, // 结束角度
          radius: 100, // 仪表盘半价
          max: 180, // 刻度最大值
          min: 0, // 刻度最小值
          verticalCenter: 50, // 垂直中心坐标
          horizontalCenter: 50, // 水平中心坐标
          splitNumber: 5, // 刻度分割段数
          roundCap: true, // 两端启用圆角
          axisLineWidth: 10, // 轴线宽度
          axisLineColorConfig: [{ name: 1, value: '#E6EBF8' }], // 轴线颜色
          progressRoundCap: true, // 进度条
          progressWidth: 10, // 进度条宽度
          progressColor: '#58D9F9', // 进度条颜色
          splitLineLength: 10, // 分割线长度
          splitLineDistance: 10, // 分割线离轴线的距离
          splitLineColor: '#fff', // 分割线颜色
          splitLineWidth: 2, // 分割线宽度
          splitLineType: 'solid', // 分割线类型， 实现，虚线，点线
          axisTickSplitNumber: 5, // 分隔线之间分割的刻度数
          axisTickLength: 10, // 刻度线长
          axisTickDistance: 0, // 刻度线与轴线的距离
          axisTickColor: '#fff', // 刻度线颜色
          axisTickWidth: 2, // 刻度线宽度
          axisTickType: 'solid', // 刻度线类型， 实现，虚线，点线
          axisLabelDistance: 10, // 标签与刻度线的距离
          axisLabelFontFamily: 'Arial,苹方,微软雅黑', // 标签字体
          axisLabelFontWeight: 'normal', // 标签文字粗细
          axisLabelFontSize: 16, // 标签文字大小
          axisLabelColor: '#FFF', // 标签文字颜色
          icon: '', // 指针图标， 默认
          pointerLength: 60, // 指针长度
          pointerWidth: 5, // 指针宽度
          pointerColor: '#58D9F9', // 制作颜色
          anchorIcon: 'none', // 指针圆心图标， 默认
          anchorSize: 6, // 指针圆心大小
          anchorColor: '#000', // 指针圆心颜色
          horizontalOffset: 0, // 水平方向偏移
          verticalOffset: 35, // 垂直方向偏移
          detailFontFamily: 'Arial,苹方,微软雅黑',
          detailFontWeight: 'normal',
          detailFontSize: 16,
          detailColor: '#FFF',
          valueMappingField: '', // 值映射字段
          detailPrefix: '', // 值前缀
          detailSuffix: '' // 值后缀
        }
      };
      this.config.push(obj);
      this.active = `a_${this.config.length - 1}`;
      this.$nextTick(() => {
        this.$emit('change', this.config);
      });
    },
    changeStyles(val, key, i, obj) {
      const { stylesObj = {}, ...rest } = obj;
      const newObj = {
        ...rest,
        stylesObj: {
          ...stylesObj,
          [key]: val
        }

      };
      this.config.splice(i, 1, newObj);
      this.$emit('change', this.config);
    },
    changeTitle(val, key, i, obj) {
      const newObj = {
        ...obj,
        [key]: val
      };
      this.config.splice(i, 1, newObj);
      this.$emit('change', this.config);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.columnConfigWrap {
  .propsSetting {
    margin-bottom: 10px;
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
      display: inline-block;
      margin: 0;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 30px;
      text-align: left;
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
  .flex {
    display: flex;
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
      color: #333333;
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
      color: #333333;

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
      border: none;
      outline: none;
      color: #333333;
    }

    .el-tabs__header {
      margin: 0;
    }
  }
}
</style>
