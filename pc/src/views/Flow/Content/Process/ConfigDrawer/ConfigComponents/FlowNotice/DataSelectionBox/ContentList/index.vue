/**
* @name: index
* @author: DELL
* @date: 2021/10/27 14:49
* @description：index
* @update: 2021/10/27 14:49
*/
<!-- 页面 -->
<template>
  <div class="wrap">
    <div class="contentWrap">
      <div class="contentHeader">消息模板</div>
      <Template
        class="contentMain"
        :showRadio="true"
        :isMute="false"
        :showSelection="false"
        ref="messageTemplate"
        selectName="id"
        v-bind="$attrs"
      />
      <div class="footerWrap">
        <el-button @click="$emit('update:isShow', false)">取消</el-button>
        <el-button type="primary" @click="handleOk">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Template from '@/views/MessageTemplate';

export default {
  data() {
    return {};
  },

  components: { Template },

  computed: {},

  mounted() {},

  methods: {
    handleOk() {
      const { selectKeys = {} } = this.$refs.messageTemplate;
      // console.log(selectKeys, 'selectKeys');
      const keys = Object.keys(selectKeys);
      if (keys.length > 1) {
        this.$emit('chooseTemplate', selectKeys);
      }
      this.$emit('update:isShow', false);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.wrap {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  right: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);

  .contentWrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    background-color: #f6f6f8;

    .contentHeader {
      height: 46px;
      padding-left: 10px;
      line-height: 46px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      border-bottom: 1px solid #e9e9e9;
      box-sizing: border-box;
    }

    ::v-deep {
      .el-tabs__header {
        padding: 0;
        position: relative;
        margin: 0 0 15px;
        box-shadow: none;
      }

      .el-drawer {
        top: 0;
      }

      .el-drawer__header {
        display: block;
      }

      .el-dialog__close {
        display: none;
      }

      .el-tabs__nav-scroll {
        display: block;
        height: 38px;
      }

      .el-tabs__item {
        padding: 0 20px;
        height: 40px;
        box-sizing: border-box;
        line-height: 40px;
        display: inline-block;
        list-style: none;
        font-size: 13px;
        font-weight: 500;
        color: #303133;
        position: relative;
        box-sizing: border-box;
      }

      .tabs .el-tabs__header {
        height: 40px;
        line-height: 40px;
      }

      .tabs__paneLabel {
        height: 40px;
        line-height: 40px;
        overflow: hidden;
      }

      .pagination .el-pagination {
        left: 0;

        .el-input__inner {
          border-style: solid;
        }
      }
    }

    .contentMain {
      height: calc(100% - 56px);
    }

    .footerWrap {
      position: absolute;
      bottom: 6px;
      right: 10px;
      z-index: 3;
    }
  }
}
</style>
