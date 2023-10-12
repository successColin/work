<!-- 知识库 页面 -->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <left :sideWidth="239"></left>
    </template>
    <template>
      <knowledge-content></knowledge-content>
    </template>
  </apiot-content>
</template>

<script>
import Left from './Left';
import knowledgeContent from './Content';

export default {
  name: 'knowledge',
  data() {
    return {
      userData: {}, // 用户状态枚举
    };
  },

  components: {
    Left,
    knowledgeContent,
  },

  computed: {},

  mounted() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
