<!-- 故障工单 -->
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
      keywords: '',
    };
  },
  computed: {

  },
  methods: {
  },
  mounted() {

  }
};
</script>
