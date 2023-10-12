<!--
 * @Descripttion: 集成 ureport
 * @Author: ytx
 * @Date: 2022-06-22 11:08:34
 * @Last Modified by: ytx
 * @Last Modified time: 2022-06-22 11:08:34
-->
<template>
  <div class="ureport">
    <el-skeleton v-show="loading" :rows="14" animated />
    <iframe ref="Iframe" v-show="!loading" :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
import { Decrypt } from '_u/utils';

export default {
  data() {
    return {
      loading: true
    };
  },
  components: {},
  computed: {
    url() {
      // const { host } = window.location;
      // const ip = host.split(':')[0];
      // const currentUrl = `http://${ip}:8085/ureport/designer`;
      // console.log(`${this.$store.state.globalConfig.ureportConfig.ureportUrl}/ureport/designer`);

      const token = Decrypt(localStorage.getItem('token') || '');
      return `${this.$store.state.globalConfig.ureportConfig.ureportUrl}/ureport/designer?token=${token}&url=${window.location.protocol}//${window.location.host}`;
    }
  },
  watch: {},
  mounted() {
    this.loadingFun();
  },
  methods: {
    loadingFun() {
      this.loading = true;
      const iframe = this.$refs.Iframe;
      iframe.onload = () => {
        this.loading = false;
        console.log(this.loading);
      };
    }
  }
};
</script>
<style lang='scss' scoped>
iframe {
  width: 100%;
  height: 100%;
}
</style>
