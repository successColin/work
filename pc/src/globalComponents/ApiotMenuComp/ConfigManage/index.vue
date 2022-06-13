<template>
  <div class="configManage">
    <div
      class="configManage__del"
      :class="[{ btnAreaStyle: curCompType === 3 }]"
      v-show="showDel"
      v-if="delHid"
      @click.stop="delChild"
    >
      <i class="iconfont icon-shanchu"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //   是否展示删除
    showDel: {
      type: Boolean
    },
    curCompType: {
      type: Number
    },
    delHid: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    delChild() {
      this.$emit('delChild');
    }
  }
};
</script>

<style lang='scss' scoped>
.configManage {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 1;
  &:hover .configManage__del {
    display: block !important;
  }

  &__del {
    position: absolute;
    top: 6px;
    right: 10px;
    width: 32px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    background: #ffffff;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.14);
    border-radius: 4px;
    i {
      font-size: 16px;
      color: #bbc3cd;
      &:hover {
        color: $--color-primary;
      }
    }
    &.btnAreaStyle {
      top: 0;
      right: 0;
      width: 18px;
      height: 18px;
      line-height: 18px;
      background: rgba(0, 0, 0, 0.4);
      box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.14);
      border-radius: 4px;
      i {
        font-size: 12px;
        color: #fff;
        &:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
