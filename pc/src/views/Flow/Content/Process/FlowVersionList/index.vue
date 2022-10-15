/**
* @name: index
* @author: DELL
* @date: 2021/9/13 9:04
* @description：index
* @update: 2021/9/13 9:04
*/
<!-- 页面 -->
<template>
  <div class="flowVersionWrap">
    <div class="versionTitle">流程版本</div>
    <div class="versionWrap">
      <div class="versionAdd">
        <apiot-button :loading="loading" class="list-btn" @click="addVersion">
          <i class="icon-xinzeng iconfont"></i>
          新建版本
        </apiot-button>
      </div>
      <div class="list-scroll">
        <div
          class="list-item"
          :class="{ active: currentVersion.id === item.id }"
          v-for="(item, index) in list"
          :key="item.id"
          @click.prevent="editVersion(item)"
        >
          <div class="item-left">
            <span
              class="iconfont icon-liucheng"
              :style="getColor(index)"
            ></span>
            <span class="item-name" :title="activeFlow.workflowName"
              >{{ activeFlow.workflowName }}V{{ item.version }}</span
            >
            <el-tag class="using" :type="tagInfo(item).type">{{
              tagInfo(item).name
            }}</el-tag>
          </div>
          <div class="item-right">
            <el-switch
              :value="item.versionStatus === 'CURRENT'"
              @change="(e) => changeStatus(e, item)"
              active-color="#4689F5"
              inactive-color="#E0E0E0"
            >
            </el-switch>
            <span
              class="iconfont icon-fuzhi"
              @click.stop="copyVersion(item)"
            ></span>
            <span class="split">|</span>
            <span class="iconfont icon-shanchu" @click.stop="del(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userColorArr } from '@/config';
import {
  getFlowVersion,
  addFlowVersion,
  delVersion,
  doUpdateVersion,
  doDisabledVersion
} from '@/api/flow';

