/**
* @name: index
* @author: DELL
* @date: 2021/12/30 17:19
* @description：index
* @update: 2021/12/30 17:19
*/
<!-- 页面 -->
<template>
  <div class="varManage">
    <div>
      <CButton type="primary" @click="add"><i class="el-icon-edit"></i> 新增</CButton>
    </div>
    <div class="dataListContent">
      <div class="thead">
        <div style="width: 40px;">序号</div>
        <div style="width: 35%;">变量名</div>
        <div style="width: 35%;">值</div>
        <div style="flex: 1">操作</div>
      </div>
      <div class="noData" v-if="!tableData.length">
        暂无数据
      </div>
      <div class="listWrap" v-for="(item, i) in tableData" :key="i">
        <div class="sno">{{ i + 1 }}</div>
        <div class="inner">
          <global-input v-model="item.name" ref="input" @blur="(v) => check(v.target.value, i)"></global-input>
        </div>
        <div class="inner">
          <global-input v-model="item.value" @blur="change"></global-input>
        </div>
        <div class="ope"><span class="icon-shanchu iconfont" @click="del(i)"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tableData: []
    };
  },

  components: {},

  computed: {},

  mounted() {
    this.tableData = this.value;
  },
  watch: {},
  methods: {
    add() {
      this.tableData.push({
        name: '',
        value: ''
      })
    },
    del(i) {
      this.tableData.splice(i, 1);
      this.$emit('change', this.tableData);
    },
    check(v, i) {
      const arr = this.tableData.filter((item) => item.name === v);
      if (arr.length > 1) {
        this.$message.error(`已经存在${v}变量，请重新填写!`);
        this.tableData[i].name = '';
        this.$refs.input[i].focus();
      }
      this.$emit('change', this.tableData);
    },
    change() {
      this.$emit('change', this.tableData);
    }
  },
  name: 'index'
};
</script>

<style lang='scss' scoped>
.varManage {
  width: 100%;
  height: auto;

  .dataListContent {
    width: 100%;
    min-height: 70px;

    .thead {
      height: 30px;
      display: flex;
      align-items: center;

      & > div {
        width: 25%;
        color: #FFFFFF;
      }
    }

    .listWrap {
      height: 30px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .sno {
        width: 40px;
        color: #FFFFFF;
      }

      .inner {
        width: 35%;
        padding-right: 10px;
        box-sizing: border-box;
      }

      .ope {
        flex: 1;

        .icon-shanchu {
          color: #FFFFFF;
          cursor: pointer;

          &:hover {
            color: #4689F5;
          }
        }
      }
      ::v-deep{
        .el-input__inner{
          padding: 0 5px;
        }
      }
    }

    .noData {
      color: #FFFFFF;
      text-align: center;
    }
  }
}
</style>
