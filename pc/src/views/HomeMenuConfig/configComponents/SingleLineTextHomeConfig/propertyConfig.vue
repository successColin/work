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
      <el-collapse-item title="文本样式" name="1">
        <div>
          <div class="propsSetting">
            <p class="setTitle">字体</p>
            <c-select
                :options="fontFamilyOptions"
                :value="getComponentInfo.stylesObj.fontFamily"
                @change="(value) => changeStyles(value, 'fontFamily')">
            </c-select>
            <div class="fontSizeWrap">
              <c-select
                  :options="boldTypeOptions"
                  :value="getComponentInfo.stylesObj.fontWeight"
                  @change="(value) => changeStyles(value, 'fontWeight')"
              ></c-select>
              <el-input-number
                  :min="10"
                  controls-position="right"
                  v-model="getComponentInfo.stylesObj.fontSize"
                  @change="(value) => changeStyles(value, 'fontSize')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">渐变类型</p>
            <c-select
                :options="colorTypeOptions"
                :value="getComponentInfo.gradientType"
                @change="(value) => changeTitle(value, 'gradientType')"
            ></c-select>
            <div style="display:flex;text-align: left;margin-top: 6px;">
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.color1"
                  show-alpha
                  @change="(value) => changeStyles(value, 'color1')"
                  :predefine="predefineColors"
              >
              </c-color-picker>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.color2"
                  show-alpha
                  @change="(value) => changeStyles(value, 'color2')"
                  :predefine="predefineColors"
              >
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">对齐方式</p>
            <el-radio-group
                class="alignWrap"
                @change="(value) => changeStyles(value, 'textAlign')"
                v-model="getComponentInfo.stylesObj.textAlign"
                size="mini"
            >
              <el-radio-button
                  :label="item.value"
                  v-for="item in options"
                  :key="item.value"
              >
                <span class="iconfont" :class="{[item.icon]:true}"></span>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="propsSetting">
            <p class="setTitle">文字间距</p>
            <el-input-number
                :min="0"
                controls-position="right"
                v-model="getComponentInfo.stylesObj.letterSpacing"
                @change="(value) => changeStyles(value, 'letterSpacing')"/>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">背景样式</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableBackground"
                  @change="(value) => changeTitle(value, 'enableBackground')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting" style="margin-bottom: 10px;">
            <p class="setTitle">背景色</p>
            <div style="text-align: left">
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.backgroundColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'backgroundColor')"
                  :predefine="predefineColors"
                  :colorValue="getComponentInfo.stylesObj.backgroundColor"
              >
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">圆角</p>
            <el-input-number
                :min="0"
                controls-position="right"
                v-model="getComponentInfo.stylesObj.borderRadius"
                @change="(value) => changeStyles(value, 'borderRadius')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">背景边框</p>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                v-model="getComponentInfo.stylesObj.borderColor"
                show-alpha
                @change="(value) => changeStyles(value, 'borderColor')"
                :predefine="predefineColors"
                :colorValue="getComponentInfo.stylesObj.borderColor"
            >
            </c-color-picker>
            <div class="borderWrap1">
              <el-input-number
                  :min="0"
                  controls-position="right"
                  v-model="getComponentInfo.stylesObj.borderWidth"
                  @change="(value) => changeStyles(value, 'borderWidth')"/>
              <c-select
                  :options="borderOptions"
                  :value="getComponentInfo.stylesObj.borderStyle"
                  @change="(value) => changeStyles(value, 'borderStyle')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">水平阴影</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.hShadow"
                @change="(value) => changeStyles(value, 'hShadow')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">垂直阴影</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.vShadow"
                @change="(value) => changeStyles(value, 'vShadow')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">阴影距离</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.blur"
                @change="(value) => changeStyles(value, 'blur')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">阴影颜色</p>
            <div style="text-align: left;">
              <c-color-picker
                  style="margin-right: 10px;"
                  size="small"
                  v-model="getComponentInfo.stylesObj.shadowColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'shadowColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="其他配置" name="3">
        <div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">省略号</span>
            <el-switch
                :value="getComponentInfo.enableEllipsis"
                @change="(value) => changeTitle(value, 'enableEllipsis')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="交互配置" name="4">
        <div>
          <el-radio-group
              class="radioGroup"
              size="mini"
              v-model="getComponentInfo.interactionType"
              @change="(value) => changeTitle(value, 'interactionType')"
          >
            <el-radio-button :label="1">无</el-radio-button>
            <el-radio-button :label="2">弹出面板</el-radio-button>
            <el-radio-button :label="3">跳转菜单</el-radio-button>
          </el-radio-group>
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
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import { predefineColors } from '../../constants/global';
import { IsURL } from '../../constants/common';

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
      borderOptions: [
        {
          label: '实线',
          value: 'solid'
        }, {
          label: '虚线',
          value: 'dashed'
        }
      ],
      colorTypeOptions: [
        {
          label: '左右渐变',
          value: 1
        }, {
          label: '上下渐变',
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
        icon: 'icon-juzuoduiqi'
      }, {
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'right',
        icon: 'icon-juyouduiqi'
      }]
    };
  },

  components: {
    LocationProperties,
    PanelConfig,
    ToMenuConfig
  },

  computed: {
    tabPaneConfig() {
      const { panelConfig } = this.getComponentInfo;
      const { curPaneObj } = panelConfig || {};
      return curPaneObj || {};
    },
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

  created() {
    const { panelConfig, skipMenuConfig } = this.getComponentInfo;
    const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
    this.activeObj = panelConfig ? panelConfig.activeObj || initObj : initObj;
    console.log(skipMenuConfig, ',,,,');
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
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj || {};
      if (key === 'shadowColor' && !value) {
        value = '';
      }
      if (['color1', 'color2'].includes(key) && !value) {
        value = null;
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
    checkIsRight(value, key) {
      if (key === 'url' && value) {
        if (!IsURL(value)) {
          this.$message.error('请输入正确的url地址!');
        }
      }
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
          flex: 0 0 155px;
          margin-right: 10px;

          .el-input__inner {
            height: 32px;
            line-height: 32px;
          }
        }

        .el-input-number.is-controls-right .el-input__inner {
          padding-right: 0;
          padding-left: 10px;
        }

        .CInputWrap {
          .el-input-number.is-controls-right .el-input__inner {
            padding-right: 23px;
          }
        }
      }
    }

    .borderWrap1 {
      display: flex;
      align-items: center;
      margin-top: 6px;

      ::v-deep {
        .selectWrap {
          flex: 0 0 calc(50% - 5px);
          margin-left: 10px;

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
              background: #E5F0FF !important;
              border-color: $component-borderFocus-color !important;
            }

            .iconfont {
              color: #4689f5 !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
            padding: 5px 15px;
            border-radius: 0 !important;
            border-color: $component-border-color;
            background: $component-background-color;

            .iconfont {
              color: #BBC3CD;
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
      width: 100%;
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

  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
  }
  ::v-deep {
    .action__term--liChild {
      width: 100px;
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
}
</style>
