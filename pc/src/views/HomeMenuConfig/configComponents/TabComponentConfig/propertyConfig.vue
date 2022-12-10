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
      <el-collapse-item name="2" title="样式设置">
        <div>
          <div class="propsSetting">
            <p class="setTitle">Tab风格</p>
            <div>
              <c-select
                  :options="stylesOptions"
                  v-model="getComponentInfo.stylesObj.stylesType"
                  @change="(value) => update(value, 'stylesType')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">Tab左右外边距</p>
            <div>

              <el-input-number
                  controls-position="right"
                  v-model="getComponentInfo.stylesObj.tabMarginLeftAndRight"
                  @change="(value) => changeStyles(Number(value), 'tabMarginLeftAndRight')"/>
            </div>
          </div>
          <el-collapse accordion>
            <el-collapse-item title="选中样式" name="5">
              <StylesConfig
                  :key="updateKey"
                  :config="getStylesConfig('activeConfig')"
                  :stylesType="getComponentInfo.stylesObj.stylesType"
                  @change="(value) => changeTabsStyles(value, 'activeConfig')"
                  type="activeConfig"
              ></StylesConfig>
            </el-collapse-item>
            <el-collapse-item title="常态样式" name="6">
              <StylesConfig
                  :key="updateKey"
                  :stylesType="getComponentInfo.stylesObj.stylesType"
                  :config="getStylesConfig('unActiveConfig')"
                  @change="(value) => changeTabsStyles(value, 'unActiveConfig')"
                  type="unActiveConfig"
              ></StylesConfig>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-collapse-item>
      <el-collapse-item title="交互设置" name="4">
        <div>
          <div class="addWrap">
            <apiot-button
                type="primary"
                icon="icon-xinzeng iconfont"
                @click="handleAdd"
            >新增Tab
            </apiot-button>
          </div>
          <div class="tabInterWrap"
               v-for="(item, index) in tabConfig"
               :key="item.key"
          >
            <div class="tabInterWrapHead">
              <div class="tabInterWrapName">Tab{{ index + 1 }}</div>
              <div class="tabInterIcon">
                <el-tooltip class="item" effect="dark" content="设为默认选中" placement="top">
                  <span
                      @click="changeStyles(`${item.name}_${index}`, 'defaultShowTab')"
                      class="icon-sheweimoren iconfont"
                      :class="{
                      iconActive:getComponentInfo.stylesObj.defaultShowTab===`${item.name}_${index}`
                      }">
                  </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <span class="icon-shanchu iconfont" @click="handleDel(index)"></span>
                </el-tooltip>
              </div>
            </div>
            <div>
              <div class="propsSetting">
                <div>
                  <apiot-input
                      :value="item.name"
                      placeholder="请输入tab名称"
                      @input="(value) => changeTabConfig(value, 'name', item, index)"
                  />
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">关联展示图表</p>
                <div>
                  <c-select
                      multiple
                      collapse-tags
                      filterable
                      :options="allComponentOptions"
                      v-model="item.displayChartArray"
                      @change="(value) => changeTabConfig(value, 'displayChartArray', item, index)"
                  ></c-select>
                </div>
              </div>
              <div class="numberWrap">
                <div class="propsSetting flexItem">
                  <p class="setTitle">Tab选中图标</p>
                  <c-upload
                      :before-upload="beforeAvatarUpload"
                      @changeScreenBg="(value) => changeTabConfig(value, 'activeIcon', item, index)"
                      :isPublic="true"
                      :url="item.activeIcon"
                      accept=".png,.jpg,.jpeg,.svg"
                  >
                  </c-upload>
                </div>
                <div class="propsSetting flexItem">
                  <p class="setTitle">Tab常态图标</p>
                  <div>
                    <c-upload
                        :isPublic="true"
                        :before-upload="beforeAvatarUpload"
                        :url="item.unActiveIcon"
                        @changeScreenBg="changeTabConfig($event, 'unActiveIcon', item, index)"
                        accept=".png,.jpg,.jpeg,.svg"
                    >
                    </c-upload>
                  </div>
                </div>
              </div>
            </div>
            <c-divider type="dashed" v-if="index!==getComponentInfo.tabConfig.length-1"></c-divider>
          </div>
        </div>
      </el-collapse-item>
      <el-collapse-item title="数据传参" name="1">
        <div>
          <div class="propsSetting">
            <p class="setTitle">参数字段</p>
            <apiot-input
                :maxlength="16"
                :value="getComponentInfo.stylesObj.paramName"
                @input="(value) => changeStyles(value, 'paramName')"
            />
          </div>
          <div class="tabInterWrap"
               v-for="(item, index) in tabConfig"
               :key="item.key"
          >
            <div>
              <div class="propsSetting">
                <p class="setTitle">{{ item.name }}</p>
                <div>
                  <c-select
                      multiple
                      collapse-tags
                      filterable
                      :options="allComponentOptions"
                      v-model="item.geChartArray"
                      @change="(value) => changeTabConfig(value, 'geChartArray', item, index)"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting">
                <div>
                  <apiot-input
                      v-model="item.value"
                      placeholder="请输入传递值"
                      @input="(value) => changeTabConfig(value, 'value', item, index)"
                  />
                </div>
              </div>
            </div>
            <c-divider type="dashed" v-if="index!==getComponentInfo.tabConfig.length-1"></c-divider>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { createUnique } from '@/utils/utils';
