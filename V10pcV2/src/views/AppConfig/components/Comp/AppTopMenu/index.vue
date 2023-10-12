<template>
  <div
    class="appMenu"
    @click.stop="selectActive"
    :class="[
      { borderLight: config.compId === activeObj.compId },
      { hasImg: config.icon.imageUrl || config.icon.icon },
    ]"
  >
    <i
      class="iconfont icon-jiahao"
      v-if="!config.icon.imageUrl && !config.icon.icon"
    ></i>
    <img
      :src="$parseImgUrl(config.icon.imageUrl)"
      alt=""
      v-if="config.icon.imageUrl"
      class="full"
    />
    <i
      v-else
      :class="`full iconfont ${config.icon.icon}`"
      :style="`color: ${config.icon.color}`"
    ></i>
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

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style lang='scss' scoped>
.appMenu {
  width: 30px;
  height: 30px;
  line-height: 30px;
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  text-align: center;
  i {
    color: #bbc3cd;
  }
  &.borderLight {
    border-color: $--color-primary;
    i {
      color: $--color-primary;
    }
  }
  &:hover {
    border-color: $--color-primary;
    i {
      color: $--color-primary;
    }
  }
  .full {
    display: block;
    width: 30px;
    height: 30px;
    font-size: 30px;
  }
  // &.hasImg {
  //   border: 0 none;
  // }
}
</style>
