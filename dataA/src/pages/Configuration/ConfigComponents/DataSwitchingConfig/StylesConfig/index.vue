/**
* @name: index
* @author: DELL
* @date: 2022/1/22 14:52
* @description：index
* @update: 2022/1/22 14:52
*/
<!-- 页面 -->
<template>
  <div>
    <TextStylesConfig
        :isNeed="false"
        title="字体样式"
        :fontFamilyValue="stylesObj.cFontFamily"
        :fontWeightValue="stylesObj.cFontWeight"
        :fontSizeValue="stylesObj.cFontSize"
        @change="({value, key}) => changeStyles(value, `c${key}`)"
    ></TextStylesConfig>
    <div class="numberWrap">
      <div class="propsSetting flexItem">
        <p class="setTitle">上下内边距</p>
        <c-input
            :numberValue="stylesObj.cPaddingTopAndBottom"
            type="number"
            @Input-Change="(value) => changeStyles(Number(value), 'cPaddingTopAndBottom')"
        />
      </div>
      <div class="propsSetting flexItem">
        <p class="setTitle">左右内边距</p>
        <c-input
            :numberValue="stylesObj.cPaddingRightAndLeft"
            type="number"
            @Input-Change="(value) => changeStyles(Number(value), 'cPaddingRightAndLeft')"
        />
      </div>
    </div>
    <div class="numberWrap">
      <div class="propsSetting flexItem">
        <p class="setTitle">常态色</p>
        <c-color-picker
            style="margin-right: 10px;"
            size="small"
            show-alpha
            :value="stylesObj.cColor"
            @change="(value) => changeStyles(value, 'cColor')"
            :predefine="predefineColors">
        </c-color-picker>
      </div>
      <div class="propsSetting flexItem">
        <p class="setTitle">悬浮点击</p>
        <c-color-picker
            style="margin-right: 10px;"
            size="small"
            show-alpha
            :value="stylesObj.cHoverColor"
            @change="(value) => changeStyles(value, 'cHoverColor')"
            :predefine="predefineColors">
        </c-color-picker>
      </div>
    </div>
    <div class="numberWrap">
      <div class="propsSetting flexItem">
        <p class="setTitle">常态背景图</p>
        <c-upload
            :before-upload="beforeAvatarUpload"
            @changeScreenBg="(url) => changeStyles(url, 'cBgUrl')"
            :url="stylesObj.cBgUrl"
            :isPublic="true"
            accept=".png,.jpg,.jpeg"
        >
        </c-upload>
      </div>
      <div class="propsSetting flexItem">
        <p class="setTitle">悬浮点击背景图</p>
        <div>
          <c-upload
              :isPublic="true"
              :before-upload="beforeAvatarUpload"
              @changeScreenBg="(url) => changeStyles(url, 'cHoverBgUrl')"
              :url="stylesObj.cHoverBgUrl"
              accept=".png,.jpg,.jpeg"
          >
          </c-upload>
        </div>
      </div>
    </div>
    <div class="numberWrap">
      <div class="propsSetting flexItem">
        <p class="setTitle">常态背景颜色</p>
        <c-color-picker
            style="margin-right: 10px;"
            size="small"
            show-alpha
            :value="stylesObj.cBgColor"
            @change="(value) => changeStyles(value || 'rgba(255,255,255,0)', 'cBgColor')"
            :predefine="predefineColors">
        </c-color-picker>
      </div>
      <div class="propsSetting flexItem">
        <p class="setTitle">悬浮背景颜色</p>
        <div>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="stylesObj.cHoverBgColor"
              @change="(value) => changeStyles(value || 'rgba(255,255,255,0)', 'cHoverBgColor')"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
      </div>
    </div>
    <div class="numberWrap">
      <div class="propsSetting flexItem">
        <p class="setTitle">边框大小</p>
        <c-input
            :numberValue="stylesObj.borderWidth"
            type="number"
            @Input-Change="(value) => changeStyles(Number(value), 'borderWidth')"
        />
      </div>
      <div class="propsSetting flexItem">
        <p class="setTitle">边框倒角(%)</p>
        <c-input
            :numberValue="stylesObj.borderRadius"
            type="number"
            @Input-Change="(value) => changeStyles(Number(value), 'borderRadius')"
        />
      </div>
    </div>
    <div class="propsSetting">
      <p class="setTitle">边框颜色</p>
      <c-color-picker
          style="margin-right: 10px;"
          size="small"
          show-alpha
          :value="stylesObj.borderColor"
          @change="(value) => changeStyles(value|| '#fff', 'borderColor')"
          :predefine="predefineColors">
      </c-color-picker>
    </div>
  </div>
</template>

<script>
import TextStylesConfig from '../../TextStylesConfig/index';
import {predefineColors} from '@/constants/global'

export default {
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    stylesType: {
      type: String,
      default() {
        return 'styleOne';
      }
    },
    type: {
      type: String,
      default() {
        return 'activeConfig';
      }
    }
  },
  data() {
    return {
      predefineColors,
      stylesObj: {}
    };
  },

  components: {
    TextStylesConfig
  },

  computed: {},

  mounted() {
    this.stylesObj = JSON.parse(JSON.stringify(this.config));
  },

  methods: {
    changeStyles(value, key) {
      this.stylesObj = {
        ...this.stylesObj,
        [key]: value
      }
      this.$emit('change', this.stylesObj);
    },
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 50kb!');
          reject(file);
          return false
        }
        return resolve(file)
      })
    }
  },
  watch: {
    // stylesObj:{
    //   deep: true,
    //   handler(v){
    //     this.$emit('change', v);
    //   }
    // }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
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

  ::v-deep {
    .el-upload--picture-card {
      height: 30px !important;
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
</style>
