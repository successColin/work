<template>
  <apiot-dialog
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    title="选择导出菜单"
  >
    <apiot-table
      ref="table"
      :tableData="getCurTableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        prop="menuName"
        :label="$t('common.name', { name: $t('menu.menu') })"
      >
        <template slot-scope="scope">
          <icon-select
            :key="2"
            class="iconClass m-r-8"
            :item="scope.row.icon"
            :notEdit="true"
          ></icon-select
          >{{ scope.row.menuName }}
        </template>
      </el-table-column>
    </apiot-table>
  </apiot-dialog>
</template>

<script>
import { getBlob, saveAs, Decrypt } from '@/utils/utils';
import IconSelect from '../IconSelect';

export default {
  name: '',
  props: {
    tableData: {
      type: Array
    },
    showMenu: {
      type: Boolean
    }
  },
  data() {
    return {
      curSetion: []
    };
  },
  computed: {
    getIds() {
      const temp = [];
      this.curSetion.forEach((item) => temp.push(item.id));
      return temp.join();
    },
    getCurTableData() {
      return this.tableData.filter((data) => data.menuName);
    }
  },
  mounted() {},
  components: {
    IconSelect
  },
  methods: {
    async sureClick() {
      getBlob(
        {
          url: `/api/v1/system/design/exportMenu?menuIds=${this.getIds}`,
          token: Decrypt(localStorage.getItem('token') || ''),
          method: 'GET'
        },
        (res) => {
          const names = '导出菜单';
          saveAs(res, `${names}.txt`);
          this.$emit('update:visible', false);
        }
      );
    },
    handleSelectionChange(section) {
      this.curSetion = section;
    }
  },
  watch: {
    showMenu(v) {
      if (!v) {
        this.curSetion = [];
        this.$refs.table.clearSelection();
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.iconClass {
  ::v-deep {
    .iconSelect {
      width: 24px;
      height: 24px;
      .iconfont {
        font-size: 24px !important;
        line-height: 24px !important;
      }
      .showImg {
        width: 24px !important;
        height: 24px !important;
        border-radius: 4px !important;
        vertical-align: top;
      }
    }
  }
}
</style>
