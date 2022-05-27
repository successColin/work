<template>
  <div
    class="tabSidebar"
    @click="changeCurActiveObj"
    :class="[
      { highBorder: isConfig && activeObj.compId === configData.compId },
      { borderType: isConfig },
      { notConfig: !isConfig },
    ]"
  >
    <el-button-group
      class="tabSidebar__tab"
      v-if="configData.showTab && configData.children.length"
    >
      <el-button
        class="tabSidebar__tab--item"
        :class="[{ active: configData.curCompId === item.compId }]"
        v-for="item in configData.children"
        :key="item.compId"
        @click.stop="changeCurCompId(item)"
        >{{ item.name }}</el-button
      >
    </el-button-group>
    <div
      v-if="configData.children.length"
      class="tabSidebar__content"
      :class="[{ notShowTab: !configData.showTab }]"
    >
      <div
        class="tabSidebar__content--item"
        v-show="configData.curCompId === item.compId"
        v-for="item in configData.children"
        :key="item.compId"
      >
        <!-- 配置 -->
        <draggable
          style="height: 100%"
          v-if="isConfig"
          v-model="item.children"
          group="area"
          animation="300"
          ghostClass="featGhost"
          :areaType="2"
          :isSidebar="true"
          :move="areaMove"
        >
          <transition-group tag="div" style="height: 100%">
            <component
              :is="area.compName"
              v-for="area in item.children"
              :key="area.compId"
              :configData="area"
              :activeObj.sync="activeObj"
              :hasTriggerComp="hasTriggerComp"
              :isSidebar="isSidebar"
              :showType="showType"
            ></component>
          </transition-group>
        </draggable>
        <div style="height: 100%" v-else>
          <component
            :is="area.compName"
            v-for="area in item.children"
            :key="area.compId"
            :configData="area"
            :activeObj.sync="activeObj"
            :hasTriggerComp="hasTriggerComp"
            :isSidebar="isSidebar"
            :showType="showType"
            @showRight="showRight"
          ></component>
        </div>

        <div v-if="!item.children.length" class="tabSidebar__configClass">
          {{ configData.name }}
        </div>
      </div>
    </div>
    <div v-if="!configData.children.length" class="tabSidebar__configClass">
      {{ configData.name }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showType: {
      type: Object,
      default: () => {}
    },
    configData: {
      type: [Array, Object]
    },
    activeObj: {
      type: [Array, Object]
    },
    hasTriggerComp: {
      type: Object
    }
  },
  data() {
    return {
      isSidebar: true
    };
  },

  components: {},

  computed: {},
  inject: ['isConfig'],
  mounted() {
    // console.log(this.hasTriggerComp, this.showType, 'tabSidebar');
  },

  methods: {
    initConfigData() {
      this.$emit('update:configData', this.tabConfig);
    },
    changeCurActiveObj(e) {
      if (!this.isConfig) {
        return;
      }
      if (e) {
        e.stopPropagation();
      }
      this.configData.shouldTab = false;
      this.$bus.$emit('changeCurActiveObj', this.configData);
    },
    changeCurCompId(item) {
      this.configData.curCompId = item.compId;
      this.changeCurActiveObj();
      // item.shouldTab = true;
      // // console.log(item);
      // this.$bus.$emit('changeCurActiveObj', item);
    },
    areaMove(e) {
      const { component } = e.relatedContext;
      if (!component.$attrs.isSidebar) {
        return false;
      }
    },
    showRight(v) {
      this.$emit('showRight', v);
    }
  }
};
</script>

<style lang='scss' scoped>
.tabSidebar {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  border: 1px solid #e9e9e9;
  &__tab {
    box-sizing: border-box;
    width: 100%;
    height: 36px;
    padding: 6px 10px 0px 10px;
    display: flex;
    &--item {
      flex: 1;
      border: 1px solid #e9e9e9;
      color: #333333;
      cursor: pointer;
      text-align: center;
      font-size: 13px;
      font-family: PingFangSC-Medium, PingFang SC;
      &:not(:first-child) {
        margin-left: 1px;
      }
      &.active {
        background-color: $--color-primary;
        border-color: $--color-primary;
        color: #fff;
      }
    }
  }
  &__content {
    height: calc(100% - 36px);
    overflow: auto;
    &.notShowTab {
      height: 100%;
    }
    &--item {
      height: 100%;
      box-sizing: border-box;
      padding: 10px;
    }
  }
  &__configClass {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 13px;
    font-weight: 400;
    color: #808080;
  }
  &.notConfig {
    border: 0;
    // border-right: 1px solid #e9e9e9;
    .tabSidebar__content--item {
      padding: 0;
    }
  }
}
</style>
