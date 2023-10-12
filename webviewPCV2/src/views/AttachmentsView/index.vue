<!--
 * @Descripttion: 泰州石化--查看附件
 * @Author: ytx
 * @Date: 2023-07-14 09:29:11
 * @Last Modified by: ytx
 * @Last Modified time: 2023-07-14 09:29:11
-->
<template>
  <section class="attachments">
    <div class="attachments__content">
      <header class="attachments__header">
        <search-input
          @getList="getColumnList"
          v-model.trim="keyWord"
        ></search-input>
      </header>
      <section class="attachments__main">
        <apiot-table
          ref="attachmentsMain"
          :tableData="tableData"
          :dropColumnData="columnData"
          highlight-current-row
          dropClass=".attachments__main"
          :hasBigButton="true"
          :isNeedAsync="true"
        >
          <component
            v-for="(item, index) in columnData"
            :is="item.compName"
            :key="`${item.prop}_${index}`"
            :prop="item.prop"
            :label="item.label"
            :buttonArr="item.buttonArr"
            :fixed="item.fixed"
            :width="item.width"
            @downloadFun="downloadFun"
          ></component>
        </apiot-table>
        <!--  -->
      </section>
    </div>
  </section>
</template>

<script>
import { saveAs } from '@/utils/utils';
import { downloadSingle, getFileUrlList } from '@/api/attachmentsView';

export default {
  data() {
    return {
      keyWord: '',
      initTableData: [],
      tableData: [], // 列表数据
      columnData: [
        {
          label: '文件名称',
          prop: 'name',
          compName: 'ElTableColumn'
        },
        // 编辑
        {
          buttonArr: [{ name: '下载', funcName: 'downloadFun' }],
          fixed: 'right',
          compName: 'OperateColumn',
          width: 200
        }
      ]
    };
  },
  methods: {
    async downloadFun(item) {
      // 下载
      const data = await downloadSingle({ fileName: item.name, url: item.url });
      saveAs(data, item.name);
    },
    getColumnList() {
      if (this.keyWord) {
        this.tableData = this.tableData.filter((v) => v.name.indexOf(this.keyWord) !== -1);
      } else {
        this.tableData = this.initTableData;
      }
    },
    async getList(params) {
      const res = await getFileUrlList(params);

      this.initTableData = res;
      this.tableData = res;
    }
  },

  mounted() {
    const params = this.$route.query;
    if (JSON.stringify(params) === '{}') return;
    this.getList(params);
  }
};
</script>

<style lang='scss' scoped>
.attachments {
  padding: 0px 10px 0 10px;
  background: #fff;
  height: 100%;
  &__content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &__header {
    margin: 10px 0 8px;
    display: flex;
    flex-direction: row-reverse;
  }
  &__main {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
