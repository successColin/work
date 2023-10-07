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
    <!--    <div class="propsSetting">-->
    <!--      <p class="setTitle">组件id</p>-->
    <!--      <c-input-->
    <!--          class="businessWrap"-->
    <!--          type="text"-->
    <!--          disabled-->
    <!--          :value="getComponentInfo.componentId"/>-->
    <!--    </div>-->
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
      <el-collapse-item name="1" title="图形属性">
        <div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">启用动画</span>
            <el-switch
                :value="getComponentInfo.stylesObj.waveAnimation"
                @change="(value) => changeStyles(value, 'waveAnimation')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div class="propsSetting">
            <span class="setTitle">图形大小</span>
            <c-slider
                @change="(value) => changeStyles(value, 'radius')"
                v-model="getComponentInfo.stylesObj.radius"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <p class="setTitle">波浪个数</p>
            <c-input
                type="number"
                :min="1"
                :numberValue="getComponentInfo.stylesObj.waveNum"
                @Input-Change="(value) => changeStyles(Number(value), 'waveNum')"/>
          </div>
          <div class="propsSetting">
            <span class="setTitle">波浪振幅</span>
            <c-slider
                @change="(value) => changeStyles(value, 'amplitude')"
                v-model="getComponentInfo.stylesObj.amplitude"
                :min="0"
                :max="250"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">波浪宽度</span>
            <c-slider
                @change="(value) => changeStyles(value, 'waveLength')"
                v-model="getComponentInfo.stylesObj.waveLength"
                :min="1"
                :max="500"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <p class="setTitle">展示形式</p>
            <div>
              <c-select
                  :options="showOptions"
                  :value="getComponentInfo.stylesObj.shape"
                  @change="(value) => changeStyles(value, 'shape')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">波浪方向</p>
            <div>
              <c-select
                  :options="labelOptions"
                  :value="getComponentInfo.stylesObj.animationDuration"
                  @change="(value) => changeStyles(value, 'animationDuration')"
              ></c-select>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">颜色设置</div>
          </div>
        </template>
        <div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义波浪颜色</span>
            <data-color
                :value="getComponentInfo.stylesObj.colorArr"
                @change="(value) => changeStyles(value, 'colorArr')"
            ></data-color>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">外边框配置</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.stylesObj.outlineShow"
                  @change="(value) => changeStyles(value, 'outlineShow')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">边框离内图形距离</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.borderDistance"
                @Input-Change="(value) => changeStyles(Number(value), 'borderDistance')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">边框宽度</p>
            <c-input
                type="number"
                :min="0"
                :numberValue="getComponentInfo.stylesObj.borderWidth"
                @Input-Change="(value) => changeStyles(Number(value), 'borderWidth')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">边框颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.borderColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'borderColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">边框阴影颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.shadowColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'shadowColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">边框阴影大小</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.shadowBlur"
                @Input-Change="(value) => changeStyles(Number(value), 'shadowBlur')"/>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">内部样式配置</div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">背景颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.bgColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'bgColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>

          <div class="propsSetting">
            <p class="setTitle">边框宽度</p>
            <c-input
                type="number"
                :min="0"
                :numberValue="getComponentInfo.stylesObj.bgBorderWidth"
                @Input-Change="(value) => changeStyles(Number(value), 'bgBorderWidth')"/>
          </div>

          <div class="propsSetting">
            <p class="setTitle">边框颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.bgBorderColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'bgBorderColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">边框阴影颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.bgShadowColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'bgShadowColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">边框阴影大小</p>
            <c-input
                type="number"
                :numberValue="getComponentInfo.stylesObj.bgShadowBlur"
                @Input-Change="(value) => changeStyles(Number(value), 'bgShadowBlur')"/>
          </div>
        </div>
      </el-collapse-item>

      <el-collapse-item name="5">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">标签</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.stylesObj.labelShow"
                  @change="(value) => changeStyles(value, 'labelShow')"
                  active-color="#4689F5"
                  inactive-color="#183472">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">标签位置</p>
            <div>
              <c-select
                  :options="positionOptions"
                  :value="getComponentInfo.stylesObj.labelPosition"
                  @change="(value) => changeStyles(value, 'labelPosition')"
              ></c-select>
            </div>
          </div>
          <TextStylesConfig
              title="标签样式"
              title1="字体颜色"
              :isNeedFamily="false"
              :fontWeightValue="getComponentInfo.stylesObj.labelFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.labelFontSize"
              :colorValue="getComponentInfo.stylesObj.labelColor"
              @change="({value,key}) => changeStyles(value, `label${key}`)"
          />
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import TextStylesConfig from '../TextStylesConfig/index';
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
          label: '向左',
          value: 'left'
        }, {
          label: '向右',
          value: 'right'
        }
      ],
      showOptions: [
        {
          label: '圆形',
          value: 'circle'
        }, {
          label: '长方形',
          value: 'rect'
        }, {
          label: '圆矩形',
          value: 'roundRect'
        }, {
          label: '三角形',
          value: 'triangle'
        }, {
          label: '菱形',
          value: 'diamond'
        }, {
          label: '气泡',
          value: 'pin'
        }, {
          label: '箭头',
          value: 'arrow'
        }
      ],
      positionOptions: [
        {
          label: '顶部',
          value: 'top'
        }, {
          label: '中间',
          value: 'inside'
        }, {
          label: '底部',
          value: 'bottom'
        }, {
          label: '左边',
          value: 'left'
        }, {
          label: '右边',
          value: 'right'
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
    TextStylesConfig
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {return {};}
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
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
      if (key === 'shadowColor' && !value) {value = '';}
      if (['color1', 'color2'].includes(key) && !value) {value = '#fff';}
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
      if (!componentId) {return -1;}
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
