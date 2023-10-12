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
          <TextStylesConfig
              title="内容字体样式"
              title1="内容颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.CFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.CFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.CFontSize"
              :colorValue="getComponentInfo.stylesObj.CColor"
              @change="({value,key}) => changeStyles(value, `C${key}`)"
          />
          <div class="propsSetting">
            <p class="setTitle">前缀文字</p>
            <apiot-input
                :value="getComponentInfo.stylesObj.prefixText"
                :isForbid="false"
                @input="(value) => changeStyles(value, 'prefixText')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">前缀文字右边距</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.prefixTextMarginRight"
                  @change="(value) => changeStyles(value, 'prefixTextMarginRight')"/>
            </div>
          </div>

          <TextStylesConfig
              title="前缀字体样式"
              title1="前缀字体颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.prefixTextFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.prefixTextFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.prefixTextFontSize"
              :colorValue="getComponentInfo.stylesObj.prefixTextColor"
              @change="({value,key}) => changeStyles(value, `prefixText${key}`)"
          />
          <div class="propsSetting">
            <p class="setTitle">后缀文字</p>
            <apiot-input
                :isForbid="false"
                :value="getComponentInfo.stylesObj.suffixText"
                @input="(value) => changeStyles(value, 'suffixText')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">后缀文字左边距</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.suffixTextMarginLeft"
                  @change="(value) => changeStyles(value, 'suffixTextMarginLeft')"/>
            </div>
          </div>

          <TextStylesConfig
              title="后缀字体样式"
              title1="后缀字体颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.suffixTextFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.suffixTextFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.suffixTextFontSize"
              :colorValue="getComponentInfo.stylesObj.suffixTextColor"
              @change="({value,key}) => changeStyles(value, `suffixText${key}`)"
          />
          <div class="propsSetting">
            <p class="setTitle">图片前缀</p>
            <div style="height: 110px;">
              <c-upload
                  ref="cUpload"
                  :before-upload="beforeAvatarUpload"
                  @changeScreenBg="(value) => changeStyles(value, 'prefixImg')"
                  accept=".png,.jpg,.jpeg,.svg"
                  :url="getComponentInfo.stylesObj.prefixImg"
              >
                <template v-slot:tip>
                  <div class="el-upload__tip">图片大小不超过50kb</div>
                </template>
              </c-upload>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.prefixImg">
            <p class="setTitle">前缀图片右边距</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.prefixImgMarginRight"
                  @change="(value) => changeStyles(value, 'prefixImgMarginRight')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.prefixImg">
            <p class="setTitle">图片前缀宽度</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.prefixImgWidth"
                  @change="(value) => changeStyles(value, 'prefixImgWidth')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.prefixImg">
            <p class="setTitle">图片前缀高度</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.prefixImgHeight"
                  @change="(value) => changeStyles(value, 'prefixImgHeight')"/>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">图片后缀</p>
            <div style="height: 110px;">
              <c-upload
                  ref="cUpload"
                  :before-upload="beforeAvatarUpload"
                  @changeScreenBg="(value) => changeStyles(value, 'suffixImg')"
                  accept=".png,.jpg,.jpeg,.svg"
                  :url="getComponentInfo.stylesObj.suffixImg"
              >
                <template v-slot:tip>
                  <div class="el-upload__tip">图片大小不超过50kb</div>
                </template>
              </c-upload>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.suffixImg">
            <p class="setTitle">后缀图片左边距</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.suffixImgMarginLeft"
                  @change="(value) => changeStyles(value, 'suffixImgMarginLeft')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.suffixImg">
            <p class="setTitle">图片后缀宽度</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.suffixImgWidth"
                  @change="(value) => changeStyles(value, 'suffixImgWidth')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.suffixImg">
            <p class="setTitle">图片后缀高度</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :min="0"
                  v-model="getComponentInfo.stylesObj.suffixImgHeight"
                  @change="(value) => changeStyles(value, 'suffixImgHeight')"/>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="条件配置" name="2">
        <ConditionConfig
            :value="getComponentInfo.conditionsArr"
            @change="(value) => changeTitle(value, 'conditionsArr')"/>
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
            <el-radio-button :label="4">外部地址</el-radio-button>
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
          <apiot-input
              v-if="getComponentInfo.interactionType === 4"
              v-model="getComponentInfo.stylesObj.externalUrl"
              @change="(value) => changeStyles(value, 'externalUrl')"
          ></apiot-input>
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
        :otherParams="{ panelType: 5,
                 unDesign: 1,
                 panelClassify: 1,
                 clientType: getClientType
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
import CUpload from '@/views/HomeMenuConfig/basicWidgets/CUpload/index';
import PanelConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/PanelConfig';
import ToMenuConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
import ConditionConfig from './ConditionConfig';
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
      updateKey: 0,
      showType: [1, 5],
      showMenuConfig: false,
      visible: false,
      enable: true,
      activeObj: { dialogTitle: '', dialogName: 'PanelDialog' },
      skipMenuConfig: [], // 跳菜单
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors,
      options: [{
        label: '左对齐',
        value: 'start',
        icon: 'icon-juzuoduiqi'
      }, {
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'end',
        icon: 'icon-juyouduiqi'
      }]
    };
  },

  components: {
    TextStylesConfig,
    LocationProperties,
    PanelConfig,
    ToMenuConfig,
    CUpload,
    ConditionConfig
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
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 jpg,png,jpeg,svg 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 50kb!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
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
            //border-color: $component-border-color;
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
          padding: 7px;
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
    .icon-shezhi {
      color: #4689f5;
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
    .dataTransfer__item--comp5 {
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
