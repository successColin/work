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
    <div class="propsSetting">
      <p class="setTitle">图层</p>
      <c-input
          type="number"
          :numberValue="getComponentInfo.stylesObj.zIndex"
          @Input-Change="(value) => changeStyles(Number(value), 'zIndex')"/>
    </div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="内容设置" name="1">
        <div>
          <div class="propsSetting">
            <p class="setTitle">风格</p>
            <c-select
                :options="colorTypeOptions"
                :value="getComponentInfo.styleType"
                @change="(value) => changeTitle(value, 'styleType')"
            ></c-select>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">启用千分位</span>
            <el-switch
                :value="getComponentInfo.stylesObj.enableThousands"
                @change="(value) => changeStyles(value, 'enableThousands')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>

          <TextStylesConfig
              title="内容样式"
              title1="内容颜色"
              :fontFamilyValue="getComponentInfo.stylesObj.FontFamily"
              :fontWeightValue="getComponentInfo.stylesObj.FontWeight"
              :fontSizeValue="getComponentInfo.stylesObj.FontSize"
              :colorValue="getComponentInfo.stylesObj.Color"
              @change="({value,key}) => changeStyles(value, `${key}`)"
          />
          <div class="propsSetting">
            <p class="setTitle">数字间距</p>
            <div>
              <c-slider
                  :min="0"
                  :max="50"
                  :value="getComponentInfo.stylesObj.distance"
                  @change="(value) => changeStyles(value, 'distance')"/>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting">
            <span class="setTitle">数字背景</span>
            <el-switch
                :value="getComponentInfo.enableBackgroundImage"
                @change="(value) => changeTitle(value, 'enableBackgroundImage')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
          <div v-if="getComponentInfo.enableBackgroundImage">
            <div class="numberWrap">
              <div class="propsSetting flexItem">
                <p class="setTitle">宽</p>
                <c-input
                    type="number"
                    @change="(value) => changeStyles(Number(value), 'contentWidth')"
                    :numberValue="getComponentInfo.stylesObj.contentWidth"
                />
              </div>
              <div class="propsSetting flexItem">
                <p class="setTitle">高</p>
                <c-input
                    type="number"
                    @change="(value) => changeStyles(Number(value), 'contentHeight')"
                    :numberValue="getComponentInfo.stylesObj.contentHeight"
                />
              </div>
            </div>
            <div class="propsSetting">
              <p class="setTitle">背景设置</p>
              <div class="wrap">
                <c-upload
                    :isPublic="true"
                    :before-upload="beforeAvatarUpload"
                    :url="getComponentInfo.stylesObj.bgUrl"
                    @changeScreenBg="(value) => changeStyles(value, 'bgUrl')"
                    :accept="accept"
                >
                  <template v-slot:tip>
                    <div class="el-upload__tip">只能上传png,jpg,jpeg图片，且不超过1M</div>
                  </template>
                </c-upload>
              </div>
            </div>
          </div>

        </div>
      </el-collapse-item>
      <el-collapse-item name="2" title="前缀设置">
        <div class="propsSetting">
          <p class="setTitle">前缀内容</p>
          <c-input
              type="text"
              :maxlength="16"
              :value="getComponentInfo.stylesObj.prefixContent"
              @Input-Change="(value) => changeStyles(value, 'prefixContent')"/>
        </div>
        <TextStylesConfig
            title="前缀样式"
            title1="前缀颜色"
            :fontFamilyValue="getComponentInfo.stylesObj.prefixFontFamily"
            :fontWeightValue="getComponentInfo.stylesObj.prefixFontWeight"
            :fontSizeValue="getComponentInfo.stylesObj.prefixFontSize"
            :colorValue="getComponentInfo.stylesObj.prefixColor"
            @change="({value,key}) => changeStyles(value, `prefix${key}`)"
        />
      </el-collapse-item>
      <el-collapse-item name="4" title="后缀设置">
        <div class="propsSetting">
          <p class="setTitle">后缀内容</p>
          <c-input
              type="text"
              :maxlength="16"
              :value="getComponentInfo.stylesObj.suffixContent"
              @Input-Change="(value) => changeStyles(value, 'suffixContent')"/>
        </div>
        <TextStylesConfig
            title="前缀样式"
            title1="前缀颜色"
            :fontFamilyValue="getComponentInfo.stylesObj.suffixFontFamily"
            :fontWeightValue="getComponentInfo.stylesObj.suffixFontWeight"
            :fontSizeValue="getComponentInfo.stylesObj.suffixFontSize"
            :colorValue="getComponentInfo.stylesObj.suffixColor"
            @change="({value,key}) => changeStyles(value, `suffix${key}`)"
        />
      </el-collapse-item>

      <el-collapse-item title="其他配置" name="3">
        <div>
          <div class="propsSetting">
            <p class="setTitle">对齐方式</p>
            <el-radio-group
                class="alignWrap"
                @change="(value) => changeStyles(value, 'textAlign')"
                v-model="getComponentInfo.stylesObj.textAlign"
                size="mini"
            >
              <el-radio-button
                  :label="item.value"
                  v-for="item in options"
                  :key="item.value"
              >
                <span class="iconfont" :class="{[item.icon]:true}"></span>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="propsSetting">
            <span class="setTitle">交互方式</span>
            <div>
              <el-radio-group
                  class="radioGroup"
                  size="mini"
                  v-model="getComponentInfo.interactionMode"
                  @change="(value) => changeTitle(value, 'interactionMode')"
              >
                <el-radio-button :label="1">无</el-radio-button>
                <el-radio-button :label="2">弹框</el-radio-button>
                <el-radio-button :label="3">链接</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="ellipsisWrap flex propsSetting" v-if="getComponentInfo.interactionMode===2">
            <div class="InputWrap">
              <c-input
                  lable="宽:"
                  type="number"
                  :numberValue="getComponentInfo.bulletWidth"
                  @Input-Change="(value) => changeTitle(Number(value), 'bulletWidth')"/>
              <c-input
                  lable="高:"
                  type="number"
                  :numberValue="getComponentInfo.bulletHeight"
                  @Input-Change="(value) => changeTitle(Number(value), 'bulletHeight')"/>
            </div>
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionMode===2">
            <p class="setTitle">弹框地址</p>
            <c-input
                type="text"
                :value="getComponentInfo.bulletUrl"
                @Input-Change="(value) => changeTitle(value, 'bulletUrl')"
                @blur="(e) => checkIsRight(e.target.value, 'bulletUrl')"
            />
          </div>
          <div class="propsSetting" v-if="getComponentInfo.interactionMode===3">
            <p class="setTitle">超链接</p>
            <c-input
                type="text"
                :value="getComponentInfo.url"
                @Input-Change="(value) => changeTitle(value, 'url')"
                @blur="(e) => checkIsRight(e.target.value, 'url')"
            />
          </div>
          <div class="ellipsisWrap flex propsSetting" v-if="getComponentInfo.interactionMode===3">
            <span class="setTitle">是否打开新窗口</span>
            <el-switch
                :value="getComponentInfo.enableOpenNewWindow"
                @change="(value) => changeTitle(value, 'enableOpenNewWindow')"
                active-color="#4689F5"
                inactive-color="#183472">
            </el-switch>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script>
