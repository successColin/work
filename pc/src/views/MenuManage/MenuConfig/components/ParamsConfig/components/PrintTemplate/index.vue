<!--
 * @Descripttion：打印模板配置
 * @Author: ytx
 * @Date: 2021-09-07 10:02:06
 * @Last Modified by: ytx
 * @Last Modified time: 2021-09-07 10:02:06
-->
<template>
  <!-- <div class="" @click="handleJump">跳转打印模板</div> -->
  <div class="printTemplate" v-loading="contentLoading">
    <div class="printTemplate__content">
      <header class="printTemplate__header">
        <apiot-button type="primary" @click="handleAdd">
          <i class="iconfont icon-xinzeng m-r-4"></i>
          {{ $t('common.add', { name: '打印模板' }) }}
        </apiot-button>
        <apiot-button @click="handleDelete">
          <i class="iconfont icon-shanchu m-r-4"></i>
          删除打印模板
        </apiot-button>
      </header>
      <apiot-table
        class="printTemplate__main"
        ref="printTemplateMain"
        :tableData="tableData"
        :dropColumnData="columnData"
        highlight-current-row
        dropClass=".printTemplate__main"
        :hasBigButton="true"
        :isNeedAsync="true"
        @selection-change="handleSelectionChange"
      >
        <component
          v-for="(item, index) in columnData"
          :is="item.compName"
          :key="`${item.prop}_${index}`"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :buttonArr="item.buttonArr"
          :buttonArr1="item.buttonArr1"
          :fixed="item.fixed"
          :typesPropName="item.typesPropName"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          @editFun="editFun"
          @switchChange="switchChange"
        ></component>
      </apiot-table>
    </div>
  </div>
</template>

<script>
import {
  getListSysPrintTemplate,
  deleteSysPrintTemplate,
  updateIsEnabled
} from '@/api/printTemplate';

export default {
  name: 'MessageTemplate',

  props: {},

  data() {
    return {
      contentLoading: false,
      tableData: [], // 列表数据
      multiExpressionArr: [], // 列表选中的数据
      operateType: 'add',
      showDetail: false,
      isAdd: true,
      columnData: [
        // 模板名称
        {
          label: '模板名称',
          prop: 'name',
          compName: 'ElTableColumn'
        },
        // 类型
        {
          label: '类型',
          prop: 'type',
          typesPropName: 'JOB_TYPE',
          compName: 'TypesColumn'
        },
        // 创建人
        {
          label: '创建人',
          prop: 'createUserName',
          compName: 'UserColumn'
        },
        // 是否启用
        {
          label: '是否启用',
          prop: 'enabled',
          compName: 'SwitchColumn'
        },
        {
          width: 100,
          fixed: 'right',
          compName: 'OperateColumn',
          buttonArr: [{ name: 'common.edit1', funcName: 'editFun' }]
        }
      ]
    };
  },

  computed: {
    drawerTitle() {
      return this.$t(this.operateType, { name: this.$t('timedTask.timedTask') });
    },
    // 多选数据ids的集合
    multiIdsString() {
      let str = '';
      this.multiExpressionArr.forEach((item) => {
        str += `${item.id},`;
      });
      return str;
    }
  },

  watch: {},

  methods: {
    // 获取列表
    async getList() {
      this.contentLoading = true;
      this.tableData = await getListSysPrintTemplate({
        MenuId: this.$route.query.id
      });
      this.contentLoading = false;
    },
    jumpFun(v) {
      this.$router.push(
        `/printTemplate/${this.$route.params.id}?menuName=${this.$route.query.menuName}&id=${
          this.$route.query.id
        }${v || ''}`
      );
    },
    // 添加消息模板
    handleAdd() {
      this.operateType = 'common.add';
      this.showDetail = true;
      this.isAdd = true;
      this.jumpFun();
    },
    // 删除
    handleDelete() {
      if (!this.multiIdsString) {
        // 枚举值不能为空
        return this.$message({
          type: 'error',
          message: this.$t('placeholder.pleaseSelect', { any: this.$t('helpCenter.deleteData') })
        });
      }
      this.$confirm(this.$t('common.areYouSureToDelete', { name: '？' }), this.$t('common.tip'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancle'),
        type: 'warning'
      }).then(async () => {
        await deleteSysPrintTemplate({ ids: this.multiIdsString });
        this.$message({
          type: 'success',
          message: this.$t('common.deleteSuccess')
        });
        this.getList();
      });
    },
    // 启用和禁用
    async switchChange(v) {
      // console.log(v);
      // 接口需要改
      await updateIsEnabled({
        id: v.id,
        enabled: v.enabled
      });
      this.getList();
    },
    // 编辑消息模板
    async editFun(row) {
      // console.log(row);
      this.operateType = 'common.edit';
      this.showDetail = true;
      this.isAdd = false;
      const params = row.id ? `&detailId=${row.id}` : '';
      this.jumpFun(params);
    },
    // 多选数据改变
    handleSelectionChange(val) {
      this.multiExpressionArr = val;
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang='scss' scoped>
//右边样式变量
$--headerHeight: 42px;
$--footerHeight: 42px;
.printTemplate {
  margin: 13px 20px 0 20px;
  height: calc(100% - 20px);
  &__content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &__header {
    flex: 0 0 $--headerHeight;
    line-height: $--headerHeight;
    .icon-shanchu {
      color: $--color-primary;
    }
  }
  &__main {
    flex: 1;
    overflow: auto;
  }
}
</style>
