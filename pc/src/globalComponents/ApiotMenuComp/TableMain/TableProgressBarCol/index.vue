<template>
  <el-table-column
    class="column123"
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="configData.dataSource.columnName"
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
    <div slot-scope="scope" class="column__notEditable">
      <!-- 线条风格 -->
      <div class="bar-box line-bar" v-if="configData.showStyle === 1">
        <div class="bar-part" ref="barBase"
          :style="{'border-radius': `${configData.progressBarHeight / 2}px`,
          height: `${configData.progressBarHeight}px`}">
          <div class="bar-base"
            :style="{height: `${configData.progressBarHeight}px`,
            'border-radius': `${configData.progressBarHeight / 2}px`}"></div>
          <div class="bar-content bar-animate"
            :style="{height: configData.progressBarHeight,
            width: `${tableData[scope.$index][configData.compId] <= 100 ?
            tableData[scope.$index][configData.compId] : 100}%`,
              'border-radius': `${configData.progressBarHeight / 2}px`}">
            <div class="bar" :style="{height: `${configData.progressBarHeight}px`,
              background: linearColor(tableData[scope.$index][configData.compId])}"></div>
          </div>
          <div class="bar-tip" v-if="configData.submitType === 2"
            :class="{arrowRight: tableData[scope.$index][configData.compId] >= 70,
            arrowLeft: tableData[scope.$index][configData.compId] < 70}"
            :style="tipPos(tableData[scope.$index][configData.compId])">
            {{tableData[scope.$index][configData.compId]}}%</div>
        </div>
        <div class="num-part" v-if="configData.submitType === 1">
          {{tableData[scope.$index][configData.compId]}}%</div>
      </div>
      <!-- 格子风格 -->
      <div class="bar-box cell-bar" v-if="configData.showStyle === 2">
        <div class="bar-part" ref="barBase"
          :style="{height: `${configData.progressBarHeight}px`,
          width: `${configData.progressBarHeight * 15}px`}">
          <div class="bar-base2"
            :style="{height: `${configData.progressBarHeight}px`}">
            <div class="bar-base2-cell"  :style="{width: `${configData.progressBarHeight}px`,
              'margin-right': `${configData.progressBarHeight / 2}px`}"
              v-for="item in cellNum" :key="`base_${item}`">
              <span class="bar-cell"></span></div>
          </div>
          <div class="bar-content bar-animate"
            :style="{height: `${configData.progressBarHeight}px`,
              width: `${tableData[scope.$index][configData.compId] <= 100 ?
              tableData[scope.$index][configData.compId] : 100}%`}">
            <div class="bar-content-cell" :style="{width: `${configData.progressBarHeight}px`,
              'margin-right': `${configData.progressBarHeight / 2}px`}"
              v-for="item in cellNum" :key="`content_${item}`">
              <span class="bar-cell" :style="{background:
                linearColor(tableData[scope.$index][configData.compId])}"></span>
            </div>
          </div>
          <div class="bar-tip" v-if="configData.submitType === 2"
            :class="{arrowRight: tableData[scope.$index][configData.compId] >= 70,
            arrowLeft: tableData[scope.$index][configData.compId] < 70}"
            :style="tipPos(tableData[scope.$index][configData.compId])">
            {{tableData[scope.$index][configData.compId]}}%</div>
        </div>
        <div class="num-part" v-if="configData.submitType === 1">
          {{tableData[scope.$index][configData.compId]}}%</div>
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
      cellNum: 10,
    };
  },
  computed: {
  },
  components: {},
  mounted() {
  },
  watch: {
  },
  methods: {
    // 根据进度值显示对应颜色
    linearColor(progressNum) {
      const config = this.configData || {};
      let color = '';
      if (progressNum < config.ranges.range2) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color1}, ${config.colors.color2})`;
        } else {
          color = config.colors.color1;
        }
      } else if (progressNum >= config.ranges.range2 &&
        progressNum < config.ranges.range3) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color3}, ${config.colors.color4})`;
        } else {
          color = config.colors.color3;
        }
      } else if (progressNum >= config.ranges.range3 &&
        progressNum < config.ranges.range4) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color5}, ${config.colors.color6})`;
        } else {
          color = config.colors.color5;
        }
      } else if (progressNum >= config.ranges.range5) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color7}, ${config.colors.color8})`;
        } else {
          color = config.colors.color7;
        }
      }
      return color;
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
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../col.scss';
::v-deep{
  .el-tooltip{
    overflow: inherit !important;
  }
}
.column__notEditable{
  width: 100%;
  display: flex;
  align-items: center;
  overflow: inherit !important;
}
.bar-box{
  width: 100%;
  display: flex;
  align-items: center;
  line-height: 18px;
  height: 18px;
  justify-content: flex-start;
  .bar-part{
    position: relative;
    cursor: pointer;
    .bar-base{
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: #E9EBEF;
    }
    .bar-content{
      position: absolute;
      left: 0;
      top: 0;
      overflow: hidden;
      display: flex;
      align-content: center;
      .bar{
        width: 100%;
      }
      .bar-content-cell{
        height: 100%;
        flex-shrink: 0;
        .bar-cell{
          width: 100%;
          height: 100%;
          display: block;
          border-radius: 2px;
        }
      }
    }
    .bar-animate{
      transform: scaleX(0);
      animation: showBar ease-in-out 1 .3s forwards;
      animation-delay: .2s;
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
    .bar-base2{
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      align-content: center;
      .bar-base2-cell{
        height: 100%;
        .bar-cell{
          width: 100%;
          height: 100%;
          background: #E9EBEF;
          display: block;
          border-radius: 2px;
        }
      }
    }
    .bar-tip{
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
      color: #FFFFFF;
      font-size: 12px;
      transform: scaleX(0) translateX(10px);
      transition: all .2s;
    }
    .arrowLeft{
      transform-origin: left center;
      &::before{
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
    .arrowRight{
      transform-origin: right center;
      &::before{
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
    &:hover{
      .arrowLeft{
        transform: scaleX(1) translateX(10px);
      }
      .arrowRight{
        transform: scaleX(1) translateX(-10px);
      }
    }
  }
  .num-part{
    min-width: 40px;
    padding-left: 10px;
    flex-shrink: 0;
    color: #666666;
    font-size: 12px;
    text-align: center;
  }
  .isHidden{
    opacity: 0;
    transition: all .2s;
  }
  &:hover{
    .isHidden{
      opacity: 1;
    }
  }
}
.line-bar{
  .bar-part{
    flex: 1;
  }
}
.cell-bar{
  .bar-part{
    min-width: 100px;
  }
}

</style>
