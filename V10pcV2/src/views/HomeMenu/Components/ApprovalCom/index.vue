/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/

<!-- 页面 -->
<template>
  <div class="singleTextWrap" :style="getContentStyles()">
    <div
        class="singleTextContent"
        :style="getTextStyles()"
        @click="open"
    >
      <span>{{content}}</span>
    </div>
  </div>
</template>

<script>
import {
  getCCTasks,
  getCompletedTasks,
  getIInitiatedList,
  getMyTodoList,
} from '@/api/flow';
import { initiatedArr } from '@/views/HomeMenuConfig/constants/global';

export default {
  props: {
    config: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      visible: false,
      content: '',
      timer: null,
    };
  },

  components: {
  },

  computed: {
    getTextStyles() {
      return function () {
        // eslint-disable-next-line max-len
        const {
          stylesObj = {},
          gradientType,
          width,
          height,
          interactionType,
          enableEllipsis,
          enableBackground
        } = this.config;
        const {
          color1,
          color2,
          hShadow,
          vShadow,
          blur,
          shadowColor,
          borderColor,
          borderStyle,
          ...rest
        } = stylesObj;
        let styles = `width: ${width}px;height: ${height}px;`;
        styles += enableEllipsis
          ? `line-height:${this.config.height}px;`
          : `line-height:${stylesObj.fontSize + 10}px;`;
        Object.keys(rest)
          .forEach((item) => {
            let singStyle = `${item}:${stylesObj[item]}`;
            if (item === 'fontSize' || item === 'letterSpacing') {
              singStyle += 'px';
            }
            styles += `${singStyle}${singStyle ? ';' : ''}`;
          });
        if (gradientType === 1 && color1 && color2) {
          // 左右渐变
          styles += `background-image: linear-gradient(to right, ${color1}, ${color2});`;
        } else if (gradientType === 2 && color1 && color2) {
          styles += `background-image: -webkit-gradient(linear,0 0,0 bottom,from(${color1}),to(${color2}));`;
        } else if (color1 || color2) {
          styles += `color: ${color1 || color2};`;
        } else {
          styles += 'color: rgba(255, 255, 255, 0);';
        }
        if (enableBackground) {
          styles += `text-shadow:${hShadow}px ${vShadow}px ${blur}px ${shadowColor};`;
        }
        if (interactionType && interactionType !== 1) {
          styles += 'cursor: pointer;';
        }
        return styles;
      };
    },
    getContentStyles() {
      return function () {
        const {
          stylesObj = {},
          enableBackground,
          width,
          height,
          top,
          left
        } = this.config;
        let styles = `width: ${width}px;height: ${height}px;top:${top}px;left:${left}px;zIndex:${stylesObj.zIndex}; `;
        const {
          backgroundColor,
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle
        } = stylesObj;
        if (enableBackground) {
          styles += ` backgroundColor:${backgroundColor}; borderRadius:${borderRadius}px;
          borderColor:${borderColor};borderWidth:${borderWidth}px;borderStyle:${borderStyle};`;
        }
        return styles;
      };
    },
  },
  mounted() {
    this.init();
    const eventName = `approval${this.config.componentId}`;
    this.$bus.$off(eventName).$on(eventName, () => {
      this.init();
    });
  },
  activated() {
  },
  watch: {
    '$store.state.base.approvalChangeNum': {
      handler() {
        this.init();
      }
    },
  },
  methods: {
    open() {
      this.$bus.$emit('lookApproval', this.config);
    },
    getApi(flowType) {
      // 获取api接口
      if ([...initiatedArr, 'IInitiatedIt'].includes(flowType)) {
        return getIInitiatedList;
      }
      if (flowType === 'LeaveItToMe') {
        return getMyTodoList;
      }
      if (flowType === 'Completed') {
        return getCompletedTasks;
      }
      if (flowType === 'CC') {
        return getCCTasks;
      }
      return '';
    },
    getParams(params, key) {
      if (initiatedArr.includes(key)) {
        params.instanceStatus = key;
      }
      return params;
    },
    async init() {
      const { stylesObj: { flowType = 'LeaveItToMe', flowGroups = [] } } = this.config;
      const api = this.getApi(flowType);
      const params = this.getParams({ flowGroupIds: flowGroups.join(','), current: 1, size: 1 }, flowType);
      const data = await api(params);
      this.content = data.total || 0;
    },
  },
  beforeDestroy() {
    const eventName = `approval${this.config.componentId}`;
    this.$bus.$off(eventName);
  },
  deactivated() {},
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  position: absolute;
  overflow: hidden;
  box-sizing: border-box;

  .singleTextContent {
    width: 100%;
    height: 100%;
    -webkit-background-clip: text;
    color: transparent;
    cursor: pointer;
  }
}
</style>
