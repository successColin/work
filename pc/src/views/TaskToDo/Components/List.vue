/**
* @name: list
* @author: DELL
* @date: 2021/9/23 14:53
* @description：list
* @update: 2021/9/23 14:53
*/
<!-- 页面 -->
<template>
  <div class="listWrap" v-loading="loading">
    <div class="listContent">
      <div class="conditionWrap">
        <el-radio-group v-model="radio1" size="small" @change="changeStatus">
          <el-radio-button
            v-for="item in radioArr"
            :label="item.value"
            :key="item.value"
            >{{ item.name }}
          </el-radio-button>
        </el-radio-group>
        <apiot-select style="width: 160px" v-model="selectValue">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </apiot-select>
      </div>
      <div class="listBox">
        <div
          class="listItem"
          v-for="item in list"
          :key="item.id"
          @click="handleClick(item)"
        >
          <div class="listInfo">
            <div>
              <span
                class="iconfont icon-danju"
                :style="`color: ${getStatus(item).color};`"
              ></span>
            </div>
            <div class="listInfoWrap">
              <p
                class="listTitle"
                :title="`${item.instanceName}}`"
                style="height: 24px; line-height: 24px"
              >
                <span
                  v-if="
                    item.instanceStatus === 'REJECTED' && com === 'LeaveItToMe'
                  "
                  class="listStatus"
                  :style="`color: ${getStatus(item).color};background: ${
                    getStatus(item).bgColor
                  }`"
                >
                  {{ getStatus(item).name }}</span
                >
                {{ item.instanceName }}
              </p>
              <div class="listDes" style="color: #333333">
                <div v-if="item.timeLeft >= 0">
                  剩余<span style="color: rgba(224, 32, 32, 1)">{{
                    item.timeLeft
                  }}</span
                  >天
                </div>
              </div>
              <p class="listDes">
                当前节点:
                <span style="color: #333333">{{ item.taskName }}</span>
              </p>
            </div>
          </div>
          <div class="listKeycode" v-html="renderHtml(item.taskDesc)"></div>
          <div class="listTag">
            <div class="user">
              <div class="userTitle">发起人</div>
              <Users
                :row="item"
                :userid="String(item.createUserId)"
                prop="triggerUserName"
              ></Users>
            </div>
            <p class="textWrap"></p>
            <p class="textWrap">发起时间: {{ item.triggerTime }}</p>
          </div>
        </div>
        <apiot-nodata v-if="!total"></apiot-nodata>
      </div>
      <div class="listPagination" v-if="list.length">
        <apiot-pagination
          :total="total"
          :current-page="current"
          :page-size.sync="size"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></apiot-pagination>
      </div>
    </div>
    <Approve
      :showTabs.sync="visible"
      :com="com"
      v-model="activeName1"
      :approvalInfo="approvalInfo"
      :nodeConfig="nodeConfig"
    ></Approve>
  </div>
</template>

<script>
import moment from 'moment';
import Approve from '_v/TaskToDo/Components/Approve';
import Users from '@/views/Users/Main/UserColumn/Users/index';
import { getIInitiatedList, getMyTodoList, getCompletedTasks, getNodeInfo } from '@/api/flow';

export default {
  props: {
    activeName: {
      type: String
    },
    com: {
      type: String,
      default: ''
    },
    tabsCount: {
      type: [Array]
    }
  },
  data() {
    return {
      nodeConfig: {},
      radio1: 'REJECTED',
      selectValue: 1,
      list: [],
      approvalInfo: {}, // 流程信息
      visible: false, //  审批界面弹框
      activeName1: 'Approve',
      size: 10,
      current: 1,
      total: 0,
      loading: false
    };
  },

  components: {
    Users,
    Approve
  },

  computed: {
    renderHtml() {
      return function(value = '{}') {
        // eslint-disable-next-line no-unreachable
        let params = null;
        try {
          params = JSON.parse(value);
        } catch (e) {
          params = {};
        }
        return Object.keys(params)
          .map(
            (item) => `
                              <p style="height: 16px;margin-bottom: 12px;
                                  font-size: 13px;
                                  font-family: PingFangSC-Regular, PingFang SC;
                                  font-weight: 400;
                                  color: #808080;
                                  overflow: hidden;
                                  text-overflow: ellipsis;
                                  white-space: nowrap;
                                  ">${item}： <span style="color: #333333;">${params[item]}</span></p>
