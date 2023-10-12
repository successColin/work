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
        @changeTitle="({value, key}) => changeTitle(value, key)"
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
      <el-collapse-item name="2" title="样式设置">
        <div>
          <div class="propsSetting">
            <p class="setTitle">控件背景色</p>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                show-alpha
                :value="getComponentInfo.stylesObj.bgColor"
                :colorValue="getComponentInfo.stylesObj.bgColor"
                @change="(value) => changeStyles(value|| '#fff', 'bgColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
          <div class="propsSetting">
            <p class="setTitle">控件边框颜色</p>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                show-alpha
                :colorValue="getComponentInfo.stylesObj.borderColor"
                :value="getComponentInfo.stylesObj.borderColor"
                @change="(value) => changeStyles(value|| '#fff', 'borderColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
          <div class="propsSetting">
            <p class="setTitle">字体颜色</p>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                show-alpha
                :value="getComponentInfo.stylesObj.fontColor"
                :colorValue="getComponentInfo.stylesObj.fontColor"
                @change="(value) => changeStyles(value|| '#fff', 'fontColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>
          <div class="propsSetting">
            <p class="setTitle">字体大小</p>
            <el-input-number
                controls-position="right"
                v-model="getComponentInfo.stylesObj.fontSize"
                @change="(value) => changeStyles(Number(value), 'fontSize')"/>
          </div>
          <div class="propsSetting">
            <p class="setTitle">图标及下拉选项悬浮颜色</p>
            <c-color-picker
                style="margin-right: 10px;"
                size="small"
                show-alpha
                :value="getComponentInfo.stylesObj.iconColor"
                :colorValue="getComponentInfo.stylesObj.iconColor"
                @change="(value) => changeStyles(value|| '#fff', 'iconColor')"
                :predefine="predefineColors">
            </c-color-picker>
          </div>

          <div class="propsSetting">
            <p class="setTitle">
              <span>时间类型选用 </span>
              <el-tooltip
                  class="item"
                  effect="dark"
                  :content="getContent"
                  placement="top">
                <span class="icon-bangzhu iconfont" style="cursor: pointer;"></span>
              </el-tooltip>
            </p>
            <el-checkbox-group
                v-model="getCheckedCities"
                class="checkboxWrap">
              <el-checkbox v-for="times in timeType" :label="times.value" :key="times.value">
                {{ times.label }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="propsSetting">
            <p class="setTitle">
              <span>默认时间类型</span>
              <el-tooltip
                  class="item"
                  effect="dark"
                  content="没有选择默认时间类型，则默认生效的时间类型值的第一位"
                  placement="top">
                <span class="iconfont icon-wentibangzhu"></span>
              </el-tooltip>
            </p>
            <c-select
                :options="getTimeTypeOptions"
                :value="getComponentInfo.stylesObj.defaultCheckedTimeType"
                @change="(value) => changeStyles(value, 'defaultCheckedTimeType')"
            ></c-select>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="数据传参" name="1">
        <div>
          <div class="propsSetting">
            <p class="setTitle">关联更新图表</p>
            <div>
              <c-select
                  multiple
                  collapse-tags
                  filterable
                  :options="allComponentOptions"
                  :value="updateChart"
                  @change="(value) => changeStyles(value, 'updateChart')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">传参字段设置</p>
            <div class="paramsSettingWrap">
              <label>
                时间类型
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="该字段存储下拉框中的选项的值（日、周、月、年等）"
                    placement="top">
                  <span class="icon-bangzhu iconfont" style="cursor: pointer;"></span>
                </el-tooltip>
              </label>
              <div>
                <apiot-input
                    type="text"
                    :maxlength="16"
                    placeholder="输入参数字段, 例如：timeType"
                    :value="getComponentInfo.stylesObj.timeTypeFiled"
                    @input="(value) => changeStyles(value, 'timeTypeFiled')"
                />
              </div>
            </div>
            <div class="paramsSettingWrap" style="margin-top: 10px;">
              <label>时间值
                <el-tooltip
                    class="item"
                    effect="dark"
                    content="该字段存储时间框选中的值"
                    placement="top">
                  <span class="icon-bangzhu iconfont" style="cursor: pointer;"></span>
                </el-tooltip>
              </label>
              <div>
                <apiot-input
                    type="text"
                    :maxlength="16"
                    :value="getComponentInfo.stylesObj.timeValueFiled"
                    placeholder="输入参数字段,例如：timeValue"
                    @input="(value) => changeStyles(value, 'timeValueFiled')"
                />
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="其他" name="3">
        <div>
          <div class="propsSetting">
            <p class="setTitle">时间扩展操作</p>
            <div>
              <el-checkbox-group
                  v-model="getCheckedOthers"
                  class="checkboxWrap">
                <el-checkbox
                    v-for="times in getTimeTypeOthers"
                    :label="times.value"
                    :key="times.value"
                >
                  {{ times.label }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { predefineColors, TIME_TYPE } from '../../constants/global';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';

export default {
  props: {
    activeComponent: {
      type: Object,
      default() {
        return {};
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
      updateChart: [],
      predefineColors,
      timeType: TIME_TYPE,
      updateKey: 1,
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)',
      checkedCities: []
    };
  },

  components: {
    LocationProperties
  },

  computed: {
    getCheckedOthers: {
      get() {
        return this.getComponentInfo.stylesObj.checkedTimesOthers;
      },
      set(v) {
        this.changeStyles(v, 'checkedTimesOthers');
      }
    },
    getCheckedCities: {
      get() {
        return this.getComponentInfo.stylesObj.checkedTimes;
      },
      set(v) {
        this.changeStyles(v, 'checkedTimes');
      }
    },
    getTimeTypeOthers() {
      const selectedTimes = this.getTimeTypeOptions;
      return selectedTimes.filter((item) => ![3].includes(item.value));
    },
    getTimeTypeOptions() {
      return this.getComponentInfo.stylesObj.checkedTimes.map((item) => {
        const obj = TIME_TYPE.find((objs) => objs.value === item);
        if (obj) {
          return obj;
        }
        return {};
      });
    },
    getContent() {
      let text = '';
      this.timeType.forEach((item) => {
        text += `${item.label}值为${item.value}; `;
      });
      return text;
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
      const Obj = this.getList.find((item) => item.componentId === componentId) || {};
      return cloneDeep(Obj);
    },
    getList() {
      return this.list;
    }
  },
  mounted() {
    this.updateChart = this.getComponentInfo.stylesObj.updateChart;
  },
  methods: {
    changeTabConfig(value, key, item, index) {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      const tabConfigArr = info.tabConfig || [];
      const stylesObj = info.stylesObj || {};
      tabConfigArr[index] = {
        ...item,
        [key]: value
      };
      let { defaultShowTab } = stylesObj;
      if (key === 'name') {
        const { defaultShowTab: defaultShowTabInfo } = stylesObj;
        const arr = defaultShowTabInfo.split('_');
        const n = arr[1];
        if (Number(n) === index) {
          defaultShowTab = `${value}_${index}`;
        }
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...stylesObj,
          defaultShowTab
        },
        tabConfig: [...tabConfigArr]
      };
      list.splice(i, 1, newInfo);
      this.$emit('updateList', list);
    },
    update(value, key) {
      this.changeStyles(value, key);
      this.updateKey += 1;
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
      if (key === 'updateChart') {
        this.updateChart = value;
      }
    },
    reduceIndex() {
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return -1;
      }
      const index = this.getList.findIndex((item) => item.componentId === componentId);
      return index;
    },
    changeTabsStyles(value, key) {
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const tabType = info.stylesObj.stylesType;
      const tabObj = info[tabType];
      const newInfo = {
        ...info,
        [tabType]: {
          ...tabObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
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

//.bgContentWrap {
//  width: 100%;
//  height: calc(100% - 46px);
//  padding: 10px 20px;
//  box-sizing: border-box;
//  overflow-y: auto;
//
//  .bgSettingWrap {
//    width: 100%;
//    display: flex;
//    align-items: center;
//    justify-content: space-between;
//
//    .switchWrap {
//      margin-right: 10px;
//
//      ::v-deep {
//        .el-switch__core {
//          width: 28px !important;
//          height: 14px;
//        }
//
//        .el-switch__core:after {
//          content: "";
//          position: absolute;
//          top: 2px;
//          left: 4px;
//          border-radius: 100%;
//          transition: all .3s;
//          width: 8px;
//          height: 8px;
//          background-color: #FFF;
//        }
//
//        .el-switch.is-checked .el-switch__core::after {
//          left: 100%;
//          margin-left: -11px;
//        }
//      }
//    }
//  }
//
//  ::v-deep {
//    .el-collapse {
//      border: none;
//    }
//
//    .el-collapse-item__arrow {
//      margin: 0 0px 0 auto;
//    }
//
//    .el-collapse-item__header {
//      height: 30px;
//      line-height: 30px;
//      background-color: #131E45;
//      color: #ffffff;
//      font-weight: bold;
//      border-bottom: none;
//
//      &:hover {
//        color: $component-borderFocus-color;
//      }
//    }
//
//    .el-collapse-item__content {
//      padding: 10px 0;
//      background-color: #131E45;
//
//      & .propsSetting:last-child {
//        margin-bottom: 10px;
//      }
//    }
//
//    .el-collapse-item__wrap {
//      background-color: #131E45;
//      border: none;
//    }
//  }
//
//  .propsSetting {
//    margin-bottom: 10px;
//
//    .businessWrap {
//      .inputBox {
//        width: 100%;
//      }
//    }
//
//    .paramsSettingWrap {
//      display: flex;
//
//      & > label {
//        width: 80px;
//        padding-left: 12px;
//        box-sizing: border-box;
//        line-height: 30px;
//        font-size: 14px;
//        font-family: PingFangSC-Regular, PingFang SC;
//        font-weight: 400;
//        color: #FFFFFF;
//        border-bottom: 1px solid #2F437F;
//        border-top: 1px solid #2F437F;
//        border-left: 1px solid #2F437F;
//        background-color: #192757;
//      }
//    }
//
//    .setTitle {
//      font-size: 14px;
//      font-family: PingFangSC-Regular, PingFang SC;
//      font-weight: 400;
//      color: #FFFFFF;
//      line-height: 30px;
//      text-align: left;
//      opacity: .7;
//    }
//
//    .InputWrap {
//      display: flex;
//      margin-top: 5px;
//      align-items: center;
//      justify-content: space-between;
//
//      ::v-deep {
//        .CInputWrap {
//          width: 100%;
//          display: flex;
//          flex: 0 0 calc(50% - 8px);
//          align-items: center;
//
//          .inputBox {
//            width: 100px;
//
//            .el-input-number {
//              width: 100px;
//
//              .el-input__inner {
//                padding-left: 15px;
//                padding-right: 20px;
//              }
//
//              .el-input-number__decrease, .el-input-number__increase {
//                width: 20px;
//              }
//            }
//          }
//        }
//      }
//    }
//
//    .wrap {
//      display: flex;
//      text-align: left;
//      align-items: center;
//      line-height: 35px;
//
//      & > span {
//        margin-right: 10px;
//        color: #ffffff;
//        font-size: 14px;
//      }
//    }
//
//    .checkboxWrap {
//      ::v-deep {
//        .el-checkbox {
//          margin-right: 0;
//          width: calc(100% / 3);
//        }
//
//        .el-checkbox__label {
//          padding-left: 6px;
//          font-size: 14px;
//          font-family: PingFangSC-Regular, PingFang SC;
//          font-weight: 400;
//          color: #FFFFFF;
//        }
//      }
//    }
//  }
//
//  .tabInterWrap {
//    .tabInterWrapHead {
//      display: flex;
//      height: 30px;
//      align-items: center;
//      justify-content: space-between;
//
//      .tabInterWrapName {
//        font-size: 14px;
//        font-family: PingFangSC-Medium, PingFang SC;
//        font-weight: 500;
//        color: #FFFFFF;
//      }
//    }
//  }
//
//  .numberWrap {
//    display: flex;
//    justify-content: space-between;
//
//    .flexItem {
//      width: 123px;
//    }
//
//    ::v-deep {
//      .el-upload--picture-card {
//        height: 30px !important;
//      }
//    }
//  }
//
//}
</style>
