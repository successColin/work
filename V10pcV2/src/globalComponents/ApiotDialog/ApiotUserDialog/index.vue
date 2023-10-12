<!--
 * @Author: sss
 * @Date: 2021-07-22 11:17:09
 * @Last Modified by: sss
 * @Last Modified time: 2021-07-22 11:17:09
 * @Desc: 选择用户弹出框
-->
<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    :visible="visible"
    :title="title || $t('common.user')"
    class="userDialog"
    @sure-click="handleSure"
  >
    <user-content
      v-if="visible"
      :isMult="isMult"
      ref="user"
      :checkedUsers="checkedUsers"
    ></user-content>
    <span slot="footer" class="userDialog__footer">
      <apiot-button @click="cancleClick">{{
        $t('common.cancle')
      }}</apiot-button>
      <apiot-button type="primary" @click.stop.prevent="sureClick">
        {{ $t('common.sure') }}
      </apiot-button>
    </span>
  </apiot-dialog>
</template>

<script>
import UserContent from './components/UserContent';

export default {
  components: { UserContent },

  props: {
    title: {
      type: String,
      default: ''
    },
    // 已经选中的用户
    checkedUsers: {
      type: Array,
      default() {
        return [];
      }
    },
    isMult: {
      // 是否多选, 默认多选
      type: Boolean,
      default() {
        return true;
      }
    },
    visible: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },

  data() {
    return {};
  },

  computed: {},

  methods: {
    changeSelectVallue(list) {
      this.$refs.user.initRoles(list);
    },
    // 点击确定按钮
    handleSure() {
      const list = this.$refs.user.selection;
      this.$emit('handleSure', list);
    },
    cancleClick() {
      this.$emit('handleCancel');
    }
  },

  mounted() {
    // console.log(this.checkedUsers);
  }
};
</script>

<style lang='scss' scoped>
.userDialog {
  .personnel {
    height: 100%;
    display: flex;
    flex-direction: column;
    &__selected {
      width: 100%;
      border: 1px solid #e9e9e9;
      max-height: 70px;
      padding-top: 6px;
      padding-left: 10px;
      overflow-y: auto;
      box-sizing: border-box;
      margin-top: 6px;
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
}
::v-deep {
  .el-dialog {
    width: 640px;
    border-radius: 8px;
  }

  .el-dialog__header {
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
    height: 54px;
    padding: 16px 20px;
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
