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
        </div>
      </el-collapse-item>
      <el-collapse-item title="交互设置" name="4">
        <div>
          <div class="propsSetting">
            <p class="setTitle">下拉选项设置类型</p>
            <div>
              <el-radio-group
                  @input="(value) => changeStyles(+value, 'interactionSettingType')"
                  :value="getComponentInfo.stylesObj.interactionSettingType"
              >
                <el-radio :label="1">自定义</el-radio>
                <el-radio :label="2">系统</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div v-if="getComponentInfo.stylesObj.interactionSettingType===1">
            <div class="addWrap">
              <apiot-button
                  type="primary"
                  icon="icon-xinzeng iconfont"
                  @click="handleAdd">新增选项</apiot-button>
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
                      :class="{
                        // eslint-disable-next-line max-len
                        iconActive:getComponentInfo.stylesObj.defaultCheckedTimeType === `${item.label}_${index}`
                      }"></span>
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
                        type="text"
                        v-model="item.label"
                        placeholder="请输入选项名称"
                        @input="(value) => changeTabConfig(value, 'label', item, index)"
                    />
                  </div>
                </div>
                <div class="propsSetting">
                  <div>
                    <apiot-input
                        type="text"
                        v-model="item.value"
                        placeholder="请输入选项值"
                        @input="(value) => changeTabConfig(value, 'value', item, index)"
                    />
                  </div>
                </div>
              </div>
              <c-divider
                  type="dashed"
                  v-if="index!==getComponentInfo.stylesObj.selectOptions.length-1"/>
            </div>
          </div>
          <div v-if="getComponentInfo.stylesObj.interactionSettingType===2">
            <filterable-input
                class="m-t-10"
                ref="filterableInput"
                placeholder="请选择字典"
                :showInfo="getComponentInfo.stylesObj.dictObj"
                :hasPagination="true"
                :dialogType="3"
                @selectRes="selectDict"
            ></filterable-input>
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
              <apiot-input
                  type="text"
                  :maxlength="16"
                  placeholder="输入参数字段"
                  :value="getComponentInfo.stylesObj.paramsFiled"
                  @input="(value) => changeStyles(value, 'paramsFiled')"
              />
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import { predefineColors } from '../../constants/global';

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
      predefineColors,
      updateKey: 1,
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)',
      checkedCities: [],
      updateChart: []
    };
  },

  components: {
    LocationProperties
  },

  computed: {
    getCheckedCities: {
      get() {
        return this.getComponentInfo.stylesObj.checkedTimes;
      },
      set(v) {
        this.changeStyles(v, 'checkedTimes');
      }
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
    selectDict(dict) {
      const { dictObj = {} } = this.getComponentInfo.stylesObj;
      if (dictObj && dict.id === dictObj.id) {
        return;
      }
      const options = dict.dictValue.map((item) => {
        item.value = +item.value;
        if (item[`${localStorage.apiotLanguage}`]) {
          item.label = item[`${localStorage.apiotLanguage}`] || item.zhCN;
        }
        return item;
      });
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      const stylesObj = info.stylesObj || {};
      const newInfo = {
        ...info,
        stylesObj: {
          ...stylesObj,
          dictObj: dict,
          dictOptions: options
        }
      };
      list.splice(i, 1, newInfo);
      this.$emit('updateList', list);
    },
    handleDel(index) {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      const tabConfigArr = info.stylesObj.selectOptions || [];
      const stylesObj = info.stylesObj || {};
      tabConfigArr.splice(index, 1);
      let { defaultCheckedTimeType: defaultShowTabInfo } = stylesObj;
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
      this.$emit('updateList', list);
    },
    handleAdd() {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj.selectOptions || [];
      const { stylesObj } = info;
      styleObj.push({
        label: '',
        value: ''
      });
      const newInfo = {
        ...info,
        stylesObj: {
          ...stylesObj,
          selectOptions: [...styleObj]
        }
      };
      list.splice(i, 1, newInfo);
      this.$nextTick(() => {
        this.$emit('updateList', list);
      });
    },
    changeTabConfig(value, key, item, index) {
      const list = [...this.getList];
      const i = this.reduceIndex();
      const info = this.getComponentInfo;
      const tabConfigArr = info.stylesObj.selectOptions || [];
      const stylesObj = info.stylesObj || {};
      tabConfigArr[index] = {
        ...item,
        [key]: value
      };
      let defaultShowTab = stylesObj.defaultCheckedTimeType;
      if (key === 'label') {
        const { defaultCheckedTimeType: defaultShowTabInfo } = stylesObj;
        const arr = defaultShowTabInfo.split('_');
        // eslint-disable-next-line no-shadow
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

.bgContentWrap {
  width: 100%;
  height: calc(100% - 46px);
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-y: auto;
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
}
</style>
