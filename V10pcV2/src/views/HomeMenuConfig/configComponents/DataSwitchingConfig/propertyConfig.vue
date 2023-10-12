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
          <el-collapse accordion>
            <el-collapse-item title="初始化样式" name="6">
              <div class="propsSetting">
                <p class="setTitle">内容</p>
                <apiot-input
                    :value="getComponentInfo.beforeConfig.content"
                    @input="(value) => changeStylesConfig(value, 'content', 'beforeConfig')"/>
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
                <apiot-input
                    :value="getComponentInfo.afterConfig.content"
                    @input="(value) => changeStylesConfig(value, 'content', 'afterConfig')"/>
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
                   v-for="(obj, i) in getComponentInfo.beforeParamsConfig"
                   :key="`${i}_${getComponentInfo.beforeParamsConfig.length}`"
              >
                <div class="tabInterWrapHead">
                  <div class="tabInterWrapName">{{ obj.name }}</div>
                  <div class="tabInterIcon">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="`${obj.isShow ? '显示': '隐藏'}`"
                        placement="top">
                      <el-checkbox
                        :value="obj.isShow"
                        @change="changeParamsConfig(obj,$event,'isShow',i,'beforeParamsConfig')"
                      ></el-checkbox>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <span
                          class="icon-shanchu iconfont"
                          @click="handleDel(i, 'beforeParamsConfig')"></span>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <VariableManage
                    :value="obj.variableConfig"
                    @change="changeParamsConfig(obj,$event,'variableConfig',i,'beforeParamsConfig')"
                  />
                </div>
                <c-divider
                    type="dashed"
                    v-if="i!==getComponentInfo.beforeParamsConfig.length-1"/>
              </div>
            </el-collapse-item>

            <el-collapse-item title="切换后图表" name="8">
              <div class="tabInterWrap"
                   v-for="(obj, i) in getComponentInfo.afterParamsConfig"
                   :key="`${i}_${getComponentInfo.afterParamsConfig.length}`"
              >
                <div class="tabInterWrapHead">
                  <div class="tabInterWrapName">{{ obj.name }}</div>
                  <div class="tabInterIcon">
                    <el-tooltip
                        class="item"
                        effect="dark"
                        :content="`${obj.isShow ? '显示': '隐藏'}`"
                        placement="top">
                      <el-checkbox
                        :value="obj.isShow"
                        @change=" changeParamsConfig( obj,$event,'isShow', i, 'afterParamsConfig')"
                      ></el-checkbox>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <span
                          class="icon-shanchu iconfont"
                          @click="handleDel(i, 'afterParamsConfig')"></span>
                    </el-tooltip>
                  </div>
                </div>
                <div>
                  <VariableManage
                    :value="obj.variableConfig"
                    @change="changeParamsConfig(obj,$event,'variableConfig',i,'afterParamsConfig')"
                  ></VariableManage>
                </div>
                <c-divider
                    type="dashed"
                    v-if="i!==getComponentInfo.afterParamsConfig.length-1"/>
              </div>
            </el-collapse-item>
          </el-collapse>

        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { cloneDeep, intersectionBy, differenceBy } from 'lodash';
import StylesConfig from './StylesConfig/index';
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
    },
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
    LocationProperties,
    StylesConfig
  },

  computed: {
    allComponentOptions() { // 控件值处理
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
        return config[key];
      };
    },
    getList() {
      return this.list;
    }
  },
  mounted() {
    // eslint-disable-next-line max-len
    this.getControlledChartArr = this.getComponentInfo.controlledChart.map((item) => item.componentId);
  },
  methods: {
    changeParamsConfig(item, v, key, index, wrapKey) { // 更新变量配置
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      item[key] = v;
      const arr = info[wrapKey] || [];
      arr.splice(index, 1, item);
      const newInfo = {
        ...info,
        [wrapKey]: arr
      };
      list.splice(i, 1, cloneDeep(newInfo));
      this.$emit('updateList', list);
    },
    changeControlledChart(v) { // 修改受控组件值
      const {
        beforeParamsConfig,
        afterParamsConfig
      } = this.getComponentInfo;
      const arr = v.map((item) => {
        const obj = this.getList.find((objs) => objs.componentId === item) || {};
        const {
          isShow,
          componentId,
          componentName,
          name
        } = obj;
        return {
          isShow,
          componentId,
          componentName,
          name
        }; // 去除没用的属性
      });
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
      const arr = info[key] || [];
      arr.splice(index, 1);
      const newInfo = {
        ...info,
        [key]: arr
      };
      list.splice(i, 1, newInfo);
      this.$emit('updateList', list);
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
    changeStylesConfig(value, key, wrapKey) {
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info[wrapKey] || {};
      const newInfo = {
        ...info,
        [wrapKey]: {
          ...styleObj,
          [key]: value
        }
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
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
      console.log(value);
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const newInfo = {
        ...info,
        [key]: value
      };
      console.log(newInfo, 'newInfo');
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
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

.bgContentWrap {
  width: 100%;
  height: calc(100% - 46px);
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-y: auto;
  //::v-deep {
  //  .el-collapse {
  //    border: none;
  //  }
  //
  //  .el-collapse-item__arrow {
  //    margin: 0 0px 0 auto;
  //  }
  //
  //  .el-collapse-item__header {
  //    height: 30px;
  //    line-height: 30px;
  //    background-color: #131E45;
  //    color: #ffffff;
  //    font-weight: bold;
  //    border-bottom: none;
  //
  //    &:hover {
  //      color: $component-borderFocus-color;
  //    }
  //  }
  //
  //  .el-collapse-item__content {
  //    padding: 10px 0;
  //    background-color: #131E45;
  //
  //    & .propsSetting:last-child {
  //      margin-bottom: 10px;
  //    }
  //  }
  //
  //  .el-collapse-item__wrap {
  //    background-color: #131E45;
  //    border: none;
  //  }
  //}

  .propsSetting {
    margin-bottom: 10px;
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
}
</style>
