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
          <el-collapse accordion>
            <el-collapse-item title="初始化样式" name="6">
              <div class="propsSetting">
                <p class="setTitle">内容</p>
                <c-input
                    :value="getComponentInfo.beforeConfig.content"
                    @Input-Change="(value) => changeStylesConfig(value, 'content', 'beforeConfig')"/>
              </div>
              <StylesConfig
                  :key="updateKey"
                  :config="getStylesConfig('beforeConfig')"
                  @change="(value) => changeTabsStyles(value, 'beforeConfig')"
                  type="unActiveConfig"
              ></StylesConfig>
            </el-collapse-item>

            <el-collapse-item title="切换后样式" name="5">
              <div class="propsSetting">
                <p class="setTitle">内容</p>
                <c-input
                    :value="getComponentInfo.afterConfig.content"
                    @Input-Change="(value) => changeStylesConfig(value, 'content', 'afterConfig')"/>
              </div>
              <StylesConfig
                  :key="updateKey"
                  :config="getStylesConfig('afterConfig')"
                  @change="(value) => changeTabsStyles(value, 'afterConfig')"
                  type="activeConfig"
              ></StylesConfig>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-collapse-item>
      <el-collapse-item title="交互设置" name="4">
        <div>
          <div class="propsSetting">
            <p class="setTitle">选择受控图表</p>
            <div>
              <c-select
                  multiple
                  collapse-tags
                  filterable
                  :options="allComponentOptions"
                  :value="getControlledChartArr"
                  @change="changeControlledChart"
              ></c-select>
            </div>
          </div>
          <el-collapse accordion>
            <el-collapse-item title="初始化图表" name="7">
              <div class="tabInterWrap"
                   v-for="(item, index) in getComponentInfo.beforeParamsConfig"
                   :key="`${index}_${getComponentInfo.beforeParamsConfig.length}`"
              >
                <div class="tabInterWrapHead">
                  <div class="tabInterWrapName">{{ item.name }}</div>
                  <div class="tabInterIcon">
                    <el-tooltip class="item" effect="dark" :content="`${item.isShow ? '显示': '隐藏'}`" placement="top">
                      <el-checkbox
                          :value="item.isShow"
                          @change="(v) => changeParamsConfig( item,v,'isShow', index, 'beforeParamsConfig')"
                      ></el-checkbox>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <span class="icon-shanchu iconfont" @click="handleDel(index, 'beforeParamsConfig')"></span>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <VariableManage
                      :value="item.variableConfig"
                      @change="(v) => changeParamsConfig(item, v, 'variableConfig', index, 'beforeParamsConfig')"
                  ></VariableManage>
                </div>
                <c-divider type="dashed" v-if="index!==getComponentInfo.beforeParamsConfig.length-1"></c-divider>
              </div>
            </el-collapse-item>

            <el-collapse-item title="切换后图表" name="8">
              <div class="tabInterWrap"
                   v-for="(item, index) in getComponentInfo.afterParamsConfig"
                   :key="`${index}_${getComponentInfo.afterParamsConfig.length}`"
              >
                <div class="tabInterWrapHead">
                  <div class="tabInterWrapName">{{ item.name }}</div>
                  <div class="tabInterIcon">
                    <el-tooltip class="item" effect="dark" :content="`${item.isShow ? '显示': '隐藏'}`" placement="top">
                      <el-checkbox
                          :value="item.isShow"
                          @change="(v) => changeParamsConfig( item,v,'isShow', index, 'afterParamsConfig')"
                      ></el-checkbox>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <span class="icon-shanchu iconfont" @click="handleDel(index, 'afterParamsConfig')"></span>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <VariableManage
                      :value="item.variableConfig"
                      @change="(v) => changeParamsConfig(item, v, 'variableConfig', index, 'afterParamsConfig')"
                  ></VariableManage>
                </div>
                <c-divider type="dashed" v-if="index!==getComponentInfo.afterParamsConfig.length-1"></c-divider>
              </div>
            </el-collapse-item>
          </el-collapse>

        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import {cloneDeep, intersectionBy, differenceBy} from 'lodash';
import StylesConfig from './StylesConfig/index';

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
      getControlledChartArr: [],
      updateKey: 1,
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)'
    };
  },

  components: {
    StylesConfig
  },

  computed: {
    allComponentOptions() { // 控件值处理
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
    getStylesConfig() {
      return function (key) {
        const config = this.getComponentInfo;
        return config[key];
      }
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  mounted() {
    this.getControlledChartArr = this.getComponentInfo.controlledChart.map((item) => item.componentId);
  },
  methods: {
    changeParamsConfig(item, v, key, index, wrapKey) { // 更新变量配置
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      item[key] = v;
      let arr = info[wrapKey] || [];
      arr.splice(index, 1, item);
      const newInfo = {
        ...info,
        [wrapKey]: arr
      };
      list.splice(i, 1, cloneDeep(newInfo));
      this.$store.dispatch('config/updateComponentList', list);
    },
    changeControlledChart(v) { // 修改受控组件值
      let {beforeParamsConfig, afterParamsConfig} = this.getComponentInfo;
      const arr = v.map((item) => {
        const obj = this.getList.find((objs) => {
          return objs.componentId === item
        }) || {};
        const {isShow, componentId, componentName, name} = obj;
        return {isShow, componentId, componentName, name}; // 去除没用的属性
      })
      const beforeArr = intersectionBy(beforeParamsConfig, arr, 'componentId'); // 找到2个数据的交集
      const afterArr = intersectionBy(afterParamsConfig, arr, 'componentId');
      const beforeFilterArr = differenceBy(arr, beforeArr, 'componentId');
      const afterFilterArr = differenceBy(arr, afterArr, 'componentId');
      const beforeLastArr = [...beforeFilterArr, ...beforeArr];
      const afterLastArr = [...afterFilterArr, ...afterArr];
      this.changeTitleByObject({
        controlledChart: cloneDeep(arr),
        beforeParamsConfig: cloneDeep(beforeLastArr),
        afterParamsConfig: cloneDeep(afterLastArr)
      });
      this.getControlledChartArr = v;
    },
    handleDel(index, key) {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      let arr = info[key] || [];
      arr.splice(index, 1);
      const newInfo = {
        ...info,
        [key]: arr
      };
      list.splice(i, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 50kb!');
          reject(file);
          return false
        }
        return resolve(file)
      })
    },
    update(value, key) {
      this.changeStyles(value, key);
      this.updateKey += 1;
    },
    changeStylesConfig(value, key, wrapKey) {
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info[wrapKey] || {};
      const newInfo = {
        ...info,
        [wrapKey]: {
          ...styleObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
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
      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    changeTitleByObject(obj) { // obj直接赋值
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;

      const newInfo = {
        ...info,
        ...obj
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
