<!--
 * @Descripttion: 列宽
 * @Author: ytx
 * @Date: 2022-07-19 15:43:54
 * @Last Modified by: ytx
 * @Last Modified time: 2022-07-19 15:43:54
-->
<template>
  <div
    :style="`
      white-space: nowrap;
      display: flex;
    `"
    ref="rowCell"
  >
    <!-- 宽 -->
    <div
      v-for="(val, index) in maxWidth"
      :key="index"
      :style="`
        display: inline-block;
        position: relative;
        white-space: pre-line;
        vertical-align: bottom;
        ${tdBorderFun(showRowNum, index, containPos)};
        font-family: ${tdValFun(showRowNum, index, celldataList, 1) || ''};
        font-size: ${tdValFun(showRowNum, index, celldataList, 2) || 12}px;
        font-weight: ${
          tdValFun(showRowNum, index, celldataList, 3) === 1 ? 'bold' : ''
        };
        font-style: ${
          tdValFun(showRowNum, index, celldataList, 4) === 1 ? 'italic' : ''
        };
        color: ${tdValFun(showRowNum, index, celldataList, 5)};
        background-color: ${tdValFun(showRowNum, index, celldataList, 6)};
        min-height: ${everyHeight[showRowNum]}px;
        ${widthValue(showRowNum, index)};
      `"
    >
      <div
        :style="`
        overflow: hidden;
        width: ${
          tdValFun(showRowNum, index, celldataList, 7) &&
          tdValFun(showRowNum, index, celldataList, 7).cs
            ? mergeWidth(
                tdValFun(showRowNum, index, celldataList, 7).cs,
                everyWidth,
                index
              )
            : '100%'
        };
        height: ${
          tdValFun(showRowNum, index, celldataList, 7) &&
          tdValFun(showRowNum, index, celldataList, 7).rs
            ? mergeHeight(
                tdValFun(showRowNum, index, celldataList, 7).rs,
                everyHeight,
                showRowNum
              )
            : '100%'
        };
        display: flex;
        ${
          tdValFun(showRowNum, index, celldataList, 9) === '1'
            ? 'align-items: top'
            : tdValFun(showRowNum, index, celldataList, 9) === '2'
            ? 'align-items: end'
            : 'align-items: center'
        };
        ${
          tdValFun(showRowNum, index, celldataList, 8) === '0'
            ? 'justify-content: center'
            : tdValFun(showRowNum, index, celldataList, 8) === '2'
            ? 'justify-content: end'
            : 'justify-content: start'
        };
        word-break: break-all
        `"
      >
        {{ tdValFun(showRowNum, index, celldataList) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['type'],
  props: {
    printParams: {
      type: Object,
      default: () => {}
    },
    maxWidth: {
      type: Number,
      default: 0
    },
    lastPos: Number,
    i: {
      type: Number
    },
    pageRow: {
      type: Number,
      default: 0
    },
    containPos: {
      type: Number,
      default: 0
    },
    // 是否需要计算高度
    isNeedCalc: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isShow: true,
      currentRow: -1 // 当前页最大的row
    };
  },
  components: {},
  computed: {
    showRowNum() {
      const { i, lastPos } = this;
      return i + lastPos;
    },
    everyWidth() {
      return this.printParams.previewObj.everyWidth;
    },
    everyHeight() {
      return this.printParams.previewObj.everyHeight;
    },
    celldataList() {
      return this.printParams.previewObj.celldataList;
    },
    borderInfo() {
      return this.printParams.previewObj.borderInfo;
    },
    mergeObj() {
      return this.printParams.previewObj.config.merge;
    },
    mergeWidth() {
      return function (merge, widthtArr, i) {
        let num = 0;
        for (let b = 0; b < widthtArr.length; b += 1) {
          if (b === i) {
            for (let p = 0; p < merge; p += 1) {
              num += widthtArr[b + p] || 0;
            }
          }
        }
        return `${num * 0.9}px; !import; position: absolute; z-index: 999;`;
      };
    },
    mergeHeight() {
      return function (merge, heightArr, i) {
        // console.log(merge, heightArr, i);
        let num = 0;
        for (let b = 0; b < heightArr.length; b += 1) {
          if (b === i) {
            for (let p = 0; p < merge; p += 1) {
              num += heightArr[b + p];
            }
          }
        }
        return `${num - merge}px`;
      };
    },
    // 获取对应行的值
    tdValFun() {
      return function (trV, tdV, list, type = '') {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].c === tdV && list[i].r === trV) {
            const m = list[i].v.ct && list[i].v.ct.s && list[i].v.ct.s[0].v;
            switch (type) {
              case 1:
                return list[i].v.ff; // 字体
              case 2:
                return list[i].v.fs; // 字体大小
              case 3:
                return list[i].v.bl; // 字体加粗
              case 4:
                return list[i].v.it; // 字体斜体
              case 5:
                return list[i].v.fc; // 字体颜色
              case 6:
                return list[i].v.bg; // 背景颜色
              case 7:
                return list[i].v.mc; // 合并单元格
              case 8:
                return list[i].v.ht; // 水平对齐
              case 9:
                return list[i].v.vt; // 垂直对齐
              case 10:
                return list[i].v.f; // 垂直对齐
              default:
                return list[i].v.m || m; // 显示值
            }
          }
        }
      };
    },
    // 获取对应边框的值
    tdBorderFun() {
      return function (trV, tdv, currentRow) {
        // console.log(trV, tdv, this.pageRowNum, this.pageRow);
        console.log(trV, currentRow);
        const state = trV === currentRow - 1;
        let borderVal = '';
        this.borderInfo.forEach((v) => {
          const { range = [], borderType, color } = v; // style, rangeType
          range.forEach((item) => {
            if (
              item.column[0] <= tdv &&
              tdv <= item.column[1] &&
              item.row[0] <= trV &&
              trV <= item.row[1]
            ) {
              if (borderType === 'border-all') {
                borderVal = `border: 1px solid ${color};box-sizing: border-box; ${
                  item.column[0] <= tdv && tdv < item.column[1] ? 'border-right: 0' : ''
                }; ${item.row[0] <= trV && trV < item.row[1] && !state ? 'border-bottom: 0' : ''};
                ${state ? `border-bottom: 1px solid ${color}` : ''}`;
              }
              if (borderType === 'border-none') {
                borderVal =
                  'border: none;border-top: none; border-left: none; border-right: none; border-bottom: none;';
              }
            }
            // top
            if (item.column[0] <= tdv && tdv <= item.column[1] && item.row[0] === trV) {
              if (borderType === 'border-top' || borderType === 'border-outside') {
                borderVal += `border-top: 1px solid ${color}; box-sizing: border-box;`;
              }
            }
            // bottom
            if (item.column[0] <= tdv && tdv <= item.column[1] && trV === item.row[1]) {
              if (borderType === 'border-bottom' || borderType === 'border-outside') {
                borderVal += `border-bottom: 1px solid ${color}; box-sizing: border-box;`;
              }
            }
            // left
            if (item.column[0] === tdv && item.row[0] <= trV && trV <= item.row[1]) {
              if (borderType === 'border-left' || borderType === 'border-outside') {
                borderVal += `border-left: 1px solid ${color}; box-sizing: border-box;`;
              }
            }
            // right
            if (tdv === item.column[1] && item.row[0] <= trV && trV <= item.row[1]) {
              if (borderType === 'border-right' || borderType === 'border-outside') {
                borderVal += `border-right: 1px solid ${color}; box-sizing: border-box;`;
              }
            }
            Object.keys(this.mergeObj).forEach((g) => {
              const obj = this.mergeObj[g];
              if (
                borderType === 'border-all' &&
                obj.r <= trV &&
                trV <= obj.r + obj.rs - 1 &&
                obj.c < tdv &&
                tdv <= obj.c + obj.cs - 1
              ) {
                borderVal += 'border-left: 0;';
              }
              if (
                borderType === 'border-all' &&
                obj.r < trV &&
                trV <= obj.r + obj.rs - 1 &&
                obj.c <= tdv &&
                tdv <= obj.c + obj.cs - 1
              ) {
                borderVal += 'border-top: 0;';
              }
            });
          });
        });
        return borderVal;
      };
    },
    widthValue() {
      return function (trV, tdv) {
        // const v = this.tableStateAndField(trV, tdv);
        // if (v) {
        //   // 上个 tr 是否 table
        //   const preV = this.tableStateAndField(trV, tdv - 1);
        //   if (preV) {
        //     return 'width: 0px; border: 0';
        //   }
        //   let tableWidth = this.everyWidth[tdv];
        //   // 当时是否是表格，tr 宽，td 宽，表格的宽度
        //   this.forFun(v, trV, tdv, tableWidth, (total) => {
        //     tableWidth = total;
        //   });
        //   return `width: ${tableWidth}px; border-right: 1px solid #000`;
        // }
        return `width: ${this.everyWidth[tdv]}px;`;
      };
    }
  },
  watch: {},
  mounted() {
    if (this.isNeedCalc) {
      this.heightCount();
    }
  },
  methods: {
    async heightCount() {
      // console.log(this.isContain);
      // console.log(this.$refs.rowCell);
      // console.log(this.$refs.rowCell.offsetHeight);
      this.$parent.isContainFun(this.$refs.rowCell.offsetHeight, this.i);
    }
    // tableStateAndField(i, index, field) {
    //   let state = false;
    //   let fieldValue = '';
    //   for (let p = 0; p < this.tableConfigArr.length; p += 1) {
    //     const v = this.tableConfigArr[p];
    //     if (v.r === i && v.c === index) {
    //       state = true;
    //       if (field) {
    //         fieldValue = v[field];
    //       }
    //       break;
    //     }
    //   }
    //   if (field) {
    //     return fieldValue;
    //   }
    //   return state;
    // }
  }
};
</script>
<style lang='scss' scoped>
</style>
