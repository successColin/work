<template>
  <el-table-column
    v-on="$listeners"
    v-bind="$attrs"
    :sortable="false"
    resizable
    show-overflow-tooltip
    :prop="prop"
  >
    <div slot-scope="scope" class="compColumn font__ellipsis">
      <comp-item
        v-for="(item, i) in getArr(scope.row.index)"
        :key="i"
        :compObj="item"
        :triggerCompMap="triggerCompMap"
        class="m-r-4"
      ></comp-item>
    </div>
  </el-table-column>
</template>

<script>
export default {
  props: {
    prop: {
      type: String,
      default: '',
    },
    triggerCompMap: {
      type: Object,
    },
    tableData: {
      type: Array,
    },
  },
  data() {
    return {};
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    getArr(index) {
      const row = this.tableData[index];
      if (!row) {
        return [];
      }
      if (Array.isArray(row[this.prop])) {
        const tempArr = [];
        row[this.prop].forEach((item) => {
          tempArr.push(item.comp);
        });
        return tempArr;
      }
      return [row[this.prop]];
    },
  },
};
</script>

<style lang="scss" scoped>
.compColumn {
  display: flex;
  align-items: center;
}
</style>
