/**
* @name: 桑葚图
* @author: DELL
* @date: 2022/10/10 15:20
* @description：桑葚图
* @update: 2022/10/10 15:20
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
    <!--    <div class="propsSetting">-->
    <!--      <p class="setTitle">内容</p>-->
    <!--      <c-input-->
    <!--          type="text"-->
    <!--          :value="getComponentInfo.content" @Input-Change="(value) => changeTitle(value, 'content')"/>-->
    <!--    </div>-->
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <c-input
          type="number"
          :numberValue="getComponentInfo.stylesObj.zIndex"
          @Input-Change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item name="1" title="图形属性">
        <div>
          <div class="propsSetting">
            <p class="setTitle">背景颜色</p>
            <div>
              <c-color-picker
                  size="small"
                  v-model="getComponentInfo.stylesObj.backgroundColor"
                  show-alpha
                  @change="(value) => changeStyles(value, 'backgroundColor')"
                  :predefine="predefineColors">
              </c-color-picker>
            </div>
          </div>
          <div class="propsSetting">
            <span class="setTitle">左边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'left')"
                v-model="getComponentInfo.stylesObj.left"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">上边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'top')"
                v-model="getComponentInfo.stylesObj.top"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">右边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'right')"
                v-model="getComponentInfo.stylesObj.right"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">下边距(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'bottom')"
                v-model="getComponentInfo.stylesObj.bottom"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">宽度(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'width')"
                v-model="getComponentInfo.stylesObj.width"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">高度(%)</span>
            <c-slider
                @change="(value) => changeStyles(value, 'height')"
                v-model="getComponentInfo.stylesObj.height"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">矩形节点宽度</span>
            <c-slider
                @change="(value) => changeStyles(value, 'nodeWidth')"
                v-model="getComponentInfo.stylesObj.nodeWidth"
                :min="0"
                :max="100"
            ></c-slider>
          </div>
          <div class="propsSetting">
            <span class="setTitle">矩形节点间距</span>
            <c-slider
                @change="(value) => changeStyles(value, 'nodeGap')"
                v-model="getComponentInfo.stylesObj.nodeGap"
                :min="0"
                :max="100"
            ></c-slider>
          </div>

          <div class="propsSetting" style="margin-top: 10px;">
            <p class="setTitle">对齐方式</p>
            <div>
              <c-select
                  :options="showOptions"
                  :value="getComponentInfo.stylesObj.nodeAlign"
                  @change="(value) => changeStyles(value, 'nodeAlign')"
              ></c-select>
            </div>
          </div>
          <div class="propsSetting" style="margin-top: 10px;">
            <p class="setTitle">布局方向</p>
            <div>
              <c-select
                  :options="orientOptions"
                  :value="getComponentInfo.stylesObj.orient"
                  @change="(value) => changeStyles(value, 'orient')"
              ></c-select>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting" style="margin-bottom: 0;">
            <span class="setTitle">是否允许拖动</span>
            <el-switch
                :value="getComponentInfo.stylesObj.draggable"
                @change="(value) => changeStyles(value, 'draggable')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>

        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">层级配置</div>
          </div>
        </template>
        <div>
          <LevelConfig
              :value="getComponentInfo.levels"
              @change="(value) => changeTitle(value, 'levels')"/>
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <div class="bgSettingWrap">
            <div class="title">颜色配置</div>
          </div>
        </template>
        <div>
          <div class="ellipsisWrap propsSetting">
            <span class="setTitle">自定义颜色</span>
            <data-color
                :single="true"
                :value="getComponentInfo.stylesObj.colorArr"
                @change="(value) => changeStyles(value, 'colorArr')"
            ></data-color>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import LevelConfig from './levelConfig';
import {IsURL} from '@/utils/utils';
import {predefineColors} from '@/constants/global'


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
      enable: true,
      showOptions: [
        {
          label: '节点双端对齐',
          value: 'justify'
        }, {
          label: '节点左对齐',
          value: 'left'
        }, {
          label: '节点右对齐',
          value: 'right'
        }
      ],
      orientOptions: [
        {
          label: '水平',
          value: 'horizontal'
        }, {
          label: '垂直',
          value: 'vertical'
        }
      ],
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
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'right',
        icon: 'icon-youduiqi'
      }]
    };
  },

  components: {
    LevelConfig
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      return Obj;
    },
    getList() {
      return this.$store.getters.list;
    }
  },

  mounted() {
  },
  watch: {
    // getComponentInfo: {
    //   deep: true,
    //   handler(val, oldVal) { // 普通的watch监听
    //     console.log("a: " + val, oldVal);
    //   },
    // }
  },
  methods: {
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {};
      if (key === 'shadowColor' && !value) {
        value = '';
      }
      if (['color1', 'color2'].includes(key) && !value) {
        value = '#fff';
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
    changeScreenBgUrl(url) { // 修改背景图片
      const getBgConfig = this.getBgConfig;
      this.$store.dispatch('config/setBgConfig', {
        ...getBgConfig,
        bgImage: url
      });
    },
    checkIsRight(value, key) {
      if (key === 'url' && value) {
        if (!IsURL(value)) {
          this.$message.error('请输入正确的url地址!');
          return;
        }
      }
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

}
</style>
