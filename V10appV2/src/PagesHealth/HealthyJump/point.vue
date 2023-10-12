<!-- 点巡检 -->
<template>
  <view class="healtyJump">
    <list-format :data="data" :isPoint="isPoint"></list-format>
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
      isPoint: true,
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
