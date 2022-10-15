/**
* @name: index
* @author: DELL
* @date: 2022/8/31 11:22
* @description：index
* @update: 2022/8/31 11:22
*/
<!-- 页面 -->
<template>
  <div class="bgContentWrap">
    <div class="propsSetting">
      <p class="setTitle">组件名称</p>
      <apiot-input
          :value="config.name"
          @input="(value) => changeTitle(value, 'name')"
      />
    </div>
    <location-properties
        :widthValue="config.width"
        :heightValue="config.height"
        :leftValue="config.left"
        :topValue="config.top"
        @changeTitle="({ value, key }) => changeTitle(value, key)"
    ></location-properties>
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <el-input-number
          controls-position="right"
          :value="config.stylesObj.zIndex"
          @change="(value) => changeStyles(Number(value), 'zIndex')"
      />
    </div>
    <div class="propsSetting">
      <p class="setTitle">数据展示类型</p>
      <div>
        <c-select
            :options="positionOptions"
            :value="config.stylesObj.dataShowType"
            @change="(value) => changeStyles(value, 'dataShowType')"
        ></c-select>
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">动画设置</p>
      <div>
        <c-select
            :options="aniOptions"
            :value="config.stylesObj.animationSet"
            @change="(value) => changeStyles(value, 'animationSet')"
        ></c-select>
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">公告分组高度设置</p>
      <el-input-number
          controls-position="right"
          :value="config.stylesObj.titleHeight"
          @change="(value) => changeStyles(Number(value), 'titleHeight')"
      />
    </div>
    <TextStylesConfig
        title="公告分组名称样式设置"
        title1="名称颜色"
        :isNeed="false"
        :fontFamilyValue="config.stylesObj.titleFontFamily"
        :fontWeightValue="config.stylesObj.titleFontWeight"
        :fontSizeValue="config.stylesObj.titleFontSize"
        :colorValue="config.stylesObj.titleColor"
        @change="({value,key}) => changeStyles(value, `title${key}`)"
    />
    <div class="propsSetting">
      <p class="setTitle">单行信息高度设置</p>
      <el-input-number
          controls-position="right"
          :value="config.stylesObj.colHeight"
          @change="(value) => changeStyles(Number(value), 'colHeight')"
      />
    </div>
    <TextStylesConfig
        title="公告信息样式设置"
        title1="字体颜色"
        :fontFamilyValue="config.stylesObj.contentFontFamily"
        :fontWeightValue="config.stylesObj.contentFontWeight"
        :fontSizeValue="config.stylesObj.contentFontSize"
        :colorValue="config.stylesObj.contentColor"
        @change="({value,key}) => changeStyles(value, `content${key}`)"
    />
  </div>
</template>

<script>
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import TextStylesConfig from '../../Layout/TextStylesConfig/index';

export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    activeComponent: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      positionOptions: [
        {
          label: '全部',
          value: 1
        }, {
          label: '分组',
          value: 2
        }
      ],
      aniOptions: [
        {
          label: '不轮播',
          value: 1
        },
        {
          label: '轮播',
          value: 2
        },
      ]
    };
  },

  components: {
    LocationProperties,
    TextStylesConfig
  },

  computed: {
    config() {
      // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) {
        return {};
      }
      return this.list.find((item) => item.componentId === componentId) || {};
    }
  },

  mounted() {
    console.log(111111);
  },

  methods: {
    changeTitle(value, key) {
      // 设置组件名称
      const list = [...this.list];
      const index = this.reduceIndex();
      const info = this.config;
      const newInfo = {
        ...info,
        [key]: value
      };
      list.splice(index, 1, newInfo);
      this.$emit('updateList', list);
    },
    changeStyles(value, key) {
      // 样式修改
      const list = [...this.list];
      const index = this.reduceIndex();
      const info = this.config;
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
      const index = this.list.findIndex((item) => item.componentId === componentId);
      return index;
    }
  },
  name: 'NoticeConfig',
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
    .el-collapse {
      border: none;
    }

    .el-collapse-item__header {
      height: 30px;
      line-height: 30px;
      background-color: #131e45;
      color: #ffffff;
      border-bottom: none;

      &:hover {
        color: #4689f5;
      }
    }

    .el-collapse-item__content {
      padding: 10px 0;
      background-color: #131e45;

      & .propsSetting:last-child {
        margin-bottom: 10px;
      }
    }

    .el-collapse-item__wrap {
      background-color: #131e45;
      border: none;
    }
    .el-input-number.is-controls-right {
      width: 100%;
      line-height: 32px;
    }
    .el-input-number.is-controls-right .el-input__inner {
      text-align: left;
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      width: 21px;
      height: 15px;
      background: #ffffff;
      line-height: 15px;
    }
    .el-input-number__increase {
      top: 1px;
    }
    .el-input-number__decrease {
      top: 16px;
    }
    .el-select {
      width: 100%;
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
        .el-input-number.is-controls-right {
          width: 155px;
        }
      }
      .box {
        width: 32px;
        height: 32px;
        padding: 8px;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #e9e9e9;
        border-radius: 4px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          border: 1px solid #4689f5;
          .left {
            @include leftTriangle(6px, 14px, #fff, #7cd8fb, #4689f5);
          }
          .right {
            @include rightTriangle(6px, 14px, #fff, #7cd8fb, #4689f5);
          }
          .top {
            @include topTriangle(14px, 6px, #fff, #7cd8fb, #4689f5);
          }
          .bottom {
            @include bottomTriangle(14px, 6px, #fff, #7cd8fb, #4689f5);
          }
        }
        .left {
          @include leftTriangle(6px, 14px, #fff, #7cd8fb, #4689f5);
        }
        .right {
          @include rightTriangle(6px, 14px, #fff, #7cd8fb, #4689f5);
        }
        .top {
          @include topTriangle(14px, 6px, #fff, #7cd8fb, #4689f5);
        }
        .bottom {
          @include bottomTriangle(14px, 6px, #fff, #7cd8fb, #4689f5);
        }
        &.active {
          background: #4689f5;
          .left {
            @include leftTriangle(6px, 14px, #4689f5, #fff, #fff);
          }
          .right {
            @include rightTriangle(6px, 14px, #4689f5, #fff, #fff);
          }
          .top {
            @include topTriangle(14px, 6px, #4689f5, #fff, #fff);
          }
          .bottom {
            @include bottomTriangle(14px, 6px, #4689f5, #fff, #fff);
          }
        }
      }
    }

    .setTitle {
      height: 30px;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      line-height: 30px;
      color: #333333;
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

              .el-input-number__decrease,
              .el-input-number__increase {
                width: 20px;
              }
            }
          }
        }
      }
    }

    .wrap {
      display: flex;
      min-height: 90px;
      margin-top: 2px;
      text-align: left;
      align-items: center;
      line-height: 35px;

      & > span {
        margin-right: 10px;
        color: #ffffff;
        font-size: 13px;
      }
    }
    .flex {
      display: flex;
    }
  }
}
</style>
