<template>
  <transition name="move-top">
    <section
      class="dropdownMenu"
      v-show="isHover"
      @mouseleave="$emit('update:isHover', false)"
    >
      <ul class="dropdownMenu__list">
        <li
          class="dropdownMenu__item m-r-10"
          v-for="(item, index) in menuArr"
          :key="index"
        >
          <i
            :class="`iconfont ${item.icon.icon}`"
            :style="`color:${item.icon.color}`"
          ></i>
          <p class="font__ellipsis" :title="item.menuName">
            {{ item.menuName }}
          </p>
        </li>
      </ul>
    </section>
  </transition>
</template>

<script>
export default {
  props: {
    isHover: {
      type: Boolean,
      default: false
    },
    menuArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
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
.dropdownMenu {
  position: fixed;
  left: 0;
  right: 0;
  height: 140px;
  top: $layoutHeader;
  background-color: #fff;
  overflow-x: auto;
  overflow-y: hidden;
  text-align: center;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.09);
  .icon-dingbugengduoyincang {
    font-size: 16px;
  }
  &__list {
    display: inline-block;
    margin-top: 16px;
    white-space: nowrap;
  }
  &__item {
    display: inline-block;
    vertical-align: top;
    width: 110px;
    height: 106px;
    padding-top: 20px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background: #f1f7ff;
    }
    .iconfont {
      font-size: 40px;
    }
    p {
      margin-top: 14px;
      font-size: 13px;
      color: #333;
    }
  }
}
</style>
