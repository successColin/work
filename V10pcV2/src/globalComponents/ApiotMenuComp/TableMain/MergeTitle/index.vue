<template>
  <el-table-column :label="configData.name">
    <component
      ref="column"
      :label-class-name="`${item.enableTableSearch ? 'hasFilter' : ''}`"
      v-for="(item, index) in configData.children"
      :key="`${item.name}_${index}`"
      :label="item.name"
      :fixed="item.fixed"
      :min-width="item.minWidth"
      :is="configData.children[index].tableCompName"
      :configData="item"
      v-bind="$attrs"
      v-on="$listeners"
    ></component>
  </el-table-column>
</template>

<script>
export default {
  name: '',
  props: {
    mergeObj: {
      type: Object,
    },
    configData: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  components: {},
};
</script>

<style lang="scss" scoped></style>
