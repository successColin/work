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
        @input="(value) => changeTitle(value, 'name')"
      />
    </div>
    <location-properties
      :widthValue="getComponentInfo.width"
      :heightValue="getComponentInfo.height"
      :leftValue="getComponentInfo.left"
      :topValue="getComponentInfo.top"
      @changeTitle="({ value, key }) => changeTitle(value, key)"
    ></location-properties>
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <el-input-number
        controls-position="right"
        :value="getComponentInfo.stylesObj.zIndex"
        @change="(value) => changeStyles(Number(value), 'zIndex')"
      />
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
                inactive-color="#DCDFE6"
              >
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting" style="margin-bottom: 5px">
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
            @change="({ value, key }) => changeStyles(value, `legend${key}`)"
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
          <TextStylesConfig
              title="标注样式"
              title1="标注颜色"
              fontFamily="微软雅黑"
              :fontFamilyValue="getComponentInfo.stylesObj.labelFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.labelFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.labelFontSize"
              :colorValue="getComponentInfo.stylesObj.labelColor"
              @change="({ value, key }) => changeStyles(value, `label${key}`)"
          />
<!--          <div class="propsSetting">-->
<!--            <p class="setTitle">字体</p>-->
<!--            <c-select-->
<!--              :options="fontFamilyOptions"-->
<!--              :value="getComponentInfo.stylesObj.labelFontFamily"-->
<!--              @change="(value) => changeStyles(value, 'labelFontFamily')"-->
<!--            >-->
<!--            </c-select>-->
<!--            <div class="fontSizeWrap">-->
<!--              <c-select-->
<!--                style="flex: 0 0 155px"-->
<!--                :options="boldTypeOptions"-->
<!--                :value="getComponentInfo.stylesObj.labelFontWeight"-->
<!--                @change="(value) => changeStyles(value, 'labelFontWeight')"-->
<!--              ></c-select>-->
<!--              <el-input-number-->
<!--                controls-position="right"-->
<!--                :value="getComponentInfo.stylesObj.labelFontSize"-->
<!--                @change="(value) => changeStyles(value, 'labelFontSize')"-->
<!--              />-->
<!--            </div>-->
<!--            -->
<!--          </div>-->
        </div>
      </el-collapse-item>
      <el-collapse-item title="扇形属性" name="4">
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
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义颜色</span>
            <data-color
              :value="getComponentInfo.stylesObj.colorArr"
              @change="(value) => changeStyles(value, 'colorArr')"
            ></data-color>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="5" title="交互设置">
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
        :clientType="getClientType"
    ></ToMenuConfig>
  </div>
</template>

<script>
import ToMenuConfig from '_v/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig';
import PanelConfig from '_v/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/PanelConfig';
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import CSelect from '../../basicWidgets/CSelect';
import DataColor from '../../basicWidgets/DataColor';

export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {}
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
      showType: [1, 5],
      showMenuConfig: false,
      visible: false,
      enable: true,
      fontFamilyOptions: [
        {
          label: '微软雅黑',
          value: '微软雅黑'
        },
        {
          label: '苹方',
          value: 'PingFangSC-Regular,PingFang SC'
        },
        {
          label: '思源黑体',
          value: 'Source Han Sans CN'
        }
      ],
      boldTypeOptions: [
        {
          label: '常规体',
          value: 'normal'
        },
        {
          label: '加粗',
          value: 'bold'
        }
      ],
      labelOptions: [
        {
          label: '外部',
          value: 'outside'
        },
        {
          label: '内部',
          value: 'inside'
        },
        {
          label: '不显示',
          value: 'none'
        }
      ],
      showOptions: [
        {
          label: '值',
          value: 'value'
        },
        {
          label: '名称(类型)',
          value: 'type'
        }
      ],
      valueTypeOptions: [
        {
          label: '默认值',
          value: 1
        },
        {
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
      options: [
        {
          label: '左对齐',
          value: 'left',
          icon: 'icon-zuoduiqi'
        },
        {
          label: '居中',
          value: 'center',
          icon: 'icon-juzhongduiqi'
        },
        {
          label: '右对齐',
          value: 'right',
          icon: 'icon-youduiqi'
        }
      ]
    };
  },

  components: {
    TextStylesConfig,
    LocationProperties,
    CSelect,
    DataColor,
    PanelConfig,
    ToMenuConfig
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
    getDrillDownConfig() {
      return function (key) {
        if (!this.getComponentInfo.drillDownConfig) {
          return '';
        }
        return this.getComponentInfo.drillDownConfig[key];
      };
    },
    getComponentInfo() {
      // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.list.find((item) => item.componentId === componentId) || {};
      return Obj;
    }
  },
  created() {
    const { panelConfig, skipMenuConfig } = this.getComponentInfo;
    const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
    this.activeObj = panelConfig ? panelConfig.activeObj || initObj : initObj;
    this.skipMenuConfig = skipMenuConfig || [];
  },
  mounted() {},
  watch: {
    // getComponentInfo(val, oldVal) { // 普通的watch监听
    //   console.log("a: " + val, oldVal);
    // },
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
    changeStyles(value, key) {
      // 样式修改
      const list = [...this.list];
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
      const index = this.list.findIndex((item) => item.componentId === componentId);
      return index;
    },
    changeTitle(value, key) {
      // 设置组件名称
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
          content: '';
          position: absolute;
          top: 2px;
          left: 4px;
          border-radius: 100%;
          transition: all 0.3s;
          width: 8px;
          height: 8px;
          background-color: #fff;
        }

        .el-switch.is-checked .el-switch__core::after {
          left: 100%;
          margin-left: -11px;
        }
      }
    }
  }

  ::v-deep {
    .el-collapse {
      border: none;
    }

    .el-collapse-item__arrow {
      margin: 0 0px 0 auto;
    }

    .el-collapse-item__header {
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #333333;
      background: #fff;
      border-bottom: none;

      &:hover {
        color: $component-borderFocus-color;
      }
    }

    .el-collapse-item__content {
      padding: 10px 0;
      background-color: #fff;

      & .propsSetting:last-child {
        margin-bottom: 10px;
      }
    }

    .el-collapse-item__wrap {
      background-color: #fff;
      border: none;
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
            border-radius: 0 !important;
            border-color: $component-border-color;
            background: $component-background-color;

            .iconfont {
              color: #ffffff;
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
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 30px;
      color: #333333;
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

              .el-input-number__decrease,
              .el-input-number__increase {
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
        font-size: 13px;
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
