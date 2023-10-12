/**
* @name: resHeadTab
* @author: DELL
* @date: 2023/2/23 19:19
* @description：resHeadTab
* @update: 2023/2/23 19:19
*/
<!-- 页面 -->
<template>
  <div class="resHead">
    <div class="resHead__add">
      <apiot-button @click="add"><i class="iconfont icon-xinzeng m-r-4"></i> 新增属性</apiot-button>
    </div>
    <div class="resHead__table">
      <DictValueTable
          ref="table"
          :variables="variables"
          :tableData.sync="tableData"/>
    </div>
  </div>
</template>

<script>
const DictValueTable = () => import('./dictValueTable');

export default {
  props: {
    variables: {
      type: Array,
      default() {
        return [];
      }
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      tableData: []
    };
  },

  components: {
    DictValueTable
  },

  computed: {},

  mounted() {
    const { commonApiHeader = {} } = this.info;
    try {
      const obj = JSON.parse(commonApiHeader.requestHead || '{}');
      this.tableData = Object.keys(obj).map((key, i) => ({ key, value: obj[key], sno: i }));
    } catch (e) {
      this.tableData = [];
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler(v) {
        const obj = {};
        v.forEach((item) => {
          const { key, value } = item;
          obj[key] = value;
        });
        this.info.commonApiHeader.requestHead = JSON.stringify(obj);
      }
    }
  },
  methods: {
    add() {
      this.$refs.table.addDictValue();
    }
  },
  name: 'resHeadTab',
};
</script>

<style lang='scss' scoped>
.resHead {
  width: 100%;
  height: 100%;
  position: absolute;

  .resHead__add {
    margin-bottom: 10px;

    .iconfont {
      color: #4689F5;
    }

    ::v-deep {
      .el-button span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
      }
    }
  }

  .resHead__table {
    width: 100%;
    height: calc(100% - 40px);
    box-sizing: border-box;
  }
}
</style>
