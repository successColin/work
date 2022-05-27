<template>
  <apiot-dialog
    v-bind="$attrs"
    v-on="$listeners"
    destroy-on-close
    title="关联文件"
    class="knowledge"
    :append-to-body="true"
    :isBigDialog="true"
    @sure-click="sureClick"
  >
    <Content
      v-if="knowledgeShow"
      :isDialog="true"
      :selectedList.sync="selectedList"
      :getFilterIds="getRelateIds"
    ></Content>
  </apiot-dialog>
</template>

<script>
const Content = () => import('../../../../../views/Knowledge/Content');

export default {
  name: '',
  props: {
    getRelateIds: {
      type: Array
    },
    knowledgeShow: {
      type: Boolean
    }
  },
  data() {
    return {
      selectedList: []
    };
  },
  components: {
    Content
  },
  mounted() {},
  methods: {
    sureClick() {
      this.$emit('update:visible', false);
      this.$emit('knowledgeSelected', this.selectedList);
    }
  }
};
</script>

<style lang='scss' scoped>
.knowledge {
  ::v-deep {
    .el-dialog__body {
      padding-top: 0;
    }
    .contentWrap .contentTypeWrap {
      height: calc(100% - 42px);
    }
    .pathWrap {
      border-top: 0 none;
      height: 42px;
      line-height: 42px;
      .pathAllWrap {
        margin-top: 14px;
      }
    }
  }
}
</style>
