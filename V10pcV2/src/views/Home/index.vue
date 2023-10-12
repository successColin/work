<!-- 主页面 -->
<template>
  <div class="home">
    <img :src="$parseImgUrl(homeImg)" alt="" v-if="showImg" />
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      showImg: false,
    };
  },

  components: {},

  computed: {
    homeImg() {
      const url = this.$store.state.globalConfig.themeConfig.defaultImage;
      // eslint-disable-next-line max-len
      return url && url.substr(0, url.length - 1);
    },
  },

  mounted() {
    setTimeout(() => {
      this.showImg = true;
    }, 1000);
    // console.log('home mounted');
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  color: $--color-primary;
  background-color: #fff;
  overflow: hidden;
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 880px;
    // height: 100%;
  }
}
</style>
