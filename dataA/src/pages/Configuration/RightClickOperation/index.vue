/**
* @name: index
* @author: DELL
* @date: 2021/11/25 9:44
* @description：右键操作列表
* @update: 2021/11/25 9:44
*/
<!-- 页面 -->
<template>
  <div class="menuListWrap" v-if="JSON.stringify(rightClick)!=='{}'" :style="styleInfo">
    <div :class="{menuItem:item.type==='menu', dividerItem: item.type==='divider'}"
         v-for="(item,index) in config"
         :key="index"
    >
      <div v-if="item.type==='menu'" @click="triggerEvent(item)">
        <span class="iconfont" :class="{[item.icon]:true}"></span>
        <div>{{ item.name }}</div>
      </div>
      <div v-else>
        <el-divider>
          <i class="iconfont" :class="{[item.icon]:true}" v-if="item.icon"></i>
          {{ item.name }}
        </el-divider>
      </div>
    </div>
  </div>
</template>

<script>
import {createUnique} from '@/utils/utils'
import {delComponent} from '@/services/design';

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
    }
  },
  data() {
    return {
      config: [{
        name: '置于顶层',
        icon: 'icon-zhiding',
        type: 'menu',
        eventType: 'putTop'
      }, {
        name: '上移一层',
        icon: 'icon-shangyi',
        type: 'menu',
        eventType: 'bringForward'
      }, {
        name: '下移一层',
        icon: 'icon-xiayi',
        type: 'menu',
        eventType: 'sendBackward'
      }, {
        name: '置于底层',
        icon: 'icon-zhidi',
        type: 'menu',
        eventType: 'putBottom'
      }, {
        name: '',
        icon: '',
        type: 'divider'
      }, {
        name: '锁定图层',
        icon: 'icon-suoding',
        type: 'menu',
        eventType: 'lockLayer'
      }, {
        name: '隐藏图层',
        icon: 'icon-xianshi',
        type: 'menu',
        eventType: 'hideLayers'
      }, {
        name: '',
        icon: '',
        type: 'divider'
      }, {
        name: '复制图层',
        icon: 'icon-fuzhi',
        type: 'menu',
        eventType: 'duplicateLayer'
      }, {
        name: '删除图层',
        icon: 'icon-shanchu',
        type: 'menu',
        eventType: 'deleteLayer'
      }],
      styleInfo: ''
    };
  },

  components: {},

  computed: {
    configArr() { // 设计区域的组件
      return this.$store.getters.list;
    }
  },
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
              top = this.rightClick.pageY;
            } else {
              top = this.rightClick.pageY - 310;
            }
            this.styleInfo = `top:${top}px;left:${this.rightClick.pageX}px;`;
          });
        }
      }
    }
  },
  mounted() {
  },

  methods: {
    triggerEvent(item) {
      const {eventType} = item;
      this[eventType]();
    },
    updateConfigList(activeComponent) {
      const index = this.configArr.findIndex((item) => item.componentId === activeComponent.componentId);
      const list = [...this.configArr];
      list.splice(index, 1, activeComponent);
      this.$store.dispatch('config/updateComponentList', list);
    },
    async deleteLayer() { // 删除图层
      const index = this.configArr.findIndex((item) => item.componentId === this.activeComponent.componentId);
      const list = [...this.configArr];
      try {
        if (this.activeComponent.id) {
          await delComponent({id: this.activeComponent.id})
        }
        list.splice(index, 1);
        this.$emit('updateActiveComponent', {})
        this.$nextTick(() => {
          this.$store.dispatch('config/updateComponentList', list);
        })
      } catch (e) {
        console.log(e);
      }
    },
    putTop() { // 置顶
      const list = this.configArr;
      // let max = Math.max.apply(Math, list.map(function (o) {
      //   return o.stylesObj.zIndex;
      // }))
      // const obj = {...this.activeComponent};
      // obj.stylesObj.zIndex = max + 1;
      // this.updateConfigList(obj);
      this.$store.dispatch('config/putTop', {list, activeComponent: this.activeComponent});
    },
    putBottom() { // 置底
      const list = this.configArr;
      // let mix = Math.min.apply(Math, list.map(function (o) {
      //   return o.stylesObj.zIndex;
      // }))
      // const obj = {...this.activeComponent};
      // obj.stylesObj.zIndex = mix - 1;
      // this.updateConfigList(obj);
      this.$store.dispatch('config/putBottom', {list, activeComponent: this.activeComponent});
    },
    bringForward() { // 上移一层
      const list = this.configArr;
      this.$store.dispatch('config/bringForward', {list, activeComponent: this.activeComponent});
      // const index = list.findIndex((item) => item.componentId === this.activeComponent.componentId);
      // if (index === 0) return;
      // const {stylesObj: {zIndex}} = list[index - 1];
      // const obj = {...this.activeComponent};
      // obj.stylesObj.zIndex = zIndex + 1;
      // this.updateConfigList(obj);
    },
    sendBackward() { // 下移一层
      const list = this.configArr;
      this.$store.dispatch('config/sendBackward', {list, activeComponent: this.activeComponent});
      // const index = list.findIndex((item) => item.componentId === this.activeComponent.componentId);
      // console.log(index);
      // if (index === (list.length - 1)) return;
      // const {stylesObj: {zIndex}} = list[index + 1];
      // const obj = {...this.activeComponent};
      // obj.stylesObj.zIndex = zIndex - 1;
      // this.updateConfigList(obj);
    },
    duplicateLayer() { // 复制图层
      const componentId = createUnique();
      const {top, left, name} = this.activeComponent;
      const obj = {...this.activeComponent, componentId, top: top + 30, left: left + 30, name: `${name}(复制)`};
      const list = [...this.configArr];
      delete obj.id;
      list.push(JSON.parse(JSON.stringify(obj)));
      this.$store.dispatch('config/updateComponentList', list);
      this.$emit('updateActiveComponent', obj);
    },
    hideLayers() { // 隐藏图层
      const obj = {...this.activeComponent, isShow: false};
      this.updateConfigList(obj);
    },
    lockLayer() { // 锁定解锁图层
      const {isLock} = this.activeComponent;
      const obj = {...this.activeComponent, isLock: !isLock};
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
  background: #131E45;
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.3);
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
        color: #FFFFFF;;
      }

      & > div {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #FFFFFF;
        opacity: 0.7;
      }
    }

    &:hover {
      background: #1C3164;
      cursor: pointer;
    }
  }

  .dividerItem {
    ::v-deep {
      .el-divider {
        margin: 8px 0;
        background-color: #2F437F;
      }
    }
  }
}
</style>
