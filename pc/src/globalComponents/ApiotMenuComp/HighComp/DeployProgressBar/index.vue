<template>
  <div
    class="progressBar"
    :id="configData.compId"
    :style="`width:${configData.width}`"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable }
    ]"
  >
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
      <div class="bar-box" v-show="configData.showStyle === 1">
        <div class="bar-part" :style="{'border-radius': `${configData.progressBarHeight / 2}px`,
          height: `${configData.progressBarHeight}px`}">
          <div class="bar-base"
            :style="{height: `${configData.progressBarHeight}px`,
            'border-radius': `${configData.progressBarHeight / 2}px`}"></div>
          <div class="bar-content bar-animate"
            :style="{height: configData.progressBarHeight, width: `${progressNum}%`,
              'border-radius': `${configData.progressBarHeight / 2}px`, background: linearColor}">
            <div class="bar" :style="{height: `${configData.progressBarHeight}px`,
              background: linearColor}"></div>
          </div>
          <div class="bar-tip" v-if="configData.submitType === 2"
            :style="{left: `${progressNum}%`}">{{progressNum}}%</div>
        </div>
        <div class="num-part" v-if="configData.submitType === 1">{{progressNum}}%</div>
      </div>
      <div class="bar-box" v-show="configData.showStyle === 2">
        <div class="bar-part" ref="barBase"
          :style="{height: `${configData.progressBarHeight}px`}">
          <div class="bar-base2"
            :style="`height: ${configData.progressBarHeight}px`">
            <div class="bar-base2-cell" v-for="item in 20" :key="`base_${item}`">
              <span class="bar-cell"></span></div>
          </div>
          <div class="bar-content bar-animate"
            :style="{height: `${configData.progressBarHeight}px`, width: `${progressNum}%`}">
            <div class="bar-content-cell" :style="{width: `${barWidth / 20}px`}"
              v-for="item in 20" :key="`content_${item}`">
              <span class="bar-cell" :style="{background: linearColor}"></span>
            </div>
          </div>
          <div class="bar-tip" v-if="configData.submitType === 2"
            :style="{left: `${progressNum}%`}">{{progressNum}}%</div>
        </div>
        <div class="num-part" v-if="configData.submitType === 1">{{progressNum}}%</div>
      </div>
    </el-form-item>
    <div class="isCard" v-else-if="isCard">
      <div class="bar-box" v-show="configData.showStyle === 1">
        <div class="bar-name" :style="getStyle"
          v-if="configData.showLabelTitle">{{ configData.name }}：</div>
        <div class="bar-part" :style="{'border-radius': `${configData.progressBarHeight / 2}px`,
          height: `${configData.progressBarHeight}px`}">
          <div class="bar-base"
            :style="{height: `${configData.progressBarHeight}px`,
            'border-radius': `${configData.progressBarHeight / 2}px`}"></div>
          <div class="bar-content"
            :style="{height: configData.progressBarHeight, width: `${progressNum}%`,
              'border-radius': `${configData.progressBarHeight / 2}px`, background: linearColor}">
            <div class="bar" :style="{height: `${configData.progressBarHeight}px`,
              background: linearColor}"></div>
          </div>
          <div class="bar-tip" v-if="configData.submitType === 2"
            :style="{left: `${progressNum}%`}">{{progressNum}}%</div>
        </div>
        <div class="num-part" v-if="configData.submitType === 1">{{progressNum}}%</div>
      </div>
      <div class="bar-box" v-show="configData.showStyle === 2">
        <div class="bar-name" v-if="configData.showLabelTitle">{{ configData.name }}：</div>
        <div class="bar-part" ref="barBase"
          :style="{height: `${configData.progressBarHeight}px`,
          width: `${configData.progressBarHeight * 15}px`}">
          <div class="bar-base2"
            :style="`height: ${configData.progressBarHeight}px`">
            <div class="bar-base2-cell bar-content-cell2"
              :style="{width: `${configData.progressBarHeight}px`,
              'margin-right': `${configData.progressBarHeight / 2}px`}"
              v-for="item in 10" :key="`base_${item}`">
              <span class="bar-cell"></span></div>
          </div>
          <div class="bar-content"
            :style="{height: `${configData.progressBarHeight}px`,
              width: `${progressNum * configData.progressBarHeight * 0.15}%`}">
            <div class="bar-content-cell bar-content-cell2"
              :style="{width: `${configData.progressBarHeight}px`,
              'margin-right': `${configData.progressBarHeight / 2}px`}"
              v-for="item in 10" :key="`content_${item}`">
              <span class="bar-cell" :style="{background: linearColor}"></span>
            </div>
          </div>
          <div class="bar-tip" v-if="configData.submitType === 2"
            :style="{left: `${progressNum}%`}">{{progressNum}}%</div>
        </div>
        <div class="num-part" v-if="configData.submitType === 1">{{progressNum}}%</div>
      </div>
    </div>
    <div class="table" v-else>
      <div class="table__name">{{ configData.name }}</div>
      <div class="table__zw">
        <div class="bar-box" v-if="configData.showStyle === 1">
          <div class="bar-part" ref="barBase"
            :style="{'border-radius': `${configData.progressBarHeight / 2}px`,
            height: `${configData.progressBarHeight}px`}">
            <div class="bar-base"
              :style="{height: `${configData.progressBarHeight}px`,
              'border-radius': `${configData.progressBarHeight / 2}px`}"></div>
            <div class="bar-content bar-animate"
              :style="{height: configData.progressBarHeight, width: `${progressNum}%`,
                'border-radius': `${configData.progressBarHeight / 2}px`}">
              <div class="bar" :style="{height: `${configData.progressBarHeight}px`,
                background: linearColor}"></div>
            </div>
          </div>
          <div class="num-part" v-if="configData.submitType === 1">{{progressNum}}%</div>
        </div>
        <div class="bar-box" v-if="configData.showStyle === 2">
           <div class="bar-part" ref="barBase"
            :style="{height: `${configData.progressBarHeight}px`,
            width: `${configData.progressBarHeight * 15}px`}">
            <div class="bar-base2"
              :style="`height: ${configData.progressBarHeight}px`">
              <div class="bar-base2-cell bar-content-cell2"
                :style="{width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`}"
                v-for="item in 10" :key="`base_${item}`">
                <span class="bar-cell"></span></div>
            </div>
            <div class="bar-content bar-animate"
              :style="{height: `${configData.progressBarHeight}px`,
                width: `${progressNum * configData.progressBarHeight * 0.15}%`}">
              <div class="bar-content-cell bar-content-cell2"
                :style="{width: `${configData.progressBarHeight}px`,
                'margin-right': `${configData.progressBarHeight / 2}px`}"
                v-for="item in 10" :key="`content_${item}`">
                <span class="bar-cell" :style="{background: linearColor}"></span>
              </div>
            </div>
          </div>
          <div class="num-part" v-if="configData.submitType === 1">{{progressNum}}%</div>
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
    }
  },
  data() {
    return {
      progressNum: 50,
      barWidth: 0,
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
      const config = this.configData || {};
      let color = '';
      if (this.progressNum < config.ranges.range2) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color1}, ${config.colors.color2})`;
        } else {
          color = config.colors.color1;
        }
      } else if (this.progressNum >= config.ranges.range2 &&
        this.progressNum < config.ranges.range3) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color3}, ${config.colors.color4})`;
        } else {
          color = config.colors.color3;
        }
      } else if (this.progressNum >= config.ranges.range3 &&
        this.progressNum < config.ranges.range4) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color5}, ${config.colors.color6})`;
        } else {
          color = config.colors.color5;
        }
      } else if (this.progressNum >= config.ranges.range5) {
        if (this.configData.showStyle === 1) {
          color = `linear-gradient(to right, ${config.colors.color7}, ${config.colors.color8})`;
        } else {
          color = config.colors.color7;
        }
      }
      return color;
    },
  },

  mounted() {
    this.progressNum = this.parent.form[this.configData.compId] || 30;
    this.$nextTick(() => {
      this.barWidth = this.$refs.barBase.offsetWidth;
    });
  },

  methods: {
  },
  watch: {
    'configData.width': {
      handler() {
        this.$nextTick(() => {
          this.barWidth = this.$refs.barBase.offsetWidth;
        });
      }
    },
    'configData.submitType': {
      handler() {
        this.$nextTick(() => {
          this.barWidth = this.$refs.barBase.offsetWidth;
        });
      }
    },
    'parent.form': {
      handler() {
        this.$nextTick(() => {
          this.progressNum = this.parent.form[this.configData.compId] || 36.56;
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
    padding: 0px 15px 18px 15px;
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
  .bar-box{
    width: 100%;
    display: flex;
    align-items: center;
    line-height: 18px;
    height: 18px;
    justify-content: space-between;
    padding-top: 10px;
    .bar-name{
      min-width: 30px;
      line-height: 18px;
      height: 18px;
      font-size: 14px;
      color: rgb(51, 51, 51);
    }
    .bar-part{
      flex: 1;
      position: relative;
      cursor: pointer;
      // overflow: hidden;
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
            width: 60%;
            height: 100%;
            display: block;
            border-radius: 2px;
          }
        }
        .bar-content-cell2{
          .bar-cell{
            width: 100%;
          }
        }
      }
      .bar-animate{
        animation: showBar ease-in-out 1 .2s;
        animation-delay: .1s;
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
          width: 5%;
          height: 100%;
          .bar-cell{
            width: 60%;
            height: 100%;
            background: #E9EBEF;
            display: block;
            border-radius: 2px;
          }
        }
        .bar-content-cell2{
          .bar-cell{
            width: 100%;
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
        transform-origin: left center;
        transition: all .2s;
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
      &:hover{
        .bar-tip{
          transform: scaleX(1) translateX(10px);
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
  .table {
    text-align: center;
    line-height: 40px;
    width: 140px;
    &__name, &__zw {
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
