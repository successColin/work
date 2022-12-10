<template>
  <div class="listItem" ref="listItem">12343456565</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default() {
        return {};
      }
    },
    index: Number
  },
  data() {
    return {
      // 是否可以容纳你
      canContent: true
    };
  },
  components: {},
  computed: {},
  watch: {
    canContent(V) {
      if (!V) {
        this.$emit('cannotContent', {
          i: this.index,
          value: this.value
        });
      }
    }
  },
  mounted() {
    this.getHeig();
  },
  methods: {
    getHeig() {
      this.canContent = false;
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
