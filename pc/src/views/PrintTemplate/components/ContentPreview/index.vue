<template>
  <div style="width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto">
    <div
      class="contentPreview"
      :style="`width: ${areaWidth};height: ${areaHeight};`"
    >
      <div
        class="contentPreview__content"
        :style="`width: ${areaWidth}; height: ${areaHeight};`"
      >
        <div
          class="contentPreview__blank contentPreview__left"
          :style="`width: ${globalConfig.marginLeft}mm; height: 100%;`"
        ></div>
        <div
          class="contentPreview__blank contentPreview__right"
          :style="`width: ${globalConfig.marginRight}mm; height: 100%;`"
        ></div>
        <div
          class="contentPreview__blank contentPreview__top"
          :style="`width: 100%; height: ${globalConfig.marginTop}mm`"
        ></div>
        <div
          class="contentPreview__blank contentPreview__bottom"
          :style="`width: 100%; height: ${globalConfig.marginBottom}mm`"
        ></div>
        <table>
          <tbody>
            <tr
              v-for="(item, i) in maxHeight"
              :key="i"
              :style="`height: ${everyHeight[i]}px; white-space: nowrap`"
            >
              <td
                v-for="(val, index) in maxWidth"
                :key="index"
                :rowspan="
                  (tdValFun(i, index, celldataList, 7) &&
                    tdValFun(i, index, celldataList, 7).rs) ||
                  ''
                "
                :colspan="
                  (tdValFun(i, index, celldataList, 7) &&
                    tdValFun(i, index, celldataList, 7).cs) ||
                  ''
                "
                :style="`
            ${
              tdValFun(i, index, celldataList, 7) &&
              !tdValFun(i, index - 1, celldataList, 7)
                ? 'position: absolute'
                : ''
            };
            vertical-align: bottom;
            ${
              tdValFun(i, index, celldataList, 8) === '0'
                ? 'text-align: center'
                : tdValFun(i, index, celldataList, 8) === '2'
                ? 'text-align: right'
                : ''
            }
            font-family: ${tdValFun(i, index, celldataList, 1) || ''};
            font-size: ${tdValFun(i, index, celldataList, 2) || 14}px;
            font-weight: ${
              tdValFun(i, index, celldataList, 3) === 1 ? 'bold' : ''
            };
            font-style: ${
              tdValFun(i, index, celldataList, 4) === 1 ? 'italic' : ''
            };
            color: ${tdValFun(i, index, celldataList, 5)};
            background-color: ${tdValFun(i, index, celldataList, 6)};
            height: ${
              tdValFun(i, index, celldataList, 7) &&
              tdValFun(i, index, celldataList, 7).rs
                ? mergeHeight(
                    tdValFun(i, index, celldataList, 7).rs,
                    everyHeight,
                    i
                  )
                : everyHeight[index]
            }px;
            `"
              >
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
                        : everyWidth[index]
                    }px;
                    display: flex;
                    height: 100%;
                    ${
                      tdValFun(i, index, celldataList, 9) === '1'
                        ? 'align-items: top'
                        : tdValFun(i, index, celldataList, 9) === '2'
                        ? 'align-items: end'
                        : 'align-items: center'
                    };
                    `"
                >
                  {{ tdValFun(i, index, celldataList) }}
                </div>
              </td>
            </tr>
          </tbody>
          <img
            v-for="(val, key, index) in excelImg"
            :key="index"
            :src="val.src"
            :style="`
            position: absolute;
            width: ${val.crop.width}px;
            height: ${val.crop.height}px;
            top: ${val.default.top}px;
            left: ${val.default.left}px;
          `"
          />
        </table>
      </div>
    </div>
  </div>
</template>

<script>
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
    }
  },
  data() {
    return {
      celldataList: [],
      everyHeight: [],
      everyWidth: [],
      maxHeight: 0,
      maxWidth: 0,
      excelImg: {}
    };
  },
  components: {},
  computed: {
    mergeWidth() {
      return function(merge, widthtArr, i) {
        let num = 0;
        for (let b = 0; b < widthtArr.length; b += 1) {
          if (b === i) {
            for (let j = 0; j < merge; j += 1) {
              num += widthtArr[b + j];
            }
          }
        }
        return num;
      };
    },
    mergeHeight() {
      return function(merge, heightArr, i) {
        let num = 0;
        for (let b = 0; b < heightArr.length; b += 1) {
          if (b === i) {
            for (let j = 0; j < merge; j += 1) {
              num += heightArr[b + j];
            }
          }
        }
        // console.log(num);
        return num;
      };
    },
    // 获取对应行的值
    tdValFun() {
      return function(trV, tdV, list, type = '') {
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].c === tdV && list[i].r === trV) {
            switch (type) {
              case 1:
                return list[i].v.ff;
              case 2:
                return list[i].v.fs;
              case 3:
                return list[i].v.bl;
              case 4:
                return list[i].v.it;
              case 5:
                return list[i].v.fc;
              case 6:
                return list[i].v.bg;
              case 7:
                return list[i].v.mc;
              case 8:
                return list[i].v.ht;
              case 9:
                return list[i].v.vt;
              default:
                return list[i].v.m || list[i].v.ct.s[0].v;
            }
          }
        }
      };
    }
  },
  watch: {},
  mounted() {
    // console.log(this.globalConfig);
    const {
      celldataList,
      everyHeight,
      everyWidth,
      maxHeight,
      maxWidth,
      excelImg
    } = this.previewObj;
    this.celldataList = celldataList;
    this.everyHeight = everyHeight;
    this.everyWidth = everyWidth;
    this.maxHeight = maxHeight;
    this.maxWidth = maxWidth;
    this.excelImg = excelImg;
  },
  methods: {}
};
</script>
<style lang='scss' scoped>
.contentPreview {
  margin: 0 auto;
  height: 100%;
  background: #fff;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
  &__content {
    position: relative;
    overflow: hidden;
    .contentPreview__blank {
      position: absolute;
      background: #fff;
      z-index: 1;
    }
    .contentPreview__right,
    .contentPreview__bottom {
      bottom: 0;
      right: 0;
    }
    .contentPreview__top,
    .contentPreview__left {
      top: 0;
      left: 0;
    }
  }
  table {
    position: relative;
  }
}
</style>
