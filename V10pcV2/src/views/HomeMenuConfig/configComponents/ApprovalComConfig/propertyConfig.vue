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
          v-model="getComponentInfo.stylesObj.zIndex"
          @change="(value) => changeStyles(Number(value), 'zIndex')"
      />
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="文本样式" name="1">
        <div>
          <div class="propsSetting">
            <p class="setTitle">字体</p>
            <c-select
                :options="fontFamilyOptions"
                :value="getComponentInfo.stylesObj.fontFamily"
                @change="(value) => changeStyles(value, 'fontFamily')"
            >
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
                  @change="(value) => changeStyles(value, 'fontSize')"
              />
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">渐变类型</p>
            <c-select
                :options="colorTypeOptions"
                :value="getComponentInfo.gradientType"
                @change="(value) => changeTitle(value, 'gradientType')"
            ></c-select>
            <div style="display: flex; text-align: left; margin-top: 6px">
              <c-color-picker
                  style="margin-right: 10px"
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
                <span class="iconfont" :class="{ [item.icon]: true }"></span>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="propsSetting">
            <p class="setTitle">文字间距</p>
            <el-input-number
                :min="0"
                controls-position="right"
                v-model="getComponentInfo.stylesObj.letterSpacing"
                @change="(value) => changeStyles(value, 'letterSpacing')"
            />
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
                  inactive-color="#DCDFE6"
              >
              </el-switch>
            </div>
          </div>
        </template>
        <div>
          <div class="propsSetting" style="margin-bottom: 10px">
            <p class="setTitle">背景色</p>
            <div style="text-align: left">
              <c-color-picker
                  style="margin-right: 10px"
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
                @change="(value) => changeStyles(value, 'borderRadius')"
            />
          </div>
          <div class="propsSetting">
            <p class="setTitle">背景边框</p>
            <c-color-picker
                style="margin-right: 10px"
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
                  @change="(value) => changeStyles(value, 'borderWidth')"
              />
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
                @change="(value) => changeStyles(value, 'hShadow')"
            />
          </div>
          <div class="propsSetting">
            <p class="setTitle">垂直阴影</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.vShadow"
                @change="(value) => changeStyles(value, 'vShadow')"
            />
          </div>
          <div class="propsSetting">
            <p class="setTitle">阴影距离</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.blur"
                @change="(value) => changeStyles(value, 'blur')"
            />
          </div>
          <div class="propsSetting">
            <p class="setTitle">阴影颜色</p>
            <div style="text-align: left">
              <c-color-picker
                  style="margin-right: 10px"
                  size="small"
                  v-model="getComponentInfo.stylesObj.shadowColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'shadowColor')"
                  :predefine="predefineColors"
              >
              </c-color-picker>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="审批数据配置" name="3">
        <div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">筛选流程分组</span>
            <div>
              <el-select
                  v-model="getComponentInfo.stylesObj.flowGroups"
                  filterable
                  multiple
                  placeholder="请选择">
                <el-option
                    v-for="item in groupOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">流程类型设置</span>
            <div>
              <el-radio-group v-model="getComponentInfo.stylesObj.flowType">
                <apiot-radio label="LeaveItToMe">待我处理</apiot-radio>
                <apiot-radio label="Completed">我参与的</apiot-radio>
                <apiot-radio label="IInitiatedIt">我发起的</apiot-radio>
                <apiot-radio label="CC">抄送给我</apiot-radio>
                <apiot-radio label="DRAFT">我发起的(草稿)</apiot-radio>
                <apiot-radio label="REJECTED">我发起的(被驳回)</apiot-radio>
                <apiot-radio label="IN_PROGRESS">我发起的(进行中)</apiot-radio>
                <apiot-radio label="COMPLETED">我发起的(已完成)</apiot-radio>
                <apiot-radio label="REVOKED">我发起的(已撤回)</apiot-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { getFlowGroup } from '@/api/flow';

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
    }
  },
  data() {
    return {
      groupOptions: [],
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
      borderOptions: [
        {
          label: '实线',
          value: 'solid'
        },
        {
          label: '虚线',
          value: 'dashed'
        }
      ],
      colorTypeOptions: [
        {
          label: '左右渐变',
          value: 1
        },
        {
          label: '上下渐变',
          value: 2
        }
      ],
      activeName: '',
      color1: '#ffffff',
      color2: '#ffffff',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors,
      options: [
        {
          label: '左对齐',
          value: 'left',
          icon: 'icon-juzuoduiqi'
        },
        {
          label: '居中',
          value: 'center',
          icon: 'icon-juzhongduiqi'
        },
        {
          label: '右对齐',
          value: 'right',
          icon: 'icon-juyouduiqi'
        }
      ]
    };
  },

  components: {
    LocationProperties,
  },

  computed: {
    getComponentInfo() {
      // 获取控件详情信息
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
  watch: {},
  methods: {
    async init() {
      const res = await getFlowGroup();
      this.groupOptions = res;
      console.log(res);
    },
    changeStyles(value, key) {
      // 样式修改
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
    changeTitle(value, key) {
      // 设置组件名称
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
              background: #e5f0ff !important;
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
              color: #bbc3cd;
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

    ::v-deep {
      .el-radio {
        line-height: 30px;
      }

      .el-radio-group {
        flex-wrap: wrap;
      }
      .apiotRadio{
        width: 50%;
        margin-right: 0;
      }
    }
  }
}
</style>
