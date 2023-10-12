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
          :value="getComponentInfo.stylesObj.zIndex"
          @change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1" title="全局属性">
        <div>
          <div class="propsSetting">
            <p class="setTitle">对齐方式</p>
            <c-select
                :options="options"
                :value="getComponentInfo.stylesObj.labelPosition"
                @change="(value) => changeStyles(value, 'labelPosition')"
            ></c-select>
          </div>
          <div class="propsSetting">
            <p class="setTitle">标签宽度</p>
            <el-input-number
                :min="30"
                controls-position="right"
                :value="getComponentInfo.stylesObj.labelWidth"
                @change="(value) => changeStyles(Number(value), 'labelWidth')"/>
<!--            <c-input-->
<!--                type="number"-->
<!--                :min="30"-->
<!--                :numberValue="getComponentInfo.stylesObj.labelWidth"-->
<!--                @Input-Change="(value) => changeStyles(Number(value), 'labelWidth')"/>-->
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2" title="展示信息">
        <div>
          <infoSetting
              @change="(value) => changeStyles(value, 'labelConfig')"
              :value="getComponentInfo.stylesObj.labelConfig"
          ></infoSetting>
        </div>
      </el-collapse-item>

    </el-collapse>

  </div>
</template>

<script>
// import ChartLayOut from '../ChartLayout/index';
// import MarkConfig from '../MarkingConfig/index';
import infoSetting from './infoSetting';
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
        label: '右对齐',
        value: 'right',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '顶部对齐',
        value: 'top',
        icon: 'icon-youduiqi'
      }]
    };
  },

  components: {
    infoSetting,
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
  watch: {},
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
      if (key === 'dimension') {
        newInfo.markLineConfig = [];
      }
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
//    .fontSizeWrap {
//      display: flex;
//      align-items: center;
//      margin-top: 6px;
//
//      ::v-deep {
//        .selectWrap {
//          flex: 0 0 170px;
//          margin-right: 10px;
//
//          .el-input__inner {
//            height: 32px;
//            line-height: 32px;
//          }
//        }
//
//        .CInputWrap {
//          .el-input-number.is-controls-right .el-input__inner {
//            padding-right: 23px;
//          }
//        }
//      }
//    }
//
//    .borderWrap {
//      display: flex;
//      align-items: center;
//      margin-top: 6px;
//
//      ::v-deep {
//        .selectWrap {
//          flex: 0 0 calc(50% - 5px);
//
//          .el-input__inner {
//            height: 32px;
//            line-height: 32px;
//          }
//        }
//
//        .CInputWrap {
//          flex: 0 0 calc(50% - 5px);
//          margin-right: 10px;
//
//          .el-input-number.is-controls-right .el-input__inner {
//            padding-right: 23px;
//          }
//        }
//      }
//    }
//
//    .alignWrap {
//      width: 100%;
//      display: flex;
//
//      ::v-deep {
//        .el-radio-button {
//          width: calc(100% / 3);
//
//          &.is-active {
//            .el-radio-button__inner {
//              background: $component-borderFocus-color !important;
//              border-color: $component-borderFocus-color !important;
//            }
//          }
//
//          .el-radio-button__inner {
//            width: 100%;
//            padding: 5px 15px;
//            border-radius: 0;
//            border-color: $component-border-color;
//            background: $component-background-color;
//
//            .iconfont {
//              color: #FFFFFF;
//              font-size: 18px;
//            }
//          }
//
//          .el-radio-button__orig-radio:checked + .el-radio-button__inner {
//            background: $component-background-color;
//          }
//        }
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
//  }
//
//  .ellipsisWrap {
//    justify-content: space-between;
//    align-items: center;
//
//    ::v-deep {
//      .el-slider {
//        width: 200px;
//        margin: 0 auto;
//      }
//    }
//  }
//
//}
</style>
