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
      ref="cellRef"
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
        min-height: ${everyHeight[showRowNum]}px;
        ${widthValue(showRowNum, index)};
      `"
    >
      <div
        :style="`
        overflow: hidden;
        background-color: ${tdValFun(showRowNum, index, celldataList, 6)};
        width: ${
          tdValFun(showRowNum, index, celldataList, 7) &&
          tdValFun(showRowNum, index, celldataList, 7).cs
            ? mergeWidth(
                tdValFun(showRowNum, index, celldataList, 7).cs,
                cellWidthArr,
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
        word-break: break-all;
        line-height: 1.1;
        padding: 3px;
        box-sizing: border-box;
        `"
      >
        {{ tdValFun(showRowNum, index, celldataList) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['type', 'everyWidth', 'everyHeight', 'borderInfo', 'celldataList', 'mergeObj'],
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
    },
    pageRowTop: {
      type: Number,
      default: 0
    },
    cellWidthArr: {
      type: Array,
      default: () => []
    },
    pageRowNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isShow: true
    };
  },
  components: {},
  computed: {
    showRowNum() {
      const { i, lastPos } = this;
      return i + lastPos;
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
        return `${num - 1}px; !import; position: absolute; z-index: 999;`;
      };
    },
    mergeHeight() {
      return function (merge, heightArr, i) {
        // console.log(merge, heightArr, i);
        let num = 0;
        let count = 0;
        for (let b = 0; b < heightArr.length; b += 1) {
          if (b === i) {
            for (let p = 0; p < merge; p += 1) {
              num += heightArr[b + p];
              count += 1;
            }
          }
        }
        if (count === 1) {
          return '100%';
        }
        return `${num - 1}px`;
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
        let state = '';
        if (this.type === 2) {
          state = this.showRowNum - this.lastPos + this.pageRowTop === currentRow - 1;
        } else if (this.showRowNum + 1 === this.pageRowNum) {
          state = true;
        } else {
          state = this.showRowNum - this.lastPos === currentRow - 1;
        }
        // console.log(this.showRowNum, this.lastPos, currentRow, this.pageRowNum);
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
                ${state ? `border-bottom: 1px solid ${color};` : ''}`;
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
            Object.keys(this.mergeObj).forEach((key) => {
              const { c, cs, r, rs } = this.mergeObj[key];
              // console.log(merge[key], c, cs, r, rs);
              if (cs === 1) {
                if (tdv === c && trV !== r && r <= trV && trV <= r + rs - 1) {
                  borderVal += 'border-top: 0;';
                  console.log(trV, tdv);
                }
              }
              if (rs === 1) {
                if (tdv !== c && trV === r && c <= tdv && tdv <= c + cs - 1) {
                  borderVal += 'border-left: 0;';
                  console.log(trV, tdv);
                }
              }
              if (cs !== 1 && rs !== 1) {
                console.log(this.mergeObj[key]);
                // (tr)所有行从第二个开始，(td) border-top: 0;
                if (r + 1 <= trV && trV <= r + rs - 1 && c <= tdv && tdv <= c + cs - 1) {
                  borderVal += 'border-top: 0;';
                }
                // (tr)所有行, (td)从第二个开始, border-right: 0;
                if (r <= trV && trV <= r + rs - 1 && c + 1 <= tdv && tdv <= c + cs - 1) {
                  borderVal += 'border-left: 0;';
                  console.log(borderVal);
                }
              }
            });
          });
        });
        return borderVal;
      };
    },
    widthValue() {
      return function (trV, tdv) {
        return `width: ${this.everyWidth[tdv]}px;`;
      };
    }
  },
  watch: {},
  mounted() {
    if (this.isNeedCalc) {
      this.heightCount();
      this.getCellWidth();
    }
    console.log(this.mergeObj);
  },
  methods: {
    async heightCount() {
      this.$parent.isContainFun(this.$refs.rowCell.offsetHeight, this.i);
    },
    getCellWidth() {
      if (this.cellWidthArr.length !== 0) return;
      this.$parent.getCellWidthArr(this.$refs.cellRef);
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
