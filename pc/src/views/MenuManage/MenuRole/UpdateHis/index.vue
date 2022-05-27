<template>
  <section class="updateHis">
    <div class="updateHis__table">
      <apiot-table
        :tableData="tableData"
        row-key="columnName"
        :showSelection="false"
        :dropColumnData="dropColumnData"
        :border="false"
        dropClass=".updateHis__table"
        ref="multiDialogTable"
      >
        <component
          v-for="(item, index) in dropColumnData"
          :key="`${item.prop}_${index}`"
          :label="$t(item.label)"
          :prop="item.prop"
          :type="item.type"
          :fixed="item.fixed"
          sortable="custom"
          :sort-orders="['ascending', 'descending']"
          show-overflow-tooltip
          :width="item.width"
          :colorIndex="item.colorIndex"
          :is="dropColumnData[index].compName"
          :typesPropName="item.typesPropName"
        ></component>
      </apiot-table>
    </div>
    <footer class="updateHis__footer" v-if="false">
      <apiot-pagination
        v-if="tableData.length"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      ></apiot-pagination>
    </footer>
  </section>
</template>

<script>
import { listOperationLog } from '@/api/menuConfig';

export default {
  props: {
    sysMenuDesignId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tableData: [],
      dropColumnData: [
        // 序号
        {
          type: 'index',
          align: 'center',
          compName: 'ElTableColumn',
          width: 40,
          fixed: 'left'
        },
        // 编码
        {
          label: '操作人',
          prop: 'username',
          compName: 'UserColumn'
        },
        {
          label: '操作类型',
          prop: 'operationContent',
          compName: 'ElTableColumn'
        },
        {
          label: '操作时间',
          prop: 'operationTime',
          compName: 'ElTableColumn'
        }
      ],
      current: 1,
      total: 0,
      size: 10
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.getHis();
  },

  methods: {
    // 点击页项
    handleCurrentChange(page) {
      this.current = page;
      this.getHis();
    },
    // 修改分页条数
    handleSizeChange(size) {
      this.current = 1;
      this.size = size;
      this.getHis();
    },
    // 获取历史
    async getHis() {
      const data = await listOperationLog({ sysMenuDesignId: this.sysMenuDesignId });
      // console.log(data);
      this.tableData = data;
    }
  }
};
</script>

<style lang='scss' scoped>
.updateHis {
  height: 100%;
  &__table {
    width: 100%;
    height: 100%;
    &.hasData {
      height: calc(100% - 40px);
    }
  }
  &__footer {
    width: 100%;
    height: 40px;
  }
}
</style>
