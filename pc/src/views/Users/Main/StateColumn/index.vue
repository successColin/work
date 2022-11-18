<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <!--      <div :class="scope.row.userStateDict===1?'onLine':'outLine'">-->
      <!--        <span>{{ scope.row.userStateDictName }}</span>-->
      <!--      </div>-->
      <el-switch
          v-model="scope.row.enabled"
          @change="(v) => change(v, scope.row)"
      >
      </el-switch>
    </template>
  </el-table-column>
</template>

<script>
import { updateUser } from '@/api/user';

export default {
  props: {},
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    async change(enabled, { account, orgId, username, id }) {
      if (account && orgId && username && id) {
        try {
          await updateUser({ account, orgId, username, id, enabled });
        } catch (e) {
          console.log(e);
        }
      }
    },
  }
};
</script>

<style lang='scss' scoped>
.onLine {
  padding: 0 10px;
  display: inline-flex;
  margin-right: 4px;
  background: #E5F0FF;
  border-radius: 4px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4689F5;
  box-sizing: border-box;
  line-height: 24px;
}

.outLine {
  padding: 0 10px;
  display: inline-flex;
  background: #F1F3F6;
  border-radius: 4px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #666666;
  box-sizing: border-box;
  line-height: 24px;
}
</style>
