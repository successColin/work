/**
* @name: index
* @author: DELL
* @date: 2023/1/5 15:50
* @description：index
* @update: 2023/1/5 15:50
*/
<!-- 页面 -->
<template>
  <div class="wrap">
    <ApproveView
        v-if="approvalInfo.pcPanelId"
        :approvalInfo="approvalInfo"
        com="LeaveItToMe"
        :nodeConfig="nodeConfig"/>
  </div>
</template>

<script>
import { ssoLogin, fetchTaskInfo } from '@/api/login';
import { Encrypt } from '_u/utils';
import { getNodeInfo } from '@/api/flow';
import ApproveView from '../TaskToDo/Components/ApproveView/index';

export default {
  data() {
    return {
      nodeConfig: {},
      approvalInfo: {}
    };
  },

  components: {
    ApproveView
  },

  computed: {
    getObj() {
      const obj = sessionStorage.getItem('rsaTokenObjInV10') || '{}';
      const newObj = JSON.parse(obj);
      return newObj;
    }
  },

  mounted() {
    const {
      uid,
      detailId
    } = this.$route.query;
    if (!this.getObj[uid]) {
      this.init(uid, detailId);
    } else {
      this.getTaskConfigInfo(detailId);
    }
  },
  methods: {
    async init(uid, detailId) {
      const res = await ssoLogin({ rsaToken: encodeURIComponent(uid) });
      localStorage.setItem('token', Encrypt(res));
      const obj = this.getObj || {};
      obj[uid] = true;
      sessionStorage.setItem('rsaTokenObjInV10', JSON.stringify(obj));
      await this.getTaskConfigInfo(detailId);
    },
    async getTaskConfigInfo(taskId) {
      const res = await fetchTaskInfo({ taskId }) || {};
      const { nodeId } = res;
      this.approvalInfo = res;
      await this.fetchNodeInfo(nodeId);
    },
    async fetchNodeInfo(nodeId) {
      if (!nodeId) return;
      const data = await getNodeInfo({ nodeId }) || {};
      const config = data.attributes ? JSON.parse(data.attributes) : {};
      this.nodeConfig = config;
    }
  },
  beforeDestroy() {
    // localStorage.removeItem('token');
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.wrap {
  width: 100%;
  height: 100%;
  position: relative;
  background: #f6f6f8;
  box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 10%);

  ::v-deep {
    .btnWrap {
      background-color: #fff;
      box-shadow: 0px 2px 4px 0px rgb(0 0 0 / 10%);
      height: 46px;
      line-height: 46px;
      position: relative;
      top: 0;
    }

    .approverContent {
      margin: 10px 10px 0 10px;
      width: calc(100% - 20px);
      height: calc(100% - 46px - 10px);
    }
  }
}
</style>
