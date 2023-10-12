<template>
  <el-table-column
    class="column"
    v-on="$listeners"
    v-bind="$attrs"
    :resizable="false"
    :show-overflow-tooltip="false"
    :prop="configData.compId"
  >
    <template slot="header">
      <span class="columnHeader__box" slot="label">
        <span
          :class="[
            {
              'is-required': areaData.lineEditable && configData.shouldRequired,
            },
          ]"
        >
          {{ configData.name }}
        </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip> </span
    ></template>
    <div slot-scope="scope" class="column__notEditable" ref="barBase">
      <!-- 线条风格 -->
      <div class="bar-box line-bar" v-if="configData.showStyle === 1">
        <div
          class="bar-part"
          v-show="configData.showStyle === 1"
          :style="{
            'border-radius': `${configData.progressBarHeight / 2}px`,
            height: `${configData.progressBarHeight}px`,
          }"
        >
          <div
            class="bar-base"
            :style="{
              height: `${configData.progressBarHeight}px`,
              'border-radius': `${configData.progressBarHeight / 2}px`,
            }"
          ></div>
          <div
            class="bar-content bar-animate"
            :style="{
              height: configData.progressBarHeight,
              width: `${
                tableData[scope.row.index][configData.compId] <= 100
                  ? tableData[scope.row.index][configData.compId]
                  : 100
              }%`,
              'border-radius': `${configData.progressBarHeight / 2}px`,
            }"
          >
            <div
              class="bar"
              :style="{
                height: `${configData.progressBarHeight}px`,
                background: linearColor(
                  tableData[scope.row.index][configData.compId],
                ),
              }"
            ></div>
          </div>
          <div
            class="bar-tip"
            v-if="configData.progressShowType === 2"
            :class="{
              arrowRight: tableData[scope.row.index][configData.compId] >= 70,
              arrowLeft: tableData[scope.row.index][configData.compId] < 70,
            }"
            :style="tipPos(tableData[scope.row.index][configData.compId])"
          >
            {{
              progressShowNum(tableData[scope.row.index][configData.compId])
            }}%
          </div>
        </div>
        <div class="num-part" v-if="configData.progressShowType === 1">
          {{ progressShowNum(tableData[scope.row.index][configData.compId]) }}%
        </div>
      </div>
      <!-- 格子风格 -->
      <div
        class="bar-box cell-bar"
        v-if="configData.showStyle === 2 && showBar"
      >
        <div
          class="bar-part"
          v-show="configData.showStyle === 2"
          :style="{
            height: `${configData.progressBarHeight}px`,
            width: `${barBoxwidth}px`,
          }"
        >
          <div
            class="bar-base2"
            :style="{ height: `${configData.progressBarHeight}px` }"
          >
            <div
              class="bar-base2-cell"
              :style="{
                width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`,
              }"
              v-for="item in cellNums"
              :key="`base_${item}`"
            >
              <span class="bar-cell"></span>
            </div>
          </div>
          <div
            class="bar-content bar-animate"
            :style="{
              height: `${configData.progressBarHeight}px`,
              width: `${
                tableData[scope.row.index][configData.compId] <= 100
                  ? tableData[scope.row.index][configData.compId]
                  : 100
              }%`,
            }"
          >
            <div
              class="bar-content-cell"
              :style="{
                width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`,
              }"
              v-for="item in cellNums"
              :key="`content_${item}`"
            >
              <span
                class="bar-cell"
                :style="{
                  background: linearColor(
                    tableData[scope.row.index][configData.compId],
                  ),
                }"
              ></span>
            </div>
          </div>
          <div
            class="bar-tip"
            v-if="configData.progressShowType === 2"
            :class="{
              arrowRight: tableData[scope.row.index][configData.compId] >= 70,
              arrowLeft: tableData[scope.row.index][configData.compId] < 70,
            }"
            :style="tipPos(tableData[scope.row.index][configData.compId])"
          >
            {{
              progressShowNum(tableData[scope.row.index][configData.compId])
            }}%
          </div>
        </div>
        <div class="num-part" v-if="configData.progressShowType === 1">
          {{ progressShowNum(tableData[scope.row.index][configData.compId]) }}%
        </div>
      </div>
    </div>
  </el-table-column>
</template>

<script>
import tableCol from '../tableCol';

