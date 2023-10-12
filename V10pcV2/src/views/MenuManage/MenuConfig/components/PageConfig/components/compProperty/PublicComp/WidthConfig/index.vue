<template>
  <section>
    <el-form-item
      label="自定义最小宽度(单位%)"
      v-if="
        relateObj && ['TableMain', 'TreeTable'].includes(relateObj.compName)
      "
    >
      <el-input-number
        style="width: 100%"
        v-model.number="curMinWidth"
        :controls="false"
        :min="1"
        :max="25"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      label="最小宽度"
      v-if="
        relateObj && ['TableMain', 'TreeTable'].includes(relateObj.compName)
      "
    >
      <el-button-group>
        <el-button
          :class="[{ active: activeObj.tableWidth === '0.05' }]"
          @click="activeObj.tableWidth = '0.05'"
          >5%</el-button
        >
        <el-button
          :class="[{ active: activeObj.tableWidth === '0.1' }]"
          @click="activeObj.tableWidth = '0.1'"
          >10%</el-button
        >
        <el-button
          :class="[{ active: activeObj.tableWidth === '0.15' }]"
          @click="activeObj.tableWidth = '0.15'"
          >15%</el-button
        >
        <el-button
          :class="[{ active: activeObj.tableWidth === '0.2' }]"
          @click="activeObj.tableWidth = '0.2'"
          >20%</el-button
        >
        <el-button
          :class="[{ active: activeObj.tableWidth === '0.25' }]"
          @click="activeObj.tableWidth = '0.25'"
          >25%</el-button
        >
      </el-button-group>
    </el-form-item>
    <el-form-item label="宽度" v-else>
      <el-button-group>
        <el-button
          :class="[{ active: activeObj.width === '50%' }]"
          @click="activeObj.width = '50%'"
          >1/2</el-button
        >
        <el-button
          v-if="$route.query.isApp !== '1'"
          :class="[{ active: activeObj.width === '33.33%' }]"
          @click="activeObj.width = '33.33%'"
          >1/3</el-button
        >
        <el-button
          v-if="$route.query.isApp !== '1'"
          :class="[{ active: activeObj.width === '25%' }]"
          @click="activeObj.width = '25%'"
          >1/4</el-button
        >
        <el-button
          v-if="$route.query.isApp !== '1' && isShow"
          :class="[{ active: activeObj.width === '66.67%' }]"
          @click="activeObj.width = '66.67%'"
          >2/3</el-button
        >
        <el-button
          v-else
          :class="[{ active: activeObj.width === '20%' }]"
          @click="activeObj.width = '20%'"
          >1/5</el-button
        >
        <el-button
          v-if="$route.query.isApp !== '1' && isShow"
          :class="[{ active: activeObj.width === '75%' }]"
          @click="activeObj.width = '75%'"
          >3/4</el-button
        >
        <el-button
          v-else
          :class="[{ active: activeObj.width === '16.66%' }]"
          @click="activeObj.width = '16.66%'"
          >1/6</el-button
        >
        <el-button
          :class="[{ active: activeObj.width === '100%' }]"
          @click="activeObj.width = '100%'"
          >1/1</el-button
        >
      </el-button-group>
    </el-form-item>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    activeObj: {
      type: Object,
    },
    relateObj: {
      type: Object,
    },
    isShow: {
      type: Boolean,
    },
  },
  created() {
    if (this.activeObj.tableWidth) {
      this.curMinWidth = this.activeObj.tableWidth * 100;
    }
  },
  data() {
    return {
      curMinWidth: 10,
    };
  },
  components: {},
  watch: {
    curMinWidth(v) {
      if (v) {
        this.activeObj.tableWidth = `${v / 100}`;
      }
    },
    'activeObj.tableWidth': function (v) {
      if (v) {
        this.curMinWidth = v * 100;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
