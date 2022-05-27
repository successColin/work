<template>
  <div
    class="rotateImg comp"
    @click.stop="selectActive"
    :class="[{ borderLight: config.compId === activeObj.compId }]"
  >
    <img :src="getImgUrl" alt="" v-if="getImgUrl" />
    <p v-else>轮播图</p>
  </div>
</template>

<script>
import compMixin from '../comp';

export default {
  mixins: [compMixin],
  data() {
    return {};
  },

  components: {},

  computed: {
    getImgUrl() {
      const obj = this.config.imgArr.find((item) => item.imgUrl);
      if (obj) {
        return obj.imgUrl;
      }
      return '';
    }
  },

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
@import '../comp.scss';
.rotateImg {
  height: 110px;
  img {
    width: 100%;
    height: 100%;
  }
  p {
    text-align: center;
    line-height: 110px;
    font-size: 13px;
    font-weight: 400;
    color: #aaaaaa;
  }
}
</style>
