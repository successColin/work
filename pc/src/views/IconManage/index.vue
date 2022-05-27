<!-- 角色管理 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <left :sideWidth="239"></left>
    </template>
    <template>
      <icon-content :iconMessage="iconMessage" :baseType="active">
      </icon-content>
    </template>
  </apiot-content>
</template>

<script>
import Left from '@/views/IconManage/Left';
import IconContent from '@/views/IconManage/Content';

export default {
  name: 'iconManage',
  data() {
    return {
      iconMessage: {},
      active: 1
    };
  },

  components: {
    Left,
    IconContent
  },

  computed: {},

  mounted() {
    this.$bus.$on('iconArr', (message) => {
      this.iconMessage = message.data;
      this.active = message.baseType;
    });
  },
  beforeDestroy() {
    this.$bus.$off('iconArr', () => {});
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
</style>
