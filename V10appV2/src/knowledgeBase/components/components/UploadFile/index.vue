<!--
 * @Descripttion: 上传文件按钮
 * @Author: ytx
 * @Date: 2022-02-23 16:54:14
 * @Last Modified by: ytx
 * @Last Modified time: 2022-02-23 16:54:14
-->
<template>
  <section>
    <!-- 加号按钮 -->
    <div class="addButton" @click="handleAdd">
      <i class="appIcon appIcon-tianjiagongneng"></i>
    </div>
    <!-- 上传 -->
    <l-file ref="lFile"></l-file>
  </section>
</template>

<script>
import lFile from './l-file/l-file';

export default {
  data() {
    return {};
  },
  components: {
    lFile
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    handleAdd() {
      /**
       * currentWebview: 当前webview
       * url：上传接口地址
       * name：附件key,服务端根据key值获取文件流，默认file,上传文件的key
       * header: 上传接口请求头
       */
      console.log('--------------------');
      this.$refs.lFile.upload({
        // #ifdef APP-PLUS
        // （app端必传）nvue页面使用时请查阅nvue获取当前webview的api，当前示例为vue窗口
        currentWebview: this.$mp.page.$getAppWebview(),
        // #endif
        // 替换为你的上传接口地址
        url: 'http://hlapi.jwell56.com/dropbox/document/upload',
        // 服务端接收附件的key
        name: 'file',
        // 根据你接口需求自定义 (优先不传content-type,安卓端无法收到参数再传)
        header: {
          Authorization:
            'bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mbyI6eyJ1c2VyTmFtZSI6',
          uid: '27682',
          client: 'app',
          accountid: 'DPOA9487'
        }

        // 限制选择附件的大小上限，默认10M
        // maxSize: 20,

        // 若需要在body单独添加附件名或附件大小如下方式传入组件：
        // addName: '后端要的附件名称字段key,此处请勿写name的同值如(file)，会覆盖name',
        // addSize: '后端要的附件大小字段key'

        // body参数直接写key,value,如：
        // date: '2020-1-1',
        // key2: 'value2',
      });
    }
  }
};
</script>
<style lang='scss' scoped>
section {
  .addButton {
    position: fixed;
    bottom: 150rpx;
    right: 80rpx;
    width: 100rpx;
    height: 100rpx;
    background: #4689f5;
    box-shadow: 0px 4rpx 11rpx 0px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    .appIcon-tianjiagongneng {
      font-size: 40rpx;
    }
  }
}
</style>
