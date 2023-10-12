/**
* @name: index
* @author: DELL
* @date: 2023/8/30 10:51
* @description：index
* @update: 2023/8/30 10:51
*/
<!-- 页面 -->
<template>
  <apiot-page-tabs
      class="audio"
      v-model="currentTab"
      :tabsArr="tabsArr"
  >
    <GlassesMeetingList slot="glassesMeetingList"/>
    <ConferenceHistoryList slot="conferenceHistoryList"/>
  </apiot-page-tabs>
</template>

<script>
import ConferenceHistoryList from './components/conferenceHistoryList/index';
import GlassesMeetingList from './components/glassesMeetingList/index';

export default {
  data() {
    return {
      currentTab: 'glassesMeetingList',
      tabsArr: [
        {
          label: 'audio.glasses',
          slotName: 'glassesMeetingList',
          key: 'glassesMeetingList',
          lazy: true,
        },
        {
          label: 'audio.history',
          slotName: 'conferenceHistoryList',
          key: 'conferenceHistoryList',
          lazy: true,
        },
      ]
    };
  },

  components: {
    GlassesMeetingList,
    ConferenceHistoryList
  },

  computed: {},

  mounted() {
  },

  methods: {
  },
  name: 'audioManage',
};
</script>

<style lang='scss' scoped>
.audio{
  ::v-deep{
    .tabs .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content{
      height: calc(100% - 42px);
    }
  }
}
</style>
