<template>
  <div
    v-if="data.type !== 'empty'"
    class="add-node-btn-box flex justify-center"
  >
    <div class="add-node-btn"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style lang='scss' scoped>
$bg-color: #f5f5f7;
$line-color: #bbc3cd;
$base-size: 12px;

@mixin btn-bigger() {
  transform: scale(1.2);
  background: #4689f5;
  //box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
  border: none;
  .icon-jiahao {
    color: white;
  }
}
.flex {
  display: flex;
}
.justify-center {
  justify-content: center;
}
.add-node-btn-box {
  width: 220px;
  height: 45px;
  position: relative;
  margin: auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    margin: auto;
    width: 1px;
    height: 100%;
    background-color: $line-color;
  }

  .add-node-btn {
    display: flex;
    justify-content: center;

    .btn {
      width: 24px;
      height: 24px;
      display: block;
      padding: 0;
      //align-items: center;
      border-radius: 50%;
      cursor: pointer;
      outline: none;
      background: #ffffff;
      border: 1px solid $line-color;
      transition: transform 0.5s;

      &:hover {
        @include btn-bigger();
      }

      .icon-jiahao {
        color: $line-color;
      }
    }
  }
}
</style>
