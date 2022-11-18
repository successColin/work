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
          type="text"
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
      <el-collapse-item name="1" title="全局属性">
        <div>
          <div class="propsSetting">
            <p class="setTitle">列表行数</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :max="50"
                  :min="1"
                  v-model="getComponentInfo.stylesObj.rows"
                  @change="(value) => changeStyles(Number(value), 'rows')"/>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
            <span class="setTitle">轮播</span>
            <el-switch
                :value="getComponentInfo.stylesObj.loop"
                @change="(value) => changeStyles(value, 'loop')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
          <el-collapse v-if="getComponentInfo.stylesObj.loop">
            <el-collapse-item title="动画" name="11">
              <div>
                <div class="propsSetting">
                  <p class="setTitle">动画类型</p>
                  <div>
                    <c-select
                        :options="animationTypes"
                        :value="getComponentInfo.stylesObj.animationTypes"
                        @change="(value) => changeStyles(value, 'animationTypes')"
                    ></c-select>
                  </div>
                </div>
                <div class="propsSetting">
                  <p class="setTitle">轮播间隔(秒)</p>
                  <div>
                    <el-input-number
                        controls-position="right"
                        :min="0"
                        v-model="getComponentInfo.stylesObj.loopTime"
                        @change="(value) => changeStyles(Number(value), 'loopTime')"/>
                  </div>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item name="12" v-if="getComponentInfo.stylesObj.animationTypes===2">
              <template slot="title">
                <div class="bgSettingWrap">
                  <div class="title">行高亮</div>
                  <div class="switchWrap">
                    <el-switch
                        @click.stop.native
                        :value="getComponentInfo.enableLinesHighlighted"
                        @change="(value) => changeTitle(value, 'enableLinesHighlighted')"
                        active-color="#4689F5"
                        inactive-color="#DCDFE6">
                    </el-switch>
                  </div>
                </div>
              </template>
              <div>
                <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
                  <span class="setTitle">自动依次高亮</span>
                  <el-switch
                      :value="getComponentInfo.stylesObj.autoHighlight"
                      @change="(value) => changeStyles(value, 'autoHighlight')"
                      active-color="#4689F5"
                      inactive-color="#DCDFE6">
                  </el-switch>
                </div>
                <div class="propsSetting" v-if="!getComponentInfo.stylesObj.autoHighlight">
                  <p class="setTitle">指定高亮行数</p>
                  <div>
                    <apiot-input
                        v-model="getComponentInfo.stylesObj.speHighlight"
                        @change="(value) => changeStyles(value, 'speHighlight')"
                    ></apiot-input>
                  </div>
                </div>
                <div class="propsSetting" v-if="getComponentInfo.stylesObj.autoHighlight">
                  <div>
                    <TextStylesConfig
                        title="高亮字体样式"
                        title1="高亮字体颜色"
                        :fontFamilyValue="getComponentInfo.stylesObj.highlightFontFamily"
                        :fontWeightValue="getComponentInfo.stylesObj.highlightFontWeight"
                        :fontSizeValue="getComponentInfo.stylesObj.highlightFontSize"
                        :colorValue="getComponentInfo.stylesObj.highlightColor"
                        @change="({value,key}) => changeStyles(value, `highlight${key}`)"
                    />
                  </div>
                </div>
                <div class="propsSetting" v-if="getComponentInfo.stylesObj.autoHighlight">
                  <p class="setTitle">高亮背景色</p>
                  <div>
                    <c-color-picker
                        size="small"
                        v-model="getComponentInfo.stylesObj.highlightBgColor"
                        show-alpha
                        @change="(value) => changeStyles(value, 'highlightBgColor')"
                        :predefine="predefineColors">
                    </c-color-picker>
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
            <div class="title">表头</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableHeader"
                  @change="(value) => changeTitle(value, 'enableHeader')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting">
            <p class="setTitle">表头行高(%)</p>
            <div>
              <c-slider
                  v-model="getComponentInfo.stylesObj.theadHeight"
                  @change="(value) => changeStyles(value, 'theadHeight')"></c-slider>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">表头背景色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.theadBgColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'theadBgColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <TextStylesConfig
              title="字体样式"
              title1="字体颜色"
              fontFamily="微软雅黑"
              :fontSize="11"
              fontWeight="normal"
              color="#FFF"
              :fontFamilyValue="getComponentInfo.stylesObj.theadFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.theadFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.theadFontSize"
              :colorValue="getComponentInfo.stylesObj.theadColor"
              @change="({value,key}) => changeStyles(value, `thead${key}`)"
          />
          <div class="propsSetting">
            <p class="setTitle">对齐方式</p>
            <el-radio-group
                class="alignWrap"
                @change="(value) => changeStyles(value, 'theadTextAlign')"
                v-model="getComponentInfo.stylesObj.theadTextAlign"
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
        </div>
      </el-collapse-item>
      <el-collapse-item name="5">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">序号</div>
            <div class="switchWrap">
              <el-switch
                  @click.stop.native
                  :value="getComponentInfo.enableSno"
                  @change="(value) => changeTitle(value, 'enableSno')"
                  active-color="#4689F5"
                  inactive-color="#DCDFE6">
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <TextStylesConfig
              title="字体样式"
              title1="字体颜色"
              fontFamily="微软雅黑"
              :fontSize="11"
              fontWeight="normal"
              color="#FFF"
              :fontFamilyValue="getComponentInfo.stylesObj.snoFontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.snoFontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.snoFontSize"
              :colorValue="getComponentInfo.stylesObj.snoColor"
              @change="({value,key}) => changeStyles(value, `sno${key}`)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item title="行配置" name="3">
        <div>
          <div class="propsSetting">
            <p class="setTitle">奇行背景色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.oddBgColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'oddBgColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">偶行背景色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.evenBgColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'evenBgColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="4" title="自定义列">
        <div>
          <div>
            <list-field-config
                :key="getComponentInfo.componentId"
                @change="(value) => changeTitle(value, 'columnConfig')"
                v-model="getComponentInfo.columnConfig"></list-field-config>
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>

  </div>
</template>

<script>
import TextStylesConfig from '../../Layout/TextStylesConfig/index';
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
      enable: true,
      animationTypes: [
        {
          label: '逐条向上滚动',
          value: 2
        }, {
          label: '全部向上滚动',
          value: 3
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
    TextStylesConfig,
    LocationProperties
  },

  computed: {
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

  mounted() {
  },
  watch: {
  },
  methods: {
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
