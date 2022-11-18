<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    resizable
    show-overflow-tooltip
    :prop="prop"
  >
    <template slot-scope="scope">
      <div :class="['loginWay', wayType(scope.row[prop])]">
        {{ scope.row[prop] === 1 ? 'PC' : 'APP' }} 端
      </div>
    </template>
  </el-table-column>
</template>

<script>
export default {
  props: {
    // 当前作用的字段名
    prop: {
      type: String,
      default: ''
    }
  },
  computed: {
    wayType() {
      return function (val) {
        let way = '';
        if (val === 1) {
          way = 'pcWay';
        }
        if (val === 2) {
          way = 'appWay';
        }
        return way;
      };
    }
  }
};
</script>
<style lang='scss' scoped>
.loginWay {
  padding: 0 8px;
  border-radius: 4px;
  font-size: 14px;

  line-height: 24px;
  width: min-content;
}
.pcWay {
  background: #e5f0ff;
  color: #4689f5;
}
.appWay {
  background: #ffeaeb;
  color: #f6483e;
}
</style>
