<template>
  <apiot-dialog
    @sure-click="sureClick"
    v-on="$listeners"
    v-bind="$attrs"
    title="选择导出列"
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
      type: Array
    },
    exportVisible: {
      type: Boolean
    },
    paramsObj: {
      type: Object
    }
  },
  data() {
    return {
      memo: [],
      columns: []
    };
  },
  computed: {},
  mounted() {},
  components: {},
  methods: {
    async sureClick() {
      if (this.memo.length === 0 && this.columns.length === 0) {
        return this.$message({
          type: 'warning',
          message: '请选择列名称'
        });
      }
      const {
        getAllFormObj,
        dictMap,
        needField,
        mainTable,
        chooseArr,
        // columns,
        collectionArr,
        // memo,
        getPanelObj,
        tableInfo,
        getAllForm,
        configData,
        getFatherPanel
      } = this.paramsObj;
      let whereOptions = '';
      let filterTermType = '';
      let filterTermStr = '';
      let filterTermSql = '';
      console.log('金莱尔');
      if (JSON.stringify(getPanelObj) !== '{}') {
        filterTermType = tableInfo.filterTermType;
        filterTermStr = tableInfo.filterTermStr;
        filterTermSql = tableInfo.filterTermSql;
      } else {
        const panelFilter = getFatherPanel && getFatherPanel.panelFilter[0];
        if (panelFilter) {
          filterTermType = panelFilter.filterTermType;
          filterTermStr = panelFilter.filterTermStr;
          filterTermSql = panelFilter.filterTermSql;
        }
      }
      if (filterTermType === 1) {
        if (filterTermStr) {
          const arr = JSON.parse(filterTermStr);
          console.log(arr);
          arr.termArr.forEach((item, z) => {
            whereOptions += '(';
            item.forEach((val, i) => {
              const { tableName, columnName } = val.columnObj;
              const { lambda, content } = val;
              whereOptions += `${tableName}.${columnName}${lambda}${content}`;
              if (i !== item.length - 1) {
                whereOptions += ' or ';
              }
            });
            if (z === arr.termArr.length - 1) {
              whereOptions += ') ';
            } else {
              whereOptions += ') and ';
            }
            console.log(whereOptions);
          });
        }
        // whereOptions = whereOptions.slice(0, -5);
      } else {
        const idArr = filterTermSql.match(/\$(\S*)\$/g);
        if (idArr) {
          idArr.forEach((item) => {
            whereOptions = filterTermSql.replace(
              /\$(\S*)\$/g,
              getAllFormObj[item.slice(1, item.length - 1)]
            );
          });
        } else {
          whereOptions = filterTermSql;
        }
      }
      let url = `${query.DO_Export_Interface}?dictMap=${encodeURI(
        JSON.stringify(dictMap)
      )}&isHeader=${needField ? 1 : 0}&mainTable=${mainTable}&chooseIds=${chooseArr.join(
        ','
      )}&columns=${encodeURI(this.columns.join(','))}&foreignJson=${encodeURI(
        JSON.stringify(collectionArr)
      )}&memo=${this.memo.join(',')}&menuId=${
        this.$route.params.id || this.$route.query.menuId
      }&userId=${
        this.$store.state.userCenter.userInfo.id
      }&whereOptions=${whereOptions}&compMap=${encodeURI(JSON.stringify(getAllForm))}`;
      if (configData.enableLog) {
        const { userInfo } = this.$store.state.userCenter;
        const logContent = `${userInfo.username}(${userInfo.account})导出界面(${this.$route.query.title})数据,表名:${mainTable}`;
        url += `&logData.content=${Encrypt(logContent)}&logData.clientType=PC&logData.curMenuId=${
          this.$route.params.id || this.$route.query.menuId
        }`;
      }
      getBlob(
        {
          url,
          token: Decrypt(localStorage.getItem('token') || ''),
          method: 'POST'
        },
        (res) => {
          saveAs(res, `${this.$route.query.title}.xls`);
          this.$emit('update:visible', false);
        }
      );
    },
    handleSelectionChange(section) {
      console.log(section);
      this.memo = [];
      this.columns = [];
      section.forEach((v) => {
        this.memo.push(v.title);
        this.columns.push(v.columns);
      });
    }
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
    }
  }
};
</script>

<style lang='scss' scoped>
</style>
