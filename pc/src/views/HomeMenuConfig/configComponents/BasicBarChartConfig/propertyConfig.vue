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
          <div class="propsSetting" style="margin-top: 10px;">
            <p class="setTitle">展示形式</p>
            <div>
              <c-select
                  :options="showOptions"
                  :value="getComponentInfo.stylesObj.groupDisplay"
                  @change="(value) => changeStyles(value, 'groupDisplay')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.groupDisplay==='group'">
            <p class="setTitle">组内间距</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :value="getComponentInfo.stylesObj.innerGroupSpace"
                  @change="(value) => changeStyles(value, 'innerGroupSpace')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.groupDisplay==='group'">
            <p class="setTitle">组间间距</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :value="getComponentInfo.stylesObj.interGroupSpace"
                  @change="(value) => changeStyles(value, 'interGroupSpace')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">柱子宽度</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :value="getComponentInfo.stylesObj.barWidth"
                  @change="(value) => changeStyles(value, 'barWidth')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">柱子顶部倒角</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  :value="getComponentInfo.stylesObj.borderRadius"
                  @change="(value) => changeStyles(value, 'borderRadius')"/>
            </div>
          </div>

          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义柱子颜色</span>
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
                  @Input-Change="(value) => changeStyles(value, 'XName')"/>
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
                  type="text"
                  v-model="getComponentInfo.stylesObj.YName"
                  @Input-Change="(value) => changeStyles(value, 'YName')"/>
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
              title1="轴标颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.YTickLabelFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.YTickLabelFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.YTickLabelFontSize"
              :colorValue="getComponentInfo.stylesObj.YTickLabelColor"
              @change="({value,key}) => changeStyles(value, `YTickLabel${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="7" title="交互设置">
        <div>
          <div class="propsSetting">
            <el-radio-group
                class="radioGroup"
                size="mini"
                v-model="getComponentInfo.interactionType"
                @change="(value) => changeTitle(value, 'interactionType')"
            >
              <el-radio-button :label="1">无</el-radio-button>
              <el-radio-button :label="2">面板</el-radio-button>
              <el-radio-button :label="3">菜单</el-radio-button>
              <el-radio-button :label="4">下钻</el-radio-button>
            </el-radio-group>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionType===4">
            <p class="setTitle">下钻回调字段</p>
            <VariableManage
                :valueNameType="2"
                :value="getComponentInfo.drillDownConfig.drillDownField"
                @change="(value) => changeDrillDownConfig('drillDownField', value)"
            ></VariableManage>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionType===4">
            <p class="setTitle">路径颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  :value="getDrillDownConfig('pathColor')"
                  show-alpha
                  @change="(value) => changeDrillDownConfig('pathColor', value)"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionType===4">
              <p class="setTitle">下钻停止标识字段
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="点击匹配下钻停止标识字段，不填写时一直允许下钻"
                    placement="top-start"
                >
                 <span class="icon-bangzhu iconfont" style="cursor: pointer;"></span>
                </el-tooltip>
              </p>
            <div>
              <apiot-input
                  :maxlength="16"
                  :value="getComponentInfo.drillDownConfig.tripStopField"
                  @input="(value) => changeDrillDownConfig('tripStopField', value)"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionType===4">
            <p class="setTitle">下钻停止标识字段值
              <el-tooltip
                  class="item"
                  effect="dark"
                  content="点击时匹配到下钻停止标识字段值为填写值时，不允许继续下钻"
                  placement="top-start"
              >
                <span class="icon-bangzhu iconfont" style="cursor: pointer;"></span>
              </el-tooltip>
            </p>
            <div>
              <apiot-input
                  :maxlength="16"
                  :value="getComponentInfo.drillDownConfig.tripStopFieldValue"
                  @input="(value) => changeDrillDownConfig('tripStopFieldValue', value)"/>
            </div>
          </div>
          <div class="btnWrap">
            <apiot-button
                class="panelBtn"
                v-if="getComponentInfo.interactionType === 2"
                @click="visible=true"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
            </apiot-button>
            <apiot-button
                class="panelBtn"
                v-if="getComponentInfo.interactionType === 3"
                @click="showMenuConfig=true"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
            </apiot-button>
          </div>
        </div>
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
          <div class="propsSetting">
            <p class="setTitle">维度</p>
            <div>
              <c-select
                  :options="dimensionOptions"
                  v-model="getComponentInfo.dimension"
                  @change="(value) => changeTitle(value, 'dimension')"
              ></c-select>
            </div>
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>
    <PanelConfig
        :visible.sync="visible"
        :tabPaneConfig="tabPaneConfig"
        :activeObj="activeObj"
        :isSelPanel="false"
        :showType="showType"
        :otherParams="{ panelType: 5,
                 unDesign: 1,
                 panelClassify: 1,
                 clientType: 1}"
        @cancle-click="handleCancel"
        :isCustomPage="true"
        :treeType="5"
        ref="panelConfig"
    ></PanelConfig>
    <ToMenuConfig
        ref="ToMenuConfig"
        @cancle-click="handleMenuCancel"
        class="ToMenuConfig"
        :visible.sync="showMenuConfig"
        :activeObj="skipMenuConfig"
        :sourceType="1"
        :treeType="5"
        :showType="showType"
        :showContent="true"
    ></ToMenuConfig>
  </div>
