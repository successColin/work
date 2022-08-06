<template>
  <div
    class="webview"
    :id="configData.compId"
    :style="getStyle"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput"
  >
    <iframe
      ref="Iframe"
      frameborder="0"
      v-if="!isConfig && this.configData.showType === 2"
      :src="`${getAdress}${paramsStr}`"
      :style="getStyle"
      :key="configData.compId"
    ></iframe>
    <div :style="getStyle" v-if="!isConfig && this.configData.showType === 1">
      <HomeMenu :otherParams="otherParams"></HomeMenu>
    </div>
    <div class="webview__config" v-if="isConfig">{{ getAdress }}</div>
    <config-manage
      v-if="isConfig"
      :showDel="isConfig && activeObj.compId === configData.compId"
      @click.native.stop="$bus.$emit('changeCurActiveObj', configData)"
      @delChild="delChild"
    ></config-manage>
  </div>
</template>

<script>
import HomeMenu from '@/views/HomeMenu';
import compMixin from '../../compMixin';

export default {
  data() {
    return {
      otherParams: {},
      curCompType: 2,
      paramsStr: '',
      watchArr: [],
      curHeight: 200,
      queryUrl: ''
    };
  },
  mixins: [compMixin],

  components: {
    HomeMenu
  },

  inject: ['getAllForm', 'resolveFormula'],

  computed: {
    getAdress() {
      if (this.configData.showType === 1) {
        return this.configData.innerName;
      }
      if (this.configData.externalType === 2) {
        return `${this.$store.state.globalConfig.ureportConfig.ureportUrl}/ureport/preview?_u=file:${this.configData.ureportObj.name}&_t=0`;
      }
      return this.configData.outerLink;
    },

    getStyle() {
      let style = '';
      if (this.configData.sizeType === 1) {
        style += `width:100%;height:${this.curHeight}px`;
      }
      if (this.configData.sizeType === 2) {
        if (this.configData.width) {
          style += `width:${this.configData.width};`;
        }
        if (this.configData.heightMul) {
          style += `height:${this.configData.heightMul * 82}px;`;
        }
      }
      if (this.configData.sizeType === 3) {
        style += `width:${this.configData.widthPix}px;height:${this.configData.heightPix}px;maxWidth: 100%;`;
      }
      return style;
    }
  },

  mounted() {
    if (!this.isConfig) {
      this.setTabMianHeight();
      this.initWatch();
    }
    this.$bus.$on('changeUrl', this.initParams);
    this.$bus.$on('queryExport', this.queryExport);
  },

  beforeDestroy() {
    // 取消值变化的监听
    this.watchArr.forEach((unWatch) => {
      if (unWatch) {
        unWatch();
      }
    });
    this.watchArr = [];
    this.$bus.$off('changeUrl');
    this.$bus.$off('queryExport');
  },

  methods: {
    // ureport 导出
    queryExport(type) {
      // 只有ureport 导出
      const { showType, externalType, ureportObj } = this.configData;
      if (showType === 2 && externalType === 2) {
        const link = document.createElement('a');
        const body = document.querySelector('body');
        let url = '';
        if (type === 1) {
          url += '/ureport/excel';
        } else if (type === 2) {
          url += '/ureport/word';
        } else if (type === 3) {
          url += '/ureport/pdf';
        }
        link.href = `${this.$store.state.globalConfig.ureportConfig.ureportUrl}${url}?_u=${ureportObj.name}&_t=0&`;
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
      } else {
        const iframe = this.$refs.Iframe.contentWindow;

        iframe.postMessage(
          {
            message: 'doExport'
          },
          '*'
        );
      }
    },
    setTabMianHeight() {
      let parent = this.$parent;
      while (!parent.specialParent) {
        parent = parent.$parent;
      }

      this.$nextTick(() => {
        const id = parent.getCurTab;
        // console.log(id);
        if (id && document.getElementById(id)) {
          const height = document.getElementById(id).offsetHeight;
          // console.log(height);
          this.curHeight = height - 20;
        }
      });
    },
    initWatch() {
      this.configData.paramsArr.forEach((params) => {
        if (params.type === 2) {
          params.formula.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
            if (!this.$store.state.ureport.isNoodQuery) {
              const unWatch = this.$watch(
                () => this.getAllForm()[v1],
                () => {
                  this.initParams();
                },
                {
                  immediate: true
                }
              );
              this.watchArr.push(unWatch);
            }
          });
        }
      });
      this.initParams();
    },
    initParams() {
      let str = '?';
      if (this.getAdress.indexOf('?') !== -1) {
        str = '&';
      }

      this.configData.paramsArr.forEach((params) => {
        if (params.type === 1) {
          this.otherParams[params.name] = params.fixed;
          str += `${params.name}=${params.fixed}&`;
        } else {
          this.otherParams[params.name] = this.resolveFormula(true, params.formula);
          str += `${params.name}=${this.resolveFormula(true, params.formula)}&`;
        }
      });
      this.otherParams.id = this.configData.innerLink;
      this.paramsStr = str;
    }
  }
};
</script>

<style lang='scss' scoped>
.webview {
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  &.noHover {
    box-sizing: border-box;
    padding: 0 15px;
  }

  &.isTable {
    padding: 0;
    min-height: 80px;
    height: 80px;
  }
  &.active,
  &:hover:not(.noHover) {
    background: #f1f7ff;
    border-radius: 4px;
  }
  &.active {
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  }
  &__config {
    box-sizing: border-box;
    padding: 8px 12px;
    height: 82px;
    word-break: break-all;
  }
}
</style>
