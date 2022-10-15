<template>
  <apiot-dialog
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    title="选择面板"
  >
    <div class="search m-b-10">
      <search-input @getList="sysMenuPage" v-model="keyWord"></search-input>
    </div>
    <apiot-table
      ref="table"
      :showRadio="true"
      :tableData="tableData"
      :currentRadioObj.sync="currentRadioObj"
    >
      <el-table-column
        prop="menuName"
        :label="$t('common.name', { name: $t('menu.menu') })"
      >
        <template slot-scope="scope">
          {{ scope.row.panelName }}
        </template>
      </el-table-column>
    </apiot-table>
    <apiot-pagination
      :size.sync="size"
      @sizeChange="sizeChange"
      :total="total"
      :isSystem="false"
      :current-page.sync="current"
      :pager-count="5"
      layout="total,  prev, next, sizes,jumper"
    ></apiot-pagination>
  </apiot-dialog>
</template>

<script>
import { pagePanel } from '@/api/menuConfig';

export default {
  name: '',
  props: {
    showMenu: {
      type: Boolean
    }
  },
  data() {
    return {
      curSetion: [],
      tableData: [],
      size: 10,
      current: 1,
      total: 0,
      keyWord: '',
      currentRadioObj: null
    };
  },
  computed: {
    getIds() {
      const temp = [];
      this.curSetion.forEach((item) => temp.push(item.id));
      return temp.join();
    }
  },
  mounted() {
    this.sysMenuPage();
  },
  components: {},
  methods: {
    sureClick() {
      console.log('click');
      if (!this.currentRadioObj) {
        return this.$message({
          type: 'warning',
          message: '请选择菜单'
        });
      }
      this.$emit('addMenu', this.currentRadioObj);
      this.$emit('update:visible', false);
    },
    // 获取面板列表
    async sysMenuPage() {
      const params = {
        current: this.current,
        keywords: this.keyWord,
        panelType: '',
        size: this.size,
        relationMenuDesignId: this.$route.query.id,
        clientType: this.$route.query.isApp === '1' ? 2 : 1,
        panelClassify: 1
      };
      const data = await pagePanel(params);
      this.tableData = data.records;
      this.total = data.total;
    },
    sizeChange() {
      if (this.current === 1) {
        this.sysMenuPage();
      } else {
        this.current = 1;
      }
    }
  },
  watch: {
    showMenu(v) {
      if (!v) {
        this.currentRadioObj = null;
      }
    },
    current() {
      this.sysMenuPage();
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
