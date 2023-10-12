/**
* @name: longTime
* @author: DELL
* @date: 2023/8/31 9:53
* @description：longTime
* @update: 2023/8/31 9:53
*/
<!-- 页面 -->
<template>
  <apiot-dialog
    title="专家列表"
    class="expertWrap"
    :show-close="false"
    @sure-click="handleOk"
    @cancle-click="handleCancel"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <ExpertManage ref="ExpertManage" :isComponet="true" :key="key"/>
  </apiot-dialog>
</template>

<script>
import bus from '@/utils/bus';
import ExpertManage from '@/views/ExpertManage/index.vue';

export default {
  data() {
    return {
      key: 0
    };
  },

  components: {
    ExpertManage
  },

  computed: {
    userList() {
      return this.$store.state.remoteManage.userList;
    },
  },

  mounted() {
  },

  methods: {
    handleOk() {
      const { selectKeys } = this.$refs.ExpertManage;
      const arr = selectKeys.reduce((init, pre) => {
        if (this.userList.some((item) => item.id === pre.userid)) return init;
        return init.concat([pre]);
      }, []);
      if (!arr.length) {
        this.$message.error('请选择专家进行邀请');
        return;
      }
      const ids = arr.map((item) => `${item.userid}`);
      this.$emit('update:visible', false);
      bus.$emit('groupInvite', ids);
      this.key += 1;
    },
    handleCancel() {
      this.key += 1;
    }
  },
  beforeDestroy() {
  },
  name: 'expertList',
};
</script>

<style lang='scss' scoped>
.expertWrap{
  ::v-deep{
    .el-dialog__body{
      padding: 0 20px;
    }
    .expert{
      width: 100%;
      height: 100%;
    }
  }
}
</style>