`
          )
          .join('');
      };
    },
    getStatus() {
      return function(params) {
        const { instanceStatus } = params;

        const IN_PROGRESS = {
          name: '进行中',
          color: '#34C7BE',
          bgColor: '#34C7BE'
        };
        if (instanceStatus === 'REJECTED') {
          return {
            name: '被驳回',
            color: '#EE5E5E',
            bgColor: '#FFEAEB'
          };
        }
        if (instanceStatus === 'IN_PROGRESS') {
          return IN_PROGRESS;
        }
        if (instanceStatus === 'COMPLETED') {
          return {
            name: '已完成',
            color: '#4689F5',
            bgColor: '#E5F0FF'
          };
        }
        if (instanceStatus === 'REVOKED') {
          return {
            name: '已完成',
            color: '#F5B034',
            bgColor: '#bd892c'
          };
        }
        return IN_PROGRESS;
      };
    },
    radioArr() {
      if (this.activeName === 'LeaveItToMe') {
        return [];
      }
      if (this.activeName === 'IInitiatedIt') {
        return [
          {
            value: 'REJECTED',
            name: '被驳回'
          },
          {
            value: 'IN_PROGRESS',
            name: '进行中'
          },
          {
            value: 'COMPLETED',
            name: '已完成'
          },
          {
            value: 'REVOKED',
            name: '已撤回'
          }
        ];
      }
      return [];
    },
    options() {
      return [
        {
          value: 1,
          name: '一周以内'
        },
        {
          value: 2,
          name: '一个月以内'
        },
        {
          value: 3,
          name: '三个月以内'
        },
        {
          value: 4,
          name: '六个月以内'
        },
        {
          value: 5,
          name: '今年以内'
        }
      ];
    }
  },

  mounted() {
    this.init(this.selectValue);
    this.$bus.$off(`${this.com}_End_of_operation`).$on(`${this.com}_End_of_operation`, () => {
      this.visible = false;
    });
  },

  methods: {
    handleCurrentChange(val) {
      // 切换页码
      this.current = val;
      this.init(this.selectValue);
    },
    handleSizeChange(val) {
      // 切换页面条数
      this.size = val;
      this.init(this.selectValue);
    },
    async init(v) {
      const startDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const params = {
        endDate: startDate,
        current: this.current,
        size: this.size
      };
      if (v === 1) {
        params.beginDate = moment(startDate)
          .subtract(7, 'd')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 2) {
        params.beginDate = moment(startDate)
          .subtract(1, 'months')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 3) {
        params.beginDate = moment(startDate)
          .subtract(3, 'months')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 4) {
        params.beginDate = moment(startDate)
          .subtract(1, 'months')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      if (v === 5) {
        params.beginDate = moment(startDate)
          .subtract(6, 'years')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      if (this.com === 'IInitiatedIt') {
        params.instanceStatus = this.radio1;
      }
      this.loading = true;
      const api = this.getApi();
      const data = await api(params);
      const { records = [], total = 0 } = data;
      this.list = records;
      this.total = total;
      // eslint-disable-next-line no-empty
      if (['LeaveItToMe', 'Completed'].includes(this.com)) {
        const arr = [...this.tabsCount];
        const obj = arr.find((item) => item.key === this.com);
        if (obj) {
          obj.total = total;
          this.$emit('changeTabsTitle', arr);
        }
      }
      this.loading = false;
    },
    changeStatus() {
      this.current = 1;
      this.init(this.selectValue);
    },
    getApi() {
      // 获取api接口
      if (this.com === 'IInitiatedIt') {
        return getIInitiatedList;
      }
      if (this.com === 'LeaveItToMe') {
        return getMyTodoList;
      }
      if (this.com === 'Completed') {
        return getCompletedTasks;
      }
      return '';
    },
    handleClick(item) {
      console.log(item);
      this.approvalInfo = item; // 流程信息
      const { taskType, nodeId } = this.approvalInfo;
      if (taskType === 3 || taskType === 5) {
        // 该节点属于审批节点，需要去获取配置
        this.fetchNodeInfo(nodeId);
        return;
      }
      this.visible = true; //  审批界面弹框
    },
    async fetchNodeInfo(nodeId) {
      const data = await getNodeInfo({ nodeId });
      const config = data.attributes ? JSON.parse(data.attributes) : {};
      this.nodeConfig = config;
      this.visible = true; //  审批界面弹框
    }
  },
  watch: {
    selectValue: {
      handler(v) {
        this.current = 1;
        this.init(v);
      }
    },
    visible: {
      handler(v) {
        if (!v) {
          this.current = 1;
          this.init(this.selectValue);
        }
      }
    }
  },
  name: 'list'
};
</script>

<style lang='scss' scoped>
.listKeycode {
  width: 250px;
  height: 70px;
  //display: flex;
  //align-items: center;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  overflow: hidden;
}

.listWrap {
  width: 100%;
  height: 100%;
  background: #f6f6f8;

  .listContent {
    width: 100%;
    height: 100%;
    margin: 0 auto;

    .conditionWrap {
      height: 48px;
      width: 1090px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;

      ::v-deep {
        .el-radio-group {
          line-height: 48px;
        }

        .el-radio-button--small .el-radio-button__inner {
          padding: 7px 25px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #333333;

          &:hover {
            color: #4689f5;
          }
        }

        .is-active .el-radio-button__inner {
          padding: 7px 25px;
          font-size: 13px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;

          &:hover {
            color: #ffffff !important;
          }
        }
      }
    }

    .listBox {
      height: calc(100% - 48px - 52px);
      width: 100%;
      margin-top: 10px;
      overflow-y: auto;

      .listItem {
        display: flex;
        margin: 0 auto 14px auto;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        height: 109px;
        width: 1090px;
        padding: 20px 0;
        background: #ffffff;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        cursor: pointer;
        box-sizing: border-box;

        &:hover {
          box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.14);
        }

        .listTag {
          //height: 24px;
          width: 220px;
          margin-right: 20px;
          font-size: 13px;
          line-height: 24px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #4689f5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          box-sizing: border-box;

          & > span {
            padding: 0 10px;
            display: inline-block;
            border-radius: 4px;
            background: #e5f0ff;
          }

          .user {
            height: 24px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            overflow: hidden;

            .userTitle {
              float: left;
              height: 18px;
              margin-right: 2px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #808080;
              line-height: 18px;
            }

            .roleWrap__nameWrap {
              height: 26px;
            }
          }

          .textWrap {
            margin-top: 7px;
            height: 19px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            text-align: right;
            line-height: 19px;
          }
        }

        .listInfo {
          margin-left: 20px;
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;

          .iconfont {
            margin-right: 18px;
            font-size: 32px;
            color: #ee5e5e;
          }

          .listInfoWrap {
            width: 230px;
            height: 70px;
          }

          .listTitle {
            width: 230px;
            height: 18px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 18px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            .listStatus {
              display: inline-block;
              height: 24px;
              background: #ffeaeb;
              border-radius: 4px;
              padding: 0 10px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #333333;
              box-sizing: border-box;
            }

            .iconfont {
              margin-right: 4px;
              font-size: 16px;
            }
          }

          .listDes {
            height: 18px;
            margin-top: 7px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            line-height: 18px;
          }
        }
      }
    }

    .listPagination {
      .pagination {
        background: #f6f6f8;
        border-top: none;
        box-shadow: none;

        ::v-deep {
          .el-pagination {
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