</template>

<script>
import PanelConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/PanelConfig';
import ToMenuConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig';
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
      showType: [1, 5],
      showMenuConfig: false,
      visible: false,
      enable: true,
      activeObj: { dialogTitle: '', dialogName: 'PanelDialog' },
      skipMenuConfig: [], // 跳菜单
      dimensionOptions: [
        {
          label: 'x',
          value: 'x'
        }, {
          label: 's',
          value: 's'
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
          label: '中间',
          value: 'middle'
        }, {
          label: '底部',
          value: 'bottom'
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
    LocationProperties,
    DataColor,
    PanelConfig,
    ToMenuConfig
  },

  computed: {
    tabPaneConfig() {
      const { panelConfig } = this.getComponentInfo;
      const { curPaneObj } = panelConfig || {};
      return curPaneObj || {};
    },
    getDrillDownConfig() {
      return function (key) {
        if (!this.getComponentInfo.drillDownConfig) {
          return '';
        }
        return this.getComponentInfo.drillDownConfig[key];
      };
    },
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.list.find((item) => item.componentId === componentId) || {};
      return Obj;
    },
  },

  created() {
    const { panelConfig, skipMenuConfig } = this.getComponentInfo;
    const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
    this.activeObj = panelConfig ? panelConfig.activeObj || initObj : initObj;
    this.skipMenuConfig = skipMenuConfig || [];
  },
  watch: {
  },
  methods: {
    handleMenuCancel() {
      const { menuList = [] } = this.$refs.ToMenuConfig;
      this.changeTitle(menuList, 'skipMenuConfig');
    },
    handleCancel() {
      const { curPaneObj, activeObj } = this.$refs.panelConfig;
      const value = {
        curPaneObj,
        activeObj
      };
      this.changeTitle(value, 'panelConfig');
    },
    changeStyles(value, key) { // 样式修改
      const list = [...this.list];
      const index = this.reduceIndex();
      const info = list[index];
      const { stylesObj } = info || {};
      if (key === 'shadowColor' && !value) {
        value = '';
      }
      if (['color1', 'color2'].includes(key) && !value) {
        value = '#fff';
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...stylesObj,
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
      const index = this.list.findIndex((item) => item.componentId === componentId);
      return index;
    },
    changeTitle(value, key) { // 设置组件名称
      const list = [...this.list];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    changeDrillDownConfig(key, value) { // 改变下钻属性
      const list = [...this.list];
      const index = this.reduceIndex();
      const info = this.getComponentInfo || {};
      const { drillDownConfig = {} } = info;
      const newInfo = {
        ...info,
        drillDownConfig: {
          ...drillDownConfig,
          [key]: value
        }
      };
      console.log(newInfo, 'newInfo');
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
  }
  .radioGroup {
    display: flex;
    width: 100%;
    ::v-deep {
      .el-radio-button {
        flex: 1;
        .el-radio-button__inner {
          width: 100%;
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

  .btnWrap {
    width: 100%;
    margin: 10px auto;

    .panelBtn {
      width: 100%;
    }
  }
  .ToMenuConfig {
    ::v-deep{
      .ToMenuConfig__li--select{
        width: 200px;
      }
      .el-collapse-item__arrow{
        margin: 0 8px 0 auto;
      }
      .el-collapse-item__header {
        position: relative;
        background: #f1f7ff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        height: 38px;
        line-height: 38px;
      }
      .el-collapse-item__content {
        padding: 0 0 8px 0;
        background-color: #fff;
      }
    }
  }
  ::v-deep {
    .action__term--liChild {
      width: 100px;
    }
  }

}
</style>
