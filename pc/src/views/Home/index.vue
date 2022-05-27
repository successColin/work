<!-- 主页面 -->
<template>
  <div class="home">
    <img src="/static/images/sy.png" alt="" />
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
    // console.log('home mounted');
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
.home {
  position: relative;
  color: $--color-primary;
  background-color: #fff;
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
