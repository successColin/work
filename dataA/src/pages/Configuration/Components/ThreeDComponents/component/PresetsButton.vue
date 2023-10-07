/**
* @name: PresetsButton
* @author: DELL
* @date: 2023/9/25 9:03
* @description：PresetsButton
* @update: 2023/9/25 9:03
*/
<!-- 页面 -->
<template>
  <div class="presetsButtonBox" :class="makeId">
    <div
        v-for="(item, i) in list"
        :key="i"
        class="btnWrap"
        :class="{ active: i === active }"
        @click="clickPos(item, i)">{{item.name}}</div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      active: ''
    };
  },

  components: {},

  computed: {
    list() {
      const { systemPresetsConfig } = this.config;
      return systemPresetsConfig;
    },
    makeId() {
      const { componentId } = this.config;
      return `t3d${componentId}`;
    }
  },

  mounted() {
    this.initBtnStyles();
  },
  watch: {
    config: {
      handler() {
        this.removeStyles();
        this.initBtnStyles();
      }
    }
  },

  methods: {
    reset() {
      this.active = '';
    },
    clickPos(item, i) {
      this.$emit('click', item);
      this.active = i;
    },
    initBtnStyles() {
      const {
        presetGroupBorderRadius,
        presetGroupNormalBgColor,
        presetGroupActiveBgColor,
        presetGroupNormalBgUrl,
        presetGroupActiveBgUrl,
        presetFontFamily,
        presetFontWeight,
        presetFontSize,
        presetColor,
        presetBtnWidth,
        presetBtnHeight,
        presetHoverColor
      } = this.config;
      let styleDom = document.createElement('style');
      styleDom.setAttribute('type', 'text/css');
      const id = this.makeId;
      styleDom.setAttribute('id', id);
      styleDom.innerHTML = `
        .presetsButtonBox.${id} {
          .btnWrap {
            width: ${presetBtnWidth}px;
            height: ${presetBtnHeight}px;
            color: ${presetColor};
            font-size: ${presetFontSize}px;
            line-height: ${presetBtnHeight}px;
            font-weight: ${presetFontWeight};
            font-family: ${presetFontFamily};
            border-radius: ${presetGroupBorderRadius}px;
            background-color:${presetGroupNormalBgColor};
            background-image: url(${presetGroupNormalBgUrl});
          }
          .btnWrap:hover {
            color: ${presetHoverColor};
          }
          .btnWrap.active {
            color: ${presetHoverColor};
            background-color:${presetGroupActiveBgColor};
            background-image: url(${presetGroupActiveBgUrl});
          }
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom)
    },
    removeStyles() {
      let boxStyles = document.querySelector(`[id="${this.makeId}"]`);
      if (!boxStyles) return;
      boxStyles.parentNode.removeChild(boxStyles);
    }
  },
  beforeDestroy() {
    this.removeStyles();
  },
  name: 'PresetsButton'
};
</script>

<style lang='scss' scoped>
.presetsButtonBox {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: hidden;
  .btnWrap {

    margin: auto;
    text-align: center;
    background-image: url("~@/assets/images.svg");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    transition: all 0.4s ease;
  }
}
</style>
