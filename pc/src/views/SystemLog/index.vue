<!--
 * @Author: sss
 * @Date: 2021-05-19 10:22:30
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-19 10:22:30
 * @Desc: 系统日志12
-->
<template>
  <apiot-page-tabs
    class="log"
    v-model="currentTab"
    :tabsArr="tabsArr"
    @tab-click="tabClick"
  >
    <div slot="top-btns" class="log__btn">
      <apiot-button
        class="item"
        @click="topBtnClick(item.funcName)"
        v-for="(item, index) in topButtons"
        :key="index"
      >
        <i :class="`iconfont ${item.icon} m-r-4`"></i>
        {{ $t(item.name) }}
      </apiot-button>
    </div>
    <oprate-log ref="operationLog" slot="OperationLog"></oprate-log>
    <login-log slot="LoginLog"></login-log>
    <exception-log ref="exceptionLog" slot="ExceptionLog"></exception-log>
  </apiot-page-tabs>
</template>

<script>
import OprateLog from './components/TabContent/OprateLog';

export default {
  name: 'systemLog',
  components: {
    OprateLog,
    LoginLog: () => import('./components/TabContent/LoginLog'),
    ExceptionLog: () => import('./components/TabContent/ExceptionLog')
  },

  props: {},

  data() {
    return {
      currentTab: 'operationLog',
      buttonArr: {
        operationLog: [
          {
            icon: 'icon-xinzengwenjianjia',
            name: 'systemLog.transfer',
            funcName: 'handleTransfer'
          }
        ],
        loginLog: [],
        exceptionLog: [
          { icon: 'icon-xinzengwenjianjia', name: 'common.delete1', funcName: 'deleteLog' }
        ]
      },
      tabsArr: [
        {
          label: 'systemLog.operationLog',
          slotName: 'OperationLog',
          key: 'operationLog'
        },
        {
          label: 'systemLog.loginLog',
          slotName: 'LoginLog',
          key: 'loginLog'
        },
        {
          label: 'systemLog.exceptionLog',
          slotName: 'ExceptionLog',
          key: 'exceptionLog'
        }
      ]
    };
  },

  computed: {
    topButtons() {
      return this.buttonArr[this.currentTab];
    }
  },

  methods: {
    topBtnClick(funcName) {
      this[funcName]();
    },
    // 操作日志迁移
    handleTransfer() {
      this.$refs.operationLog.showTransferLog();
    },
    // 异常日志删除
    deleteLog() {
      this.$refs.exceptionLog.deleteLog();
    },
    // 切换tab
    tabClick(tab) {
      this.$broadcast('changeHeight');
      this.$nextTick(() => {
        tab.$children[0].initList();
      });
    }
  },

  mounted() {}
};
</script>

<style lang='scss' scoped>
.icon-xinzengwenjianjia {
  color: $--color-primary;
}
.log__btn {
  .item {
    margin-right: 10px;
  }
}
</style>
