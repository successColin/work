<!--
 * @Descripttion: 预览：打印类型为内容类
 * @Author: ytx
 * @Date: 2022-07-19 15:43:54
 * @Last Modified by: ytx
 * @Last Modified time: 2022-07-19 15:43:54
-->
<template>
  <div style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto">
    <div id="printContent" ref="content">
      <div
        class="contentPreview"
        :style="`
          width: ${areaWidth};
          height: calc(${areaHeight} - 1px);
          position: relative;
          overflow: hidden;
          page-break-after: always;
          box-sizing: content-box;
          margin: 0 auto;
          background: #fff;
          box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
          margin-bottom: 10px;
        `"
        v-for="(item, j) in page"
        :key="j"
      >
        <!-- 上边距 -->
        <div
          class="contentPreview__marginTop"
          :style="`
            height: ${globalConfig.marginTop}mm; top: 0;
            position: absolute;
            bottom: 0;
            background: #fff;
            width: 100%;
            z-index: 2;
          `"
        ></div>
        <!-- 下边距 -->
        <div
          class="contentPreview__marginBottom"
          :style="`
            height: ${globalConfig.marginBottom}mm;
            position: absolute;
            bottom: 0;
            background: #fff;
            width: 100%;
            z-index: 2;
          `"
        ></div>
        <!-- 页眉 -->
        <div
          id="pageHeader"
          v-html="headerFooter(j, 'header')"
          style="
            position: absolute;
            z-index: 999;
            top: 10px;
            left: 20px;
            width: calc(100% - 40px);
          "
        ></div>
        <!-- 页脚 -->
        <div
          id="pageFooter"
          v-html="headerFooter(j, 'footer')"
          style="
            position: absolute;
            z-index: 999;
            bottom: 10px;
            left: 20px;
            width: calc(100% - 40px);
          "
        ></div>
        <!-- 背景图片 -->
        <img
          v-if="imgbgUrl"
          :src="$parseImgUrl(imgbgUrl)"
          :style="`
            width: ${contentWidth};
            height: ${contentHeight};
            padding-top: ${globalConfig.marginTop}mm;
            position: absolute;
            margin: ${boxMargin};
          `"
        />
        <!-- 固定上边内容 -->
        <div
          class="contentPreview__fixedTop"
          :style="`
            width: ${contentWidth};
            margin: 0 auto;
            padding-top: ${globalConfig.marginTop}mm;
          `"
        >
          <!-- <div style="position: absolute; z-index: 3">
            {{ globalConfig.marginTop }}
          </div> -->
          <!-- 高 -->
          <div
            v-for="(item, i) in contentOjb.topRow"
            :key="`${i}${new Date()}`"
            :style="`
              white-space: nowrap;
              display: flex;
            `"
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
                  ${tdBorderFun(i, index)};
                  font-family: ${tdValFun(i, index, celldataList, 1) || ''};
                  font-size: ${tdValFun(i, index, celldataList, 2) || 12}px;
                  font-weight: ${
                    tdValFun(i, index, celldataList, 3) === 1 ? 'bold' : ''
                  };
                  font-style: ${
                    tdValFun(i, index, celldataList, 4) === 1 ? 'italic' : ''
                  };
                  color: ${tdValFun(i, index, celldataList, 5)};
                  background-color: ${tdValFun(i, index, celldataList, 6)};
                  min-height: ${everyHeight[i]}px;
                  ${widthValue(i, index)};
                `"
            >
              <!-- 值 -->
              <div
                :style="`
                    overflow: hidden;
                    width: ${
                      tdValFun(i, index, celldataList, 7) &&
                      tdValFun(i, index, celldataList, 7).cs
                        ? mergeWidth(
                            tdValFun(i, index, celldataList, 7).cs,
                            everyWidth,
                            index
                          )
                        : '100%'
                    };
                    height: ${
                      tdValFun(i, index, celldataList, 7) &&
                      tdValFun(i, index, celldataList, 7).rs
                        ? mergeHeight(
                            tdValFun(i, index, celldataList, 7).rs,
                            everyHeight,
                            i
                          )
                        : '100%'
                    };
                    display: flex;
                    ${
                      tdValFun(i, index, celldataList, 9) === '1'
                        ? 'align-items: top'
                        : tdValFun(i, index, celldataList, 9) === '2'
                        ? 'align-items: end'
                        : 'align-items: center'
                    };
                    ${
                      tdValFun(i, index, celldataList, 8) === '0'
                        ? 'justify-content: center'
                        : tdValFun(i, index, celldataList, 8) === '2'
                        ? 'justify-content: end'
                        : 'justify-content: start'
                    }
                    `"
              >
                <div v-if="tdValFun(i, index, celldataList)">
                  {{ tdValFun(i, index, celldataList) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 内容只留10个 -->
        <section
          class="contentPreview__content"
          :style="`
          width: ${contentWidth};
          margin: 0 auto;
        `"
        >
          <!-- 高 contentOjb.contentRow -->
          <div
            v-for="(item, i) in contentShowCell(j)"
            :key="`${i}${new Date()}`"
            :style="`
              white-space: nowrap;
              display: flex;
            `"
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
                  ${tdBorderFun(
                    contentShowRow(i, j),
                    index,
                    page - 1 !== j && i === contentShowCell(j) - 1
                  )};
                  font-family: ${
                    tdValFun(contentShowRow(i, j), index, celldataList, 1) || ''
                  };
                  font-size: ${
                    tdValFun(contentShowRow(i, j), index, celldataList, 2) || 12
                  }px;
                  font-weight: ${
                    tdValFun(contentShowRow(i, j), index, celldataList, 3) === 1
                      ? 'bold'
                      : ''
                  };
                  font-style: ${
                    tdValFun(contentShowRow(i, j), index, celldataList, 4) === 1
                      ? 'italic'
                      : ''
                  };
                  color: ${tdValFun(
                    contentShowRow(i, j),
                    index,
                    celldataList,
                    5
                  )};
                  background-color: ${tdValFun(
                    contentShowRow(i, j),
                    index,
                    celldataList,
                    6
                  )};
                  min-height: ${everyHeight[contentShowRow(i, j)]}px;
                  ${widthValue(contentShowRow(i, j), index)};
                `"
            >
              <!-- 值 -->
              <div
                :style="`
                    overflow: hidden;
                    width: ${
                      tdValFun(contentShowRow(i, j), index, celldataList, 7) &&
                      tdValFun(contentShowRow(i, j), index, celldataList, 7).cs
                        ? mergeWidth(
                            tdValFun(
                              contentShowRow(i, j),
                              index,
                              celldataList,
                              7
                            ).cs,
                            everyWidth,
                            index
                          )
                        : '100%'
                    };
                    height: ${
                      tdValFun(contentShowRow(i, j), index, celldataList, 7) &&
                      tdValFun(contentShowRow(i, j), index, celldataList, 7).rs
                        ? mergeHeight(
                            tdValFun(
                              contentShowRow(i, j),
                              index,
                              celldataList,
                              7
                            ).rs,
                            everyHeight,
                            i
                          )
                        : '100%'
                    };
                    display: flex;
                    ${
                      tdValFun(contentShowRow(i, j), index, celldataList, 9) ===
                      '1'
                        ? 'align-items: top'
                        : tdValFun(
                            contentShowRow(i, j),
                            index,
                            celldataList,
                            9
                          ) === '2'
                        ? 'align-items: end'
                        : 'align-items: center'
                    };
                    ${
                      tdValFun(contentShowRow(i, j), index, celldataList, 8) ===
                      '0'
                        ? 'justify-content: center'
                        : tdValFun(
                            contentShowRow(i, j),
                            index,
                            celldataList,
                            8
                          ) === '2'
                        ? 'justify-content: end'
                        : 'justify-content: start'
                    }
                    `"
              >
                <div
                  v-if="tdValFun(contentShowRow(i, j), index, celldataList)"
                  style="word-break: break-all"
                >
                  {{ tdValFun(contentShowRow(i, j), index, celldataList) }}
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- 固定下边内容 -->
        <div
          class="contentPreview__fixedBottom"
          :style="`
            width: ${contentWidth};
            margin: 0 auto;
          `"
        >
          <!-- 高 -->
          <div
            v-for="(item, i) in contentOjb.bottomRow"
            :key="`${i}${new Date()}`"
            :style="`
              white-space: nowrap;
              display: flex;
            `"
          >
            <!-- <div style="position: absolute; z-index: 111">
              {{ contentOjb.bottomRow }}
            </div> -->
            <!-- 宽 -->
            <div
              v-for="(val, index) in maxWidth"
              :key="index"
              :style="`
                  display: inline-block;
                  position: relative;
                  white-space: pre-line;
                  vertical-align: bottom;
                  ${tdBorderFun(buttonShowRow(i), index)};
                  font-family: ${
                    tdValFun(buttonShowRow(i), index, celldataList, 1) || ''
                  };
                  font-size: ${
                    tdValFun(buttonShowRow(i), index, celldataList, 2) || 12
                  }px;
                  font-weight: ${
                    tdValFun(buttonShowRow(i), index, celldataList, 3) === 1
                      ? 'bold'
                      : ''
                  };
                  font-style: ${
                    tdValFun(buttonShowRow(i), index, celldataList, 4) === 1
                      ? 'italic'
                      : ''
                  };
                  color: ${tdValFun(buttonShowRow(i), index, celldataList, 5)};
                  background-color: ${tdValFun(
                    buttonShowRow(i),
                    index,
                    celldataList,
                    6
                  )};
                  min-height: ${everyHeight[i + contentOjb.removeTopIndex]}px;
                  ${widthValue(buttonShowRow(i), index)};
                `"
            >
              <!-- 值 -->
              <div
                :style="`
                    overflow: hidden;
                    width: ${
                      tdValFun(buttonShowRow(i), index, celldataList, 7) &&
                      tdValFun(buttonShowRow(i), index, celldataList, 7).cs
                        ? mergeWidth(
                            tdValFun(buttonShowRow(i), index, celldataList, 7)
                              .cs,
                            everyWidth,
                            index
                          )
                        : '100%'
                    };
                    height: ${
                      tdValFun(buttonShowRow(i), index, celldataList, 7) &&
                      tdValFun(buttonShowRow(i), index, celldataList, 7).rs
                        ? mergeHeight(
                            tdValFun(buttonShowRow(i), index, celldataList, 7)
                              .rs,
                            everyHeight,
                            i
                          )
                        : '100%'
                    };
                    display: flex;
                    ${
                      tdValFun(buttonShowRow(i), index, celldataList, 9) === '1'
                        ? 'align-items: top'
                        : tdValFun(buttonShowRow(i), index, celldataList, 9) ===
                          '2'
                        ? 'align-items: end'
                        : 'align-items: center'
                    };
                    ${
                      tdValFun(buttonShowRow(i), index, celldataList, 8) === '0'
                        ? 'justify-content: center'
                        : tdValFun(buttonShowRow(i), index, celldataList, 8) ===
                          '2'
                        ? 'justify-content: end'
                        : 'justify-content: start'
                    }
                    `"
              >
                <div v-if="tdValFun(buttonShowRow(i), index, celldataList)">
                  {{ tdValFun(buttonShowRow(i), index, celldataList) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import printJS from 'print-js';
import { formatDate } from '@/utils/utils';

export default {
  props: {
    previewObj: {
      type: Object,
      default: () => {}
    },
    areaWidth: {
      type: String,
      default: ''
    },
    areaHeight: {
      type: String,
      default: ''
    },
    globalConfig: {
      type: Object,
      default: () => {}
    },
    tableData: {
      type: Array,
      default: () => []
    },
    tableConfigArr: {
      type: Array,
      default: () => []
    },
    tableConfigOjb: {
      type: Object,
      default: () => {}
    },
    isConfig: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      celldataList: [],
      everyHeight: [],
      everyWidth: [],
      maxHeight: 0,
      maxWidth: 0,
      excelImg: [],
      borderInfo: [],
      boxPadding: '16mm',
      boxBorderTop: '60px',
      page: 1,
      currentPageHeader: '',
      currentPageFooter: '',
      contentOjb: {
        topRow: 0,
        bottomRow: 0,
        removeTopIndex: 0,
        contentRow: 0,
        fixedTopEleHeight: 0,
        fixedBottomEleHeight: 0
      },
      aaa: '',
      bbb: '',
      allHeight: 0,
      showCell: 10,
      mergeObj: {}
    };
  },
  components: {},
  computed: {
    // 内容高度
    contentShowCell() {
      return function (j) {
        j += 1;
        return j * this.showCell <= this.contentOjb.contentRow
          ? this.showCell
          : this.contentOjb.contentRow - (j - 1) * this.showCell;
      };
    },
    // 内容的row
    contentShowRow() {
      return function (i, j) {
        return i + j * this.showCell + this.contentOjb.topRow;
      };
    },
    // 固定下方的row
    buttonShowRow() {
      return function (i) {
        return i + this.contentOjb.removeTopIndex;
      };
    },
    // 内容的宽度
    contentWidth() {
      return `calc(100% - ${this.globalConfig.marginRight}mm - ${this.globalConfig.marginLeft}mm)`;
    },
    contentHeight() {
      return `calc(100% - ${this.globalConfig.marginBottom}mm - ${this.globalConfig.marginTop}mm)`;
    },
    lastBottom() {
      return function (v) {
        return (
          this.areaHeight &&
          this.areaHeight.slice(0, this.areaHeight.length - 2) -
            this.contentOjb.fixedBottomEleHeight -
            (this.allHeight + v)
        );
      };
    },
    tableStyle() {
      return function (i, index, td) {
        const obj = this.celldataList.find((item) => item.c === index + td && item.r === i);
        return `color: ${obj && obj.v && obj.v.fc};`;
      };
    },
    headerFooter() {
      return function (num, type) {
        // 当前日期
        const dataReg = /<message(V|v)ar vartype=("|'|)date("|'|)>当前日期<\/message(V|v)ar>/g;
        const html = type === 'header' ? this.currentPageHeader : this.currentPageFooter;
        let str = html.replace(dataReg, () => {
          const data = formatDate(new Date(), 'yyyy-MM-dd');
          return ` ${data} `;
        });
        // 当前时间
        const timeReg = /<message(V|v)ar vartype=("|'|)time("|'|)>当前时间<\/message(V|v)ar>/g;
        str = str.replace(timeReg, () => {
          const data = formatDate(new Date(), 'hh:mm:ss');
          return ` ${data} `;
        });
        // 页码
        const pageNum = /<message(V|v)ar vartype=("|'|)pageNum("|'|)>页码<\/message(V|v)ar>/g;
        str = str.replace(pageNum, () => num + 1);
        return str;
      };
    },
    boxMargin() {
      return `0mm ${this.globalConfig.marginRight}mm ${this.globalConfig.marginBottom}mm ${this.globalConfig.marginLeft}mm`;
    },
    imgbgUrl() {
      return (
        this.globalConfig.bgImgArr &&
        this.globalConfig.bgImgArr[0] &&
        this.globalConfig.bgImgArr[0].url
      );
    },
    isShowTable() {
      return function (i, index, isShow) {
        let state = false;
        if (isShow) {
          return state;
        }
        for (let j = 0; j < this.tableConfigArr.length; j += 1) {
          const v = this.tableConfigArr[j];
          if (v.r === i && v.c === index) {
            state = true;
            break;
          }
        }
        return state;
      };
    },
    mergeWidth() {
      return function (merge, widthtArr, i) {
        let num = 0;
        for (let b = 0; b < widthtArr.length; b += 1) {
          if (b === i) {
            for (let j = 0; j < merge; j += 1) {
              num += widthtArr[b + j] || 0;
            }
          }
        }
        return `${num * 0.9}px; !import; position: absolute; z-index: 999;`;
      };
    },
    mergeHeight() {
      return function (merge, heightArr, i) {
        console.log(merge, heightArr, i);
        let num = 0;
        for (let b = 0; b < heightArr.length; b += 1) {
          if (b === i) {
            for (let j = 0; j < merge; j += 1) {
              num += heightArr[b + j];
            }
          }
        }
        // console.log(`${num - merge}px`);
        return `${num - merge}px`;
      };
    },
    widthValue() {
      return function (trV, tdv) {
        const v = this.tableStateAndField(trV, tdv);
        if (v) {
          // 上个 tr 是否 table
          const preV = this.tableStateAndField(trV, tdv - 1);
          if (preV) {
            return 'width: 0px; border: 0';
          }
          let tableWidth = this.everyWidth[tdv];
          // 当时是否是表格，tr 宽，td 宽，表格的宽度
          this.forFun(v, trV, tdv, tableWidth, (total) => {
            tableWidth = total;
          });
          return `width: ${tableWidth}px; border-right: 1px solid #000`;
        }
        return `width: ${this.everyWidth[tdv]}px;`;
      };
    },
    // 获取对应边框的值
    tdBorderFun() {
      return function (trV, tdv, state = false) {
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
                // console.log(item.row[0] <= trV && trV < item.row[1] && !state);
                // console.log(item.row[0], trV, trV, item.row[1], !state);
                borderVal = `border: 1px solid ${color};box-sizing: border-box; ${
                  item.column[0] <= tdv && tdv < item.column[1] ? 'border-right: 0' : ''
                }; ${item.row[0] <= trV && trV < item.row[1] && !state ? 'border-bottom: 0' : ''};`;
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
    }
  },
  watch: {
    'globalConfig.pageHeader': {
      handler(html) {
        this.getCurrentDateTime(html, 'header');
      },
      deep: true,
      immediate: true
    },
    'globalConfig.pageFooter': {
      handler(html) {
        this.getCurrentDateTime(html, 'footer');
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    const {
      celldataList,
      everyHeight,
      everyWidth,
      maxHeight,
      maxWidth,
      excelImg,
      borderInfo = [],
      config
    } = this.previewObj;
    const { merge } = config;
    console.log(this.previewObj);
    this.mergeObj = merge;
    this.celldataList = celldataList;
    this.everyHeight = everyHeight;
    this.everyWidth = everyWidth;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    // 处理图片token
    const imagesArr = [];
    celldataList.sort((a, b) => a.r - b.r);
    if (excelImg) {
      Object.values(excelImg).forEach((item) => {
        if (item.src.indexOf('?') !== -1) {
          item.src = item.src.slice(0, item.src.indexOf('?'));
          item.src = this.$parseImgUrl(item.src);
        } else {
          item.src = this.$parseImgUrl(item.src);
        }
        imagesArr.push(item);
      });
    }
    const fixedTop = celldataList.find((item) => item.v.isTableField && item.v.field) || { r: 0 };
    const fixedBottom = celldataList.findLast((item) => item.v.isTableField && item.v.field) || {
      r: 0
    };
    const lastConst = celldataList.findLast(
      (item) => (item.v && item.v.m) || (item.v && item.v.ct && item.v.ct.s)
    );
    const topRow = fixedTop.r;
    const bottomRow = lastConst.r - fixedBottom.r < 0 ? 0 : lastConst.r - fixedBottom.r;
    const removeTopIndex = fixedBottom.r + 1;
    const contentRow = fixedBottom.r - fixedTop.r + 1;
    this.contentOjb = {
      topRow,
      bottomRow,
      removeTopIndex,
      contentRow,
      fixedTopEleHeight: 0,
      fixedBottomEleHeight: 0
    };
    // 上边的距离
    const topArr = everyHeight.slice(0, topRow);
    let topNum = 0;
    topArr.forEach((v) => {
      topNum += v;
    });
    // 下边距离
    const bottomArr = everyHeight.slice(
      everyHeight.length - (maxHeight - lastConst.oldR - 1) - bottomRow,
      everyHeight.length - (maxHeight - lastConst.oldR - 1)
    );
    let bottomNum = 0;
    bottomArr.forEach((v) => {
      bottomNum += v;
    });
    const contentHeight =
      this.areaHeight &&
      this.areaHeight.slice(0, this.areaHeight.length - 2) -
        this.globalConfig.marginTop -
        this.globalConfig.marginBottom -
        this.pxConversionMm(bottomNum) -
        this.pxConversionMm(topNum);
    this.showCell = Math.floor(contentHeight / this.pxConversionMm(34)) - 1;
    this.excelImg = imagesArr;
    this.borderInfo = borderInfo;
    this.page = this.isConfig ? 1 : Math.ceil(this.contentOjb.contentRow / this.showCell);
  },
  methods: {
    tableStateAndField(i, index, field) {
      let state = false;
      let fieldValue = '';
      for (let j = 0; j < this.tableConfigArr.length; j += 1) {
        const v = this.tableConfigArr[j];
        if (v.r === i && v.c === index) {
          state = true;
          if (field) {
            fieldValue = v[field];
          }
          break;
        }
      }
      if (field) {
        return fieldValue;
      }
      return state;
    },
    forFun(state, trV, tdv, tableWidth, callback) {
      if (state) {
        const nowTdv = tdv + 1;
        const v = this.tableStateAndField(trV, nowTdv);
        if (v) {
          tableWidth += this.everyWidth[nowTdv];
        }
        this.forFun(v, trV, nowTdv, tableWidth, callback);
      } else if (callback) {
        callback(tableWidth);
      }
    },
    getCurrentDateTime(html, type) {
      if (type === 'header') {
        this.currentPageHeader = html;
      }
      if (type === 'footer') {
        this.currentPageFooter = html;
      }
    },
    getDPI() {
      // eslint-disable-next-line no-array-constructor
      const arrDPI = new Array();
      if (window.screen.deviceXDPI) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
      } else {
        const tmpNode = document.createElement('DIV');
        tmpNode.style.cssText =
          'width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden';
        document.body.appendChild(tmpNode);
        arrDPI[0] = parseInt(tmpNode.offsetWidth, 10);
        arrDPI[1] = parseInt(tmpNode.offsetHeight, 10);
        tmpNode.parentNode.removeChild(tmpNode);
      }
      return arrDPI;
    },
    /**
     * px转换为mm
     * @param value
     * @returns {number}
     */
    pxConversionMm(value) {
      const inch = value / this.getDPI()[0];
      return inch * 25.4;
    },
    /**
     * mm转换为px
     * @param value
     * @returns {number}
     */
    mmConversionPx(value) {
      const inch = value / 25.4;
      return inch * this.getDPI()[0];
    },

    print() {
      const paperSizeOption = [
        {
          value: 1,
          name: 'A4'
        },
        {
          value: 2,
          name: 'A5'
        },
        {
          value: 3,
          name: 'A3'
        },
        {
          value: 4,
          name: 'B4'
        },
        {
          value: 5,
          name: 'B5'
        },
        {
          value: 6,
          name: '自定义'
        }
      ];
      const typeObj = paperSizeOption.find((v) => v.value === this.globalConfig.paperSize);
      this.$nextTick(() => {
        printJS({
          printable: 'printContent',
          type: 'html',
          scanStyles: false,
          targetStyles: ['*'],
          style: `@media print {
            @page { margin: 0; size: ${typeObj && typeObj.name} ${
  this.globalConfig.direction === 1 ? 'portrait' : 'landscape'
}; }
            body { margin: 0; }
            .contentPreview {
              margin-bottom: 0 !important;
            }
          }`
        });
      });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
