/**
* @name: index
* @author: DELL
* @date: 2021/8/26 19:15
* @description：index
* @update: 2021/8/26 19:15
*/
<!-- 页面 -->
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="propsSetting">
      <p class="setTitle">组件名称</p>
      <c-input
          type="text"
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
      <el-collapse-item name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">基础配置</div>
          </div>
        </template>
        <div>
          <el-collapse v-model="activeNames1" accordion>
            <div class="propsSetting">
              <p class="setTitle">内容</p>
              <c-input
                  type="text"
                  :maxlength="16"
                  :value="getComponentInfo.stylesObj.content"
                  @Input-Change="(value) => changeStyles(value, 'content')"/>
            </div>
            <el-collapse-item title="常态设置" name="4">
              <div class="propsSetting">
                <p class="setTitle">字体大小</p>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.normalFSize"
                    @Input-Change="(value) => changeStyles(value, 'normalFSize')"/>
              </div>
              <div class="propsSetting">
                <p class="setTitle">字体颜色</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.normalColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'normalColor')"
                    :predefine="predefineColors"
                    :colorValue="getComponentInfo.stylesObj.normalColor"
                >
                </c-color-picker>
              </div>
              <div class="propsSetting">
                <p class="setTitle">倒角</p>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.normalBorderRadius"
                    @Input-Change="(value) => changeStyles(value, 'normalBorderRadius')"/>
              </div>
              <div class="propsSetting">
                <p class="setTitle">边框</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.normalBColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'normalBColor')"
                    :predefine="predefineColors"
                    :colorValue="getComponentInfo.stylesObj.normalBColor"
                >
                </c-color-picker>
                <div class="borderWrap">
                  <c-input
                      type="number"
                      :min="0"
                      :numberValue="Number(getComponentInfo.stylesObj.normalBWidth)"
                      @Input-Change="(value) => changeStyles(value, 'normalBWidth')"/>
                  <c-select
                      :options="borderOptions"
                      :value="getComponentInfo.stylesObj.normalBStyle"
                      @change="(value) => changeStyles(value, 'normalBStyle')"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">背景颜色</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.normalBgColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'normalBgColor')"
                    :predefine="predefineColors"
                    :colorValue="getComponentInfo.stylesObj.normalBgColor"
                >
                </c-color-picker>
              </div>
            </el-collapse-item>
            <el-collapse-item title="悬浮设置" name="5">
              <div class="propsSetting">
                <p class="setTitle">字体大小</p>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.activeFSize"
                    @Input-Change="(value) => changeStyles(value, 'activeFSize')"/>
              </div>
              <div class="propsSetting">
                <p class="setTitle">字体颜色</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.activeColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'activeColor')"
                    :predefine="predefineColors"
                    :colorValue="getComponentInfo.stylesObj.activeColor"
                >
                </c-color-picker>
              </div>
              <div class="propsSetting">
                <p class="setTitle">倒角</p>
                <c-input
                    type="number"
                    :min="0"
                    :numberValue="getComponentInfo.stylesObj.activeBorderRadius"
                    @Input-Change="(value) => changeStyles(value, 'activeBorderRadius')"/>
              </div>
              <div class="propsSetting">
                <p class="setTitle">边框</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.activeBColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'activeBColor')"
                    :predefine="predefineColors"
                    :colorValue="getComponentInfo.stylesObj.activeBColor"
                >
                </c-color-picker>
                <div class="borderWrap">
                  <c-input
                      type="number"
                      :numberValue="Number(getComponentInfo.stylesObj.activeBWidth)"
                      @Input-Change="(value) => changeStyles(value, 'activeBWidth')"/>
                  <c-select
                      :options="borderOptions"
                      :value="getComponentInfo.stylesObj.activeBStyle"
                      @change="(value) => changeStyles(value, 'activeBStyle')"
                  ></c-select>
                </div>
              </div>
              <div class="propsSetting">
                <p class="setTitle">背景颜色</p>
                <c-color-picker
                    style="margin-right: 10px;"
                    size="small"
                    v-model="getComponentInfo.stylesObj.activeBgColor"
                    show-alpha
                    @change="(value) => changeStyles(value, 'activeBgColor')"
                    :predefine="predefineColors"
                    :colorValue="getComponentInfo.stylesObj.activeBgColor"
                >
                </c-color-picker>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-collapse-item>
      <el-collapse-item title="数据导出配置" name="3">
        <el-tabs
            v-model="active"
            :editable="true"
            type="card"
            closable
            @tab-add="addTab"
            @tab-remove="removeTab"
        >
          <el-tab-pane
              v-for="(item, i) in getComponentInfo.config"
              :key="`a_${i}`"
              :label="`sheet${item.index+1}`"
              :name="`a_${i}`"
              lazy
          >
            <div>
              <div class="propsSetting">
                <p class="setTitle">sheet名称</p>
                <c-input
                    type="text"
                    :maxlength="16"
                    :value="item.sheetName"
                    @Input-Change="(value) => changeConfigs(value, 'sheetName', i)"/>
              </div>
              <div class="propsSetting">
                <p class="setTitle">sheet数据展示类型</p>
                <c-select
                    :options="sheetType"
                    :value="item.type"
                    @change="(value) => changeConfigs(value, 'type',  i)"
                ></c-select>
              </div>
              <div class="propsSetting" v-if="item.type===1">
                <p class="setTitle">图片组件</p>
                <c-select
                    :options="picOptions"
                    :value="item.picValue"
                    filterable
                    @change="(value) => changeConfigs(value, 'picValue',  i)"
                ></c-select>
              </div>
              <div class="propsSetting" v-if="item.type===1">
                <p class="setTitle">列表数据源</p>
                <c-select
                    :options="dataOptions"
                    :value="item.dataValue"
                    filterable
                    @change="(value) => changeConfigs(value, 'dataValue',  i)"
                ></c-select>
              </div>
              <c-button
                  @click="addSummary(item, 'summaryList', i)"
                  class="btnAdd"
                  v-if="item.type===2"
              >
                <span class="iconfont icon-xinzeng"></span>新增组件
              </c-button>
              <div v-if="item.type===2">
                <div
                    v-for="(summary, index) in item.summaryList"
                    :key="index"
                    class="summary"
                >
                  <div class="summaryTitle">
                    <span>组件{{ index + 1 }}</span>
                    <span @click="delSummary(item, 'summaryList', index, i)" class="icon-shanchu1 iconfont"></span>
                  </div>
                  <div class="summaryBox">
                    <c-select
                        :options="summaryOptions(item.summaryList)"
                        :value="summary.value"
                        filterable
                        placeholder="请选择组件"
                        @change="changeSummary($event, item, 'value', 'summaryList',  index)"
                    ></c-select>
                  </div>
                  <div class="summaryBox">
                    <c-input
                        type="text"
                        @Input-Change="changeSummary($event, item, 'name', 'summaryList',  index, i)"
                        :value="summary.name"/>
                  </div>
                  <c-divider
                      v-if="item.summaryList.length !== 1 && i !== item.summaryList.length-1"
                      type="dashed"/>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import {allowExportPictures, allowExportData, allowExportsummaryData} from '@/constants/global';

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
      active: '',
      activeNames1: '',
      borderOptions: [
        {
          label: '实线',
          value: 'solid'
        }, {
          label: '虚线',
          value: 'dashed'
        }
      ],
      sheetType: [
        {
          label: '图片 + 列表',
          value: 1
        }, {
          label: '汇总列表',
          value: 2
        }
      ],
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ]
    };
  },

  components: {},

  computed: {
    summaryOptions() {
      return function () {
        const arr = this.getList.filter(item => {
          const {componentName} = item;
          return allowExportsummaryData.includes(componentName);
        });
        return arr.map((item) => ({...item, value: item.componentId, label: item.name}));
      }
    },
    dataOptions() {
      const arr = this.getList.filter(item => {
        const {componentName} = item;
        return allowExportData.includes(componentName);
      })
      return arr.map((item) => ({...item, value: item.componentId, label: item.name}));
    },
    picOptions() {
      const arr = this.getList.filter(item => {
        const {componentName} = item;
        return allowExportPictures.includes(componentName);
      })
      return arr.map((item) => ({...item, value: item.componentId, label: item.name}));
    },
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      // eslint-disable-next-line no-undef
      return Obj;
    },
    getList() {
      return this.$store.getters.list;
    }
  },

  mounted() {
  },

  methods: {
    changeScreenBgUrl(url) { // 修改背景图片
      this.changeStyles(url, 'backgroundImage');
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 100;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG, PNG, JPEG  格式!');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          reject(file);
          return false
        }
        return resolve(file)
      })
    },
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
      if ((key === 'color1' || key === 'color2') && !value) {
        value = null;
      }
      if (key === 'borderColor' && !value) {
        value = 'rgba(255,255,255,0)';
      }
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
    },
    changeConfigs(v, k, i) {
      const list = this.getComponentInfo.config || [];
      const obj = list[i];
      const newObj = {
        ...obj,
        [k]: v
      }
      list[i] = newObj;
      this.changeTitle(list, 'config');
    },
    addSummary(item, key, i) {
      item.summaryList.push({
        name: '',
        value: ''
      })
      this.changeConfigs(item.summaryList, key, i);
    },
    delSummary(item, key, i, i1) {
      item.summaryList.splice(i, 1);
      this.changeConfigs(item.summaryList, key, i1);
    },
    changeSummary(v, item, key, subKey,  index, i) {
      const obj = item.summaryList[index];
      const newObj = {
        ...obj,
        [key]: v
      }
      item.summaryList[index] = newObj;
      this.changeConfigs(item.summaryList, subKey, i);
    },
    addTab() {
      const n = this.getComponentInfo.config.length;
      this.getComponentInfo.config.push({
        index: n,
        sheetName: `sheet${n + 1}`,
        type: 1,
        picValue: '',
        dataValue: '',
        summaryList: []
      })
      this.active = `a_${this.getComponentInfo.config.length - 1}`;
    },
    removeTab(name) {
      const i = +name.split('_')[1];
      this.getComponentInfo.config.splice(i, 1);
      this.active = `a_${this.getComponentInfo.config.length - 1}`;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.bgContentWrap {
  width: 100%;
  height: calc(100% - 46px);
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-y: auto;

  ::v-deep {
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
      border: none;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border: none;
    }

    .el-tabs--card > .el-tabs__header {
      border: none;
    }

    .el-tabs__item {
      padding: 0 10px;
      color: #FFFFFF;
      opacity: .7;
    }

    .el-tabs__item.is-active {
      color: #4689F5;
      opacity: 1;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active.is-closable {
      padding-left: 15px;
      padding-right: 15px;
    }

    .el-tabs--bottom .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--bottom .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--bottom.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--left > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top .el-tabs--right > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--border-card > .el-tabs__header .el-tabs__item:nth-child(2), .el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2) {
      padding-left: 15px;
    }

    .el-tabs__nav-next, .el-tabs__nav-prev {
      line-height: 40px;
      color: #FFFFFF;

      &:hover {
        color: #4689F5;
      }
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
      color: #4689F5;
      opacity: 1;
    }

    .el-tabs__item .el-icon-close:hover {
      background: none;
      color: #4689F5;
    }

    .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
      top: -2px;
      right: 3px;
    }

    .el-tabs__new-tab {
      border: none;
      outline: none;
    }

    .el-tabs__header {
      margin: 0;
    }

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
          width: calc(100% / 2);

          &.is-active {
            .el-radio-button__inner {
              background: $component-borderFocus-color !important;
              border-color: $component-borderFocus-color !important;
            }
          }

          .el-radio-button__inner {
            width: 100%;
            padding: 8px 15px;
            border-radius: 0;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
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

    .rotateWrap {
      display: flex;
      align-items: center;
      justify-content: space-between;

      ::v-deep {
        .CInputWrap {
          width: 176px;
        }
      }

      .box {
        width: 32px;
        height: 32px;
        padding: 8px;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #2F437F;
        box-sizing: border-box;
        cursor: pointer;

        &:hover {
          background: $component-background-color;

          .left {
            @include leftTriangle(6px, 14px, $component-background-color, #7CD8FB, $component-borderFocus-color);
          }

          .right {
            @include rightTriangle(6px, 14px, $component-background-color, #7CD8FB, $component-borderFocus-color);
          }

          .top {
            @include topTriangle(14px, 6px, $component-background-color, #7CD8FB, $component-borderFocus-color);
          }

          .bottom {
            @include bottomTriangle(14px, 6px, $component-background-color, #7CD8FB, $component-borderFocus-color);
          }
        }

        .left {
          @include leftTriangle(6px, 14px, #131E45, #7CD8FB, $component-borderFocus-color);
        }

        .right {
          @include rightTriangle(6px, 14px, #131E45, #7CD8FB, $component-borderFocus-color);
        }

        .top {
          @include topTriangle(14px, 6px, #131E45, #7CD8FB, $component-borderFocus-color);
        }

        .bottom {
          @include bottomTriangle(14px, 6px, #131E45, #7CD8FB, $component-borderFocus-color);
        }

        &.active {
          background: #4689F5;

          .left {
            @include leftTriangle(6px, 14px, $component-borderFocus-color, #fff, #fff);
          }

          .right {
            @include rightTriangle(6px, 14px, $component-borderFocus-color, #fff, #fff);
          }

          .top {
            @include topTriangle(14px, 6px, $component-borderFocus-color, #fff, #fff);
          }

          .bottom {
            @include bottomTriangle(14px, 6px, $component-borderFocus-color, #fff, #fff);
          }
        }
      }
    }

    .setTitle {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
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

  .btnAdd {
    width: 100%;
    height: 32px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 30px;
    box-sizing: border-box;
    text-align: center;

    .icon-xinzeng {
      margin-right: 5px;
      color: #4689F5;
      vertical-align: bottom;
    }
  }

  .summary {
    margin-top: 10px;

    .summaryTitle {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      opacity: 0.69;

      .icon-shanchu1 {
        cursor: pointer;
      }
      .icon-shanchu1:hover{
        color: #4689F5;
      }
    }
    .summaryBox{
      margin-bottom: 10px;
    }
  }
}
</style>
