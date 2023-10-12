<template>
  <div
    class="orgWrap"
    :style="`width:${configData.width}`"
    v-if="configData.canShow"
  >
    <el-form-item :prop="`${configData.compId}`">
      <span class="span-box" slot="label">
        <span style="white-space: nowrap"> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <apiot-input
        v-model="parent.form[configData.compId]"
        v-show="false"
      ></apiot-input>
      <el-button size="mini" @click="show"
        ><i class="iconfont icon-jiahao"></i> {{ $t('user.doAdd') }}</el-button
      >
      <apiot-tag
        :itemTheme="3"
        v-show="JSON.stringify(orgObj) !== '{}' || orgObj.name"
        class="m-r-6"
        @deleteSelf="handleClose"
        :item="orgObj.name"
        itemIconClass="icon-zuzhi"
      ></apiot-tag>
    </el-form-item>
    <apiot-dialog
      :visible.sync="dialogVisible"
      :title="$t('user.orgName')"
      :modal-append-to-body="true"
      v-on:sure-click="relationFunction"
      v-on:cancle-click="hide"
    >
      <Organization
        ref="org"
        :selected="selected"
        :isSingle="true"
      ></Organization>
    </apiot-dialog>
  </div>
</template>

<script>
import Organization from '@/views/Role/RoleContent/DesignDetial/Organization/organization';

export default {
  inheritAttrs: false,
  props: {
    orgObj: {
      type: Object,
      default: () => {},
    },
    configData: {
      type: Object,
    },
    parent: {
      type: Object,
    },
  },
  data() {
    return {
      input: '',
      dialogVisible: false,
      selected: [],
    };
  },
  components: { Organization },
  computed: {},
  watch: {
    orgObj: {
      handler(v) {
        if (v.id) {
          this.parent.form[this.configData.compId] = v.id;
          // console.log(v.id);
        } else {
          this.parent.form[this.configData.compId] = '';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    show() {
      this.dialogVisible = true;
      const list = [this.orgObj].map((item) => ({ id: item.id }));
      this.selected = list;
    },
    hide() {
      this.dialogVisible = false;
    },
    relationFunction() {
      const list = this.$refs.org ? this.$refs.org.selectKeys : [];
      if (!list.length) {
        this.$message({
          type: 'warning',
          message: this.$t('user.addOrgData'),
        });
        return;
      }
      const orgObj = this.$refs.org.selectKeys[0];
      this.$emit('doEditOrg', orgObj);
      this.dialogVisible = false;
    },
    handleClose() {
      // 删除标签
      this.$emit('doEditOrg', {});
    },
  },
};
</script>
<style lang="scss" scoped>
.orgWrap {
  padding: 0px 15px 18px 20px;
  box-sizing: border-box;
  .icon-jiahao {
    vertical-align: bottom;
    color: #aaaaaa;
  }

  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-dialog__body {
      padding: 0 20px;
    }
    .wz {
      line-height: 30px;
    }
    .el-tree__empty-block {
      min-height: 300px;
    }
    .el-button--mini {
      padding: 0 8px;
      border: 1px dashed #e9e9e9;
      font-size: 14px;

      &:hover {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }

      &:focus {
        border: 1px dashed $--color-primary;
        background: $--hover-color;

        & .icon-jiahao {
          color: $--color-primary;
        }
      }
    }

    .el-tag {
      margin-left: 4px;
      height: 30px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 30px;
      color: #333333;
      background: #e5f0ff;
      line-height: 30px;
      border: none;

      & > .icon-zuzhi {
        margin-right: 2px;
        vertical-align: middle;
        color: #4789f5;
      }
    }

    .el-tag .el-tag__close {
      top: 0;
      color: #aaaaaa;
      font-size: 16px;

      &:hover {
        color: #6b798d;
        background: none;
      }
    }
  }
}
</style>
