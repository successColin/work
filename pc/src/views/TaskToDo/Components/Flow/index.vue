/**
* @name: index
* @author: DELL
* @date: 2021/10/21 10:33
* @description：index
* @update: 2021/10/21 10:33
*/
<!-- 页面 -->
<template>
  <div class="timelineWrap" v-loading="loading">
    <el-timeline>
      <el-timeline-item
        :timestamp="item.siteName"
        placement="top"
        v-for="(item, i) in list"
        :key="i"
        :type="i === list.length - 1 ? 'primary ' : ''"
      >
        <!-- 流程开始节点 -->
        <el-card shadow="never" v-if="item.taskType === 1">
          <div class="userWrap">
            <div
              class="user"
              v-for="user in item.handUsers"
              :key="user.handUserId"
              :style="`${
                item.taskType !== 1
                  ? `background: ${getStatus(user).bgColor}`
                  : null
              }`"
            >
              <Users :row="user" userid="handUserId" prop="handUserName" />
              <el-tooltip
                class="item"
                effect="dark"
                :content="getStatus(user).name"
                placement="top-start"
              >
                <span
                  v-if="item.taskType !== 1"
                  class="iconfont"
                  :class="{ [getStatus(user).icon]: true }"
                  :style="`color:${getStatus(user).color};margin-left: 5px;`"
                ></span>
              </el-tooltip>
            </div>
          </div>
          <p class="time" v-if="item.handTime">于 {{ item.handTime }}</p>
          <p class="explain">发起流程</p>
        </el-card>
        <!-- 流程其他节点展示 -->
        <div
          class="approveUserList"
          v-if="item.taskType != 999 && item.taskType != 1"
        >
          <el-card
            shadow="never"
            v-for="user in getUsers(item.handUsers)"
            :key="user.handUserId"
          >
            <div class="userWrap">
              <div
                class="user"
                :style="
                  item.taskType !== 1
                    ? `background: ${getStatus(user).bgColor}`
                    : null
                "
              >
                <Users :row="user" userid="handUserId" prop="handUserName" />
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="getStatus(user).name"
                  placement="top-start"
                >
                  <span
                    v-if="item.taskType !== 1"
                    class="iconfont"
                    :class="{ [getStatus(user).icon]: true }"
                    :style="`color:${getStatus(user).color};margin-left: 5px;`"
                  ></span>
                </el-tooltip>
<!--                <span-->
<!--                    class="userStatus"-->
<!--                    :style="`color: ${getStatus(user).color}`">-->
<!--                  {{ getStatus(user).name }}-->
<!--                </span>-->
              </div>
            </div>
            <p class="time" v-if="user.executTime && item.taskType != 999">
              {{ user.executTime }}
            </p>
            <p class="opinion" v-if="user.memo">
              {{
                user.executCommand === 'REFERRAL' ? '转审描述' : '审批意见'
              }}：{{ user.memo }}
            </p>
            <div class="sort" v-if="getCountersign(user, 3).length">
              <span>并对</span>
              <Users
                v-for="per in getCountersign(user, 3)"
                :row="per"
                :key="per.handUserId"
                userid="handUserId"
                prop="handUserName"
              />
              <span> 加签</span>
            </div>
            <div class="sort" v-if="getCountersign(user, 2).length">
              <span>并对</span>
              <Users
                v-for="per in getCountersign(user, 2)"
                :row="per"
                :key="per.handUserId"
                userid="handUserId"
                prop="handUserName"
              />
              <span>转审</span>
            </div>
            <p class="explain" v-if="item.multiApprovalType">
              说明： {{ getExplain(item) }}
            </p>
          </el-card>
        </div>
        <!-- 流程结束节点 -->
        <el-card shadow="never" v-if="item.taskType === 999">
          <p class="end" v-if="item.handTime">流程于 {{ item.handTime }} 结束</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { getFlowListInTask } from '@/api/flow';
import { approvalType } from '@/config/index';
import Users from '@/views/Users/Main/UserColumn/Users/index';

export default {
  props: {
    approvalInfo: {
      type: Object,
      default: () => {}
    },
    com: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      loading: false
    };
  },

  components: { Users },

  computed: {
    getCountersign() {
      // 是否有加签转审
      return function(obj, v) {
        const { children = [] } = obj;
        return children.filter((item) => item.taskSource === v);
      };
    },
    getUsers() {
      // 获取审批用户
      return function(params = []) {
        const arr = [];
        params.forEach((item) => {
          const { handUserId } = item;
          const i = arr.findIndex((a) => a.handUserId === handUserId);
          if (i === -1) {
            arr.push(item);
            if (item.children && Array.isArray(item.children) && item.children.length) {
              item.children.forEach((user) => {
                arr.push(user);
              });
            }
          }
        });
        return arr;
      };
    },
    getExplain() {
      return function(params) {
        if (params.multiApprovalType) {
          const obj = approvalType.find((item) => item.value === params.multiApprovalType);
          if (obj) return obj.name;
          return '';
        }
        return '';
      };
    },
    getStatus() {
      return function(params) {
        const { executCommand, taskStatus } = params;
        if (executCommand === 'REFERRAL') {
          return {
            name: '转审',
            color: '#41B9C5',
            icon: 'icon-daichuli',
            bgColor: '#DCF5F8'
          };
        }
        if (taskStatus === 1) {
          return {
            name: '待处理',
            color: '#4689F5',
            icon: 'icon-daichuli',
            bgColor: '#D7E7FD'
          };
        }
        if (taskStatus === 2) {
          return {
            name: '跳过',
            color: '#F5B034',
            icon: 'icon-shenpitiaoguo',
            bgColor: '#F9EBCC'
          };
        }
        if (executCommand === 'REJECT') {
          return {
            name: '驳回',
            color: '#EE5E5E',
            icon: 'icon-shenpibohui',
            bgColor: '#FADEDF'
          };
        }
        if (executCommand === 'AGREE') {
          return {
            name: '同意',
            color: '#10B98A',
            icon: 'icon-shenpitongguo',
            bgColor: '#D6F7EE'
          };
        }
        if (executCommand === 'SUBMIT') {
          return {
            name: '提交',
            color: '#4A8CF2',
            icon: 'icon-shenpitongguo',
            bgColor: '#E5F0FE'
          };
        }
        return {
          name: '待处理',
          color: '#4689F5',
          icon: 'icon-daichuli',
          bgColor: '#D7E7FD'
        };
      };
    }
  },

  mounted() {
    this.fetchFlowList();
    this.$bus.$off(`${this.com}_reset_flow`).$on(`${this.com}_reset_flow`, () => {
      this.fetchFlowList();
    });
  },

  methods: {
    async fetchFlowList() {
      const { instanceId } = this.approvalInfo;
      this.loading = true;
      try {
        const data = await getFlowListInTask({ instanceId });
        // console.log('list', data);
        this.list = data;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.timelineWrap {
  width: 100%;
  height: 100%;
  padding: 20px 15px;
  box-sizing: border-box;
  overflow-y: scroll;
  background: #fafafa;

  .approveUserList {
    ::v-deep {
      .el-card {
        margin-bottom: 10px;
      }
    }
  }

  ::v-deep {
    .el-timeline-item__timestamp {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
    }

    .el-timeline-item__node--primary {
      background-color: #4689f5;
      box-shadow: 0 0 4px 4px #c4dafc;
    }

    .el-card {
      background: #ffffff;
      border: 1px solid #e9e9e9;
      border: none;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
    }
  }

  .userWrap {
    overflow: hidden;

    .userStatus {
      margin-left: 5px;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
    }
  }

  .user {
    margin-bottom: 5px;
    display: flex;
    float: left;
    padding-right: 10px;
    align-items: center;
    overflow: hidden;
    border-radius: 12px;

    .roleWrap__nameWrap {
      box-shadow: 0px 0px 0px 2px #fff;
    }
  }

  .time {
    height: 20px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #808080;
    line-height: 20px;
  }

  .opinion {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }

  .sort {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row;
    line-height: 30px;
    & > span:first-child {
      margin-right: 5px;
    }
    & > span:last-child {
      margin-left: 5px;
    }
    ::v-deep {
      .haseBgColor {
        margin-left: 5px;
      }
    }
  }

  .des {
    height: 20px;
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }

  .explain {
    margin-top: 2px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
  }
  .end{
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #808080;
    line-height: 20px
  }
}
</style>
