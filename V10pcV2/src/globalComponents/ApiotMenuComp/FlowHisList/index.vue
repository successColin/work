/** * @name: index * @author: DELL * @date: 2021/10/21 10:33 *
@description：index * @update: 2021/10/21 10:33 */
<!-- 页面 -->
<template>
  <div
    class="timelineWrap"
    v-loading="loading"
    @click="changeCurActiveObj"
    :class="[{ notConfig: !isConfig }]"
  >
    <el-timeline v-if="!isConfig && !isPreview && list.length">
      <el-timeline-item
        v-for="(item, i) in list"
        :key="i"
        :type="i === list.length - 1 ? 'primary ' : ''"
      >
        <!-- 流程开始节点 -->
        <div class="nodeBox">
          <span
            @click="doExpand(item)"
            class="siteName approve"
            :class="{ unexpand: !item.expand }"
          >
            {{ item.siteName }}
            <i class="iconfont icon-shujiantouzhankai"></i>
          </span>
          <el-card shadow="never" v-if="item.taskType === 1 && !item.expand">
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
                <Users :row="user" userId="handUserId" prop="handUserName" />
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
            <!-- 的{{ approvalInfo.instanceName }} -->
            <p class="explain">发起该流程</p>
          </el-card>
        </div>
        <!-- 流程其他节点展示 -->
        <div class="approveUserList" v-if="isOtherNode(item) && !item.expand">
          <el-card
            shadow="never"
            v-for="user in item.handUsers"
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
                <Users :row="user" userId="handUserId" prop="handUserName" />
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
                userId="handUserId"
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
                userId="handUserId"
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
        <el-card shadow="never" v-if="item.taskType === 999 && !item.expand">
          <p class="end" v-if="item.handTime">
            流程于 {{ item.handTime }} 结束
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <div
      class="timelineWrap__place"
      v-else
      :class="[
        { borderType: isConfig },
        {
          highBorder: isConfig && activeObj.compId === configData.compId,
        },
      ]"
    >
      {{ !isConfig && !isPreview ? '暂无流程日志' : '流程日志占位' }}
    </div>
  </div>
</template>

<script>
import { taskSiteByBizData } from '@/api/flow';
import { approvalType } from '@/config/index';
import Users from '@/views/Users/Main/UserColumn/Users/index';