import StylesConfig from './StylesConfig/index';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import CUpload from '../../basicWidgets/CUpload/index';

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
      tabConfig: [], // 交互配置
      updateKey: 1,
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)',
      stylesOptions: [
        {
          label: '风格一',
          value: 'styleOne'
        },
        {
          label: '风格二',
          value: 'styleTwo'
        },
        {
          label: '风格三',
          value: 'styleThree'
        }
      ]
    };
  },

  components: {
    StylesConfig,
    LocationProperties,
    CUpload
  },

  computed: {
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
    getStylesConfig() {
      return function (key) {
        const config = this.getComponentInfo;
        const { stylesObj: { stylesType } } = config;
        return config[stylesType][key];
      };
    },
    getList() {
      return this.list;
    }
  },
  mounted() {
    this.tabConfig = this.getComponentInfo?.tabConfig || [];
  },
  methods: {
    handleDel(index) {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      const tabConfigArr = info.tabConfig || [];
      const stylesObj = info.stylesObj || {};
      tabConfigArr.splice(index, 1);
      let defaultShowTab = null;
      if (tabConfigArr.length) {
        defaultShowTab = `${tabConfigArr[0].name}_0`;
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
      this.tabConfig = newInfo.tabConfig || [];
      this.$emit('updateList', list);
    },
    handleAdd() {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.tabConfig || [];
      let name = '';
      if (!styleObj.length) {
        name = 'tab1';
      }
      const lastKey = createUnique();
      styleObj.push({
        key: lastKey,
        name, // tab名称
        displayChartArray: [], // tab关联显示的图表，是空数组默认不处理
        activeIcon: '', // tab激活状态下的图标
        unActiveIcon: '', // tab非激活状态下的图标
        value: '', // 当前tab代表的参数，用于更新图标
        geChartArray: [] // 当前tab需要更新哪几个图表，配合value字段使用
      });
      if (styleObj.length === 1) {
        this.changeStyles('tab1_0', 'defaultShowTab');
      }
      const newInfo = {
        ...info,
        tabConfig: [...styleObj]
      };
      list.splice(i, 1, newInfo);
      this.$emit('updateList', list);
      this.tabConfig = newInfo.tabConfig || [];
    },
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
        const v = arr[1];
        if (Number(v) === index) {
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
      this.tabConfig = newInfo.tabConfig || [];
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 50kb!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
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
//  .addWrap {
//    margin-bottom: 10px;
//    width: 100%;
//
//    ::v-deep {
//      .el-button {
//        width: 100%;
//      }
//
//      .icon-xinzeng {
//        vertical-align: bottom;
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
//
//      .tabInterIcon {
//
//        .iconfont {
//          margin-left: 10px;
//          color: #FFFFFF;
//          cursor: pointer;
//
//          &:hover {
//            color: #4689F5;
//          }
//        }
//
//        .iconActive {
//          color: #4689F5;
//        }
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
  .addWrap {
    margin-bottom: 10px;
    width: 100%;

    ::v-deep {
      .el-button {
        width: 100%;
      }

      .icon-xinzeng {
        vertical-align: bottom;
      }
    }
  }

  .tabInterWrap {
    .tabInterWrapHead {
      display: flex;
      height: 30px;
      align-items: center;
      justify-content: space-between;

      .tabInterWrapName {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }

      .tabInterIcon {

        .iconfont {
          margin-left: 10px;
          color: #333333;
          cursor: pointer;

          &:hover {
            color: #4689F5;
          }
        }

        .iconActive {
          color: #4689F5;
        }
      }
    }
  }

  //::v-deep {
  //  .el-tabs--card > .el-tabs__header .el-tabs__nav {
  //    border: none;
  //  }
  //
  //  .el-tabs--card > .el-tabs__header .el-tabs__item {
  //    border: none;
  //  }
  //
  //  .el-tabs--card > .el-tabs__header {
  //    border: none;
  //  }
  //
  //  .el-tabs__item {
  //    padding: 0 10px;
  //    color: #333;
  //    opacity: .7;
  //  }
  //
  //  .el-tabs__item.is-active {
  //    color: #4689F5;
  //    opacity: 1;
  //  }
  //
  //  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
  //    padding-left: 15px;
  //    padding-right: 15px;
  //  }
  //
  //  .el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2),
  //  .el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2),
  //  .el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2),
  //  .el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2),
  //  .el-tabs--top .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2),
  //  .el-tabs--top .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2),
  //  .el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2),
  //  .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
  //    padding-left: 15px;
  //  }
  //
  //  .el-tabs__nav-next, .el-tabs__nav-prev {
  //    line-height: 40px;
  //    color: #666666;
  //
  //    &:hover {
  //      color: #4689F5;
  //    }
  //  }
  //
  //  .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
  //    color: #4689F5;
  //    opacity: 1;
  //  }
  //
  //  .el-tabs__item .el-icon-close:hover {
  //    background: none;
  //    color: #4689F5;
  //  }
  //
  //  .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
  //    top: -2px;
  //    right: 3px;
  //  }
  //
  //  .el-tabs__new-tab {
  //    color: #666666;
  //    border: none;
  //    outline: none;
  //  }
  //
  //  .el-tabs__header {
  //    margin: 0;
  //  }
  //}

  //.propsSetting {
  //  margin-bottom: 10px;
  //
  //  .businessWrap {
  //    .inputBox {
  //      width: 100%;
  //    }
  //  }
  //
  //  .fontSizeWrap {
  //    display: flex;
  //    align-items: center;
  //    margin-top: 6px;
  //
  //    ::v-deep {
  //      .selectWrap {
  //        flex: 0 0 170px;
  //        margin-right: 10px;
  //
  //        .el-input__inner {
  //          height: 32px;
  //          line-height: 32px;
  //        }
  //      }
  //
  //      .CInputWrap {
  //        .el-input-number.is-controls-right .el-input__inner {
  //          padding-right: 23px;
  //        }
  //      }
  //    }
  //  }
  //
  //  .borderWrap {
  //    display: flex;
  //    align-items: center;
  //    margin-top: 6px;
  //
  //    ::v-deep {
  //      .selectWrap {
  //        flex: 0 0 calc(50% - 5px);
  //
  //        .el-input__inner {
  //          height: 32px;
  //          line-height: 32px;
  //        }
  //      }
  //
  //      .CInputWrap {
  //        flex: 0 0 calc(50% - 5px);
  //        margin-right: 10px;
  //
  //        .el-input-number.is-controls-right .el-input__inner {
  //          padding-right: 23px;
  //        }
  //      }
  //    }
  //  }
  //
  //  .alignWrap {
  //    width: 100%;
  //    display: flex;
  //
  //    ::v-deep {
  //      .el-radio-button {
  //        width: calc(100% / 3);
  //
  //        &.is-active {
  //          .el-radio-button__inner {
  //            background: $component-borderFocus-color !important;
  //            border-color: $component-borderFocus-color !important;
  //          }
  //        }
  //
  //        .el-radio-button__inner {
  //          width: 100%;
  //          padding: 5px 15px;
  //          border-radius: 0 !important;
  //          border-color: $component-border-color;
  //          background: $component-background-color;
  //
  //          .iconfont {
  //            color: #FFFFFF;
  //            font-size: 18px;
  //          }
  //        }
  //
  //        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
  //          background: $component-background-color;
  //        }
  //      }
  //    }
  //  }
  //
  //  .InputWrap {
  //    display: flex;
  //    margin-top: 5px;
  //    align-items: center;
  //    justify-content: space-between;
  //
  //    ::v-deep {
  //      .CInputWrap {
  //        width: 100%;
  //        display: flex;
  //        flex: 0 0 calc(50% - 8px);
  //        align-items: center;
  //
  //        .inputBox {
  //          width: 100px;
  //
  //          .el-input-number {
  //            width: 100px;
  //
  //            .el-input__inner {
  //              padding-left: 15px;
  //              padding-right: 20px;
  //            }
  //
  //            .el-input-number__decrease, .el-input-number__increase {
  //              width: 20px;
  //            }
  //          }
  //        }
  //      }
  //    }
  //  }
  //
  //  .wrap {
  //    display: flex;
  //    text-align: left;
  //    align-items: center;
  //    line-height: 35px;
  //
  //    & > span {
  //      margin-right: 10px;
  //      color: #ffffff;
  //      font-size: 14px;
  //    }
  //  }
  //
  //}

  //.ellipsisWrap {
  //  justify-content: space-between;
  //  align-items: center;
  //
  //  ::v-deep {
  //    .el-slider {
  //      width: 200px;
  //      margin: 0 auto;
  //    }
  //  }
  //}
  .numberWrap {
    display: flex;
    justify-content: space-between;

    .flexItem {
      width: 123px;
    }

    ::v-deep {
      .el-upload--picture-card {
        height: 30px !important;
      }
    }
  }
}
</style>
