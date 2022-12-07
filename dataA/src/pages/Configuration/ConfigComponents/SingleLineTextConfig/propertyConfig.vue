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
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <c-input
          type="number"
          :numberValue="getComponentInfo.stylesObj.zIndex"
          @Input-Change="(value) => changeStyles(Number(value), 'zIndex')"/>
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
              <c-input
                  type="number"
                  :numberValue="getComponentInfo.stylesObj.fontSize"
                  @Input-Change="(value) => changeStyles(value, 'fontSize')"/>
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
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.letterSpacing"
                @Input-Change="(value) => changeStyles(Number(value), 'letterSpacing')"/>
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
                  inactive-color="#183472">
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
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.borderRadius"
                :min="0"
                @Input-Change="(value) => changeStyles(value, 'borderRadius')"/>
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
            <div class="borderWrap">
              <c-input
                  type="number"
                  :numberValue="Number(getComponentInfo.stylesObj.borderWidth)"
                  @Input-Change="(value) => changeStyles(value, 'borderWidth')"/>
              <c-select
                  :options="borderOptions"
                  :value="getComponentInfo.stylesObj.borderStyle"
                  @change="(value) => changeStyles(value, 'borderStyle')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">水平阴影</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.hShadow"
                @Input-Change="(value) => changeStyles(value, 'hShadow')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">垂直阴影</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.vShadow"
                @Input-Change="(value) => changeStyles(value, 'vShadow')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">阴影距离</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.blur"
                @Input-Change="(value) => changeStyles(value, 'blur')"/>
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
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting">
            <span class="setTitle">交互方式</span>
            <div>
              <el-radio-group
                  class="radioGroup"
                  size="mini"
                  v-model="getComponentInfo.interactionMode"
                  @change="(value) => changeTitle(value, 'interactionMode')"
              >
                <el-radio-button :label="1">无</el-radio-button>
                <el-radio-button :label="2">弹框</el-radio-button>
                <el-radio-button :label="3">链接</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting" v-if="getComponentInfo.interactionMode===2">
            <div class="InputWrap">
              <c-input
                  lable="宽:"
                  type="number"
                  :numberValue="getComponentInfo.bulletWidth"
                  @Input-Change="(value) => changeTitle(Number(value), 'bulletWidth')"/>
              <c-input
                  lable="高:"
                  type="number"
                  :numberValue="getComponentInfo.bulletHeight"
                  @Input-Change="(value) => changeTitle(Number(value), 'bulletHeight')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionMode===2">
            <p class="setTitle">弹框地址</p>
            <c-input
                type="text"
                :value="getComponentInfo.bulletUrl"
                @Input-Change="(value) => changeTitle(value, 'bulletUrl')"
                @blur="(e) => checkIsRight(e.target.value, 'bulletUrl')"
            />
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionMode===3">
            <p class="setTitle">超链接</p>
            <c-input
                type="text"
                :value="getComponentInfo.url"
                @Input-Change="(value) => changeTitle(value, 'url')"
                @blur="(e) => checkIsRight(e.target.value, 'url')"
            />
          </div>
          <div class="ellipsisWrap flex propsSetting" v-if="getComponentInfo.interactionMode===3">
            <span class="setTitle">是否打开新窗口</span>
            <el-switch
                :value="getComponentInfo.enableOpenNewWindow"
                @change="(value) => changeTitle(value, 'enableOpenNewWindow')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import {IsURL} from '@/utils/utils';
import {predefineColors} from '@/constants/global'


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
      enable: true,
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

  components: {},

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
    // getComponentInfo(val, oldVal) { // 普通的watch监听
    //   console.log("a: " + val, oldVal);
    // },
  },
  methods: {
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
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
    checkIsRight(value, key) {
      if (key === 'url' && value) {
        if (!IsURL(value)) {
          this.$message.error('请输入正确的url地址!');
          return;
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
        border-radius: 0;
        color: #FFFFFF;
        opacity: .7;
        border-color: $component-border-color;
        background: $component-background-color;
      }

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: $component-background-color;
        font-size: 14px;
        color: #FFFFFF;
        opacity: 1;
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

    .setTitle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 30px;
      text-align: left;
      opacity: .7;
    }
    .radioGroup{
      width: 100%;
      display: flex;
      ::v-deep{
        .el-radio-button{
          flex: 1;
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

  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