export default {
  props: {
    configData: {
      type: [Array, Object],
    },
    activeObj: {
      type: [Array, Object],
    },
    hasTriggerComp: {
      type: Object,
    },
    isSidebar: {
      type: Boolean,
      default: false,
    },
    // 爹
    parent: {
      type: Object,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      relateDataComp: {
        value: '',
        tableName: '',
      },
      relateBusiComp: {
        value: '',
        tableName: '',
        flowValue: [],
      },
    };
  },
  inject: [
    'isConfig',
    'getAllForm',
    'sysMenuDesignId',
    'getFatherPanel',
    'onlyFlag',
    'getNotInitArr',
    'isSelect',
    'isPreview',
  ],
  components: { Users },

  computed: {
    isOtherNode() {
      return function (item) {
        return item.taskType !== 999 && item.taskType !== 1;
      };
    },
    getCountersign() {
      // 是否有加签转审
      return function (obj, v) {
        const { children = [] } = obj;
        return children.filter((item) => item.taskSource === v);
      };
    },
    getUsers() {
      // 获取审批用户
      return function (params = []) {
        const arr = [];
        params.forEach((item) => {
          const { handUserId } = item;
          const i = arr.findIndex((a) => a.handUserId === handUserId);
          if (i === -1) {
            arr.push(item);
            if (
              item.children &&
              Array.isArray(item.children) &&
              item.children.length
            ) {
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
      return function (params) {
        if (params.multiApprovalType) {
          const obj = approvalType.find(
            (item) => item.value === params.multiApprovalType,
          );
          if (obj) return obj.name;
          return '';
        }
        return '';
      };
    },
    getStatus() {
      return function (params) {
        const { executCommand, taskStatus } = params;
        if (executCommand === 'REFERRAL') {
          return {
            name: '转审',
            color: '#41B9C5',
            icon: 'icon-daichuli',
            bgColor: '#DCF5F8',
          };
        }
        if (taskStatus === 1) {
          return {
            name: '待处理',
            color: '#4689F5',
            icon: 'icon-daichuli',
            bgColor: '#D7E7FD',
          };
        }
        if (taskStatus === 2) {
          return {
            name: '跳过',
            color: '#F5B034',
            icon: 'icon-shenpitiaoguo',
            bgColor: '#F9EBCC',
          };
        }
        if (executCommand === 'REJECT') {
          return {
            name: '驳回',
            color: '#EE5E5E',
            icon: 'icon-shenpibohui',
            bgColor: '#FADEDF',
          };
        }
        if (executCommand === 'AGREE') {
          return {
            name: '同意',
            color: '#10B98A',
            icon: 'icon-shenpitongguo',
            bgColor: '#D6F7EE',
          };
        }
        if (executCommand === 'SUBMIT') {
          return {
            name: '提交',
            color: '#4A8CF2',
            icon: 'icon-shenpitongguo',
            bgColor: '#E5F0FE',
          };
        }
        if (executCommand === 'REVOKE') {
          return {
            name: '撤回',
            color: '#708DB7',
            icon: 'icon-fanhui-chehui-08',
            bgColor: '#E5F0FE',
          };
        }
        return {
          name: '待处理',
          color: '#4689F5',
          icon: 'icon-daichuli',
          bgColor: '#D7E7FD',
        };
      };
    },
  },

  mounted() {
    if (!this.isConfig) {
      if (!this.getNotInitArr().includes(this.configData.compId)) {
        console.log(123);
        this.initTable();
        this.fetchFlowList();
      }

      this.$bus.$on(`reloadArea${this.onlyFlag()}`, this.reloadArea);
      this.$bus.$on(`loadSomeArea_${this.parent.compId}`, this.loadArea);
    }
  },

  methods: {
    // 处理过滤条件
    initTable() {
      if (this.configData.relateDataComp) {
        this.relateDataComp.value =
          this.getAllForm()[this.configData.relateDataComp.compId];
        this.relateDataComp.tableName =
          this.configData.relateDataComp.tableName;
      }
      if (this.configData.relateBusiComp) {
        this.relateBusiComp.flowValue =
          this.configData.relateBusiComp.flowValue;
      }
      if (this.getFatherPanel()) {
        const { relateDataComp } = this.getFatherPanel();
        const { relateBusiComp } = this.getFatherPanel();
        if (relateDataComp && relateDataComp[this.configData.compId]) {
          if (
            relateDataComp[this.configData.compId].value &&
            relateDataComp[this.configData.compId].tableName
          ) {
            this.relateDataComp.value =
              relateDataComp[this.configData.compId].value;
            this.relateDataComp.tableName =
              relateDataComp[this.configData.compId].tableName;
          }
        }
        if (relateBusiComp && relateBusiComp[this.configData.compId]) {
          if (relateBusiComp[this.configData.compId].flowValue) {
            this.relateBusiComp.flowValue =
              relateBusiComp[this.configData.compId].flowValue;
          }
        }
      }
    },
    // 刚打开tab的时候如果不是初始化的，则加载一次
    loadArea(compId) {
      // 代表刚打开的tab
      if (this.parent.compId === compId) {
        // 加载的列表里包含该id
        if (this.getNotInitArr().includes(this.configData.compId)) {
          this.list = [];
          this.fetchFlowList();
        }
      }
    },
    // 更新该区域
    reloadArea(areaArr, compId) {
      this.initTable();
      // 按钮全部刷新
      if (areaArr === 'all') {
        if (!this.getNotInitArr().includes(this.configData.compId)) {
          this.list = [];
          this.fetchFlowList();
        }
        return;
      }
      // 刷新当前区域
      if (
        (areaArr === 'current' || areaArr === 'searchCurrent') &&
        compId === this.configData.compId
      ) {
        this.list = [];
        this.fetchFlowList();
        return;
      }
      if (areaArr.includes(this.configData.compId)) {
        this.list = [];
        this.fetchFlowList();
      }
    },
    changeCurActiveObj(e) {
      if (!this.isConfig) {
        return;
      }
      if (e) {
        e.stopPropagation();
      }
      this.$bus.$emit('changeCurActiveObj', this.configData);
    },
    doExpand(item) {
      // item.expand=!item.expand
      this.$set(item, 'expand', !item.expand);
    },
    async fetchFlowList() {
      if (
        this.relateDataComp.value &&
        this.relateDataComp.tableName &&
        this.relateBusiComp.flowValue.length
      ) {
        try {
          const params = {
            dataId: this.relateDataComp.value,
            tableName: this.relateDataComp.tableName,
            workflowInfoId: this.relateBusiComp.flowValue[1],
          };
          this.loading = true;
          const data = await taskSiteByBizData(params);
          // console.log('list', data);
          this.list = data;
          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      }
    },
  },
  name: 'index',
};
</script>

<style lang="scss" scoped>
.timelineWrap {
  width: calc(100% - 20px);
  margin: 10px 10px 0;
  box-sizing: border-box;
  &.notConfig {
    min-height: 100px;
  }
  &__place {
    font-size: 13px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333;
    line-height: 100px;
    height: 100px;
    width: 100%;
    text-align: center;
  }
  .siteName {
    display: inline-block;
    font-size: 14px;
    padding: 0 8px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #333333;
    height: 28px;
    //height: 28px;
    margin-bottom: 10px;
    line-height: 28px;
    cursor: pointer;
    user-select: none;

    &.approve:hover {
      border-radius: 4px;
      background: #edeff3;
      //height: 28px;
      //padding: 0 8px;
      //margin-bottom: 10px;
      //background: #EDEFF3;
      //border-radius: 4px;
      //line-height: 28px;
      .icon-shujiantouzhankai {
        display: inline-block;
        transform: rotate(-180deg);
        transition: all 0.2s linear;
      }
    }
    &.approve:hover.unexpand .icon-shujiantouzhankai {
      display: inline-block;
      transform: rotate(0deg);
      transition: all 0.2s linear;
    }
    &.approve:hover .icon-shujiantouzhankai {
      display: inline-block;
      transform: rotate(-180deg);
    }
    .icon-shujiantouzhankai {
      display: none;
      transform: rotate(-180deg);
    }
  }

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
    .el-timeline-item__tail,
    .el-timeline-item__node--normal {
      top: 7px;
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

  .end {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #808080;
    line-height: 20px;
  }
}
</style>
