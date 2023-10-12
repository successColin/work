/**
* @name: index
* @author: DELL
* @date: 2021/11/25 9:44
* @description：右键操作列表
* @update: 2021/11/25 9:44
*/
<!-- 页面 -->
<template>
  <div
      class="menuListWrap"
      v-if="JSON.stringify(rightClick) !== '{}'"
      :style="styleInfo"
  >
    <div
        :class="{
        menuItem: item.type === 'menu',
        dividerItem: item.type === 'divider',
      }"
        v-for="(item, index) in config"
        :key="index"
    >
      <div v-if="item.type === 'menu'" @click="triggerEvent(item)">
        <span class="iconfont" :class="{ [item.icon]: true }"></span>
        <div>{{ item.name }}</div>
      </div>
      <div v-else>
        <el-divider>
          <i
              class="iconfont"
              :class="{ [item.icon]: true }"
              v-if="item.icon"
          ></i>
          {{ item.name }}
        </el-divider>
      </div>
    </div>
  </div>
</template>

<script>
import { createUnique } from '@/utils/utils';
import deepClone from 'lodash/cloneDeep';
import { delComponent, copyElement } from '@/api/design';

export default {
  props: {
    rightClick: {
      type: Object,
      default() {
        return {};
      }
    },
    activeComponent: {
      type: Object,
      default() {
        return {};
      }
    },
    list: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      config: [
        {
          name: '置于顶层',
          icon: 'icon-zhiyudingceng',
          type: 'menu',
          eventType: 'putTop'
        },
        {
          name: '上移一层',
          icon: 'icon-shangyiyiceng',
          type: 'menu',
          eventType: 'bringForward'
        },
        {
          name: '下移一层',
          icon: 'icon-xiayiyiceng',
          type: 'menu',
          eventType: 'sendBackward'
        },
        {
          name: '置于底层',
          icon: 'icon-zhiyudiceng',
          type: 'menu',
          eventType: 'putBottom'
        },
        {
          name: '',
          icon: '',
          type: 'divider'
        },
        {
          name: '锁定图层',
          icon: 'icon-suodingtuceng',
          type: 'menu',
          eventType: 'lockLayer'
        },
        {
          name: '隐藏图层',
          icon: 'icon-xianshituceng',
          type: 'menu',
          eventType: 'hideLayers'
        },
        {
          name: '',
          icon: '',
          type: 'divider'
        },
        {
          name: '复制图层',
          icon: 'icon-fuzhi',
          type: 'menu',
          eventType: 'duplicateLayer'
        },
        {
          name: '删除图层',
          icon: 'icon-shanchu',
          type: 'menu',
          eventType: 'deleteLayer'
        }
      ],
      styleInfo: ''
    };
  },

  components: {},

  computed: {},
  watch: {
    rightClick: {
      immediate: true,
      deep: true,
      handler(newValue) {
        if (newValue) {
          this.$nextTick(() => {
            const screenHeight = document.body.offsetHeight;
            let top = null;
            if (screenHeight > this.rightClick.pageY + 310) {
              top = this.rightClick.pageY - 40;
            } else {
              top = this.rightClick.pageY - 360;
            }
            this.styleInfo = `top:${top}px;left:${this.rightClick.pageX + 10}px;`;
          });
        }
      }
    }
  },
  mounted() {
  },

  methods: {
    triggerEvent(item) {
      const { eventType } = item;
      this[eventType]();
    },
    updateConfigList(activeComponent) {
      const index = this.list.findIndex((item) => item.componentId === activeComponent.componentId);
      const list = [...this.list];
      list.splice(index, 1, activeComponent);
      this.$emit('updateList', list);
    },
    async deleteLayer() {
      // 删除图层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const index = this.list.findIndex(
          (item) => item.componentId === this.activeComponent.componentId
      );
      const list = [...this.list];
      try {
        if (this.activeComponent.id) {
          await delComponent({ id: this.activeComponent.id });
        }
        list.splice(index, 1);
        this.$emit('updateActiveComponent', {});
        this.$nextTick(() => {
          this.$emit('updateList', list);
        });
      } catch (e) {
        console.log(e);
      }
    },
    putTop() {
      // 置顶
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const list = [...this.list];
      const zIndexArr = list.map((o) => o.stylesObj.zIndex);
      const max = Math.max(...zIndexArr);
      const obj = { ...this.activeComponent };
      if (max === obj.stylesObj.zIndex) {
        return;
      }
      obj.stylesObj.zIndex = max + 1;
      this.updateConfigList(obj);
      this.$emit('resetRightClickInfo', {});
    },
    putBottom() {
      // 置底
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const list = [...this.list];
      const arr = list.map((o) => o.stylesObj.zIndex);
      const mix = Math.min(...arr);
      const obj = { ...this.activeComponent };
      obj.stylesObj.zIndex = mix - 1;
      this.updateConfigList(obj);
      this.$emit('resetRightClickInfo', {});
    },
    bringForward() {
      // 上移一层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const list = [...this.list];
      const index = list.findIndex((item) => item.componentId === this.activeComponent.componentId);
      if (index === 0) {
        return;
      }
      const {
        stylesObj: { zIndex }
      } = list[index - 1];
      const obj = { ...this.activeComponent };
      obj.stylesObj.zIndex = zIndex + 1;
      this.updateConfigList(obj);
      this.$emit('resetRightClickInfo', {});
    },
    sendBackward() {
      // 下移一层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const index = this.list.findIndex(
          (item) => item.componentId === this.activeComponent.componentId
      );
      if (index === this.list.length - 1) {
        return;
      }
      const {
        stylesObj: { zIndex }
      } = this.list[index + 1];
      const obj = { ...this.activeComponent };
      const n = zIndex - 1;
      obj.stylesObj.zIndex = n < 0 ? 0 : n;
      this.updateConfigList(obj);
      this.$emit('resetRightClickInfo', {});
    },
    async duplicateLayer() {
      // 复制图层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const {
        componentName,
        id
      } = this.activeComponent;
      if (componentName === 'CanvasDrawing') {
        const res = await copyElement({ id });
        if (!res) {
          this.$message.error('操作失败!');
          return;
        }
        const {
          id: resId,
          designJson: elementDesign,
        } = res;
        const config = JSON.parse(elementDesign);
        this.makeNewElement({
          ...config,
          id: resId,
        });
      } else {
        const obj = deepClone(this.activeComponent);
        delete obj.id;
        this.makeNewElement(obj);
      }
    },
    makeNewElement(elementConfig) { // 生成新的控件
      const {
        top,
        left,
        name
      } = this.activeComponent;
      const componentId = createUnique();
      const newObj = {
        componentId,
        top: top + 30,
        left: left + 30,
        name: `${name}(复制)`
      };
      const obj = {
        ...elementConfig,
        ...newObj
      };
      const list = [...this.list];
      list.push(obj);
      this.$nextTick(() => {
        this.$emit('updateList', list);
      });
      this.$emit('updateActiveComponent', obj);
    },
    hideLayers() {
      // 隐藏图层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const obj = {
        ...this.activeComponent,
        isShow: false
      };
      this.updateConfigList(obj);
    },
    lockLayer() {
      // 锁定解锁图层
      if (JSON.stringify(this.activeComponent) === '{}') {
        return;
      }
      const { isLock } = this.activeComponent;
      const obj = {
        ...this.activeComponent,
        isLock: !isLock
      };
      this.updateConfigList(obj);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.menuListWrap {
  width: 160px;
  height: 310px;
  position: absolute;
  top: 110px;
  left: 200px;
  padding-top: 10px;
  background: #ffffff;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.14);
  box-sizing: border-box;
  z-index: 2;

  .menuItem {
    width: 100%;
    height: 32px;

    & > div {
      display: flex;
      align-items: center;
      height: 100%;
      padding-left: 10px;
      box-sizing: border-box;

      & > span {
        margin-right: 8px;
        color: #bbc3cd;
      }

      & > div {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }

    &:hover {
      background: #f1f7ff;
      cursor: pointer;
    }

    &:hover > div {
      & > span {
        color: #4689f5;
      }

      & > div {
        color: #4689f5;
      }
    }
  }

  .dividerItem {
    ::v-deep {
      .el-divider {
        margin: 8px 0;
        background-color: #e9e9e9;
      }
    }
  }
}
</style>