export default {
  props: {
    activeFlow: {
      // 当前流程
      type: Object,
      default: () => {}
    },
    currentVersion: {
      // 当前流程版本
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      value1: false,
      list: [],
      flowInfo: {},
    };
  },
  watch: {
  },
  components: {},

  computed: {
    tagInfo() {
      return function(item) {
        const isTrue = JSON.stringify(item) !== '{}';
        if (isTrue && item.versionStatus === 'CURRENT') {
          return {
            type: 'success',
            name: '使用中'
          };
        }
        if (isTrue && item.versionStatus === 'HISTORY') {
          return {
            type: 'danger',
            name: '历史'
          };
        }
        if (isTrue && item.versionStatus === 'DESIGN') {
          return {
            type: '',
            name: '设计中'
          };
        }
        return {
          type: '',
          name: '设计中'
        };
      };
    },
    getColor() {
      return function(index) {
        const i = index % 5;
        return `color: ${userColorArr[i]}`;
      };
    }
  },

  mounted() {
    this.flowInfo = this.activeFlow;
    this.$bus.$on('Release_version', () => {
      this.fetchVersionList();
    });
    this.fetchVersionList(true, true);
  },
  beforeDestroy() {
    this.$bus.$off('Release_version');
  },
  methods: {
    editVersion(item) {
      // 编辑版本
      this.$bus.$emit('chooseFlowVersion', item);
    },
    async copyVersion(item) {
      // 复制版本
      try {
        const params = {
          workflowVersionId: item.id,
          workflowId: this.activeFlow.id
        };
        await addFlowVersion(params);
        await this.fetchVersionList(false);
        this.$message.success('流程复制成功!');
      } catch (e) {
        // console.log(e);
      }
    },
    async changeStatus(value, item) {
      const api = value ? doUpdateVersion : doDisabledVersion;
      try {
        await api({ workflowVersionId: item.id });
        await this.fetchVersionList(true);
        this.$bus.$emit('shouldChangeFlowList'); // 每次删除或者修改要更新流程列表
      } catch (e) {
        // console.log(e);
      }
    },
    async del(item) {
      // 删除版本
      if (item.versionStatus === 'CURRENT' || item.versionStatus === 'HISTORY') {
        this.$message.error('版本不允许删除！');
        return;
      }
      try {
        await this.$confirm('确定删除这个版本吗？', this.$t('common.tip'), { type: 'warning' });
        await delVersion({ workflowVersionId: item.id });
        const flag = this.currentVersion.id === item.id;
        await this.fetchVersionList(flag);
        this.$bus.$emit('shouldChangeFlowList'); // 每次删除或者修改要更新流程列表
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async addVersion() {
      // 新增流程版本
      try {
        this.loading = true;
        const obj = this.list[0] || {};
        const params = this.list.length
          ? {
            workflowVersionId: obj.id,
            workflowId: this.activeFlow.id
          }
          : { workflowId: this.activeFlow.id };
        await addFlowVersion(params);
        await this.fetchVersionList(false);
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    async fetchVersionList(flag = true) {
      // 获取流程版本列表
      try {
        const list = await getFlowVersion({ workflowId: this.activeFlow.id });
        const newList = list.sort((a, b) => b.version - a.version);
        this.list = newList;
        // 首先找到有没有在使用中的流程
        // eslint-disable-next-line max-len
        const useVersion = this.list.find((item) => item.version === (this.currentVersion.version || this.activeFlow.activeVersion));
        if (useVersion && flag) {
          this.$bus.$emit('chooseFlowVersion', useVersion);
        } else if (!useVersion && flag) {
          // 如果没有找到使用中的流程，默认显示最后一个版本的数据
          this.$bus.$emit('chooseFlowVersion', this.list.at(-1) || {});
        } else if (this.list.length === 1) {
          this.$bus.$emit('chooseFlowVersion', this.list.at(-1) || {});
        }
      } catch (e) {
        this.list = [];
      }
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.flowVersionWrap {
  height: 100%;
  width: 100%;

  .versionTitle {
    height: 46px;
    padding: 0 20px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: #333333;
    line-height: 46px;
    border-bottom: 1px solid #e9e9e9;
    box-sizing: border-box;
  }

  .versionWrap {
    height: calc(100% - 46px);
    padding: 14px 0;
    box-sizing: border-box;

    .versionAdd {
      padding: 0 20px;

      .list-btn {
        width: 100%;

        .icon-xinzeng {
          margin-right: 5px;
          color: #4689f5;
        }
      }
    }

    .list-scroll {
      width: 100%;
      height: calc(100% - 30px);
      padding: 0 20px;
      box-sizing: border-box;
      overflow: auto;

      .list-item {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        margin-top: 10px;
        height: 36px;
        border-radius: 4px;
        border: 1px solid #e9e9e9;
        box-sizing: border-box;
        cursor: pointer;

        &.active {
          background: #ffffff;
          box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
        }

        &:hover {
          background: #ffffff;
          box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
        }

        .item-left {
          width: calc(358px - 123px);
          line-height: 36px;
          overflow: hidden;

          & span {
            vertical-align: top;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
          }

          .item-name {
            display: inline-block;
            max-width: calc(100% - 110px);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }

          .icon-liucheng {
            margin: 0 9px 0 8px;
            font-size: 24px;
            vertical-align: top;
          }

          .using {
            display: inline-block;
            margin-left: 5px;
            margin-top: 7px;
            padding: 0 8px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            //color: #4689F5;
            //background: #F1F7FF;
            border-radius: 4px;
            height: 22px;
            line-height: 22px;

            &.el-tag.el-tag--light {
              background-color: #f1f7ff !important;
              border: none;
              color: #4689f5;
            }

            &.el-tag.el-tag--success {
              background-color: #ebfcf7 !important;
              border: none;
              color: #10b98a !important;
            }

            &.el-tag.el-tag--danger {
              background-color: #f1f3f6 !important;
              border: none;
              color: #6b798d !important;
            }
          }
        }

        .item-right {
          line-height: 36px;

          .icon-fuzhi {
            margin-right: 8px;
            font-size: 16px;
            color: #bbc3cd;
            cursor: pointer;
          }

          .split {
            color: #bbc3cd;
            vertical-align: top;
          }

          .icon-shanchu {
            margin: 0 9px;
            font-size: 16px;
            color: #bbc3cd;
            cursor: pointer;
          }

          ::v-deep {
            .el-switch {
              margin-right: 9px;
              vertical-align: sub;
            }
          }
        }
      }
    }
  }
}
</style>
