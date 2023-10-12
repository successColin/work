/**
* @name: index
* @author: DELL
* @date: 2022/8/4 10:48
* @description：index
* @update: 2022/8/4 10:48
*/
<!-- 页面 -->
<template>
  <div>
    <div class="ellipsisWrap flex propsSetting">
      <span class="setTitle">{{ title }}</span>
      <el-switch
          active-value="on"
          inactive-value="off"
          :value="enableValue"
          @change="changeEnable($event)"
          active-color="#4689F5"
          inactive-color="#DCDFE6">
      </el-switch>
    </div>
    <div v-if="isNeedRoadColor">
      <div class="setTitle">道路颜色</div>
      <c-color-picker
          size="small"
          show-alpha
          :value="roadColor"
          @change="(value) => changeStyles(value, 'Color')"
          :predefine="predefineColors">
      </c-color-picker>
    </div>
    <div v-if="isNeedColor">
      <div class="setTitle">{{ subtitle }}</div>
      <c-color-picker
          size="small"
          show-alpha
          :value="nameColor"
          @change="(value) => changeStyles(value, 'NameColor')"
          :predefine="predefineColors">
      </c-color-picker>
    </div>
    <div style="margin-top: 4px;" v-if="isNeedFontSize">
      <el-input-number
          controls-position="right"
          v-model="fontSize"
          @change="(value) => changeStyles(Number(value), 'NameFontSize')"/>
    </div>
  </div>
</template>

<script>
import { predefineColors } from '../../../constants/global';

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    },
    enableValue: { // 是否启用标识
      type: String,
      default: 'on'
    },
    fontSize: { // 字体大小
      type: Number,
      default: 16
    },
    nameColor: { // 字体颜色
      type: String,
      default: ''
    },
    roadColor: { // 道路颜色
      type: String,
      default: ''
    },
    isNeedFontSize: { // 是否需要字体大小
      type: Boolean,
      default: true
    },
    isNeedRoadColor: { // 是否需要字体大小
      type: Boolean,
      default: false
    },
    isNeedColor: { // 是否需要颜色
      type: Boolean,
      default: true
    },
    isNeedRailway: { // 是否需要字体大小
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      predefineColors
    };
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {
    changeEnable(v) {
      this.$emit('changeEnable', v);
    },
    changeStyles(v, key) {
      this.$emit('changeStyles', {
        value: v,
        key
      });
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.ellipsisWrap {
  justify-content: space-between;
  align-items: center;
}

.setTitle {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  text-align: left;
}

.flex {
  display: flex;
}

</style>
