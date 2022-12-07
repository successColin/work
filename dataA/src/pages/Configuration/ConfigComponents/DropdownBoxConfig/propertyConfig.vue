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
            <p class="setTitle">图标颜色</p>
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
        </div>
      </el-collapse-item>
      <el-collapse-item title="交互设置" name="4">
        <div>
          <div class="addWrap">
            <c-button type="primary" icon="icon-xinzeng iconfont" @click="handleAdd">新增选项</c-button>
          </div>
          <div class="tabInterWrap"
               v-for="(item, index) in getComponentInfo.stylesObj.selectOptions"
               :key="`${index}_${getComponentInfo.stylesObj.selectOptions.length}`"
          >
            <div class="tabInterWrapHead">
              <div class="tabInterWrapName">选项{{ index + 1 }}</div>
              <div class="tabInterIcon">
                <el-tooltip class="item" effect="dark" content="设为默认选中" placement="top">
                  <span
                      @click="changeStyles(`${item.label}_${index}`, 'defaultCheckedTimeType')"
                      class="icon-sheweimoren iconfont"
                      :class="{iconActive:getComponentInfo.stylesObj.defaultCheckedTimeType === `${item.label}_${index}`}"></span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="top">
                  <span class="icon-shanchu iconfont" @click="handleDel(index)"></span>
                </el-tooltip>
              </div>
            </div>
            <div>
              <div class="propsSetting">
                <div>
                  <c-input
                      type="text"
                      v-model="item.label"
                      placeholder="请输入选项名称"
                      @Input-Change="(value) => changeTabConfig(value, 'label', item, index)"
                  />
                </div>
              </div>
              <div class="propsSetting">
                <div>
                  <c-input
                      type="text"
                      v-model="item.value"
                      placeholder="请输入选项值"
                      @Input-Change="(value) => changeTabConfig(value, 'value', item, index)"
                  />
                </div>
              </div>
            </div>
            <c-divider type="dashed" v-if="index!==getComponentInfo.stylesObj.selectOptions.length-1"></c-divider>
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
            <div>
              <c-input
                  type="text"
                  :maxlength="16"
                  placeholder="输入参数字段"
                  :value="getComponentInfo.stylesObj.paramsFiled"
                  @Input-Change="(value) => changeStyles(value, 'paramsFiled')"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import {cloneDeep} from 'lodash';
import {predefineColors, TIME_TYPE} from '@/constants/global'

export default {
  props: {
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      predefineColors,
      timeType: TIME_TYPE,
      updateKey: 1,
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)',
      checkedCities: [],
      updateChart: []
    };
  },

  components: {},

  computed: {
    getCheckedCities: {
      get() {
        return this.getComponentInfo.stylesObj.checkedTimes;
      },
      set(v) {
        this.changeStyles(v, 'checkedTimes')
      }
    },
    getTimeTypeOptions() {
      return this.getComponentInfo.stylesObj.checkedTimes.map((item) => {
        const obj = TIME_TYPE.find((objs) => objs.value === item);
        if (obj) {
          return obj;
        }
        return {}
      })
    },
    getContent() {
      let text = '';
      this.timeType.forEach((item) => {
        text += `${item.label}值为${item.value}; `;
      })
      return text;
    },
    allComponentOptions() {
      const list = this.getList.filter((item) => item.componentId !== this.activeComponent.componentId);
      return list.map((item) => {
        return {
          label: item.name,
          value: item.componentId
        }
      })
    },
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      return cloneDeep(Obj);
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  mounted() {
    this.updateChart = this.getComponentInfo.stylesObj.updateChart
  },
  methods: {
    handleDel(index) {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      let tabConfigArr = info.stylesObj.selectOptions || [];
      let stylesObj = info.stylesObj || {};
      tabConfigArr.splice(index, 1);
      let {defaultCheckedTimeType: defaultShowTabInfo} = stylesObj
      const arr = defaultShowTabInfo.split('_');
      const i1 = arr[1];
      if (Number(i1) === index) {
        defaultShowTabInfo = '';
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...stylesObj,
          defaultCheckedTimeType: defaultShowTabInfo,
          selectOptions: [...tabConfigArr]
        }
      };
      list.splice(i, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    handleAdd() {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj.selectOptions || [];
      let stylesObj = info.stylesObj;
      styleObj.push({
        label: '',
        value: ''
      })
      const newInfo = {
        ...info,
        stylesObj: {
          ...stylesObj,
          selectOptions: [...styleObj]
        }
      };
      list.splice(i, 1, newInfo);
      this.$nextTick(() => {
        this.$store.dispatch('config/updateComponentList', list);
      })
    },
    changeTabConfig(value, key, item, index) {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      let tabConfigArr = info.stylesObj.selectOptions || [];
      let stylesObj = info.stylesObj || {};
      tabConfigArr[index] = {
        ...item,
        [key]: value
      }
      let defaultShowTab = stylesObj.defaultCheckedTimeType;
      if (key === 'label') {
        const {defaultCheckedTimeType: defaultShowTabInfo} = stylesObj
        const arr = defaultShowTabInfo.split('_');
        const i = arr[1];
        if (Number(i) === index) {
          defaultShowTab = `${value}_${index}`;
        }
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...stylesObj,
          defaultCheckedTimeType: defaultShowTab,
          selectOptions: [...tabConfigArr]
        }
      };
      list.splice(i, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    update(value, key) {
      this.changeStyles(value, key);
      this.updateKey += 1;
    },
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
      const newInfo = {
        ...info,
        stylesObj: {
          ...styleObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
      if (key === 'updateChart') {
        this.updateChart = value;
      }
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
      this.$store.dispatch('config/updateComponentList', list);
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

    .paramsSettingWrap {
      display: flex;

      & > label {
        width: 80px;
        padding-left: 12px;
        box-sizing: border-box;
        line-height: 30px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        border-bottom: 1px solid #2F437F;
        border-top: 1px solid #2F437F;
        border-left: 1px solid #2F437F;
        background-color: #192757;
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

    .checkboxWrap {
      ::v-deep {
        .el-checkbox {
          margin-right: 0;
          width: calc(100% / 3);
        }

        .el-checkbox__label {
          padding-left: 6px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
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
        color: #FFFFFF;
      }

      .tabInterIcon {


        .iconfont {
          margin-left: 10px;
          color: #FFFFFF;
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
        color: #FFFFFF;
      }
    }
  }

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
