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
    <TextStylesConfig
        title="字体样式"
        title1="字体颜色"
        :fontFamilyValue="getComponentInfo.stylesObj.FontFamily"
        :fontWeightValue="getComponentInfo.stylesObj.FontWeight"
        :fontSizeValue="getComponentInfo.stylesObj.FontSize"
        :colorValue="getComponentInfo.stylesObj.Color"
        @change="({value,key}) => changeStyles(value, key)"
    />
    <div class="propsSetting">
      <p class="setTitle">时间格式</p>
      <c-select
          :options="borderOptions"
          :value="getComponentInfo.stylesObj.showType"
          @change="(value) => changeStyles(value, 'showType')"
      ></c-select>
    </div>
  </div>
</template>

<script>
import TextStylesConfig from '../TextStylesConfig/index';

export default {
  props: {
    config: {
      type: Object,
      default: () => {}
    },
    activeComponent: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      borderOptions: [
        {
          label: '时分',
          value: 'HH:mm'
        }, {
          label: '时分秒',
          value: 'HH:mm:ss'
        }, {
          label: '年月日',
          value: 'YYYY-MM-DD'
        }, {
          label: '年月日时分秒',
          value: 'YYYY-MM-DD HH:mm:ss'
        }, {
          label: '日历时间',
          value: 'YYYY-MM-DD HH:mm:ss dddd'
        }
      ]
    };
  },

  components: {
    TextStylesConfig
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {return {};}
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      return Obj;
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  beforeMount() {
  },
  mounted() {
  },
  watch: {},
  methods: {
    changeScreenBgUrl(url) { // 修改背景图片
      this.changeStyles(url, 'backgroundImage');
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
          reject(file);
          return false
        }
        return resolve(file)
      })
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
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      let styleObj = info.stylesObj || {}
      if (key === 'Color' && !value) {value = '#fff';}
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
      if (!componentId) {return -1;}
      const index = this.getList.findIndex((item) => {
        return item.componentId === componentId
      });
      return index;
    }
  },
  name: 'ImageConfig'
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
    .rotateWrap{
      display: flex;
      align-items: center;
      justify-content: space-between;
      ::v-deep{
        .CInputWrap{
          width: 176px;
        }
      }
      .box{
        width: 32px;
        height: 32px;
        padding: 8px;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #2F437F;
        box-sizing: border-box;
        cursor: pointer;
        &:hover{
          background: $component-background-color;
          .left{
            @include leftTriangle(6px, 14px,$component-background-color, #7CD8FB, $component-borderFocus-color);
          }
          .right {
            @include rightTriangle(6px, 14px,$component-background-color, #7CD8FB, $component-borderFocus-color);
          }
          .top{
            @include topTriangle(14px, 6px,$component-background-color, #7CD8FB, $component-borderFocus-color);
          }
          .bottom{
            @include bottomTriangle(14px, 6px,$component-background-color, #7CD8FB, $component-borderFocus-color);
          }
        }
        .left{
          @include leftTriangle(6px, 14px,#131E45, #7CD8FB, $component-borderFocus-color);
        }
        .right {
          @include rightTriangle(6px, 14px,#131E45, #7CD8FB, $component-borderFocus-color);
        }
        .top{
          @include topTriangle(14px, 6px,#131E45, #7CD8FB, $component-borderFocus-color);
        }
        .bottom{
          @include bottomTriangle(14px, 6px,#131E45, #7CD8FB, $component-borderFocus-color);
        }
        &.active{
          background: #4689F5;
          .left{
            @include leftTriangle(6px, 14px,$component-borderFocus-color, #fff, #fff);
          }
          .right {
            @include rightTriangle(6px, 14px,$component-borderFocus-color, #fff, #fff);
          }
          .top{
            @include topTriangle(14px, 6px,$component-borderFocus-color, #fff, #fff);
          }
          .bottom{
            @include bottomTriangle(14px, 6px,$component-borderFocus-color, #fff, #fff);
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
