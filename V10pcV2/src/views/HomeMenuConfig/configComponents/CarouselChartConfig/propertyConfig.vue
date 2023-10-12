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
      <el-collapse-item name="1" title="全局属性">
        <div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否自动轮播</span>
            <el-switch
                :value="getComponentInfo.stylesObj.autoplay"
                @change="(value) => changeStyles(value, 'autoplay')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.stylesObj.autoplay">
            <p class="setTitle">轮播间隔(秒)</p>
            <div>
              <el-input-number
                  controls-position="right"
                  :value="getComponentInfo.stylesObj.interval"
                  :min="1"
                  :step="1"
                  @change="(value) => changeStyles(Number(value), 'interval')"/>
            </div>
          </div>

          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">是否允许循环</span>
            <el-switch
                :value="getComponentInfo.stylesObj.loop"
                @change="(value) => changeStyles(value, 'loop')"
                active-color="#4689F5"
                inactive-color="#DCDFE6">
            </el-switch>
          </div>

          <div class="propsSetting" style="margin-top: 10px;">
            <p class="setTitle">轮播方向</p>
            <div>
              <c-select
                  :options="showOptions"
                  :value="getComponentInfo.stylesObj.direction"
                  @change="(value) => changeStyles(value, 'direction')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">轮播类型</p>
            <div>
              <c-select
                  :options="typeOptions"
                  :value="getComponentInfo.stylesObj.type"
                  @change="(value) => changeStyles(value, 'type')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">指示器位置</p>
            <div>
              <c-select
                  :options="getLastPsOptions"
                  :value="getComponentInfo.stylesObj.indicatorPosition"
                  @change="(value) => changeStyles(value, 'indicatorPosition')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">指示器类型</p>
            <div>
              <c-select
                  :options="indicatorTypeOptions"
                  :value="getComponentInfo.stylesObj.indicatorType"
                  @change="(value) => changeStyles(value, 'indicatorType')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting">
            <p class="setTitle">切换器显示</p>
            <div>
              <c-select
                  :options="arrowOptions"
                  :value="getComponentInfo.stylesObj.arrow"
                  @change="(value) => changeStyles(value, 'arrow')"
              ></c-select>
            </div>
          </div>

        </div>
      </el-collapse-item>
      <el-collapse-item name="2" title="轮播图片设置" v-if="getComponentInfo.dataType === 1">
        <draggable
            v-model="getComponentInfo.imgArr"
            group="menu"
            animation="300"
            handle=".icon-zongxiangtuodong"
        >
          <transition-group class="menu__father" tag="ul">
            <li
                class="rotateImg__body--li"
                v-for="(item, index) in getComponentInfo.imgArr"
                :key="item.parperId"
            >
              <div class="rotateImg__body--liHead">
                <i class="iconfont icon-zongxiangtuodong m-r-10"></i>
                <h2 class="rotateImg__body--head">轮播图{{ index + 1 }}</h2>
                <i class="iconfont icon-guanbi" @click="deleteImg(index)"></i>
              </div>
              <app-upload
                  :fileUrl.sync="item.imgUrl"
                  fileAccept=".png, .jpg,.jpeg, .gif,.svg"
                  :uploadType="2"
                  :isPc="true"
              ></app-upload>
              <div class="config__body--tip">建议：png、jpg格式，3M以内</div>
              <h2 class="rotateImg__body--head">导航链接</h2>
              <apiot-input
                  v-model="item.targetUrl"
                  placeholder="请输入跳转地址"
              ></apiot-input>
            </li>
          </transition-group>
        </draggable>
        <apiot-button
            class="rotateImg__body--addBtn"
            v-if="getComponentInfo.imgArr.length < 5"
            @click="addImg"
        >
          <i class="iconfont icon-xinzeng m-r-4"></i>添加轮播图({{
            getComponentInfo.imgArr.length
          }}/5)
        </apiot-button>
      </el-collapse-item>
      <el-collapse-item title="交互配置" name="3" v-if="getComponentInfo.dataType === 3">
        <div>
          <el-radio-group
              class="radioGroup"
              size="mini"
              v-model="getComponentInfo.interactionType"
              @change="(value) => changeTitle(value, 'interactionType')"
          >
            <el-radio-button :label="1">无</el-radio-button>
            <el-radio-button :label="2">弹出面板</el-radio-button>
            <el-radio-button :label="3">跳转菜单</el-radio-button>
<!--            <el-radio-button :label="4">外部地址</el-radio-button>-->
          </el-radio-group>
        </div>
        <div class="btnWrap">
          <apiot-button
              class="panelBtn"
              v-if="getComponentInfo.interactionType === 2"
              @click="visible=true"
          >
            <i class="iconfont icon-shezhi m-r-4"></i>弹出面板配置
          </apiot-button>
          <apiot-button
              class="panelBtn"
              v-if="getComponentInfo.interactionType === 3"
              @click="showMenuConfig=true"
          >
            <i class="iconfont icon-shezhi m-r-4"></i>跳转菜单配置
          </apiot-button>
          <apiot-input
              v-if="getComponentInfo.interactionType === 4"
              v-model="getComponentInfo.stylesObj.externalUrl"
              @change="(value) => changeStyles(value, 'externalUrl')"
          ></apiot-input>
        </div>
      </el-collapse-item>
    </el-collapse>
    <PanelConfig
        :visible.sync="visible"
        :tabPaneConfig="tabPaneConfig"
        :activeObj="activeObj"
        :isSelPanel="false"
        :showType="showType"
        :otherParams="{ panelType: 5,
                 unDesign: 1,
                 panelClassify: 1,
                 clientType: getClientType
                 }"
        @cancle-click="handleCancel"
        :isCustomPage="true"
        :treeType="5"
        ref="panelConfig"
    ></PanelConfig>
    <ToMenuConfig
        ref="ToMenuConfig"
        @cancle-click="handleMenuCancel"
        class="ToMenuConfig"
        :visible.sync="showMenuConfig"
        :activeObj="skipMenuConfig"
        :sourceType="1"
        :treeType="5"
        :showType="showType"
        :showContent="true"
        :clientType="getClientType"
    ></ToMenuConfig>
  </div>
