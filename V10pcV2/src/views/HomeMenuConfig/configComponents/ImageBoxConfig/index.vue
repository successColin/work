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
    <div class="propsSetting" style="margin-bottom: 30px">
      <p class="setTitle">上传图片</p>
      <div class="wrap">
        <c-upload
          :before-upload="beforeAvatarUpload"
          @changeScreenBg="changeScreenBgUrl"
          accept=".png,.jpg,.jpeg"
          :url="config.stylesObj.backgroundImage"
        >
          <template v-slot:tip>
            <div class="el-upload__tip">
              只能上传png,jpg,jpeg图片，且不超过2MB
            </div>
          </template>
        </c-upload>
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">不透明度</p>
      <el-input-number
        :max="100"
        :min="0"
        :precision="0"
        controls-position="right"
        :value="config.stylesObj.opacity * 100"
        @change="(value) => changeStyles(Number(value) / 100, 'opacity')"
      />
    </div>
    <div class="propsSetting">
      <p class="setTitle">旋转角度</p>
      <div class="rotateWrap">
        <el-input-number
          :precision="0"
          controls-position="right"
          :value="config.stylesObj.rotationAngle"
          @change="(value) => changeStyles(Number(value), 'rotationAngle')"
        />
        <div
          class="box flex"
          :class="{ active: config.horizontalMirror }"
          @click="changeTitle(!config.horizontalMirror, 'horizontalMirror')"
        >
          <div class="left"></div>
          <div class="right"></div>
        </div>
        <div
          class="box"
          @click="changeTitle(!config.verticalMirror, 'verticalMirror')"
          :class="{ active: config.verticalMirror }"
        >
          <div class="top" style="margin-bottom: 2.5px"></div>
          <div class="bottom"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LocationProperties from '../../basicWidgets/CLocationProperties/index';
import CUpload from '../../basicWidgets/CUpload/index';

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
    return {};
  },

  components: {
    LocationProperties,
    CUpload
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
  beforeMount() {},
  mounted() {},
  watch: {},
  methods: {
    changeScreenBgUrl(url) {
      // 修改背景图片
      this.changeStyles(url, 'backgroundImage');
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 / 1024 < 2;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.warning('上传图片只能是 JPG, png, jpeg,svg 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.warning('上传图片大小不能超过 2MB!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
    },
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
