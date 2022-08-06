<template>
  <div
    class="progressBar"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
  >
    <!-- 表单 -->
    <el-form-item :prop="`${configData.compId}`" v-if="!isTable && !isCard">
      <span class="span-box" slot="label">
        <span> {{ configData.name }} </span>
        <el-tooltip
          :content="configData.helpInfo"
          placement="top"
          v-if="configData.helpInfo.length"
        >
          <i class="iconfont icon-bangzhu" />
        </el-tooltip>
      </span>
      <!-- 线条风格  -->
      <div class="bar-box" v-show="configData.showStyle === 1">
        <div
          class="bar-part"
          :style="{
            'border-radius': `${configData.progressBarHeight / 2}px`,
            height: `${configData.progressBarHeight}px`,
            width: barBoxwidth,
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
              width: `${progressNum}%`,
              'border-radius': `${configData.progressBarHeight / 2}px`,
              background: linearColor,
            }"
          >
            <div
              class="bar"
              :style="{
                height: `${configData.progressBarHeight}px`,
                background: linearColor,
              }"
            ></div>
          </div>
          <div
            class="bar-tip"
            v-if="configData.progressShowType === 2"
            :class="{
              arrowRight: progressNum >= 70,
              arrowLeft: progressNum < 70,
            }"
            :style="tipPos"
          >
            {{ progressNum }}%
          </div>
        </div>
        <div class="num-part" v-if="configData.progressShowType === 1">
          {{ progressNum }}%
        </div>
      </div>
      <!-- 格子风格 -->
      <div class="bar-box" v-show="configData.showStyle === 2" ref="barBase">
        <div
          class="bar-part no-flex"
          :style="{
            height: `${configData.progressBarHeight}px`,
            width: barBoxwidth,
          }"
        >
          <!-- :style="{height: `${configData.progressBarHeight}px`}"> -->
          <div
            class="bar-base2"
            :style="`height: ${configData.progressBarHeight}px`"
          >
            <div
              class="bar-base2-cell"
              :style="{
                width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`,
              }"
              v-for="item in cellNum"
              :key="`base_${item}`"
            >
              <span class="bar-cell"></span>
            </div>
          </div>
          <div
            class="bar-content bar-animate"
            :style="{
              height: `${configData.progressBarHeight}px`,
              width: `${progressNum}%`,
            }"
          >
            <div
              class="bar-content-cell"
              :style="{
                width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`,
              }"
              v-for="item in cellNum"
              :key="`content_${item}`"
            >
              <span
                class="bar-cell"
                :style="{ background: linearColor }"
              ></span>
            </div>
          </div>
          <div
            class="bar-tip"
            v-if="configData.progressShowType === 2"
            :class="{
              arrowRight: progressNum >= 70,
              arrowLeft: progressNum < 70,
            }"
            :style="tipPos"
          >
            {{ progressNum }}%
          </div>
        </div>
        <div class="num-part" v-if="configData.progressShowType === 1">
          {{ progressNum }}%
        </div>
      </div>
    </el-form-item>
    <!-- 卡片 -->
    <div class="isCard" v-else-if="isCard">
      <div class="bar-box" v-show="configData.showStyle === 1">
        <div
          class="bar-name"
          :style="getStyle"
          v-if="configData.showLabelTitle"
        >
          {{ configData.name }}：
        </div>
        <div
          class="bar-part"
          :style="{
            'border-radius': `${configData.progressBarHeight / 2}px`,
            height: `${configData.progressBarHeight}px`,
            width: barBoxwidth,
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
            class="bar-content"
            :style="{
              height: configData.progressBarHeight,
              width: `${progressNum}%`,
              'border-radius': `${configData.progressBarHeight / 2}px`,
              background: linearColor,
            }"
          >
            <div
              class="bar"
              :style="{
                height: `${configData.progressBarHeight}px`,
                background: linearColor,
              }"
            ></div>
          </div>
          <div
            class="bar-tip"
            v-if="configData.progressShowType === 2"
            :class="{
              arrowRight: progressNum >= 70,
              arrowLeft: progressNum < 70,
            }"
            :style="tipPos"
          >
            {{ progressNum }}%
          </div>
        </div>
        <div class="num-part" v-if="configData.progressShowType === 1">
          {{ progressNum }}%
        </div>
      </div>
      <div class="bar-box" v-show="configData.showStyle === 2" ref="barBase">
        <div
          class="bar-name"
          :style="getStyle"
          v-if="configData.showLabelTitle"
        >
          {{ configData.name }}：
        </div>
        <div
          class="bar-part"
          :style="{
            height: `${configData.progressBarHeight}px`,
            width: barBoxwidth,
          }"
        >
          <div
            class="bar-base2"
            :style="`height: ${configData.progressBarHeight}px`"
          >
            <div
              class="bar-base2-cell bar-content-cell2"
              :style="{
                width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`,
              }"
              v-for="item in cellNum"
              :key="`base_${item}`"
            >
              <span class="bar-cell"></span>
            </div>
          </div>
          <div
            class="bar-content"
            :style="{
              height: `${configData.progressBarHeight}px`,
              width: `${progressNum * configData.progressBarHeight * 0.15}%`,
            }"
          >
            <div
              class="bar-content-cell bar-content-cell2"
              :style="{
                width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`,
              }"
              v-for="item in cellNum"
              :key="`content_${item}`"
            >
              <span
                class="bar-cell"
                :style="{ background: linearColor }"
              ></span>
            </div>
          </div>
          <div
            class="bar-tip"
            v-if="configData.progressShowType === 2"
            :class="{
              arrowRight: progressNum >= 70,
              arrowLeft: progressNum < 70,
            }"
            :style="tipPos"
          >
            {{ progressNum }}%
          </div>
        </div>
        <div class="num-part" v-if="configData.progressShowType === 1">
          {{ progressNum }}%
        </div>
      </div>
    </div>
    <div class="table" v-else>
      <div class="table__name">{{ configData.name }}</div>
      <div class="table__zw">
        <div class="bar-box" v-if="configData.showStyle === 1">
          <div
            class="bar-part"
            ref="barBase"
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
                width: `${progressNum}%`,
                'border-radius': `${configData.progressBarHeight / 2}px`,
              }"
            >
              <div
                class="bar"
                :style="{
                  height: `${configData.progressBarHeight}px`,
                  background: linearColor,
                }"
              ></div>
            </div>
          </div>
          <div class="num-part" v-if="configData.progressShowType === 1">
            {{ progressNum }}%
          </div>
        </div>
        <div class="bar-box" v-if="configData.showStyle === 2" ref="barBase">
          <div
            class="bar-part"
            :style="{
              height: `${configData.progressBarHeight}px`,
              width: barBoxwidth,
            }"
          >
            <div
              class="bar-base2"
              :style="`height: ${configData.progressBarHeight}px`"
            >
              <div
                class="bar-base2-cell bar-content-cell2"
                :style="{
                  width: `${configData.progressBarHeight}px`,
                  'margin-right': `${configData.progressBarHeight / 2}px`,
                }"
                v-for="item in cellNum"
                :key="`base_${item}`"
              >
                <span class="bar-cell"></span>
              </div>
            </div>
            <div
              class="bar-content bar-animate"
              :style="{
                height: `${configData.progressBarHeight}px`,
                width: `${progressNum * configData.progressBarHeight * 0.15}%`,
              }"
            >
              <div
                class="bar-content-cell bar-content-cell2"
                :style="{
                  width: `${configData.progressBarHeight}px`,
                  'margin-right': `${configData.progressBarHeight / 2}px`,
                }"
                v-for="item in cellNum"
                :key="`content_${item}`"
              >
                <span
                  class="bar-cell"
                  :style="{ background: linearColor }"
                ></span>
              </div>
            </div>
          </div>
          <div class="num-part" v-if="configData.progressShowType === 1">
            {{ progressNum }}%
          </div>
        </div>
      </div>
    </div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import compMixin from '../../compMixin';

