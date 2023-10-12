<!--
 * @Descripttion: 台州石化--样品台账
 * @Author: ytx
 * @Date: 2023-05-30 11:30:10
 * @Last Modified by: ytx
 * @Last Modified time: 2023-05-30 11:30:10
-->
<template>
  <apiot-content>
    <template v-slot:sidebar>
      <left-tree :treeData="treeData" @node-click="handleNodeClikc"></left-tree>
    </template>
    <template>
      <view-content :deviceId="deviceId"></view-content>
    </template>
  </apiot-content>
</template>

<script>
import { getDeviceTree } from '@/api/sampleLedger';
import LeftTree from './components/LeftTree';
import ViewContent from './components/ViewContent';

export default {
  data() {
    return {
      treeData: [],
      deviceId: 0
    };
  },
  components: {
    LeftTree,
    ViewContent
  },
  computed: {},
  watch: {},
  mounted() {
    this.getTree();
  },
  methods: {
    async getTree() {
      this.treeData = await getDeviceTree();
    },
    handleNodeClikc(data) {
      if (data.dataType === 2) {
        this.deviceId = data.id;
      }
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
