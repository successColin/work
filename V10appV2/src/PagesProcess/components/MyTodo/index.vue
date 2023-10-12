<!--
 * @Author: sss
 * @Date: 2022-05-25 11:49:22
 * @Last Modified by: sss
 * @Last Modified time: 2022-05-25 11:49:22
 * @Desc: 待我审批
-->
<template>
  <view
    class="launchByme"
    v-if="computedHeight > 0"
    :style="{ height: `${computedHeight}px` }"
  >
    <search-box @search="handleSearch" @clickFilter="clickFilter"></search-box>
    <apiot-toast
      v-if="isLoading && listData.length === 0"
      status="loading"
      :isFull="true"
    ></apiot-toast>
    <u-list
      v-if="listData.length > 0"
      ref="card"
      :height="isShowBatchBtn ? computedHeightList3 : computedHeightList"
      :preLoadScreen="3"
      :pagingEnabled="true"
      @scrolltolower="scrolltolower"
    >
      <u-checkbox-group
        v-model="checkboxValue"
        placement="column"
        @change="checkboxChange"
      >
        <u-list-item
          v-for="(item, index) in listData"
          :key="index"
          :anchor="item.id"
        >
          <list-card
            v-if="rerender"
            :value="item"
            :isOperation="isOperation"
            @clickNode="clickNode"
          ></list-card>
        </u-list-item>
      </u-checkbox-group>
      <apiot-toast
        :status="loadMoreInfo"
        @clickLoadMore="clickLoadMore"
      ></apiot-toast>
    </u-list>
    <apiot-list-nodata
      v-else-if="!isLoading && listData.length === 0"
      :style="{
        height: isShowBatchBtn
          ? computedHeightList3
          : computedHeightList + 'px',
      }"
    ></apiot-list-nodata>
    <footer v-if="isShowBatchBtn">
      <apiot-button
        type="primary"
        shape="circle"
        class="batch"
        v-if="!isOperation"
        @click="handleBatchOffline"
      >
        <div class="batch__button">
          <i class="appIcon appIcon-piliangcaozuo"></i>
          批量操作
        </div>
      </apiot-button>

      <div v-else class="operation">
        <u-checkbox-group class="operation__checkbox" v-model="checkedAll">
          <u-checkbox
            label="全选"
            labelSize="14"
            labelColor="#333"
            @change="handleCheckedAll"
            name="all"
          ></u-checkbox>
        </u-checkbox-group>
        <apiot-button
          type="default"
          @click="handleCancel"
          class="operation__cancelBtn operation__btn"
        >
          <div class="batch__button">
            <!-- <i class="appIcon appIcon-bohui"></i> -->
            取消
          </div>
        </apiot-button>
        <apiot-button
          type="primary"
          @click="handleReject"
          class="operation__defaultBtn operation__btn"
        >
          <div class="batch__button">
            <i class="appIcon appIcon-bohui"></i>
            驳回
          </div>
        </apiot-button>
        <apiot-button
          type="primary"
          @click="handleOk"
          class="operation__primaryBtn operation__btn"
        >
          <div class="batch__button">
            <i class="appIcon appIcon-tongguo"></i>
            通过
          </div>
        </apiot-button>
      </div>
    </footer>
    <batch-approval
      v-if="showProcessOp"
      :btnInfo="btnInfo"
      @cancel="cancelProcessOP"
    ></batch-approval>
    <u-toast ref="uToast"></u-toast>
    <!-- :oprationInfo="btnInfo"
      :config="processOpConfig"
      :referralUserId="referralUserId" -->
  </view>
</template>

<script>
import { getMyTodoList, getNodeAttr } from '@/api/pagesProcess.js';
import tabMixin from '../tabMixin';
import ListCard from '../common/ListCard';
import SearchBox from '../common/SearchBox';
import BatchApproval from '../common/BatchApproval';

// import btnMixin from '@/menuConfigure/components/MenuMain/ConfigMain/ConfigBtns/btnMixin';
// import compMixin from '@/menuConfigure/components/MenuMain/ConfigMain/compMixin';
// btnMixin, compMixin

