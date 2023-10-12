<!--
 * @Descripttion: 更新日志
 * @Author: ytx
 * @Date: 2021-05-29 14:10:42
 * @Last Modified by: ytx
 * @Last Modified time: 2021-05-29 14:10:42
-->
<template>
  <apiot-content
    class="updateLog"
    :contentLoading="contentLoading"
    :sideWidth="0"
  >
    <!-- 操作 -->
    <div class="updateLog__opt">
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
        class="updateLog__input"
        v-model="searchKey"
        @getList="handleSearch"
      ></search-input>
    </div>
    <!-- 表格 -->
    <apiot-table
      class="updateLog__table"
      row-key="id"
      dropClass=".updateLog"
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
        :width="item.width"
        :is="item.compName"
        :fixed="item.fixed"
        :buttonArr="item.buttonArr"
        @handleEditFun="handleEditFun"
      >
      </component>
    </apiot-table>
    <!-- 抽屉 -->
    <edit-drawer
      :title="drawerTitle"
      :placeholder="
        $t('placeholder.pleaseEnterAny', {
          any: this.$t('helpCenter.updateLogTitle'),
        })
      "
      :drawerTitle="$t('helpCenter.text')"
      :visible.sync="showEditorDrawer"
      :isShow="showEditorDrawer"
      :currentTableObj.sync="currentTableObj"
      :isAddDrawerState="isAddDrawerState"
      :getTableList="getTableList"
      :parentId="parentId"
    >
    </edit-drawer>
  </apiot-content>
</template>

<script>
import { getListDetail, postDeleteDetail } from '@/api/helpCenter';
import EditDrawer from '../components/EditDrawer';
import TableDetails from '../components/TableDetails';

export default {
  data() {
    return {
      // 一级菜单
      parentId: 4,
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
          label: 'helpCenter.updateTime',
          prop: 'logUpdateTime',
          compName: 'ElTableColumn'
        },
        {
          label: 'helpCenter.details',
          prop: 'txt',
          compName: 'TableDetails'
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
      shouldResetAll: true
    };
  },
  computed: {
    // 标题
    drawerTitle() {
      return this.isAddDrawerState
        ? this.$t('common.add', { name: this.$t('helpCenter.updateLog') })
        : this.$t('common.edit', { name: this.$t('helpCenter.updateLog') });
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
    TableDetails
  },
  mounted() {},
  methods: {
    // 初始值
    async init() {
      this.getTableList();
    },
    // 获取表格中的数据
    async getTableList() {
      const res = await getListDetail({
        parentId: this.parentId,
        searchKey: this.searchKey
      });
      // console.log(res);
      this.tableData = res;
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
          type: 'warning',
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
          detailId
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
$--name: 'updateLog';

@include setLayout($--name);
</style>
