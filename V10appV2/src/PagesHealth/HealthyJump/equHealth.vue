<!-- 设备异常 -->
<template>
  <view>
    <list-format :data="data" :isEquHealth="isEquHealth" @click="handleTip"></list-format>
  </view>
</template>

<script>
import ListFormat from './components/ListFormat.vue';

export default {
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
  },
  components: {
    ListFormat,
  },
  data() {
    return {
      isEquHealth: true,
    };
  },
  computed: {
  },
  onLoad(options) {
  },
  methods: {
    handleTip() {
    }
  },
  mounted() {

  }
};
</script>
