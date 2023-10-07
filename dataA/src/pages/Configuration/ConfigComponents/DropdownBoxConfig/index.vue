/**
* @name: index
* @author: DELL
* @date: 2021/11/29 14:58
* @description：index
* @update: 2021/11/29 14:58
*/
<!-- 页面 -->
<template>
  <div class="allConfigWrap">
    <div class="controlWrap">
      <c-property
          v-if="!getComponentInfo.enableCustomItems"
          v-model="active"
          @change="changeConfig"
          :tabArr="tabArr"
      ></c-property>
    </div>
    <div class="mainConfigWrap" :style="getHeight">
      <component
          :activeComponent="activeComponent"
          :is="active"
      ></component>
    </div>
  </div>
</template>

<script>
import {cloneDeep} from 'lodash';

const PropertyConfig = () => import('./propertyConfig');
const DataConfig = () => import('./dataConfig');
export default {
  props: {
    activeComponent: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      active: 'propertyConfig',
      tabArr: [{
        label: '配置',
        key: 'propertyConfig',
        compName: 'propertyConfig'
      }, {
        label: '数据',
        key: 'dataConfig',
        compName: 'dataConfig'
      }]
    };
  },

  components: {
    PropertyConfig,
    DataConfig
  },

  computed: {
    getHeight() {
     if (this.getComponentInfo.enableCustomItems) {
        return 'height: calc(100% - 12px);';
     }
      return 'height: calc(100% - 12px - 12px - 32px);';
    },
    getComponentInfo() { // 获取控件详情信息
      const {componentId} = this.activeComponent;
      if (!componentId) {
        return {};
      }
      const Obj = this.getList.find((item) => {
        return item.componentId === componentId
      }) || {};
      return cloneDeep(Obj);
    },
    getList() {
      return this.$store.getters.list;
    }
  },

  mounted() {
  },
  watch: {
    activeComponent: {
      immediate: true,
      deep: true,
      handler(newValue, old = {}) {
        if (newValue.componentId !== old.componentId) {
          this.active = 'propertyConfig';
        }
      }
    }
  },

  methods: {
    changeConfig(value) {
      this.active = value;
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.allConfigWrap {
  width: 100%;
  margin-top: 5px;
  height: calc(100% - 56px);
  overflow: auto;

  .controlWrap {
    margin: 12px 20px;
    box-sizing: border-box;

  }

  .mainConfigWrap {
    width: 100%;
    height: calc(100% - 12px - 12px - 32px);
  }
}
</style>
