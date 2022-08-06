<!--
 * @Author: sss
 * @Date: 2021-05-29 08:47:58
 * @Last Modified by: sss
 * @Last Modified time: 2021-05-29 08:47:58
 * @Desc: 迁移日志
-->
<template>
  <section class="transferLogList" v-loading="contentLoading">
    <header class="transferLogList__header">
      <search-input v-model="keywords" @getList="getList"></search-input>
    </header>
    <div class="transferLogList__main">
      <apiot-table
        :tableData="tableData"
        :showSelection="false"
        :dropColumnData="columnData"
        highlight-current-row
        dropClass=".transferLogList__main"
      >
        <component
          v-for="(item, index) in columnData"
          :is="item.compName"
          :key="`${item.prop}_${index}`"
          :prop="item.prop"
          :label="`${$t(item.label)}`"
          :width="item.width"
          :type="item.type"
          :align="item.align"
          :buttonArr="item.buttonArr"
          :fixed="item.fixed"
          :headImg="item.headImgProp"
        ></component>
        <el-table-column width="60" :label="`${$t('common.operate')}`">
          <template slot-scope="scope">
            <a class="download" :href="scope.row.url">{{
              $t('common.download')
            }}</a>
          </template>
        </el-table-column>
      </apiot-table>

      <!--  -->
    </div>
  </section>
</template>

<script>
import { listTransfer } from '@/api/systemLog';

export default {
  components: {},

  props: {},

  data() {
    return {
      keywords: '',
      current: 1,
      size: 10,
      tableData: [],
      contentLoading: false,
      columnData: [
        // 序号
        {
          type: 'index',
          align: 'center',
          compName: 'ElTableColumn',
          width: 40,
          fixed: 'left'
        },
        // 操作人
        {
          label: 'common.operator',
          prop: 'username',
          compName: 'UserColumn',
          width: 110,
          headImgProp: 'icon'
        },
        // 迁移截至时间
        {
          label: 'systemLog.deadline',
          prop: 'endTime',
          compName: 'ElTableColumn'
        },
        // 操作时间
        {
          label: 'common.operatingTime',
          prop: 'migrationTime',
          compName: 'ElTableColumn'
        }
      ]
    };
  },

  computed: {},

  methods: {
    // 获取列表
    async getList() {
      this.contentLoading = true;
      try {
        const { current, size, keywords } = this;
        const list = await listTransfer({
          current,
          size,
          keywords,
          orders: [{ asc: false, column: 'id' }]
        });
        this.contentLoading = false;
        this.tableData = list;
        // this.total = list.total;
      } catch (e) {
        this.contentLoading = false;
      }
    }
  },

  mounted() {
    this.getList();
  }
};
</script>

<style lang='scss' scoped>
.transferLogList {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 20px;
  &__header {
    margin: 6px 0;
  }
  &__main {
    flex: 1;
  }
  .download {
    color: #4689f5;
    text-decoration: none;
  }
}
</style>
