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
          :numberValue="getComponentInfo.stylesObj.zIndex" @Input-Change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <div class="propsSetting">
      <p class="setTitle">内容</p>
      <c-input
          type="text"
          :maxlength="16"
          :value="getComponentInfo.stylesObj.content" @Input-Change="(value) => changeStyles(value, 'content')"/>
    </div>
    <div class="propsSetting">
      <p class="setTitle">字体大小</p>
      <c-input
          type="number"
          :min="0"
          :numberValue="getComponentInfo.stylesObj.fontSize"
          @Input-Change="(value) => changeStyles(value, 'fontSize')"/>
    </div>
    <div class="propsSetting">
      <p class="setTitle">字体颜色</p>
      <c-color-picker
          style="margin-right: 10px;"
          size="small"
          v-model="getComponentInfo.stylesObj.color"
          show-alpha
          @change="(value) => changeStyles(value, 'color')"
          :predefine="predefineColors"
          :colorValue="getComponentInfo.stylesObj.color"
      >
      </c-color-picker>
    </div>

    <div class="propsSetting">
      <p class="setTitle">倒角</p>
      <c-input
          type="number"
          :min="0"
          :numberValue="getComponentInfo.stylesObj.borderRadius"
          @Input-Change="(value) => changeStyles(value, 'borderRadius')"/>
    </div>
    <div class="propsSetting">
      <p class="setTitle">边框</p>
      <c-color-picker
          style="margin-right: 10px;"
          size="small"
          v-model="getComponentInfo.stylesObj.borderColor"
          show-alpha
          @change="(value) => changeStyles(value, 'borderColor')"
          :predefine="predefineColors"
          :colorValue="getComponentInfo.stylesObj.borderColor"
      >
      </c-color-picker>
      <div class="borderWrap">
        <c-input
            type="number"
            :numberValue="Number(getComponentInfo.stylesObj.borderWidth)"
            @Input-Change="(value) => changeStyles(value, 'borderWidth')"/>
        <c-select
            :options="borderOptions"
            :value="getComponentInfo.stylesObj.borderStyle"
            @change="(value) => changeStyles(value, 'borderStyle')"
        ></c-select>
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">背景颜色</p>
      <c-color-picker
          style="margin-right: 10px;"
          size="small"
          v-model="getComponentInfo.stylesObj.bgColor"
          show-alpha
          @change="(value) => changeStyles(value, 'bgColor')"
          :predefine="predefineColors"
          :colorValue="getComponentInfo.stylesObj.bgColor"
      >
      </c-color-picker>
    </div>
    <div class="propsSetting"
         style="margin-bottom: 30px;"
    >
      <p class="setTitle">背景图片</p>
      <div class="wrap">
        <c-upload
            :before-upload="beforeAvatarUpload"
            @changeScreenBg="changeScreenBgUrl"
            accept=".png,.jpg,.jpeg"
            :url="getComponentInfo.stylesObj.backgroundImage"
        >
          <template v-slot:tip>
            <div class="el-upload__tip">只能上传png,jpg,jpeg图片，且不超过500kb</div>
          </template>
        </c-upload>
      </div>
    </div>
  </div>
</template>

<script>
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
      borderOptions: [
        {
          label: '实线',
          value: 'solid'
        }, {
          label: '虚线',
          value: 'dashed'
        }
      ],
      boldTypeOptions: [
        {
          label: '正常',
          value: 'normal'
        }, {
          label: '加粗',
          value: 'bold'
        }
      ],
      colorTypeOptions: [
        {
          label: '左右渐变',
          value: 1
        }, {
          label: '上下渐变',
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
      ],
      options: [{
        label: '居左',
        value: 'left'
      }, {
        label: '居中',
        value: 'center'
      }, {
        label: '居右',
        value: 'right'
      }]
    };
  },

  components: {},

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {return {};}
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
      if ((key === 'color1' || key === 'color2') && !value) {value = null;}
      if (key === 'borderColor' && !value) {value = 'rgba(255,255,255,0)';}
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
    .el-collapse {
      border: none;
    }

    .el-collapse-item__header {
      background-color: #202020;
      color: #ffffff;
    }

    .el-collapse-item__wrap {
      background-color: #202020;
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
}
</style>
