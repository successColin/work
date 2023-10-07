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
      <c-input
          type="text"
          :maxlength="16"
          :value="getComponentInfo.name" @Input-Change="(value) => changeTitle(value, 'name')"/>
    </div>
    <location-properties
        :widthValue="getComponentInfo.width"
        :heightValue="getComponentInfo.height"
        :leftValue="getComponentInfo.left"
        :topValue="getComponentInfo.top"
        @changeTitle="({value, key}) => changeTitle(value, key)"
    ></location-properties>
    <!--    <div class="propsSetting">-->
    <!--      <p class="setTitle">内容</p>-->
    <!--      <c-input-->
    <!--          type="text"-->
    <!--          :value="getComponentInfo.content" @Input-Change="(value) => changeTitle(value, 'content')"/>-->
    <!--    </div>-->
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <c-input
          type="number"
          :numberValue="getComponentInfo.stylesObj.zIndex"
          @Input-Change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1" title="图形属性">
        <div>
          <div class="ellipsisWrap flex propsSetting" style="margin-top: 10px;">
            <span class="setTitle">启用鼠标缩放</span>
            <el-switch
                :value="getComponentInfo.roam"
                @change="(value) => changeTitle(value, 'roam')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">启用动画</span>
            <el-switch
                :value="getComponentInfo.animation"
                @change="(value) => changeTitle(value, 'animation')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">启用节点拖动</span>
            <el-switch
                :value="getComponentInfo.draggable"
                @change="(value) => changeTitle(value, 'draggable')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>

          <div class="propsSetting">
            <p class="setTitle">缩放比例</p>
            <div>
              <c-input
                  type="number"
                  :min="1"
                  :numberValue="getComponentInfo.stylesObj.zoomLevel"
                  @Input-Change="(value) => changeStyles(value, 'zoomLevel')"/>
            </div>
          </div>

          <div class="propsSetting">
            <p class="setTitle">连接线类型</p>
            <div>
              <c-select
                  :options="solidOptions"
                  :value="getComponentInfo.stylesObj.lineType"
                  @change="(value) => changeStyles(value, 'lineType')"
              ></c-select>
            </div>
          </div>

          <div class="propsSetting">
            <p class="setTitle">连接线粗细</p>
            <div>
              <c-input
                  type="number"
                  :min="1"
                  :numberValue="getComponentInfo.stylesObj.lineWidth"
                  @Input-Change="(value) => changeStyles(value, 'lineWidth')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">连接线颜色</p>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                v-model="getComponentInfo.stylesObj.lineColor"
                show-alpha
                @change="(value) => changeStyles(value, 'lineColor')"
                :predefine="predefineColors">
            </c-color-picker>
            <!--      <c-color-picker-->
            <!--          style="margin-right: 10px;"-->
            <!--          size="small"-->
            <!--          v-model="getComponentInfo.stylesObj.color1"-->
            <!--          show-alpha-->
            <!--          @change="(value) => changeStyles(value, 'color1')"-->
            <!--          :predefine="predefineColors">-->
            <!--      </c-color-picker>-->
          </div>


        </div>
      </el-collapse-item>
      <el-collapse-item title="节点标注" name="3">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">节点标注</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableLabel"
                  @change="(value) => changeTitle(value, 'enableLabel')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div>

          <div class="propsSetting">
            <p class="setTitle">标注位置</p>
            <div>
              <c-select
                  :options="labelPosition"
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
      <el-collapse-item title="节点标注" name="4">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">连接线标注</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableEdgeLabel"
                  @change="(value) => changeTitle(value, 'enableEdgeLabel')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div>

          <div class="propsSetting">
            <p class="setTitle">标注位置</p>
            <div>
              <c-select
                  :options="positionOptions"
                  :value="getComponentInfo.stylesObj.labelEdgePosition"
                  @change="(value) => changeStyles(value, 'labelEdgePosition')"
              ></c-select>
            </div>
          </div>
          <TextStylesConfig
              title="标注样式"
              title1="标注颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.labelEdgeFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.labelEdgeFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.labelEdgeFontSize"
              :colorValue="getComponentInfo.stylesObj.labelEdgeColor"
              @change="({value,key}) => changeStyles(value, `labelEdge${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item title="节点样式" name="5">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">节点样式</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableNodeConfig"
                  @change="(value) => changeTitle(value, 'enableNodeConfig')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">数据映射字段</p>
            <c-input
                type="text"
                :maxlength="16"
                :value="getComponentInfo.stylesObj.dataMappingField"
                @Input-Change="(value) => changeStyles(value, 'dataMappingField')"/>
          </div>
          <CustomDisplay
              :customDisplay="getComponentInfo.nodeConfig"
              @change="changeTitle($event, 'nodeConfig')"
          />
          <div class="addWrap">
            <c-button
                @click="addScatterConfig"
                icon="icon-xinzeng iconfont"
            >新增配置</c-button>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import TextStylesConfig from '../TextStylesConfig/index';
import CustomDisplay from './Components/customDisplay';
import {predefineColors, symbolOptions, labelPosition} from '@/constants/global'


export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      labelPosition,
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

      positionOptions: [
        {
          label: '起始点',
          value: 'start'
        }, {
          label: '中间',
          value: 'middle'
        }, {
          label: '结束点',
          value: 'end'
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
      activeName: '',
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
    TextStylesConfig,
    CustomDisplay
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      return Obj;
    },
    getList() {
      return this.$store.getters.list;
    }
  },

  mounted() {
  },
  watch: {
    // getComponentInfo: {
    //   deep: true,
    //   handler(val, oldVal) { // 普通的watch监听
    //     console.log("a: " + val, oldVal);
    //   },
    // }
  },
  methods: {
    addScatterConfig() {
      this.getComponentInfo.nodeConfig.push({
        fieldValue: '',
        nodeColor: '',
        symbolSize: 10
      })
    },
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
      if (key === 'shadowColor' && !value) {
        value = '';
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...styleObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    reduceIndex() {
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return -1;
      }
      const index = this.getList.findIndex((item) => {
        return item.componentId === componentId
      });
      return index;
    },
    changeScreenBgUrl(url) { // 修改背景图片
      const getBgConfig = this.getBgConfig;
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
      if (key === 'dimension') {
        newInfo.markLineConfig = [];
      }
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    }
  },
  name: 'SingleLineTextConfig'
};
</script>

<style lang='scss' scoped>
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
    .el-collapse {
      border: none;
    }

    .el-collapse-item__arrow {
      margin: 0 0px 0 auto;
    }

    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      background-color: #131E45;
      color: #ffffff;
      font-weight: bold;
      border-bottom: none;

      &:hover {
        color: $component-borderFocus-color;
      }
    }

    .el-collapse-item__content {
      padding: 10px 0;
      background-color: #131E45;

      & .propsSetting:last-child {
        margin-bottom: 10px;
      }
    }

    .el-collapse-item__wrap {
      background-color: #131E45;
      border: none;
    }
  }

  .propsSetting {
    margin-bottom: 10px;
    .setTitle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
      text-align: left;
      opacity: .7;
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
        vertical-align: bottom;
      }
    }
  }

}
</style>