</template>

<script>
import PanelConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/PanelConfig';
import ToMenuConfig from '@/views/MenuManage/MenuConfig/components/PageConfig/components/compProperty/ContentConfig/ToMenuConfig';
import AppUpload from '@/views/AppConfig/components/Config/AppUpload';
import { createUnique } from '@/utils/utils';
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
  components: {
    AppUpload,
    LocationProperties,
    PanelConfig,
    ToMenuConfig
  },

  data() {
    return {
      enable: true,
      psOptions: [
        {
          label: '不显示',
          value: 'none'
        },
        {
          label: '内部',
          value: ''
        }, {
          label: '外部',
          value: 'outside'
        }
      ],
      arrowOptions: [
        {
          label: '悬浮显示',
          value: 'hover'
        },
        {
          label: '一直显示',
          value: 'always'
        }, {
          label: '不显示',
          value: 'never'
        }
      ],
      indicatorTypeOptions: [
        {
          label: '线条展示',
          value: 1
        }, {
          label: '圆点展示',
          value: 2
        }, {
          label: '数字展示',
          value: 3
        }
      ],
      typeOptions: [
        {
          label: '卡片',
          value: 'card'
        }, {
          label: '常规',
          value: ''
        }
      ],
      showOptions: [
        {
          label: '水平方向',
          value: 'horizontal'
        }, {
          label: '垂直方向',
          value: 'vertical'
        }
      ],
      activeName: '',
      color1: '#ffffff',
      color2: '#ffffff',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors,
      activeObj: { dialogTitle: '', dialogName: 'PanelDialog' },
      skipMenuConfig: [], // 跳菜单
      showType: [1, 5],
      showMenuConfig: false,
      visible: false,
    };
  },

  computed: {
    getLastPsOptions() {
      const { direction } = this.getComponentInfo.stylesObj;
      if (direction === 'vertical') {
        return [
          {
            label: '不显示',
            value: 'none'
          },
          {
            label: '内部',
            value: ''
          }
        ];
      }
      return this.psOptions;
    },
    getClientType() {
      const { clientType } = sessionStorage;
      return +clientType;
    },
    tabPaneConfig() {
      const { panelConfig } = this.getComponentInfo;
      const { curPaneObj } = panelConfig || {};
      return curPaneObj || {};
    },
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
    const { panelConfig, skipMenuConfig } = this.getComponentInfo;
    const initObj = { dialogTitle: '', dialogName: 'PanelDialog' };
    this.activeObj = panelConfig ? panelConfig.activeObj || initObj : initObj;
    this.skipMenuConfig = skipMenuConfig || [];
  },
  watch: {
  },
  methods: {
    handleMenuCancel() {
      const { menuList = [] } = this.$refs.ToMenuConfig;
      this.changeTitle(menuList, 'skipMenuConfig');
    },
    handleCancel() {
      const { curPaneObj, activeObj } = this.$refs.panelConfig;
      const value = {
        curPaneObj,
        activeObj
      };
      this.changeTitle(value, 'panelConfig');
    },
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj || {};
      let obj = {};
      if (key === 'direction' && value === 'vertical') {
        obj = { indicatorPosition: '' };
      }
      const newInfo = {
        ...info,
        stylesObj: {
          ...styleObj,
          [key]: value,
          ...obj
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
    },
    addImg() {
      this.activeComponent.imgArr.push({
        parperId: createUnique(),
        imgUrl: '',
        targetUrl: ''
      });
    },
    deleteImg(index) {
      this.activeComponent.imgArr.splice(index, 1);
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
  .config__body--tip {
    height: 32px;
    font-size: 13px;
    line-height: 32px;
    opacity: 0.7;
  }
  .rotateImg {
    &__body {
      &--li {
        height: 238px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          background: #fafafa;
        }
      }
      &--head {
        height: 32px;
        font-size: 13px;
        line-height: 32px;
        font-weight: 600;
        color: #333333;
      }
      &--liHead {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
        .config__body--head {
          margin: 0;
          line-height: 18px;
          margin-left: 10px;
        }
        .iconfont {
          font-size: 16px;
          cursor: pointer;
          color: #aaaaaa;
          &:hover {
            color: $--color-primary;
          }
        }
        .icon-guanbi {
          margin-left: auto;
        }
      }
      &--addBtn {
        margin-top: 20px;
        width: 100%;
        i {
          color: $--color-primary;
        }
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
  ::v-deep {
    .action__term--liChild {
      width: 100px;
    }
    .dataTransfer__item--comp5 {
      width: 100px;
    }
  }
  .ToMenuConfig {
    ::v-deep{
      .ToMenuConfig__li--select{
        width: 200px;
      }
      .el-collapse-item__arrow{
        margin: 0 8px 0 auto;
      }
      .el-collapse-item__header {
        position: relative;
        background: #f1f7ff;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        height: 38px;
        line-height: 38px;
      }
      .el-collapse-item__content {
        padding: 0 0 8px 0;
        background-color: #fff;
      }
    }
  }
}
</style>
