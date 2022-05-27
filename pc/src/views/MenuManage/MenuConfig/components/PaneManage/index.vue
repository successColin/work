<!-- 字段管理 -->
<template>
  <section class="pane__wrapper" v-loading="showLoading">
    <div class="pane__sidebar">
      <ul class="pane__sidebar--ul">
        <li
          class="pane__sidebar--li"
          :class="[{ active: panelShowType === 1 }]"
          @click="panelShowType = 1"
        >
          <i class="iconfont icon-putongmianban" style="color: #5a80ed"></i>
          <span>普通面板</span>
        </li>
        <li
          class="pane__sidebar--li"
          :class="[{ active: panelShowType === 2 }]"
          @click="panelShowType = 2"
        >
          <i
            class="iconfont icon-shujuxuanzekuangmianban"
            style="color: #ee5e5e"
          ></i>
          <span>数据选择框面板</span>
        </li>
      </ul>
    </div>
    <div class="pane__content">
      <header class="pane__header">
        <apiot-button type="primary" @click="addField">
          <i class="iconfont icon-xinzeng m-r-4"></i
          >{{ $t('common.add', { name: $t('menuConfig.pane') }) }}
        </apiot-button>
        <apiot-button @click="deleteField">
          <i class="iconfont icon-shanchu m-r-4"></i
          >{{ $t('common.delete', { name: $t('menuConfig.pane') }) }}
        </apiot-button>
        <condition-input
          class="m-t-10"
          @getList="getColumnList"
          v-model="keyWord"
          :selectValue.sync="selectValue"
          :selectArr="$store.state.dictManage.PANEL_TYPE"
        ></condition-input>
      </header>
      <section class="pane__main">
        <apiot-table
          :tableData="tableData"
          row-key="id"
          :highlight-current-row="true"
          :dropColumnData="dropColumnData"
          @selection-change="handleSelectionChange"
          @cellMouseEnter="cellMouseEnter"
          ref="paneTable"
          dropClass=".pane__main"
        >
          <component
            v-for="(item, index) in dropColumnData"
            :key="`${item.prop}_${index}`"
            :label="$t(item.label)"
            :prop="item.prop"
            show-overflow-tooltip
            :width="item.width"
            :is="dropColumnData[index].compName"
            :typesPropName="item.typesPropName"
            :colorIndex="item.colorIndex"
            :fixed="item.fixed"
            :buttonArr="item.buttonArr"
            :showFunc="showFunc"
            @editPane="editPane"
            @editSelData="editSelData"
            @editConfig="editConfig"
          ></component>
        </apiot-table>
      </section>
      <footer class="pane__footer">
        <ApiotPagination
          :selectedNum="multiEntityArr.length"
          :total="total"
          :size.sync="size"
          :current-page.sync="current"
          @handle-cancel="handleCancel"
          @size-change="sizeChange"
          @current-change="currentChange"
        ></ApiotPagination>
      </footer>
    </div>
    <AddPane
      ref="addField"
      :visible.sync="drawer"
      :curDrawerType="curDrawerType"
      @addPaneRes="addPaneRes"
      @editRes="editRes"
    ></AddPane>
    <transition name="slide-bottom">
      <design-config
        v-if="showConfig"
        :visible.sync="showConfig"
        :sysMenuDesignId="row.sysMenuDesignId"
        :panelName="row.panelName"
      ></design-config>
    </transition>
    <transition name="slide-bottom">
      <SelectDesignConfig
        v-if="showDataConfig"
        :visible.sync="showDataConfig"
        :curDrawerType="curDrawerType"
        :row="curDrawerType === 2 ? row : {}"
        :sysMenuDesignId="curDrawerType === 2 ? row.sysMenuDesignId : 0"
        :panelName="curDrawerType === 2 ? row.panelName : ''"
        @saveSuccess="saveSuccess"
      ></SelectDesignConfig>
    </transition>
  </section>
</template>

<script>
import { pagePanel, batchDeletePanel } from '@/api/menuConfig';
import AddPane from './components/AddPane';
import DesignConfig from './components/DesignConfig';
import SelectDesignConfig from './components/SelectDesignConfig';

