<!-- 设备故障频率 -->
<template>
  <view>
    <list-format :data="data" :isEquHealth="isEquHealth"></list-format>
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
      isEquHealth: true
    };
  },
  computed: {

  },
  onLoad(options) {
  },
  methods: {
  },
  mounted() {

  }
};
</script>
