<template>
  <apiot-dialog
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    title="选择菜单"
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
import { pageWithOutHomePage } from '@/api/menuManage';
import IconSelect from '../../../../../../../../components/IconSelect';

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
  components: {
    IconSelect
  },
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
    async sysMenuPage() {
      const data = await pageWithOutHomePage({
        size: this.size,
        current: this.current,
        clientType: this.$route.query.isApp === '1' ? 2 : 1,
        menuLevel: 2,
        menuType: 2,
        keywords: this.keyWord
      });
      // console.log(data);
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
