<template>
  <div class="config globalConfig">
    <h1 class="config__h1">全局配置</h1>
    <el-form label-position="top">
      <el-form-item label="触发动作">
        <apiot-button class="btn triggerAction" @click="triggerConfig">
          <i class="iconfont icon-chufadongzuo m-r-4"></i>配置触发动作
        </apiot-button>
        <apiot-button class="btn" @click="showRelate">
          <i class="iconfont icon-guanxiguanlian m-r-4"></i>查看全局关系
        </apiot-button>
      </el-form-item>
      <el-form-item label="分享链接">
        <apiot-input
          placeholder="这里是帮助信息填写"
          class="m-b-10"
        ></apiot-input>
        <apiot-input
          placeholder="这里是帮助信息填写"
          class="m-b-10"
        ></apiot-input>
        <apiot-button class="btn">
          <i class="iconfont icon-fuzhi m-r-4"></i>复制链接
        </apiot-button>
      </el-form-item>
    </el-form>
    <transition name="slide-bottom">
      <trigger-action
        v-if="showTrigger"
        :showTrigger.sync="showTrigger"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
        :hasTriggerComp="hasTriggerComp"
      ></trigger-action>
    </transition>
    <transition name="slide-bottom">
      <relate-gird
        v-if="showGird"
        :visible.sync="showGird"
        :configData="configData"
        :triggerCompMap="triggerCompMap"
      ></relate-gird>
    </transition>
  </div>
</template>

<script>
import TriggerAction from './components/TriggerAction';
import RelateGird from './components/RelateGird';

export default {
  props: {
    configData: {
      type: Array
    },
    triggerCompMap: {
      type: Object
    },
    hasTriggerComp: {
      type: Object
    }
  },
  data() {
    return {
      showTrigger: false,
      showGird: false
    };
  },

  components: {
    TriggerAction,
    RelateGird
  },

  computed: {},

  created() {},

  mounted() {},

  methods: {
    async triggerConfig() {
      await this.$parent.saveLayout();
      this.showTrigger = true;
    },
    async showRelate() {
      await this.$parent.saveLayout();
      this.showGird = true;
    }
  }
};
</script>

<style lang='scss' scoped>
@import '../commonConfig';
.globalConfig {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #fff;
  .btn {
    margin: 0;
    width: 100%;
    .iconfont {
      color: $--color-primary;
    }
  }
  .triggerAction {
    margin-bottom: 8px;
  }
}
</style>
