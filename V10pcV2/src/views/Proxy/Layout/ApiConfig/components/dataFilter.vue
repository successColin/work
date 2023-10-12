/**
* @name: dataFilter
* @author: DELL
* @date: 2023/3/1 9:38
* @description：dataFilter
* @update: 2023/3/1 9:38
*/
<!-- 页面 -->
<template>
  <div class="dataFilter">
    <div class="dataFilter__header">
      <apiot-button @click="add">
        <i class="iconfont icon-xinzeng m-r-4"></i> 添加规则
      </apiot-button>
    </div>
    <div class="dataFilter__table">
      <el-table
          :border="false"
          :data="tableData"
          :show-header="false"
          style="width: 100%">
        <el-table-column
            prop="fieldName"
            label="字段名称"
        >
          <template slot-scope="scope">
            <el-select placeholder="请选择字段" v-model="scope.row.fieldName">
              <el-option
                  :label="name"
                  :value="name"
                  :key="name"
                  v-for="name in fieldArr"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
            prop="comparator"
            label="比较符">
          <template slot-scope="scope">
            <el-select placeholder="请选择比较符" v-model="scope.row.comparator">
              <el-option
                  :label="item.name"
                  :value="item.value"
                  :key="item.value"
                  v-for="item in comparatorArr"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
            prop="value"
            label="值">
          <template slot-scope="scope">
            <apiot-input placeholder="请输入值" v-model="scope.row.value"/>
          </template>
        </el-table-column>
        <el-table-column
            prop="relator"
            label="关系符">
          <template slot-scope="scope">
            <el-select placeholder="请选择连接符" v-model="scope.row.relator">
              <el-option
                  label="且"
                  value="1"
              >
              </el-option>
              <el-option
                  label="或"
                  value="2"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column
            prop="opea"
            width="30"
            label="操作">
          <template slot-scope="scope">
            <span class="iconfont icon-shanchu" @click="del(scope.row.key)"></span>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <el-empty :image="require('@/assets/img/nodata.png')" :image-size="120"></el-empty>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fieldArr: { // 字段列表
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tableData: [],
      comparatorArr: [
        {
          name: '等于',
          value: 1
        },
        {
          name: '不等于',
          value: 2
        },
        {
          name: '包含',
          value: 3
        },
        // {
        //   name: '介于',
        //   value: 4
        // },
        // {
        //   name: '在列表',
        //   value: 5
        // },
        // {
        //   name: '为空',
        //   value: 6
        // },
        {
          name: '大于',
          value: 7
        },
        {
          name: '大于等于',
          value: 8
        },
        {
          name: '小于',
          value: 9
        },
        {
          name: '小于等于',
          value: 10
        }
      ]
    };
  },

  components: {},

  computed: {},

  mounted() {
    // dataFilter
    this.tableData = this.value;
  },
  watch: {
    tableData: {
      deep: true,
      handler(v) {
        this.$emit('change', v);
      }
    }
  },
  methods: {
    del(key) {
      const i = this.tableData.findIndex((item) => item.key === key);
      if (i !== -1) {
        this.tableData.splice(i, 1);
      }
    },
    add() {
      const timesKey = new Date().getTime();
      this.tableData.push({
        relator: '1',
        value: '',
        comparator: 1,
        fieldName: '',
        key: timesKey
      });
    }
  },
  name: 'dataFilter',
};
</script>

<style lang='scss' scoped>
.dataFilter {
  width: 100%;

  .dataFilter__header {
    height: 42px;
    line-height: 42px;

    .icon-xinzeng {
      color: #4689F5;
    }
  }

  .dataFilter__table {
    .icon-shanchu {
      color: #BBC3CD;
      cursor: pointer;

      &:hover {
        color: #4689F5;
      }
    }
    ::v-deep {
      .el-table::before{
        display: none;
      }
      .el-table .cell{
        padding-left: 0;
        height: 40px;
        line-height: 40px;
      }
      .el-table th.is-leaf, .el-table td {
        border: none;
      }
      .el-select{
        width: 100%;
      }
    }
  }
}
</style>