export default {
  components: { ListCard, SearchBox, BatchApproval },

  mixins: [tabMixin],

  provide() {
    return {
      getProcessForm: this.getProcessForm
    };
  },

  props: {},

  data() {
    return {
      isOperation: false,
      checkedAll: [],
      checkboxValue: [],
      showProcessOp: false,
      btnInfo: {},
      rerender: true
    };
  },

  computed: {
    isShowBatchBtn() {
      const { THEME_AND_LOGO } = this.$store.state.base.globalConfig;
      const domain =
        THEME_AND_LOGO.find((item) => item.attributeKey === 'enableBatchApproval') || {};
      return domain?.attributeValue === '1';
    }
  },

  methods: {
    // 按钮过滤
    clickFilter() {
      if (this.processNameArr.length === 0) return;
      uni.navigateTo({
        url: `/PagesProcess/components/AdvancedScreen/index?processNameArr=${this.processNameArr}&compid=myTodo`
      });
    },
    handleBatchOffline() {
      this.isOperation = true;
    },
    // 如果全选中
    checkboxChange(v) {
      if (v.length === this.total) {
        this.checkedAll = ['all'];
      } else {
        this.checkedAll = [];
      }
    },
    // 点击全选
    handleCheckedAll(v) {
      const arr = [];
      if (v) {
        this.listData.forEach((val) => {
          arr.push(val.taskId);
        });
      }
      this.checkboxValue = arr;
    },
    // 取消按钮
    handleCancel() {
      this.isOperation = false;
    },
    // 批量驳回
    handleReject() {
      if (this.checkboxValue.length === 0) {
        return this.$refs.uToast.show({
          type: 'warning',
          message: '请选择数据'
        });
      }
      this.btnInfo = {
        compId: 'static_bohui',
        required: true,
        taskIds: this.checkboxValue.join(',')
      };
      this.showProcessOp = true;
    },
    // 批量通过
    async handleOk() {
      if (this.checkboxValue.length === 0) {
        return this.$refs.uToast.show({
          type: 'warning',
          message: '请选择数据'
        });
      }
      this.btnInfo = {
        compId: 'static_tongguo',
        taskIds: this.checkboxValue.join(',')
      };
      this.showProcessOp = true;
    },
    // 流程审批关闭
    cancelProcessOP(type, message) {
      // type true: 刷新，false：不刷新；message 提示
      this.showProcessOp = false;
      this.btnInfo = {};
      if (type) {
        this.checkboxValue = [];
        this.rerender = false;
        this.isOperation = false;
        this.$nextTick(() => {
          this.rerender = true;
        });
        this.getData();
        this.$refs.uToast.show({
          type: 'success',
          message
        });
      }
    },
    getProcessForm() {
      return this.resolveBatchParams(this.getFuncAreas());
    },
    // ------------------
    handleSearch(params) {
      this.keywords = params ? params.keyword : '';
      this.getData();
    },
    // 获取节点配置信息
    async getNodeAttr(nodeId) {
      try {
        const result = await getNodeAttr({ nodeId });
        if (!result.attributes) return;
        const config = JSON.parse(result.attributes);
        config.workflowVersionId = result.workflowVersionId;
        this.$store.commit('setProcessConfig', { nodeId, config });
      } catch (error) {
        console.error(error);
      }
    },
    // 点击按钮
    async clickNode(node) {
      // 跳转至审批详情
      const {
        appPanelId,
        instanceName,
        instanceId,
        dataId,
        nodeId,
        taskId,
        triggerUserId,
        triggerUserName
      } = node;
      if (this.isOperation) {
        const index = this.checkboxValue.indexOf(node.taskId);
        if (index === -1) {
          this.checkboxValue.push(node.taskId);
        } else {
          this.checkboxValue.splice(index, 1);
        }
        return;
      }
      if (!appPanelId) return;
      const { processConfigs } = this.$store.state.process;
      if (!processConfigs[nodeId]) await this.getNodeAttr(nodeId);
      uni.navigateTo({
        url: `/menuConfigure/index?id=${appPanelId}&title=${instanceName}&triggerUserName=${triggerUserName}&isProcess=true&workflowDataId=${dataId}&instanceId=${instanceId}&processNodeId=${nodeId}&taskId=${taskId}&type=LeaveItToMe&triggerUserId=${triggerUserId}&sno=1`,
        animationType: 'slide-in-right'
      });
    },
    // 获得我发起的数据
    async getData(loadType = '') {
      this.isLoading = true;
      try {
        // 分页
        let page = this.current;
        let pageSize = this.size;
        if (loadType === 'loadnext') {
          this.current += 1;
          page = this.current;
        } else if (loadType === 'reload') {
          page = 1;
          pageSize *= page;
        } else {
          this.current = 1;
          page = 1;
        }
        const params = {
          current: page,
          size: pageSize,
          keywords: this.keywords,
          ...this.searchParam
        };
        const result = await getMyTodoList(params);
        console.log(result);
        this.processNameArr = result.extendedMap.flowNames;
        let list = null;
        if (loadType === 'loadnext') {
          list = this.listData.concat(result.records);
        } else {
          this.totalPage = Math.ceil(result.total / pageSize);
          list = result.records;
        }

        this.listData = [...list];
        this.isLoading = false;
        this.total = this.listData.length;
      } catch (error) {
        this.isLoading = false;
        console.error(error);
      }
    },
    setSearchParam(v) {
      this.searchParam = v;
    }
  },

  mounted() {},

  created() {
    // 设置监听，用于转审时，刷新列表
    this.$bus.$on('PROCESS_REFRESH_1', (v) => {
      this.$refs.uToast.show({
        type: 'success',
        message: v
      });
      this.getData();
    });
  },

  beforeDestroy() {
    this.$bus.$off('PROCESS_REFRESH_1');
  }
};
</script>

<style lang='scss' scoped>
@import './index.scss';

$--name: 'launchByme';
@include setTabsStyle($--name);
.batch__button {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  .appIcon {
    font-size: 38rpx;
    margin-right: 12rpx;
  }
}
footer {
  .batch {
    width: calc(100% - 40rpx) !important;
    margin: 30rpx auto;
  }
  .operation {
    width: calc(100% - 80rpx) !important;
    padding: 0 20rpx;
    height: 88rpx;
    background: #fff;
    display: flex;
    align-items: center;
    margin: 30rpx auto;
    background: #ffffff;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 44px;
    .operation__btn {
      height: 62rpx !important;
      border-radius: 31rpx;
    }
    .operation__cancelBtn {
      background: #f1f3f6 !important;
      margin-right: 20rpx;
      margin-left: 20rpx;
      font-size: 28rpx;
      color: #333333;
    }
    .operation__defaultBtn {
      background: #ee5e5e !important;
      margin-right: 20rpx;
    }
    .operation__primaryBtn {
      background: #34c7be !important;
    }
    .operation__checkbox {
      // margin-right: 36rpx;
    }
    ::v-deep {
      .u-btn {
        padding: 0 20rpx;
      }
    }
  }
}
</style>
