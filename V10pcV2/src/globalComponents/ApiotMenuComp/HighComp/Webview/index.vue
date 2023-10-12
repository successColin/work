<template>
  <div
    class="webview"
    :id="configData.compId"
    :style="getStyle(false)"
    :class="[
      { noHover: !isConfig },
      { active: isConfig && activeObj.compId === configData.compId },
      { isTable: isTable },
    ]"
    v-if="showInput && isLoadComplete"
  >
    <iframe
      ref="Iframe"
      frameborder="0"
      v-if="!isConfig && !isPreview && this.configData.showType === 2 && show"
      :src="`${getAdress}${paramsStr}`"
      :style="getStyle(true)"
      :key="configData.compId"
    ></iframe>
    <div
      :style="getStyle(true)"
      v-if="!isConfig && !isPreview && this.configData.showType === 1"
    >
      <HomeMenu :otherParams="otherParams"></HomeMenu>
    </div>
    <div class="webview__config" v-if="isConfig || isPreview">
      {{ getAdress ? getAdress : 'webview 占位' }}
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
import { formatDate } from '@/utils/utils';
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
      selfHeight: 200,
      queryUrl: '',
      show: false,
      isDone: {},
      isLoadComplete: true,
    };
  },
  mixins: [compMixin],

  components: {
    HomeMenu,
  },

  inject: ['getAllForm', 'resolveFormula', 'getAllComp', 'isPreview'],

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
      return (flag) => {
        let style = '';
        if (this.configData.sizeType === 1) {
          style += `width:100%;height:${this.selfHeight}px;`;
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
        if (flag) {
          style += 'width:100% !important;';
        }
        return style;
      };
    },
  },
  activated() {
    Object.keys(this.isDone).forEach((v) => {
      this.isDone[v] = true;
    });
    this.setTabMianHeight();
  },
  mounted() {
    if (!this.isConfig && !this.isPreview) {
      this.setTabMianHeight();
      this.initWatch();
    }
    this.$bus.$on('changeUrl', this.initParams);
    this.$bus.$on('queryExport', this.queryExport);
    // window.addEventListener('resize', debounce(this.setTabMianHeight));
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
    // window.removeEventListener('resize', debounce(this.setTabMianHeight));
  },

  methods: {
    // ureport 导出
    queryExport({ exportType, mode, queryArea }) {
      if (
        !queryArea.includes(this.parent.parentCompId) &&
        queryArea.length !== 0
      ) {
        return;
      }

      // 只有ureport 导出
      const { showType, externalType, ureportObj } = this.configData;
      const exportName =
        (ureportObj.name && ureportObj.name.split('.')[0]) || '';
      if (showType === 2 && externalType === 2) {
        let url = '';
        if (mode === 'export') {
          const link = document.createElement('a');
          const body = document.querySelector('body');
          if (exportType === 1) {
            url += '/ureport/excel';
          } else if (exportType === 2) {
            url += '/ureport/word';
          } else if (exportType === 3) {
            url += '/ureport/pdf';
          }
          link.href = `${this.$store.state.globalConfig.ureportConfig.ureportUrl}${url}?_u=file:${ureportObj.name}&_t=0&${this.paramsStr}&_n=${exportName}`;
          link.style.display = 'none';
          body.appendChild(link);
          link.click();
          body.removeChild(link);
        } else if (mode === 'print') {
          url = `${this.$store.state.globalConfig.ureportConfig.ureportUrl}/ureport/pdf/show?_u=file:${ureportObj.name}&${this.paramsStr}&_n=${exportName}`;
          window.open(url);
        }
      } else {
        const iframe = this.$refs.Iframe.contentWindow;

        iframe.postMessage(
          {
            message: 'doExport',
          },
          '*',
        );
      }
    },
    setTabMianHeight() {
      this.isLoadComplete = false;
      let parent = this.$parent;
      while (!parent.specialParent) {
        parent = parent.$parent;
      }
      this.$nextTick(() => {
        setTimeout(() => {
          const id = parent.getCurTab;
          if (id && document.getElementById(id)) {
            const height = document.getElementById(id).offsetHeight;
            console.log(height);
            this.curHeight = height - 20;
            if (this.curHeight > 0) {
              this.selfHeight = this.curHeight; //  - selfH
              sessionStorage.lastSelfHeight = this.selfHeight;
            } else {
              this.selfHeight = sessionStorage.lastSelfHeight;
            }
          }
          this.isLoadComplete = true;
        }, 500);
      });
    },
    initWatch() {
      this.configData.paramsArr.forEach((params) => {
        if (params.type === 2) {
          params.formula.replace(/\$([A-Za-z0-9]{6})\$/g, (v, v1) => {
            const unWatch = this.$watch(
              () => this.getAllForm()[v1],
              (vvv) => {
                if (this.isDone[v1]) {
                  this.initParams();
                  if (vvv) {
                    this.isDone[v1] = false;
                  }
                }
              },
              {
                immediate: true,
              },
            );
            this.watchArr.push(unWatch);
            this.isDone[v1] = true;
          });
        }
      });
      this.initParams();
    },
    initParams(area = []) {
      if (!area.includes(this.parent.parentCompId) && area.length !== 0) return;

      this.show = false;
      let str = '?';
      if (this.getAdress.indexOf('?') !== -1) {
        str = '&';
      }

      this.configData.paramsArr.forEach((params) => {
        if (params.type === 1) {
          this.otherParams[params.name] = params.fixed;
          str += `${params.name}=${params.fixed}&`;
        } else {
          const allComp = this.getAllComp();
          const timeComp =
            allComp[params && params.formula.replace(/\$/g, '')] || {};
          const { timeInterval, compType, dropDownType, dataSource } = timeComp;
          let value = this.resolveFormula(true, params.formula);
          // 日期框  日期时间框
          if (compType === 8 || compType === 9) {
            let type = '';
            if (compType === 8) {
              type = 'yyyy-MM-dd';
            }
            if (compType === 9) {
              type = 'yyyy-MM-dd hh:mm:ss';
            }
            if (timeInterval) {
              const timeArr = value.split(',');
              const startTime =
                timeArr[0] && formatDate(new Date(timeArr[0]), type);
              const endTime =
                timeArr[1] && formatDate(new Date(timeArr[1]), type);
              str += `${params.name}_start=${startTime || ''}&${
                params.name
              }_end=${endTime || ''}&`;
            } else {
              if (value) {
                value = formatDate(new Date(value), type);
              }
              str += `${params.name}=${value}&`;
            }
          } else if (compType === 2) {
            if (dropDownType === 1) {
              const arr =
                (dataSource &&
                  dataSource.dictObj &&
                  dataSource.dictObj.dictValue) ||
                [];
              console.log(typeof value);
              if (value === 0) {
                const arrVal = [];
                arr.forEach((g) => {
                  arrVal.push(g.value);
                });
                str += `${params.name}=${arrVal.join(',')}&`;
              } else {
                str += `${params.name}=${value}&`;
              }
            }
            if (dropDownType === 2) {
              const arr = (value && value.split(',')) || [];
              const index = arr.indexOf('0');
              if (index !== -1) {
                arr.splice(index, 1);
              }
              str += `${params.name}=${arr.join(',')}&`;
            }
            console.log(value);
          } else {
            str += `${params.name}=${value}&`;
          }
          // this.otherParams[params.name] = value;
          this.$set(this.otherParams, params.name, value);
        }
      });
      this.otherParams.id = this.configData.innerLink;
      this.paramsStr = str;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