export default {
  name: '',
  mixins: [tableCol],
  data() {
    return {
      showBar: false,
      barBoxWidth: 0,
      cellNums: 0,
    };
  },
  computed: {},
  components: {},
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.showBar = true;
        this.headerDragend();
      }, 1000);
    });
  },
  watch: {},
  methods: {
    headerDragend() {
      this.barBoxwidth();
      this.cellNum();
    },
    // 根据进度值显示对应颜色
    linearColor(progressNum) {
      let color = '';
      const config = this.configData || {};
      const { ranges } = config;
      for (let i = 0; i < ranges.length; i += 1) {
        if (i === 0) {
          if (progressNum >= 0 && progressNum < ranges[i].range) {
            if (this.configData.showStyle === 1) {
              color = `linear-gradient(to right, ${ranges[i].color1}, ${ranges[i].color2})`;
            } else {
              color = ranges[i].color1;
            }
            return color;
          }
        } else if (i > 0 && i < ranges.length - 1 && progressNum >= ranges[i - 1].range &&
            progressNum < ranges[i].range) {
            if (this.configData.showStyle === 1) {
              color = `linear-gradient(to right, ${ranges[i].color1}, ${ranges[i].color2})`;
            } else {
              color = ranges[i].color1;
            }
            return color;
        } else if (i === ranges.length - 1 && progressNum >= ranges[i - 1].range) {
          if (this.configData.showStyle === 1) {
              color = `linear-gradient(to right, ${ranges[i].color1}, ${ranges[i].color2})`;
            } else {
              color = ranges[i].color1;
            }
            return color;
        }
      }
    },
    // 悬浮显示位置
    tipPos(num) {
      let pos = '';
      if (num < 70) {
        pos = `left: ${num}%`;
      } else if (num >= 70 && num <= 100) {
        pos = `right: ${100 - num}%`;
      } else {
        pos = 'right: 0';
      }
      return pos;
    },
    progressShowNum(num) {
      return num > 100 ? 100 : num;
    },
    barBoxwidth() {
      if (!this.$refs.barBase) return 0;
      const barWidth = this.$refs.barBase.offsetWidth;
      console.log(barWidth, 'barWidth');
      const num = Math.trunc(
        barWidth / (this.configData.progressBarHeight * 1.5),
      );
      let width = `${num * this.configData.progressBarHeight * 1.5}px`;
      if (this.configData.progressShowType === 1) {
        width = `${num * this.configData.progressBarHeight * 1.5 - 60}px`;
      }
      this.barBoxWidth = width;
      // return width;
    },
    cellNum() {
      // if (!this.$refs[`barBase${index}`]) return 0;
      if (!this.$refs.barBase) return 0;
      const width = this.$refs.barBase.offsetWidth;
      let num = Math.trunc(width / (this.configData.progressBarHeight * 1.5));
      if (this.configData.progressShowType === 1) {
        num = Math.trunc(
          (width - 60) / (this.configData.progressBarHeight * 1.5),
        );
      }
      this.cellNums = num;
      // return num > 0 ? num : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../col.scss';
::v-deep {
  .el-tooltip {
    overflow: inherit !important;
  }
}
.column__notEditable {
  width: 100%;
  display: flex;
  align-items: center;
  overflow: inherit !important;
}
.bar-box {
  width: 100%;
  display: flex;
  align-items: center;
  line-height: 18px;
  height: 18px;
  justify-content: flex-start;
  .bar-part {
    position: relative;
    cursor: pointer;
    .bar-base {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: #e9ebef;
    }
    .bar-content {
      position: absolute;
      left: 0;
      top: 0;
      overflow: hidden;
      display: flex;
      align-content: center;
      .bar {
        width: 100%;
      }
      .bar-content-cell {
        height: 100%;
        flex-shrink: 0;
        .bar-cell {
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 2px;
        }
      }
    }
    .bar-animate {
      transform: scaleX(0);
      animation: showBar ease-in-out 1 0.3s forwards;
      // animation-delay: .2s;
      transform-origin: left;
    }
    @keyframes showBar {
      0% {
        transform: scaleX(0);
      }
      100% {
        transform: scaleX(1);
      }
    }
    .bar-base2 {
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-content: center;
      .bar-base2-cell {
        height: 100%;
        .bar-cell {
          width: 100%;
          height: 100%;
          background: #e9ebef;
          display: block;
          border-radius: 2px;
        }
      }
    }
    .bar-tip {
      min-width: 40px;
      height: 26px;
      background: rgba(0, 0, 0, 0.8);
      box-shadow: 0px 7px 22px 6px rgba(0, 0, 0, 0.05);
      position: absolute;
      top: 0;
      bottom: 0;
      margin: auto;
      text-align: center;
      line-height: 26px;
      border-radius: 6px;
      padding: 0 5px;
      color: #ffffff;
      font-size: 12px;
      transform: scaleX(0) translateX(10px);
      transition: all 0.2s;
    }
    .arrowLeft {
      transform-origin: left center;
      &::before {
        content: '';
        width: 0;
        height: 0;
        border: 6px solid rgba(0, 0, 0, 0.8);
        border-top-color: transparent;
        border-left-color: transparent;
        border-bottom-color: transparent;
        position: absolute;
        left: -12px;
        top: calc(50% - 6px);
      }
    }
    .arrowRight {
      transform-origin: right center;
      &::before {
        content: '';
        width: 0;
        height: 0;
        border: 6px solid rgba(0, 0, 0, 0.8);
        border-top-color: transparent;
        border-right-color: transparent;
        border-bottom-color: transparent;
        position: absolute;
        right: -12px;
        top: calc(50% - 6px);
      }
    }
    &:hover {
      .arrowLeft {
        transform: scaleX(1) translateX(10px);
      }
      .arrowRight {
        transform: scaleX(1) translateX(-10px);
      }
    }
  }
  .num-part {
    width: 60px;
    padding-left: 10px;
    flex-shrink: 0;
    color: #666666;
    font-size: 12px;
    text-align: center;
  }
  .isHidden {
    opacity: 0;
    transition: all 0.2s;
  }
  &:hover {
    .isHidden {
      opacity: 1;
    }
  }
}
.line-bar {
  .bar-part {
    flex: 1;
  }
}
.cell-bar {
  .bar-part {
    flex: 1;
    min-width: 100px;
  }
}
</style>