export default {
  props: {
    tableName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showLoading: false,
      keyWord: '', // 搜索关键字
      tableData: [], // 表格结果数据
      dropColumnData: [
        // 字段名称
        {
          label: 'menuConfig.paneTable.paneName',
          prop: 'panelName',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: 'menuConfig.paneTable.paneType',
          prop: 'panelType',
          colorIndex: [1, 2],
          typesPropName: 'PANEL_TYPE',
          compName: 'TypesColumn'
        },
        // 备注
        {
          label: 'menuConfig.paneTable.memo',
          prop: 'memo',
          compName: 'ElTableColumn'
        },
        // 操作
        {
          buttonArr: [
            { name: 'entity.entityTable.operateBtn1', funcName: 'editPane' },
            {
              name: 'menuConfig.paneTable.design',
              funcName: 'editConfig'
            }
          ],
          fixed: 'right',
          compName: 'OperateColumn'
        }
      ], // 表格列数据
      curDrawerType: 1, // 新增为 1 编辑为2
      drawer: false, // 是否展示新增、编辑
      multiEntityArr: [],
      total: 0,
      current: 1,
      size: 20,
      selectArr: [], // 筛选数组
      selectValue: '', // 分组筛选框
      row: null, // row 信息暂存
      showConfig: false, // 展示配置
      showDataConfig: false, // 展示数据选择框的配置
      panelShowType: 1 // 1 代表普通 2 代表数据选择
    };
  },

  components: {
    AddPane,
    DesignConfig,
    SelectDesignConfig
  },

  computed: {
    // 多选数据ids的集合
    multiStringObj() {
      let ids = '';
      this.multiEntityArr.forEach((item) => {
        ids += `${item.id},`;
      });
      return { ids };
    }
  },

  mounted() {
    this.init();
  },

  methods: {
    cellMouseEnter(row) {
      if (row.panelType === 0) {
        row.showIndex = true;
      }
    },
    // 初始化操作
    init() {
      this.getColumnList();
      this.$store.dispatch('getCurrentDict', 'PANEL_TYPE');
      // console.log(this.$store.state.dictManage.PANEL_TYPE);
    },
    // 是否显示编辑
    showFunc(row) {
      if (this.panelShowType === 2 && row.panelType === 0) {
        return true;
      }
      return false;
    },
    // 添加操作
    addField() {
      this.row = null;
      this.curDrawerType = 1;
      if (this.panelShowType === 1) {
        this.drawer = true;
      } else {
        this.showDataConfig = true;
      }
    },
    // 每页大小改变
    sizeChange(size) {
      this.current = 1;
      this.size = size;
      this.addPaneRes();
    },
    // 改变页码
    currentChange(current) {
      this.current = current;
      this.getColumnList();
    },

    // 新增结果
    addPaneRes() {
      this.getColumnList();
    },
    // 删除操作
    deleteField() {
      if (!this.multiEntityArr.length) {
        return this.$message({
          type: 'error',
          message: this.$t('entity.selectDelData')
        });
      }
      this.batchDeletePanel();
    },
    // 删除
    async batchDeletePanel() {
      await this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
      await batchDeletePanel({
        ids: this.multiStringObj.ids
      });
      this.current = 1;
      this.addPaneRes();
      this.$message({
        type: 'success',
        message: '删除成功'
      });
    },
    // 编辑
    editPane(row) {
      // console.log('编辑', row);
      this.curDrawerType = 2;
      this.drawer = true;
      this.row = row;
      this.$refs.addField.initFormData(row);
    },
    // 编辑选择面板
    editSelData(row) {
      // console.log(row);
      this.curDrawerType = 2;
      this.showDataConfig = true;
      this.row = row;
    },
    // 编辑成功结果
    editRes(rowInfo) {
      this.row.panelName = rowInfo.panelName;
      this.row.memo = rowInfo.memo;
      this.row = null;
    },
    // 编辑设计
    editConfig(row) {
      // console.log('设计', row);
      this.row = row;
      this.showConfig = true;
    },
    // 获取面板列表
    async getColumnList() {
      try {
        this.showLoading = true;
        const params = {
          current: this.current,
          keywords: this.keyWord,
          panelType: this.selectValue,
          size: this.size,
          relationMenuDesignId: this.$route.query.id,
          clientType: this.$route.query.isApp === '1' ? 2 : 1,
          panelClassify: this.panelShowType
        };
        const data = await pagePanel(params);
        this.tableData = data.records;
        this.total = data.total;
        this.showLoading = false;
      } catch (error) {
        this.showLoading = false;
      }
    },
    // 多选更改
    handleSelectionChange(val) {
      this.multiEntityArr = val;
    },
    handleCancel() {
      this.$refs.paneTable.clearSelection();
      this.multiEntityArr = [];
    },
    // 保存成功，刷新列表
    saveSuccess() {
      this.current = 1;
      this.handleCancel();
      this.getColumnList();
    }
  },

  watch: {
    drawer(v) {
      // drawer 关闭的时候统一清空输入内容
      if (!v && this.$refs.addField) {
        this.$refs.addField.resetForm();
        // console.log(123123);
      }
    },
    panelShowType(v) {
      if (v === 1) {
        this.dropColumnData = [
          // 字段名称
          {
            label: 'menuConfig.paneTable.paneName',
            prop: 'panelName',
            compName: 'ElTableColumn'
          },
          // 类型
          {
            label: 'menuConfig.paneTable.paneType',
            prop: 'panelType',
            colorIndex: [1, 2],
            typesPropName: 'PANEL_TYPE',
            compName: 'TypesColumn'
          },
          // 备注
          {
            label: 'menuConfig.paneTable.memo',
            prop: 'memo',
            compName: 'ElTableColumn'
          },
          // 操作
          {
            buttonArr: [
              { name: 'entity.entityTable.operateBtn1', funcName: 'editPane' },
              {
                name: 'menuConfig.paneTable.design',
                funcName: 'editConfig'
              }
            ],
            fixed: 'right',
            compName: 'OperateColumn'
          }
        ];
      }
      if (v === 2) {
        this.dropColumnData = [
          // 字段名称
          {
            label: 'menuConfig.paneTable.paneName',
            prop: 'panelName',
            compName: 'ElTableColumn'
          },
          // 类型
          {
            label: 'menuConfig.paneTable.paneType',
            prop: 'panelType',
            colorIndex: [1, 2],
            typesPropName: 'PANEL_TYPE',
            compName: 'TypesColumn'
          },
          // 备注
          {
            label: 'menuConfig.paneTable.memo',
            prop: 'memo',
            compName: 'ElTableColumn'
          },
          // 操作
          {
            buttonArr: [{ name: 'entity.entityTable.operateBtn1', funcName: 'editSelData' }],
            fixed: 'right',
            compName: 'OperateColumn'
          }
        ];
      }
      this.current = 1;
      this.handleCancel();
      this.getColumnList();
    }
  }
};
</script>

<style lang='scss' scoped>
@import '@/views/EntityManage/index.scss';

// class 变量名
$--name: 'pane';
// 头部的高度
$--headHeight: 48px;
// 计算表格宽度时减去的距离
$--desWidth: calc(100vw - 20px - 20px);
// 计算表格最短宽度
$--minWidth: calc(1024px - 20px);

@include setLayout($--name, $--headHeight, $--desWidth, $--minWidth);
.pane__wrapper {
  padding: 10px 10px 0;
  background-color: #f6f6f8;
  height: calc(100% - 10px);
  display: flex;
  align-items: center;
}
.pane__content {
  background-color: #fff;
  flex: 1;
}
.pane {
  &__sidebar {
    background-color: #fff;
    width: 240px;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    border-right: 1px solid #e9e9e9;
    &--li {
      height: 42px;
      line-height: 42px;
      padding-left: 26px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      min-width: 170px;
      i {
        font-size: 24px;
        margin-right: 8px;
      }
      span {
        font-size: 15px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
      &.active {
        background: #f1f7ff;
      }
    }
  }
}
</style>
