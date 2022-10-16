<template>
  <!-- 预览 -->
  <apiot-tabs
    class="printTemplate__tabs"
    :showTabs.sync="showTabs"
    :tabsArr="tabsArr"
    value="ContentPreview"
  >
    <apiot-button
      slot="button"
      class="printTemplate__tabs--button"
      type="primary"
      @click="handlePrintFun"
    >
      打印
    </apiot-button>
    <template slot="ContentPreview">
      <content-preview
        v-if="showTabs"
        ref="printShow"
        :previewObj="previewObj"
        :areaHeight="areaHeight"
        :areaWidth="areaWidth"
        :globalConfig="globalConfig"
        :tableData="tableData"
        :tableConfigOjb="tableConfigOjb"
        :isConfig="false"
      ></content-preview>
    </template>
  </apiot-tabs>
</template>

<script>
import ContentPreview from '@/views/PrintTemplate/components/ContentPreview';
import { engIndex } from '@/config';

export default {
  inject: ['getAllForm'],
  data() {
    return {
      // 打印字段
      previewObj: {},
      areaHeight: '',
      areaWidth: '',
      globalConfig: {},
      showTabs: false,
      tableData: [],
      tableConfigOjb: {}
    };
  },
  components: { ContentPreview },
  computed: {
    // tabs标题
    tabsArr() {
      return [
        {
          label: `${this.globalConfig.name || ''}打印模板`,
          compName: 'ContentPreview',
          key: 'ContentPreview'
        }
      ];
    }
  },
  watch: {},
  mounted() {
    this.$bus.$on('pringBtn', this.handlerPringBtn);
  },
  beforeDestroy() {
    this.$bus.$off('pringBtn');
  },
  methods: {
    handlerPringBtn(v) {
      this.tableConfigOjb = {};
      this.$bus.$emit('getTableArr', (arr) => {
        this.tableData = arr;
      });
      const { previewObj, areaHeight, areaWidth, globalConfig } = v;
      const { celldataList, borderInfo, everyHeight } = previewObj;
      console.log(JSON.parse(JSON.stringify(everyHeight)));

      this.$nextTick(() => {
        const allForm = this.getAllForm();
        const newCelldataList = [];
        let num = 0;
        let tableNum = 0;
        let borderNum = 0;
        const tableRow = [];
        // 数据
        for (let i = 0; i < celldataList.length; i += 1) {
          const item = celldataList[i];
          const { r } = item;
          const nextItem = celldataList[i + 1] || { r: r + 1 };
          const newR = r + num;
          // 字段的
          if (item.v.isFormField && item.v.m) {
            const index = item.v.m.slice(2, item.v.m.length - 1);
            item.v.m = allForm[index] || '';
          }
          // 表格
          if (item.v.isTableField && item.v.m) {
            const field = item.v.m.slice(2, item.v.m.length - 1);
            item.v.field = field;
            // eslint-disable-next-line no-loop-func
            this.tableData.forEach((g, p, arr) => {
              const obj = item;
              obj.v.m = g[field];
              obj.r = r + p + tableNum * arr.length - tableNum;
              obj.oldR = r;
              newCelldataList.push(JSON.parse(JSON.stringify(obj)));
            });
            if (r !== nextItem.r) {
              const arr = [];
              this.tableData.forEach(() => {
                arr.push(34);
              });
              const everyVal = r - tableNum + tableNum * this.tableData.length;
              // if (tableNum !== 0) {
              //   everyVal += 1;
              // }
              console.log(everyVal, r, tableNum, this.tableData.length);
              const aaa = everyHeight.splice(everyVal, 1, ...arr);
              console.log(aaa);

              tableNum += 1;
              num += this.tableData.length - 1;
              tableRow.push(r);
            }
            // eslint-disable-next-line no-continue
            continue;
          }
          const { f = '' } = item.v;
          if (f) {
            // 求和
            if (f.indexOf('=SUM') !== -1) {
              const interval = f.substring(5, f.length - 1);
              const intervalArr = interval.split(':');
              let engOne = '';
              let engTwo = '';
              let numOne = '';
              let numTwo = '';
              // 单个求和
              if (intervalArr.length === 1) {
                engOne = intervalArr[0].replace(/[^a-zA-Z]/g, '');
                numOne = intervalArr[0].replace(/[^\d]/g, '') - 1;
                const engOjb = engIndex.find((q) => q.name === engOne);
                engOne = engOjb.i;
                // 获取单元格配置
                const cellObj = celldataList.find((j) => +j.c === +engOne && +j.r === +numOne);
                let sun = 0;
                if (cellObj && cellObj.v.field) {
                  this.tableData.forEach((g) => {
                    const val = Number(g[cellObj.v.field]);
                    if (val) {
                      sun += Number(g[cellObj.v.field]);
                    }
                  });
                } else {
                  sun += (cellObj && +cellObj.v.m.replace(/[^\d]/g, '')) || '';
                }
                item.v.m = sun;
                item.v.v = sun;
              } else if (intervalArr.length === 2) {
                // 多个求和
                engOne = intervalArr[0].replace(/[^a-zA-Z]/g, '');
                engTwo = intervalArr[1].replace(/[^a-zA-Z]/g, '');
                numOne = intervalArr[0].replace(/[^\d]/g, '') - 1;
                numTwo = intervalArr[1].replace(/[^\d]/g, '') - 1;
                const engOjb1 = engIndex.find((q) => q.name === engOne);
                const engOjb2 = engIndex.find((q) => q.name === engTwo);
                engOne = engOjb1.i;
                engTwo = engOjb2.i;
                let sun = 0;
                const cForNum = engTwo - engOne;
                const rForNum = numTwo - numOne;
                // 列
                // 行
                for (let m = 0; m < rForNum + 1; m += 1) {
                  for (let p = 0; p <= cForNum; p += 1) {
                    const engOjb = celldataList.find(
                      (j) => +j.c === +engOne + p && +j.r === +numOne + m
                    );
                    if (engOjb && engOjb.v.field) {
                      // eslint-disable-next-line no-loop-func
                      this.tableData.forEach((g) => {
                        const val = Number(g[engOjb.v.field]);
                        if (val) {
                          sun += Number(g[engOjb.v.field]);
                        }
                      });
                    } else {
                      sun +=
                        (engOjb && engOjb.v && engOjb.v.m && +engOjb.v.m.replace(/[^\d]/g, '')) ||
                        '';
                    }
                  }
                }
                item.v.m = sun;
                item.v.v = sun;
              }
            }
          }
          newCelldataList.push({
            ...item,
            r: newR,
            oldR: r
          });
        }
        // 边框
        if (borderInfo && borderInfo.length) {
          borderInfo.forEach((item) => {
            if (item.range) {
              item.range.forEach((g) => {
                const val1 = g.row[0];
                const val2 = g.row[1];
                tableRow.forEach((b) => {
                  console.log(b, val1, val2);
                  if (val1 <= b && b <= val2) {
                    const value = this.tableData.length * borderNum;
                    g.row[0] = val1 + value - borderNum;
                    borderNum += 1;
                    g.row[1] = val2 + this.tableData.length * borderNum - borderNum;
                  }
                });
              });
            }
          });
        }
        // newCelldataList.sort((a, b) => a.r - b.r);
        this.previewObj = {
          ...previewObj,
          celldataList: newCelldataList
        };
        console.log(everyHeight);
        this.areaHeight = areaHeight;
        this.areaWidth = areaWidth;
        this.globalConfig = globalConfig;
        this.showTabs = true;
        // table 相关数据
      });
    },
    // 按钮打印
    handlePrintFun() {
      this.$refs.printShow.$refs.printPre.print();
    }
  }
};
</script>
<style lang='scss' scoped>
.printTemplate__tabs {
  &--button {
    position: absolute;
    z-index: 1;
    top: 258px;
    right: 10px;
  }
  ::v-deep {
    .el-tabs__content {
      margin-right: 0;
      background-color: transparent !important;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item.is-active {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC !important;
      font-weight: 400 !important;
      color: #333333 !important;
    }
    .el-tabs__nav-scroll {
      height: 46px;
    }
    .el-tabs__nav {
      position: absolute;
      top: 0;
      left: 120px;
    }
  }
}
</style>
