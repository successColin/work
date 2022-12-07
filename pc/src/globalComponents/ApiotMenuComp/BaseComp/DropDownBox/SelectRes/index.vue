<template>
  <div class="option" v-if="configData.dropDownStyle === 2">
    <span class="option__bg" :style="getStyle">{{ item.name }}</span>
  </div>
  <div class="option" v-else-if="configData.dropDownStyle === 3 && item.icon">
    <span class="option__self">
      <img :src="$parseImgUrl(item.icon.imgUrl)" v-if="item.icon.imgUrl" />
      <i
        v-else
        :class="`iconfont ${item.icon.icon}`"
        :style="`color:${item.icon.color}`"
      ></i
      >{{ item.name }}</span
    >
  </div>
  <div class="option" v-else>
    {{ item.name }}
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    configData: {
      type: Object
    },
    item: {
      type: Object
    }
  },
  data() {
    return {};
  },
  computed: {
    getStyle() {
      const { item } = this;
      let style = '';
      if (item.color) {
        style += `background:${item.color};`;
      }
      if (item.fontColor) {
        style += `color:${item.fontColor};`;
      }
      return style;
    }
  },
  components: {}
};
</script>

<style lang='scss' scoped>
.option {
  &__bg {
    max-width: 100%;
    box-sizing: border-box;
    display: inline-block;
    padding-left: 10px;
    padding-right: 10px;
    height: 24px;
    background: $--color-primary;
    line-height: 24px;
    text-align: center;
    border-radius: 4px;
    color: #fff;
  }
  &__self {
    display: flex;
    align-items: center;
    img {
      width: 24px;
    }
    i {
      font-size: 24px;
      margin-right: 4px;
    }
  }
}
</style>
