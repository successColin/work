/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles">
    <div class="tabContentWrap" :class="{disabledCls: loading}">
      <div
          :class="{[`tabContentWrap_${config.componentId}`]: true, active: this.isFlag }"
          class="tabNameWrap"
          @click="handleActive"
      >
        <i class="el-icon-loading" v-if="loading"></i>
        {{ renderContent }}
      </div>

    </div>
  </div>
</template>

<script>
import {screenConfig} from '@/constants/global';
import {btnPost} from '@/services/design';

export default {
  props: {
    bgConfig: {
      type: Object,
      default() {
        return screenConfig
      }
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    // eslint-disable-next-line no-warning-comments
    // todo: activeComponent与config 两个变量有重复，所有的组件都可以进行优化；
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    changeFilterParams: { // 用于修改过滤条件参数的
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      hoverActive: null,
      isFlag: false,
      loading: false
    };
  },
  computed: {
    renderContent() { // 获取内容
      const {stylesObj: {content}} = this.config;
      return content;
    },
    getContentStyles() {
      const {width, height, top, left, stylesObj} = this.config;
      return `width:${width}px;height:${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex};`;
    },
    getList() {
      return this.$store.getters.list;
    }
  },

  mounted() {
    this.insertClass();
  },

  components: {},

  watch: {
    'config.stylesObj'() {
      this.removeClass();
      this.insertClass();

    }
  },
  methods: {
    removeClass() { // 移除样式
      const {componentId} = this.config;
      const id = `tabContentWrap_${componentId}`;
      const ele = document.getElementById(id);
      document.getElementsByTagName('head')[0].removeChild(ele);
    },
    insertClass() { // 生成样式
      const {
        componentId, stylesObj: {
          normalFSize, // 正常字体大小
          normalColor, // 正常字体颜色
          normalBorderRadius, // 正常倒角
          normalBColor, // 正常边框颜色
          normalBWidth, // 正常边框宽度
          normalBStyle, // 正常边框颜色
          normalBgColor, // 正常背景颜色
          activeFSize, // 悬浮字体大小
          activeColor, // 悬浮字体颜色
          activeBorderRadius, // 悬浮边框倒角
          activeBColor, // 悬浮边框颜色
          activeBWidth, // 悬浮边框宽度
          activeBStyle, // 悬浮边框颜色
          activeBgColor // 悬浮背景颜色
        }
      } = this.config;
      const classNames = `.tabContentWrap_${componentId}`;
      let styleDom = document.createElement('style');
      styleDom.setAttribute('type', 'text/css');
      styleDom.setAttribute('id', `tabContentWrap_${componentId}`);
      styleDom.innerHTML = `
        ${classNames} {
          font-size: ${normalFSize}px;
          color: ${normalColor};
          border-radius: ${normalBorderRadius}px;
          border: ${normalBWidth}px ${normalBStyle} ${normalBColor};
          background-color: ${normalBgColor}
        }
         ${classNames}:hover {
          font-size: ${activeFSize}px;
          color: ${activeColor};
          border-radius: ${activeBorderRadius}px;
          border: ${activeBWidth}px ${activeBStyle} ${activeBColor};
          background-color: ${activeBgColor}
        }
      `;
      document.getElementsByTagName('head')[0].appendChild(styleDom)
    },
    async handleActive() {
      const {config: {apiComponent = '', apiParamsConfig = [], refreshType = ''}, id: elementId} = this.config;
      if (!apiComponent || !apiParamsConfig.length) {
        return;
      }
      // 获取参数的组件
      const obj = this.$parent.$children.find((item) => item.config.componentId === apiComponent);
      if (!obj) return;
      const {resObj} = obj;
      // 校验参数是否必填， 顺便把参数也处理一下
      let paramsObj = {}, isTrue = true, message = '';
      apiParamsConfig.forEach((item) => {
        const {paramsKey, paramsName, isRequired} = item;
        const value = resObj[paramsKey];
        if (isRequired && (value === undefined || value === null || value === '')) {
          isTrue = false;
          message += `请检查${paramsKey}值是否正确;</br>`
        }
        paramsObj[paramsName] = value;
      });
      if (!isTrue) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message,
          type: 'error'
        });
        return;
      }
      this.loading = true;
      const lastParams = {
        elementId,
        paramsStr: JSON.stringify(paramsObj)
      }
      try {
        await btnPost(lastParams);
        await this.refresh();
        this.$message.success('操作成功!');
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error('操作失败!');
      }
    },
    async refresh() {
      const {config: {refreshType = null}, id: elementId} = this.config;
      const close = () => {
        const modalDom = window.parent.document.querySelector('.cModalWrap');
        if (modalDom) {
          modalDom.click();
        }
      }
      if (!refreshType) {
        close();
      }
      if (refreshType === 2) { // 只关闭弹框
        close();
      }
      if (refreshType === 1) { // 刷新当前
        this.$emit('refreshPage');
      }
      if (refreshType === 3) { // 关闭弹框并且刷新书友组件数据
        close();
        window.parent.postMessage({message: 'refreshPage'}, '*');
      }
    }
  },
  beforeDestroy() {},
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  .tabContentWrap {
    min-height: 40px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    &.disabledCls{
      pointer-events: none;
    }

    .tabNameWrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      cursor: pointer;

      .tabName {
        display: inline-block;
      }
    }
  }
}
</style>
