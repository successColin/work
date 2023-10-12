<template>
  <!-- 预览 -->
  <apiot-tabs
    class="printTemplate__tabs"
    :showTabs.sync="showTabs"
    v-if="showTabs"
    :tabsArr="tabsArr"
    value="ContentPreview"
    @handleReturn="handleReturn"
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
import { createUnique } from '@/utils/utils';
import ContentPreview from '@/views/PrintTemplate/components/ContentPreview';
import { engIndex } from '@/config';

export default {
  inject: ['getAllForm', 'getAllComp'],
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
        const { borderInfo, config = {}, celldataList, everyHeight } = previewObj;
        const { merge = {} } = config;

        const allForm = this.getAllForm();
        const newCelldataList = [];
        let num = 0;
        let tableNum = 0;
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
            const index = String(item.v.v).slice(2, item.v.v.length - 1);
            const compObj = this.getAllComp()[index];
            console.log(compObj);
            const value = allForm[`${index}_`] || allForm[index] || '';
            if (
              compObj.compType === 2 ||
              compObj.compType === 3 ||
              compObj.compType === 4 ||
              compObj.compType === 15 ||
              compObj.compType === 6
            ) {
              item.v.m = this.dataConversion(compObj, value) || value;
            } else {
              item.v.m = value;
            }
          }
          // 表格数据
          if (item.v.isTableField && item.v.m) {
            const field = String(item.v.v).slice(2, item.v.v.length - 1);
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
              const arr = [];
              tableArr.forEach(() => {
                arr.push(34);
              });
              const everyVal = r - tableNum + tableNum * tableArr.length;
              // console.log(everyVal, r, tableNum, tableArr.length);
              everyHeight.splice(everyVal, 1, ...arr);
              // // console.log(aaa);

              tableNum += 1;
              console.log(merge);
              console.log(item, tableNum);

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
            if (f.indexOf('=SUM') !== -1 && item.v && item.v.m !== '#N/A') {
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
        console.log(merge);
        // 合并数据
        if (merge) {
          // eslint-disable-next-line no-loop-func
          Object.keys(merge).forEach((key) => {
            const mergeObj = merge[key];
            mergeObj.oldR = mergeObj.r;
            if (tableRow[0] <= mergeObj.oldR && tableArr.length !== 1) {
              tableRow.forEach((item, i) => {
                if (mergeObj.r >= item) {
                  mergeNum = i + 1;
                }
                if (mergeObj.oldR === item && mergeObj.cs !== 1) {
                  console.log(mergeObj);
                  for (let u = 0; u < tableArr.length - 1; u += 1) {
                    merge[`${createUnique()}${u}`] = {
                      ...mergeObj,
                      r: mergeObj.r + u
                    };
                  }
                }
                // if (mergeObj.oldR <= item && item <= mergeObj.oldR + mergeObj.rs) {
                //   mergeObj.rs += tableArr.length - 1;
                // }
              });
              console.log(key, mergeObj, mergeNum);
              mergeObj.r += mergeNum * tableArr.length - mergeNum;
            }
          });
        }
        newCelldataList.sort((a, b) => a.r - b.r);
        // console.log(newCelldataList);
        this.printParams.previewObj.celldataList = newCelldataList;
        // // console.log(this.printParams);
        // // console.log(JSON.parse(JSON.stringify(newCelldataList)));
        // 边框
        if (borderInfo && borderInfo.length) {
          borderInfo.forEach((item) => {
            if (item.range) {
              item.range.forEach((g) => {
                const val1 = g.row[0];
                const val2 = g.row[1];
                // console.log(index, arr);
                tableRow.forEach((b) => {
                  console.log(val1, b, val2);
                  if (b <= val2) {
                    console.log('=====================', tableRow[0]);
                    if (tableRow[0] === val1) {
                      g.row[0] = val1 + tableArr.length * tableNum - 1;
                    } else {
                      g.row[1] = val2 + tableArr.length * tableNum - 1;
                    }
                    // console.log(g.row[0], g.row[1]);
                    // console.log(val1, val2, tableArr.length, tableNum);
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
      this.$refs.printShow.print();
    },
    handleReturn() {
      this.$emit('handleReturn');
    },
    dataConversion(obj, val) {
      if (obj.dataSource && obj.dataSource.dictObj) {
        const getDictKey = obj.dataSource.dictObj.dictKey;
        const tempData = this.$store.getters.getCurDict(getDictKey) || [];
        if (tempData.length) {
          // 多选
          if (obj.compType === 4) {
            const arr = val.split(',');
            const emptyArr = [];
            arr.forEach((item) => {
              const dictObj = tempData.find((j) => j.value === +item) || {};
              emptyArr.push(dictObj.name);
            });
            return emptyArr.join(',');
          }
          if (obj.compType === 15 && !obj.enableDict) {
            return String(val);
          }
          if (obj.compType === 6 && !obj.enableDict) {
            return String(val);
          }
          const dictObj = tempData.find((j) => j.value === +val) || {};
          return dictObj.name || '';
        }
      }
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
