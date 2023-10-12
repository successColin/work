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
    <div class="ellipsisWrap flex propsSetting">
      <span class="setTitle">固定组件</span>
      <el-switch
          :value="getComponentInfo.isFixed"
          @change="(value) => changeTitle(value, 'isFixed')"
          active-color="#4689F5"
          inactive-color="#DCDFE6">
      </el-switch>
    </div>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="2" title="地图基础配置">
        <div>
          <div class="propsSetting">
            <p class="setTitle">地图中心点</p>
            <apiot-input
                :value="getComponentInfo.stylesObj.mapCenterPoint"
                @input="(value) => changeStyles(value, 'mapCenterPoint')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">地图初始化层级</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.initLevel"
                @change="(value) => changeStyles(Number(value), 'initLevel')"/>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">启用鼠标滚轮缩放</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableScrollWheelZoom"
                @change="changeStyles($event, 'enableScrollWheelZoom')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="1" title="地图风格配置">
        <div>
          <div class="propsSetting">
            <p class="setTitle">类型配置</p>
            <div>
              <apiot-radio
                  v-model="getComponentInfo.stylesObj.typeConfig"
                  :label="1"
                  @change="(value) => changeStyles(value, 'typeConfig')"
              >默认
              </apiot-radio>
              <br/>
              <apiot-radio
                  v-model="getComponentInfo.stylesObj.typeConfig"
                  :label="2"
                  @change="(value) => changeStyles(value, 'typeConfig')"
              >使用地图风格
              </apiot-radio>
              <br/>
              <apiot-radio
                  v-model="getComponentInfo.stylesObj.typeConfig"
                  :label="3"
                  @change="(value) => changeStyles(value, 'typeConfig')"
              >自定义
              </apiot-radio>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.typeConfig===2">
            <p class="setTitle">地图风格选择</p>
            <div>
              <c-select
                  :options="mapStyleList"
                  :value="getComponentInfo.stylesObj.mapStyleType"
                  @change="(value) => changeStyles(value, 'mapStyleType')"
              ></c-select>
            </div>
          </div>
          <div class="numberWrap" v-if="getComponentInfo.stylesObj.typeConfig===3">
            <div class="propsSetting flexItem">
              <p class="setTitle">陆地颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.landColor"
                  @change="(value) => changeStyles(value, 'landColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">水系颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.waterColor"
                  @change="(value) => changeStyles(value, 'waterColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="numberWrap" v-if="getComponentInfo.stylesObj.typeConfig===3">
            <div class="propsSetting flexItem">
              <p class="setTitle">植被颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.vegetationColor"
                  @change="(value) => changeStyles(value, 'vegetationColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">建筑物颜色</p>
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  show-alpha
                  :value="getComponentInfo.stylesObj.buildingColor"
                  @change="(value) => changeStyles(value, 'buildingColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>

          <MapStylesConfig
              v-if="getComponentInfo.stylesObj.typeConfig===3"
              style="margin-bottom: 10px;"
              title="显示水系名称"
              subtitle="名称颜色&字体大小"
              :enableValue="getComponentInfo.stylesObj.enableWaterName"
              :fontSize="getComponentInfo.stylesObj.waterNameFontSize"
              :nameColor="getComponentInfo.stylesObj.waterNameColor"
              @changeEnable="(value) => changeStyles(value, 'enableWaterName')"
              @changeStyles="({value, key}) => changeStyles(value, `water${key}`)"
          ></MapStylesConfig>
          <MapStylesConfig
              v-if="getComponentInfo.stylesObj.typeConfig===3"
              style="margin-bottom: 10px;"
              title="显示道路名称"
              subtitle="名称颜色&字体大小"
              :isNeedRoadColor="true"
              :enableValue="getComponentInfo.stylesObj.enableRoadName"
              :fontSize="getComponentInfo.stylesObj.roadNameFontSize"
              :roadColor="getComponentInfo.stylesObj.roadColor"
              :nameColor="getComponentInfo.stylesObj.roadNameColor"
              @changeEnable="(value) => changeStyles(value, 'enableRoadName')"
              @changeStyles="({value, key}) => changeStyles(value, `road${key}`)"
          ></MapStylesConfig>
          <MapStylesConfig
              v-if="getComponentInfo.stylesObj.typeConfig===3"
              style="margin-bottom: 10px;"
              title="显示铁路"
              subtitle="铁路颜色"
              :isNeedFontSize="false"
              :isNeedColor="false"
              :enableValue="getComponentInfo.stylesObj.enableRailwayName"
              :fontSize="getComponentInfo.stylesObj.railwayNameFontSize"
              :nameColor="getComponentInfo.stylesObj.railwayNameColor"
              @changeEnable="(value) => changeStyles(value, 'enableRailwayName')"
              @changeStyles="({value, key}) => changeStyles(value, `railway${key}`)"
          ></MapStylesConfig>
          <MapStylesConfig
              v-if="getComponentInfo.stylesObj.typeConfig===3"
              title="显示行政区域"
              subtitle="名称颜色&字体大小"
              :enableValue="getComponentInfo.stylesObj.enableAdminName"
              :fontSize="getComponentInfo.stylesObj.adminNameFontSize"
              :nameColor="getComponentInfo.stylesObj.adminNameColor"
              @changeEnable="(value) => changeStyles(value, 'enableAdminName')"
              @changeStyles="({value, key}) => changeStyles(value, `admin${key}`)"
          ></MapStylesConfig>
        </div>
      </el-collapse-item>
      <el-collapse-item title="数据风格配置" name="3">
        <div>
          <div class="propsSetting">
            <p class="setTitle">展示类型</p>
            <div>
              <apiot-radio
                  v-model="getComponentInfo.stylesObj.displayType"
                  :label="1"
                  @change="(value) => changeStyles(value, 'displayType')"
              >散点图
              </apiot-radio>
              <br/>
              <apiot-radio
                  v-model="getComponentInfo.stylesObj.displayType"
                  :label="2"
                  @change="(value) => changeStyles(value, 'displayType')"
              >热力图
              </apiot-radio>
              <br/>
              <apiot-radio
                  v-model="getComponentInfo.stylesObj.displayType"
                  :label="3"
                  @change="(value) => changeStyles(value, 'displayType')"
              >自定义
              </apiot-radio>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.displayType===1">
            <p class="setTitle">数据映射字段</p>
            <apiot-input
                :maxlength="16"
                :value="getComponentInfo.stylesObj.dataMappingField"
                @input="(value) => changeStyles(value, 'dataMappingField')"/>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.displayType===1">
            <p class="setTitle">散点边框大小</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.scatterBorder"
                @change="(value) => changeStyles(Number(value), 'scatterBorder')"/>
          </div>
          <PointStylesConfig
              v-if="getComponentInfo.stylesObj.displayType===1"
              :scatterConfig="getComponentInfo.stylesObj.scatterConfig"
              @change="changeStyles($event, 'scatterConfig')"
          />
          <div class="addWrap" v-if="getComponentInfo.stylesObj.displayType===1">
            <apiot-button
                @click="addScatterConfig"
                icon="icon-xinzeng iconfont"
            >新增颜色
            </apiot-button>
          </div>
          <div class="numberWrap" v-if="getComponentInfo.stylesObj.displayType===2">
            <div class="propsSetting flexItem">
              <p class="setTitle">权重最大值</p>
              <el-input-number
                  :min="0"
                  controls-position="right"
                  v-model="getComponentInfo.stylesObj.pointSize"
                  @change="(value) => changeStyles(Number(value), 'pointSize')"/>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">热力图半径</p>
              <el-input-number
                  :min="0"
                  controls-position="right"
                  v-model="getComponentInfo.stylesObj.dotBlurSize"
                  @change="(value) => changeStyles(Number(value), 'dotBlurSize')"/>
            </div>
          </div>
          <data-color
              v-if="getComponentInfo.stylesObj.displayType===2"
              :value="getComponentInfo.stylesObj.hotDataColor"
              :single="true"
              @change="(value) => changeStyles(value, 'hotDataColor')"
          />
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.displayType===3">
            <p class="setTitle">数据映射字段</p>
            <apiot-input
                :value="getComponentInfo.stylesObj.customDataMappingField"
                @input="(value) => changeStyles(value, 'customDataMappingField')"/>
          </div>
          <div class="numberWrap" v-if="getComponentInfo.stylesObj.displayType===3">
            <div class="propsSetting flexItem">
              <p class="setTitle">图片宽度</p>
              <el-input-number
                  :min="0"
                  controls-position="right"
                  v-model="getComponentInfo.stylesObj.imageWidth"
                  @change="(value) => changeStyles(Number(value), 'imageWidth')"/>
            </div>
            <div class="propsSetting flexItem">
              <p class="setTitle">图片高度</p>
              <el-input-number
                  :min="0"
                  controls-position="right"
                  v-model="getComponentInfo.stylesObj.imageHeight"
                  @change="(value) => changeStyles(Number(value), 'imageHeight')"/>
            </div>
          </div>

          <CustomDisplayConfig
              v-if="getComponentInfo.stylesObj.displayType===3"
              :customDisplay="getComponentInfo.stylesObj.customDisplay"
              @change="changeStyles($event, 'customDisplay')"
              style="padding-bottom: 10px;"
          />
          <div
              class="addWrap"
              style="margin: 0"
              v-if="getComponentInfo.stylesObj.displayType===3"
          >
            <apiot-button
                @click="addCustomConfig"
                icon="icon-xinzeng iconfont"
            >新增字段值
            </apiot-button>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">ToolTip展示</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableTooltip"
                  @change="(value) => changeTitle(value, 'enableTooltip')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">显示信息类型</p>
            <div>
              <c-select
                  :options="showInfoArr"
                  v-model="getComponentInfo.stylesObj.showInfoType"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.showInfoType===1">
            <p class="setTitle">自定义悬浮信息</p>
            <div>
              <apiot-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入悬浮信息"
                  v-model="getComponentInfo.stylesObj.customTipInfo"
              />
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.showInfoType===2">
            <p class="setTitle">配置悬浮信息</p>
          </div>
          <InfoConfig
              v-if="getComponentInfo.stylesObj.showInfoType===2"
              :value="getComponentInfo.stylesObj.infoConfig"
              @change="changeStyles($event, 'infoConfig')"/>
        </div>
      </el-collapse-item>
      <el-collapse-item title="交互设置" name="6">
        <div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">鼠标点击覆盖物</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableMouseClick"
                @change="changeStyles($event, 'enableMouseClick')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.enableMouseClick">
            <span class="setTitle">交互方式</span>
            <div>
              <el-radio-group
                  class="radioGroup"
                  size="mini"
                  v-model="getComponentInfo.stylesObj.interactionMode"
                  @change="(value) => changeStyles(value, 'interactionMode')"
              >
                <el-radio-button :label="1">无</el-radio-button>
                <el-radio-button :label="2">弹框</el-radio-button>
                <el-radio-button :label="3">菜单</el-radio-button>
                <el-radio-button :label="4">联动</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div
              class="propsSetting"
              v-if="getComponentInfo.stylesObj.interactionMode===2&&
              getComponentInfo.stylesObj.enableMouseClick"
          >
            <apiot-button
                class="panelBtn"
                @click="visible = true"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
            </apiot-button>
          </div>
          <div
              class="propsSetting"
              v-if="getComponentInfo.stylesObj.interactionMode===3&&
               getComponentInfo.stylesObj.enableMouseClick"
          >
            <apiot-button
                class="panelBtn"
                @click="showMenuConfig = true"
            >
              <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
            </apiot-button>
          </div>
          <div
              v-if="getComponentInfo.stylesObj.interactionMode===4 &&
               getComponentInfo.stylesObj.enableMouseClick"
              class="propsSetting"
          >
            <p class="setTitle">关联更新图表</p>
            <div>
              <c-select
                  multiple
                  collapse-tags
                  filterable
                  :options="allComponentOptions"
                  :value="getComponentInfo.stylesObj.updateChart"
                  @change="(value) => changeStyles(value, 'updateChart')"
              ></c-select>
            </div>
          </div>
          <div
              v-if="getComponentInfo.stylesObj.interactionMode===4 &&
               getComponentInfo.stylesObj.enableMouseClick"
              class="propsSetting">
            <p class="setTitle">传参字段设置</p>
            <div>
              <paramsFieldsConfig
                  :value="getComponentInfo.stylesObj.paramsFieldsConfig"
                  @change="(value) => changeStyles(value, 'paramsFieldsConfig')"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>
    <PanelConfig
        :key="`${updateKey}Panel`"
        :visible.sync="visible"
        :tabPaneConfig="tabPaneConfig"
        :activeObj="activeObj"
        :isSelPanel="false"
        :showType="showType"
        :otherParams="{
        panelType: 5,
        unDesign: 1,
        panelClassify: 1,
        clientType: getClientType,
      }"
        @cancle-click="handleCancel"
        :isCustomPage="true"
        :treeType="5"
        ref="panelConfig"
    ></PanelConfig>
    <ToMenuConfig
        :key="`${updateKey}ToMenu`"
        ref="ToMenuConfig"
        @cancle-click="handleMenuCancel"
        class="ToMenuConfig"
        :visible.sync="showMenuConfig"
        :activeObj="skipMenuConfig"
        :sourceType="1"
        :treeType="5"
        :showType="showType"
        :showContent="true"
        :clientType="getClientType"
    ></ToMenuConfig>
  </div>
