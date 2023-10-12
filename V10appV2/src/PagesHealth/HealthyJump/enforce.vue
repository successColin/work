<!-- 信息不完整工单 -->
<template>
  <view>
    <list-format :data="data"></list-format>
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
