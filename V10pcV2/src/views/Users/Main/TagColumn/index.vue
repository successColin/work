<!--  -->
<template>
  <el-table-column v-on="$listeners" v-bind="$attrs" resizable>
    <template slot-scope="scope">
      <div class="onLine"
           :style="'background:'+ item.color"
           :key="item.name"
           v-for="item in scope.row.userLabel">
                    <span class="tagName">
                      {{ item.name || '' }}
                    </span>
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {
  },

  methods: {}
};
</script>

<style lang='scss' scoped>
.onLine {
  padding: 0 10px;
  display: inline-flex;
  margin-right: 4px;
  background: #E5F0FF;
  border-radius: 4px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4689F5;
  box-sizing: border-box;
  line-height: 24px;
}
.tagName{
  color: #fff;
}
</style>
