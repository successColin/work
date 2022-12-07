/**
* @name: index
* @author: DELL
* @date: 2021/12/13 16:25
* @description：index
* @update: 2021/12/13 16:25
*/
<!-- 页面 -->
<template>
  <div class="loadingWrap">
    <div class="loadingContent">
      <div class="outerLoading">
        <div class="outerAnimation">

        </div>
      </div>
      <div class="innerLoading"></div>
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
  },

  methods: {},
  name: 'index'
};
</script>

<style lang='scss' scoped>
.loadingWrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.6);

  .loadingContent {
    position: relative;
    width: 100%;
    height: 100%;
    .outerLoading {
      position: absolute;
      width: 92px;
      height: 92px;
      top: 50%;
      left: 50%;
      transform: translate(-56%, -44%);
      transform-origin: center;
      z-index: 33;

      .outerAnimation{
        width: 100%;
        height: 100%;
        background: url("~@/assets/loadingCircle.svg") no-repeat;
        background-size: 100% 100%;
        animation:turn 1s linear infinite;
      }
    }

    .innerLoading {
      position: absolute;
      width: 120px;
      height: 120px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url("~@/assets/loadingFixed.svg") no-repeat;
      z-index: 111;
    }
  }

}

</style>