</template>

<script>
import PanelConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/PanelConfig';
import ToMenuConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig';
import { predefineColors } from '../../constants/global';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import DataColor from '../../basicWidgets/DataColor/index';

const MapStylesConfig = () => import('./Components/mapStylesConfig');
const PointStylesConfig = () => import('./Components/pointStylesConfig');
const CustomDisplayConfig = () => import('./Components/customDisplay');
const InfoConfig = () => import('./Components/infoConfig');
const paramsFieldsConfig = () => import('./Components/paramsFieldsConfig');

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
      updateKey: 0,
      showType: [1, 5],
      activeObj: { dialogTitle: '', dialogName: 'PanelDialog' },
      skipMenuConfig: [], // 跳菜单
      showMenuConfig: false,
      visible: false,
      predefineColors,
      showInfoArr: [
        {
          label: '自定义悬浮信息',
          value: 1
        }, {
          label: '配置悬浮信息',
          value: 2
        },
        // {
        //   label: '配置悬浮弹框信息',
        //   value: 3
        // }
      ],
      mapStyleList: [
        {
          label: '绿野仙踪',
          value: 1
        },
        {
          label: '眼眸',
          value: 2
        },
        {
          label: '物流',
          value: 3
        },
        {
          label: '出行',
          value: 4
        }
      ],
      enable: true,
      activeName: ''
    };
  },

  components: {
    PanelConfig,
    ToMenuConfig,
    MapStylesConfig,
    PointStylesConfig,
    CustomDisplayConfig,
    InfoConfig,
    paramsFieldsConfig,
    LocationProperties,
    DataColor
  },

  computed: {
    getClientType() {
      const { clientType } = sessionStorage;
      return +clientType;
    },
    tabPaneConfig() {
      const { panelConfig } = this.getComponentInfo;
      const { curPaneObj } = panelConfig || {};
      return curPaneObj || {};
    },
    allComponentOptions() {
      // eslint-disable-next-line max-len
      const list = this.getList.filter((item) => item.componentId !== this.activeComponent.componentId);
      return list.map((item) => ({
          label: item.name,
          value: item.componentId
        }));
    },
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
  created() {
    this.init();
  },
  watch: {
    activeComponent: {
      deep: true,
      immediate: true,
      handler(v, o) {
        if (v && o && v.componentId !== o.componentId) {
          this.init();
          this.updateKey += 1;
        }
      }
    }
  },
  methods: {
    init() {
      const { panelConfig, skipMenuConfig } = this.getComponentInfo;
      const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
      this.activeObj = panelConfig ? panelConfig.activeObj || initObj : initObj;
      this.skipMenuConfig = skipMenuConfig || [];
    },
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
    changeScatterConfig(v, i) {
      const { stylesObj: { scatterConfig = [] } } = this.getComponentInfo;
      const list = [...scatterConfig];
      const newList = list.splice(i, 1, v);
      this.changeStyles(newList, 'scatterConfig');
    },
    addCustomConfig() { // 新增自定义
      const { stylesObj: { customDisplay = [] } } = this.getComponentInfo;
      customDisplay.push({
        fieldValue: '',
        customUrl: ''
      });
      this.changeStyles(customDisplay, 'customDisplay');
    },
    addScatterConfig() { // 新增颜色
      const { stylesObj: { scatterConfig = [] } } = this.getComponentInfo;
      scatterConfig.push({
        fieldValue: null,
        scatterSize: 15,
        scatterHighlightSize: 15,
        scatterColor: '',
        scatterHighlightColor: '',
        scatterBorderColor: '',
        scatterBorderHighlight: ''
      });
      this.changeStyles(scatterConfig, 'scatterConfig');
    },
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
  height: calc(100%);
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

  //::v-deep {
  //  .el-collapse {
  //    border: none;
  //  }
  //
  //  .el-collapse-item__arrow {
  //    margin: 0 0px 0 auto;
  //  }
  //
  //  .el-collapse-item__header {
  //    height: 30px;
  //    line-height: 30px;
  //    background-color: #131E45;
  //    color: #ffffff;
  //    font-weight: bold;
  //    border-bottom: none;
  //
  //    &:hover {
  //      color: $component-borderFocus-color;
  //    }
  //  }
  //
  //  .el-collapse-item__content {
  //    padding: 10px 0;
  //    background-color: #131E45;
  //
  //    & .propsSetting:last-child {
  //      margin-bottom: 10px;
  //    }
  //  }
  //
  //  .el-collapse-item__wrap {
  //    background-color: #131E45;
  //    border: none;
  //  }
  //}

  .propsSetting {
    margin-bottom: 10px;

    .radioGroup {
      width: 100%;
      display: flex;

      ::v-deep {
        .el-radio-button {
          flex: 1;
        }
      }
    }

    .panelBtn {
      width: 100%;
    }
    .icon-shezhi {
      color: #4689f5;
    }

    .InputWrap {
      display: flex;
      width: 100%;
      //margin-top: 5px;
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

    ::v-deep {
      .el-icon-question {
        cursor: pointer;
      }

      .el-radio .el-radio__label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        opacity: 0.69;
      }

      .el-radio.is-checked .el-radio__label {
        opacity: 1;
      }

      .el-radio-button {
        width: 60px;

        &.is-active {
          .el-radio-button__inner {
            background: $component-borderFocus-color !important;
            border-color: $component-borderFocus-color !important;
          }
        }

        .el-radio-button__inner {
          width: 100%;
          padding: 8px 15px;
          font-size: 14px;
          color: #606266;
          opacity: .7;
          background: $component-background-color;
        }
        .el-radio-button__inner:hover{
          color: $component-border-color;
        }
        .el-radio-button:first-child .el-radio-button__inner {
          border-left: 1px solid #DCDFE6;
          border-radius: 4px 0 0 4px;
          box-shadow: none !important;
        }
        .el-radio-button:last-child .el-radio-button__inner {
          border-radius: 0 4px 4px 0;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          background: $component-background-color;
          font-size: 14px;
          color: #FFFFFF;
          opacity: 1;
        }
      }

    }
  }

  .numberWrap {
    display: flex;
    justify-content: space-between;

    .flexItem {
      width: 123px;
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

  .addWrap {
    margin-top: 10px;
    margin-bottom: 10px;
    width: 100%;

    ::v-deep {
      .el-button {
        width: 100%;
      }

      .icon-xinzeng {
        margin-right: 5px;
        color: #4689F5;
        vertical-align: bottom;
      }
    }
  }

}
</style>
