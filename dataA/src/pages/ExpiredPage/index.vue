/**
* @name: index
* @author: DELL
* @date: 2022/11/25 10:10
* @description：index
* @update: 2022/11/25 10:10
*/
<!-- 页面 -->
<template>
  <div class="contentWrap">
    <div class="page flex-col">
      <img
          class="image_1"
          referrerpolicy="no-referrer"
          :src="require('@/assets/zza.png')"
      />
      <span class="text_1">软件授权已失效~，请联系管理员！</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
    console.log('expired');
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.contentWrap {
  width: 100%;
  height: 100%;
  background-color: rgba(1, 10, 43, 1);
  display: flex;
  align-items: center;
}

.page {
  margin: 0 auto;
  background-color: rgba(1, 10, 43, 1);
  position: relative;
  width: 1440px;
  height: 800px;
  overflow: hidden;
}

.image_1 {
  width: 275px;
  height: 222px;
  margin: 238px 0 0 583px;
}

.text_1 {
  width: 223px;
  height: 20px;
  overflow-wrap: break-word;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  letter-spacing: 0.3499999940395355px;
  text-align: center;
  white-space: nowrap;
  line-height: 20px;
  margin: 23px 0 297px 609px;
}

</style>
