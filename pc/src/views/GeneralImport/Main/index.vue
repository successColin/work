<!--
 * @Descripttion: 通用导入主内容
 * @Author: ytx
 * @Date: 2022-06-08 16:26:17
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-08 16:26:17
-->
<template>
  <div class="mainWrap">
    <!-- 第一行 -->
    <div class="mainWrap__file">
      <file-manage
        class="mainWrap__file--download"
        :num="1"
        dec="下载模板"
        buttonName="下载模板"
      ></file-manage>
      <file-manage
        class="mainWrap__file--upload"
        :num="2"
        dec="上传文件"
        buttonName="下载模板"
        placeholder="请从本地选择你要导入的文件"
        icon="icon-jiaose"
      ></file-manage>
      <el-button type="primary" class="mainWrap__file--button">
        <i class="iconfont icon-jiaose"></i>
        立即导入
      </el-button>
    </div>
  </div>
</template>

<script>
import FileManage from './components/FileManage';

export default {
  data() {
    return {};
  },
  components: {
    FileManage
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
.mainWrap {
  margin: 20px;
  &__file {
    display: flex;
    &--download {
      width: 372px;
      margin-right: 10px;
    }
    &--upload {
      flex: 1;
      margin-right: 10px;
    }
    &--button {
      height: 36px;
    }
  }
}
</style>
