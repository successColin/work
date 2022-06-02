/**
* @name: index
* @author: DELL
* @date: 2021/9/10 15:45
* @description：index
* @update: 2021/9/10 15:45
*/
<!-- 页面 -->
<template>
  <div class="flowListWrap">
    <el-drawer
      :modal-append-to-body="true"
      :size="340"
      :modal="false"
      direction="ltr"
      :visible.sync="newVisible"
      @close="doCloseFlowList"
      :with-header="false"
    >
      <div class="flowList-content" v-loading="loading">
        <div class="content-title">流程列表</div>
        <div class="list-wrap">
          <el-popover
            placement="bottom"
            width="300"
            trigger="click"
            v-model="showPopo"
            @hide="doAfterHide"
            popper-class="addFlow"
          >
            <apiot-input
              v-model.trim="input"
              placeholder="请输入流程名称"
              class="sidebar__add--input"
              maxlength="30"
            ></apiot-input>
            <div class="sidebar__add--btns">
              <apiot-button @click="doAfterHide" class="sidebar__add--btn"
                >{{ $t('common.cancle') }}
              </apiot-button>
              <apiot-button
                :loading="loading"
                type="primary"
                @click="add"
                class="sidebar__add--btn"
                >{{ $t('common.sure') }}
              </apiot-button>
            </div>
            <apiot-button slot="reference" class="list-btn">
              <i class="icon-xinzeng iconfont"></i>
              新增流程
            </apiot-button>
          </el-popover>
          <div class="list-scroll">
            <div
              :class="{ active: activeItem.id === item.id }"
              class="list-item"
              v-for="item in list"
              :key="item.id"
              @click="choose(item)"
            >
              <div class="list-info">
                <div class="iconfont icon-liucheng"></div>
                <div class="info-title">{{ item.workflowName }}</div>
                <div class="info-version" v-if="!!item.activeVersion">
                  V{{ item.activeVersion }}
                </div>
              </div>
              <div class="list--user">创建人：{{ item.createUser }}</div>
              <div class="list-time">{{ item.modifyTime }}更新过</div>
              <span class="iconfont icon-shanchu" @click="del(item)"></span>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getFlowList, addFlow, delFlow } from '@/api/flow';

export default {
  props: {
    visible: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      loading: false,
      showPopo: false,
      input: '', // 表题
      newVisible: false,
      activeItem: {},
      list: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.$bus.$off('shouldChangeFlowList').$on('shouldChangeFlowList', () => {
      this.init();
    });
    this.$bus.$on('Release_version', () => {
      this.init();
    });
    this.init();
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler() {
        this.newVisible = this.visible;
      }
    }
  },
  methods: {
    async del({ id }) {
      // 删除流程
      try {
        await this.$confirm('确定删除该流程吗？', this.$t('common.tip'), { type: 'warning' });
        await delFlow({ workflowInfoId: id });
        if (id === this.activeItem.id) {
          this.activeItem = {};
        }
        await this.init();
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    // 新增取消
    doAfterHide() {
      // 输入框值清空值
      this.input = '';
      this.showPopo = false;
    },
    getMenuId() {
      const { pathname } = window.location;
      const functionArr = pathname.split('/');
      const functionId = functionArr[functionArr.length - 1];
      return functionId;
    },
    choose(item) {
      this.activeItem = item;
      this.$emit('chooseFlow', this.activeItem);
    },
    async add() {
      // 新增流程
      if (!this.input) {
        this.$message.error('请填写流程名称！');
        return;
      }
      this.loading = true;
      try {
        const functionId = this.getMenuId();
        await addFlow({
          menuId: functionId,
          workflowName: this.input
        });
        this.showPopo = false;
        await this.init();
      } catch (e) {
        this.loading = true;
        this.$message.error('操作失败');
      }
    },
    async init() {
      // 获取流程列表
      const functionId = this.getMenuId();
      if (functionId) {
        this.loading = true;
        const data = await getFlowList({ menuId: functionId });
        this.list = data;
        if (JSON.stringify(this.activeItem) === '{}' && this.list.length) {
          const res = this.list[0];
          this.activeItem = res;
          this.$emit('chooseFlow', this.activeItem);
        }
        if (!this.list.length) {
          this.activeItem = {};
          this.$emit('chooseFlow', this.activeItem);
        }
        this.loading = false;
      }
    },
    doCloseFlowList() {
      // 每次关闭弹框的回调
      this.newVisible = false;
      this.$bus.$emit('doCloseFlowListInFlow', false);
    }
  },
  beforeDestroy() {
    this.$bus.$off('shouldChangeFlowList');
    this.$bus.$off('Release_version');
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.flowListWrap {
  .flowList-content {
    height: 100%;
    width: 100%;

    .content-title {
      width: 100%;
      height: 46px;
      padding: 0 20px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      line-height: 46px;
      color: #333333;
      border-bottom: 1px solid #ebebeb;
      box-sizing: border-box;
    }

    .list-wrap {
      width: 100%;
      height: calc(100% - 46px);
      //padding: 0 20px;
      box-sizing: border-box;

      .sidebar__add--btns {
        margin-top: 10px;
        display: flex;
        justify-content: space-evenly;
      }

      .list-btn {
        width: calc(100% - 40px);
        margin: 10px 0 0 20px;

        .icon-xinzeng {
          margin-right: 5px;
          color: #4689f5;
        }
      }

      .list-scroll {
        width: 100%;
        height: calc(100% - 40px);
        padding-top: 14px;
        overflow-y: auto;
        box-sizing: border-box;

        .list-item {
          padding: 14px 10px;
          margin: 0 20px 2px 20px;
          position: relative;
          box-sizing: border-box;

          &.active,
          &:hover {
            background: #f6f6f8;
            border-radius: 8px;
          }

          &:hover .icon-shanchu {
            display: block;
          }

          .icon-shanchu {
            position: absolute;
            display: none;
            right: 12px;
            top: 12px;
            color: #bbc3cd;
            cursor: pointer;
          }

          .list-info {
            margin-bottom: 5px;
            overflow: hidden;

            & > div {
              float: left;
            }

            & > .info-title {
              margin-right: 6px;
              font-size: 13px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 600;
              color: #333333;
              line-height: 24px;
              max-width: calc(100% - 100px);
              overflow: hidden;
              height: 24px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

            & > .info-version {
              height: 14px;
              padding: 3px 10px;
              margin-top: 2px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #4689f5;
              line-height: 14px;
              border-radius: 4px;
              background: #e5f0ff;
            }

            & > .iconfont {
              color: #ee5e5e;
              margin-right: 10px;
              font-size: 24px;
            }
          }

          .list--user,
          .list-time {
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #808080;
            line-height: 20px;
          }

          &:hover {
            background: #f6f6f8;
            border-radius: 8px;
            cursor: pointer;
          }
        }
      }
    }
  }

  ::v-deep {
    .el-drawer__wrapper {
      top: 93px;
    }

    .el-drawer__body {
      height: 100%;
    }
    .v-modal {
      top: 94px;
      background: #ffffff;
      opacity: 0;
    }
  }
}
</style>
