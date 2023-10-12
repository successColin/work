<!-- 用户管理 页面 -->
<template>
  <apiot-content :showSkeleton="showSkeleton">
    <template v-slot:sidebar>
      <left-tree
        :sideWidth="239"
        ref="left"
        v-if="allData"
        :fatherDefaultType="
          allData.typeId === 2 ? leftObj[userConfig.lds] : 'role'
        "
      ></left-tree>
    </template>
    <template>
      <user-config-content
        :userData="userData"
        :allData="allData"
        v-if="allData && allData.typeId === 2"
        :fatherDefaultType="
          allData.typeId === 2 ? leftObj[userConfig.lds] : 'role'
        "
      ></user-config-content>
      <user-content :userData="userData" v-else></user-content>
    </template>
  </apiot-content>
</template>

<script>
import LeftTree from '@/views/Users/Left/left';
import UserContent from '@/views/Users/Main/user';
import UserConfigContent from '@/views/Users/MainConfig/user';
import { getUsersState, getDesignPage } from '@/api/user';

export default {
  name: 'user',
  data() {
    return {
      userData: {}, // 用户状态枚举
      allData: null,
      leftObj: {
        1: 'org',
        2: 'role',
        3: 'position',
      },
      showSkeleton: false,
    };
  },

  components: {
    LeftTree,
    UserContent,
    UserConfigContent,
  },

  computed: {
    userConfig() {
      if (this.allData) {
        return this.allData.designPageLayout[0].userConfig;
      }
      return {
        lds: 1,
        resetPas: 1,
        accountStatus: 1,
        leaveJob: 1,
      };
    },
  },

  mounted() {
    this.fetchState();
    this.getConfigData();
  },

  methods: {
    async fetchState() {
      this.userData = await getUsersState({ dictKeys: 'USER_STATE' });
    },
    async getConfigData() {
      this.showSkeleton = true;
      this.allData = await getDesignPage({
        menuId: 6,
      });
      this.$nextTick(() => {
        this.showSkeleton = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
