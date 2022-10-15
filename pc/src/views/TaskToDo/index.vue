/**
* @name: index
* @author: DELL
* @date: 2021/9/23 14:33
* @description：index
* @update: 2021/9/23 14:33
*/
<!-- 页面 -->
<template>
  <apiot-tabs
      v-on="$listeners"
      v-bind="$attrs"
      :tabsArr="tabsArr"
  >
    <template v-slot:LeaveItToMe>
      <list
          @changeTabsTitle="changeTabsTitle"
          com="LeaveItToMe"
          ref="LeaveItToMe"
          :activeName="activeName"
          @closeApproval="close"
          :tabsCount="tabsCount"
      />
    </template>
    <template v-slot:IInitiatedIt>
      <list
          com="IInitiatedIt"
          ref="IInitiatedIt"
          :activeName="activeName"
          @closeApproval="close"
          :tabsCount="tabsCount"
      />
    </template>
    <template v-slot:Completed>
      <list
          @changeTabsTitle="changeTabsTitle"
          com="Completed"
          ref="Completed"
          :activeName="activeName"
          @closeApproval="close"
          :tabsCount="tabsCount"
      />
    </template>
    <template v-slot:CC>
      <list
          @changeTabsTitle="changeTabsTitle"
          com="CC"
          ref="CC"
          :activeName="activeName"
          @closeApproval="close"
          :tabsCount="tabsCount"
      />
    </template>
  </apiot-tabs>
</template>

<script>
import List from './Components/List';

export default {
  props: {
    activeName: {
      type: String,
      default: 'LeaveItToMe'
    }
  },
  data() {
    return {
      tabsCount: [
        {
          total: 0,
          compName: 'LeaveItToMe',
          key: 'LeaveItToMe',
        },
        {
          total: 0,
          compName: 'Completed',
          key: 'Completed',
        },
      ],
    };
  },

  components: {
    List
  },
  watch: {
    activeName: {
      deep: true,
      immediate: true,
      handler(newValue) {
        if (newValue && this.$refs[newValue]) {
          const { selectValue, init } = this.$refs[newValue];
          init(selectValue);
        }
      }
    }
  },

  computed: {
    tabsArr() {
      const arr = [
        {
          label: '待我处理',
          compName: 'LeaveItToMe',
          key: 'LeaveItToMe',
        },
        {
          label: '已完成的',
          compName: 'Completed',
          key: 'Completed',
        },
        {
          label: '我发起的',
          compName: 'IInitiatedIt',
          key: 'IInitiatedIt',
        },
        {
          label: '抄送给我',
          compName: 'CC',
          key: 'CC',
        },
      ];
      return arr.map((item) => {
        const obj = this.tabsCount.find((values) => values.key === item.key);
        if (obj && obj.total) {
          const { label } = item;
          return {
            ...item,
            label: `${label}(${obj.total})`
          };
        }
        return item;
      });
    }
  },

  mounted() {
  },

  methods: {
    close() {
      this.$emit('changeMessage');
    },
    changeTabsTitle(arr) {
      this.tabsCount = arr;
    }
  },
};
</script>

<style lang='scss' scoped>
::v-deep{
  .el-tabs__item{
    padding: 0 30px;
  }
  #tab-IInitiatedIt {
    padding-left: 60px;
    &::after{
      content: '|';
      color: #E0E0E0;
      position: absolute;
      left: 10px;
      font-weight: normal;
    }
  }
}
</style>
