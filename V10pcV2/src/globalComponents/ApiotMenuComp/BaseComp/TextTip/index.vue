<template>
  <div
    class="text"
    :style="`width:${configData.width}`"
    v-if="showInput"
    :class="[
      { active: isConfig && activeObj.compId === configData.compId },
      { noHover: !isConfig },
    ]"
  >
    <div class="text__box" :style="getStyle">
      <div class="text__title" v-if="configData.showLabelTitle">
        <div
          class="text__icon"
          v-if="
            configData.enableIcon &&
            (configData.icon.imageUrl || configData.icon.icon)
          "
        >
          <img
            :src="$parseImgUrl(configData.icon.imageUrl)"
            alt=""
            v-if="configData.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${configData.icon.icon}`"
            :style="`color: ${configData.icon.color}`"
          ></i>
        </div>
        <span :style="getTextStyle(configData.titleFont)">{{
          configData.name
        }}</span>
      </div>
      <div class="text__content">
        <div
          class="text__icon"
          v-if="
            configData.enableIcon &&
            (configData.icon.imageUrl || configData.icon.icon) &&
            !configData.showLabelTitle
          "
        >
          <img
            :src="$parseImgUrl(configData.icon.imageUrl)"
            alt=""
            v-if="configData.icon.imageUrl"
            class="full"
          />
          <i
            v-else
            :class="`full iconfont ${configData.icon.icon}`"
            :style="`color: ${configData.icon.color}`"
          ></i>
        </div>
        <span :style="getTextStyle(configData.font)">{{ getConfigShow }}</span>
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
  name: '',
  mixins: [compMixin],
  data() {
    return {
      resStr: '',
      watchArr: []
    };
  },
  components: {},
  inject: ['getAllForm'],
  computed: {
    getStyle() {
      let style = '';
      if (this.isConfig && this.configData.labelBg.style === 0) {
        style += 'margin: 15px 18px 0;';
      }
      if (this.configData.labelBg.style !== 0) {
        if (this.grandFather && this.grandFather.compName === 'MenuMain') {
          style += 'padding:10px 20px 20px;height:auto;';
        } else {
          style += 'height:22px;line-height:22px;';
        }
      }
      if (this.configData.labelBg.color) {
        if (this.configData.labelBg.style !== 0) {
          style += `background:${this.configData.labelBg.color};`;
        }

        if (this.configData.labelBg.style === 1) {
          style += 'borderRadius: 4px;';
        }
        if (this.configData.labelBg.style === 2) {
          style += 'borderRadius: 100px;';
        }
      }
      return style;
    },
    getTextStyle() {
      return (font) => {
        let style = 'word-break: break-all;';
        if (font) {
          style += `color:${font.color};fontSize:${font.size}px;`;
          if (font.style === 2) {
            style += 'fontWeight: 600;';
          }
        }
        return style;
      };
    },
    getConfigShow() {
      if (this.isConfig) {
        if (this.configData.defaultValueType === 2) {
          if (this.isConfig) {
            return '这是公式字符串';
          }
          const str = this.configData.formulaContent.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
            const res = this.getAllForm()[v1];
            return res;
          });
          return str;
        }
        return this.configData.fixedContent;
      }
      return this.resStr;
    }
  },
  mounted() {
    if (!this.isConfig) {
      this.initWatch();
    }
  },

  beforeDestroy() {
    // 取消值变化的监听
    this.watchArr.forEach((unWatch) => {
      if (unWatch) {
        unWatch();
      }
    });
    this.watchArr = [];
  },
  methods: {
    initWatch() {
      if (this.configData.defaultValueType === 2) {
        this.configData.formulaContent.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
          const unWatch = this.$watch(
            () => this.getAllForm()[v1],
            () => {
              this.getShowContent();
            },
            {
              immediate: true
            }
          );
          this.watchArr.push(unWatch);
        });
      }
      this.getShowContent();
    },
    getShowContent() {
      this.resStr = this.configData.fixedContent;
      if (this.configData.defaultValueType === 2) {
        if (this.isConfig) {
          this.resStr = '这是公式字符串';
          return;
        }
        const str = this.configData.formulaContent.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
          const res = this.getAllForm()[v1];
          return res;
        });
        this.resStr = str;
      }
      // console.log(this.resStr);
    }
  }
};
</script>

<style lang='scss' scoped>
.text {
  position: relative;
  &.active,
  &:hover:not(.noHover) {
    .text__box {
      background: #f1f7ff !important;
      border-radius: 4px;
    }
  }
  &.noHover {
    margin: 0px 15px 18px;
  }
  &__title {
    display: flex;
    align-items: center;
    line-height: 30px;
    .text__icon {
      vertical-align: -1px;
    }
  }
  &__content {
    line-height: 20px;
    .text__icon {
      vertical-align: -2px;
    }
  }
  &__icon {
    display: inline-flex;
    align-items: center;
    width: 18px;
    height: 18px;
    margin-right: 4px;
    .full {
      display: block;
      width: 18px;
      height: 18px;
      font-size: 18px;
    }
  }
}
</style>
