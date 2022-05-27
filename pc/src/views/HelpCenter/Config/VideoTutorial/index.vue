<!--
 * @Descripttion: 视频教程
 * @Author: ytx
 * @Date: 2021-05-29 14:10:42
 * @Last Modified by: ytx
 * @Last Modified time: 2021-05-29 14:10:42
-->
<template>
  <apiot-content
    class="videoTutorial"
    :asideLoading.sync="asideLoading"
    :contentLoading="contentLoading"
  >
    <!-- 左侧 -->
    <template v-slot:sidebar>
      <sidebar-list
        ref="sidebarList"
        :asideLoading.sync="asideLoading"
        :parentId="parentId"
        @changeGroup="changeGroup"
      ></sidebar-list>
    </template>
    <!-- 操作 -->
    <div class="videoTutorial__opt">
      <!-- 按钮 -->
      <apiot-button type="primary" @click="handleAdd">
        <i class="iconfont icon-xinzeng m-r-4"></i>
        {{ $t('common.add', { name: '' }) }}
      </apiot-button>
      <apiot-button @click="handleDele">
        <i class="iconfont icon-shanchu m-r-4 iconColor"></i>
        {{ $t('common.delete', { name: '' }) }}
      </apiot-button>
      <search-input
        class="videoTutorial__input"
        v-model="searchKey"
        @getList="handleSearch"
      ></search-input>
    </div>
    <!-- 表格 -->
    <apiot-table
      class="videoTutorial__table"
      row-key="id"
      dropClass=".videoTutorial"
      :tableData="tableData"
      :dropColumnData="dropColumnData"
      :shouldResetAll.sync="shouldResetAll"
      @selection-change="handleSelectionChange"
    >
      <component
        v-for="(item, index) in dropColumnData"
        :key="`${item.prop}_${index}`"
        :label="$t(item.label)"
        :prop="item.prop"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
        show-overflow-tooltip
        :width="item.width"
        :is="item.compName"
        :fixed="item.fixed"
        :buttonArr="item.buttonArr"
        @clickVideo="clickVideo"
        @handleEditFun="handleEditFun"
      >
      </component>
    </apiot-table>
    <!-- 抽屉 -->
    <edit-drawer
      :title="drawerTitle"
      :placeholder="
        $t('placeholder.pleaseEnterAny', {
          any: this.$t('helpCenter.videoTitle'),
        })
      "
      :drawerTitle="$t('helpCenter.uploadVideo')"
      :visible.sync="showEditorDrawer"
      :isShow="showEditorDrawer"
      :currentTableObj.sync="currentTableObj"
      :isAddDrawerState="isAddDrawerState"
      :parentSid="parentSid"
      :getTableList="getTableList"
      :parentId="parentId"
    >
    </edit-drawer>
    <apiot-dialog
      width="68%"
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :isShowSure="false"
    >
      <my-video
        v-if="dialogVisible"
        ref="myVideo"
        class="videoTutorial__myVideo"
        :options="playerOptions"
        :playsinline="true"
      ></my-video>
    </apiot-dialog>
  </apiot-content>
</template>

<script>
import { getListDetail, postDeleteDetail } from '@/api/helpCenter';
import MyVideo from '@/views/HelpCenter/component/MyVideo';
import SidebarList from '../components/SidebarList';
import EditDrawer from '../components/EditDrawer';
import TableVideo from '../components/TableVideo';

