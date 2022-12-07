<template>
  <div class="configWrap">
    <div class="propsSetting">
      <span class="setTitle">交互方式</span>
      <div>
        <el-radio-group
            size="mini"
            v-model="interactionModeCopy"
            @change="(value) => changeTitle(value, 'interactionMode')"
        >
          <el-radio-button :label="1">无</el-radio-button>
          <el-radio-button :label="2">弹框</el-radio-button>
          <el-radio-button :label="3">链接</el-radio-button>
          <el-radio-button :label="4" v-if="isNeedDownload">下载</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="ellipsisWrap flex propsSetting" v-if="interactionMode===2">
      <div class="InputWrap">
        <c-input
            lable="宽:"
            type="number"
            :numberValue="bulletWidth"
            @Input-Change="(value) => changeTitle(Number(value), 'bulletWidth')"/>
        <c-input
            lable="高:"
            type="number"
            :numberValue="bulletHeight"
            @Input-Change="(value) => changeTitle(Number(value), 'bulletHeight')"/>
      </div>
    </div>
    <div class="propsSetting" v-if="interactionMode===2">
      <p class="setTitle">弹框地址</p>
      <c-input
          type="text"
          :value="bulletUrl"
          @Input-Change="(value) => changeTitle(value, 'bulletUrl')"
          @blur="(e) => checkIsRight(e.target.value, 'bulletUrl')"
      />
    </div>
    <div class="propsSetting" v-if="interactionMode===3">
      <p class="setTitle">超链接</p>
      <c-input
          type="text"
          :value="url"
          @Input-Change="(value) => changeTitle(value, 'url')"
          @blur="(e) => checkIsRight(e.target.value, 'url')"
      />
    </div>
    <slot></slot>
    <div class="ellipsisWrap flex propsSetting" v-if="interactionMode===3">
      <span class="setTitle">是否打开新窗口</span>
      <el-switch
          :value="enableOpenNewWindow"
          @change="(value) => changeTitle(value, 'enableOpenNewWindow')"
          active-color="#4689F5"
          inactive-color="#183472">
      </el-switch>
    </div>
  </div>
</template>

<script>
import {IsURL} from '@/utils/utils';

export default {
  props: {
    interactionMode: { // 是弹框还是链接
      type: Number,
      default: 1
    },
    bulletWidth: { // 弹框宽度
      type: Number,
      default: 600
    },
    bulletHeight: { // 弹框高度
      type: Number,
      default: 400
    },
    bulletUrl: { // 弹框地址
      type: String,
      default: ''
    },
    url: { // 链接地址
      type: String,
      default: ''
    },
    enableOpenNewWindow: { // 是否打开新地址
      type: Boolean,
      default: false
    },
    isNeedDownload: { // 是否需要下载
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      interactionModeCopy: 1
    }
  },
  watch: {
    interactionMode: {
      immediate: true,
      handler(v){
        this.interactionModeCopy = v;
      }
    }
  },
  methods: {
    changeTitle(value, key) {
      this.$emit('change', { value, key });
    },
    checkIsRight(value, key) {
      if (!IsURL(value)) {
        this.$message.error('请输入正确的url地址!');
        this.$emit('change', { value: '', key });
      }
    }
  },
  name: 'index'
}
</script>

<style lang='scss' scoped>
.configWrap {
  width: 100%;

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
  }

  .ellipsisWrap {
    justify-content: space-between;
    align-items: center;
  }
  ::v-deep {

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
}
</style>
