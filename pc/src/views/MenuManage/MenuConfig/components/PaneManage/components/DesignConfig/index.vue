<template>
  <section class="designConfig">
    <div class="designConfig__content">
      <PageConfig
        :isPanel="true"
        :sysMenuDesignId="sysMenuDesignId"
        :panelName="panelName"
        @closePanle="closePanle"
      ></PageConfig>
    </div>
  </section>
</template>

<script>
import PageConfig from '../../../PageConfig';

export default {
  name: '',
  props: {
    visible: {
      type: Boolean
    },
    sysMenuDesignId: {
      type: Number
    },
    panelName: {
      type: String
    }
  },
  data() {
    return {};
  },
  mounted() {},
  components: {
    PageConfig
  },
  methods: {
    closePanle() {
      this.$emit('update:visible', false);
    }
  }
};
</script>

<style lang='scss' scoped>
.designConfig {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  right: 0;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  &__content {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
