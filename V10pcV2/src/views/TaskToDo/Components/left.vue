/**
* @name: left
* @author: DELL
* @date: 2023/7/3 14:19
* @description：left
* @update: 2023/7/3 14:19
*/
<!-- 页面 -->
<template>
  <div class="left">
    <div class="largeList">
      <div
          v-for="(item) in flowTypeList"
          :key="item.name"
          class="largeItem"
          :class="{ active: activeKey === item.name }"
          @click="choose(item)"
      >
        <span :class="`iconfont ${item.icon} m-r-10`" :style="getStyles(item)"></span>
        {{ item.name }}
        <div class="count" v-if="item.count"> {{ num }}</div>
      </div>
      <el-divider></el-divider>
    </div>
    <div class="smallList">
      <div class="smallItem">
        <span class="iconfont icon-wofaqide m-r-10" style="color: #34C7BE"></span>
        我发起的
      </div>
      <div>

      </div>
    </div>
    <div class="childList">
      <div
          class="flowByMeItem"
          v-for="item in flowByMe"
          :key="item.name"
          @click="choose(item)"
          :class="{ active: activeKey === item.name }"
      >
        <span class="box m-r-10"></span>{{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { getMyTodoList } from '@/api/flow';

const eventName = 'flow_End_of_operation';
export default {
  data() {
    return {
      num: 0,
      activeKey: '待我处理',
      flowTypeList: [
        {
          name: '待我处理',
          color: '#EE5E5E',
          icon: 'icon-daiwochuli',
          key: 'LeaveItToMe',
          count: true
        },
        {
          name: '我参与的',
          color: '#FAB71C',
          icon: 'icon-wocanyude',
          key: 'Completed',
        },
        {
          name: '抄送给我',
          color: '#5A80ED',
          icon: 'icon-chaosonggeiwo',
          key: 'CC',
        }
      ],
      flowByMe: [
        {
          name: '草稿箱',
          key: 'DRAFT'
        },
        {
          name: '被驳回',
          key: 'REJECTED'
        },
        {
          name: '进行中',
          key: 'IN_PROGRESS'
        },
        {
          name: '已完成',
          key: 'COMPLETED'
        },
        {
          name: '已撤回',
          key: 'REVOKED'
        }
      ]
    };
  },

  components: {},

  computed: {
    getStyles() {
      return function (row) {
        return {
          color: row.color
        };
      };
    }
  },

  mounted() {
    setTimeout(() => {
      this.$emit('switching_process_types', 'LeaveItToMe');
    }, 50);
    this.init();
    this.$bus.$on(eventName, () => {
          this.init();
        });
  },

  methods: {
    async init() {
      const { total } = await getMyTodoList({
        current: 1,
        size: 1,
        keywords: ''
      });
      this.num = total;
    },
    choose({
             name,
             key
           }) {
      this.activeKey = name;
      this.$emit('switching_process_types', key);
    }
  },
  beforeDestroy() {
    this.$bus.$off();
  },
  name: 'left',
};
</script>

<style lang='scss' scoped>
.left {
  width: 260px;
  height: 100%;
  padding: 20px 0;
  background: #FFFFFF;
  box-shadow: inset -1px 0px 0px 0px #E9E9E9;
  overflow: auto;

  .largeList {
    width: calc(100% - 40px);
    margin: 0 auto;

    .largeItem {
      width: 220px;
      height: 42px;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 10px;
      background: #ffffff;
      border-radius: 4px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      box-sizing: border-box;

      .iconfont {
        font-size: 22px;
      }

      &.active {
        background: #E5F0FF;
        //transition: all 0.1s ease-in;
      }

      &:hover {
        background: #E5F0FF;
        cursor: pointer;
        //transition: all 0.2s ease-in;
      }

      .count {
        position: absolute;
        right: 10px;
        padding: 4px 8px;
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        background: #4689F5;
        border-radius: 12px;
      }
    }

    ::v-deep {
      .el-divider--horizontal {
        margin: 10px 0;
      }

      .el-divider {
        background: #E9E9E9;
      }
    }
  }

  .smallList {
    width: calc(100% - 40px);
    margin: 0 auto;

    .smallItem {
      width: 220px;
      height: 42px;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 10px;
      background: #ffffff;
      border-radius: 4px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      box-sizing: border-box;

      .iconfont {
        font-size: 22px;
      }
    }
  }

  .childList {
    width: calc(100% - 40px);
    margin: 0 auto;

    .flowByMeItem {
      display: flex;
      padding: 0 20px;
      height: 36px;
      align-items: center;

      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      border-radius: 4px;
      box-sizing: border-box;
      cursor: pointer;

      &:hover {
        background: #F1F7FF;

        .box {
          background: #4689F5;
        }

        //transition: all 0.2s ease-in;
      }

      &.active {
        background: #F1F7FF;
        color: #333333;

        .box {
          background: #4689F5;
        }
      }

      .box {
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #D5DAE0;
        border-radius: 50%;
      }
    }
  }
}
</style>
