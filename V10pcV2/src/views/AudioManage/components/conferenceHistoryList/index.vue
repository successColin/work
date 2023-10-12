/**
* @name: index
* @author: DELL
* @date: 2023/9/1 8:51
* @description：index
* @update: 2023/9/1 8:51
*/
<!-- 页面 -->
<template>
  <div class="expert" v-loading="loading">
    <div class="header">
      <div>
        <apiot-button @click="handleDel">
          <i class="iconfont icon-shanchu m-r-4"></i>
          批量删除
        </apiot-button>
        <!--        <apiot-button @click="handleEdit">-->
        <!--          <i class="iconfont icon-bianji m-r-4"></i>-->
        <!--          编辑-->
        <!--        </apiot-button>-->
      </div>
      <div>
        <search-input
            @getList="handleSearch"
            v-model="params.keyword"
        ></search-input>
      </div>
    </div>
    <div class="main">
      <apiot-table
          ref="taskMain"
          :tableData="tableData"
          highlight-current-row
          :hasBigButton="true"
          :isNeedColumnDrop="false"
          :isNeedAsync="true"
          @selection-change="handleSelectionChange"
      >
        <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :label="$t(item.label)"
            :buttonArr="item.buttonArr"
            :fixed="item.fixed"
            @editFun="editFun"
        ></component>
      </apiot-table>

    </div>
    <div class="footer">
      <apiot-pagination
          v-show="tableData.length"
          ref="pagination"
          :total="total"
          :size.sync="params.size"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          @handle-cancel="handleCancle"
      ></apiot-pagination>
    </div>
    <apiot-dialog
      title="视频回放"
      :isShowFooter="false"
      :isBigDialog="true"
      :visible.sync="visible"
      class="videoDialog"
      :destroy-on-close="true"
  >
  <video
   id="player-container-id"
   preload="auto" playsinline webkit-playsinline
   style="width: 100%;height: 100%"></video></apiot-dialog>
  </div>
</template>

<script>
import { getHistory, delHistory } from '@/api/expert';
import OperationColumn from './components/operationColumn';
import StateColumn from './components/stateColumn';

export default {
  props: {
    isComponet: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      player: null,
      loading: false,
      params: {
        keyword: '',
        size: 20,
        current: 1
      },
      tableData: [],
      total: 0,
      visible: false,
      selectKeys: [],
      columnData: [
        // 任务名称
        {
          label: 'expert.keycode',
          prop: 'keycode',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'expert.glassesName',
          prop: 'glassesName',
          compName: 'ElTableColumn'
        },
        // 周期
        {
          label: 'expert.meetingName',
          prop: 'name',
          compName: 'ElTableColumn'
        },
        // 上次执行时间
        {
          label: 'expert.meetingInitiator',
          prop: 'inviteName',
          compName: 'UserColumn'
        },
        // 上次执行时间
        {
          label: 'expert.participants',
          prop: 'domain',
          compName: 'StateColumn'
        },
          // 上次执行时间
        {
          label: 'expert.meetingTime',
          prop: 'createTime',
          compName: 'ElTableColumn'
        },
        {
          width: 60,
          fixed: 'right',
          compName: 'OperationColumn',
          label: 'knowledge.list_opea',
          buttonArr: [
            {
              name: 'expert.viewplayback',
              funcName: 'editFun'
            },
          ]
        }
      ],
    };
  },

  components: {
    OperationColumn,
    StateColumn,
  },

  computed: {
  },

  mounted() {
    this.init();
  },
  watch: {
   visible: {
    handler(v) {
      if (!v) {
        this.cancleClick();
      }
    }
   }
  },
  methods: {
    async init() {
      this.loading = true;
      this.targetUser = {};
      try {
        const res = await getHistory(this.params);
        const {
          total = 0,
          records = []
        } = res;
        this.total = total;
        this.tableData = records;
        this.loading = false;
      } catch (e) {
        this.loading = false;
      }
    },
    handleDel() {
      if (!this.selectKeys.length) {
        this.$message.error('请选择会议历史再删除!');
        return;
      }
      this.$confirm('确定要删除这些会议历史吗？',
          {
            type: 'warning',
            title: '提示'
          },
      )
          .then(async () => {
            const ids = this.selectKeys.map((item) => item.id).join(',');
            try {
              await delHistory({ ids });
              this.handleCurrentChange(1);
              this.$message.success('操作成功!');
            } catch (e) {
              console.log(e);
              // this.$message.error('删除失败!');
            }
          });
    },
    cancleClick() {
      console.log(1111);
      // eslint-disable-next-line no-unused-expressions
      this.player && this.player.dispose();
    },
    editFun({ videourl }) {
      if (!videourl) return;
      this.visible = true;
      this.$nextTick(() => {
        setTimeout(() => {
          this.player = window.TCPlayer('player-container-id', {
              sources: [{
                src: 'path/to/video',
              }],
              licenseUrl: 'https://license-url',
          });
          this.player.src(videourl); // url 播放地址
        }, 200);
      });
      console.log(videourl);
    },
    // 选中取消
    handleCancle() {
      this.selectKeys = [];
      this.$refs.taskMain.clearSelection();
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.selectKeys = val;
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.params.current = 1;
      this.params.size = size;
      this.init();
    },
    // 点击页项
    handleCurrentChange(page) {
      this.params.current = page;
      this.init();
    },
    handleSearch() {
      this.params.current = 1;
      this.init();
    }
  },
  name: 'index',
};
</script>

<style lang='scss' scoped>
.expert {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .videoDialog {
    ::v-deep {
      .el-dialog__body{
        padding: 10px 20px;
      }
    }
  }
  .header {
    height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;
    background: #FFFFFF;
    box-sizing: border-box;

    .icon-bianji, .icon-shanchu {
      color: #4689F5;
    }
  }

  .main {
    width: 100%;
    height: calc(100% - 42px - 48px);
  }

  .footer {
    width: 100%;
    height: 42px;
    background: #FFFFFF;
    box-shadow: inset 0px 1px 0px 0px #E9E9E9;
  }
}
</style>
