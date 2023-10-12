<!--
 * @Descripttion: 修改组织弹窗
 * @version:
 * @Author: tjf
 * @Date: 2021-04-14 15:24:27
 * @LastEditors: tjf
 * @LastEditTime: 2021-06-03 10:02:27
-->
<!-- treeTable -->
<template>
  <div class="dialog">
    <!-- 人员选择弹窗11 -->
    <el-dialog
      v-on="$listeners"
      v-bind="$attrs"
      :modal="false"
      close-on-click-modal
      class="curMask"
      :title="title"
      :append-to-body="true"
      @close="cancleClick"
    >
      <user-content v-on="$listeners" v-bind="$attrs" ref="user"></user-content>
      <span slot="footer" class="dialog-footer">
        <apiot-button @click="cancleClick">{{
          $t('common.cancle')
        }}</apiot-button>
        <apiot-button
          type="primary"
          :loading="loading"
          @click.stop.prevent="sureClick"
        >
          {{ $t('common.sure') }}
        </apiot-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import userContent from './components/userContent/index';

export default {
  components: {
    userContent
    // checkByRole,
  },
  name: 'userDialog',
  data() {
    return {
      loading: false
    };
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  mounted() {},
  methods: {
    cancleClick() {
      this.$emit('update:visible', false);
      this.$emit('handle-cancel');
    },
    sureClick() {
      this.$emit('updateUser', this.$refs.user.selection);
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  .personnel {
    height: 100%;
    display: flex;
    flex-direction: column;
    &__selected {
      width: 100%;
      border: 1px solid #e9e9e9;
      min-height: 40px;
      max-height: 70px;
      padding-top: 5px;
      padding-left: 10px;
      overflow-y: auto;
      box-sizing: border-box;
      margin-top: 10px;
      color: #333333;
      .manage-tag {
        padding-right: 6px;
        height: 28px;
        line-height: 28px;
        background: #f1f3f6;
        border-radius: 14px;
        display: flex;
        margin-bottom: 6px;
        float: left;
        .imageName {
          width: 28px;
          height: 28px;
          border-radius: 14px;
          color: #fff;
          font-size: 12px;
          text-align: center;
          line-height: 28px;
          display: inline-block;
        }
        .iconfont {
          font-size: 12px;
          cursor: pointer;
          color: #bbc3cd;
          &:hover {
            color: #6b798d;
          }
        }
      }
    }
    &__content {
      flex: 1;
      height: calc(100% - 70px);
      position: relative;
      &__search {
        width: 200px;
        height: 30px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        position: absolute;
        right: 0px;
        top: 5px;
        z-index: 3;
        .el-input {
          width: 200px;
          float: right;
          height: 30px;
          line-height: 30px;
          box-sizing: border-box;
          text-align: right;
          ::v-deep {
            .el-input__inner {
              width: 98%;
              height: 30px !important;
              //margin-top: -2px;
              padding-left: 12px;
              font-size: 13px;
              box-sizing: border-box;
            }
            .iconfont {
              height: 30px;
            }
            .el-input__suffix {
              left: auto;
              right: 10px;
              cursor: pointer;
              .el-input__suffix-inner {
                display: flex;
                align-items: center;
                height: 30px;
                line-height: 30px;
                .on {
                  color: #4689f5;
                }
              }
            }
          }
        }
        input {
          height: 30px;
          width: 170px;
          border: none;
          background: none;
          padding: 0 10px;
          color: #aaaaaa;
          &:focus {
            outline: none;
          }
          &::placeholder {
            color: #aaaaaa;
          }
        }
        .iconfont {
          color: #d9d9d9;
          cursor: pointer;
          font-size: 16px;
        }
        .icon-xinzeng {
          color: #ffffff;
        }
      }
    }
    ::v-deep {
      .el-tabs {
        height: 100%;
        display: flex;
        flex-direction: column;
        .el-tabs__header {
          flex: 0 0 42px;
        }
        .el-tabs__content {
          flex: 1;
          height: calc(100% - 42px);
          .el-tab-pane {
            height: 100%;
          }
        }
      }
      .el-tabs__header {
        margin-bottom: 0;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
        background-color: #e9e9e9;
      }
    }
  }
  .user-content {
    ::v-deep {
      .el-tree-node__expand-icon {
        margin-left: 18px;
      }
    }
  }
}
.curMask {
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep {
  .el-dialog {
    width: 640px;
    border-radius: 8px;
    margin: 0 !important;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    height: 54px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
  }

  .el-dialog__title {
    vertical-align: top;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    font-family: PingFangSC-Medium, PingFang SC;
  }

  .el-dialog__body {
    height: 422px;
    box-sizing: border-box;
    padding: 0px 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .el-tabs__item {
    height: 42px;
  }
  .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    padding: 16px 20px 17px;
  }

  .el-dialog__headerbtn {
    top: 18px;
  }
}
</style>
