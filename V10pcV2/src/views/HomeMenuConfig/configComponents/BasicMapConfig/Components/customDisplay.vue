/**
* @name: pointStylesConfig
* @author: DELL
* @date: 2022/8/4 15:54
* @description：pointStylesConfig
* @update: 2022/8/4 15:54
*/
<!-- 页面 -->
<template>
  <div>
    <div v-for="(configItem, i) in customDisplay"
         :key="i"
    >
      <div class="titleWrap">
        <span class="titleLeft">
          字段{{ i + 1 }}
        </span>
        <span @click="del(i)" class="icon-shanchu iconfont"></span>
      </div>
      <div class="propsSetting">
        <apiot-input
            placeholder="请输入映射字段值"
            :value="configItem.fieldValue"
            @input="(value) => change(value, 'fieldValue', i, configItem)"/>
      </div>
      <div class="propsSetting flexItem">
        <div>
          <c-upload
              :isPublic="true"
              :before-upload="beforeAvatarUpload"
              :url="configItem.customUrl"
              @changeScreenBg="(value) => change(value, 'customUrl', i, configItem)"
              accept=".png,.jpg,.jpeg,.svg"
          >
          </c-upload>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { predefineColors } from '../../../constants/global';
import CUpload from '../../../basicWidgets/CUpload/index';

export default {
  props: {
    customDisplay: {
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

  components: {
    CUpload
  },

  computed: {},

  mounted() {
    // this.config = JSON.parse(JSON.stringify(this.scatterConfig));
  },

  methods: {
    beforeAvatarUpload(file) {
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
          reject(file);
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 50kb!');
          reject(file);
          return false;
        }
        return resolve(file);
      });
    },
    del(i) {
      const list = [...this.customDisplay];
      list.splice(i, 1);
      this.$emit('change', list);
    },
    change(v, key, i, configItem) {
      const list = [...this.customDisplay];
      const newObj = {
        ...configItem,
        [key]: v
      };
      list.splice(i, 1, newObj);
      this.$emit('change', list);
    }
  },
  name: 'customDisplay'
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

  .titleLeft {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
  }

  .iconfont {
    color: #BBC3CD;
    cursor: pointer;
  }

  .iconfont:hover {
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

  ::v-deep {
    .uploadGather .cUploadByBtn .el-upload--picture-card {
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
