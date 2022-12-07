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
    <div  v-for="(configItem, i) in customDisplay"
          :key="i"
    >
      <div class="titleWrap">
        <span class="titleLeft">
          类型{{i + 1}}
        </span>
        <span @click="del(i)" class="icon-shanchu1 iconfont"></span>
      </div>
      <div class="propsSetting">
        <c-input
            type="text"
            placeholder="请输入映射字段值"
            :value="configItem.fieldValue"
            @Input-Change="(value) => change(value, 'fieldValue', i, configItem)"/>
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
      <div class="ellipsisWrap flex propsSetting">
        <span class="setTitle">是否显示文字</span>
        <el-switch
            :value="configItem.enableShowLabel"
            @change="change($event, 'enableShowLabel',i, configItem)"
            active-color="#4689F5"
            inactive-color="#183472">
        </el-switch>
      </div>
      <div class="propsSetting" v-if="configItem.enableShowLabel">
        <p class="setTitle">文字显示类型</p>
        <div>
          <c-select
              filterable
              :options="labelShowTypeArr"
              :value="configItem.labelShowType"
              @change="(value) => change(value, 'labelShowType', i, configItem)"
          ></c-select>
        </div>
      </div>

      <div class="numberWrap" v-if="configItem.enableShowLabel">
        <div class="propsSetting flexItem">
          <p class="setTitle">文字颜色</p>
          <c-color-picker
              style="margin-right: 10px;"
              size="small"
              show-alpha
              :value="configItem.labelColor"
              :colorValue="configItem.labelColor"
              @change="(value) => change(value, 'labelColor', i, configItem)"
              :predefine="predefineColors">
          </c-color-picker>
        </div>
        <div class="propsSetting flexItem">
          <p class="setTitle">文字大小</p>
          <c-input
              type="number"
              :min="0"
              :numberValue="configItem.labelSize"
              @Input-Change="(value) => change(Number(value), 'labelSize', i, configItem)"/>
        </div>
      </div >
      <div class="propsSetting" v-if="configItem.enableShowLabel">
        <p class="setTitle">文字位置</p>
        <div>
          <c-select
              filterable
              :options="labelPosition"
              :value="configItem.labelPosition"
              @change="(value) => change(value, 'labelPosition', i, configItem)"
          ></c-select>
        </div>
      </div>
      <div class="propsSetting" v-if="configItem.enableShowLabel">
        <p class="setTitle">文字水平偏移</p>
        <c-input
            type="number"
            :numberValue="configItem.shadowHorizontalOffset"
            placeholder=">0 右偏移，<0 左偏移"
            @Input-Change="(value = 0) => change(Number(value), 'shadowHorizontalOffset', i, configItem)"/>
      </div>
      <div class="propsSetting" v-if="configItem.enableShowLabel">
        <p class="setTitle">文字垂直偏移</p>
        <c-input
            type="number"
            :numberValue="configItem.shadowVerticalOffset"
            placeholder=">0 下偏移，<0 上偏移"
            @Input-Change="(value = 0) => change(Number(value), 'shadowVerticalOffset', i, configItem)"/>
      </div>
    </div>
  </div>
</template>

<script>
import {predefineColors} from '@/constants/global'

export default {
  props: {
    customDisplay: {
      type: Array,
      default() {
        return [];
      }
    },
    labelShowTypeArr: {
      type: Array,
      default() {
        return [];
      }
    },
    labelPosition: {
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
      const isJPG = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'].includes(file.type);
      const isLt2M = file.size / 1024 < 50;
      return new Promise((resolve, reject) => {
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
          reject(file);
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 50kb!');
          reject(file);
          return false
        }
        return resolve(file)
      })
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