export default {
  props: {
    fileDeleteIds: {
      type: Array
    },
    labelValue: {
      default: ''
    }
  },
  data() {
    return {
      progressNum: 0,
      barWidth: 0
    };
  },
  mixins: [compMixin],

  components: {},

  computed: {
    getStyle() {
      let style = '';
      if (this.configData.font) {
        if (this.configData.font.color) {
          style += `color:${this.configData.font.color};`;
        }
        if (this.configData.font.size) {
          style += `font-size:${this.configData.font.size}px;`;
        }
        if (this.configData.font.style === 2) {
          style += 'font-weight:700;';
        }
      }
      return style;
    },
    linearColor() {
      let color = '';
      const config = this.configData || {};
      const { ranges } = config;
      for (let i = 0; i < ranges.length; i += 1) {
        if (i === 0) {
          if (this.progressNum >= 0 && this.progressNum < ranges[i].range) {
            if (this.configData.showStyle === 1) {
              color = `linear-gradient(to right, ${ranges[i].color1}, ${ranges[i].color2})`;
            } else {
              color = ranges[i].color1;
            }
            break;
          }
        }
        if (i > 0 && i < ranges.length - 1) {
          if (this.progressNum >= ranges[i - 1].range && this.progressNum < ranges[i].range) {
            if (this.configData.showStyle === 1) {
              color = `linear-gradient(to right, ${ranges[i].color1}, ${ranges[i].color2})`;
            } else {
              color = ranges[i].color1;
            }
            break;
          }
        }
        if (i === ranges.length - 1) {
          if (this.progressNum <= ranges[i].range) {
            if (this.configData.showStyle === 1) {
              color = `linear-gradient(to right, ${ranges[i].color1}, ${ranges[i].color2})`;
            } else {
              color = ranges[i].color1;
            }
            break;
          }
        }
      }
      return color;
    },
    barBoxwidth() {
      const num = Math.trunc(this.barWidth / (this.configData.progressBarHeight * 1.5));
      let width = `${num * this.configData.progressBarHeight * 1.5}px`;
      if (this.configData.progressShowType === 1) {
        width = `${num * this.configData.progressBarHeight * 1.5 - 60}px`;
      }
      console.log(width, 'width');
      return width || 0;
    },
    cellNum() {
      let num = Math.trunc(this.barWidth / (this.configData.progressBarHeight * 1.5));
      if (this.configData.progressShowType === 1) {
        num = Math.trunc((this.barWidth - 60) / (this.configData.progressBarHeight * 1.5));
      }
      console.log(num, 'num');
      return num > 0 ? num : 0;
    },
    // 悬浮显示位置
    tipPos() {
      let pos = '';
      if (this.progressNum < 70) {
        pos = `left: ${this.progressNum}%`;
      } else if (this.progressNum >= 70 && this.progressNum <= 100) {
        pos = `right: ${100 - this.progressNum}%`;
      } else {
        pos = 'right: 0';
      }
      return pos;
    }
  },

  mounted() {
    let progressNum = parseInt(this.parent.form[this.configData.compId], 0) || 0;
    if (this.isCard) {
      progressNum = parseInt(this.labelValue, 0) || 0;
    }
    this.progressNum = progressNum > 100 ? 100 : progressNum;
    this.$nextTick(() => {
      setTimeout(() => {
        this.barWidth = this.$refs.barBase.offsetWidth;
        console.log(this.barWidth, 'this.barWidth');
      }, 100);
    });
  },

  methods: {},
  watch: {
    'configData.width': {
      handler() {
        this.$nextTick(() => {
          this.barWidth = this.$refs.barBase.offsetWidth;
          console.log(this.barWidth, 'this.barWidth');
        });
      }
    },
    'configData.progressShowType': {
      handler() {
        this.$nextTick(() => {
          this.barWidth = this.$refs.barBase.offsetWidth;
          console.log(this.barWidth, 'this.barWidth');
        });
      }
    },
    'configData.showStyle': {
      handler() {
        this.$nextTick(() => {
          this.barWidth = this.$refs.barBase.offsetWidth;
          console.log(this.barWidth, 'this.barWidth');
        });
      }
    },
    'parent.form': {
      handler() {
        this.$nextTick(() => {
          let progressNum = parseInt(this.parent.form[this.configData.compId], 0) || 0;
          if (this.isCard) {
            progressNum = parseInt(this.labelValue, 0) || 0;
          }
          this.progressNum = progressNum > 100 ? 100 : progressNum;
        });
      }
    }
  },
  beforeDestroy() {
    if (this.unwatch) {
      this.unwatch();
    }
  }
};
</script>

