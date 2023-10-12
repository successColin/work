/**
* @name: 基础折线配置
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
          v-model="active"
          @change="changeConfig"
          :tabArr="tabArr"
      ></c-property>
    </div>
    <div class="mainConfigWrap">
      <component
          :activeComponent="activeComponent"
          :is="active"
          v-bind="$attrs"
          v-on="$listeners"
      ></component>
    </div>
  </div>
</template>

<script>
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

  computed: {},

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
  height: calc(100%);
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
