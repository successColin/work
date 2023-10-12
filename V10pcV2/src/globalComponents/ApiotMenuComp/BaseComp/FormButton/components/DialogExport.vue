<template>
  <apiot-dialog
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    title="选择导出列"
    :loading="loading"
  >
    <apiot-table
      ref="table"
      :tableData="tableData"
      :isAnimate="false"
      @selection-change="handleSelectionChange"
    >
      <el-table-column prop="title" label="列名称"> </el-table-column>
    </apiot-table>
  </apiot-dialog>
</template>

<script>
import query from '@/api/query';
import { Decrypt, Encrypt, getBlob, saveAs } from '@/utils/utils';

export default {
  name: '',
  props: {
    tableData: {
      type: Array,
    },
    exportVisible: {
      type: Boolean,
    },
    paramsObj: {
      type: Object,
    },
  },
  data() {
    return {
      memo: [],
      columns: [],
      tableInfo: {},
      loading: false,
    };
  },
  inject: ['resolveFormula'],
  computed: {
    // 是否需要数据权限
    getDataPermissions() {
      if (this.$store.state.userCenter.userInfo.isSupAdmin) {
        return false;
      }
      return this.tableInfo && this.tableInfo.needPermissions == null
        ? true
        : this.tableInfo.needPermissions;
    },
  },
  mounted() {},
  components: {},
  methods: {
    async sureClick() {
      this.loading = true;
      if (this.memo.length === 0 && this.columns.length === 0) {
        this.loading = false;
        return this.$message({
          type: 'warning',
          message: '请选择列名称',
        });
      }
      const {
        dictMap,
        needField,
        mainTable,
        chooseArr,
        // columns,
        collectionArr,
        tableTitleArr,
        // memo,
        tableInfo,
        getAllForm,
        configData,
        whereOptions,
      } = this.paramsObj;
      this.tableInfo = tableInfo;

      let url = query.DO_Export_Interface;
      if (configData.enableLog) {
        const { userInfo } = this.$store.state.userCenter;
        const logContent = `${userInfo.username}(${userInfo.account})导出界面(${this.$route.query.title})数据,表名:${mainTable}`;
        url += `&logData.content=${Encrypt(
          logContent,
        )}&logData.clientType=PC&logData.curMenuId=${
          this.$route.params.id || this.$route.query.menuId
        }`;
      }
      const objData = {
        dictMap,
        isHeader: needField ? 1 : 0,
        mainTable,
        chooseIds: chooseArr.join(','),
        columns: this.columns.join(','),
        foreignJson: JSON.stringify(collectionArr),
        memo: this.memo.join(','),
        cellRange: tableTitleArr.length ? JSON.stringify(tableTitleArr) : '',
        menuId: this.$route.params.id || this.$route.query.menuId,
        userid: this.$store.state.userCenter.userInfo.id,
        whereOptions,
        compMap: getAllForm,
        dataPermissions: this.dataPermissions,
      };
      try {
        getBlob(
          {
            url,
            token: Decrypt(localStorage.getItem('token') || ''),
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(objData),
          },
          (res) => {
            saveAs(res, `${this.$route.query.title || '导出内容'}.xls`);
            this.$emit('update:visible', false);
            this.loading = false;
          },
        );
      } catch (error) {
        this.loading = false;
      }
    },
    handleSelectionChange(section) {
      console.log(section);
      this.memo = [];
      this.columns = [];
      section.forEach((v) => {
        if (v.children.length) {
          v.children.forEach((c) => {
            this.memo.push(c.title);
            this.columns.push(c.columns);
          });
        } else {
          this.memo.push(v.title);
          this.columns.push(v.columns);
        }
      });
    },
  },
  watch: {
    exportVisible(v) {
      if (!v) {
        this.memo = [];
        this.columns = [];
        this.$refs.table.clearSelection();
      } else {
        this.$nextTick(() => {
          this.$broadcast('changeHeight');
          this.$refs.table.defaultSelection();
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
