<template>
  <apiot-dialog
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    title="选择关联主页"
  >
    <apiot-table
      ref="table"
      :tableData="tableData"
      @selection-change="handleSelectionChange"
      v-loading="contentLoading"
    >
      <el-table-column
        prop="menuName"
        :label="$t('common.name', { name: '主页' })"
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
import { getFunctionList } from '@/api/homePage';
import { linkHomePage } from '@/api/menuManage';
import IconSelect from '../IconSelect';

export default {
  name: '',
  props: {
    showMenu: {
      type: Boolean
    },
    moduleId: {
      type: Number
    },
    list: {
      type: Array
    }
  },
  data() {
    return {
      curSetion: [],
      keywords: '',
      tableData: [],
      contentLoading: false
    };
  },
  computed: {
    getIds() {
      const temp = [];
      this.curSetion.forEach((item) => temp.push(item.id));
      return temp.join();
    },
    getHomePageId() {
      const arr = [];
      this.list.forEach((item) => {
        arr.push(item.homePageId);
      });
      return arr;
    }
  },
  mounted() {
    this.sysMenuList();
  },
  components: {
    IconSelect
  },
  methods: {
    // 获取列表
    async sysMenuList() {
      try {
        this.contentLoading = true;
        this.transitionName = 'fadeInUp';
        const data = await getFunctionList({ keywords: this.keywords });
        this.contentLoading = false;
        const res = [];
        data.forEach((item) => {
          const { colour, imageUrl, imageName } = item;
          item.state = 1;
          item.type = 'menu';
          item.icon = {
            icon: imageName,
            imageUrl,
            color: colour
          };
          if (!this.getHomePageId.includes(item.id)) {
            res.push(item);
          }
        });
        if (res.length) {
          this.tableData = res;
        }
      } catch (error) {
        this.contentLoading = false;
      }
    },
    async sureClick() {
      const params = {
        homePageIds: this.getIds,
        moduleId: this.moduleId
      };
      await linkHomePage(params);
      this.$emit('addHomeSuccess');
      this.$emit('update:visible', false);
      this.$message({
        type: 'success',
        message: '绑定成功'
      });
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
      if (v) {
        const res = [];
        this.tableData.forEach((item) => {
          if (!this.getHomePageId.includes(item.id)) {
            res.push(item);
          }
        });
        if (res.length) {
          this.tableData = res;
        }
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
