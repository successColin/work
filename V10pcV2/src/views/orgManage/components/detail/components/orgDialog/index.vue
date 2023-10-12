<!--
 * @Descripttion: 修改组织弹窗
 * @version:
 * @Author: tjf
 * @Date: 2021-04-14 15:24:27
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-20 11:04:42
-->
<!-- treeTable -->
<template>
  <div class="dialog">
    <!-- 选择组织 -->
    <el-dialog
      v-on="$listeners"
      v-bind="$attrs"
      :modal="false"
      :title="$t('common.select') + $t('org.org')"
      :close-on-click-modal="false"
      class="curMask"
    >
      <section class="org">
        <div class="personnel__content">
          <organization
            class="org-tree"
            ref="orgTree"
            :curId="curData.id"
            :isSingle="true"
          ></organization>
        </div>
      </section>
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
import Organization from '@/views/Role/RoleContent/DesignDetial/Organization/organization';

export default {
  components: {
    Organization
  },
  name: 'orgDialog',
  data() {
    return {
      visible: false,
      loading: false
    };
  },
  props: {
    curData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  mounted() {},
  methods: {
    cancleClick() {
      this.$emit('update:visible', false);
    },
    sureClick() {
      const selectKey = this.$refs.orgTree.selectKeys;
      if (selectKey.length === 0) {
        this.$message.warning(
          this.$t('placeholder.pleaseSelect', {
            any: this.$t('org.organization')
          })
        );
        return;
      }
      this.$emit('updateOrg', selectKey[0]);
    }
  },
  computed: {
    detailData() {
      return JSON.parse(JSON.stringify(this.curData));
    }
  }
};
</script>

<style lang='scss' scoped>
.dialog {
  .org {
    height: 100%;
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
        display: flex;
        .manage-tag {
          padding-right: 6px;
          flex-shrink: 0;
          height: 28px;
          line-height: 28px;
          background: #f1f3f6;
          border-radius: 14px;
          display: flex;
          align-items: center;
          margin-bottom: 6px;
          .imageName {
            width: 28px;
            height: 28px;
            border-radius: 14px;
            color: #fff;
            font-size: 12px;
            text-align: center;
            line-height: 28px;
          }
          .iconfont {
            font-size: 12px;
            cursor: pointer;
          }
        }
      }
      &__content {
        flex: 1;
        height: 100%;
        ::v-deep {
          .el-tree {
            height: 100%;
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

  .el-dialog__footer {
    border-top: 1px solid #e9e9e9;
    padding: 16px 20px 15px;
  }

  .el-dialog__headerbtn {
    top: 18px;
  }
}
</style>