export default {
  data() {
    return {
      // 播放视频
      dialogVisible: false,
      // 一级菜单
      parentId: 2,
      // 二级菜单
      parentSid: '',
      // loading
      asideLoading: true,
      contentLoading: false,
      // 搜索词
      searchKey: '',
      // 是否显示抽屉
      showEditorDrawer: false,
      // 抽屉状态 1:新增  2：编辑
      isAddDrawerState: true,
      // 表格数据
      tableData: [],
      // 表格列
      dropColumnData: [
        {
          label: 'helpCenter.name',
          prop: 'name',
          compName: 'ElTableColumn'
        },
        {
          label: 'helpCenter.videoSize',
          prop: 'videoSize',
          compName: 'ElTableColumn'
        },
        {
          label: 'helpCenter.video',
          prop: 'videoType',
          compName: 'TableVideo'
        },
        {
          // label: 'common.operate',
          buttonArr: [{ name: 'common.edit1', funcName: 'handleEditFun' }],
          fixed: 'right',
          compName: 'OperateColumn',
          width: 200
        }
      ],
      // 表格中多选数据
      multiArr: [],
      // 编辑__表格当前对象
      currentTableObj: null,
      // 左侧选中行
      currentSidebar: null,
      // 重置动画
      shouldResetAll: true,
      // 视频配置
      playerOptions: {
        autoplay: true,
        loop: true, // 使视频一结束就重新开始。
        muted: true, // 默认情况下将静音任何音频。
        language: 'zh-CN',
        notSupportedMessage: this.$t('helpCenter.videoTemporarilyUnavailable'), // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        flash: { hls: { withCredentials: false } }, // 可以使用rtmp视频
        html5: { hls: { withCredentials: false } }, // 可以使用m3u8视频
        playbackRates: [0.5, 1, 1.5, 2],
        noUITitleAttributes: true
      },
      dialogTitle: ''
    };
  },
  computed: {
    // 标题
    drawerTitle() {
      return this.isAddDrawerState
        ? this.$t('common.add', { name: this.$t('helpCenter.videoTutorial') })
        : this.$t('common.edit', { name: this.$t('helpCenter.videoTutorial') });
    },
    // 多选数据ids的集合
    multiIdsString() {
      let str = '';
      this.multiArr.forEach((item) => {
        str += `${item.id},`;
      });
      return str;
    }
  },
  components: {
    EditDrawer,
    SidebarList,
    TableVideo,
    MyVideo
  },
  mounted() {},
  methods: {
    // 初始值
    async init() {
      await this.$refs.sidebarList.getSidebarList();
    },
    // 点击视频播放
    clickVideo(v) {
      this.dialogVisible = true;
      this.playerOptions.sources = [
        {
          type: v.videoType,
          src: v.url
        }
      ];
      this.dialogTitle = `${v.name}`;
      this.playerOptions.poster = v.imageUrl;
    },
    // 左侧子传父
    changeGroup(item) {
      this.parentSid = item.id;
      this.getTableList();
    },
    // 获取表格中的数据
    async getTableList() {
      const res = await getListDetail({
        parentId: this.parentId,
        parentSid: this.parentSid,
        searchKey: this.searchKey
      });
      this.tableData = res;
      this.$refs.sidebarList.changeTableTotal(res.length);
    },
    // 搜索框__模糊搜索事件
    handleSearch() {
      this.getTableList();
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiArr = val;
    },
    // 按钮__编辑
    handleEditFun(arr) {
      this.currentTableObj = arr;
      this.showEditorDrawer = true;
      this.isAddDrawerState = false;
    },
    // 按钮__新增
    handleAdd() {
      this.isAddDrawerState = true;
      this.showEditorDrawer = true;
      this.currentTableObj = {};
    },
    // 按钮__删除
    async handleDele() {
      if (!this.multiIdsString) {
        // 枚举值不能为空
        return this.$message({
          type: 'error',
          message: this.$t('placeholder.pleaseSelect', { any: this.$t('helpCenter.deleteData') })
        });
      }
      this.$confirm(
        this.$t('common.areYouSureToDelete', { name: this.$t('helpCenter.details') }),
        this.$t('common.tip'),
        {
          confirmButtonText: this.$t('common.sure'),
          cancelButtonText: this.$t('common.cancle'),
          type: 'warning'
        }
      ).then(async () => {
        const detailId = this.multiIdsString;
        // 详情 id
        const param = {
          dealType: 3,
          parentId: this.parentId,
          detailId,
          parentSid: this.parentSid
        };
        await postDeleteDetail(param);
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.getTableList();
      });
    }
  }
};
</script>
<style lang='scss' scoped>
@import '../index.scss';
// 名称
$--name: 'videoTutorial';

@include setLayout($--name);
.videoTutorial {
  &__myVideo {
    width: 100%;
    height: 500px;
  }
  ::v-deep {
    .el-dialog__body {
      height: auto;
      box-sizing: border-box;
      padding: 0;
    }
  }
}
</style>
