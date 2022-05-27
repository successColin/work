<template>
  <div
    class="compItem"
    :title="
      compObj.isFormula === 2
        ? compObj.name
        : `${getPath}/${getTriggerObj && getTriggerObj.compName}`
    "
  >
    <img
      v-if="compObj.isFormula !== 2 && getImg"
      :src="require(`@/assets/img/menu_images/${getImg}`)"
    />
    {{ compObj.isFormula === 2 ? compObj.name : getCompName }}
  </div>
</template>

<script>
import compMap from './compMap';

export default {
  props: {
    compObj: {
      type: Object
    },
    triggerCompMap: {
      type: Object
    }
  },
  data() {
    return {};
  },

  components: {},

  computed: {
    getTriggerObj() {
      return this.triggerCompMap[this.compObj.compId];
    },
    getImg() {
      if (this.getTriggerObj) {
        return compMap[this.getTriggerObj.compType].imgUrl;
      }
      return '';
    },
    getPath() {
      // console.log(this.triggerCompMap, this.compObj);
      const arr = this.compObj.compPath.split('/');
      if (this.triggerCompMap[arr[2]]) {
        arr[2] = this.triggerCompMap[arr[2]].compName;
      }

      if (this.triggerCompMap[arr[3]]) {
        arr[3] = this.triggerCompMap[arr[3]].compName;
      }

      return arr.join('/');
    },
    getCompName() {
      if (this.getTriggerObj) {
        if (this.getTriggerObj.compName.length > 10) {
          return `${this.getTriggerObj.compName.slice(0, 10)}...`;
        }
        return this.getTriggerObj.compName;
      }
      return '';
    }
  },

  mounted() {},

  methods: {},

  watch: {
    getTriggerObj: {
      handler(v) {
        if (!this.compObj.compName && v) {
          this.compObj.compName = v.compName;
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang='scss' scoped>
.compItem {
  height: 24px;
  width: max-content;
  padding: 0 10px;
  display: flex;
  align-items: center;
  background: #e5f0ff;
  border-radius: 4px;
  font-weight: 400;
  color: #333333;
  font-size: 13px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
}
</style>
