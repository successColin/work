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
          @change="(value) => changeStyles(value, 'zIndex')"
      />
    </div>
    <div class="propsSetting">
      <el-radio-group
          class="alignWrap"
          @change="(value) => changeTitle(value, 'bgType')"
          v-model="getComponentInfo.bgType"
          size="mini"
      >
        <el-radio
            label="bgColor"
        >
          颜色填充
        </el-radio>
        <el-radio
            label="bgImage"
        >
          上传图片
        </el-radio>
      </el-radio-group>
    </div>
    <div class="propsSetting" v-if="getComponentInfo.bgType==='bgColor'">
      <p class="setTitle">渐变类型</p>
      <c-select
          :options="colorTypeOptions"
          :value="getComponentInfo.gradientType"
          @change="(value) => changeTitle(value, 'gradientType')"
      ></c-select>
      <div style="display:flex;text-align: left;margin-top: 6px;">
        <c-color-picker
            style="margin-right: 10px;"
            size="small"
            v-model="getComponentInfo.stylesObj.color1"
            show-alpha
            @change="(value) => changeStyles(value, 'color1')"
            :predefine="predefineColors"
        >
        </c-color-picker>
        <c-color-picker
            size="small"
            v-model="getComponentInfo.stylesObj.color2"
            show-alpha
            @change="(value) => changeStyles(value, 'color2')"
            :predefine="predefineColors"
        >
        </c-color-picker>
      </div>
    </div>
    <div class="propsSetting" v-if="getComponentInfo.bgType==='bgColor'">
      <p class="setTitle">背景倒角</p>
      <el-input-number
          :min="0"
          controls-position="right"
          :value="getComponentInfo.stylesObj.borderRadius"
          @change="(value) => changeStyles(value, 'borderRadius')"
      />
    </div>
    <div class="propsSetting" v-if="getComponentInfo.bgType==='bgColor'">
      <p class="setTitle">背景边框</p>
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
        <el-input-number
            style="margin-right: 10px;"
            :min="0"
            controls-position="right"
            :value="getComponentInfo.stylesObj.borderWidth"
            @change="(value) => changeStyles(value, 'borderWidth')"
        />
        <c-select
            :options="borderOptions"
            :value="getComponentInfo.stylesObj.borderStyle"
            @change="(value) => changeStyles(value, 'borderStyle')"
        ></c-select>
      </div>
    </div>
    <div class="propsSetting"
         style="margin-bottom: 30px;"
         v-if="getComponentInfo.bgType==='bgImage'"
    >
      <p class="setTitle">上传图片</p>
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
    <div class="propsSetting" v-if="getComponentInfo.bgType==='bgImage'">
      <p class="setTitle">不透明度</p>
      <el-input-number
          :max="100"
          :min="0"
          :precision="0"
          controls-position="right"
          :value="getComponentInfo.stylesObj.opacity * 100"
          @change="(value) => changeStyles((Number(value)/100), 'opacity')"
      />
    </div>
    <div class="propsSetting" v-if="getComponentInfo.bgType==='bgImage'">
      <p class="setTitle">旋转角度</p>
      <div class="rotateWrap">
        <el-input-number
            :precision="0"
            controls-position="right"
            :value="getComponentInfo.stylesObj.rotationAngle"
            @change="(value) => changeStyles(value, 'rotationAngle')"
        />
        <div
            class="box flex"
            :class="{active: getComponentInfo.horizontalMirror}"
            @click="changeTitle(!getComponentInfo.horizontalMirror, 'horizontalMirror')"
        >
          <div class="left"></div>
          <div class="right"></div>
        </div>
        <div
            class="box"
            @click="changeTitle(!getComponentInfo.verticalMirror, 'verticalMirror')"
            :class="{active: getComponentInfo.verticalMirror}"
        >
          <div class="top" style="margin-bottom: 2.5px"></div>
          <div class="bottom"></div>
        </div>
      </div>
    </div>
    <div class="ellipsisWrap flex propsSetting">
      <span class="setTitle">启用阴影</span>
      <el-switch
          :value="getComponentInfo.enableShadows"
          @change="(value) => changeTitle(value, 'enableShadows')"
          active-color="#4689F5"
          inactive-color="#DCDFE6">
      </el-switch>
    </div>
    <div class="propsSetting" v-if="getComponentInfo.enableShadows">
      <p class="setTitle">水平阴影</p>
      <el-input-number
          controls-position="right"
          :value="getComponentInfo.stylesObj.xShadow"
          @change="(value) => changeStyles(value, 'xShadow')"
      />
    </div>
    <div class="propsSetting" v-if="getComponentInfo.enableShadows">
      <p class="setTitle">垂直阴影</p>
      <el-input-number
          controls-position="right"
          :value="getComponentInfo.stylesObj.yShadow"
          @change="(value) => changeStyles(value, 'yShadow')"
      />
    </div>
    <div class="propsSetting" v-if="getComponentInfo.enableShadows">
      <p class="setTitle">阴影距离</p>
      <el-input-number
          controls-position="right"
          :value="getComponentInfo.stylesObj.shadowDistance"
          @change="(value) => changeStyles(value, 'shadowDistance')"
      />
    </div>
    <div class="propsSetting" v-if="getComponentInfo.enableShadows">
      <p class="setTitle">模糊半径</p>
      <el-input-number
          :min="0"
          controls-position="right"
          :value="getComponentInfo.stylesObj.blurRadius"
          @change="(value) => changeStyles(value, 'blurRadius')"
      />
    </div>
    <div class="propsSetting" v-if="getComponentInfo.enableShadows">
      <p class="setTitle">阴影颜色</p>
      <c-color-picker
          size="small"
          v-model="getComponentInfo.stylesObj.shadowColor"
          show-alpha
          @change="(value) => changeStyles(value, 'shadowColor')"
          :predefine="predefineColors"
      >
      </c-color-picker>
    </div>

  </div>
</template>

<script>
import CUpload from '../../basicWidgets/CUpload/index';
import LocationProperties from '../../basicWidgets/CLocationProperties/index';

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

  components: {
    CUpload,
    LocationProperties
  },

  computed: {
    getComponentInfo() { // 获取控件详情信息
      const { componentId } = this.activeComponent;
      if (!componentId) { return {}; }
      const Obj = this.getList.find((item) => item.componentId === componentId) || {};
      // eslint-disable-next-line no-undef
      return Obj;
    },
    getList() {
      return this.list;
    }
  },

  mounted() {
  },

  methods: {
    changeScreenBgUrl(url) { // 修改背景图片
      this.changeStyles(url, 'backgroundImage');
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 100;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG, png, jpeg,svg 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
    },
    changeStyles(value, key) { // 样式修改
      const list = [...this.getList];
      const index = this.reduceIndex();
      const info = this.getComponentInfo;
      const styleObj = info.stylesObj || {};
      if ((key === 'color1' || key === 'color2') && !value) { value = null; }
      if (key === 'borderColor' && !value) { value = 'rgba(255,255,255,0)'; }
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
      if (!componentId) { return -1; }
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
    }
  },
  name: 'index'
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
            border-radius: 0 !important;
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
  .flex {
    display: flex;
  }
  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
