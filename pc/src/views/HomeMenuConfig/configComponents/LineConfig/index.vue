/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="propsSetting">
      <p class="setTitle">组件名称</p>
      <apiot-input
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
          @change="(value) => changeStyles(Number(value), 'zIndex')"
      />
    </div>
    <div class="propsSetting">
      <p class="setTitle">线条宽度</p>
      <c-slider
          @change="(value) => changeStyles(value, 'height')"
          v-model="getComponentInfo.stylesObj.height"
          :min="1"
      ></c-slider>
    </div>
    <div class="propsSetting">
      <p class="setTitle">不透明度</p>
      <c-slider
          @change="(value) => changeStyles(value, 'opacity')"
          v-model="getComponentInfo.stylesObj.opacity"
          :min="0"
          :max="100"
      ></c-slider>
    </div>
    <div class="propsSetting">
      <p class="setTitle">旋转角度</p>
      <c-slider
          @change="(value) => changeStyles(value, 'rotationAngle')"
          v-model="getComponentInfo.stylesObj.rotationAngle"
          :min="0"
          :max="360"
      ></c-slider>
    </div>
    <div class="propsSetting">
      <p class="setTitle">线条颜色</p>
      <c-color-picker
          style="margin-right: 10px;"
          size="small"
          v-model="getComponentInfo.stylesObj.color"
          show-alpha
          @change="(value) => changeStyles(value, 'color')"
          :predefine="predefineColors">
      </c-color-picker>
<!--      <c-color-picker-->
<!--          style="margin-right: 10px;"-->
<!--          size="small"-->
<!--          v-model="getComponentInfo.stylesObj.color1"-->
<!--          show-alpha-->
<!--          @change="(value) => changeStyles(value, 'color1')"-->
<!--          :predefine="predefineColors">-->
<!--      </c-color-picker>-->
    </div>
    <div class="propsSetting">
      <p class="setTitle">线类型</p>
      <div>
        <c-select
            :options="solidOptions"
            :value="getComponentInfo.stylesObj.lineStyleType"
            @change="(value) => changeStyles(value, 'lineStyleType')"
        ></c-select>
      </div>
    </div>
  </div>
</template>

<script>
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import { predefineColors } from '../../constants/global';

export default {
  props: {
    config: {
      type: Object,
      default: () => {
      }
    },
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
    }
  },
  data() {
    return {
      predefineColors,
      solidOptions: [
        {
          label: '实线',
          value: 'solid'
        }, {
          label: '虚线',
          value: 'dashed'
        }, {
          label: '点线',
          value: 'dotted'
        }
      ]
    };
  },

  components: {
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
  beforeMount() {
  },
  mounted() {
  },
  watch: {},
  methods: {
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
    }
  },
  name: 'LineConfig'
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

  ::v-deep {
    .el-collapse {
      border: none;
    }

    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      background-color: #131E45;
      color: #ffffff;
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
            @include leftTriangle(6px, 14px, $component-background-color,
                #7CD8FB, $component-borderFocus-color);
          }

          .right {
            @include rightTriangle(6px, 14px, $component-background-color, #7CD8FB,
                $component-borderFocus-color);
          }

          .top {
            @include topTriangle(14px, 6px, $component-background-color, #7CD8FB,
                $component-borderFocus-color);
          }

          .bottom {
            @include bottomTriangle(14px, 6px, $component-background-color,
                #7CD8FB, $component-borderFocus-color);
          }
        }

        .left {
          @include leftTriangle(6px, 14px, #131E45, #7CD8FB,
              $component-borderFocus-color);
        }

        .right {
          @include rightTriangle(6px, 14px, #131E45, #7CD8FB,
              $component-borderFocus-color);
        }

        .top {
          @include topTriangle(14px, 6px, #131E45, #7CD8FB,
              $component-borderFocus-color);
        }

        .bottom {
          @include bottomTriangle(14px, 6px, #131E45, #7CD8FB,
              $component-borderFocus-color);
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

    //.setTitle {
    //  font-size: 14px;
    //  font-family: PingFangSC-Regular, PingFang SC;
    //  font-weight: 400;
    //  color: #FFFFFF;
    //  line-height: 30px;
    //  text-align: left;
    //  opacity: .7;
    //}

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
      margin-top: 2px;
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
}
</style>
