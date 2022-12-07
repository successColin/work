/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <VueDragResize
      :parentLimitation="true"
      :isActive="config.componentId === activeComponent.componentId"
      @deactivated="deactivated"
      :w="config.width"
      :h="config.height"
      :x="config.left"
      :y="config.top"
      :parentW="bgConfig.width"
      :parentH="bgConfig.height"
      :minw="2"
      :minh="2"
      :parentScaleX="scale"
      :parentScaleY="scale"
      @dragstop="dragstop"
      v-on:resizing="resize"
      v-on:dragging="dragging"
      @clicked="handleClick"
      @activated="activated"
      :class="{locked: config.isLock}"
      :z="config.componentId === activeComponent.componentId ? 999 : config.stylesObj.zIndex"
  >
    <div class="singleTextWrap" :style="getContentStyles()" @contextmenu.prevent="show">
      <c-marquee
          :sendVal="list"
          :config="config"
          :speed="config.stylesObj.speed"
          :takeEffect="takeEffect"
      ></c-marquee>
    </div>
  </VueDragResize>
</template>

<script>
import {isEqual} from 'lodash';
import {screenConfig} from '@/constants/global';

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
      default: () => {
      }
    },
    scale: {
      type: Number,
      default: 1
    },
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      takeEffect: '',
      list: []
    };
  },

  components: {
    // VueDragResize
  },

  computed: {
    getContentStyles() {
      return function () {
        const {stylesObj = {}, enableBackground} = this.config;
        const {
          backgroundColor,
          borderRadius,
          borderColor,
          borderWidth,
          borderStyle
        } = stylesObj;
        if (enableBackground) {
          return `backgroundColor:${backgroundColor}; borderRadius:${borderRadius}px;
          borderColor:${borderColor};borderWidth:${borderWidth}px;borderStyle:${borderStyle};`;
        }
        return '';
      };
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  watch: {
    'config.dataConfig': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    },
    'config.apiDataConfig': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    },
    'config.SqlDataConfig': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const {dataType, dataConfig, apiDataConfig, SqlDataConfig} = this.config;
      const {takeEffect, staticValue} = dataConfig;
      if (dataType === 1) {
        const obj = JSON.parse(staticValue);
        this.list = obj;
        this.takeEffect = takeEffect;
      }
      if (dataType === 2) {
        const {apiEffect, apiFilterResponse} = apiDataConfig
        this.takeEffect = apiEffect;
        if (apiFilterResponse === '{}') {
          this.list = [];
          return;
        }
        const obj = JSON.parse(apiFilterResponse);
        this.list = obj;
      }
      if (dataType === 3) {
        const {SQLEffect, SQLFilterResponse} = SqlDataConfig
        const obj = JSON.parse(SQLFilterResponse);
        this.takeEffect = SQLEffect;
        this.list = obj;
      }
    },
    deactivated() {
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    },
    update(obj) {
      const {componentId} = this.config;
      const list = [...this.getList];
      const index = list.findIndex((item) => {
        return item.componentId === componentId
      });
      const newInfo = {
        ...this.config,
        ...obj
      };
      list.splice(index, 1, newInfo);
      this.$store.dispatch('config/updateComponentList', list);
    },
    dragstop(newRect) {
      this.update(newRect);
    },
    dragging(newRect) {
      this.update(newRect);
    },
    resize(newRect) {
      this.update(newRect);
    },
    handleClick() {
    },
    show(e) {
      this.$emit('updateActiveComponent', this.config);
      this.$emit('rightClickComponent', e);
    }
  },
  name: 'SingleLineText'
};
</script>

<style lang='scss' scoped>
.singleTextWrap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;

  .singleTextContent {
    width: 100%;
    height: 100%;
    -webkit-background-clip: text;
    color: transparent;
  }
}
</style>
