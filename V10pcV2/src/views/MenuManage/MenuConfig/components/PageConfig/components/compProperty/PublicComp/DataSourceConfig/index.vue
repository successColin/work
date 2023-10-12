<template>
  <section>
    <el-form-item label="关联数据源">
      <el-select :value="1" placeholder="请选择数据源" :disabled="true">
        <el-option label="数据表" :value="1"></el-option>
      </el-select>
      <filterable-input
        class="m-t-8"
        :showInfo="relateObj.tableInfo"
        :dialogType="1"
        :disabled="true"
      ></filterable-input>
      <filterable-input
        class="m-t-10"
        ref="filterableInput"
        placeholder="请选择字段"
        :tableName="activeObj.dataSource.tableName"
        :showInfo="activeObj.dataSource"
        :disabled="activeObj.labelNotChange"
        :filterColumn="filterColumn"
        :dialogType="2"
        :notShowSys="notShowSys"
        :columnTypes="columnTypes"
        @selectRes="selectColumnRes"
      ></filterable-input>
    </el-form-item>
  </section>
</template>

<script>
export default {
  name: '',
  props: {
    fatherObj: {
      type: Object,
    },
    activeObj: {
      type: Object,
    },
    relateObj: {
      type: Object,
    },
    notShowSys: {
      type: Boolean,
      default: true,
    },
    // 字段类型集合
    columnTypes: {
      type: String,
      default: '',
    },
    isUser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  components: {},
  computed: {
    filterColumn() {
      if (this.isUser) {
        // 表格
        if (this.relateObj && this.relateObj.compName === 'TableMain') {
          return ['username', 'account', 'tombstone'];
        }
        // 表单
        if (this.relateObj && this.relateObj.compName === 'MenuMain') {
          return [
            'username',
            'account',
            'enabled',
            'icon',
            'user_state_dict',
            'tombstone',
          ];
        }
      }
      return [];
    },
  },
  methods: {
    // 字段选择结果
    selectColumnRes(table) {
      this.activeObj.dataSource.id = table.id;
      this.activeObj.dataSource.columnName = table.columnName;
      this.activeObj.dataSource.columnTypeDict = table.columnTypeDict;
      this.$emit('selectColumnRes', table);
    },
  },
};
</script>

<style lang="scss" scoped></style>
