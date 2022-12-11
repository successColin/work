<template>
  <!-- 预览 -->
  <apiot-tabs
    class="printTemplate__tabs"
    :showTabs.sync="showTabs"
    v-if="showTabs"
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
        :isConfig="false"
        :printParams="printParams"
      ></content-preview>
    </template>
  </apiot-tabs>
</template>

<script>
import ContentPreview from '@/views/PrintTemplate/components/ContentPreview';
import { engIndex } from '@/config';

export default {
  inject: ['getAllForm'],
  props: {
    printParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showTabs: false
    };
  },
  components: { ContentPreview },
  computed: {
    // tabs标题
    tabsArr() {
      const { name } = this.printParams.globalConfig;
      return [
        {
          label: `${name || ''}打印模板`,
          compName: 'ContentPreview',
          key: 'ContentPreview'
        }
      ];
    }
  },
  watch: {
    printParams(v) {
      // // console.log(v);
      if (JSON.stringify(v) !== '{}') {
        this.showTabs = true;
        const { previewObj, tableArr } = this.printParams;
        const { borderInfo, config, celldataList, everyHeight } = previewObj;
        const { merge } = config;

        const allForm = this.getAllForm();
        const newCelldataList = [];
        let num = 0;
        let tableNum = 0;
        let borderNum = 0;
        let mergeNum = 0;
        const tableRow = [];
        // 处理数据
        for (let i = 0; i < celldataList.length; i += 1) {
          const item = celldataList[i];
          const { r } = item;
          const nextItem = celldataList[i + 1] || { r: r + 1 };
          const newR = r + num;
          // 字段的数据
          if (item.v.isFormField && item.v.m) {
            const index = String(item.v.m).slice(2, item.v.m.length - 1);
            item.v.m = allForm[index] || '';
          }
          // 表格数据
          if (item.v.isTableField && item.v.m) {
            const field = String(item.v.m).slice(2, item.v.m.length - 1);
            item.v.field = field;
            // eslint-disable-next-line no-loop-func
            tableArr.forEach((g, p, arr) => {
              let val = g[`${field}_`] || g[field];
              if (field === 'sequence') {
                val = p + 1;
              }
              const obj = item;
              obj.v.m = val;
              obj.r = r + p + tableNum * arr.length - tableNum;
              obj.oldR = r;
              // console.log(JSON.parse(JSON.stringify(obj)));
              newCelldataList.push(JSON.parse(JSON.stringify(obj)));
            });

            if (r !== nextItem.r) {
              // 合并数据
              if (merge) {
                // eslint-disable-next-line no-loop-func
                Object.keys(merge).forEach((p) => {
                  const mergeObj = merge[p];
                  if (item.oldR <= mergeObj.r) {
                    mergeNum += 1;
                    mergeObj.r += mergeNum * tableArr.length - 1;
                  }
                });
              }

              const arr = [];
              tableArr.forEach(() => {
                arr.push(34);
              });
              const everyVal = r - tableNum + tableNum * tableArr.length;
              // console.log(everyVal, r, tableNum, tableArr.length);
              everyHeight.splice(everyVal, 1, ...arr);
              // // console.log(aaa);

              tableNum += 1;
              num += tableArr.length - 1;
              tableRow.push(r);
            }
            // eslint-disable-next-line no-continue
            continue;
          }
          const { f = '' } = item.v;
          // 问题查看
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
                  tableArr.forEach((g) => {
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
                      tableArr.forEach((g) => {
                        const val = Number(g[engOjb.v.field]);
                        if (val) {
                          sun += Number(g[engOjb.v.field]);
                        }
                      });
                    } else {
                      sun += +(engOjb && engOjb.v && engOjb.v.m) || '';
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
        newCelldataList.sort((a, b) => a.r - b.r);
        // console.log(newCelldataList);
        this.printParams.previewObj.celldataList = newCelldataList;
        // // console.log(this.printParams);
        // // console.log(JSON.parse(JSON.stringify(newCelldataList)));
        // 边框
        // console.log(tableRow);
        if (borderInfo && borderInfo.length) {
          let markNum = 0;
          borderInfo.forEach((item) => {
            if (item.range) {
              item.range.forEach((g) => {
                const val1 = g.row[0];
                const val2 = g.row[1];
                // console.log(index, arr);
                tableRow.forEach((b) => {
                  // console.log(val1, b, val2, markNum);
                  if (b <= val2 && markNum !== val2) {
                    // console.log('=====================');
                    // console.log(markNum, val2);
                    markNum = val2;
                    const value = tableArr.length * borderNum;
                    g.row[0] = val1 + value - borderNum;
                    borderNum += 1;
                    g.row[1] = val2 + tableArr.length * borderNum - borderNum;
                  }
                });
              });
            }
          });
          // console.log(borderInfo);
        }
        // console.log(this.printParams);
      } else {
        this.showTabs = false;
      }
    }
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
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
    .el-tabs__header {
      display: block !important;
    }
  }
}
</style>
