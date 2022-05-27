/**
* @name: index
* @author: DELL
* @date: 2021/9/22 17:09
* @description：index
* @update: 2021/9/22 17:09
*/
<!-- 页面 -->
<template>
  <apiot-dialog
    title="节点帮助配置"
    :visible.sync="globalVisible"
    @cancle-click="handleCancel"
    @sure-click="handleOk"
    @close="handleCancel"
  >
    <el-form :model="info" v-if="globalVisible">
      <el-form-item label="帮助内容">
        <apiot-input
          type="textarea"
          v-model="info.properties.nodeHelp"
          autocomplete="off"
        ></apiot-input>
      </el-form-item>
    </el-form>
  </apiot-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    activeData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      globalVisible: false,
      info: {
        properties: {
          nodeHelp: ''
        }
      },
      formLabelWidth: '120px'
    };
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler() {
        this.globalVisible = this.visible;
      }
    },
    activeData: {
      immediate: true,
      deep: true,
      handler() {
        this.info = JSON.parse(JSON.stringify(this.activeData));
      }
    }
  },
  components: {},

  computed: {},
  created() {},
  mounted() {},

  methods: {
    handleCancel() {
      this.$emit('handleCancelHelp');
    },
    handleOk() {
      this.$emit('handleSubmit', this.info.properties || {});
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
::v-deep {
  .el-dialog__header,
  .el-dialog__body {
    text-align: left;
  }

  .el-form-item__label {
    padding-bottom: 4px;
    color: #333;
    font-size: 13px;
    font-weight: 600;
    line-height: 23px;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
</style>