<style lang='scss' scoped>
.progressBar {
  position: relative;
  box-sizing: border-box;
  padding: 2px 15px 18px 15px;
  overflow: hidden;
  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.noHover {
    min-height: 76px;
    padding: 0px 15px 18px 35px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  .span-box {
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    .icon-bangzhu {
      margin-left: 5px;
      color: #aaaaaa;
      font-size: 13px;
      font-weight: normal;
      cursor: pointer;
    }
  }
  .bar-box {
    width: 100%;
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    justify-content: space-between;
    padding-top: 10px;
    .bar-name {
      min-width: 30px;
      line-height: 18px;
      height: 18px;
      font-size: 14px;
      color: rgb(51, 51, 51);
    }
    .bar-part {
      flex: 1;
      position: relative;
      cursor: pointer;
      // overflow: hidden;
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
            // width: 60%;
            height: 100%;
            display: block;
            border-radius: 2px;
          }
        }
        .bar-content-cell2 {
          .bar-cell {
            width: 100%;
          }
        }
      }
      .bar-animate {
        transform: scaleX(0);
        animation: showBar ease-in-out 1 0.2s forwards;
        // animation-delay: .1s;
        transform-origin: left;
        transition: all 0.2s;
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
          flex-shrink: 0;
          .bar-cell {
            width: 100%;
            height: 100%;
            background: #e9ebef;
            display: block;
            border-radius: 2px;
          }
        }
        .bar-content-cell2 {
          .bar-cell {
            width: 100%;
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
        transform-origin: left center;
        transition: all 0.2s;
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
      &:hover {
        .bar-tip {
          transform: scaleX(1) translateX(10px);
        }
      }
    }
    .no-flex {
      flex: none;
    }
    .num-part {
      width: 60px;
      padding-left: 10px;
      flex-shrink: 0;
      color: #666666;
      font-size: 12px;
      text-align: center;
      position: relative;
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
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    &__name,
    &__zw {
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #808080;
      height: 40px;
      box-sizing: border-box;
    }
    &__zw {
      color: #333;
      border-top: 1px solid #e9e9e9;
      display: flex;
      align-items: center;
    }
  }
  .isCard {
    .bar-part {
      overflow: hidden;
    }
  }
  ::v-deep {
    .el-form-item {
      margin-bottom: 0;
      .el-form-item__label {
        line-height: 18px;
        font-size: 13px;
        font-weight: 600;
        color: #333333;
        display: flex;
      }
    }
  }
}
</style>
