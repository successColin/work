<!--
 * @Descripttion: 个人中心
 * @version:
 * @Author: tjf
 * @Date: 2021-05-15 11:06:45
 * @LastEditors: tjf
 * @LastEditTime: 2021-05-31 09:43:54
-->
<!-- treeTable -->
<template>
  <user-center-tabs
    v-on="$listeners"
    v-bind="$attrs"
    :userCenter.sync="userCenter"
    :userVisible.sync="userCenter.visible"
    @updateStatus="updateStatus"
  ></user-center-tabs>
</template>

<script>
import UserCenterTabs from './components/UserCenterTabs/index';

export default {
  components: {
    UserCenterTabs
  },
  name: 'userCenter',
  data() {
    return {
      tableData: [],
      tenantVisible: false
    };
  },
  props: {
    userCenter: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {},
  mounted() {
    // this.getUserList();
    // console.log(this.userCenter);
  },
  methods: {
    openTenant() {
      this.tenantVisible = true;
    },
    updateStatus() {
      const center = {
        visible: false,
        showType: ''
      };
      this.$emit('update:userCenter', center);
    }
  },
  watch: {}
};
</script>
<style lang='scss' scoped>
</style>
