<template>
  <div class="orgWrap">
    <el-button size="mini" @click="show"
      ><i class="iconfont icon-jiahao"></i> {{ $t('user.doAdd') }}</el-button
    >
    <el-tag
      v-show="JSON.stringify(orgObj) !== '{}'"
      size="small"
      closable
      @close="handleClose"
    >
      <i class="iconfont icon-zhiwei"></i>{{ orgObj.name }}
    </el-tag>
    <apiot-dialog
      :visible.sync="dialogVisible"
      :title="$t('user.addPos')"
      :modal-append-to-body="false"
      v-on:sure-click="relationFunction"
      v-on:cancle-click="hide"
    >
      <Organization
        ref="org"
        :selected="selected"
        type="position"
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
      default: () => {}
    }
  },
  data() {
    return {
      input: '',
      selected: [],
      dialogVisible: false
    };
  },
  components: { Organization },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    show() {
      this.dialogVisible = true;
      const list = [this.orgObj].map((item) => ({ id: Number(item.id) }));
      this.selected = list;
      // console.log(this.selected);
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     this.$refs.org.doCheckTreeNodes(list);
      //   }, 100);
      // });
    },
    hide() {
      this.dialogVisible = false;
    },
    relationFunction() {
      const list = this.$refs.org ? this.$refs.org.selectKeys : [];
      if (!list.length) {
        this.$message({
          type: 'warning',
          message: this.$t('common.placeSelectData')
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
    }
  }
};
</script>
<style lang='scss' scoped>
.orgWrap {
  .icon-jiahao {
    vertical-align: bottom;
    color: #aaaaaa;
  }

  ::v-deep {
    .el-dialog__body {
      padding: 0 20px;
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
      background: #ffede1;
      line-height: 30px;
      border: none;

      & > .icon-zhiwei {
        margin-right: 2px;
        vertical-align: middle;
        color: rgb(252, 130, 86);
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
