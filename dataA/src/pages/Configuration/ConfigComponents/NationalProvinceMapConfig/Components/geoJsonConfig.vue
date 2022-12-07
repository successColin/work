/**
* @name: geoJsonConfig
* @author: DELL
* @date: 2022/8/30 15:37
* @description：geoJsonConfig
* @update: 2022/8/30 15:37
*/
<!-- 页面 -->
<!-- 页面 -->
<template>
  <div>
    <div  v-for="(configItem, i) in geoJsonConfig"
          :key="i"
    >
      <div class="titleWrap">
        <span class="titleLeft">
          geoJSON{{i + 1}}
        </span>
        <span @click="del(i)" class="icon-shanchu1 iconfont"></span>
      </div>
      <div class="propsSetting flexItem">
        <div>
          <c-upload
              :isPublic="true"
              :before-upload="beforeAvatarUpload"
              :url="configItem.geoJSONUrl"
              @changeScreenBg="(value) => change(value, 'geoJSONUrl', i, configItem)"
              accept=".png,.jpg,.jpeg,.svg"
          >
          </c-upload>
        </div>
      </div>
      <div class="propsSetting">
        <p class="setTitle">区域编码</p>
        <c-input
            type="text"
            placeholder="请输入区域编码"
            :value="configItem.areaCode"
            @Input-Change="(value) => change(value, 'areaCode', i, configItem)"/>
      </div>
      <div class="propsSetting">
        <p class="setTitle">描述</p>
        <c-input
            type="text"
            placeholder="请输入描述"
            :value="configItem.memo"
            @Input-Change="(value) => change(value, 'memo', i, configItem)"/>
      </div>
    </div>
  </div>
</template>

<script>
import {predefineColors} from '@/constants/global'

export default {
  props: {
    geoJsonConfig: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      predefineColors,
      config: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    // this.config = JSON.parse(JSON.stringify(this.scatterConfig));
  },

  methods: {
    beforeAvatarUpload(file) {
      const isJPG = ['application/json'].includes(file.type);
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传文件只能是 JSON 格式!');
          reject(file);
          return false
        }
        return resolve(file)
      })
    },
    del(i) {
      const list = [...this.geoJsonConfig];
      list.splice(i, 1);
      this.$emit('change', list);
    },
    change(v, key, i, configItem) {
      const list = [...this.geoJsonConfig];
      const newObj = {
        ...configItem,
        [key]: v
      };
      list.splice(i, 1, newObj);
      this.$emit('change', list);
    }
  },
  name: 'geoJsonConfig'
};
</script>

<style lang='scss' scoped>
.ellipsisWrap {
  justify-content: space-between;
  align-items: center;
}
.titleWrap {
  display: flex;
  justify-content: space-between;
  .titleLeft{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
  }
  .iconfont{
    color: #BBC3CD;
    cursor: pointer;
  }
  .iconfont:hover{
    color: #4689F5;
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
  ::v-deep{
    .uploadGather .cUploadByBtn .el-upload--picture-card{
      height: 24px;
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
.numberWrap {
  display: flex;
  justify-content: space-between;

  .flexItem {
    width: 123px;
  }
}

</style>

