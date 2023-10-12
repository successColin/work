<template>
  <div class="paramsDesign">
    <!-- 侧边栏 -->
    <section>
      <div class="paramsDesign__sidebar">
        <div
          v-for="(val, i) in sidebarArr"
          :key="i"
          class="paramsDesign__sidebar--item"
          @click="handleSwitch(val.id)"
          :style="`${activeValue === val.id ? 'background: #f1f7ff' : ''}`"
        >
          <div
            class="paramsDesign__sidebar--border"
            v-show="activeValue === val.id"
          ></div>
          <div class="paramsDesign__sidebar--font">
            {{ val.name }}
          </div>
        </div>
      </div>
    </section>
    <!-- 内容 -->
    <div class="paramsDesign__content">
      <print-template v-if="activeValue === 1"></print-template>
    </div>
  </div>
</template>

<script>
import PrintTemplate from './components/PrintTemplate';

export default {
  data() {
    return {
      activeValue: 1,
      sidebarArr: [
        {
          name: '打印模板设置',
          id: 1
        },
        {
          name: '消息通知',
          id: 2
        }
      ]
    };
  },

  components: {
    PrintTemplate
  },

  computed: {},

  mounted() {},

  methods: {
    handleSwitch(v) {
      this.activeValue = v;
    }
  }
};
</script>

<style lang='scss' scoped>
$sidebarLeftBorder: 36px;
.paramsDesign {
  padding: 10px 208px;
  display: flex;
  background: #f6f6f8;
  height: calc(100% - 20px);
  &__sidebar {
    width: 200px;
    background: #ffffff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
    padding: 10px 0;
    &--item {
      height: $sidebarLeftBorder;
      position: relative;
      display: flex;
      align-items: center;
      border-radius: 2px;
      cursor: pointer;
    }
    &--border {
      position: absolute;
      left: 0;
      top: 0;
      width: 3px;
      height: $sidebarLeftBorder;
      border-radius: 2px 0px 0px 2px;
      background: #4689f5;
    }
    &--font {
      margin-left: 44px;
      font-size: 13px;
      color: #333333;
    }
  }
  &__content {
    margin-left: 10px;
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
  }
}
</style>
