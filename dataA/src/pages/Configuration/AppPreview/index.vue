/**
* @name: index
* @author: DELL
* @date: 2022/7/23 13:54
* @description：index
* @update: 2022/7/23 13:54
*/
<!-- 页面 -->
<template>
  <div class="preWrap">
    <div class="preContent">
      <div class="prePhoneWrap">
        <div class="previewDialogWrap">
          <Preview designType="APP"/>
        </div>
      </div>
    </div>
    <div class="qrContent">
      <div class="qrWrap">
        <qrcode-vue :value="`${preUrl}?designTypePreview=APP`"></qrcode-vue>
      </div>
      <div class="qrDes">手机扫码</div>
      <div class="qrDes">预览效果</div>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'

const Preview = () => import('@/pages/Preview/index');

export default {
  props: {
    preUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    };
  },

  components: {
    Preview,
    QrcodeVue
  },

  computed: {},

  mounted() {
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.preWrap {
  width: 100%;
  height: 100%;
  display: flex;

  .preContent {
    width: 430px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .prePhoneWrap {
      width: calc(276px * 1.05);
      height: calc(496px * 1.05);
      display: flex;
      align-items: center;
      justify-content: center;
      background-image: url("~@/assets/phone.svg");
      background-size: 100% 100%;

      .previewDialogWrap {
        width: calc(100% - 45px);
        height: calc(100% - 45px);
        border-radius: 25px;
        overflow: hidden;
        //background: #ffffff;
      }

    }
  }

  .qrContent {
    flex: 1;
    margin-top: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    right: 55px;
    border-left: 1px solid #2F437F;
    padding-left: 57px;

    .qrWrap {
      width: 100px;
      height: 100px;
      padding: 5px;
      margin-bottom: 6px;
      background: #192757;
      border: 1px solid #2F437F;
    }
    .qrDes{
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 18px;
    }
  }
  ::v-deep{
    .content .equalWidthRatio{
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>
