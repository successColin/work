<template>
  <div :id="id"></div>
</template>
<script setup lang="ts" name="createQrcode">
import qrCode from 'qrcodejs2-fix';
const { width, height, id, text } = defineProps({
  width: {
    type: String,
    default: '100',
  },
  height: {
    type: String,
    default: '100',
  },
  id: {
    type: String,
    required: true,
  },
  text: {
    // 后端返回的二维码地址
    type: String,
    default: '默认值',
  },
});

const createQrcode = () => {
  let qrCodeId = document.getElementById(id);
  if (qrCodeId) {
    // 有新的二维码地址了，先把之前的清除掉
    qrCodeId.innerHTML = '';
  }
  new qrCode(qrCodeId, {
    text, //页面地址 ,如果页面需要参数传递请注意哈希模式#
    width, // 二维码宽度 （不支持100%）
    height, // 二维码高度 （不支持100%）
  });
};

onMounted(() => {
  createQrcode();
});
</script>