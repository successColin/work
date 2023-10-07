/**
* @name: index
* @author: DELL
* @date: 2021/8/21 14:51
* @description：index
* @update: 2021/8/21 14:51
*/
<!-- 页面 -->
<template>
  <CDragComponent
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
    <div class="singleTextWrap" :style="getRotateX" @contextmenu.prevent="show">
      <div class="imageContent" :style="getRotateY">
        <div class="imageBox" :style="getTextStyles()">
        </div>
      </div>
    </div>
  </CDragComponent>
</template>

<script>

import {screenConfig} from '@/constants/global';
import {IsURL} from '@/utils/utils';
import {isEqual} from 'lodash';

export default {
  props: {
    bgConfig: {
      type: Object,
      default(){
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
      default: () => {
      }
    }
  },
  data() {
    return {
      content: ''
    };
  },

  components: {
  },

  computed: {
    getRotateY() {
      if (this.config.horizontalMirror) {
        return 'transform: rotateY(180deg);';
      }
      return '';
    },
    getRotateX() {
      if (this.config.verticalMirror) {
        return 'transform: rotateX(180deg);';
      }
      return '';
    },
    getImageUrl() { // 获取图片路径
      return function (url) {
        if (typeof url !== 'string') return '';
        if (!url) {return '';}
        const reg = /(http|https):\/\/([\w.]+\/?)\S*/ig;
        const result = url.match(reg);
        if (!result || !IsURL(result)) {return '';}
        return result[0] || '';
      }
    },
    getTextStyles() {
      return function () {
        let styles = '';
        const {stylesObj = {}, dataType} = this.config;
        Object.keys(stylesObj).forEach(item => {
          if (item === 'backgroundImage') {
            if (dataType === 1) {
              styles += `background-image:url(${stylesObj[item]});`;
            } else {
              const url = this.getImageUrl(this.content);
              styles += `background-image:url(${url});`;
            }
          } else if (item === 'rotationAngle') {
            styles += `transform:rotate(${stylesObj[item]}deg);`;
          } else {
            styles += `${item}:${stylesObj[item]};`
          }
        })
        return styles;
      };
    },
    getList() {
      return this.$store.getters.list;
    }
  },
  mounted() {
    this.init();
  },
  watch: {
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
    },
    'config.mqttDataConfig': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    },
    'config.dataType': {
      deep: true,
      handler(v, o) {
        if (!isEqual(v, o)) {
          this.init()
        }
      }
    }
  },
  methods: {
    init() {
      const {dataType, apiDataConfig, SqlDataConfig, mqttDataConfig} = this.config;
      if (dataType === 2) {
        const {apiEffect, apiFilterResponse} = apiDataConfig
        if (apiFilterResponse === '{}') {
          this.content = {};
          return;
        }
        const obj = JSON.parse(apiFilterResponse);
        this.content = obj[apiEffect];
      }
      if (dataType === 3) {
        const {SQLEffect, SQLFilterResponse} = SqlDataConfig
        const obj = JSON.parse(SQLFilterResponse);
        this.content = obj[SQLEffect];
      }
      if (dataType === 4) {
        const {mqttEffect, mqttFilterResponse} = mqttDataConfig
        const obj = JSON.parse(mqttFilterResponse);
        this.content = obj[mqttEffect];
      }
    },

    deactivated(){
      // this.$emit("updateActiveComponent", {})
    },
    activated() {
      this.$nextTick(() => {
        this.$emit('updateActiveComponent', this.config);
      })
    },
    update(obj) {
      const { componentId } = this.config;
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
    handleClick(e) {
      console.log(e, 'handleClick');
      // this.$nextTick(() => {
      //   this.$emit("updateActiveComponent", this.config);
      // })
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

  .imageContent {
    width: 100%;
    height: 100%;

    .imageBox {
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
}
</style>