import {IsURL} from '@/utils/utils';
import TextStylesConfig from '../TextStylesConfig/index';
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
      accept: '.png,.jpg,.jpeg,.svg',
      colorTypeOptions: [
        {
          label: '风格一',
          value: 1
        }, {
          label: '风格二',
          value: 2
        }
      ],
      activeName: '',
      color: 'rgba(255, 69, 0, 0.68)',
      predefineColors,
      options: [{
        label: '左对齐',
        value: 'start',
        icon: 'icon-zuoduiqi'
      }, {
        label: '居中',
        value: 'center',
        icon: 'icon-juzhongduiqi'
      }, {
        label: '右对齐',
        value: 'end',
        icon: 'icon-youduiqi'
      }]
    };
  },

  components: {
    TextStylesConfig
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
    // getComponentInfo(val, oldVal) { // 普通的watch监听
    //   console.log("a: " + val, oldVal);
    // },
  },
  methods: {
    beforeAvatarUpload(file) {
      const typeArr = file.type.split('/');
      const type = typeArr[typeArr.length - 1];
      const isJPG = this.accept.indexOf(type) > -1;
      const isLt2M = file.size / 1024 / 1024 < 1;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('请上传指定格式的文件');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('文件大小不能超过 1MB!');
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

    .el-radio-button {
      width: 60px;

      &.is-active {
        .el-radio-button__inner {
          background: $component-borderFocus-color !important;
          border-color: $component-borderFocus-color !important;
        }
      }

      .el-radio-button__inner {
        width: 100%;
        padding: 8px 15px;
        font-size: 14px;
        border-radius: 0;
        color: #FFFFFF;
        opacity: .7;
        border-color: $component-border-color;
        background: $component-background-color;
      }

      .el-radio-button__orig-radio:checked + .el-radio-button__inner {
        background: $component-background-color;
        font-size: 14px;
        color: #FFFFFF;
        opacity: 1;
      }
    }

  }

  .propsSetting {
    margin-bottom: 10px;

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
    .radioGroup{
      width: 100%;
      display: flex;
      ::v-deep{
        .el-radio-button{
          flex: 1;
        }
      }
    }

    .InputWrap {
      display: flex;
      margin-top: 5px;
      width: 100%;
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
  .numberWrap {
    display: flex;
    justify-content: space-between;

    .flexItem {
      width: 123px;
    }
  }
  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
  }
}
</style>
